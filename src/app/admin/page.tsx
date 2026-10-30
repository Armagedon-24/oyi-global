"use client";

/**
 * OYİ GLOBAL — Yönetim Paneli (/admin)
 * Şifreli giriş (ADMIN_PASSWORD, .env) → dergi taraması, bulgu yönetimi,
 * yorum moderasyonu. Okuma yüzeyi / (dergi) sayfasında kalır; tarama
 * yalnızca bu panel üzerinden yapılabilir.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Languages,
  Loader2,
  Lock,
  LogOut,
  MessageSquare,
  Radar,
  Radar as RadarIcon,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Trash2,
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
    } catch {
      toast({
        title: "Tarama başlatılamadı",
        description: "Oturum süresi dolmuş olabilir; tekrar giriş yapmayı deneyin.",
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

  // ================= GİRİŞ EKRANI =================
  if (auth === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
      </div>
    );
  }

  if (auth === "guest") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-slate-100">
        <div className="flex items-center gap-3">
          <OyiMark className="h-14 w-14" />
          <div>
            <h1 className="mag-serif text-xl font-black tracking-tight">
              OYİ <span className="text-amber-400">GLOBAL</span>
            </h1>
            <p className="text-xs text-slate-400">Yönetim Paneli — Editör Girişi</p>
          </div>
        </div>

        <form
          onSubmit={login}
          className="w-full max-w-sm space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Lock className="h-4 w-4 text-amber-400" />
            Yönetici şifresi
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            autoFocus
            className="bg-slate-950 border-slate-700"
          />
          {loginError && <p className="text-xs font-semibold text-red-400">{loginError}</p>}
          <Button
            type="submit"
            disabled={loggingIn || password.length === 0}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
          >
            {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Panele Giriş Yap
          </Button>
          <p className="text-[11px] leading-snug text-slate-500">
            Şifre projenin <code className="text-slate-400">.env</code> dosyasındaki{" "}
            <code className="text-amber-400/90">ADMIN_PASSWORD</code> ile belirlenir.
          </p>
        </form>

        <Link href="/" className="text-xs text-slate-400 underline-offset-2 hover:text-amber-300 hover:underline">
          ← Dergiye geri dön
        </Link>
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Üst bar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <OyiMark className="h-10 w-10 shrink-0" />
            <div className="min-w-0">
              <h1 className="mag-serif font-black text-base leading-tight tracking-tight text-slate-50">
                OYİ <span className="text-amber-400">GLOBAL</span>
                <span className="ml-2 rounded-sm border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 align-middle text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Yönetim
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 truncate">
                Dergi taraması, içerik ve yorum yönetimi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dergiye Git</span>
            </Link>
            <Button
              variant="outline"
              onClick={logout}
              className="h-9 border-slate-700 bg-slate-900 px-3 text-slate-300 hover:bg-slate-800 hover:text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Çıkış</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        {/* İstatistikler */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { icon: Database, label: "Toplam Bulgu", value: stats?.total ?? 0, color: "text-amber-400" },
            { icon: Sparkles, label: "Yeni Teknoloji", value: stats?.newTech ?? 0, color: "text-emerald-400" },
            { icon: Languages, label: "Kaynak Dil", value: stats?.languages.length ?? 0, color: "text-purple-400" },
            { icon: MessageSquare, label: "Okur Yorumu", value: commentTotal, color: "text-sky-400" },
            { icon: ShieldCheck, label: "Son Güncelleme", value: lastScanDate ?? "—", color: "text-slate-200", small: true },
          ].map((s, i) => (
            <Card key={i} className="border-slate-800 bg-slate-900/70">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div className="min-w-0">
                  <p className={`font-bold leading-none ${s.small ? "text-[13px] truncate" : "text-xl"}`}>
                    {s.value}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Tarama paneli */}
        <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-semibold text-slate-100">
              <Radar className="h-4 w-4 text-amber-400" />
              Küresel Tarama — Yalnızca Editör
            </h2>
            <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 gap-1 hover:bg-emerald-500/15">
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

          {/* Canlı ilerleme */}
          {(scanning || log.length > 0) && (
            <div className="grid gap-4 lg:grid-cols-3 pt-1">
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
                        <p className="text-xs text-slate-400">taranıyor ve Türkçeleştiriliyor…</p>
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
                      <p className="text-[11px] text-slate-400">eklenen bulgu</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
                      <p className="text-xl font-bold text-emerald-400">{doneLangs}</p>
                      <p className="text-[11px] text-slate-400">tamamlanan dil</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
            </div>
          )}
        </section>

        {/* Son bulgular + yorum moderasyonu */}
        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="border-slate-800 bg-slate-900/70">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 pb-2">
                <h3 className="font-semibold text-sm text-slate-200">Son Bulgular</h3>
                <button
                  onClick={loadFindings}
                  className="text-[11px] text-slate-400 hover:text-amber-300"
                >
                  yenile
                </button>
              </div>
              <ScrollArea className="h-80">
                <div className="space-y-1.5 px-4 pb-4">
                  {findings.length === 0 && (
                    <p className="p-3 text-xs text-slate-500">Arşiv boş — önce bir tarama çalıştırın.</p>
                  )}
                  {findings.map((f) => (
                    <div
                      key={f.id}
                      className="group flex items-start gap-2 rounded-md border border-slate-800/60 bg-slate-950/50 p-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-medium text-slate-200">{f.trTitle}</p>
                        <p className="mt-0.5 text-[10.5px] text-slate-500">
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
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/70">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 pb-2">
                <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-sky-400" />
                  Yorum Moderasyonu
                  <span className="text-[10px] font-normal text-slate-500">({commentTotal})</span>
                </h3>
                <button
                  onClick={loadComments}
                  className="text-[11px] text-slate-400 hover:text-amber-300"
                >
                  yenile
                </button>
              </div>
              <ScrollArea className="h-80">
                <div className="space-y-1.5 px-4 pb-4">
                  {comments.length === 0 && (
                    <p className="p-3 text-xs text-slate-500">Henüz yorum yok.</p>
                  )}
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-md border border-slate-800/60 bg-slate-950/50 p-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-slate-200">
                            {c.author}
                            <span className="ml-2 font-normal text-slate-500">
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
              </ScrollArea>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 py-4">
        <p className="mx-auto max-w-6xl px-4 text-center text-[11px] text-slate-500 sm:px-6">
          OYİ GLOBAL Yönetim Paneli — tarama işlemleri oturum çereziyle korunur; okurlar yalnızca
          dergiden okur.
        </p>
      </footer>
    </div>
  );
}
