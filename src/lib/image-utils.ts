/** İstemci tarafında paylaşılan görsel yardımcıları (sunucu bağımlılığı yok) */

export interface ArticleImage {
  url: string;
  alt: string;
}

/**
 * Finding.images alanındaki JSON'u güvenle ayrıştırır.
 * Değerler: "[]" (henüz denenmedi), "none" (denendi, görsel yok), JSON dizi.
 */
export function parseFindingImages(
  raw: string | null | undefined
): ArticleImage[] {
  if (!raw || raw === "none") return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((i: any) => i && typeof i?.url === "string" && i.url.length > 0)
      .slice(0, 12)
      .map((i: any) => ({ url: String(i.url), alt: String(i.alt ?? "") }));
  } catch {
    return [];
  }
}

/** Sıcak bağlantı (hotlink) ve mixed-content sorunlarını aşmak için proxy üzerinden göster */
export function imgProxyUrl(url: string): string {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}
