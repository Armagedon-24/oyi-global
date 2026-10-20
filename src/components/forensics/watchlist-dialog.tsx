"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Plus, Loader2, Trash2, Eye, CircleAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WatchItem {
  id: string;
  term: string;
  matchCount: number;
  lastMatchAt: string | null;
}

interface WatchlistDialogProps {
  /** Yeni kelime eklendiğinde / silindiğinde çağrılır (gerekirse liste yenilenir) */
  onChanged?: () => void;
  /** Diyaloğu dışarıdan açmak için tetikleyici (opsiyonel) */
  openSignal?: number;
}

export function WatchlistDialog({ onChanged, openSignal }: WatchlistDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/watchlist");
      const data = await res.json();
      if (data.success) setItems(data.keywords);
    } catch {
      // sessiz
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  // Dışarıdan açma sinyali
  useEffect(() => {
    if (openSignal && openSignal > 0) setOpen(true);
  }, [openSignal]);

  const addTerm = async () => {
    const t = term.trim();
    if (t.length < 2) {
      toast({
        title: "Geçersiz kelime",
        description: "En az 2 karakter girin.",
        variant: "destructive",
      });
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: t }),
      });
      const data = await res.json();
      if (data.success) {
        setTerm("");
        await load();
        onChanged?.();
        toast({
          title: data.already ? "Kelime zaten izlemede" : "İzleme listesine eklendi",
          description: `"${t}" artık tüm yeni taramalarda otomatik denetlenecek.`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch {
      toast({
        title: "Eklenemedi",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const removeTerm = async (item: WatchItem) => {
    setDeletingId(item.id);
    try {
      await fetch(`/api/watchlist/${item.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      onChanged?.();
    } catch {
      // sessiz
    } finally {
      setDeletingId(null);
    }
  };

  const searchInArchive = (t: string) => {
    // Ana panelde arama yapılması için event ile bildir
    window.dispatchEvent(new CustomEvent("krimiscan:search", { detail: t }));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-9 px-3 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-amber-300 text-sm gap-1.5"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden lg:inline">İzleme</span>
          {items.length > 0 && (
            <Badge className="ml-0.5 h-5 px-1.5 bg-amber-500 text-slate-950 text-[10px] font-bold hover:bg-amber-500">
              {items.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-amber-400" /> Anahtar Kelime İzleme Listesi
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400">
            Kritik gördüğünüz terimleri ekleyin; her taramadan sonra bu terimlerin arşivdeki
            eşleşmeleri otomatik sayılır ve panelde uyarı rozeti gösterilir.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !adding && addTerm()}
            placeholder='Örn: "3D tarama", "Luminol", "touch DNA"…'
            className="bg-slate-950 border-slate-700 text-sm"
          />
          <Button
            onClick={addTerm}
            disabled={adding}
            className="shrink-0 h-9 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="h-64 -mx-2 px-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <CircleAlert className="h-8 w-8 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-400">
                Henüz izlenen kelime yok. Örneğin{" "}
                <button
                  className="text-amber-300 underline underline-offset-2"
                  onClick={() => setTerm("yapay zekâ")}
                >
                  "yapay zekâ"
                </button>{" "}
                ekleyerek deneyin.
              </p>
            </div>
          ) : (
            <div className="space-y-2 py-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950/60"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{item.term}</p>
                    <p className="text-[11px] text-slate-400">
                      {item.matchCount > 0
                        ? `Arşivde ${item.matchCount} eşleşme bulundu`
                        : "Henüz eşleşme yok"}
                    </p>
                  </div>
                  <Badge
                    className={
                      item.matchCount > 0
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15"
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-800"
                    }
                  >
                    {item.matchCount}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300"
                    title="Arşivde ara"
                    onClick={() => searchInArchive(item.term)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={deletingId === item.id}
                    className="h-7 px-2 border-slate-700 bg-slate-900 hover:bg-red-950 hover:text-red-300 hover:border-red-800"
                    title="İzlemeden çıkar"
                    onClick={() => removeTerm(item)}
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
