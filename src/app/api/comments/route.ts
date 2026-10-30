import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * GET /api/comments — tüm yorumlar (yönetici moderasyonu).
 * Sorgu: limit (varsayılan 40)
 */
export async function GET(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(200, Math.max(1, Number(searchParams.get("limit")) || 40));

    const [comments, total] = await Promise.all([
      db.comment.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { finding: { select: { id: true, trTitle: true } } },
      }),
      db.comment.count(),
    ]);

    return NextResponse.json({
      success: true,
      total,
      comments: comments.map((c) => ({
        id: c.id,
        author: c.author,
        body: c.body,
        createdAt: c.createdAt,
        findingId: c.finding.id,
        findingTitle: c.finding.trTitle,
      })),
    });
  } catch (error) {
    console.error("[comments admin GET]", error);
    return NextResponse.json(
      { success: false, error: "Yorumlar yüklenemedi" },
      { status: 500 }
    );
  }
}
