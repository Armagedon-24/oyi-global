import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import crypto from "node:crypto";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/admin/upload  (multipart/form-data, field: file)
 * Editörün haber eklerken yüklediği görselleri sharp ile sıkıştırıp
 * base64 data URL olarak döndürür. Dosya sistemi KULLANILMAZ; böylece
 * okunabilir-disk olmayan (read-only) ortamlarda — Vercel, Netlify vb. —
 * de sorunsuz çalışır. Dönen data URL, Finding.images JSON'una yazılır;
 * imgProxyUrl data: adreslerini proxy'siz doğrudan sunar.
 */

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB (Vercel istek gövdesi limiti güvenliği)

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
        { success: false, error: "Görsel çok büyük (en fazla 4 MB)." },
        { status: 413 }
      );
    }

    const mime = (file.type || "").toLowerCase().split(";")[0].trim();
    if (!MIME_EXT[mime]) {
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

    // Sıkıştır: uzun kenar 1600 px, JPEG %80 — tipik sonuç 150-400 KB
    const compressed = await sharp(Buffer.from(buf))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

    const url = `data:image/jpeg;base64,${compressed.toString("base64")}`;
    const name = `haber-${crypto.randomUUID().slice(0, 12)}.jpg`;

    return NextResponse.json({
      success: true,
      url,
      name,
      bytes: compressed.length,
    });
  } catch (error) {
    console.error("[admin/upload]", error);
    return NextResponse.json(
      { success: false, error: "Görsel işlenemedi." },
      { status: 500 }
    );
  }
}
