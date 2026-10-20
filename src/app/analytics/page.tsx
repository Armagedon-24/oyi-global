"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Sparkles,
  Languages,
  Layers,
  Newspaper,
  Flame,
  Fingerprint,
} from "lucide-react";
import { categoryLabel, getLanguage } from "@/lib/forensics-config";

interface AnalyticsData {
  total: number;
  newTech: number;
  innovationRatio: number;
  categories: { key: string; count: number }[];
  languages: { code: string; count: number }[];
  importance: { level: number; count: number }[];
  sources: { name: string; count: number }[];
  weekly: { label: string; count: number; newTech: number }[];
  topKeywords: { term: string; count: number }[];
}

const AMBER = "#f59e0b";
const EMERALD = "#10b981";
const SKY = "#38bdf8";
const PURPLE = "#a78bfa";
const ROSE = "#fb7185";
const PIE_COLORS = [AMBER, EMERALD, SKY, PURPLE, ROSE, "#fbbf24", "#34d399", "#22d3ee", "#c084fc", "#f87171", "#facc15"];

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#e2e8f0",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (json.success) setData(json.analytics);
      } catch {
        // sessiz
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const maxSource = data ? Math.max(...data.sources.map((s) => s.count), 1) : 1;
  const topCategory = data?.categories[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center hover:border-amber-500/40 transition-colors"
              title="Ana panele dön"
            >
              <ArrowLeft className="h-4 w-4 text-slate-300" />
            </Link>
            <div className="h-10 w-10 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight tracking-tight">
                Trend & Analitik <span className="text-amber-400">Paneli</span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Küresel bulgu arşivinin istatistiksel ve trend analizi
              </p>
            </div>
          </div>
          <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 gap-1.5 hover:bg-amber-500/15">
            <TrendingUp className="h-3.5 w-3.5" /> Canlı Veri
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl bg-slate-900 border border-slate-800" />
            ))}
          </div>
        ) : !data || data.total === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="font-semibold text-slate-200">Analiz için veri yok</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Önce ana panelde küresel tarama çalıştırın; bulgular biriktikçe bu panelde trend
              grafikleri oluşacaktır.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm"
            >
              <ArrowLeft className="h-4 w-4" /> Ana Panele Dön
            </Link>
          </div>
        ) : (
          <>
            {/* KPI kartları */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: Layers, label: "Toplam Bulgu", value: data.total, color: "text-amber-400" },
                { icon: Sparkles, label: "Yenilik Oranı", value: `%${data.innovationRatio}`, color: "text-emerald-400" },
                { icon: Languages, label: "Kaynak Dil", value: data.languages.length, color: "text-purple-400" },
                {
                  icon: Flame,
                  label: "En Aktif Kategori",
                  value: topCategory ? categoryLabel(topCategory.key).split(" ")[0] : "—",
                  color: "text-sky-400",
                },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-slate-800 bg-slate-900/70">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0">
                        <s.icon className={`h-4 w-4 ${s.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl font-bold leading-none truncate">{s.value}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{s.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </section>

            {/* Haftalık akış + Kategori dağılımı */}
            <section className="grid gap-4 lg:grid-cols-2">
              <Card className="border-slate-800 bg-slate-900/70">
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-400" /> Haftalık Bulgu Akışı (8 Hafta)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.weekly} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={AMBER} stopOpacity={0.45} />
                            <stop offset="100%" stopColor={AMBER} stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={EMERALD} stopOpacity={0.4} />
                            <stop offset="100%" stopColor={EMERALD} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#94a3b8" }} />
                        <Area type="monotone" dataKey="count" name="Toplam" stroke={AMBER} strokeWidth={2} fill="url(#gTotal)" />
                        <Area type="monotone" dataKey="newTech" name="Yenilik" stroke={EMERALD} strokeWidth={2} fill="url(#gNew)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/70">
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-amber-400" /> Kategori Dağılımı
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.categories.map((c) => ({ name: categoryLabel(c.key), count: c.count }))}
                        layout="vertical"
                        margin={{ top: 0, right: 12, left: 8, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={130}
                          tick={{ fill: "#94a3b8", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(251,191,36,0.06)" }} />
                        <Bar dataKey="count" name="Bulgu" fill={AMBER} radius={[0, 4, 4, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Dil dağılımı + Önem dağılımı */}
            <section className="grid gap-4 lg:grid-cols-2">
              <Card className="border-slate-800 bg-slate-900/70">
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <Languages className="h-4 w-4 text-purple-400" /> Kaynak Dil Dağılımı
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.languages.map((l) => ({ name: getLanguage(l.code)?.name ?? l.code.toUpperCase(), count: l.count }))} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} interval={0} angle={-35} textAnchor="end" height={58} />
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(167,139,250,0.06)" }} />
                        <Bar dataKey="count" name="Bulgu" fill={PURPLE} radius={[4, 4, 0, 0]} barSize={22} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/70">
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-rose-400" /> Önem Puanı Dağılımı
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.importance.map((im) => ({ name: `${im.level} Yıldız`, value: im.count }))}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {data.importance.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pb-1">
                    {data.importance.map((im, i) => (
                      <span key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        {im.level} yıldız ({im.count})
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* En aktif kaynaklar + Trend kelimeler */}
            <section className="grid gap-4 lg:grid-cols-2">
              <Card className="border-slate-800 bg-slate-900/70">
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-sky-400" /> En Aktif Kaynaklar
                  </h3>
                  <div className="space-y-2.5">
                    {data.sources.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-28 sm:w-36 truncate text-right shrink-0">{s.name}</span>
                        <div className="flex-1 h-4 rounded bg-slate-800/70 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(s.count / maxSource) * 100}%` }}
                            transition={{ duration: 0.7, delay: i * 0.05 }}
                            className="h-full rounded bg-gradient-to-r from-sky-500/70 to-sky-400"
                          />
                        </div>
                        <span className="text-xs font-semibold text-sky-300 w-7 text-right shrink-0">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/70">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-emerald-400" /> Trend Olan Anahtar Kelimeler
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.topKeywords.map((kw, i) => (
                      <motion.span
                        key={kw.term}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={`px-3 py-1.5 rounded-full border text-xs ${
                          i < 3
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/40 font-semibold"
                            : "bg-slate-800/70 text-slate-300 border-slate-700"
                        }`}
                      >
                        {kw.term} <span className="opacity-60">· {kw.count}</span>
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Bu kelimeler arşivdeki tüm bulgulardan otomatik çıkarılır; en üstteki terimler
                    alandaki güncel tartışma başlıklarını gösterir.
                  </p>
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
