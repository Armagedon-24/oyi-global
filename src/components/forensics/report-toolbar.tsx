"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Rapor sayfası araç çubuğu — yalnızca ekranda görünür, baskıda gizlenir */
export function ReportToolbar() {
  return (
    <div className="print:hidden sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Ana Panele Dön
        </Link>
        <Button
          onClick={() => window.print()}
          className="h-9 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm"
        >
          <Printer className="h-4 w-4 mr-2" /> PDF Olarak Kaydet / Yazdır
        </Button>
      </div>
    </div>
  );
}
