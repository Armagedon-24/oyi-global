import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/** GET /api/stats — panel istatistikleri */
export async function GET() {
  try {
    const [total, bookmarked, newTech, lastScan, categoryGroups, languageGroups] =
      await Promise.all([
        db.finding.count(),
        db.finding.count({ where: { bookmarked: true } }),
        db.finding.count({ where: { isNewTech: true } }),
        db.scanRun.findFirst({ orderBy: { startedAt: "desc" } }),
        db.finding.groupBy({ by: ["category"], _count: { _all: true } }),
        db.finding.groupBy({ by: ["language"], _count: { _all: true } }),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        total,
        bookmarked,
        newTech,
        categories: categoryGroups.map((g) => ({ key: g.category, count: g._count._all })),
        languages: languageGroups.map((g) => ({ code: g.language, count: g._count._all })),
        lastScan: lastScan
          ? {
              id: lastScan.id,
              status: lastScan.status,
              scope: lastScan.scope,
              newItems: lastScan.newItems,
              languagesCovered: lastScan.languagesCovered,
              startedAt: lastScan.startedAt,
              completedAt: lastScan.completedAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("[stats]", error);
    return NextResponse.json(
      { success: false, error: "İstatistikler yüklenemedi" },
      { status: 500 }
    );
  }
}
