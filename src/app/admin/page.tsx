"use client";

/**
 * OYİ GLOBAL — Yönetim Paneli (/admin)
 * Şifreli giriş (ADMIN_PASSWORD, .env) → dergi taraması, bulgu yönetimi,
 * yorum moderasyonu. Okuma yüzeyi / (dergi) sayfasında kalır; tarama
 * yalnızca bu panel üzerinden yapılabilir.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  CircleAlert,
  CircleCheck,
  Database,
  ExternalLink,
  Globe2,
  ImagePlus,
  Languages,
  Loader2,
  Lock,
  LogOut,
  MessageSquare,
  Newspaper,
  Radar,
  Radar as RadarIcon,
  ScanSearch,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { CATEGORIES, SCAN_LANGUAGES } from "@/lib/forensics-config";
import { OyiMark } from "@/components/forensics/oyi-logo";
import type { FindingItem, ScanLogEntry, StatsData } from "@/lib/types";

interface AdminComment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  findingId: string;
  findingTitle: string;
}

type AuthState = "checking" | "guest" | "admin";

interface NewsImage {
  url: string;
  alt: string;
  preview: string;
}

export default function AdminPage() {
  const { toast } = useToast();

  const [auth, setAuth] = useState<AuthState>("checking");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [stats, setStats] = useState<StatsData | null>(null);
  const [findings, setFindings] = useState<FindingItem[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [commentTotal, setCommentTotal] = useState(0);
  const [deletingFindingId, setDeletingFindingId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // ---- Yeni haber formu ----
  const [newsTitle, setNewsTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [newsCategory, setNewsCategory] = useState("genel");
  const [newsSource, setNewsSource] = useState("");
  const [newsImportance, setNewsImportance] = useState("4");
  const [newsNewTech, setNewsNewTech] = useState(false);
  const [newsImages, setNewsImages] = useState<NewsImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [savingNews, setSavingNews] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---- Tarama durumu ----
  const [scanning, setScanning] = useState(false);
  const [scope, setScope] = useState<string>("all");
  const [focusCategory, setFocusCategory] = useState<string>("all");
  const [totalLangs, setTotalLangs] = useState(0);
  const [doneLangs, setDoneLangs] = useState(0);
  const [currentLang, setCurrentLang] = useState<{ flag: string; name: string } | null>(null);
  const [log, setLog] = useState<ScanLogEntry[]>([]);
  const [sessionAdded, setSessionAdded] = useState(0);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch {
      /* sessiz */
    }
  }, []);

  const loadFindings = useCallback(async () => {
    try {
      const res = await fetch("/api/findings?limit=15&sort=recent");
      const data = await res.json();
      if (data.success) setFindings(data.findings);
    } catch {
      /* sessiz */
    }
  }, []);

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch("/api/comments?limit=40");
      if (res.status === 401) return;
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
        setCommentTotal(data.total ?? data.comments.length);
      }
    } catch {
      /* sessiz */
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data) => setAuth(data.authenticated ? "admin" : "guest"))
      .catch(() => setAuth("guest"));
  }, []);

  useEffect(() => {
    if (auth !== "admin") return;
    loadStats();
    loadFindings();
    loadComments();
  }, [auth, loadStats, loadFindings, loadComments]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setPassword("");
        setAuth("admin");
      } else {
        setLoginError(data.error || "Giriş başarısız.");
      }
    } catch {
      setLoginError("Bağlantı hatası — giriş yapılamadı.");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setAuth("guest");
  };

  // ---- Tarama akışı (yalnızca bu panelde) ----
  const startScan = async () => {
    if (scanning) return;
    setScanning(true);
    setLog([]);
    setSessionAdded(0);
    setDoneLangs(0);
    setCurrentLang(null);

    try {
      const startRes = await fetch("/api/scan/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, focusCategory }),
      });
      const startData = await startRes.json();
      if (!startData.success) throw new Error(startData.error || "Tarama başlatılamadı");

      const scanId: string = startData.scanId;
      const langs: { code: string; name: string; flag: string }[] = startData.languages;
      setTotalLangs(langs.length);
      let addedTotal = 0;

      for (let i = 0; i < langs.length; i++) {
        const lang = langs[i];
        setCurrentLang({ flag: lang.flag, name: lang.name });
        const logId = `${lang.code}-${Date.now()}`;
        setLog((prev) => [
          ...prev,
          { id: logId, flag: lang.flag, langName: lang.name, status: "searching" },
        ]);

        try {
          const res = await fetch("/api/scan/step", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scanId, langCode: lang.code, focusCategory }),
          });
          const data = await res.json();
          if (data.success) {
            addedTotal += data.added;
            setSessionAdded(addedTotal);
            setLog((prev) =>
              prev.map((e) =>
                e.id === logId
                  ? { ...e, status: "done", searched: data.searched, relevant: data.relevant, added: data.added }
                  : e
              )
            );
          } else {
            setLog((prev) => prev.map((e) => (e.id === logId ? { ...e, status: "error" } : e)));
          }
        } catch {
          setLog((prev) => prev.map((e) => (e.id === logId ? { ...e, status: "error" } : e)));
        }
        setDoneLangs(i + 1);
      }

      await fetch("/api/scan/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId }),
      });

      loadFindings();
      loadStats();
      loadComments();
      toast({
        title: "Küresel tarama tamamlandı",
        description: `${langs.length} dil tarandı, ${addedTotal} yeni bulgu Türkçeleştirilerek dergiye eklendi.`,
      });
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "";
      const sessionIssue = /şifre|oturum|401/i.test(msg);
      toast({
        title: "Tarama başlatılamadı",
        description: sessionIssue
          ? "Oturum süresi dolmuş olabilir; tekrar giriş yapmayı deneyin."
          : msg
            ? msg
            : "Sunucuya ulaşılamadı. Bağlantıyı ve sunucu günlüklerini kontrol edin.",
        variant: "destructive",
      });
    } finally {
      setScanning(false);
      setCurrentLang(null);
    }
  };

  const deleteFinding = async (f: FindingItem) => {
    setDeletingFindingId(f.id);
    try {
      const res = await fetch(`/api/findings/${f.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setFindings((prev) => prev.filter((x) => x.id !== f.id));
        loadStats();
        toast({ title: "Bulgu silindi", description: f.trTitle.slice(0, 80) });
      } else {
        toast({ title: "Silinemedi", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Silinemedi", description: "Bağlantı hatası.", variant: "destructive" });
    } finally {
      setDeletingFindingId(null);
    }
  };

  const deleteComment = async (c: AdminComment) => {
    setDeletingCommentId(c.id);
    try {
      const res = await fetch(`/api/comments/${c.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((x) => x.id !== c.id));
        setCommentTotal((t) => Math.max(0, t - 1));
      } else {
        toast({ title: "Silinemedi", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Silinemedi", description: "Bağlantı hatası.", variant: "destructive" });
    } finally {
      setDeletingCommentId(null);
    }
  };

  // ---- Yeni haber: görsel yükleme + kaydetme ----
  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        setNewsImages((prev) =>
          prev.length >= 8
            ? prev
            : [...prev, { url: data.url, alt: "", preview: data.url }]
        );
        toast({ title: "Görsel yüklendi", description: "Galeriye eklendi — ilk görsel haberin kapağı olur." });
      } else {
        toast({ title: "Görsel yüklenemedi", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Görsel yüklenemedi", description: "Bağlantı hatası.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onImagePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
  };

  const resetNewsForm = () => {
    setNewsTitle("");
    setNewsBody("");
    setNewsCategory("genel");
    setNewsSource("");
    setNewsImportance("4");
    setNewsNewTech(false);
    setNewsImages([]);
  };

  const submitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingNews || uploading) return;
    setSavingNews(true);
    try {
      const res = await fetch("/api/admin/findings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trTitle: newsTitle,
          trSummary: newsBody,
          category: newsCategory,
          sourceName: newsSource,
          importance: Number(newsImportance) || 4,
          isNewTech: newsNewTech,
          images: newsImages.map((im) => ({ url: im.url, alt: im.alt })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        resetNewsForm();
        loadFindings();
        loadStats();
        toast({
          title: "Haber dergiye eklendi",
          description: "Yeni haber, derginin en güncel kaydı olarak okurlara sunuldu.",
        });
      } else {
        toast({ title: "Haber kaydedilemedi", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Haber kaydedilemedi", description: "Bağlantı hatası.", variant: "destructive" });
    } finally {
      setSavingNews(false);
    }
  };

  // ================= GİRİŞ EKRANI =================
  if (auth === "checking") {
    return (
      <div className="hud-root flex min-h-screen items-center justify-center text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <span className="relative inline-flex">
            <span className="hud-halo" aria-hidden />
            <OyiMark className="relative h-14 w-14" />
          </span>
          <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
        </div>
      </div>
    );
  }

  if (auth === "guest") {
    return (
      <div className="hud-root flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-10 text-slate-100">
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="relative inline-flex">
              <span className="hud-halo" aria-hidden />
              <OyiMark className="relative h-16 w-16" />
            </span>
            <div>
              <p className="hud-label mb-1.5">Güvenli Erişim Terminali</p>
              <h1 className="mag-serif text-2xl font-black tracking-tight text-slate-50">
                OYİ <span className="hud-glow text-amber-400">GLOBAL</span>
              </h1>
              <p className="mt-1 text-xs text-slate-400">Yönetim Paneli — Editör Girişi</p>
            </div>
          </div>

          <form
            onSubmit={login}
            className="hud-panel relative w-full max-w-sm space-y-4 overflow-hidden p-6 sm:p-7"
          >
            <i className="hud-corner tl" aria-hidden />
            <i className="hud-corner tr" aria-hidden />
            <i className="hud-corner bl" aria-hidden />
            <i className="hud-corner br" aria-hidden />
            <span className="hud-scanline" aria-hidden />

            <div className="relative flex items-center justify-between gap-2">
              <span className="hud-label">
                <Lock className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]" />
                Yetki Doğrulama
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] text-emerald-300">
                <span className="hud-dot" />
                ONLINE
              </span>
            </div>

            <div className="relative space-y-2">
              <label htmlFor="admin-pass" className="hud-label hud-label-dim">
                Yönetici Şifresi
              </label>
              <Input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                autoFocus
                className="hud-mono h-11 border-amber-500/25 bg-slate-950/80 text-sm tracking-[0.3em] focus-visible:border-amber-400/80 focus-visible:ring-amber-400/25"
              />
              {loginError && (
                <p className="hud-mono flex items-center gap-1.5 text-[11px] font-semibold text-red-400">
                  <CircleAlert className="h-3.5 w-3.5 shrink-0" />
                  {loginError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loggingIn || password.length === 0}
              className="hud-glow-shadow relative h-11 w-full bg-gradient-to-b from-amber-400 to-amber-600 font-bold text-slate-950 transition hover:from-amber-300 hover:to-amber-500"
            >
              {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Panele Giriş Yap
            </Button>

            <p className="hud-mono relative text-center text-[9.5px] leading-relaxed tracking-[0.18em] text-slate-600">
              SHA-256 JETON · HTTPONLY ÇEREZ · OYİ-SEC v2
            </p>
          </form>

          <Link
            href="/"
            className="text-xs text-slate-400 underline-offset-4 transition-colors hover:text-amber-300 hover:underline"
          >
            ← Dergiye geri dön
          </Link>
        </div>
      </div>
    );
  }

  // ================= PANEL =================
  const lastScan = stats?.lastScan;
  const lastScanDate = lastScan
    ? new Date(lastScan.startedAt).toLocaleString("tr-TR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="hud-root min-h-screen text-slate-100">
      {/* Üst bar */}
      <header className="sticky top-0 z-30 border-b border-amber-500/15 bg-[#04060c]/85 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative inline-flex shrink-0">
              <span className="hud-halo opacity-60" aria-hidden />
              <OyiMark className="relative h-10 w-10" />
            </span>
            <div className="min-w-0">
              <h1 className="mag-serif text-base font-black leading-tight tracking-tight text-slate-50">
                OYİ <span className="hud-glow text-amber-400">GLOBAL</span>
                <span className="hud-mono ml-2 inline-block rounded-sm border border-amber-400/35 bg-amber-400/10 px-1.5 py-0.5 align-middle text-[9px] font-bold uppercase tracking-[0.18em] text-amber-300">
                  Yönetim
                </span>
              </h1>
              <p className="hud-mono truncate text-[10px] tracking-[0.16em] text-slate-500">
                KOMUTA TERMİNALİ · BULGU &amp; YORUM KONTROL
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] text-emerald-300 md:flex">
              <span className="hud-dot" />
              OTURUM AKTİF
            </span>
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-700/80 bg-slate-900/70 px-3 text-sm text-slate-300 transition-colors hover:border-amber-400/60 hover:text-amber-300"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dergiye Git</span>
            </Link>
            <Button
              variant="outline"
              onClick={logout}
              className="h-9 border-slate-700/80 bg-slate-900/70 px-3 text-slate-300 hover:bg-slate-800 hover:text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Çıkış</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        {/* İstatistikler — HUD ölçüm karoğu */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[
            { icon: Database, label: "Toplam Bulgu", value: stats?.total ?? 0, color: "text-amber-400" },
            { icon: Sparkles, label: "Yeni Teknoloji", value: stats?.newTech ?? 0, color: "text-emerald-400" },
            { icon: Languages, label: "Kaynak Dil", value: stats?.languages.length ?? 0, color: "text-cyan-300" },
            { icon: MessageSquare, label: "Okur Yorumu", value: commentTotal, color: "text-sky-400" },
            { icon: ShieldCheck, label: "Son Güncelleme", value: lastScanDate ?? "—", color: "text-slate-200", small: true },
          ].map((s, i) => (
            <div key={i} className="hud-panel p-4">
              <i className="hud-corner tl" aria-hidden />
              <i className="hud-corner br" aria-hidden />
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-slate-950/70 shadow-[inset_0_0_14px_rgba(245,158,11,0.08)]">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`hud-glow font-bold leading-none ${
                      s.small ? "hud-mono truncate text-[12.5px]" : "text-xl"
                    }`}
                  >
                    {s.value}
                  </p>
                  <p className="hud-label hud-label-dim mt-1.5 truncate">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Tarama paneli — Modül 01 */}
        <section className="hud-panel space-y-4 p-5 sm:p-6">
          <i className="hud-corner tl" aria-hidden />
          <i className="hud-corner tr" aria-hidden />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="hud-label mb-1">Modül 01 — Küresel Radara</p>
              <h2 className="flex items-center gap-2 font-semibold text-slate-100">
                <Radar className="h-4 w-4 text-amber-400" />
                Küresel Tarama — Yalnızca Editör
              </h2>
            </div>
            <Badge className="gap-1 border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
              <ShieldCheck className="h-3 w-3" /> Admin yetkisi aktif
            </Badge>
          </div>
          <p className="max-w-3xl text-xs leading-relaxed text-slate-400">
            Tarama; {SCAN_LANGUAGES.length} dilde kaynak arar, adli bilimler ve olay yeri inceleme
            gelişmelerini yakalar, yapay zekâ ile Türkçeye çevirip dergiye ekler. Bu işlem artık
            herkese açık sayfalarda değil, yalnızca bu panelde çalıştırılabilir.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label className="hud-label hud-label-dim">Tarama Kapsamı</label>
              <Select value={scope} onValueChange={setScope} disabled={scanning}>
                <SelectTrigger className="w-full border-slate-700/70 bg-slate-950/80 text-sm focus-visible:ring-amber-400/25">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-amber-500/20 bg-[#0a0e1a]">
                  <SelectItem value="all">Tüm Diller ({SCAN_LANGUAGES.length} dil)</SelectItem>
                  <SelectItem value="quick">Hızlı Tarama (6 dil)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="hud-label hud-label-dim">Kategori Odağı</label>
              <Select value={focusCategory} onValueChange={setFocusCategory} disabled={scanning}>
                <SelectTrigger className="w-full border-slate-700/70 bg-slate-950/80 text-sm focus-visible:ring-amber-400/25">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-amber-500/20 bg-[#0a0e1a]">
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end sm:col-span-2">
              <Button
                onClick={startScan}
                disabled={scanning}
                className="hud-glow-shadow h-10 w-full bg-gradient-to-b from-amber-400 to-amber-600 text-sm font-bold text-slate-950 transition hover:from-amber-300 hover:to-amber-500"
              >
                {scanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Tarama sürüyor…
                  </>
                ) : (
                  <>
                    <ScanSearch className="mr-2 h-4 w-4" /> Küresel Taramayı Başlat
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Canlı ilerleme */}
          {(scanning || log.length > 0) && (
            <div className="grid gap-4 pt-1 lg:grid-cols-3">
              <div className="hud-panel hud-panel-soft space-y-4 p-5 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <RadarIcon className={`h-4 w-4 text-amber-400 ${scanning ? "animate-pulse" : ""}`} />
                    Tarama Durumu
                  </h3>
                  <Badge
                    className={
                      scanning
                        ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                        : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    }
                  >
                    {scanning ? "Aktif" : "Tamamlandı"}
                  </Badge>
                </div>

                {currentLang && (
                  <div className="flex items-center gap-3 rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 shadow-[inset_0_0_24px_rgba(245,158,11,0.06)]">
                    <span className="text-2xl">{currentLang.flag}</span>
                    <div>
                      <p className="text-sm font-semibold text-amber-200">{currentLang.name}</p>
                      <p className="text-xs text-slate-400">taranıyor ve Türkçeleştiriliyor…</p>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="hud-mono flex justify-between text-[11px] tracking-wide text-slate-400">
                    <span>İLERLEME</span>
                    <span>
                      {doneLangs}/{totalLangs} DİL
                    </span>
                  </div>
                  <Progress
                    value={totalLangs ? (doneLangs / totalLangs) * 100 : 0}
                    className="h-2 bg-slate-800/90 [&>div]:bg-gradient-to-r [&>div]:from-amber-300 [&>div]:to-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-center">
                    <p className="hud-glow text-xl font-bold text-amber-400">{sessionAdded}</p>
                    <p className="hud-label hud-label-dim mt-1">eklenen bulgu</p>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-center">
                    <p className="text-xl font-bold text-emerald-400">{doneLangs}</p>
                    <p className="hud-label hud-label-dim mt-1">tamamlanan dil</p>
                  </div>
                </div>
              </div>

              <div className="hud-panel hud-panel-soft p-0 lg:col-span-2">
                <h3 className="flex items-center gap-2 p-4 pb-2 text-sm font-semibold text-slate-200">
                  <Globe2 className="h-4 w-4 text-slate-400" /> Tarama Günlüğü
                </h3>
                <div className="admin-scroll h-56 overflow-y-auto">
                  <div className="space-y-1.5 px-4 pb-4">
                    {log.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-2.5 rounded-md border border-slate-800/60 bg-slate-950/50 px-2.5 py-1.5 text-xs transition-colors hover:border-amber-500/25"
                      >
                        <span className="text-base">{entry.flag}</span>
                        {entry.status === "searching" && (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
                            <span className="text-amber-200">{entry.langName} taranıyor…</span>
                          </>
                        )}
                        {entry.status === "done" && (
                          <>
                            <CircleCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                            <span className="text-slate-300">
                              {entry.langName}: {entry.searched} sonuç, {entry.relevant} alakalı,{" "}
                              <span className="font-semibold text-emerald-300">
                                {entry.added} yeni bulgu
                              </span>
                            </span>
                          </>
                        )}
                        {entry.status === "error" && (
                          <>
                            <CircleAlert className="h-3.5 w-3.5 shrink-0 text-red-400" />
                            <span className="text-red-300">{entry.langName}: tarama hatası</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Yeni haber ekleme — Modül 02 */}
        <section className="hud-panel space-y-4 p-5 sm:p-6">
          <i className="hud-corner tl" aria-hidden />
          <i className="hud-corner br" aria-hidden />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="hud-label mb-1">Modül 02 — Elle Yayın</p>
              <h2 className="flex items-center gap-2 font-semibold text-slate-100">
                <Newspaper className="h-4 w-4 text-amber-400" />
                Yeni Haber Ekle
              </h2>
            </div>
            <Badge className="gap-1 border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/10">
              <Sparkles className="h-3 w-3" /> Dergiye doğrudan düşer
            </Badge>
          </div>
          <p className="max-w-3xl text-xs leading-relaxed text-slate-400">
            Buraya eklediğiniz haber, derginin en güncel kaydı olarak okurlara sunulur. Metni
            paragraf boşluklarıyla ayırın; Tam Oku penceresi aynı paragraf yapısıyla gösterir.
            Yüklediğiniz görseller haber sayfasında ve galeride yer alır.
          </p>

          <form onSubmit={submitNews} className="grid gap-4 lg:grid-cols-5">
            {/* Sol: metin alanları */}
            <div className="space-y-3 lg:col-span-3">
              <div className="space-y-1.5">
                <label htmlFor="news-title" className="hud-label hud-label-dim">
                  Haber Başlığı *
                </label>
                <Input
                  id="news-title"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Örn: Yeni nesil 3D tarama cihazı olay yerinde tanıtıcıya sunuldu"
                  maxLength={300}
                  className="border-slate-700/70 bg-slate-950/80 text-sm placeholder:text-slate-600 focus-visible:border-amber-400/70 focus-visible:ring-amber-400/20"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="news-body" className="hud-label hud-label-dim">
                  Haberin Metni *{" "}
                  <span className="hud-mono tracking-normal text-slate-600">
                    ({newsBody.length.toLocaleString("tr-TR")} karakter)
                  </span>
                </label>
                <Textarea
                  id="news-body"
                  value={newsBody}
                  onChange={(e) => setNewsBody(e.target.value)}
                  placeholder="Haber metnini buraya yazın. Paragrafları boş satırla ayırın — dergi sayfası ve Tam Oku bu yapıyı korur."
                  rows={8}
                  maxLength={30000}
                  className="min-h-[160px] resize-y border-slate-700/70 bg-slate-950/80 text-sm leading-relaxed placeholder:text-slate-600 focus-visible:border-amber-400/70 focus-visible:ring-amber-400/20"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="hud-label hud-label-dim">Kategori</label>
                  <Select value={newsCategory} onValueChange={setNewsCategory}>
                    <SelectTrigger className="w-full border-slate-700/70 bg-slate-950/80 text-sm focus-visible:ring-amber-400/25">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-amber-500/20 bg-[#0a0e1a]">
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.key} value={c.key}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="hud-label hud-label-dim">Önem (1–5)</label>
                  <Select value={newsImportance} onValueChange={setNewsImportance}>
                    <SelectTrigger className="w-full border-slate-700/70 bg-slate-950/80 text-sm focus-visible:ring-amber-400/25">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-amber-500/20 bg-[#0a0e1a]">
                      {[5, 4, 3, 2, 1].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} — {n >= 4 ? "öne çıkan" : n === 3 ? "normal" : "arşivlik"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="news-source" className="hud-label hud-label-dim">
                    Kaynak Adı
                  </label>
                  <Input
                    id="news-source"
                    value={newsSource}
                    onChange={(e) => setNewsSource(e.target.value)}
                    placeholder="OYİ GLOBAL Editörü"
                    maxLength={120}
                    className="border-slate-700/70 bg-slate-950/80 text-sm placeholder:text-slate-600 focus-visible:border-amber-400/70 focus-visible:ring-amber-400/20"
                  />
                </div>
              </div>
              <label className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-300 transition-colors hover:border-amber-500/30">
                <input
                  type="checkbox"
                  checked={newsNewTech}
                  onChange={(e) => setNewsNewTech(e.target.checked)}
                  className="h-4 w-4 accent-amber-400"
                />
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Yeni teknoloji olarak işaretle
              </label>
            </div>

            {/* Sağ: görsel yükleme */}
            <div className="space-y-3 lg:col-span-2">
              <label className="hud-label hud-label-dim">
                Görseller{" "}
                <span className="hud-mono tracking-normal text-slate-600">
                  (en fazla 8 · JPG/PNG/WEBP/GIF · 6 MB)
                </span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={onImagePicked}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || newsImages.length >= 8}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-amber-500/30 bg-slate-950/50 px-4 py-7 text-center transition-all hover:border-amber-400/70 hover:bg-slate-900/70 hover:shadow-[0_0_30px_-12px_rgba(245,158,11,0.45)] disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
                ) : (
                  <ImagePlus className="h-5 w-5 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                )}
                <span className="text-xs font-medium text-slate-300">
                  {uploading ? "Yükleniyor…" : "Görsel seç veya buraya tıkla"}
                </span>
                <span className="text-[10px] text-slate-500">
                  İlk görsel haberin kapak resmi olur
                </span>
              </button>

              {newsImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {newsImages.map((im, i) => (
                    <div
                      key={im.url}
                      className="group relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={im.preview}
                        alt={im.alt || `Görsel ${i + 1}`}
                        className="h-20 w-full object-cover"
                      />
                      <span className="hud-mono absolute left-1 top-1 rounded bg-slate-950/85 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-amber-300">
                        {i === 0 ? "KAPAK" : i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setNewsImages((prev) => prev.filter((x) => x.url !== im.url))
                        }
                        title="Görseli kaldır"
                        className="absolute right-1 top-1 rounded bg-slate-950/85 p-1 text-slate-300 transition-colors hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <input
                        value={im.alt}
                        onChange={(e) =>
                          setNewsImages((prev) =>
                            prev.map((x) =>
                              x.url === im.url
                                ? { ...x, alt: e.target.value.slice(0, 200) }
                                : x
                            )
                          )
                        }
                        placeholder="Görsel açıklaması (alt)"
                        className="w-full border-t border-slate-800 bg-slate-950 px-2 py-1.5 text-[10px] text-slate-300 outline-none placeholder:text-slate-600"
                      />
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="submit"
                disabled={savingNews || uploading || newsTitle.trim().length < 4 || newsBody.trim().length < 20}
                className="hud-glow-shadow h-11 w-full bg-gradient-to-b from-amber-400 to-amber-600 text-sm font-bold text-slate-950 transition hover:from-amber-300 hover:to-amber-500"
              >
                {savingNews ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Haberi Dergiye Yayınla
              </Button>
            </div>
          </form>
        </section>

        {/* Son bulgular + yorum moderasyonu — Modül 03 */}
        <section className="grid min-w-0 gap-4 lg:grid-cols-2">
          <div className="hud-panel min-w-0">
            <div className="flex items-center justify-between p-4 pb-2">
              <div>
                <p className="hud-label mb-1">Modül 03 — Arşiv</p>
                <h3 className="text-sm font-semibold text-slate-200">Son Bulgular</h3>
              </div>
              <button
                onClick={loadFindings}
                className="hud-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 transition-colors hover:text-amber-300"
              >
                Yenile
              </button>
            </div>
            <div className="admin-scroll h-80 overflow-y-auto">
              <div className="space-y-1.5 px-4 pb-4">
                {findings.length === 0 && (
                  <p className="p-3 text-xs text-slate-500">Arşiv boş — önce bir tarama çalıştırın.</p>
                )}
                {findings.map((f) => (
                  <div
                    key={f.id}
                    className="group flex items-start gap-2 rounded-md border border-slate-800/60 bg-slate-950/50 p-2.5 transition-colors hover:border-amber-500/25"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-medium text-slate-200">{f.trTitle}</p>
                      <p className="hud-mono mt-0.5 text-[10px] text-slate-500">
                        {f.language.toUpperCase()} · {f.sourceName || "kaynak yok"} ·{" "}
                        {new Date(f.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Orijinal kaynağı aç"
                      className="rounded p-1 text-slate-500 hover:text-amber-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => deleteFinding(f)}
                      disabled={deletingFindingId === f.id}
                      title="Bulguyu sil"
                      className="rounded p-1 text-slate-500 transition-colors hover:text-red-400 disabled:opacity-50"
                    >
                      {deletingFindingId === f.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hud-panel min-w-0">
            <div className="flex items-center justify-between p-4 pb-2">
              <div>
                <p className="hud-label mb-1">Modül 04 — Okur Hattı</p>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <MessageSquare className="h-4 w-4 text-sky-400" />
                  Yorum Moderasyonu
                  <span className="hud-mono text-[10px] font-normal text-slate-500">
                    ({commentTotal})
                  </span>
                </h3>
              </div>
              <button
                onClick={loadComments}
                className="hud-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 transition-colors hover:text-amber-300"
              >
                Yenile
              </button>
            </div>
            <div className="admin-scroll h-80 overflow-y-auto">
              <div className="space-y-1.5 px-4 pb-4">
                {comments.length === 0 && (
                  <p className="p-3 text-xs text-slate-500">Henüz yorum yok.</p>
                )}
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-md border border-slate-800/60 bg-slate-950/50 p-2.5 transition-colors hover:border-amber-500/25"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-slate-200">
                          {c.author}
                          <span className="hud-mono ml-2 font-normal text-slate-500">
                            {new Date(c.createdAt).toLocaleString("tr-TR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </p>
                        <p className="truncate text-[10.5px] text-slate-500">↳ {c.findingTitle}</p>
                      </div>
                      <button
                        onClick={() => deleteComment(c)}
                        disabled={deletingCommentId === c.id}
                        title="Yorumu sil"
                        className="rounded p-1 text-slate-500 transition-colors hover:text-red-400 disabled:opacity-50"
                      >
                        {deletingCommentId === c.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 line-clamp-3 text-[11.5px] leading-snug text-slate-300">
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800/60 py-5">
        <p className="hud-mono mx-auto max-w-6xl px-4 text-center text-[10px] leading-relaxed tracking-[0.16em] text-slate-600 sm:px-6">
          OYİ GLOBAL YÖNETİM TERMİNALİ — TARAMA İŞLEMLERİ OTURUM ÇEREZİYLE KORUNUR; OKURLAR
          YALNIZCA DERGİDEN OKUR.
        </p>
      </footer>
    </div>
  );
}
