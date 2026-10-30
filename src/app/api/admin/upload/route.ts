import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

/**
 * POST /api/admin/upload  (multipart/form-data, field: file)
 * Editörün haber eklerken yüklediği görselleri public/uploads altına kaydeder.
 * Dönen adres ("/uploads/<dosya>") Finding.images JSON'una yazılır;
 * imgProxyUrl yerel yolları proxy'siz doğrudan sunar.
 */

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB

const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

/** Dosya imzası (magic bytes) → tür gerçekten görsel mi? */
function looksLikeImage(buf: Uint8Array): boolean {
  if (buf.length < 12) return false;
  const b = buf;
  // JPEG: FF D8 FF
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return true;
  // GIF: 47 49 46 38
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return true;
  // WEBP: "RIFF"...."WEBP"
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  )
    return true;
  // AVIF: ...."ftyp"
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) return true;
  return false;
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Dosya alanı (file) bulunamadı." },
        { status: 400 }
      );
    }
    if (file.size === 0) {
      return NextResponse.json({ success: false, error: "Boş dosya." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: "Görsel çok büyük (en fazla 6 MB)." },
        { status: 413 }
      );
    }

    const mime = (file.type || "").toLowerCase().split(";")[0].trim();
    const ext = MIME_EXT[mime];
    if (!ext) {
      return NextResponse.json(
        { success: false, error: "Desteklenmeyen tür. JPG, PNG, WEBP, GIF veya AVIF yükleyin." },
        { status: 415 }
      );
    }

    const buf = new Uint8Array(await file.arrayBuffer());
    if (!looksLikeImage(buf)) {
      return NextResponse.json(
        { success: false, error: "Dosya içeriği bir görsel değil." },
        { status: 415 }
      );
    }

    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });

    const name = `haber-${crypto.randomUUID().slice(0, 12)}${ext}`;
    await fs.writeFile(path.join(dir, name), buf);

    return NextResponse.json({ success: true, url: `/uploads/${name}` });
  } catch (error) {
    console.error("[admin/upload]", error);
    return NextResponse.json(
      { success: false, error: "Görsel yüklenemedi." },
      { status: 500 }
    );
  }
}
