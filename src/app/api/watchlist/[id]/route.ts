import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * DELETE /api/watchlist/[id] — izleme kelimesini sil
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.watchKeyword.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[watchlist DELETE]", error);
    return NextResponse.json(
      { success: false, error: "Silinemedi" },
      { status: 500 }
    );
  }
}
