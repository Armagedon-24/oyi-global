import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

/** DELETE /api/comments/[id] — yorumu siler (yalnızca yönetici) */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    await db.comment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[comments DELETE]", error);
    return NextResponse.json({ success: false, error: "Silinemedi" }, { status: 500 });
  }
}
