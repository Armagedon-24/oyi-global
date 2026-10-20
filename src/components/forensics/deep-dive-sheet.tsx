"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ExternalLink, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { categoryLabel, getLanguage } from "@/lib/forensics-config";
import type { FindingItem } from "@/lib/types";

interface DeepDiveSheetProps {
  finding: FindingItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeepDiveSheet({ finding, open, onOpenChange }: DeepDiveSheetProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !finding) return;
    setAnalysis(null);
    setError(null);

    // Önbellekteki analiz varsa anında göster
    if (finding.deepAnalysis) {
      setAnalysis(finding.deepAnalysis);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch("/api/deep-dive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: finding.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success) {
          setAnalysis(data.analysis);
        } else {
          setError(data.error ?? "Analiz üretilemedi");
        }
      })
      .catch(() => !cancelled && setError("Bağlantı hatası — analiz üretilemedi"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [open, finding]);

  const regenerate = async () => {
    if (!finding) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const r = await fetch("/api/deep-dive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: finding.id, force: true }),
      });
      const data = await r.json();
      if (data.success) setAnalysis(data.analysis);
      else setError(data.error ?? "Analiz üretilemedi");
    } catch {
      setError("Bağlantı hatası — analiz üretilemedi");
    } finally {
      setLoading(false);
    }
  };

  if (!finding) return null;
  const langInfo = getLanguage(finding.language);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl bg-slate-950 border-slate-800 p-0 flex flex-col"
      >
        <SheetHeader className="p-6 pb-4 border-b border-slate-800 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-[11px]">
              {categoryLabel(finding.category)}
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-400 text-[11px]">
              {langInfo ? `${langInfo.flag} ${langInfo.name}` : finding.language.toUpperCase()} kaynak
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-400 text-[11px]">
              {finding.sourceName}
            </Badge>
          </div>
          <SheetTitle className="text-slate-50 text-lg leading-snug pr-8">
            {finding.trTitle}
          </SheetTitle>
          <SheetDescription className="text-slate-400 text-sm leading-relaxed line-clamp-3">
            {finding.trSummary}
          </SheetDescription>
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs border-slate-700 bg-slate-900 hover:bg-slate-800"
              onClick={regenerate}
              disabled={loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
              Yeniden Üret
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs border-slate-700 bg-slate-900 hover:bg-slate-800"
              asChild
            >
              <a href={finding.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Orijinal Makale
              </a>
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 pt-4">
            {loading && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
                  <Loader2 className="h-5 w-5 text-amber-400 animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-amber-200">
                      Makale inceleniyor ve analiz ediliyor…
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tam metin okunuyor, yapılandırılmış Türkçe rapor üretiliyor. Bu işlem 20-40 saniye sürebilir.
                    </p>
                  </div>
                </div>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-1/3 bg-slate-800" />
                    <Skeleton className="h-3 w-full bg-slate-800/70" />
                    <Skeleton className="h-3 w-5/6 bg-slate-800/70" />
                    <Skeleton className="h-3 w-4/6 bg-slate-800/70" />
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-300">
                {error}
              </div>
            )}

            {!loading && analysis && (
              <div className="forensic-prose text-slate-300">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2 className="text-amber-300 font-semibold text-base mt-6 mb-2 first:mt-0 flex items-center gap-2">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-slate-100 font-semibold text-sm mt-4 mb-1.5">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-sm leading-relaxed text-slate-300 mb-3">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-1.5 mb-3 ml-1">{children}</ul>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm leading-relaxed text-slate-300 flex gap-2">
                        <span className="text-amber-400 mt-0.5 shrink-0">▸</span>
                        <span>{children}</span>
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-slate-100 font-semibold">{children}</strong>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 underline underline-offset-2"
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-amber-500/50 pl-3 text-slate-400 italic text-sm my-3">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
