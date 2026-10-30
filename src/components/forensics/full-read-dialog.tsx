"use client";

/**
 * Tam Oku — makalenin TAMAMINI büyük okuma penceresinde açar.
 * Açılışta /api/full-article çağrılır: makale orijinal kaynağından okunur,
 * Türkçeye çevrilir ve dergi sayfası dizgisinde sunulur (Derin Analiz gibi
 * canlı getirme + önbellek akışı). Kaynak okunamazsa kayıt özetine düşer.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  ExternalLink,
  FileText,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Star,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { categoryLabel, getLanguage } from "@/lib/forensics-config";
import { imgProxyUrl, type ArticleImage } from "@/lib/image-utils";
import type { FindingItem } from "@/lib/types";

interface FullReadDialogProps {
  finding: FindingItem;
  onClose: () => void;
  onToggleBookmark: (f: FindingItem) => void;
}

interface FullArticleState {
  paragraphs: string[];
  wordCount: number;
  translated: boolean;
  cached: boolean;
}

interface CommentItem {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

const LOADING_PHASES = [
  "Sayfa orijinal kaynağından okunuyor…",
  "Makale metni yapıştırılıyor…",
  "Türkçeye çevriliyor…",
  "Sayfa dizgiye hazırlanıyor…",
];

function formatDate(s: string | null): string | null {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function formatCommentDate(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FullReadDialog({
  finding,
  onClose,
  onToggleBookmark,
}: FullReadDialogProps) {
  const [zoom, setZoom] = useState<{ url: string; alt: string } | null>(null);
  const [full, setFull] = useState<FullArticleState | null>(null);
  const [images, setImages] = useState<ArticleImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0); // okuma ilerlemesi (kurdele)

  const langInfo = getLanguage(finding.language);
  const date = formatDate(finding.publishedDate);
  const keywords = useMemo(() => {
    try {
      const a = JSON.parse(finding.keywords);
      return Array.isArray(a) ? (a as string[]) : [];
    } catch {
      return [];
    }
  }, [finding.keywords]);

  // Kayıt özeti — tam makale okunamazsa yedek metin
  const fallbackParagraphs = useMemo(() => {
    const t = (finding.trSummary ?? "").trim();
    if (!t) return [];
    return t.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  }, [finding.trSummary]);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % LOADING_PHASES.length), 3200);
    return () => clearInterval(t);
  }, [loading]);

  const fetchArticle = (force = false) => {
    setLoading(true);
    setNotice(null);
    fetch("/api/full-article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: finding.id, force }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.paragraphs) && data.paragraphs.length > 0) {
          setFull({
            paragraphs: data.paragraphs,
            wordCount: Number(data.wordCount) || 0,
            translated: Boolean(data.translated),
            cached: Boolean(data.cached),
          });
          if (Array.isArray(data.images) && data.images.length > 0) setImages(data.images);
          setNotice(null);
        } else {
          // Kaynak okunamadı — kayıt özetiyle okunmaya devam
          setFull(null);
          setNotice(
            data.message ||
              (data.error === "unreachable"
                ? "Makalenin tam metni kaynağından okunamadı (sayfa erişime kapı olabilir)."
                : "Tam makale şu anda getirilemedi.")
          );
        }
      })
      .catch(() => {
        setFull(null);
        setNotice("Bağlantı hatası — tam makale getirilemedi.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setImages((finding.images || "").startsWith("[") ? parseImagesSafe(finding.images) : []);
    setFull(null);
    setNotice(null);
    setLoading(true);
    setPhase(0);
    setProgress(0);
    fetchArticle(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finding.id]);

  /** Kaydırma çubuğu ilerlemesini kurdeleye yansıtır */
  const onScrollProgress = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 40 ? Math.min(1, el.scrollTop / max) : 0);
  };

  const paragraphs = full?.paragraphs ?? fallbackParagraphs;
  const isFullText = Boolean(full);
  const metaBadge = loading
    ? "Tam metin getiriliyor…"
    : isFullText
      ? `Tam Metin · ${full!.wordCount.toLocaleString("tr-TR")} kelime`
      : "Kayıt Özeti";

  return (
    <>
      <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
        <DialogContent
          showCloseButton={false}
          className="top-[50%] h-[min(92dvh,960px)] w-[min(94vw,940px)] max-w-[calc(100vw-1rem)]! translate-x-[-50%] translate-y-[-50%] gap-0 overflow-hidden rounded-md border-0 bg-transparent p-0 shadow-none"
          aria-describedby={undefined}
        >
          {/* Kâğıt gövde — mag-page sınıfı position:relative tanımladığından fixed
              konumlandırmayı ezmek için DialogContent'e değil iç sarmalayıcıya uygulanır */}
          <div className="mag-page relative flex h-full w-full flex-col overflow-hidden">
          {/* Okuma kurdelesi — okuma ilerledikçe uzayan saten şerit */}
          {!loading && (
            <div
              className="pointer-events-none absolute left-[10px] top-0 z-[5] w-[7px]"
              style={{ height: `${10 + progress * 82}%` }}
              aria-hidden
            >
              <span className="mag-ribbon" />
            </div>
          )}
          <span className="sr-only">
            <DialogTitle>{finding.trTitle}</DialogTitle>
            <DialogDescription>Tam makale okuma penceresi</DialogDescription>
          </span>

          {/* Özel kapatma düğmesi (krem zeminde görünür) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Okuma penceresini kapat"
            className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-900/25 bg-white/70 text-stone-800 shadow-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          >
            {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <X className="h-4.5 w-4.5" />}
          </button>

          <div
            className="mag-page-content mag-scroll flex h-full min-h-0 flex-col overflow-y-auto px-5 pb-5 pt-4 sm:px-9 sm:pb-7 sm:pt-6"
            onScroll={onScrollProgress}
          >
            {/* Üst şerit */}
            <div className="flex items-center justify-between gap-3 border-b border-stone-900/25 pb-2 text-[9px] uppercase tracking-[0.24em] text-stone-600 sm:text-[10px]">
              <span className="mag-serif font-bold tracking-[0.18em] text-stone-800">
                OYİ GLOBAL
              </span>
              <span className="min-w-0 flex-1 truncate text-center">
                {metaBadge} · {categoryLabel(finding.category)}
              </span>
              <span className="mag-serif">Tam Oku</span>
            </div>

            {/* Kicker + rozetler */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mag-kicker">{categoryLabel(finding.category)}</span>
              {finding.isNewTech && <span className="mag-tag-red">Yenilik</span>}
              <span className="inline-flex items-center gap-0.5" title={`Önem puanı: ${finding.importance}/5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < finding.importance ? "fill-amber-700 text-amber-700" : "text-stone-400"}`}
                  />
                ))}
              </span>
            </div>

            {/* Başlık */}
            <DialogTitle asChild>
              <h2 className="mag-serif mt-2 text-[clamp(1.45rem,4vw,2.4rem)] font-bold leading-[1.14] tracking-tight text-stone-900">
                {finding.trTitle}
              </h2>
            </DialogTitle>
            {finding.originalTitle && (
              <p className="mag-serif mt-1 text-[12px] italic leading-snug text-stone-600 sm:text-[13.5px]">
                {finding.originalTitle}
              </p>
            )}

            {/* Künye satırı */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 border-y border-stone-900/15 py-1.5 text-[10px] uppercase tracking-[0.14em] text-stone-600 sm:text-[11px]">
              <span className="font-bold text-stone-900">{finding.sourceName}</span>
              <span aria-hidden>·</span>
              <span>{langInfo ? `${langInfo.flag} ${langInfo.name}` : finding.language.toUpperCase()}</span>
              {date && (
                <>
                  <span aria-hidden>·</span>
                  <span>{date}</span>
                </>
              )}
              <span aria-hidden>·</span>
              <span className="italic normal-case tracking-normal">
                {full?.translated === false ? "kaynak dilinde metin" : "yapay zekâ ile Türkçeleştirilmiştir"}
              </span>
            </div>

            {/* Dizgi yükleniyor — dergi üslubunda canlı getirme durumu */}
            {loading && (
              <div className="mt-8 flex flex-col items-center gap-4 pb-6" role="status" aria-live="polite">
                <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-stone-900/25 bg-white/60">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-800" />
                </div>
                <div className="text-center">
                  <p className="mag-serif text-[15px] font-semibold text-stone-900">
                    {LOADING_PHASES[phase]}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-stone-500">
                    Tam metin getirme · sonuç önbelleğe alınır
                  </p>
                </div>
                {/* Dizgi boş satırları — matbaada sıralanmış satırlar hissi */}
                <div className="mt-2 w-full max-w-xl space-y-2.5" aria-hidden>
                  {[92, 100, 84, 96, 70, 88].map((w, i) => (
                    <div
                      key={i}
                      className="h-2.5 animate-pulse rounded-[2px] bg-stone-900/10"
                      style={{ width: `${w}%`, animationDelay: `${i * 140}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Kaynak okunamadı bildirimi — özetle okunmaya devam */}
            {!loading && notice && (
              <div className="mt-4 rounded-sm border-l-2 border-amber-700 bg-amber-100/60 px-3 py-2.5 text-[12.5px] leading-snug text-stone-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 font-bold">
                    <FileText className="h-3.5 w-3.5" />
                    Tam metin kaynağından okunamadı
                  </span>
                  <button
                    type="button"
                    onClick={() => fetchArticle(true)}
                    className="inline-flex items-center gap-1 rounded-sm border border-stone-900/30 px-2 py-0.5 text-[11px] font-semibold text-stone-700 transition hover:bg-stone-900/10"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Yeniden dene
                  </button>
                </div>
                <p className="mt-1 italic text-stone-600">{notice}</p>
                <p className="mt-1">Aşağıda kayıt özetiyle okumaya devam edebilirsiniz.</p>
              </div>
            )}

            {/* Makale görselleri — tam galeri (API'den garantilenen) */}
            {!loading && images.length > 0 && (
              <section className="mt-4">
                <h3 className="text-[9px] font-bold uppercase tracking-[0.22em] text-stone-600">
                  Makale Görselleri — {images.length}
                </h3>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {images.map((im, i) => (
                    <figure
                      key={i}
                      className="group cursor-zoom-in"
                      onClick={() => setZoom({ url: im.url, alt: im.alt || finding.trTitle })}
                      title="Büyük görüntüle"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgProxyUrl(im.url)}
                        alt={im.alt || finding.trTitle}
                        loading="lazy"
                        className="max-h-[340px] w-full border border-stone-900/25 object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                      {im.alt && (
                        <figcaption className="mag-serif mt-1 text-[10px] italic leading-snug text-stone-600 sm:text-[11px]">
                          {im.alt}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* MAKALE METNİ — tam makale (kırpma yok) veya kayıt özeti */}
            {!loading && (
              <article className="mag-body mt-5">
                {paragraphs.length > 0 ? (
                  <>
                    {isFullText && (
                      <p className="mag-serif mb-3 border-l-2 border-amber-700/60 pl-3 text-[11.5px] italic leading-snug text-stone-600">
                        {full!.cached
                          ? "Bu makalenin tam metni daha önce getirildi (önbellek). "
                          : "Bu makalenin tam metni az önce orijinal kaynağından okundu. "}
                        {full!.translated === false
                          ? "Kaynak dili Türkçe olduğu için çeviri yapılmadı."
                          : "Orijinal dilinden yapay zekâ ile Türkçeye çevrilmiştir."}
                      </p>
                    )}
                    <div className="mag-cols mag-serif columns-1 gap-8 text-[13.5px] leading-[1.78] text-stone-800 md:columns-2 md:text-[14.5px]">
                      {paragraphs.map((par, i) => (
                        <p key={i} className={i === 0 ? "mag-dropcap" : undefined} style={{ marginBottom: "0.85em" }}>
                          {par}
                        </p>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="mag-serif text-[13.5px] leading-relaxed text-stone-700">
                    Bu kayıt için okunabilir metin bulunamadı. Derin analiz panelinden yapay zekâ
                    değerlendirmesini okuyabilir veya orijinal kaynağa giderek makaleye ulaşabilirsiniz.
                  </p>
                )}
                <div className="mt-3 flex items-center justify-center gap-2 text-stone-500" aria-hidden>
                  <span className="h-px w-12 bg-stone-500/50" />
                  <span className="text-[11px]">◆</span>
                  <span className="h-px w-12 bg-stone-500/50" />
                </div>
              </article>
            )}

            {/* Okur notu */}
            {finding.notes && !loading && (
              <div className="mt-3 rounded-sm border-l-2 border-amber-700 bg-amber-100/50 px-3 py-2 text-[12px] italic leading-snug text-stone-800">
                <b className="not-italic">Okur Notu:</b> {finding.notes}
              </div>
            )}

            {/* Anahtar kavramlar */}
            {keywords.length > 0 && !loading && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                  Anahtar:
                </span>
                {keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="rounded-sm border border-stone-900/25 px-1.5 py-0.5 text-[10px] font-medium text-stone-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}

            {/* Eylem çubuğu */}
            {!loading && (
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-stone-900/20 pt-3.5">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(finding)}
                  className={`inline-flex items-center gap-1.5 rounded-sm border px-3 py-2 text-[12px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 ${
                    finding.bookmarked
                      ? "border-amber-700/60 bg-amber-100/60 text-amber-800"
                      : "border-stone-900/25 text-stone-700 hover:bg-stone-900/10"
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${finding.bookmarked ? "fill-amber-700" : ""}`} />
                  {finding.bookmarked ? "İşaretli" : "İşaretle"}
                </button>
                <a
                  href={finding.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-sm border border-stone-900/25 px-3 py-2 text-[12px] font-semibold text-stone-700 transition-colors hover:bg-stone-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Orijinal Kaynak
                </a>
                {isFullText && (
                  <button
                    type="button"
                    onClick={() => fetchArticle(true)}
                    title="Tam metni kaynağından yeniden oku"
                    className="ml-auto inline-flex items-center gap-1.5 rounded-sm border border-stone-900/25 px-3 py-2 text-[12px] font-semibold text-stone-600 transition-colors hover:bg-stone-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Yenile
                  </button>
                )}
              </div>
            )}

            {/* Okur Mektupları — haberin altındaki yorum köşesi */}
            {!loading && <CommentsSection findingId={finding.id} />}
          </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox — görseli tam ekranda büyütür */}
      {zoom && (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-3 bg-black/90 p-4"
          role="dialog"
          aria-label="Görsel büyütücü"
          onClick={() => setZoom(null)}
        >
          <button
            type="button"
            aria-label="Büyütücüyı kapat"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
            onClick={() => setZoom(null)}
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgProxyUrl(zoom.url)}
            alt={zoom.alt}
            className="max-h-[80%] max-w-full rounded-sm object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {zoom.alt && <p className="max-w-2xl text-center text-xs leading-snug text-slate-300">{zoom.alt}</p>}
          <a
            href={zoom.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold text-amber-300 underline underline-offset-2"
          >
            Orijinal görseli aç
          </a>
        </div>
      )}
    </>
  );
}

/** finding.images alanını güvenle ayrıştırır (bozuk JSON → boş liste) */
function parseImagesSafe(raw: string): ArticleImage[] {
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((it: any) => it && typeof it.url === "string")
      .map((it: any) => ({ url: String(it.url), alt: String(it.alt ?? "") }));
  } catch {
    return [];
  }
}

/**
 * Okur Mektupları — haberin altındaki yorum köşesi.
 * Dergi üslubunda: mektup kartları, kehribar kenar çizgisi, serif yazar adı.
 */
function CommentsSection({ findingId }: { findingId: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoaded(false);
    setComments([]);
    setAuthor("");
    setBody("");
    setError(null);
    fetch(`/api/findings/${findingId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        if (alive && data.success && Array.isArray(data.comments)) setComments(data.comments);
      })
      .catch(() => {
        /* sessiz — liste boş görünür */
      })
      .finally(() => {
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [findingId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = body.trim();
    if (trimmed.length < 2) {
      setError("Yorum en az 2 karakter olmalı.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/findings/${findingId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: author.trim(), body: trimmed }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setBody("");
        setAuthor("");
      } else {
        setError(data.error || "Yorum kaydedilemedi. Lütfen tekrar deneyin.");
      }
    } catch {
      setError("Bağlantı hatası — yorum gönderilemedi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mt-6 border-t border-stone-900/20 pt-3.5" aria-label="Okur yorumları">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="mag-serif flex items-center gap-2 text-[16px] font-bold text-stone-900">
          <MessageSquare className="h-4 w-4 text-amber-800" />
          Okur Mektupları
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
          {comments.length} yorum
        </span>
      </div>
      <p className="mt-0.5 text-[11px] italic leading-snug text-stone-500">
        Bu haberle ilgili düşüncelerinizi dergiye mektup olarak bırakın; mektuplar sayfanın
        altında yayımlanır.
      </p>

      {/* Yorum formu */}
      <form onSubmit={submit} className="mt-3 space-y-2">
        {/* Bal küpü — botlar doldurur, insanlar görmez */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <div className="grid gap-2 sm:grid-cols-[minmax(0,230px)_1fr]">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={40}
            placeholder="Adınız (isteğe bağlı)"
            className="rounded-sm border border-stone-900/30 bg-white/70 px-2.5 py-2 text-[12.5px] text-stone-900 placeholder:text-stone-500 focus:border-amber-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-700"
          />
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={1500}
            placeholder="Yorumunuz…"
            className="rounded-sm border border-stone-900/30 bg-white/70 px-2.5 py-2 text-[12.5px] text-stone-900 placeholder:text-stone-500 focus:border-amber-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-700"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.16em] text-stone-500">
            {body.trim().length}/1500 karakter
          </p>
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-1.5 rounded-sm border-2 border-stone-900 bg-stone-900 px-3.5 py-1.5 text-[12px] font-bold text-amber-50 transition-colors hover:bg-stone-800 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          >
            {sending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Yorumu Gönder
          </button>
        </div>
        {error && <p className="text-[12px] font-semibold text-red-800">{error}</p>}
      </form>

      {/* Yorum listesi */}
      {loaded && comments.length === 0 ? (
        <p className="mt-3.5 rounded-sm border border-dashed border-stone-900/30 bg-white/40 px-3 py-3.5 text-center text-[12px] italic text-stone-500">
          Bu haber için henüz okur mektubu yok — ilk yorumu siz yazın.
        </p>
      ) : (
        <ul className="mt-3.5 space-y-2.5">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-sm border-l-2 border-amber-700/70 bg-white/50 px-3 py-2 shadow-[inset_0_0_0_1px_rgba(28,25,23,0.06)]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="mag-serif text-[13px] font-bold text-stone-900">{c.author}</span>
                <time className="text-[10px] uppercase tracking-[0.12em] text-stone-500">
                  {formatCommentDate(c.createdAt)}
                </time>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed text-stone-800">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
