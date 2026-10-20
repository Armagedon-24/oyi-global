import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLanguage, prettySourceName, type ScanLanguage } from "@/lib/forensics-config";
import { searchWeb, translateAndClassifyBatch, type RawSearchItem, type TranslateInput } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_NEW_PER_STEP = 8; // Her adımda çevrilecek maksimum yeni bulgu
const MIN_SNIPPET_LEN = 25;

function isRelevant(item: RawSearchItem, lang: ScanLanguage): boolean {
  const haystack = `${item.name} ${item.snippet}`.toLowerCase();
  if (haystack.length < MIN_SNIPPET_LEN) return false;
  return lang.relevanceKeywords.some((kw) => haystack.includes(kw.toLowerCase()));
}

/**
 * POST /api/scan/step
 * Body: { scanId, langCode, focusCategory? }
 * Bir dil için: arama → alaka filtresi → tekrar eleme → çeviri → kayıt
 */
export async function POST(req: Request) {
  try {
    const { scanId, langCode, focusCategory } = await req.json();
    const lang = getLanguage(langCode);
    if (!lang) {
      return NextResponse.json({ success: false, error: "Geçersiz dil kodu" }, { status: 400 });
    }
    if (!scanId) {
      return NextResponse.json({ success: false, error: "scanId gerekli" }, { status: 400 });
    }

    // 1) Tüm sorguları paralel çalıştır
    const searchPromises = lang.queries.map((q) => searchWeb(q, 10, 365));
    const searchBatches = await Promise.all(searchPromises);

    // 2) Birleştir + URL'e göre tekrar ele
    const merged = new Map<string, RawSearchItem>();
    for (const batch of searchBatches) {
      for (const item of batch) {
        if (!item?.url) continue;
        const key = item.url.replace(/[#?].*$/, "");
        if (!merged.has(key)) {
          merged.set(key, { ...item, url: key });
        }
      }
    }
    const allResults = Array.from(merged.values());

    // 3) Alaka filtresi
    const relevant = allResults.filter((item) => isRelevant(item, lang));

    // 4) Veritabanında zaten var olan URL'leri çıkar
    const urls = relevant.map((r) => r.url);
    const existing = urls.length
      ? await db.finding.findMany({
          where: { url: { in: urls } },
          select: { url: true },
        })
      : [];
    const existingSet = new Set(existing.map((e) => e.url));
    const newItems = relevant.filter((r) => !existingSet.has(r.url));

    // 5) Odak kategori filtresi isteğe bağlı — çeviri öncesi kolay filtre yok,
    //    bu yüzden aday sayısını sınırla ve çeviri sonrası ele.
    const candidates: TranslateInput[] = newItems
      .slice(0, MAX_NEW_PER_STEP + 4)
      .map((item, i) => ({
        index: i,
        title: item.name ?? "",
        snippet: (item.snippet ?? "").slice(0, 700),
      }));

    // 6) LLM ile Türkçe çeviri + kategorizasyon
    const translated = await translateAndClassifyBatch(candidates, lang);

    // 7) Geçerli olanları veritabanına kaydet
    const savedFindings: Awaited<ReturnType<typeof db.finding.create>>[] = [];
    for (const tr of translated) {
      if (!tr.trTitle || tr.trTitle.length < 5) continue;

      const original = newItems[tr.index];
      if (!original) continue;

      // Odak kategori belirlendiyse farklı kategorileri atla
      if (focusCategory && focusCategory !== "all" && tr.category !== focusCategory) continue;

      try {
        const finding = await db.finding.create({
          data: {
            scanId,
            url: original.url,
            originalTitle: (original.name ?? "").slice(0, 500),
            originalSnippet: (original.snippet ?? "").slice(0, 1500),
            trTitle: tr.trTitle,
            trSummary: tr.trSummary,
            language: lang.code,
            sourceName: prettySourceName(original.url),
            category: tr.category,
            importance: tr.importance,
            isNewTech: tr.isNewTech,
            keywords: JSON.stringify(tr.keywords ?? []),
            publishedDate: original.date || null,
          },
        });
        savedFindings.push(finding);
        if (savedFindings.length >= MAX_NEW_PER_STEP) break;
      } catch (err: any) {
        // unique constraint vb. — tek kayıt hatası tüm adımı bozmasın
        if (!String(err?.message ?? "").includes("Unique constraint")) {
          console.error("[scan/step] Kayıt hatası:", err);
        }
      }
    }

    // 8) Tarama sayaçlarını güncelle
    await db.scanRun.update({
      where: { id: scanId },
      data: {
        languagesCovered: { increment: 1 },
        newItems: { increment: savedFindings.length },
      },
    }).catch(() => null);

    return NextResponse.json({
      success: true,
      langCode: lang.code,
      langName: lang.name,
      flag: lang.flag,
      searched: allResults.length,
      relevant: relevant.length,
      added: savedFindings.length,
      findings: savedFindings.map((f) => ({
        id: f.id,
        trTitle: f.trTitle,
        category: f.category,
        importance: f.importance,
      })),
    });
  } catch (error) {
    console.error("[scan/step]", error);
    return NextResponse.json(
      { success: false, error: "Tarama adımı başarısız oldu" },
      { status: 500 }
    );
  }
}
