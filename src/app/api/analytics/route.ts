import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const WEEKS = 8;

/**
 * GET /api/analytics — trend ve analitik panel verisi
 * Kategori dağılımı, dil dağılımı, haftalık bulgu akışı, önem dağılımı,
 * en aktif kaynaklar, en sık geçen anahtar kelimeler ve yenilik oranı
 */
export async function GET() {
  try {
    const [
      total,
      newTech,
      categoryGroups,
      languageGroups,
      importanceGroups,
      sourceGroups,
      createdAtRows,
      keywordRows,
    ] = await Promise.all([
      db.finding.count(),
      db.finding.count({ where: { isNewTech: true } }),
      db.finding.groupBy({ by: ["category"], _count: { _all: true } }),
      db.finding.groupBy({ by: ["language"], _count: { _all: true } }),
      db.finding.groupBy({ by: ["importance"], _count: { _all: true } }),
      db.finding.groupBy({
        by: ["sourceName"],
        _count: { _all: true },
        orderBy: { _count: { sourceName: "desc" } },
        take: 10,
      }),
      db.finding.findMany({ select: { createdAt: true, isNewTech: true } }),
      db.finding.findMany({ select: { keywords: true } }),
    ]);

    // ---- Haftalık akış (son 8 hafta) ----
    const now = new Date();
    const weekBuckets: { label: string; start: Date; end: Date; count: number; newTech: number }[] = [];
    for (let i = WEEKS - 1; i >= 0; i--) {
      const end = new Date(now);
      end.setDate(end.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      weekBuckets.push({
        label: `${start.getDate()}.${start.getMonth() + 1}`,
        start,
        end,
        count: 0,
        newTech: 0,
      });
    }
    for (const row of createdAtRows) {
      const d = new Date(row.createdAt);
      const bucket = weekBuckets.find((b) => d >= b.start && d < b.end);
      if (bucket) {
        bucket.count += 1;
        if (row.isNewTech) bucket.newTech += 1;
      }
    }

    // ---- En sık anahtar kelimeler ----
    const keywordFreq = new Map<string, number>();
    for (const row of keywordRows) {
      try {
        const arr = JSON.parse(row.keywords);
        if (!Array.isArray(arr)) continue;
        for (const kw of arr) {
          const k = String(kw).trim().toLowerCase();
          if (k.length < 3) continue;
          keywordFreq.set(k, (keywordFreq.get(k) ?? 0) + 1);
        }
      } catch {
        // bozuk JSON atla
      }
    }
    const topKeywords = [...keywordFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([term, count]) => ({ term, count }));

    return NextResponse.json({
      success: true,
      analytics: {
        total,
        newTech,
        innovationRatio: total ? Math.round((newTech / total) * 100) : 0,
        categories: categoryGroups
          .map((g) => ({ key: g.category, count: g._count._all }))
          .sort((a, b) => b.count - a.count),
        languages: languageGroups
          .map((g) => ({ code: g.language, count: g._count._all }))
          .sort((a, b) => b.count - a.count),
        importance: importanceGroups
          .map((g) => ({ level: g.importance, count: g._count._all }))
          .sort((a, b) => a.level - b.level),
        sources: sourceGroups.map((g) => ({ name: g.sourceName || "Bilinmeyen", count: g._count._all })),
        weekly: weekBuckets.map(({ label, count, newTech: nt }) => ({ label, count, newTech: nt })),
        topKeywords,
      },
    });
  } catch (error) {
    console.error("[analytics]", error);
    return NextResponse.json(
      { success: false, error: "Analitik veriler yüklenemedi" },
      { status: 500 }
    );
  }
}
