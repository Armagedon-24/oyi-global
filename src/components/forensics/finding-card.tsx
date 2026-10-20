"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Bookmark,
  Sparkles,
  Globe,
  Microscope,
  Star,
} from "lucide-react";
import { categoryLabel, getLanguage } from "@/lib/forensics-config";
import type { FindingItem } from "@/lib/types";

interface FindingCardProps {
  finding: FindingItem;
  index: number;
  onDeepDive: (f: FindingItem) => void;
  onToggleBookmark: (f: FindingItem) => void;
  bookmarkPending: boolean;
}

function parseKeywords(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, 4) : [];
  } catch {
    return [];
  }
}

function formatDate(s: string | null): string | null {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

export function FindingCard({
  finding,
  index,
  onDeepDive,
  onToggleBookmark,
  bookmarkPending,
}: FindingCardProps) {
  const keywords = useMemo(() => parseKeywords(finding.keywords), [finding.keywords]);
  const langInfo = getLanguage(finding.language);
  const date = formatDate(finding.publishedDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-slate-800 bg-slate-900/70 hover:border-amber-500/40 hover:bg-slate-900 transition-colors">
        <CardContent className="flex-1 p-5 space-y-3">
          {/* Üst şerit: kategori + yenilik rozeti */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/15 text-[11px] font-medium">
              {categoryLabel(finding.category)}
            </Badge>
            {finding.isNewTech && (
              <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15 text-[11px] font-medium gap-1">
                <Sparkles className="h-3 w-3" /> Yenilik
              </Badge>
            )}
          </div>

          {/* Türkçe başlık */}
          <h3 className="font-semibold leading-snug text-slate-50 text-[15px] line-clamp-3">
            {finding.trTitle}
          </h3>

          {/* Türkçe özet */}
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-4">
            {finding.trSummary}
          </p>

          {/* Anahtar kelimeler */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Önem puanı */}
          <div className="flex items-center gap-1 pt-0.5" title={`Önem puanı: ${finding.importance}/5`}>
            <span className="text-[11px] text-slate-500 mr-1">Önem:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < finding.importance
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-700"
                }`}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
          {/* Meta bilgisi */}
          <div className="w-full flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center gap-1 shrink-0">
                <Globe className="h-3 w-3" />
                {langInfo ? `${langInfo.flag} ${langInfo.name}` : finding.language.toUpperCase()}
              </span>
              <span className="text-slate-700">•</span>
              <span className="truncate">{finding.sourceName}</span>
            </div>
            {date && <span className="shrink-0">{date}</span>}
          </div>

          {/* Eylem butonları */}
          <div className="w-full flex items-center gap-2">
            <Button
              size="sm"
              className="flex-1 h-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs"
              onClick={() => onDeepDive(finding)}
            >
              <Microscope className="h-3.5 w-3.5 mr-1" />
              Derin Analiz
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2.5 border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-amber-300"
              asChild
            >
              <a href={finding.url} target="_blank" rel="noopener noreferrer" title="Orijinal makale">
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="sr-only">Orijinal makale</span>
              </a>
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={bookmarkPending}
              onClick={() => onToggleBookmark(finding)}
              className={`h-8 px-2.5 border-slate-700 bg-slate-900 hover:bg-slate-800 ${
                finding.bookmarked ? "text-amber-400 border-amber-500/40" : "text-slate-400"
              }`}
              title={finding.bookmarked ? "Yer iminden çıkar" : "Yer imine ekle"}
            >
              <Bookmark className={`h-3.5 w-3.5 ${finding.bookmarked ? "fill-amber-400" : ""}`} />
              <span className="sr-only">Yer imi</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
