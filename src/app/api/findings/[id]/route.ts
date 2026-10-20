import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/** PATCH /api/findings/[id] — yer imi durumunu değiştirir */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const existing = await db.finding.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Bulgu bulunamadı" }, { status: 404 });
    }

    const bookmarked = typeof body.bookmarked === "boolean" ? body.bookmarked : !existing.bookmarked;

    const updated = await db.finding.update({
      where: { id },
      data: { bookmarked },
    });

    return NextResponse.json({ success: true, bookmarked: updated.bookmarked });
  } catch (error) {
    console.error("[findings PATCH]", error);
    return NextResponse.json(
      { success: false, error: "Güncellenemedi" },
      { status: 500 }
    );
  }
}

/** DELETE /api/findings/[id] — bulguyu siler */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.finding.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[findings DELETE]", error);
    return NextResponse.json(
      { success: false, error: "Silinemedi" },
      { status: 500 }
    );
  }
}
