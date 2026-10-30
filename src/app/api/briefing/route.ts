import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateBriefing } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Bir bulguyu bülten girdisine çevirir (llm.ts bekleyen form) */
function toBriefingItem(f: any) {
  return {
    trTitle: f.trTitle,
    trSummary: f.trSummary,
    category: f.category,
    importance: f.importance,
    isNewTech: f.isNewTech,
    language: f.language,
    sourceName: f.sourceName,
    publishedDate: f.publishedDate,
  };
}

/**
 * GET /api/briefing — en son üretilen bülteni döndürür.
 */
export async function GET() {
  try {
    const latest = await db.briefing.findFirst({
      orderBy: { createdAt: "desc" },
    });
    const totalFindings = await db.finding.count();

    return NextResponse.json({
      success: true,
      briefing: latest
        ? {
            id: latest.id,
            content: latest.content,
            itemCount: latest.itemCount,
            createdAt: latest.createdAt.toISOString(),
          }
        : null,
      totalFindings,
    });
  } catch (error) {
    console.error("[briefing GET]", error);
    return NextResponse.json(
      { success: false, error: "Bülten yüklenemedi" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/briefing — yeni bülten üretir ve önbelleğe kaydeder.
 * Gövde: { force?: boolean }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const force = Boolean(body?.force);

    // Aynı gün üretilmiş bülten varsa ve force yoksa onu döndür
    if (!force) {
      const latest = await db.briefing.findFirst({ orderBy: { createdAt: "desc" } });
      if (latest) {
        const ageHours = (Date.now() - latest.createdAt.getTime()) / 36e5;
        if (ageHours < 24) {
          return NextResponse.json({
            success: true,
            cached: true,
            briefing: {
              id: latest.id,
              content: latest.content,
              itemCount: latest.itemCount,
              createdAt: latest.createdAt.toISOString(),
            },
          });
        }
      }
    }

    // Kaynak bulgular: en güncel 45 kayıt
    const findings = await db.finding.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 45,
    });

    if (findings.length < 3) {
      return NextResponse.json(
        { success: false, error: "Bülten için yeterli bulgu yok. Önce küresel tarama yapın." },
        { status: 400 }
      );
    }

    // Önemli bulguları öne al: önem puanına göre sırala ama güncelliği koru
    const ranked = [...findings]
      .map((f) => ({ ...f, score: f.importance * 2 + (f.isNewTech ? 2 : 0) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);

    const content = await generateBriefing(ranked.map(toBriefingItem));

    const saved = await db.briefing.create({
      data: {
        content,
        itemCount: ranked.length,
      },
    });

    // Son 10 bülteni tut, eskilerini temizle
    const all = await db.briefing.findMany({ orderBy: { createdAt: "desc" }, skip: 10 });
    if (all.length > 0) {
      await db.briefing.deleteMany({
        where: { id: { in: all.map((b) => b.id) } },
      });
    }

    return NextResponse.json({
      success: true,
      cached: false,
      briefing: {
        id: saved.id,
        content: saved.content,
        itemCount: saved.itemCount,
        createdAt: saved.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[briefing POST]", error);
    return NextResponse.json(
      { success: false, error: "Bülten üretilemedi" },
      { status: 500 }
    );
  }
}
