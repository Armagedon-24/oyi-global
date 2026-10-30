/**
 * OYİ GLOBAL — Z-AI SDK yardımcıları
 * web_search, Türkçe çeviri/kategorizasyon ve derin analiz fonksiyonları
 */
import ZAI from "z-ai-web-dev-sdk";
import { CATEGORY_KEYS, categoryLabel, type ScanLanguage } from "./forensics-config";

let zaiInstance: ZAI | null = null;
let zaiInitPromise: Promise<ZAI> | null = null;

/**
 * ZAI istemcisini döndürür.
 * Öncelik sırası:
 *  1) ZAI_BASE_URL + ZAI_API_KEY ortam değişkenleri (Vercel/Netlify vb. bulut
 *     dağıtımlarında .z-ai-config dosyası bulunamadığı için gereklidir),
 *  2) standart .z-ai-config dosyası (yerel geliştirme ortamı).
 */
export async function getZAI(): Promise<ZAI> {
  if (zaiInstance) return zaiInstance;
  if (!zaiInitPromise) {
    zaiInitPromise = (async () => {
      const baseUrl = process.env.ZAI_BASE_URL?.trim();
      const apiKey = process.env.ZAI_API_KEY?.trim();
      if (baseUrl && apiKey) {
        // SDK kurucusu tip tanımında private olarak işaretlidir; ortam
        // değişkenleriyle doğrudan yapılandırma için güvenli tip geçişi gerekir.
        const Ctor = ZAI as unknown as new (config: Record<string, string>) => ZAI;
        zaiInstance = new Ctor({
          baseUrl,
          apiKey,
          chatId: process.env.ZAI_CHAT_ID?.trim() ?? "",
          userId: process.env.ZAI_USER_ID?.trim() ?? "",
          token: process.env.ZAI_TOKEN?.trim() ?? "",
        });
        return zaiInstance;
      }
      zaiInstance = await ZAI.create();
      return zaiInstance;
    })();
    zaiInitPromise.catch(() => {
      // Başarısız init sonrası tekrar denemeye izin ver
      zaiInitPromise = null;
    });
  }
  return zaiInitPromise;
}

export interface RawSearchItem {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
  date: string;
}

/**
 * Bir sorgu için web araması yapar; hata olursa boş liste döner.
 * Önce Z-AI web_search denenir; kullanılamıyorsa (yapılandırma eksik,
 * ağ erişimi yok — ör. Vercel) DuckDuckGo HTML aramasına düşülür.
 */
export async function searchWeb(query: string, num = 10, recencyDays = 365): Promise<RawSearchItem[]> {
  try {
    const zai = await getZAI();
    const results = (await zai.functions.invoke("web_search", {
      query,
      num,
      recency_days: recencyDays,
    })) as RawSearchItem[];
    if (Array.isArray(results) && results.length > 0) return results;
  } catch (err) {
    console.error(`[searchWeb] Z-AI araması başarısız (${query}), yedeğe düşülüyor:`, err);
  }
  const ddg = await searchWebDuckDuckGo(query, num).catch(() => []);
  if (ddg.length > 0) return ddg;
  const bing = await searchWebBingNewsRss(query, num).catch(() => []);
  if (bing.length > 0) return bing;
  return searchWebGoogleNewsRss(query, num);
}

const DDG_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

/**
 * DuckDuckGo HTML araması (API anahtarı gerektirmez). Z-AI web_search
 * kullanılamadığında yedek arama motoru olarak çalışır.
 */
export async function searchWebDuckDuckGo(query: string, num = 10): Promise<RawSearchItem[]> {
  try {
    const res = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent": DDG_UA,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "tr,en;q=0.8",
        },
        signal: AbortSignal.timeout(15000),
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const html = await res.text();

    const anchorRe = /<a\s([^>]*class="[^"]*result__a[^"]*"[^>]*)>([\s\S]*?)<\/a>/g;
    const snippetRe = /<a\s([^>]*class="[^"]*result__snippet[^"]*"[^>]*)>([\s\S]*?)<\/a>/g;

    const snippets: string[] = [];
    let sm: RegExpExecArray | null;
    while ((sm = snippetRe.exec(html)) !== null) {
      snippets.push(tagText(sm[2]).slice(0, 600));
    }

    const items: RawSearchItem[] = [];
    let m: RegExpExecArray | null;
    while ((m = anchorRe.exec(html)) !== null && items.length < num) {
      const hrefMatch = m[1].match(/href="([^"]+)"/);
      if (!hrefMatch) continue;
      let href = hrefMatch[1].replace(/&amp;/g, "&");
      if (href.startsWith("//")) href = `https:${href}`;
      if (/duckduckgo\.com\/l\//i.test(href)) {
        try {
          const real = new URL(href).searchParams.get("uddg");
          if (!real) continue;
          href = real;
        } catch {
          continue;
        }
      }
      if (!/^https?:\/\//i.test(href)) continue;
      if (/duckduckgo\.com\/y\.js/i.test(href)) continue; // reklam bağlantısı
      const title = tagText(m[2]);
      if (!title || title.length < 3) continue;
      let host = "";
      try {
        host = new URL(href).hostname;
      } catch {
        continue;
      }
      items.push({
        url: href,
        name: title,
        snippet: snippets[items.length] ?? "",
        host_name: host,
        date: "",
      });
    }
    return items;
  } catch (err) {
    console.error(`[searchWebDuckDuckGo] Arama hatası (${query}):`, err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Ücretsiz HTTP çeviri zinciri — Z-AI kullanılamadığında yedek        */
/* Sıra: Google clients5 → Google gtx → MyMemory                       */
/* ------------------------------------------------------------------ */

/** Metni cümle/sözcük sınırından taşmadan parçalara böler */
function splitForHttpTranslate(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const parts: string[] = [];
  let rest = text;
  while (rest.length > maxLen) {
    const window = rest.slice(0, maxLen);
    let cut = -1;
    for (const sep of [". ", "! ", "? ", "; ", ", ", " "]) {
      const idx = window.lastIndexOf(sep);
      if (idx > maxLen * 0.5) {
        cut = idx + sep.length;
        break;
      }
    }
    if (cut <= 0) cut = maxLen;
    parts.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest.trim()) parts.push(rest);
  return parts;
}

async function translateViaClients5(text: string, src: string): Promise<string> {
  const res = await fetch(
    `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${encodeURIComponent(src)}&tl=tr&q=${encodeURIComponent(text)}`,
    { headers: { "User-Agent": DDG_UA }, signal: AbortSignal.timeout(9000), cache: "no-store" }
  );
  if (!res.ok) return "";
  const data: unknown = await res.json();
  if (Array.isArray(data) && Array.isArray(data[0])) {
    return (data[0] as unknown[])
      .map((seg) => (Array.isArray(seg) ? String(seg[0] ?? "") : String(seg ?? "")))
      .join("")
      .trim();
  }
  if (Array.isArray(data) && typeof data[0] === "string") return (data[0] as string).trim();
  return "";
}

async function translateViaGtx(text: string, src: string): Promise<string> {
  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(src)}&tl=tr&dt=t&q=${encodeURIComponent(text)}`,
    { headers: { "User-Agent": DDG_UA }, signal: AbortSignal.timeout(12000), cache: "no-store" }
  );
  if (!res.ok) return "";
  const data: unknown = await res.json();
  if (Array.isArray(data) && Array.isArray(data[0])) {
    return (data[0] as unknown[]).map((seg) => String((seg as unknown[])?.[0] ?? "")).join("").trim();
  }
  return "";
}

async function translateViaMyMemory(text: string, src: string): Promise<string> {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 450))}&langpair=${encodeURIComponent(src)}|tr`,
    { headers: { "User-Agent": DDG_UA }, signal: AbortSignal.timeout(9000), cache: "no-store" }
  );
  if (!res.ok) return "";
  const data: any = await res.json();
  const t = data?.responseData?.translatedText;
  return typeof t === "string" && !/^MYMEMORY WARNING/i.test(t) ? t.trim() : "";
}

/**
 * Z-AI kullanılamadığında (örn. Vercel) ücretsiz servislerle Türkçeye çevirir.
 * Hepsinin başarısız olduğu durumda boş metin döner; çağıran taraf orijinali kullanır.
 */
export async function httpTranslate(text: string, src = "auto"): Promise<string> {
  const clean = (text ?? "").trim();
  if (!clean) return "";
  const source = src && src.trim().length >= 2 ? src.trim() : "auto";
  const out: string[] = [];
  for (const part of splitForHttpTranslate(clean, 1200)) {
    try {
      const t =
        (await translateViaClients5(part, source).catch(() => "")) ||
        (await translateViaGtx(part, source).catch(() => "")) ||
        (await translateViaMyMemory(part, source).catch(() => ""));
      if (!t) return "";
      out.push(t);
    } catch {
      return "";
    }
  }
  return out.join(" ").trim();
}

/**
 * Google News RSS araması (anahtar gerektirmez, bot engellemesine dayanıklı).
 * DuckDuckGo da başarısız olursa son yedek arama kaynağı olarak kullanılır.
 * Google News bağlantıları kodlanmış yönlendirme adresleri olduğu için
 * gerçek makale URL'si base64 yükünden çıkarılır; çözülemeyenler atlanır.
 */
export async function searchWebGoogleNewsRss(query: string, num = 10): Promise<RawSearchItem[]> {
  try {
    const res = await fetch(
      `https://news.google.com/rss/search?q=${encodeURIComponent(query)}`,
      {
        headers: { "User-Agent": DDG_UA, Accept: "application/rss+xml,application/xml,text/xml" },
        signal: AbortSignal.timeout(15000),
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const xml = await res.text();

    const items: RawSearchItem[] = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let m: RegExpExecArray | null;
    while ((m = itemRe.exec(xml)) !== null && items.length < num) {
      const block = m[1];
      const pickTag = (tag: string): string => {
        const t = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
        return t ? t[1].replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").trim() : "";
      };
      const title = tagText(pickTag("title"))
        .replace(/\s+-\s+[^-]{2,60}$/u, "")
        .trim();
      const rawLink = pickTag("link");
      const link = decodeGoogleNewsLink(rawLink);
      if (!link || !title || title.length < 8) continue;
      const pubDate = pickTag("pubDate");
      let date = "";
      if (pubDate) {
        const d = new Date(pubDate);
        if (!isNaN(d.getTime())) date = d.toISOString().slice(0, 10);
      }
      let host = "";
      try {
        host = new URL(link).hostname;
      } catch {
        continue;
      }
      items.push({ url: link, name: title, snippet: "", host_name: host, date });
    }
    return items;
  } catch (err) {
    console.error(`[searchWebGoogleNewsRss] Arama hatası (${query}):`, err);
    return [];
  }
}

/** Google News yönlendirme bağlantısını gerçek makale adresine çözer */
function decodeGoogleNewsLink(link: string): string {
  try {
    const u = new URL(link);
    if (!/news\.google\.com$/i.test(u.hostname)) return link;
    const id = u.pathname.split("/articles/")[1] ?? "";
    if (!id) return "";
    const decoded = Buffer.from(id.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("binary");
    const m = decoded.match(/https?:\/\/[!-~]+/);
    return m ? m[0] : "";
  } catch {
    return "";
  }
}

/**
 * Bing News yönlendirme bağlantısını (apiclick.aspx) gerçek makale adresine
 * çözer: url= parametresinde URL-kodlanmış hedef adres taşınır. Zaten gerçek
 * bir makale adresiyse olduğu gibi döner; çözülemezse boş döner.
 */
function decodeBingNewsLink(link: string): string {
  try {
    if (!/bing\.com\/news\/apiclick\.aspx/i.test(link)) return link;
    const m = link.match(/[?&]url=([^&]+)/);
    if (!m) return "";
    const real = decodeURIComponent(m[1]);
    return /^https?:\/\//i.test(real) ? real : "";
  } catch {
    return "";
  }
}

/**
 * Bing News RSS araması (anahtar gerektirmez, RSS uçları bot engellemesine
 * dayanıklıdır — Vercel sunucusuz IP'leri için en güvenilir yedek). RSS'te
 * parça metni (snippet) bulunmadığından snippet boş döner; tarama hattındaki
 * MIN_SNIPPET_LEN filtresi bu maddeleri elemesin diye başlığın kendisi
 * özet olarak konur.
 */
export async function searchWebBingNewsRss(query: string, num = 10): Promise<RawSearchItem[]> {
  try {
    const res = await fetch(
      `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=RSS`,
      {
        headers: { "User-Agent": DDG_UA, Accept: "application/rss+xml,application/xml,text/xml" },
        signal: AbortSignal.timeout(15000),
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const xml = await res.text();

    const items: RawSearchItem[] = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let m: RegExpExecArray | null;
    while ((m = itemRe.exec(xml)) !== null && items.length < num) {
      const block = m[1];
      const pickTag = (tag: string): string => {
        const t = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
        return t ? t[1].replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").trim() : "";
      };
      const title = tagText(pickTag("title")).trim();
      const rawLink = pickTag("link");
      const link = decodeBingNewsLink(rawLink);
      const description = tagText(pickTag("description")).trim();
      if (!link || !/^https?:\/\//i.test(link) || title.length < 8) continue;
      const pubDate = pickTag("pubDate");
      let date = "";
      if (pubDate) {
        const d = new Date(pubDate);
        if (!isNaN(d.getTime())) date = d.toISOString().slice(0, 10);
      }
      let host = "";
      try {
        host = new URL(link).hostname;
      } catch {
        continue;
      }
      items.push({
        url: link,
        name: title,
        snippet: description || title,
        host_name: host,
        date,
      });
    }
    return items;
  } catch (err) {
    console.error(`[searchWebBingNewsRss] Arama hatası (${query}):`, err);
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
        // Fallback: Z-AI yoksa ücretsiz HTTP çevirisi; o da olmazsa orijinal kaydedilir
        const source = lang?.code || "auto";
        return Promise.all(
          items.map(async (it) => {
            const trTitle = await httpTranslate(it.title.slice(0, 300), source);
            const trSummary = await httpTranslate(it.snippet.slice(0, 700), source);
            return {
              index: it.index,
              trTitle: (trTitle || it.title).slice(0, 300),
              trSummary:
                (trSummary || it.snippet.slice(0, 500)) +
                (trTitle || trSummary ? "" : " [Otomatik çeviri başarısız oldu]"),
              category: "genel",
              importance: 2,
              isNewTech: false,
              keywords: [],
            };
          })
        );
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

/* ------------------------------------------------------------------ */
/* TAM MAKALE GETİRME + TÜRKÇELEŞTİRME (Tam Oku penceresi için)        */
/* ------------------------------------------------------------------ */

export interface FullArticleResult {
  title: string; // Türkçe başlık (çevrildiyse)
  paragraphs: string[]; // Tam metin paragrafları (Türkçe)
  wordCount: number; // Çevrilen/okunan toplam kelime sayısı
  engine: "direct" | "page_reader" | "none"; // Sayfa hangi yolla okundu
  translated: boolean; // Gerçekten çeviri yapıldı mı
}

const FULL_TEXT_LIMIT = 12000; // Kaynak metin üst sınırı (karakter)
const CHUNK_LIMIT = 3800; // Her çeviri parçasının üst sınırı

/** HTML tag dizesinin iç metnini temizler */
function tagText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Makale HTML'inden paragraf yapısını koruyarak ana metni çıkarır:
 * script/style/nav/header/footer/aside/form atılır, <p> blokları sırayla toplanır.
 */
export function extractArticleParagraphs(html: string, maxChars = FULL_TEXT_LIMIT): string[] {
  if (!html) return [];
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<(nav|header|footer|aside|form|button|svg)[\s\S]*?<\/\1>/gi, " ");

  const paras: string[] = [];
  const pRe = /<p\s[^>]*>([\s\S]*?)<\/p\s*>/gi;
  let m: RegExpExecArray | null;
  let total = 0;
  while ((m = pRe.exec(cleaned)) !== null) {
    const text = tagText(m[1]);
    // Menü/tanıtım cümlecikleri ve tek kelimelik başlıkları ele
    if (text.length < 45 || text.split(/\s+/).length < 7) continue;
    // Aşırı bağlantı dolu paragraflar genelde navigasyondur
    const linkCount = (m[1].match(/<a\s/gi) ?? []).length;
    if (linkCount > 4) continue;
    paras.push(text);
    total += text.length;
    if (total >= maxChars) break;
  }

  // <p> yoksa (bazı sayfalarda metin div'lerde) tüm sayfa metnine düş
  if (paras.length === 0) {
    const all = stripHtml(cleaned);
    if (all.length > 200) {
      // Cümle sınırlarına göre kaba paragraf bölümlemesi
      const sentences = all.split(/(?<=[.!?。!?])\s+/);
      let buf = "";
      for (const s of sentences) {
        buf = buf ? `${buf} ${s}` : s;
        if (buf.length >= 320) {
          paras.push(buf.trim());
          buf = "";
          if (paras.join(" ").length >= maxChars) break;
        }
      }
      if (buf.trim().length > 60) paras.push(buf.trim());
    }
  }

  return paras.slice(0, 150);
}

/**
 * Sayfayı okur: önce hızlı doğrudan indirme, olmazsa page_reader yedeği.
 */
async function fetchPageHtmlForText(
  url: string
): Promise<{ html: string; engine: FullArticleResult["engine"] }> {
  try {
    const { fetchPageHtmlDirect } = await import("./image-extract");
    const html = await fetchPageHtmlDirect(url, 11000);
    if (html && html.length > 500) return { html, engine: "direct" };
  } catch {
    /* yedeğe düş */
  }
  try {
    const zai = await getZAI();
    const page = (await Promise.race([
      zai.functions.invoke("page_reader", { url }) as Promise<any>,
      new Promise((_, rej) => setTimeout(() => rej(new Error("zaman aşımı")), 22000)),
    ])) as any;
    const html: string = page?.data?.html ?? "";
    if (html) return { html, engine: "page_reader" };
  } catch {
    /* her iki yol da başarısız */
  }
  return { html: "", engine: "none" };
}

function splitIntoChunks(paras: string[]): string[][] {
  const chunks: string[][] = [];
  let buf: string[] = [];
  let size = 0;
  for (const p of paras) {
    if (size + p.length > CHUNK_LIMIT && buf.length > 0) {
      chunks.push(buf);
      buf = [];
      size = 0;
    }
    buf.push(p);
    size += p.length;
  }
  if (buf.length > 0) chunks.push(buf);
  return chunks;
}

/** Bir parçayı (paragraf listesini) Türkçeye çevirir; paragraf sayısını korumaya çalışır */
async function translateChunk(chunk: string[], langName: string): Promise<string[]> {
  const prompt = `Aşağıda ${langName} dilinde bir haber makalesinden ${chunk.length} adet paragraf var.
Her paragrafı profesyonel, akıcı TÜRKÇE'ye çevir (adli bilimler / olay yeri inceleme alanı).

KURALLAR:
- Girdideki paragraf SAYISINI ve SIRASINI aynen koru; paragrafları boş satırla ayır.
- Başlık veya yorum EKLEME; yalnızca çeviriyi üret.
- Teknik terimlerin Türkçe karşılığını ver, gerekirse parantezle orijinalini ekle.
- Bir paragraf anlamsız/geçersizse onu kısa bir "(çevrilemedi)" ibaresiyle boş geçme, atla.

PARAGRAFLAR:
${chunk.map((p, i) => `--${i + 1}--\n${p}`).join("\n\n")}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: "assistant",
            content:
              "Sen adli bilimler alanında uzmanlaşmış profesyonel bir çevirmensin. Yalnızca istenen çeviriyi, paragraf yapısını koruyarak üretirsin.",
          },
          { role: "user", content: prompt },
        ],
        thinking: { type: "disabled" },
      });
      const raw = completion?.choices?.[0]?.message?.content ?? "";
      const parts = raw
        .replace(/```[a-z]*\n?/gi, "")
        .split(/\n{2,}/)
        .map((s) => s.replace(/^--\d+--\s*/g, "").trim())
        .filter((s) => s.length > 2);
      if (parts.length >= Math.max(1, Math.floor(chunk.length * 0.6))) return parts;
      throw new Error(`Paragraf sayısı uyuşmadı (${parts.length}/${chunk.length})`);
    } catch (err) {
      console.error(`[translateChunk] Deneme ${attempt} başarısız:`, err);
      if (attempt === 2) {
        // Z-AI yoksa ücretsiz HTTP çevirisi; çevrilemeyen paragraf orijinal kalsın
        return Promise.all(
          chunk.slice(0, 40).map(async (p) => {
            const t = p.length <= 1200 ? await httpTranslate(p, langName).catch(() => "") : "";
            return t || `${p} *(çevrilemedi)*`;
          })
        );
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return chunk;
}

/**
 * Tam Oku: makalenin TAM metnini kaynaktan okur ve Türkçeye çevirir.
 * Kaynak dil Türkçeyse çeviri atlanır. Hata durumunda mümkün olan kısmı döndürür.
 */
export async function fetchAndTranslateFullArticle(
  url: string,
  originalTitle: string,
  trTitle: string,
  language: string
): Promise<FullArticleResult> {
  const { html, engine } = await fetchPageHtmlForText(url);

  if (engine === "none" || !html) {
    // Sayfa okunamadı — boş sonuç; çağıran taraf özete düşer
    return { title: trTitle, paragraphs: [], wordCount: 0, engine: "none", translated: false };
  }

  const sourceParas = extractArticleParagraphs(html);
  const isTurkish = /^tr\b/i.test(language) || /türk/i.test(language);

  if (isTurkish) {
    return {
      title: trTitle,
      paragraphs: sourceParas,
      wordCount: sourceParas.join(" ").split(/\s+/).filter(Boolean).length,
      engine,
      translated: false,
    };
  }

  if (sourceParas.length === 0) {
    return { title: trTitle, paragraphs: [], wordCount: 0, engine, translated: false };
  }

  const chunks = splitIntoChunks(sourceParas);
  const translatedParts: string[] = [];
  for (const chunk of chunks) {
    const done = await translateChunk(chunk, language);
    translatedParts.push(...done);
  }

  const paragraphs = translatedParts.filter((p) => p && p.trim()).slice(0, 150);
  return {
    title: trTitle,
    paragraphs,
    wordCount: paragraphs.join(" ").split(/\s+/).filter(Boolean).length,
    engine,
    translated: true,
  };
}

/**
 * AI Haftalık Bülten: arşivdeki son bulgulardan uzman anlatı özeti üretir.
 * Dönen değer markdown formatındadır.
 */
export async function generateBriefing(
  items: {
    trTitle: string;
    trSummary: string;
    category: string;
    importance: number;
    isNewTech: boolean;
    language: string;
    sourceName: string;
    publishedDate: string | null;
  }[]
): Promise<string> {
  const compact = items.map((it, i) => ({
    n: i + 1,
    baslik: it.trTitle,
    ozet: it.trSummary.slice(0, 220),
    kategori: categoryLabel(it.category),
    onem: it.importance,
    yenilik: it.isNewTech,
    kaynak: it.sourceName,
    dil: it.language,
  }));

  const prompt = `Aşağıda olay yeri inceleme / adli bilimler izleme arşivinden ${items.length} adet güncel bulgu var.
Bu bulguları inceleyerek profesyonel bir TÜRKÇE istihbarat bülteni yaz. Okuyucu: adli bilimler uzmanı, olay yeri inceleme görevlisi ve emniyet/kriminalistik yöneticileri.

BULGULAR (JSON):
${JSON.stringify(compact, null, 1)}

Bülteni tam olarak şu markdown yapısıyla üret:

## 🎯 Yönetici Özeti
(3-5 cümle: bu dönemde alanın genel gidişatı, en çarpıcı 2-3 gelişme ve genel eğilim — anlatı diliyle)

## 🔺 Öne Çıkan Gelişmeler
(En önemli 5-7 bulguyu "### " alt başlıklarıyla tek tek ele al: ne olduğu, neden önemli, hangi boşluğu dolduruyor. Her başlıkta bulgu numarasına [B#n] şeklinde atıf ver.)

## 🧪 Yükselen Teknolojiler
(isNewTech=true olan bulgulardan sentez: hangi teknolojik akımlar öne çıkıyor — örn. yapay zekâ destekli analiz, taşınabilir cihazlar, 3B belgeleme vb. 2-4 madde)

## 🌍 Bölgesel Görünüm
(Kaynak dilleri/kayıp ülkeleri göz önünde bulundurarak hangi bölgelerde hangi konulara odaklanıldığını yorumla. Veri azsa bunu dürüstçe belirt.)

## 📌 Öneriler ve İzlenecekler
(Uzman ekipler için 3-5 pratik öneri + önümüzdeki dönemde izlenmesi gereken konular. Madde işaretli.)

Uyarılar:
- YALNIZCA markdown üret, giriş/cıkış cümleleri ekleme.
- Bulgularda olmayan bilgiyi UYDURMA; sentez yap, alıntı yapma.
- Bulguları "B1, B5" gibi numara atıflarıyla referans göster.
- Profesyonel ama akıcı bir istihbarat raporu dili kullan.`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: "assistant",
            content:
              "Sen uluslararası adli bilimler istihbaratı alanında uzmanlaşmış bir bülten editörüsün. Yalnızca istenen markdown raporu üretirsin.",
          },
          { role: "user", content: prompt },
        ],
        thinking: { type: "disabled" },
      });
      const content = completion?.choices?.[0]?.message?.content ?? "";
      if (content.trim().length > 200) return content.trim();
      throw new Error("Bülten içeriği çok kısa");
    } catch (err) {
      console.error(`[generateBriefing] Deneme ${attempt} başarısız:`, err);
      if (attempt === 2) {
        return `## ⚠️ Bülten Üretilemedi\n\nŞu anda bülten oluşturulamadı. Lütfen birkaç dakika sonra tekrar deneyin.`;
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return `## ⚠️ Bülten Üretilemedi\n\nLütfen tekrar deneyin.`;
}

/** Asistan konuşma mesajı tipi */
export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * AI İstihbarat Asistanı: arşiv bağlamı + güncel web araması ile Türkçe yanıt üretir.
 */
export async function assistantReply(
  history: AssistantMessage[],
  archiveContext: string,
  webContext: string
): Promise<string> {
  const lastUser =
    [...history].reverse().find((m) => m.role === "user")?.content ?? "";

  const systemPrompt = `Sen OYİ GLOBAL'in AI İstihbarat Asistanısın: olay yeri inceleme teknikleri ve adli bilimler alanında uzmanlaşmış, TÜRKÇE konuşan bir analistsin.

GÖREVİN:
- Kullanıcının sorularını, verilen ARŞİV BAĞLAMI ve gerekirse GENEL BİLGİNle yanıtla.
- Arşivde ilgili bulgu varsa bunlara [B#n] koduyla atıf yap ve kaynak adını söyle.
- Küresel perspektif ver: hangi ülke/kurum ne yapıyor, hangi yöntem öne çıkıyor.
- Teknik terimlerin Türkçe karşılığını parantez içinde orijinaliyle ver (örn. "iz delili (trace evidence)").
- Yanıtlarını markdown ile yapılandır: kısa paragraflar, gerektiğinde madde işaretleri.
- Alanla ilgisiz sorularda kibarca alanına yönlendir.
- Emin olmadığın bilgiyi uydurma; "kesin bilgi bulunamadı" deyip kaynak öner.

${archiveContext}
${webContext}`;

  const messages: { role: "assistant" | "user"; content: string }[] = [
    { role: "assistant", content: systemPrompt },
    // Son 8 mesajı koru (bağlam penceresi)
    ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
  ];

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({
        messages,
        thinking: { type: "disabled" },
      });
      const content = completion?.choices?.[0]?.message?.content ?? "";
      if (content.trim().length > 2) return content.trim();
      throw new Error("Boş yanıt");
    } catch (err) {
      console.error(`[assistantReply] Deneme ${attempt} başarısız:`, err);
      if (attempt === 2) {
        return `## ⚠️\nYanıt üretilirken bir sorun oluştu. Lütfen sorunuzu tekrar iletin.\n\n*(Soru: "${lastUser.slice(0, 120)}")*`;
      }
      await new Promise((r) => setTimeout(r, 1200));
    }
  }
  return "Yanıt üretilemedi, lütfen tekrar deneyin.";
}

export { categoryLabel };
