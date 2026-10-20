import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * GET /api/watchlist — izlenen anahtar kelimeler ve tüm arşivdeki eşleşme sayıları
 */
export async function GET() {
  try {
    const keywords = await db.watchKeyword.findMany({ orderBy: { createdAt: "desc" } });

    const matchWhere = (term: string) => ({
      OR: [
        { trTitle: { contains: term } },
        { trSummary: { contains: term } },
        { keywords: { contains: term } },
      ],
    });

    const withCounts = await Promise.all(
      keywords.map(async (kw) => {
        const [count, lastMatch] = await Promise.all([
          db.finding.count({ where: matchWhere(kw.term) }),
          db.finding.findFirst({
            where: matchWhere(kw.term),
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);
        return {
          id: kw.id,
          term: kw.term,
          matchCount: count,
          lastMatchAt: lastMatch?.createdAt ?? null,
        };
      })
    );

    return NextResponse.json({ success: true, keywords: withCounts });
  } catch (error) {
    console.error("[watchlist GET]", error);
    return NextResponse.json(
      { success: false, error: "İzleme listesi yüklenemedi" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/watchlist — yeni anahtar kelime ekle { term }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const term = String(body?.term ?? "").trim();
    if (term.length < 2 || term.length > 60) {
      return NextResponse.json(
        { success: false, error: "Anahtar kelime 2-60 karakter olmalı" },
        { status: 400 }
      );
    }

    const existing = await db.watchKeyword.findUnique({ where: { term } });
    if (existing) {
      return NextResponse.json({ success: true, keyword: existing, already: true });
    }

    const created = await db.watchKeyword.create({ data: { term } });
    return NextResponse.json({ success: true, keyword: created });
  } catch (error) {
    console.error("[watchlist POST]", error);
    return NextResponse.json(
      { success: false, error: "Anahtar kelime eklenemedi" },
      { status: 500 }
    );
  }
}
