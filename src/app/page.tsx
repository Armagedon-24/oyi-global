"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Fingerprint,
  Radar,
  Search,
  Languages,
  Database,
  Bookmark,
  Sparkles,
  Clock,
  ShieldCheck,
  BarChart3,
  FileText,
  LayoutGrid,
  GitCommitHorizontal,
  Bot,
  Newspaper,
  Download,
  FileJson,
  FileSpreadsheet,
  CheckCircle2,
  BookOpen,
  Lock,
} from "lucide-react";
import { CATEGORIES, SCAN_LANGUAGES } from "@/lib/forensics-config";
import { FindingCard } from "@/components/forensics/finding-card";
import { MagazineView } from "@/components/forensics/magazine-view";
import { DeepDiveSheet } from "@/components/forensics/deep-dive-sheet";
import { WatchlistDialog } from "@/components/forensics/watchlist-dialog";
import { TimelineList } from "@/components/forensics/timeline-list";
import { NoteDialog } from "@/components/forensics/note-dialog";
import { OyiMark } from "@/components/forensics/oyi-logo";
import type { FindingItem, StatsData } from "@/lib/types";

const ALL_LANG_VALUE = "all";

export default function Home() {
  const { toast } = useToast();

  // ---- Veri durumu ----
  const [findings, setFindings] = useState<FindingItem[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  // ---- Filtre durumu ----
  const [category, setCategory] = useState<string>("all");
  const [language, setLanguage] = useState<string>(ALL_LANG_VALUE);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sort, setSort] = useState<string>("recent");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [onlyUnread, setOnlyUnread] = useState(false);

  // ---- Derin analiz ----
  const [activeFinding, setActiveFinding] = useState<FindingItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bookmarkPendingId, setBookmarkPendingId] = useState<string | null>(null);

  // ---- Okundu / not ----
  const [readPendingId, setReadPendingId] = useState<string | null>(null);
  const [noteFinding, setNoteFinding] = useState<FindingItem | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);

  // ---- Görünüm ve izleme ----
  const [view, setView] = useState<"dergi" | "kart" | "zaman">("dergi");
  const [watchOpenSignal, setWatchOpenSignal] = useState(0);

  const loadFindings = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        category,
        language,
        q: debouncedQuery,
        sort,
        bookmarked: onlyBookmarked ? "1" : "0",
        unread: onlyUnread ? "1" : "0",
        limit: "120",
      });
      const res = await fetch(`/api/findings?${params}`);
      const data = await res.json();
      if (data.success) setFindings(data.findings);
    } catch {
      // sessizce geç
    } finally {
      setLoading(false);
    }
  }, [category, language, debouncedQuery, sort, onlyBookmarked, onlyUnread]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch {
      // sessizce geç
    }
  }, []);

  // Arama girdisi debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // İzleme listesinden arama talebi (kelimeye tıklandığında arşivde arar)
  useEffect(() => {
    const handler = (e: Event) => {
      const term = (e as CustomEvent<string>).detail;
      if (!term) return;
      setSearchInput(term);
      setOnlyBookmarked(false);
      setOnlyUnread(false);
      setCategory("all");
      document.getElementById("bulgu-listesi")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("oyi:search", handler);
    return () => window.removeEventListener("oyi:search", handler);
  }, []);

  // Filtre/veri değişiminde yükle
  useEffect(() => {
    loadFindings();
  }, [loadFindings]);
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // ---- Yer imi ----
  const toggleBookmark = async (f: FindingItem) => {
    setBookmarkPendingId(f.id);
    const optimistic = !f.bookmarked;
    setFindings((prev) => prev.map((x) => (x.id === f.id ? { ...x, bookmarked: optimistic } : x)));
    try {
      await fetch(`/api/findings/${f.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookmarked: optimistic }),
      });
      loadStats();
    } catch {
      setFindings((prev) => prev.map((x) => (x.id === f.id ? { ...x, bookmarked: f.bookmarked } : x)));
    } finally {
      setBookmarkPendingId(null);
    }
  };

  // ---- Okundu işaretleme ----
  const toggleRead = async (f: FindingItem) => {
    setReadPendingId(f.id);
    const optimistic = !f.isRead;
    setFindings((prev) => prev.map((x) => (x.id === f.id ? { ...x, isRead: optimistic } : x)));
    try {
      await fetch(`/api/findings/${f.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: optimistic }),
      });
    } catch {
      setFindings((prev) => prev.map((x) => (x.id === f.id ? { ...x, isRead: f.isRead } : x)));
    } finally {
      setReadPendingId(null);
    }
  };

  // ---- Kişisel not kaydetme ----
  const saveNote = async (f: FindingItem, notes: string) => {
    const trimmed = notes.trim();
    setFindings((prev) =>
      prev.map((x) => (x.id === f.id ? { ...x, notes: trimmed || null } : x))
    );
    try {
      await fetch(`/api/findings/${f.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: trimmed }),
      });
      toast({
        title: trimmed ? "Not kaydedildi" : "Not silindi",
        description: trimmed ? "Bulgu kartında görünecek." : undefined,
      });
    } catch {
      setFindings((prev) =>
        prev.map((x) => (x.id === f.id ? { ...x, notes: f.notes } : x))
      );
      toast({
        title: "Not kaydedilemedi",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
  };

  const openDeepDive = (f: FindingItem) => {
    setActiveFinding(f);
    setSheetOpen(true);
  };

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <OyiMark className="h-11 w-11 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="mag-serif font-black text-base sm:text-lg leading-tight tracking-tight text-slate-50">
                  OYİ <span className="text-amber-400">GLOBAL</span>
                </h1>
                <span className="hidden sm:inline align-middle rounded-sm border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-amber-300">E-Dergi</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Olay Yeri İnceleme Teknikleri — Küresel İzleme Dergisi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 mr-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              {lastScanDate
                ? `Son tarama: ${lastScanDate} · ${lastScan?.languagesCovered ?? 0} dil`
                : "Henüz tarama yapılmadı"}
            </div>
            <WatchlistDialog openSignal={watchOpenSignal} />
            <Link
              href="/assistant"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-slate-700 bg-slate-900 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-300 transition-colors"
              title="AI İstihbarat Asistanı — arşiv bağlamlı soru-cevap"
            >
              <Bot className="h-4 w-4" />
              <span className="hidden lg:inline">Asistan</span>
            </Link>
            <Link
              href="/briefing"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-slate-700 bg-slate-900 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-300 transition-colors"
              title="AI İstihbarat Bülteni — LLM sentezli dönem raporu"
            >
              <Newspaper className="h-4 w-4" />
              <span className="hidden lg:inline">Bülten</span>
            </Link>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-slate-700 bg-slate-900 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-300 transition-colors"
              title="Trend ve analitik paneli"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden lg:inline">Analitik</span>
            </Link>
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-slate-700 bg-slate-900 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-300 transition-colors"
              title="Yazdırılabilir küresel istihbarat raporu"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden lg:inline">Rapor</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ================= HERO — OKUR KARŞILAMA BANDI ================= */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
          {/* dekoratif */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[linear-gradient(rgba(251,191,36,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.6)_1px,transparent_1px)] bg-[size:44px_44px]" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative p-6 sm:p-10 space-y-5">
            <div className="space-y-3 max-w-3xl">
              <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 gap-1.5 hover:bg-amber-500/15">
                <Radar className="h-3.5 w-3.5" /> Sürekli Güncellenen E-Dergi
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                Dünyanın her dilinden olay yeri inceleme gelişmeleri,{" "}
                <span className="text-amber-400">Türkçe</span> olarak
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Derginin {SCAN_LANGUAGES.length} dildeki küresel kaynak taraması editör paneli
                aracılığıyla yürütülür; yakalanan gelişmeler yapay zekâ ile Türkçeye çevrilir,
                kategorize edilir ve bu sayfalarda yayımlanır. Okur olarak dergiyi açıp okuyabilir
                ve haberlerin altına yorum bırakabilirsiniz.
              </p>
            </div>

            {/* Salt-okunur sayı bilgisi */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950/70 px-3 py-1.5 text-slate-300">
                <Database className="h-3.5 w-3.5 text-amber-400" />
                Bu sayıda <b className="text-amber-300">{stats?.total ?? 0}</b> haber
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950/70 px-3 py-1.5 text-slate-300">
                <Languages className="h-3.5 w-3.5 text-purple-400" />
                {stats?.languages.length ?? 0} kaynak dil
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950/70 px-3 py-1.5 text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                {lastScanDate
                  ? `Son güncelleme: ${lastScanDate}`
                  : "İlk sayı editör taraması sonrası yayında"}
              </span>
            </div>

            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                Tarama ve içerik yönetimi yalnızca editör (yönetici) tarafından yapılır.
              </span>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-medium text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
              >
                <Lock className="h-3 w-3" />
                Editör Girişi
              </Link>
            </p>
          </div>
        </section>

        {/* ================= İSTATİSTİKLER ================= */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: Database,
              label: "Toplam Bulgu",
              value: stats?.total ?? 0,
              color: "text-amber-400",
            },
            {
              icon: Sparkles,
              label: "Yeni Teknoloji",
              value: stats?.newTech ?? 0,
              color: "text-emerald-400",
            },
            {
              icon: Languages,
              label: "Kaynak Dil",
              value: stats?.languages.length ?? 0,
              color: "text-purple-400",
            },
            {
              icon: Bookmark,
              label: "Yer İmleri",
              value: stats?.bookmarked ?? 0,
              color: "text-orange-400",
            },
          ].map((s, i) => (
            <Card key={i} className="border-slate-800 bg-slate-900/70">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none">{s.value}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* ================= FİLTRELER ================= */}
        <section className="space-y-3" id="bulgu-listesi">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Bulgularda ara (Türkçe başlık, özet, anahtar kelime)…"
                className="pl-9 bg-slate-900 border-slate-700 text-sm placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full sm:w-44 bg-slate-900 border-slate-700 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value={ALL_LANG_VALUE}>Tüm Diller</SelectItem>
                  {SCAN_LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-900 border-slate-700 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="recent">En Yeni</SelectItem>
                  <SelectItem value="importance">En Önemli</SelectItem>
                  <SelectItem value="newtech">Yenilik Önce</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={onlyUnread ? "default" : "outline"}
                onClick={() => setOnlyUnread((v) => !v)}
                className={`h-9 px-3 text-sm ${
                  onlyUnread
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
                title="Yalnızca okunmamış bulgular"
              >
                <CheckCircle2 className={`h-4 w-4 ${onlyUnread ? "fill-slate-950" : ""}`} />
                <span className="sr-only sm:not-sr-only sm:ml-1">Okunmamış</span>
              </Button>
              <Button
                variant={onlyBookmarked ? "default" : "outline"}
                onClick={() => setOnlyBookmarked((v) => !v)}
                className={`h-9 px-3 text-sm ${
                  onlyBookmarked
                    ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Bookmark className={`h-4 w-4 ${onlyBookmarked ? "fill-slate-950" : ""}`} />
                <span className="sr-only sm:not-sr-only sm:ml-1">Yer İmleri</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 px-3 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-amber-300"
                    title="Arşivi dışa aktar"
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-1">Dışa Aktar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border-slate-700 text-slate-300">
                  <DropdownMenuItem
                    onClick={() => window.open("/api/export?format=csv", "_blank")}
                    className="gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                    CSV olarak indir (Excel)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => window.open("/api/export?format=json", "_blank")}
                    className="gap-2 cursor-pointer"
                  >
                    <FileJson className="h-4 w-4 text-purple-400" />
                    JSON olarak indir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Görünüm değiştirici: Dergi / Kart / Zaman Çizelgesi */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-400">
              {findings.length > 0 && `${findings.length} bulgu görüntüleniyor`}
            </p>
            <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-0.5">
              <button
                onClick={() => setView("dergi")}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${
                  view === "dergi"
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" /> Dergi
              </button>
              <button
                onClick={() => setView("kart")}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${
                  view === "kart"
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Kart
              </button>
              <button
                onClick={() => setView("zaman")}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${
                  view === "zaman"
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <GitCommitHorizontal className="h-3.5 w-3.5" /> Zaman Çizelgesi
              </button>
            </div>
          </div>

          {/* Kategori çipleri */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => setCategory("all")}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                category === "all"
                  ? "bg-amber-500 text-slate-950 border-amber-500 font-semibold"
                  : "bg-slate-900 text-slate-400 border-slate-700 hover:border-amber-500/40 hover:text-amber-300"
              }`}
            >
              Tümü
            </button>
            {CATEGORIES.map((c) => {
              const count = stats?.categories.find((x) => x.key === c.key)?.count ?? 0;
              return (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    category === c.key
                      ? "bg-amber-500 text-slate-950 border-amber-500 font-semibold"
                      : "bg-slate-900 text-slate-400 border-slate-700 hover:border-amber-500/40 hover:text-amber-300"
                  }`}
                >
                  {c.label}
                  {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= BULGU LİSTESİ ================= */}
        <section>
          {view === "dergi" ? (
            <MagazineView
              findings={findings}
              loading={loading}
              onToggleBookmark={toggleBookmark}
            />
          ) : loading ? (
            view === "kart" ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-xl bg-slate-900 border border-slate-800" />
                ))}
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl bg-slate-900 border border-slate-800" />
                ))}
              </div>
            )
          ) : findings.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Fingerprint className="h-8 w-8 text-slate-500" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-slate-200">Bu sayı henüz boş</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Derginin yeni sayısı editör taraması sonrası yayına alınır; dünya genelindeki
                  olay yeri inceleme gelişmeleri Türkçeleştirilerek bu sayfalara yerleşir.
                </p>
              </div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
              >
                <Lock className="h-3.5 w-3.5" />
                Editör Girişi
              </Link>
            </div>
          ) : view === "kart" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {findings.map((f, i) => (
                <FindingCard
                  key={f.id}
                  finding={f}
                  index={i}
                  onDeepDive={openDeepDive}
                  onToggleBookmark={toggleBookmark}
                  bookmarkPending={bookmarkPendingId === f.id}
                  onToggleRead={toggleRead}
                  onOpenNote={(x) => {
                    setNoteFinding(x);
                    setNoteOpen(true);
                  }}
                  readPending={readPendingId === f.id}
                />
              ))}
            </div>
          ) : (
            <TimelineList
              findings={findings}
              onDeepDive={openDeepDive}
              onToggleBookmark={toggleBookmark}
            />
          )}
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p className="flex items-center gap-1.5">
            <OyiMark className="h-5 w-5" />
            OYİ GLOBAL E-Dergi — adli bilimler gelişmelerini dünya dillerinden Türkçeye
            taşıyan dijital baskı
          </p>
          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              İçerik kaynak sitelerden derlenir, profesyonel değerlendirme içindir
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 rounded-md border border-slate-800 px-2 py-1 text-[11px] text-slate-500 transition-colors hover:border-amber-500/40 hover:text-amber-300"
              title="Yönetici girişi"
            >
              <Lock className="h-3 w-3" />
              Yönetim
            </Link>
          </div>
        </div>
      </footer>

      {/* ================= DERİN ANALİZ PANELİ ================= */}
      <DeepDiveSheet finding={activeFinding} open={sheetOpen} onOpenChange={setSheetOpen} />

      {/* ================= KİŞİSEL NOT DİYALOGU ================= */}
      <NoteDialog
        finding={noteFinding}
        open={noteOpen}
        onOpenChange={setNoteOpen}
        onSave={saveNote}
      />
    </div>
  );
}
