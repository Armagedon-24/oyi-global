"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Fingerprint,
  ArrowLeft,
  Newspaper,
  Sparkles,
  Loader2,
  Printer,
  RefreshCw,
  CalendarDays,
  Layers,
  Info,
} from "lucide-react";

interface BriefingData {
  id: string;
  content: string;
  itemCount: number;
  createdAt: string;
}

export default function BriefingPage() {
  const { toast } = useToast();
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true); // ilk yükleme
  const [generating, setGenerating] = useState(false); // üretim sürüyor

  const loadLatest = useCallback(async () => {
    try {
      const res = await fetch("/api/briefing");
      const data = await res.json();
      if (data.success && data.briefing) {
        setBriefing(data.briefing);
      }
    } catch {
      // sessiz
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatest();
  }, [loadLatest]);

  const generate = async (force: boolean) => {
    setGenerating(true);
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });
      const data = await res.json();
      if (data.success) {
        setBriefing(data.briefing);
        toast({
          title: data.cached ? "Güncel bülten gösteriliyor" : "Bülten üretildi",
          description: data.cached
            ? "Son 24 saat içinde üretilen bülten kullanıldı."
            : `${data.briefing.itemCount} bulgudan sentezlenen istihbarat bülteni hazır.`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({
        title: "Bülten üretilemedi",
        description: err?.message ?? "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const createdDate = briefing
    ? new Date(briefing.createdAt).toLocaleString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* HEADER */}
      <header className="print:hidden sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-300 transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Panel</span>
            </Link>
            <div className="h-9 w-9 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Newspaper className="h-5 w-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base leading-tight tracking-tight">
                AI İstihbarat Bülteni
              </h1>
              <p className="text-[11px] text-slate-500 truncate">
                Arşiv bulgularından LLM sentezli dönem raporu
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {briefing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="h-8 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs"
              >
                <Printer className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Yazdır</span>
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => generate(Boolean(briefing))}
              disabled={generating}
              className="h-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              {generating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Üretiliyor…
                </>
              ) : briefing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Yenile
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1" /> Bülten Üret
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* İÇERİK */}
      <main className="print:bg-white flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3 rounded-lg bg-slate-900" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4 bg-slate-900" />
                <Skeleton className="h-3 w-full bg-slate-900/70" />
                <Skeleton className="h-3 w-5/6 bg-slate-900/70" />
              </div>
            ))}
          </div>
        ) : generating ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-5 rounded-xl border border-amber-500/25 bg-amber-500/5">
              <Loader2 className="h-6 w-6 text-amber-400 animate-spin shrink-0" />
              <div>
                <p className="font-semibold text-amber-200">
                  İstihbarat bülteniniz sentezleniyor…
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Arşivdeki önemli bulgular analiz ediliyor, uzman değerlendirmesi ve bölgesel
                  görünüm oluşturuluyor. Bu işlem 30-60 saniye sürebilir.
                </p>
              </div>
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4 bg-slate-900" />
                <Skeleton className="h-3 w-full bg-slate-900/70" />
                <Skeleton className="h-3 w-5/6 bg-slate-900/70" />
                <Skeleton className="h-3 w-4/6 bg-slate-900/70" />
              </div>
            ))}
          </div>
        ) : !briefing ? (
          <div className="text-center py-20 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Newspaper className="h-8 w-8 text-slate-600" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-lg text-slate-200">Henüz bülten üretilmedi</h3>
              <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                Yapay zekâ, arşivinizdeki en önemli bulguları inceleyerek yönetici özeti, öne çıkan
                gelişmeler, yükselen teknolojiler ve bölgesel görünüm içeren profesyonel bir Türkçe
                istihbarat bülteni hazırlar.
              </p>
            </div>
            <Button
              onClick={() => generate(false)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            >
              <Sparkles className="h-4 w-4 mr-2" /> İlk Bülteni Üret
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Bülten künyesi */}
            <div className="print:bg-white print:text-black flex flex-wrap items-center gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/15 gap-1">
                <Newspaper className="h-3 w-3" /> İstihbarat Bülteni
              </Badge>
              <Badge
                variant="outline"
                className="border-slate-700 text-slate-400 gap-1 print:border-slate-400"
              >
                <CalendarDays className="h-3 w-3" /> {createdDate}
              </Badge>
              <Badge
                variant="outline"
                className="border-slate-700 text-slate-400 gap-1 print:border-slate-400"
              >
                <Layers className="h-3 w-3" /> {briefing.itemCount} bulgudan sentezlendi
              </Badge>
              <p className="hidden print:block text-xs ml-auto">
                KrimiScan Global — Olay Yeri İnceleme Teknikleri Küresel İzleme Merkezi
              </p>
            </div>

            {/* Bülten metni */}
            <div className="forensic-prose text-slate-300 print:text-black">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-amber-300 print:text-amber-700 font-semibold text-lg mt-8 mb-3 first:mt-0 flex items-center gap-2 border-b border-slate-800 print:border-slate-300 pb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-slate-100 print:text-black font-semibold text-base mt-5 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm leading-relaxed text-slate-300 print:text-slate-800 mb-3">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => <ul className="space-y-2 mb-4 ml-1">{children}</ul>,
                  li: ({ children }) => (
                    <li className="text-sm leading-relaxed text-slate-300 print:text-slate-800 flex gap-2">
                      <span className="text-amber-400 print:text-amber-700 mt-0.5 shrink-0">▸</span>
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-slate-100 print:text-black font-semibold">
                      {children}
                    </strong>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 print:text-amber-700 underline underline-offset-2"
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
                {briefing.content}
              </ReactMarkdown>
            </div>

            {/* Alt not */}
            <div className="print:hidden flex items-start gap-2.5 p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-500 leading-relaxed">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-500" />
              <p>
                Bu bülten yapay zekâ tarafından arşiv bulgularından sentezlenmiştir; [B#n] atıfları
                arşiv sıralamasını gösterir. Kritik işlemlerde orijinal kaynakları ve derin analiz
                raporlarını doğrulayın.
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="print:hidden mt-auto border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <Fingerprint className="h-3.5 w-3.5 text-amber-500/70" />
            KrimiScan Global
          </p>
          <Link href="/report" className="hover:text-amber-300 transition-colors">
            Ham veri raporuna geç →
          </Link>
        </div>
      </footer>
    </div>
  );
}
