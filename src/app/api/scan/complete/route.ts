import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/** POST /api/scan/complete — tarama oturumunu tamamlanmış işaretler */
export async function POST(req: Request) {
  try {
    const { scanId } = await req.json();
    if (!scanId) {
      return NextResponse.json({ success: false, error: "scanId gerekli" }, { status: 400 });
    }

    const scan = await db.scanRun.update({
      where: { id: scanId },
      data: { status: "completed", completedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      scan: {
        id: scan.id,
        status: scan.status,
        newItems: scan.newItems,
        languagesCovered: scan.languagesCovered,
        completedAt: scan.completedAt,
      },
    });
  } catch (error) {
    console.error("[scan/complete]", error);
    return NextResponse.json(
      { success: false, error: "Tarama tamamlanamadı" },
      { status: 500 }
    );
  }
}
