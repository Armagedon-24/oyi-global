"use client";

/**
 * KrimiScan Global — E-Dergi Görünümü
 * Bulguları dergi sayfaları halinde sunar: Kapak → İçindekiler → Makale sayfaları.
 * Sayfa geçişlerinde 3D sayfa çevirme (page-flip) animasyonu kullanır.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bookmark,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Fingerprint,
  Images as ImagesIcon,
  Loader2,
  ScanSearch,
  Sparkles,
  Star,
} from "lucide-react";
import { categoryLabel, getLanguage } from "@/lib/forensics-config";
import { imgProxyUrl, parseFindingImages } from "@/lib/image-utils";
import type { FindingItem } from "@/lib/types";
import { FullReadDialog } from "@/components/forensics/full-read-dialog";

const MAX_ARTICLES = 12;
const FLIP_MS = 1120;

/** Köşeden sürükleme durumu — sayfa parmağı izler */
interface DragState {
  dir: "next" | "prev";
  from: number;
  to: number;
  p: number; // 0..1 çevirme ilerlemesi
  settling: "commit" | "back" | null;
}

/** Sürükleme ilerlemesine göre yaprağın bükülmüş (esneyen) transform'u */
function leafTransform(ds: { dir: "next" | "prev"; p: number }): string {
  const bend = Math.sin(Math.PI * ds.p); // ortada en çok esner
  const angle = ds.dir === "next" ? -ds.p * 180 : -(1 - ds.p) * 180;
  const rz = (ds.dir === "next" ? 1 : -1) * bend * 2.8;
  const tx = (ds.dir === "next" ? 1 : -1) * bend * 0.5;
  const ty = -bend * 1.3;
  const sx = 1 - bend * 0.045;
  const sy = 1 + bend * 0.028;
  return `rotateY(${angle.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) translate3d(${tx.toFixed(2)}%, ${ty.toFixed(2)}%, 0) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
}

/** Sürüklemede dış yarı yaprağın faz farkıyla katlanması (kâğıt kırışması) */
function foldTransform(ds: { p: number }): string {
  const bend = Math.sin(Math.PI * ds.p);
  return `rotateY(${(-bend * 34).toFixed(2)}deg)`;
}

type MagPage =
  | { kind: "cover"; featured: FindingItem; secondary: FindingItem[]; totalCount: number }
  | { kind: "toc"; entries: { f: FindingItem; folio: number }[] }
  | { kind: "article"; f: FindingItem; folio: number; n: number }
  | { kind: "empty" };

interface MagazineViewProps {
  findings: FindingItem[];
  loading: boolean;
  scanning?: boolean;
  onStartScan?: () => void;
  onToggleBookmark: (f: FindingItem) => void;
}

function formatDate(s: string | null): string | null {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function parseKeywords(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, 5) : [];
  } catch {
    return [];
  }
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.replace(/\s+\S*$/, "") + "…";
}

/** Öne çıkan görseli döndürür (proxy adresiyle) */
function coverImage(f: FindingItem) {
  const imgs = parseFindingImages(f.images);
  return imgs.length > 0 ? imgs[0] : null;
}

export function MagazineView({
  findings,
  loading,
  scanning,
  onStartScan,
  onToggleBookmark,
}: MagazineViewProps) {
  const [page, setPage] = useState(0);
  const [flip, setFlip] = useState<{ dir: "next" | "prev"; from: number; to: number } | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [reading, setReading] = useState<FindingItem | null>(null);
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchX = useRef<number | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const leafRef = useRef<HTMLDivElement | null>(null);
  const foldRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const dragStartX = useRef(0);
  const dragWidth = useRef(640);
  const dragMoved = useRef(false);
  const lastDragAt = useRef(0);

  // ---- Sayı bilgisi (dergi künyesi) ----
  const issue = useMemo(() => {
    const now = new Date();
    const month = now.toLocaleDateString("tr-TR", { month: "long" }).toLocaleUpperCase("tr-TR");
    const no = (now.getFullYear() - 2024) * 12 + now.getMonth() + 1;
    return { month, no, year: now.getFullYear() };
  }, []);

  // ---- Sayfa modeli ----
  const articles = useMemo(() => findings.slice(0, MAX_ARTICLES), [findings]);

  const pages = useMemo<MagPage[]>(() => {
    if (articles.length === 0) return [{ kind: "empty" }];
    let featIdx = articles.findIndex((a) => coverImage(a) !== null);
    if (featIdx < 0) featIdx = 0;
    const featured = articles[featIdx];
    const secondary = articles.filter((a) => a.id !== featured.id).slice(0, 3);
    const tocEntries = articles.map((f, i) => ({ f, folio: i + 2 }));
    return [
      { kind: "cover", featured, secondary, totalCount: findings.length },
      { kind: "toc", entries: tocEntries },
      ...articles.map((f, i) => ({ kind: "article" as const, f, folio: i + 2, n: i + 1 })),
    ];
  }, [articles, findings.length]);

  const totalPages = pages.length;

  // Filtre değişince sayfa taşarsa başa dön
  useEffect(() => {
    if (page > totalPages - 1) setPage(Math.max(0, totalPages - 1));
  }, [totalPages, page]);

  useEffect(
    () => () => {
      if (flipTimer.current) clearTimeout(flipTimer.current);
    },
    []
  );

  // ---- Sayfa çevirme motoru ----
  const goTo = useCallback(
    (target: number, dir?: "next" | "prev") => {
      if (flip || dragRef.current) return;
      const clamped = Math.max(0, Math.min(totalPages - 1, target));
      if (clamped === page) return;
      const d: "next" | "prev" = dir ?? (clamped > page ? "next" : "prev");
      setFlip({ dir: d, from: page, to: clamped });
      setPage(clamped);
      if (flipTimer.current) clearTimeout(flipTimer.current);
      flipTimer.current = setTimeout(() => setFlip(null), FLIP_MS + 40);
    },
    [flip, page, totalPages]
  );

  const goNext = useCallback(() => goTo(page + 1, "next"), [goTo, page]);
  const goPrev = useCallback(() => goTo(page - 1, "prev"), [goTo, page]);

  // Klavye ile gezinme (form alanları hariç)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag && ["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if (reading || flip || dragRef.current) return;
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, reading, flip]);

  // Dokunmatik kaydırma
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (Date.now() - lastDragAt.current < 500) return; // köşe sürüklemesiyle çakışmasın
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (delta < -48) goNext();
    else if (delta > 48) goPrev();
  };

  // ---- Köşeden tutup sürükleyerek çevirme (sayfa el ile çevriliyormuş hissi) ----
  const onEarPointerDown = (dir: "next" | "prev") => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (flip || dragRef.current || reading || loading) return;
    if (dir === "next" ? page >= totalPages - 1 : page === 0) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* capture opsiyonel */
    }
    const frame = frameRef.current;
    dragWidth.current = frame ? frame.getBoundingClientRect().width : 640;
    dragStartX.current = e.clientX;
    dragMoved.current = false;
    lastDragAt.current = Date.now();
    const ds: DragState = { dir, from: page, to: dir === "next" ? page + 1 : page - 1, p: 0, settling: null };
    dragRef.current = ds;
    setDrag(ds);
  };

  const dragging = drag !== null;
  useEffect(() => {
    if (!dragging) return;
    let raf = 0;
    let pendingX = 0;
    const applyMove = () => {
      raf = 0;
      const ds = dragRef.current;
      if (!ds || ds.settling) return;
      const raw = ds.dir === "next" ? dragStartX.current - pendingX : pendingX - dragStartX.current;
      if (Math.abs(raw) > 6) dragMoved.current = true;
      const p = Math.max(0, Math.min(1, raw / (dragWidth.current * 0.72)));
      if (p === ds.p) return;
      const next = { ...ds, p };
      dragRef.current = next;
      setDrag(next);
    };
    const onMove = (e: PointerEvent) => {
      pendingX = e.clientX;
      if (!raf) raf = requestAnimationFrame(applyMove);
    };
    const finish = (el: HTMLDivElement | null, ds: DragState, commit: boolean) => {
      // Hareketsiz bırakma = tıklama; çevirme işini click olayına bırak
      if (!dragMoved.current) {
        dragRef.current = null;
        setDrag(null);
        return;
      }
      lastDragAt.current = Date.now();
      const settled: DragState = { ...ds, settling: commit ? "commit" : "back" };
      dragRef.current = settled;
      setDrag(settled);
      let fired = false;
      const done = () => {
        if (fired) return;
        fired = true;
        if (commit) setPage(ds.to);
        setDrag(null);
        dragRef.current = null;
      };
      if (!el) {
        done();
        return;
      }
      const current = leafTransform(ds);
      let kf: Keyframe[];
      let dur: number;
      if (commit) {
        dur = 400;
        kf =
          ds.dir === "next"
            ? [
                { transform: current, offset: 0 },
                { transform: "rotateY(-169deg) rotateZ(1.5deg) scale(0.99, 1.012)", offset: 0.55 },
                { transform: "rotateY(-181.5deg) rotateZ(0deg)", offset: 0.88 },
                { transform: "rotateY(-180deg) rotateZ(0deg) translate3d(0,0,0) scale(1,1)", offset: 1 },
              ]
            : [
                { transform: current, offset: 0 },
                { transform: "rotateY(-8.5deg) rotateZ(-1.5deg) scale(0.99, 1.012)", offset: 0.55 },
                { transform: "rotateY(1.5deg) rotateZ(0deg)", offset: 0.88 },
                { transform: "rotateY(0deg) rotateZ(0deg) translate3d(0,0,0) scale(1,1)", offset: 1 },
              ];
      } else {
        dur = 520;
        kf =
          ds.dir === "next"
            ? [
                { transform: current, offset: 0 },
                { transform: "rotateY(7deg) rotateZ(-1.6deg)", offset: 0.55 },
                { transform: "rotateY(-2.5deg) rotateZ(0.6deg)", offset: 0.82 },
                { transform: "rotateY(0deg) rotateZ(0deg) translate3d(0,0,0) scale(1,1)", offset: 1 },
              ]
            : [
                { transform: current, offset: 0 },
                { transform: "rotateY(-187deg) rotateZ(1.6deg)", offset: 0.55 },
                { transform: "rotateY(-177.5deg) rotateZ(-0.6deg)", offset: 0.82 },
                { transform: "rotateY(-180deg) rotateZ(0deg) translate3d(0,0,0) scale(1,1)", offset: 1 },
              ];
      }
      try {
        const anim = el.animate(kf, {
          duration: dur,
          easing: "cubic-bezier(0.34, 0.9, 0.34, 1)",
          fill: "forwards",
        });
        anim.finished.then(done).catch(done);
      } catch {
        done();
      }
      // Dış yarı (katlama) yaprakla birlikte eşzamanlı oturur — kâğıt bükülmesi
      const foldEl = foldRef.current;
      if (foldEl) {
        const foldCurrent = foldTransform(ds);
        const foldKf: Keyframe[] = commit
          ? [
              { transform: foldCurrent, offset: 0 },
              { transform: "rotateY(-15deg)", offset: 0.5 },
              { transform: "rotateY(0deg)", offset: 1 },
            ]
          : [
              { transform: foldCurrent, offset: 0 },
              { transform: "rotateY(-24deg)", offset: 0.5 },
              { transform: "rotateY(0deg)", offset: 1 },
            ];
        try {
          foldEl.animate(foldKf, {
            duration: dur,
            easing: "cubic-bezier(0.34, 0.9, 0.34, 1)",
            fill: "forwards",
          });
        } catch {
          /* katlama animasyonu opsiyonel */
        }
      }
    };
    const onUp = () => {
      const ds = dragRef.current;
      if (!ds || ds.settling) return;
      finish(leafRef.current, ds, ds.p >= 0.34);
    };
    const onCancel = () => {
      const ds = dragRef.current;
      if (!ds || ds.settling) return;
      finish(leafRef.current, ds, false);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [dragging]);

  // ---- Sayfa etiketi ----
  const pageLabel = useMemo(() => {
    const p = pages[page];
    if (!p) return "";
    if (p.kind === "cover") return "Kapak";
    if (p.kind === "toc") return "İçindekiler";
    if (p.kind === "empty") return "Boş Sayı";
    return `Sayfa ${p.folio}`;
  }, [pages, page]);

  // ---- Çevirme/sürükleme sırasında sahnede duracak sayfa ----
  const staticIndex = drag
    ? drag.dir === "next"
      ? drag.to
      : drag.from
    : flip
      ? flip.dir === "next"
        ? flip.to
        : flip.from
      : page;
  const leafIndex = drag
    ? drag.dir === "next"
      ? drag.from
      : drag.to
    : flip
      ? flip.dir === "next"
        ? flip.from
        : flip.to
      : -1;

  // ================= SAYFA ŞABLONLARI =================

  const renderRunningHead = (center: string, folio?: number) => (
    <div className="flex items-center justify-between gap-3 border-b border-stone-900/20 pb-1.5 text-[9px] uppercase tracking-[0.24em] text-stone-600 sm:text-[10px]">
      <span className="mag-serif font-bold tracking-[0.18em] text-stone-800">KRİMİSCAN GLOBAL</span>
      <span className="min-w-0 flex-1 truncate text-center">{center}</span>
      <span className="mag-serif">{folio ?? ""}</span>
    </div>
  );

  const renderStars = (importance: number, size = "h-2.5 w-2.5") => (
    <span className="inline-flex items-center gap-0.5" title={`Önem puanı: ${importance}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < importance ? "fill-amber-700 text-amber-700" : "text-stone-400"}`}
        />
      ))}
    </span>
  );

  const renderCover = (p: Extract<MagPage, { kind: "cover" }>) => {
    const featImg = coverImage(p.featured);
    return (
      <div className="mag-page-content flex h-full flex-col px-4 pb-4 pt-4 sm:px-7 sm:pb-6 sm:pt-6">
        {/* Üst şerit */}
        <div className="flex items-center justify-between border-b border-stone-900/25 pb-1.5 text-[8px] uppercase tracking-[0.2em] text-stone-700 sm:text-[9px]">
          <span>Adli Bilimler & Olay Yeri İncelemesi</span>
          <span className="hidden sm:inline">Türkiyenin Küresel İzleme Dergisi</span>
          <span>{issue.year}</span>
        </div>

        {/* Ana manşet */}
        <h1 className="mag-serif mt-2 text-[clamp(1.9rem,6vw,3.1rem)] font-black leading-[0.95] tracking-tight text-stone-900">
          KRİMİSCAN <span className="text-amber-700">GLOBAL</span>
        </h1>
        <div className="mt-1.5 flex items-center justify-between border-y-2 border-stone-900/80 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-stone-800 sm:text-[10px]">
          <span>
            Sayı {issue.no} · {issue.month} {issue.year}
          </span>
          <span className="text-red-800">{p.totalCount} konu tarandı</span>
          <span>Ücretsiz E-Dergi</span>
        </div>

        {/* Kapak görseli — tıklayınca tam makale okuma penceresi */}
        <button
          type="button"
          onClick={() => setReading(p.featured)}
          className="group relative mt-3 block w-full overflow-hidden rounded-sm border border-stone-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          title="Kapak haberini Tam Oku ile oku"
        >
          {featImg ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imgProxyUrl(featImg.url)}
              alt={featImg.alt || p.featured.trTitle}
              className="h-[clamp(140px,26vh,270px)] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
          ) : (
            <div className="flex h-[clamp(120px,20vh,220px)] w-full items-center justify-center bg-stone-900/[0.06]">
              <Fingerprint className="h-12 w-12 text-stone-400" />
            </div>
          )}
          <span className="mag-tag-red absolute left-2 top-2">Kapak Haberi</span>
        </button>

        {/* Kapak başlığı */}
        <h2 className="mag-serif mt-3 line-clamp-3 text-[clamp(1.05rem,2.9vw,1.65rem)] font-bold leading-tight text-stone-900">
          {p.featured.trTitle}
        </h2>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-stone-700 sm:text-[13px]">
          {clip(p.featured.trSummary, 210)}
        </p>

        {/* Yan başlıklar şeridi */}
        <div className="mt-auto grid grid-cols-3 gap-3 border-t border-stone-900/20 pt-3">
          {p.secondary.map((s) => {
            const sImg = coverImage(s);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setReading(s)}
                className="group text-left focus:outline-none"
                title="Tam Oku ile aç"
              >
                <span className="mag-kicker block !text-[8px] sm:!text-[9px]">
                  {categoryLabel(s.category).split(" ")[0]}
                </span>
                <span className="mag-serif mt-1 line-clamp-3 block text-[11px] font-semibold leading-snug text-stone-900 group-hover:text-amber-800 sm:text-[12.5px]">
                  {s.trTitle}
                </span>
                {sImg && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imgProxyUrl(sImg.url)}
                    alt=""
                    loading="lazy"
                    className="mt-1 h-10 w-full rounded-sm object-cover opacity-90 group-hover:opacity-100 sm:h-12"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderToc = (p: Extract<MagPage, { kind: "toc" }>) => (
    <div className="mag-page-content flex h-full flex-col px-4 pb-4 pt-4 sm:px-7 sm:pb-6 sm:pt-6">
      {renderRunningHead("Bu Sayıda")}
      <div className="mt-3 flex items-baseline justify-between">
        <h2 className="mag-serif text-[clamp(1.4rem,4vw,2.2rem)] font-black tracking-tight text-stone-900">
          İçindekiler
        </h2>
        <span className="text-[9px] uppercase tracking-[0.2em] text-stone-600">
          Sayı {issue.no} · {issue.month}
        </span>
      </div>
      <hr className="mag-rule mt-2" />

      <div className="no-scrollbar mt-1 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {p.entries.map((e, i) => (
          <button
            key={e.f.id}
            type="button"
            onClick={() => goTo(i + 2, "next")}
            className="group flex w-full items-baseline gap-2.5 rounded-sm border-b border-dotted border-stone-500/50 py-1.5 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-700"
          >
            <span className="mag-serif w-7 shrink-0 text-right text-base font-bold text-amber-800 sm:text-lg">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[8px] font-bold uppercase tracking-[0.18em] text-red-900/80 sm:text-[9px]">
                {categoryLabel(e.f.category)}
              </span>
              <span className="mag-serif line-clamp-1 block text-[13px] font-semibold leading-snug text-stone-900 group-hover:text-amber-800 sm:text-[15px]">
                {e.f.trTitle}
              </span>
            </span>
            <span className="mag-serif shrink-0 text-sm font-bold text-stone-700 group-hover:text-amber-800">
              {e.folio}
            </span>
          </button>
        ))}
      </div>

      {/* Künye */}
      <div className="mt-3 rounded-sm border border-stone-900/25 bg-stone-900/[0.05] p-2.5 text-[9.5px] leading-relaxed text-stone-700 sm:text-[10.5px]">
        <span className="font-bold uppercase tracking-[0.16em] text-stone-900">Künye — </span>
        KrimiScan Global E-Dergi. {issue.year} yılı yayını; dünya genelinde{" "}
        <b>{findings.length}</b> konu derlenmiş, yapay zekâ ile Türkçeye çevrilmiş ve önem
        puanlaması yapılmıştır. Yayın Türü: Sürekli Güncellenen Dijital Baskı.
      </div>
    </div>
  );

  const renderArticle = (p: Extract<MagPage, { kind: "article" }>) => {
    const f = p.f;
    const img = coverImage(f);
    const keywords = parseKeywords(f.keywords);
    const langInfo = getLanguage(f.language);
    const date = formatDate(f.publishedDate);
    const body = f.trSummary && f.trSummary.trim().length > 0
      ? clip(f.trSummary.trim(), 860)
      : "Bu haber için Türkçe özet metni bu baskıda yer almıyor. Derin analiz panelinden yapay zekâ değerlendirmesini okuyabilir veya orijinal kaynağa gidebilirsiniz.";

    return (
      <div className="mag-page-content flex h-full flex-col px-4 pb-4 pt-4 sm:px-7 sm:pb-5 sm:pt-5">
        {renderRunningHead(categoryLabel(f.category), p.folio)}

        {/* Kicker satırı */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="mag-kicker">{categoryLabel(f.category)}</span>
          {f.isNewTech && (
            <span className="mag-tag-red inline-flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" /> Yenilik
            </span>
          )}
          {renderStars(f.importance)}
          {parseFindingImages(f.images).length > 1 && (
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-stone-600">
              <ImagesIcon className="h-3 w-3" /> {parseFindingImages(f.images).length} görsel
            </span>
          )}
        </div>

        {/* Başlık + spot */}
        <h2 className="mag-serif mt-1.5 line-clamp-3 text-[clamp(1.15rem,3.2vw,1.85rem)] font-bold leading-[1.12] tracking-tight text-stone-900">
          {f.trTitle}
        </h2>

        {/* Künye satırı (byline) */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] uppercase tracking-[0.14em] text-stone-600 sm:text-[10px]">
          <span className="font-bold text-stone-900">{f.sourceName}</span>
          <span aria-hidden>·</span>
          <span>{langInfo ? `${langInfo.flag} ${langInfo.name}` : f.language.toUpperCase()}</span>
          {date && (
            <>
              <span aria-hidden>·</span>
              <span>{date}</span>
            </>
          )}
          <span aria-hidden>·</span>
          <span className="italic normal-case tracking-normal text-stone-600">
            yapay zekâ ile Türkçeleştirilmiştir
          </span>
        </div>

        {/* Makale görseli */}
        {img && (
          <figure className="mt-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgProxyUrl(img.url)}
              alt={img.alt || f.trTitle}
              loading="lazy"
              className="h-[clamp(110px,21vh,215px)] w-full border border-stone-900/25 object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            {(img.alt || f.originalTitle) && (
              <figcaption className="mag-serif mt-1 truncate text-[9.5px] italic text-stone-600 sm:text-[10.5px]">
                {img.alt || f.originalTitle}
              </figcaption>
            )}
          </figure>
        )}

        {/* Gövde — iki kolon, baş harf süslü */}
        <div className="mag-body mt-2.5 flex min-h-0 flex-1 flex-col overflow-hidden">
          <p className="mag-cols mag-serif columns-1 text-[11.5px] leading-[1.62] text-stone-800 sm:columns-2 sm:text-[12.5px]">
            <span className="mag-dropcap block">{body}</span>
          </p>
          {(f.trSummary?.trim().length ?? 0) > 860 && (
            <button
              type="button"
              onClick={() => setReading(f)}
              className="mag-serif mx-auto mt-1 block text-[10px] italic text-amber-800 underline underline-offset-2 transition-colors hover:text-amber-950 sm:text-[10.5px]"
            >
              Metnin tamamı bu sayfaya sığmadı — Tam Oku ile büyük açın →
            </button>
          )}
          {/* Baskı sonu işareti */}
          <div className="mt-auto flex items-center justify-center gap-2 pt-2 text-stone-500" aria-hidden>
            <span className="h-px w-10 bg-stone-500/50" />
            <span className="text-[10px]">◆</span>
            <span className="h-px w-10 bg-stone-500/50" />
          </div>
          {/* Kişisel not — kenar notu */}
          {f.notes && (
            <div className="mt-2 rounded-sm border-l-2 border-amber-700 bg-amber-100/50 px-2.5 py-1.5 text-[10.5px] italic leading-snug text-stone-800">
              <b className="not-italic">Okur Notu:</b> {clip(f.notes, 160)}
            </div>
          )}
        </div>

        {/* Anahtar kavramlar */}
        {keywords.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[8.5px] font-bold uppercase tracking-[0.2em] text-stone-600">
              Anahtar:
            </span>
            {keywords.map((kw, i) => (
              <span
                key={i}
                className="rounded-sm border border-stone-900/25 px-1.5 py-0.5 text-[9px] font-medium text-stone-700 sm:text-[9.5px]"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Sayfa içi eylemler */}
        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-stone-900/20 pt-2.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setReading(f)}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-stone-900 px-3 py-[5px] text-[11px] font-bold text-stone-900 transition-colors hover:bg-stone-900 hover:text-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              title="Makalenin tamamını büyük okuma penceresinde aç"
            >
              <BookOpenText className="h-3.5 w-3.5" />
              Tam Oku
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleBookmark(f)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-sm border px-2.5 text-[11px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 ${
                f.bookmarked
                  ? "border-amber-700/60 bg-amber-100/60 text-amber-800"
                  : "border-stone-900/25 text-stone-700 hover:bg-stone-900/10"
              }`}
              title={f.bookmarked ? "Yer iminden çıkar" : "Yer imine ekle"}
            >
              <Bookmark className={`h-3.5 w-3.5 ${f.bookmarked ? "fill-amber-700" : ""}`} />
              <span className="hidden sm:inline">{f.bookmarked ? "İşaretli" : "İşaretle"}</span>
            </button>
            <a
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-stone-900/25 px-2.5 text-[11px] font-semibold text-stone-700 transition-colors hover:bg-stone-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              title="Orijinal makaleyi aç"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Kaynak</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderEmpty = () => (
    <div className="mag-page-content flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="rounded-full border border-stone-900/25 p-5">
        <Fingerprint className="h-10 w-10 text-stone-500" />
      </div>
      <h2 className="mag-serif text-2xl font-black tracking-tight text-stone-900">
        Bu Sayı Henüz Boş
      </h2>
      <p className="max-w-sm text-[13px] leading-relaxed text-stone-700">
        Küresel taramayı başlattığınızda dünyanın {""}
        dillerindeki olay yeri inceleme gelişmeleri toplanır, Türkçeleştirilir ve bu derginin
        sayfalarına yerleşir.
      </p>
      {onStartScan && (
        <button
          type="button"
          onClick={onStartScan}
          disabled={scanning}
          className="inline-flex items-center gap-2 rounded-sm bg-stone-900 px-5 py-2.5 text-sm font-bold text-amber-50 transition-colors hover:bg-stone-800 disabled:opacity-60"
        >
          {scanning ? (
            <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
          ) : (
            <ScanSearch className="h-4 w-4 text-amber-300" />
          )}
          {scanning ? "Tarama sürüyor…" : "İlk Taramayı Başlat"}
        </button>
      )}
    </div>
  );

  const renderPageInner = (p: MagPage) => {
    switch (p.kind) {
      case "cover":
        return renderCover(p);
      case "toc":
        return renderToc(p);
      case "article":
        return renderArticle(p);
      case "empty":
        return renderEmpty();
    }
  };

  const renderLoadingPage = () => (
    <div className="flex h-full flex-col gap-3 px-7 pb-6 pt-6">
      <div className="h-3 w-1/3 animate-pulse rounded bg-stone-900/15" />
      <div className="h-8 w-3/4 animate-pulse rounded bg-stone-900/15" />
      <div className="h-40 w-full animate-pulse rounded bg-stone-900/10" />
      <div className="h-3 w-full animate-pulse rounded bg-stone-900/10" />
      <div className="h-3 w-full animate-pulse rounded bg-stone-900/10" />
      <div className="h-3 w-5/6 animate-pulse rounded bg-stone-900/10" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-stone-900/10" />
    </div>
  );

  // ================= SAHNE =================

  return (
    <section className="relative overflow-x-clip" aria-label="KrimiScan Global e-dergi">
      {/* Üst kontrol şeridi */}
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-1 pb-3">
        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-400">
          <Fingerprint className="h-4 w-4 shrink-0 text-amber-400" />
          <span className="truncate">
            <b className="text-slate-200">E-Dergi Baskısı</b>
            <span className="hidden sm:inline"> · {findings.length} konu · sayfaları sağ alt köşedeki kulaktan tutup çevirebilir, kenarlara tıklayabilir veya ← → tuşlarını kullanabilirsiniz</span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={goPrev}
            disabled={page === 0 || !!flip || !!drag}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Önceki sayfa"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="mag-serif min-w-[86px] text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200/90">
            {pageLabel}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={page >= totalPages - 1 || !!flip || !!drag}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Sonraki sayfa"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sahne — koyu masa üzerinde krem kâğıt */}
      <div className="mx-auto w-full max-w-3xl px-1">
        <div
          ref={frameRef}
          className={`mag-frame relative h-[min(76vh,840px)] min-h-[540px] w-full sm:aspect-[3/4] sm:h-auto sm:max-h-[840px] sm:w-auto sm:min-w-0 sm:mx-auto ${
            drag ? "mag-dragging" : ""
          } ${flip ? (flip.dir === "next" ? "mag-flipping" : "mag-flipping-prev") : ""}`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Alt statik sayfa */}
          <div className="mag-page absolute inset-0 z-10" key={`static-${staticIndex}`}>
            {loading
              ? renderLoadingPage()
              : staticIndex >= 0 && staticIndex < totalPages
                ? renderPageInner(pages[staticIndex])
                : renderEmpty()}
          </div>

          {/* Çevirme gölgesi */}
          {flip && <div className="mag-underglow active" />}

          {/* Hedef sayfada yönü izleyen gölge süpürmesi */}
          {flip && (
            <div className={`mag-under-sweep ${flip.dir === "next" ? "leaf-sweep-next" : "leaf-sweep-prev"}`} />
          )}

          {/* Sürükleme gölgesi — bükülmeyle yoğunlaşır */}
          {drag && (
            <div
              className="mag-underglow"
              style={{
                opacity: drag.settling ? 0 : Math.sin(Math.PI * drag.p) * 0.9,
                transition: "opacity 0.35s ease",
              }}
            />
          )}

          {/* Çevrilen yaprak (tuş / klavye / kenar tıklaması) — iki panelli:
              sırt yarısı sabit, dış yarısı faz farkıyla katlanıp esner */}
          {flip && leafIndex >= 0 && leafIndex < totalPages && (
            <div className={`mag-leaf ${flip.dir === "next" ? "leaf-next" : "leaf-prev"}`}>
              <div className="mag-leaf-face mag-leaf-front">
                <div className="mag-page absolute inset-0">{renderPageInner(pages[leafIndex])}</div>
                <div className="mag-leaf-shade" />
              </div>
              <div className="mag-leaf-face mag-leaf-back">
                <div className="mag-leaf-shade" />
              </div>
              <div className="mag-fold">
                <div className="mag-fold-face mag-fold-front">
                  <div className="mag-fold-content">
                    <div className="mag-page absolute inset-0">{renderPageInner(pages[leafIndex])}</div>
                  </div>
                  <div className="mag-fold-crease" />
                  <div className="mag-corner-curl" />
                </div>
                <div className="mag-fold-face mag-fold-back">
                  <div className="mag-fold-crease back" />
                </div>
              </div>
            </div>
          )}

          {/* Sürükleme yaprağı — açı parmağı izler, dış yarı kâğıt gibi kırışır */}
          {drag && leafIndex >= 0 && leafIndex < totalPages && (
            <div className="mag-leaf" ref={leafRef} style={{ transform: leafTransform(drag) }}>
              <div className="mag-leaf-face mag-leaf-front">
                <div className="mag-page absolute inset-0">{renderPageInner(pages[leafIndex])}</div>
                <div className="mag-leaf-shade" />
              </div>
              <div className="mag-leaf-face mag-leaf-back">
                <div className="mag-leaf-shade" />
              </div>
              <div className="mag-fold" ref={foldRef} style={{ transform: foldTransform(drag) }}>
                <div className="mag-fold-face mag-fold-front">
                  <div className="mag-fold-content">
                    <div className="mag-page absolute inset-0">{renderPageInner(pages[leafIndex])}</div>
                  </div>
                  <div className="mag-fold-crease" />
                  <div className="mag-corner-curl" style={{ opacity: Math.sin(Math.PI * drag.p) }} />
                </div>
                <div className="mag-fold-face mag-fold-back">
                  <div className="mag-fold-crease back" />
                </div>
              </div>
            </div>
          )}

          {/* Kenar tıklama bölgeleri (çevirme kısayolu) */}
          {!loading && !flip && !drag && (
            <>
              <button
                type="button"
                onClick={goPrev}
                disabled={page === 0}
                className="absolute bottom-[18%] left-0 top-0 z-20 w-[8%] cursor-w-resize rounded-l-md focus:outline-none disabled:cursor-default"
                aria-label="Önceki sayfaya çevir"
              />
              <button
                type="button"
                onClick={goNext}
                disabled={page >= totalPages - 1}
                className="absolute bottom-[18%] right-0 top-0 z-20 w-[8%] cursor-e-resize rounded-r-md focus:outline-none disabled:cursor-default"
                aria-label="Sonraki sayfaya çevir"
              />
            </>
          )}

          {/* Köşe tutamakları — kulaktan tutup çekince sayfa el ile çevriliyormuş gibi döner */}
          {!loading && !flip && !drag && (
            <>
              {page < totalPages - 1 && (
                <button
                  type="button"
                  className="mag-ear mag-ear-right"
                  onPointerDown={onEarPointerDown("next")}
                  onClick={() => {
                    if (Date.now() - lastDragAt.current < 600) return;
                    goNext();
                  }}
                  aria-label="Sayfayı sağ alt köşeden tutup çevir"
                  title="Sağ alt köşeden tutup çevir"
                >
                  <span className="mag-ear-fold" />
                </button>
              )}
              {page > 0 && (
                <button
                  type="button"
                  className="mag-ear mag-ear-left"
                  onPointerDown={onEarPointerDown("prev")}
                  onClick={() => {
                    if (Date.now() - lastDragAt.current < 600) return;
                    goPrev();
                  }}
                  aria-label="Sayfayı sol alt köşeden tutup çevir"
                  title="Sol alt köşeden tutup çevir"
                >
                  <span className="mag-ear-fold" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Alt ilerleme çubuğu */}
        <div className="mx-auto mt-4 flex w-full max-w-3xl items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: `${((page + 1) / totalPages) * 100}%` }}
            />
          </div>
          <span className="shrink-0 text-[11px] tabular-nums text-slate-400">
            {page + 1} / {totalPages}
          </span>
        </div>
      </div>

      {/* Tam Oku — makalenin tamamı büyük okuma penceresinde */}
      {reading && (
        <FullReadDialog
          finding={findings.find((x) => x.id === reading.id) ?? reading}
          onClose={() => setReading(null)}
          onToggleBookmark={onToggleBookmark}
        />
      )}
    </section>
  );
}
