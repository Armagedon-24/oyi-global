import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * GET /api/findings
 * Sorgu parametreleri: category, language, q, bookmarked, sort (recent|importance|newtech), limit
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? "all";
    const language = searchParams.get("language") ?? "all";
    const q = (searchParams.get("q") ?? "").trim();
    const bookmarked = searchParams.get("bookmarked") === "1";
    const sort = searchParams.get("sort") ?? "recent";
    const limit = Math.min(200, Math.max(1, Number(searchParams.get("limit")) || 60));

    const where: any = {};
    if (category !== "all") where.category = category;
    if (language !== "all") where.language = language;
    if (bookmarked) where.bookmarked = true;
    if (q) {
      where.OR = [
        { trTitle: { contains: q } },
        { trSummary: { contains: q } },
        { keywords: { contains: q } },
        { originalTitle: { contains: q } },
        { sourceName: { contains: q } },
      ];
    }

    const orderBy =
      sort === "importance"
        ? [{ importance: "desc" as const }, { createdAt: "desc" as const }]
        : sort === "newtech"
          ? [{ isNewTech: "desc" as const }, { importance: "desc" as const }, { createdAt: "desc" as const }]
          : [{ createdAt: "desc" as const }];

    const findings = await db.finding.findMany({
      where,
      orderBy,
      take: limit,
    });

    return NextResponse.json({ success: true, count: findings.length, findings });
  } catch (error) {
    console.error("[findings GET]", error);
    return NextResponse.json(
      { success: false, error: "Bulgular yüklenemedi" },
      { status: 500 }
    );
  }
}
