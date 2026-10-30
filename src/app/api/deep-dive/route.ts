import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateDeepAnalysis } from "@/lib/llm";
import { extractImagesFromArticle, type ExtractedImage } from "@/lib/image-extract";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Bulgunun görsellerini garanti eder:
 *  - "none" işaretliyse tekrar denemez (boş döner)
 *  - kayıtlı görsel varsa doğrudan döner
 *  - hiç denenmemişse ("[]") makaleden çıkarıp veritabanına kaydeder
 */
async function ensureFindingImages(finding: {
  id: string;
  url: string;
  images: string | null;
}): Promise<ExtractedImage[]> {
  const raw = finding.images ?? "[]";
  if (raw === "none") return [];

  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.length > 0) return arr as ExtractedImage[];
  } catch {
    /* bozuk JSON → yeniden çıkar */
  }

  try {
    const imgs = await extractImagesFromArticle(finding.url, 8);
    await db.finding
      .update({
        where: { id: finding.id },
        data: { images: imgs.length > 0 ? JSON.stringify(imgs) : "none" },
      })
      .catch(() => null);
    return imgs;
  } catch {
    return [];
  }
}

/**
 * POST /api/deep-dive
 * Body: { id, force? } — bulgunun tam makalesini okur, yapılandırılmış Türkçe
 * analiz üretir, makale görsellerini (fotoğraf/çizim) çıkarır ve önbelleğe kaydeder.
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

    // Görseller önbellekten bağımsız olarak garanti edilir
    const images = await ensureFindingImages(finding);

    // Önbellekteki analiz varsa ve zorlanmadıysa görsellerle birlikte döndür
    if (finding.deepAnalysis && !force) {
      return NextResponse.json({
        success: true,
        cached: true,
        analysis: finding.deepAnalysis,
        images,
      });
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

    return NextResponse.json({ success: true, cached: false, analysis, images });
  } catch (error) {
    console.error("[deep-dive]", error);
    return NextResponse.json(
      { success: false, error: "Derin analiz üretilemedi" },
      { status: 500 }
    );
  }
}
