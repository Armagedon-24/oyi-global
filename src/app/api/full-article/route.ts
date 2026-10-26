import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchAndTranslateFullArticle } from "@/lib/llm";
import { extractImagesFromArticle, type ExtractedImage } from "@/lib/image-extract";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Bulgunun görsellerini garanti eder (deep-dive rotasındaki desenin aynısı):
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
 * POST /api/full-article
 * Body: { id, force? } — makalenin TAM metnini orijinal kaynaktan okur,
 * Türkçeye çevirir ve önbelleğe kaydeder (Finding.fullArticle JSON).
 * Yanıt: { success, cached, paragraphs[], wordCount, translated, images[] }
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

    // Önbellekteki tam makale varsa ve zorlanmadıysa doğrudan döndür
    if (finding.fullArticle && !force) {
      try {
        const parsed = JSON.parse(finding.fullArticle);
        if (Array.isArray(parsed?.paragraphs)) {
          return NextResponse.json({
            success: true,
            cached: true,
            paragraphs: parsed.paragraphs as string[],
            wordCount: Number(parsed.wordCount) || 0,
            translated: Boolean(parsed.translated),
            images,
          });
        }
      } catch {
        /* bozuk önbellek → yeniden üret */
      }
    }

    const article = await fetchAndTranslateFullArticle(
      finding.url,
      finding.originalTitle,
      finding.trTitle,
      finding.language
    );

    // Sayfa hiç okunamadıysa önbelleğe alma — kullanıcı tekrar deneyebilsin
    if (article.paragraphs.length === 0) {
      return NextResponse.json({
        success: false,
        error: "unreachable",
        message:
          "Makalenin tam metni kaynağından okunamadı (sayfa erişime kapı olabilir). Kayıt özetiyle okunabilir veya orijinal kaynağa gidilebilir.",
        images,
      });
    }

    await db.finding
      .update({
        where: { id },
        data: {
          fullArticle: JSON.stringify({
            title: article.title,
            paragraphs: article.paragraphs,
            wordCount: article.wordCount,
            translated: article.translated,
            fetchedAt: new Date().toISOString(),
          }),
        },
      })
      .catch(() => null);

    return NextResponse.json({
      success: true,
      cached: false,
      paragraphs: article.paragraphs,
      wordCount: article.wordCount,
      translated: article.translated,
      images,
    });
  } catch (error) {
    console.error("[full-article]", error);
    return NextResponse.json(
      { success: false, error: "Tam makale getirilemedi" },
      { status: 500 }
    );
  }
}
