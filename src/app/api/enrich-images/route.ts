import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extractImagesFromArticle } from "@/lib/image-extract";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/enrich-images  Body: { limit? }
 * Görselsiz bulgulara (images="[]") makale görselleri çıkarır ve kaydeder.
 * Görsel bulunamazsa "none" işaretlenir (tekrar denenmez).
 * Mevcut arşivi tek seferlik zenginleştirmek ve yeni taramaların
 * görsel çıkarımını tamamlayamadığı kayıtları kurtarmak için kullanılır.
 * Yalnızca yönetici çalıştırabilir.
 */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json().catch(() => ({}));
    const limit = Math.min(15, Math.max(1, Number(body?.limit) || 8));

    const pending = await db.finding.findMany({
      where: { images: "[]" },
      orderBy: [{ importance: "desc" }, { createdAt: "desc" }],
      take: limit,
      select: { id: true, url: true },
    });

    if (pending.length === 0) {
      const remaining = await db.finding.count({ where: { images: "[]" } });
      return NextResponse.json({
        success: true,
        processed: 0,
        withImages: 0,
        remaining,
      });
    }

    let updated = 0;
    let withImages = 0;
    const CONCURRENCY = 4;
    let idx = 0;

    const worker = async () => {
      while (idx < pending.length) {
        const my = pending[idx++];
        if (!my) break;
        try {
          const imgs = await extractImagesFromArticle(my.url, 8);
          await db.finding.update({
            where: { id: my.id },
            data: { images: imgs.length > 0 ? JSON.stringify(imgs) : "none" },
          });
          updated += 1;
          if (imgs.length > 0) withImages += 1;
        } catch (err) {
          console.error(`[enrich-images] ${my.url}:`, err);
          await db.finding
            .update({ where: { id: my.id }, data: { images: "none" } })
            .catch(() => null);
        }
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, pending.length) }, worker)
    );

    const remaining = await db.finding.count({ where: { images: "[]" } });
    return NextResponse.json({
      success: true,
      processed: updated,
      withImages,
      remaining,
    });
  } catch (error) {
    console.error("[enrich-images]", error);
    return NextResponse.json(
      { success: false, error: "Zenginleştirme başarısız" },
      { status: 500 }
    );
  }
}

/** GET — durum özeti (kaç bulgu görsel bekliyor / kaçında görsel var) */
export async function GET() {
  try {
    const [pending, none, withImages, total] = await Promise.all([
      db.finding.count({ where: { images: "[]" } }),
      db.finding.count({ where: { images: "none" } }),
      db.finding.count({ where: { NOT: { images: { in: ["[]", "none"] } } } }),
      db.finding.count(),
    ]);
    return NextResponse.json({
      success: true,
      total,
      pending,
      none,
      withImages,
    });
  } catch (error) {
    console.error("[enrich-images GET]", error);
    return NextResponse.json(
      { success: false, error: "Durum alınamadı" },
      { status: 500 }
    );
  }
}
