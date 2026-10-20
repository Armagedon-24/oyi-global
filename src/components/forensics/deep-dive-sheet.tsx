"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ExternalLink, Loader2, Images, ZoomIn } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { categoryLabel, getLanguage } from "@/lib/forensics-config";
import { imgProxyUrl, parseFindingImages, type ArticleImage } from "@/lib/image-utils";
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
  const [images, setImages] = useState<ArticleImage[]>([]);
  const [lightbox, setLightbox] = useState<ArticleImage | null>(null);

  useEffect(() => {
    if (!open || !finding) return;
    setAnalysis(null);
    setError(null);
    setLightbox(null);
    setImages(parseFindingImages(finding.images));

    // Önbellekteki analiz varsa anında göster
    if (finding.deepAnalysis) {
      // Yine de görseller eksikse arka planda tazele
      if (parseFindingImages(finding.images).length === 0 && finding.images !== "none") {
        fetch("/api/deep-dive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: finding.id }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.success && Array.isArray(data.images)) setImages(data.images);
          })
          .catch(() => null);
      }
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
          if (Array.isArray(data.images)) setImages(data.images);
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
      if (data.success) {
        setAnalysis(data.analysis);
        if (Array.isArray(data.images)) setImages(data.images);
      } else setError(data.error ?? "Analiz üretilemedi");
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
            {images.length > 0 && (
              <Badge className="bg-sky-500/15 text-sky-300 border-sky-500/30 text-[11px] gap-1">
                <Images className="h-3 w-3" /> {images.length} görsel
              </Badge>
            )}
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
          <div className="p-6 pt-4 space-y-5">
            {/* Makale görselleri galerisi */}
            {images.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100 mb-2.5">
                  <Images className="h-4 w-4 text-amber-400" />
                  Makale Görselleri
                  <span className="text-xs font-normal text-slate-400">
                    (fotoğraf, şekil ve çizimler — büyütmek için tıklayın)
                  </span>
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {images.map((img, i) => (
                    <figure key={`${img.url}-${i}`} className="group/gal relative">
                      <button
                        type="button"
                        onClick={() => setLightbox(img)}
                        className="relative block w-full overflow-hidden rounded-lg border border-slate-700/80 bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        title="Görseli büyüt"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgProxyUrl(img.url)}
                          alt={img.alt || finding.trTitle}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover/gal:scale-[1.04]"
                          onError={(e) => {
                            const fig = e.currentTarget.closest("figure");
                            if (fig) fig.style.display = "none";
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition-all group-hover/gal:bg-slate-950/40 group-hover/gal:opacity-100">
                          <ZoomIn className="h-6 w-6 text-amber-300" />
                        </span>
                      </button>
                      {img.alt && (
                        <figcaption className="mt-1.5 text-[11px] leading-snug text-slate-400 line-clamp-2">
                          {img.alt}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* Yükleme durumu */}
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

        {/* Görsel büyüteç (lightbox) */}
        <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
          <DialogContent className="max-w-3xl bg-slate-950 border-slate-700 p-4 gap-3">
            {lightbox && (
              <>
                <DialogHeader className="space-y-1">
                  <DialogTitle className="text-slate-100 text-sm font-semibold leading-snug">
                    {lightbox.alt || finding.trTitle}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-400">
                    Makale görseli — {finding.sourceName}
                  </DialogDescription>
                </DialogHeader>
                <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgProxyUrl(lightbox.url)}
                    alt={lightbox.alt || finding.trTitle}
                    referrerPolicy="no-referrer"
                    className="max-h-[65vh] w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-slate-500 truncate flex-1">{lightbox.url}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-slate-700 bg-slate-900 hover:bg-slate-800 shrink-0"
                    asChild
                  >
                    <a href={lightbox.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Orijinal görsel
                    </a>
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
}
