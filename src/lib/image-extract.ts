/**
 * OYİ GLOBAL — Makale görseli çıkarma
 * Haber makalelerinden fotoğraf/şekil/çizim/diyagram URL'lerini toplar:
 *  1) og:image / twitter:image meta etiketleri (öncelikli — kapak görseli)
 *  2) <img> etiketleri (src, data-src, lazyload varyantları, srcset içindeki en büyük aday)
 * Sonuç: [{ url, alt }] — logo/ikon/reklam filtreli, mutlak URL'li, tekilleştirilmiş
 */

export interface ExtractedImage {
  url: string;
  alt: string;
}

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

/** Logo/ikon/reklam/yer tutucu/takip pikseli içeren URL'ler */
const URL_BLOCKLIST =
  /(logo|icon|sprite|avatar|emoji|emoticon|spacer|placeholder|pixel|tracker|\/ads?[-_/]|ad[-_]?serve|banner|badge|captcha|rating|social|share[-_]?buttons?|newsletter|subscribe|profile|default[-_]?(image|thumb|avatar)|no[-_]?image|1x1\.|blank\.(gif|png|jpg|webp)|loading|spinner|gravatar|favicon|wp-content\/themes\/[^/]+\/images)/i;

const SVG_RE = /\.svg([?#]|$)/i;

function isValidImageUrl(u: URL): boolean {
  if (!/^https?:$/.test(u.protocol)) return false;
  const href = u.href;
  if (href.length > 1200) return false;
  if (SVG_RE.test(href)) return false; // svg genelde logo/ikon
  if (URL_BLOCKLIST.test(href)) return false;
  return true;
}

/** Göreceli/koşullu URL'leri mutlak ve güvenli hale getirir */
function absolutize(raw: string, baseUrl: string): string | null {
  const val = raw.trim().replace(/&amp;/g, "&");
  if (!val || val.startsWith("data:")) return null; // satır içi base64 görselleri DB'ye alınmaz
  try {
    const u = new URL(val, baseUrl);
    u.hash = "";
    return isValidImageUrl(u) ? u.href : null;
  } catch {
    return null;
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Bir HTML etiket dizesinden öznitelik değeri çeker */
function attr(tag: string, name: string): string | null {
  const re = new RegExp(
    `${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`,
    "i"
  );
  const m = tag.match(re);
  if (!m) return null;
  return (m[2] ?? m[3] ?? m[4] ?? "").trim();
}

/** srcset değerindeki en büyük (en geniş) görsel URL'sini döndürür */
function bestFromSrcset(srcset: string): string | null {
  if (!srcset) return null;
  const candidates = srcset
    .split(",")
    .map((part) => part.trim().split(/\s+/))
    .filter((p) => p[0])
    .map((p) => ({
      url: p[0],
      w: p[1] && /^\d+w$/i.test(p[1]) ? parseInt(p[1], 10) : 0,
    }));
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.w - a.w);
  return candidates[0].url;
}

/**
 * HTML içinden makale görsellerini çıkarır (saf fonksiyon, ağ erişimi yok).
 * Öncelik: og:image/twitter:image kapakları → doküman sırasına göre <img> etiketleri.
 */
export function parseImagesFromHtml(
  html: string,
  baseUrl: string,
  limit = 8
): ExtractedImage[] {
  if (!html) return [];
  const scored: { url: string; alt: string; score: number }[] = [];
  const seenPath = new Set<string>();

  const push = (rawUrl: string | null, alt: string, score: number) => {
    const url = rawUrl ? absolutize(rawUrl, baseUrl) : null;
    if (!url) return;
    let pathKey: string;
    try {
      pathKey = new URL(url).pathname;
    } catch {
      return;
    }
    // Aynı dosyanın farklı boyut varyantlarını (?w=320 vs ?w=1200) tekilleştir
    if (seenPath.has(pathKey)) return;
    seenPath.add(pathKey);
    scored.push({ url, alt: decodeEntities(alt).slice(0, 240), score });
  };

  // 1) Meta etiketler: og:image, og:image:secure_url, twitter:image(:src)
  const metaRe = /<meta\s[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRe.exec(html)) !== null) {
    const tag = m[0];
    const key = (attr(tag, "property") ?? attr(tag, "name") ?? "").toLowerCase();
    if (/^(og:image(?::secure_url)?|twitter:image(?::src)?)$/.test(key)) {
      push(attr(tag, "content"), "", 100);
    }
  }

  // 2) <img> etiketleri — doküman sırası genelde içerik sırasını yansıtır
  const imgRe = /<img\s[^>]*>/gi;
  let order = 0;
  while ((m = imgRe.exec(html)) !== null) {
    const tag = m[0];
    const alt = attr(tag, "alt") ?? attr(tag, "title") ?? "";
    const src =
      bestFromSrcset(attr(tag, "srcset") ?? "") ??
      attr(tag, "data-src") ??
      attr(tag, "data-original") ??
      attr(tag, "data-lazy-src") ??
      attr(tag, "data-lazy") ??
      attr(tag, "data-echo") ??
      attr(tag, "data-url") ??
      attr(tag, "src");
    order += 1;
    push(src, alt, Math.max(1, 60 - order)); // ilk görseller öne geçer
  }

  scored.sort((a, b) => b.score - a.score);
  const unique: ExtractedImage[] = [];
  const seenUrl = new Set<string>();
  for (const r of scored) {
    if (seenUrl.has(r.url)) continue;
    seenUrl.add(r.url);
    unique.push({ url: r.url, alt: r.alt });
    if (unique.length >= limit) break;
  }
  return unique;
}

/** Sayfanın ham HTML'ini doğrudan indirir (hızlı yol — çoğu haber sitesi için yeterli) */
export async function fetchPageHtmlDirect(
  url: string,
  timeoutMs = 9000
): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": BROWSER_UA,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = (res.headers.get("content-type") ?? "").toLowerCase();
  if (ct && !ct.includes("html") && !ct.includes("xml")) {
    throw new Error(`HTML değil: ${ct}`);
  }
  const buf = await res.arrayBuffer();
  // 1.5MB üstü neredeyse her zaman sayfanın görsel bölümünü içerir
  return new TextDecoder("utf-8").decode(buf.slice(0, 1_500_000));
}

/** Zaman aşımı sarmalayıcı */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error("zaman aşımı")), ms)
    ),
  ]);
}

/** page_reader ile JS render edilen sayfayı okur (yavaş ama sağlam yol) */
async function fetchPageHtmlReader(url: string): Promise<string> {
  const { getZAI } = await import("./llm");
  const zai = await getZAI();
  const page = (await withTimeout(
    zai.functions.invoke("page_reader", { url }) as Promise<any>,
    20000
  )) as any;
  return page?.data?.html ?? "";
}

/**
 * Bir makalenin görsellerini çıkarır: önce hızlı doğrudan indirme,
 * olmazsa page_reader (JS render) yedeği.
 */
export async function extractImagesFromArticle(
  url: string,
  limit = 8
): Promise<ExtractedImage[]> {
  let html = "";
  try {
    html = await fetchPageHtmlDirect(url);
  } catch {
    /* sessiz geç — yedeğe düş */
  }
  if (!html) {
    try {
      html = await fetchPageHtmlReader(url);
    } catch {
      /* her iki yol da başarısız */
    }
  }
  return parseImagesFromHtml(html, url, limit);
}
