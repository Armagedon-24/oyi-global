import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateDeepAnalysis } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * POST /api/deep-dive
 * Body: { id } — bulgunun tam makalesini okur, yapılandırılmış Türkçe analiz üretir ve önbelleğe kaydeder
 */
export async function POST(req: Request) {
  try {
    const { id, force } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "id gerekli" }, { status: 400 });
    }

    const finding = await db.finding.findUnique({ where: { id } });
    if (!finding) {
      return NextResponse.json({ success: false, error: "Bulgu bulunamadı" }, { status: 404 });
    }

    // Önbellekte varsa ve zorlanmadıysa doğrudan döndür
    if (finding.deepAnalysis && !force) {
      return NextResponse.json({ success: true, cached: true, analysis: finding.deepAnalysis });
    }

    const analysis = await generateDeepAnalysis(
      finding.url,
      finding.originalTitle,
      finding.trTitle,
      finding.language
    );

    await db.finding.update({
      where: { id },
      data: { deepAnalysis: analysis },
    });

    return NextResponse.json({ success: true, cached: false, analysis });
  } catch (error) {
    console.error("[deep-dive]", error);
    return NextResponse.json(
      { success: false, error: "Derin analiz üretilemedi" },
      { status: 500 }
    );
  }
}
