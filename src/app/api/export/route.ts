import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * GET /api/export?format=csv|json
 * Tüm arşivi CSV veya JSON olarak dosya indirmesiyle döndürür.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") === "json" ? "json" : "csv";

    const findings = await db.finding.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        trTitle: true,
        trSummary: true,
        originalTitle: true,
        originalSnippet: true,
        category: true,
        importance: true,
        isNewTech: true,
        language: true,
        sourceName: true,
        url: true,
        publishedDate: true,
        keywords: true,
        bookmarked: true,
        isRead: true,
        notes: true,
        createdAt: true,
      },
    });

    const dateStr = new Date().toISOString().slice(0, 10);
    // HTTP başlıkları yalnızca ByteString kabul eder — dosya adı ASCII olmalı
    const filenameBase = `oyi-global-arsiv-${dateStr}`;

    if (format === "json") {
      const payload = {
        application: "OYİ GLOBAL",
        exportedAt: new Date().toISOString(),
        total: findings.length,
        findings: findings.map((f) => ({
          ...f,
          keywords: (() => {
            try {
              const arr = JSON.parse(f.keywords);
              return Array.isArray(arr) ? arr : [];
            } catch {
              return [];
            }
          })(),
        })),
      };
      return new NextResponse(JSON.stringify(payload, null, 2), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filenameBase}.json"`,
        },
      });
    }

    // CSV (Excel uyumluluğu için UTF-8 BOM + ; ayırıcı)
    const headers = [
      "Türkçe Başlık",
      "Türkçe Özet",
      "Orijinal Başlık",
      "Kategori",
      "Önem (1-5)",
      "Yeni Teknoloji",
      "Kaynak Dil",
      "Kaynak Adı",
      "URL",
      "Yayın Tarihi",
      "Anahtar Kelimeler",
      "Yer İmi",
      "Okundu",
      "Notlar",
      "Arşive Eklenme",
    ];

    const rows = findings.map((f) =>
      [
        f.trTitle,
        f.trSummary,
        f.originalTitle,
        f.category,
        f.importance,
        f.isNewTech ? "Evet" : "Hayır",
        f.language.toUpperCase(),
        f.sourceName,
        f.url,
        f.publishedDate ?? "",
        f.keywords,
        f.bookmarked ? "Evet" : "Hayır",
        f.isRead ? "Evet" : "Hayır",
        f.notes ?? "",
        f.createdAt.toISOString(),
      ]
        .map(csvEscape)
        .join(";")
    );

    const csv = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filenameBase}.csv"`,
      },
    });
  } catch (error) {
    console.error("[export GET]", error);
    return NextResponse.json(
      { success: false, error: "Dışa aktarma başarısız" },
      { status: 500 }
    );
  }
}
