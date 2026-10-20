/**
 * KrimiScan Global — Z-AI SDK yardımcıları
 * web_search, Türkçe çeviri/kategorizasyon ve derin analiz fonksiyonları
 */
import ZAI from "z-ai-web-dev-sdk";
import { CATEGORY_KEYS, categoryLabel, type ScanLanguage } from "./forensics-config";

let zaiInstance: ZAI | null = null;

export async function getZAI(): Promise<ZAI> {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export interface RawSearchItem {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
  date: string;
}

/** Bir sorgu için web araması yapar; hata olursa boş liste döner */
export async function searchWeb(query: string, num = 10, recencyDays = 365): Promise<RawSearchItem[]> {
  try {
    const zai = await getZAI();
    const results = (await zai.functions.invoke("web_search", {
      query,
      num,
      recency_days: recencyDays,
    })) as RawSearchItem[];
    return Array.isArray(results) ? results : [];
  } catch (err) {
    console.error(`[searchWeb] Arama hatası (${query}):`, err);
    return [];
  }
}

export interface TranslateInput {
  index: number;
  title: string;
  snippet: string;
}

export interface TranslatedFinding {
  index: number;
  trTitle: string;
  trSummary: string;
  category: string;
  importance: number; // 1-5
  isNewTech: boolean;
  keywords: string[];
}

const TRANSLATE_SYSTEM_PROMPT = `Sen uluslararası adli bilimler (forensic science) alanında uzmanlaşmış profesyonel bir çevirmen ve analistsin.
Görevin: Dünyanın dillerinden birinde gelen olay yeri inceleme / adli bilim haberlerini TÜRKÇE'ye çevirmek ve analiz etmek.

Her madde için şunları üret:
1. trTitle: Orijinal başlığın doğal ve profesyonel Türkçe çevirisi (teknik terimleri doğru kullan: "fingerprint" = "parmak izi", "trace evidence" = "iz delili", "chain of custody" = "delil zinciri" vb.)
2. trSummary: Orijinal özetin 2-4 cümlelik akıcı Türkçe özeti. İçerikteki teknik yeniliği, yöntemi ve önemi vurgula.
3. category: Şu anahtarlardan EN UYGUN olanı seç: ${CATEGORY_KEYS.join(", ")}
4. importance: 1-5 arası önem puanı (5 = alanı dönüştürecek büyük kırılma, 1 = sıradan haber)
5. isNewTech: İçerik somut bir YENİ teknik/teknoloji/araç/cihaz tanıtıyorsa true, yoksa false
6. keywords: 3-5 adet TÜRKÇE anahtar kelime (uzman terminolojisiyle)

YALNIZCA geçerli JSON döndür. Biçim:
[{"index":0,"trTitle":"...","trSummary":"...","category":"dna","importance":4,"isNewTech":true,"keywords":["a","b","c"]}]`;

/** LLM ile toplu çeviri + kategorizasyon. Hata durumunda kısmi sonuç döner. */
export async function translateAndClassifyBatch(
  items: TranslateInput[],
  lang: ScanLanguage
): Promise<TranslatedFinding[]> {
  if (items.length === 0) return [];

  const userPrompt = `Kaynak dil: ${lang.name} (${lang.code}).
Aşağıdaki ${items.length} adet adli bilimler / olay yeri inceleme haberini Türkçe'ye çevir ve analiz et.
Dikkat: Reklam, genel haber, alakasız içerik varsa category="genel", importance=1 ver.

GIRDİ (JSON):
${JSON.stringify(items, null, 1)}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: TRANSLATE_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        thinking: { type: "disabled" },
      });

      const raw = completion?.choices?.[0]?.message?.content ?? "";
      const parsed = extractJsonArray(raw);
      if (!parsed) throw new Error("JSON ayrıştırılamadı");

      const valid = parsed
        .filter((it: any) => typeof it?.index === "number" && it?.trTitle)
        .map((it: any) => ({
          index: it.index,
          trTitle: String(it.trTitle).slice(0, 300),
          trSummary: String(it.trSummary ?? "").slice(0, 1200),
          category: CATEGORY_KEYS.includes(it.category) ? it.category : "genel",
          importance: Math.min(5, Math.max(1, Number(it.importance) || 3)),
          isNewTech: Boolean(it.isNewTech),
          keywords: Array.isArray(it.keywords)
            ? it.keywords.slice(0, 5).map((k: any) => String(k).slice(0, 40))
            : [],
        })) as TranslatedFinding[];

      if (valid.length > 0) return valid;
      throw new Error("Geçerli sonuç boş");
    } catch (err) {
      console.error(`[translateBatch] Deneme ${attempt} başarısız:`, err);
      if (attempt === 2) {
        // Fallback: çevrilmemiş ama kayıtlı olsun
        return items.map((it) => ({
          index: it.index,
          trTitle: it.title.slice(0, 300),
          trSummary: it.snippet.slice(0, 500) + " [Otomatik çeviri başarısız oldu]",
          category: "genel",
          importance: 2,
          isNewTech: false,
          keywords: [],
        }));
      }
      await new Promise((r) => setTimeout(r, 1200));
    }
  }
  return [];
}

/** Metin içinden JSON dizisini çıkarır (kod bloğu / ek met toleranslı) */
function extractJsonArray(text: string): any[] | null {
  if (!text) return null;
  const cleaned = text.replace(/```json/gi, "```").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

/**
 * Derin analiz: sayfanın tam metnini okuyup yapılandırılmış Türkçe rapor üretir.
 * Dönen değer markdown formatındadır.
 */
export async function generateDeepAnalysis(
  url: string,
  originalTitle: string,
  trTitle: string,
  language: string
): Promise<string> {
  let pageText = "";
  try {
    const zai = await getZAI();
    const page = (await zai.functions.invoke("page_reader", { url })) as any;
    const html: string = page?.data?.html ?? "";
    pageText = stripHtml(html).slice(0, 6000);
  } catch (err) {
    console.error("[generateDeepAnalysis] Sayfa okunamadı:", err);
  }

  const fallbackText = pageText
    ? pageText
    : `Sayfa içeriği okunamadı. Yalnızca başlık kullanılabilir: ${originalTitle}`;

  const prompt = `Aşağıda ${language} dilinde yayınlanmış, olay yeri inceleme / adli bilimler alanındaki bir makalenin tam metni var.

MAKALE BAŞLIĞI: ${originalTitle}
URL: ${url}

MAKALE İÇERİĞİ:
${fallbackText}

GÖREV: Bu makalenin profesyonel ve derinlemesine bir TÜRKÇE analiz raporu yaz. Adli bilimler uzmanı bir olay yeri inceleme görevlisine hitap ediyormuş gibi, teknik ve net bir dille yaz.

Raporu tam olarak şu markdown yapısıyla üret:

## 📋 Genel Bakış
(2-3 cümle: makalenin konusu ve neden önemli olduğu)

## 🔬 Teknik Detaylar
(Makalede anlatılan yöntem/teknoloji/araç teknik olarak nasıl çalışıyor? Madde işaretleriyle açıkla. İçerikte bilgi yoksa makale bağlamından makul çıkarımlar yap ama uydurma.)

## 🎯 Olay Yeri İncelemesine Katkısı
(Bu gelişme olay yeri inceleme süreçlerini nasıl iyileştiriyor? Kanıt toplanma, doğruluk, hız, maliyet boyutlarında değerlendir.)

## 🌍 Küresel Bağlam
(Bu teknoloji dünyada hangi ülkelerde/kurumlarda geliştiriliyor veya kullanılıyor; benzer gelişmelerle karşılaştırma.)

## 🇹🇷 Türkiye İçin Çıkarımlar
(Türkiye'deki adli birimler ve olay yeri inceleme ekipleri için bu gelişmenin ne anlamı var, nasıl faydalanılabilir.)

## ⚠️ Sınırlılıklar ve Etik Boyut
(Teknolojinin eksileri, hukuki/etik tartışmaları, standart süreçler varsa belirt.)

Uyarılar:
- YALNIZCA markdown üret, giriş/cıkış cümleleri ekleme.
- Makalede olmayan bilgiyi uydurma; emin olmadığın yerde "makalede belirtilmemiştir" de.
- Teknik terimlerin Türkçe karşılıklarını parantez içinde orijinaliyle ver.`;

  try {
    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content:
            "Sen adli bilimler ve olay yeri inceleme alanında uzmanlaşmış bir analistsin. Yalnızca istenen markdown raporu üretirsin.",
        },
        { role: "user", content: prompt },
      ],
      thinking: { type: "disabled" },
    });
    const content = completion?.choices?.[0]?.message?.content ?? "";
    if (content.trim().length > 100) return content.trim();
    throw new Error("Analiz içeriği çok kısa");
  } catch (err) {
    console.error("[generateDeepAnalysis] LLM hatası:", err);
    return `## ⚠️ Analiz Üretilemedi\n\nBu bulgu için derin analiz şu anda üretilemedi. Lütfen birazdan tekrar deneyin.\n\n**Kaynak:** ${url}`;
  }
}

/** Basit HTML temizleyici */
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export { categoryLabel };
