import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET /api/image-proxy?url=<görsel URL'si>
 * Harici makale görsellerini sunucu üzerinden aktarır:
 *  - Hotlink koruması olan siteleri aşar (Referer/UA taklidi)
 *  - Tarayıcıda mixed-content uyarısı olmadan http görselleri gösterir
 *  - 24 saat tarayıcı önbelleği ile tekrar yüklemeleri engeller
 */

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

/** Özel ağ adresleri (SSRF koruması) */
const PRIVATE_HOST =
  /^(localhost$|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|::1$)/i;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("url");
  if (!raw) {
    return new NextResponse("url parametresi gerekli", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new NextResponse("Geçersiz url", { status: 400 });
  }
  if (!/^https?:$/.test(target.protocol)) {
    return new NextResponse("Yalnızca http/https kabul edilir", { status: 400 });
  }
  if (PRIVATE_HOST.test(target.hostname)) {
    return new NextResponse("Erişilemez ana makine", { status: 403 });
  }

  try {
    const upstream = await fetch(target.href, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        Referer: `${target.origin}/`,
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    if (!upstream.ok) {
      return new NextResponse("Görsel alınamadı", { status: 502 });
    }
    const ct = (upstream.headers.get("content-type") ?? "image/jpeg")
      .split(";")[0]
      .trim()
      .toLowerCase();
    if (!ct.startsWith("image/")) {
      return new NextResponse("İçerik bir görsel değil", { status: 502 });
    }
    const buf = await upstream.arrayBuffer();
    if (buf.byteLength > 12_000_000) {
      return new NextResponse("Görsel çok büyük", { status: 502 });
    }

    return new NextResponse(buf, {
      headers: {
        "Content-Type": ct,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Görsel alınamadı", { status: 502 });
  }
}
