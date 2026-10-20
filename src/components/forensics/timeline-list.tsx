"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Globe, Microscope, Bookmark, Star, Clock3 } from "lucide-react";
import { categoryLabel, getLanguage } from "@/lib/forensics-config";
import type { FindingItem } from "@/lib/types";

interface TimelineListProps {
  findings: FindingItem[];
  onDeepDive: (f: FindingItem) => void;
  onToggleBookmark: (f: FindingItem) => void;
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Tarih yok";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(d);
  day.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - day.getTime()) / 86400000);
  if (diffDays === 0) return "Bugün";
  if (diffDays === 1) return "Dün";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} gün önce`;
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

/** Bulguların kronolojik zaman çizelgesi görünümü */
export function TimelineList({ findings, onDeepDive, onToggleBookmark }: TimelineListProps) {
  const groups = useMemo(() => {
    const map = new Map<string, FindingItem[]>();
    for (const f of findings) {
      const label = dayLabel(f.createdAt);
      const arr = map.get(label) ?? [];
      arr.push(f);
      map.set(label, arr);
    }
    return [...map.entries()];
  }, [findings]);

  if (findings.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-slate-400">
        Zaman çizelgesinde gösterilecek bulgu yok.
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Dikey hat */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-500/60 via-slate-700 to-transparent" />

      <div className="space-y-8">
        {groups.map(([label, items]) => (
          <div key={label} className="space-y-4">
            {/* Gün başlığı */}
            <div className="flex items-center gap-3 pl-0">
              <span className="h-10 w-10 rounded-full bg-slate-900 border-2 border-amber-500/50 flex items-center justify-center shrink-0 z-10">
                <Clock3 className="h-4 w-4 text-amber-400" />
              </span>
              <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">{label}</h4>
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs text-slate-400">{items.length} bulgu</span>
            </div>

            {/* O günkü bulgular */}
            <div className="space-y-3 pl-10">
              {items.map((f, i) => {
                const lang = getLanguage(f.language);
                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
                    className="relative"
                  >
                    {/* hat üzerindeki nokta */}
                    <span className="absolute -left-[27px] top-5 h-2.5 w-2.5 rounded-full bg-amber-400 ring-4 ring-slate-950" />

                    <div className="group rounded-xl border border-slate-800 bg-slate-900/70 hover:border-amber-500/40 hover:bg-slate-900 transition-colors p-4 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/15 text-[11px]">
                          {categoryLabel(f.category)}
                        </Badge>
                        {f.isNewTech && (
                          <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15 text-[11px] gap-1">
                            <Sparkles className="h-3 w-3" /> Yenilik
                          </Badge>
                        )}
                        <span className="ml-auto flex items-center gap-0.5 text-[11px] text-slate-400">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star
                              key={si}
                              className={`h-2.5 w-2.5 ${
                                si < f.importance ? "fill-amber-400 text-amber-400" : "text-slate-600"
                              }`}
                            />
                          ))}
                        </span>
                      </div>

                      <button
                        onClick={() => onDeepDive(f)}
                        className="block text-left w-full font-semibold text-slate-100 text-sm leading-snug hover:text-amber-300 transition-colors"
                      >
                        {f.trTitle}
                      </button>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {f.trSummary}
                      </p>

                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <span className="text-[11px] text-slate-400 flex items-center gap-2 min-w-0">
                          <span className="flex items-center gap-1 shrink-0">
                            <Globe className="h-3 w-3" />
                            {lang ? `${lang.flag} ${lang.name}` : f.language.toUpperCase()}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="truncate">{f.sourceName}</span>
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onToggleBookmark(f)}
                            className={`h-7 px-2 border-slate-700 bg-slate-950 hover:bg-slate-800 ${
                              f.bookmarked ? "text-amber-400 border-amber-500/40" : "text-slate-400"
                            }`}
                            title={f.bookmarked ? "Yer iminden çıkar" : "Yer imine ekle"}
                          >
                            <Bookmark className={`h-3 w-3 ${f.bookmarked ? "fill-amber-400" : ""}`} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onDeepDive(f)}
                            className="h-7 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px]"
                          >
                            <Microscope className="h-3 w-3 mr-1" /> Derin Analiz
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
