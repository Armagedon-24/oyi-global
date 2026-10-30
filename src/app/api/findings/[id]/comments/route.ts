import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/** Basit IP tabanlı hız sınırı: 10 dakikada en fazla 6 yorum (bellek içi) */
const rateBucket = new Map<string, number[]>();
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : null) || req.headers.get("x-real-ip") || "yerel";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateBucket.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) {
    rateBucket.set(ip, hits);
    return true;
  }
  hits.push(now);
  rateBucket.set(ip, hits);
  return false;
}

/** GET /api/findings/[id]/comments — haberin yorumlarını listeler (en yeni önce) */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const comments = await db.comment.findMany({
      where: { findingId: id },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { id: true, author: true, body: true, createdAt: true },
    });
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error("[comments GET]", error);
    return NextResponse.json(
      { success: false, error: "Yorumlar yüklenemedi" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/findings/[id]/comments — habere yorum ekler.
 * Gövde: { author?: string, body: string, website?: string (bal küpü — boş olmalı) }
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await req.json().catch(() => ({}));

    // Bal küpü: gizli alan doluysa bot isteğidir — sessizce başarı yanıtı verip kaydetmez
    if (typeof payload.website === "string" && payload.website.trim().length > 0) {
      return NextResponse.json({ success: true, filtered: true });
    }

    const body = typeof payload.body === "string" ? payload.body.trim() : "";
    const authorRaw = typeof payload.author === "string" ? payload.author.trim() : "";
    const author = (authorRaw || "Anonim Okur").slice(0, 40);

    if (body.length < 2 || body.length > 1500) {
      return NextResponse.json(
        { success: false, error: "Yorum 2 ile 1500 karakter arasında olmalı." },
        { status: 400 }
      );
    }

    const ip = clientIp(req);
    if (rateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Çok fazla yorum gönderdiniz. Bir süre sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const finding = await db.finding.findUnique({ where: { id }, select: { id: true } });
    if (!finding) {
      return NextResponse.json({ success: false, error: "Haber bulunamadı" }, { status: 404 });
    }

    const comment = await db.comment.create({
      data: { findingId: id, author, body, ip },
      select: { id: true, author: true, body: true, createdAt: true },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("[comments POST]", error);
    return NextResponse.json(
      { success: false, error: "Yorum kaydedilemedi" },
      { status: 500 }
    );
  }
}
