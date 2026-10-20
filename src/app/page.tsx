"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Fingerprint,
  Radar,
  Radar as RadarIcon,
  Search,
  Globe2,
  Languages,
  Database,
  Bookmark,
  Sparkles,
  Clock,
  ScanSearch,
  CircleCheck,
  CircleAlert,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { CATEGORIES, SCAN_LANGUAGES, categoryLabel } from "@/lib/forensics-config";
import { FindingCard } from "@/components/forensics/finding-card";
import { DeepDiveSheet } from "@/components/forensics/deep-dive-sheet";
import type { FindingItem, ScanLogEntry, StatsData } from "@/lib/types";

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

  // ---- Tarama durumu ----
  const [scanning, setScanning] = useState(false);
  const [scope, setScope] = useState<string>("all");
  const [focusCategory, setFocusCategory] = useState<string>("all");
  const [totalLangs, setTotalLangs] = useState(0);
  const [doneLangs, setDoneLangs] = useState(0);
  const [currentLang, setCurrentLang] = useState<{ flag: string; name: string } | null>(null);
  const [log, setLog] = useState<ScanLogEntry[]>([]);
  const [sessionAdded, setSessionAdded] = useState(0);
  const scanSectionRef = useRef<HTMLDivElement>(null);

  // ---- Derin analiz ----
  const [activeFinding, setActiveFinding] = useState<FindingItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bookmarkPendingId, setBookmarkPendingId] = useState<string | null>(null);

  const loadFindings = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        category,
        language,
        q: debouncedQuery,
        sort,
        bookmarked: onlyBookmarked ? "1" : "0",
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
  }, [category, language, debouncedQuery, sort, onlyBookmarked]);

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

  // Filtre/veri değişiminde yükle
  useEffect(() => {
    loadFindings();
  }, [loadFindings]);
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // ---- Tarama akışı ----
  const startScan = async () => {
    if (scanning) return;
    setScanning(true);
    setLog([]);
    setSessionAdded(0);
    setDoneLangs(0);
    setCurrentLang(null);
    setLoading(true);
    scanSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const startRes = await fetch("/api/scan/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, focusCategory }),
      });
      const startData = await startRes.json();
      if (!startData.success) throw new Error(startData.error);

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

        // Her 3 dilde canlı güncelle
        if ((i + 1) % 3 === 0) {
          loadFindings();
          loadStats();
        }
      }

      await fetch("/api/scan/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId }),
      });

      loadFindings();
      loadStats();
      toast({
        title: "Küresel tarama tamamlandı",
        description: `${langs.length} dil tarandı, ${addedTotal} yeni bulgu Türkçeleştirilerek arşive eklendi.`,
      });
    } catch (error) {
      toast({
        title: "Tarama başlatılamadı",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setScanning(false);
      setCurrentLang(null);
    }
  };

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
            <div className="h-10 w-10 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Fingerprint className="h-5 w-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base sm:text-lg leading-tight tracking-tight">
                KrimiScan <span className="text-amber-400">Global</span>
              </h1>
              <p className="text-[11px] text-slate-500 truncate">
                Olay Yeri İnceleme Teknikleri Küresel İzleme Merkezi
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            {lastScanDate
              ? `Son tarama: ${lastScanDate} · ${lastScan?.languagesCovered ?? 0} dil`
              : "Henüz tarama yapılmadı"}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ================= HERO + TARAMA PANELİ ================= */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
          {/* dekoratif */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[linear-gradient(rgba(251,191,36,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.6)_1px,transparent_1px)] bg-[size:44px_44px]" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative p-6 sm:p-10 space-y-6">
            <div className="space-y-3 max-w-3xl">
              <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 gap-1.5 hover:bg-amber-500/15">
                <Radar className="h-3.5 w-3.5" /> Çok Dilli İstihbarat Taraması
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                Dünyanın her dilinden olay yeri inceleme gelişmeleri,{" "}
                <span className="text-amber-400">Türkçe</span> olarak
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                {SCAN_LANGUAGES.length} dilde kaynak taraması yapar, adli bilimler ve olay yeri
                inceleme tekniklerindeki yenilikleri yapay zekâ ile Türkçeye çevirir,
                kategorize eder ve önem puanlar.
              </p>
            </div>

            {/* Kontroller */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Tarama Kapsamı</label>
                <Select value={scope} onValueChange={setScope} disabled={scanning}>
                  <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="all">Tüm Diller ({SCAN_LANGUAGES.length} dil)</SelectItem>
                    <SelectItem value="quick">Hızlı Tarama (6 dil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Kategori Odağı</label>
                <Select value={focusCategory} onValueChange={setFocusCategory} disabled={scanning}>
                  <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="all">Tüm Kategoriler</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.key} value={c.key}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 flex items-end">
                <Button
                  onClick={startScan}
                  disabled={scanning}
                  className="w-full h-10 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Tarama sürüyor…
                    </>
                  ) : (
                    <>
                      <ScanSearch className="h-4 w-4 mr-2" /> Küresel Taramayı Başlat
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TARAMA İLERLEMESİ ================= */}
        <div ref={scanSectionRef}>
          {(scanning || log.length > 0) && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4 lg:grid-cols-3"
            >
              {/* Canlı radar kartı */}
              <Card className="border-slate-800 bg-slate-900/70 lg:col-span-1">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                      <RadarIcon className={`h-4 w-4 text-amber-400 ${scanning ? "animate-pulse" : ""}`} />
                      Tarama Durumu
                    </h3>
                    <Badge
                      className={
                        scanning
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      }
                    >
                      {scanning ? "Aktif" : "Tamamlandı"}
                    </Badge>
                  </div>

                  {currentLang && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-500/25 bg-amber-500/5">
                      <span className="text-2xl">{currentLang.flag}</span>
                      <div>
                        <p className="text-sm font-semibold text-amber-200">{currentLang.name}</p>
                        <p className="text-xs text-slate-400">kaynaklar taranıyor ve Türkçeleştiriliyor…</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>İlerleme</span>
                      <span>
                        {doneLangs}/{totalLangs} dil
                      </span>
                    </div>
                    <Progress
                      value={totalLangs ? (doneLangs / totalLangs) * 100 : 0}
                      className="h-2 bg-slate-800 [&>div]:bg-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
                      <p className="text-xl font-bold text-amber-400">{sessionAdded}</p>
                      <p className="text-[11px] text-slate-500">eklenen bulgu</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
                      <p className="text-xl font-bold text-emerald-400">{doneLangs}</p>
                      <p className="text-[11px] text-slate-500">tamamlanan dil</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tarama günlüğü */}
              <Card className="border-slate-800 bg-slate-900/70 lg:col-span-2">
                <CardContent className="p-0">
                  <h3 className="font-semibold text-sm text-slate-200 p-4 pb-2 flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-slate-400" /> Tarama Günlüğü
                  </h3>
                  <ScrollArea className="h-56">
                    <div className="px-4 pb-4 space-y-1.5">
                      {log.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center gap-2.5 text-xs py-1.5 px-2.5 rounded-md bg-slate-950/50 border border-slate-800/60"
                        >
                          <span className="text-base">{entry.flag}</span>
                          {entry.status === "searching" && (
                            <>
                              <Loader2 className="h-3.5 w-3.5 text-amber-400 animate-spin" />
                              <span className="text-amber-200">{entry.langName} taranıyor…</span>
                            </>
                          )}
                          {entry.status === "done" && (
                            <>
                              <CircleCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              <span className="text-slate-300">
                                {entry.langName}: {entry.searched} sonuç, {entry.relevant} alakalı,{" "}
                                <span className="text-emerald-300 font-semibold">
                                  {entry.added} yeni bulgu
                                </span>
                              </span>
                            </>
                          )}
                          {entry.status === "error" && (
                            <>
                              <CircleAlert className="h-3.5 w-3.5 text-red-400 shrink-0" />
                              <span className="text-red-300">{entry.langName}: tarama hatası</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </div>

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
                  <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* ================= FİLTRELER ================= */}
        <section className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Bulgularda ara (Türkçe başlık, özet, anahtar kelime)…"
                className="pl-9 bg-slate-900 border-slate-700 text-sm placeholder:text-slate-600"
              />
            </div>
            <div className="flex gap-2">
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
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl bg-slate-900 border border-slate-800" />
              ))}
            </div>
          ) : findings.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Fingerprint className="h-8 w-8 text-slate-600" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-slate-200">Henüz bulgu yok</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Küresel taramayı başlatın; {SCAN_LANGUAGES.length} dildeki kaynaklardan olay yeri
                  inceleme gelişmeleri toplansın ve Türkçe olarak bu panelde listelensin.
                </p>
              </div>
              <Button
                onClick={startScan}
                disabled={scanning}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                <ScanSearch className="h-4 w-4 mr-2" /> İlk Taramayı Başlat
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {findings.map((f, i) => (
                <FindingCard
                  key={f.id}
                  finding={f}
                  index={i}
                  onDeepDive={openDeepDive}
                  onToggleBookmark={toggleBookmark}
                  bookmarkPending={bookmarkPendingId === f.id}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <Fingerprint className="h-3.5 w-3.5 text-amber-500/70" />
            KrimiScan Global — adli bilimler gelişmelerini dünya dillerinden Türkçeye taşıyan
            profesyonel izleme sistemi
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            İçerik kaynak sitelerden derlenir, profesyonel değerlendirme içindir
          </p>
        </div>
      </footer>

      {/* ================= DERİN ANALİZ PANELİ ================= */}
      <DeepDiveSheet finding={activeFinding} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
