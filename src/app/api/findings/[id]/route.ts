import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * PATCH /api/findings/[id]
 * Yer imi, okundu durumu ve kişisel not güncellemesi.
 */
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

    const data: { bookmarked?: boolean; isRead?: boolean; notes?: string | null } = {};

    if (typeof body.bookmarked === "boolean") {
      data.bookmarked = body.bookmarked;
    } else if (body.toggleBookmark === true) {
      data.bookmarked = !existing.bookmarked;
    }

    if (typeof body.isRead === "boolean") {
      data.isRead = body.isRead;
    } else if (body.toggleRead === true) {
      data.isRead = !existing.isRead;
    }

    if (typeof body.notes === "string") {
      data.notes = body.notes.trim().slice(0, 4000) || null;
    } else if (body.clearNotes === true) {
      data.notes = null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: "Güncellenecek alan yok" },
        { status: 400 }
      );
    }

    const updated = await db.finding.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      bookmarked: updated.bookmarked,
      isRead: updated.isRead,
      notes: updated.notes,
    });
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
