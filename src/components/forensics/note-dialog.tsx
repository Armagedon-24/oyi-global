"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Loader2, Trash2 } from "lucide-react";
import { categoryLabel } from "@/lib/forensics-config";
import type { FindingItem } from "@/lib/types";

interface NoteDialogProps {
  finding: FindingItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (f: FindingItem, notes: string) => Promise<void>;
}

/** Bulgu bazlı kişisel not düzenleme diyaloğu */
export function NoteDialog({ finding, open, onOpenChange, onSave }: NoteDialogProps) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && finding) setValue(finding.notes ?? "");
  }, [open, finding]);

  const handleSave = async () => {
    if (!finding) return;
    setSaving(true);
    try {
      await onSave(finding, value);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!finding) return;
    setValue("");
    setSaving(true);
    try {
      await onSave(finding, "");
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  if (!finding) return null;

  const len = value.trim().length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <StickyNote className="h-4 w-4 text-amber-400" /> Kişisel Not
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400 line-clamp-2">
            {finding.trTitle}
          </DialogDescription>
          <div className="flex gap-1.5 pt-1">
            <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/15 text-[11px]">
              {categoryLabel(finding.category)}
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-400 text-[11px]">
              {finding.sourceName}
            </Badge>
          </div>
        </DialogHeader>

        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Bu bulgu hakkındaki değerlendirmeniz, vaka bağlantısı, eylem maddesi…"
          rows={6}
          maxLength={4000}
          className="bg-slate-950 border-slate-700 text-sm placeholder:text-slate-400 resize-none"
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">{len}/4000</span>
            {finding.notes && !saving && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={saving}
                className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/50"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Notu Sil
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs"
            >
              Vazgeç
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Notu Kaydet"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
