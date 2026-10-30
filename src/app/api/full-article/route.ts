import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  fetchAndTranslateFullArticle,
  isHomepageUrl,
  resolveRealArticleUrl,
} from "@/lib/llm";
import { extractImagesFromArticle, type ExtractedImage } from "@/lib/image-extract";

export const runtime = "nodejs";
export const maxDuration = 60;

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

/** Uzun sürebilecek işlemleri yumuşak zaman aşımına bağlar (taşarsa yedek değeri döner) */
async function softTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p.catch(() => fallback),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

/**
 * POST /api/full-article
 * Body: { id, force? } — makalenin TAM metnini orijinal kaynaktan okur,
 * Türkçeye çevirir ve önbelleğe kaydeder (Finding.fullArticle JSON).
 * Yanıt: { success, cached, paragraphs[], wordCount, translated, images[] }
 * Önbellek v2 işaretli değilse (eski/junk kayıt) içerik yenilenir.
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

    // Önbellekteki tam makale varsa ve zorlanmadıysa doğrudan döndür.
    // Görsel çıkarımı paralel yürür, 8 sn'yi aşarsa yanıtı bloklamaz.
    if (finding.fullArticle && !force) {
      try {
        const parsed = JSON.parse(finding.fullArticle);
        const cacheValid =
          Array.isArray(parsed?.paragraphs) &&
          parsed.paragraphs.length > 0 &&
          parsed?.v === 2; // v2 = yeni çıkarım zincirinin kaliteli önbelleği
        if (cacheValid) {
          const images = await softTimeout(ensureFindingImages(finding), 8000, [] as ExtractedImage[]);
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

    // Görseller makale getirmesiyle PARALEL yürür; 12 sn'yi aşarsa boş listeyle geçilir
    const imagesPromise = softTimeout(ensureFindingImages(finding), 12000, [] as ExtractedImage[]);

    // Ana sayfa URL'li kayıtlar: makale o adreste yoktur. Önce orijinal başlıkla
    // aynı alan adındaki gerçek makale adresi aranır; bulunamazsa temizce özete düşülür.
    let targetUrl = finding.url;
    if (isHomepageUrl(finding.url)) {
      const resolved = await resolveRealArticleUrl(finding.originalTitle, finding.url).catch(
        () => null
      );
      if (!resolved) {
        const images = await imagesPromise;
        return NextResponse.json({
          success: false,
          error: "no_article",
          message:
            "Bu kayıt kaynağın ana sayfasına işaret ediyor; makalenin tam metni bu adreste bulunamadı. Kayıt özetiyle okunabilir veya orijinal kaynağa gidilebilir.",
          images,
        });
      }
      targetUrl = resolved;
      // Çözülen gerçek adresi kayda işle — sonraki açılışlar doğrudan makaleyi okur
      await db.finding
        .update({ where: { id }, data: { url: resolved } })
        .catch(() => null);
    }

    const article = await fetchAndTranslateFullArticle(
      targetUrl,
      finding.originalTitle,
      finding.trTitle,
      finding.language
    );

    // Sayfa hiç okunamadıysa önbelleğe alma — kullanıcı tekrar deneyebilsin
    if (article.paragraphs.length === 0) {
      const images = await imagesPromise;
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
            v: 2,
            title: article.title,
            paragraphs: article.paragraphs,
            wordCount: article.wordCount,
            translated: article.translated,
            engine: article.engine,
            fetchedAt: new Date().toISOString(),
          }),
        },
      })
      .catch(() => null);

    const images = await imagesPromise;
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
