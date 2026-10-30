import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { CATEGORIES } from "@/lib/forensics-config";

export const runtime = "nodejs";

/**
 * POST /api/admin/findings  (admin)
 * Editörün elle haber eklemesi için: başlık + gövde metni + kategori +
 * istenirse birden çok görsel. Kayıt normal bir Finding olarak dergiye düşer;
 * Tam Oku penceresi fullArticle alanından tam metni anında gösterir.
 */

const VALID_CATEGORIES = new Set(CATEGORIES.map((c) => c.key));

interface IncomingImage {
  url?: unknown;
  alt?: unknown;
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Geçersiz istek gövdesi." },
        { status: 400 }
      );
    }

    const trTitle = String(body.trTitle ?? "").trim();
    const trSummary = String(body.trSummary ?? "").trim();
    const sourceName = String(body.sourceName ?? "").trim().slice(0, 120);
    const category = VALID_CATEGORIES.has(body.category) ? String(body.category) : "genel";
    const importance = Math.min(5, Math.max(1, Number(body.importance) || 4));
    const isNewTech = Boolean(body.isNewTech);
    const publishedDate =
      typeof body.publishedDate === "string" && body.publishedDate.trim()
        ? body.publishedDate.trim()
        : new Date().toISOString();

    if (trTitle.length < 4 || trTitle.length > 300) {
      return NextResponse.json(
        { success: false, error: "Başlık 4–300 karakter olmalı." },
        { status: 400 }
      );
    }
    if (trSummary.length < 20 || trSummary.length > 30000) {
      return NextResponse.json(
        { success: false, error: "Haber metni 20–30.000 karakter olmalı." },
        { status: 400 }
      );
    }

    // Görseller: yalnızca yerel /uploads yolları kabul edilir (elle eklenen haberlerde)
    const images: { url: string; alt: string }[] = Array.isArray(body.images)
      ? (body.images as IncomingImage[])
          .map((im) => ({
            url: typeof im?.url === "string" ? im.url.trim() : "",
            alt: typeof im?.alt === "string" ? im.alt.trim().slice(0, 200) : "",
          }))
          .filter((im) => im.url.startsWith("/uploads/") && !im.url.includes(".."))
          .slice(0, 8)
      : [];

    const now = new Date();
    const paragraphs = trSummary
      .split(/\n{2,}|\r\n{2,}|\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const fullArticle = JSON.stringify({
      title: trTitle,
      paragraphs,
      wordCount: paragraphs.join(" ").split(/\s+/).filter(Boolean).length,
      translated: true,
      fetchedAt: now.toISOString(),
      manual: true,
    });

    const finding = await db.finding.create({
      data: {
        scanId: null,
        url: `manual://oyi-${crypto.randomUUID()}`,
        originalTitle: trTitle,
        originalSnippet: trSummary.slice(0, 500),
        trTitle,
        trSummary,
        language: "tr",
        sourceName: sourceName || "OYİ GLOBAL Editörü",
        category,
        importance,
        isNewTech,
        keywords: JSON.stringify([]),
        publishedDate,
        images: JSON.stringify(images),
        fullArticle,
      },
    });

    return NextResponse.json({ success: true, finding });
  } catch (error) {
    console.error("[admin/findings POST]", error);
    return NextResponse.json(
      { success: false, error: "Haber kaydedilemedi." },
      { status: 500 }
    );
  }
}
