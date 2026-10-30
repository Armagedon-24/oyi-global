/**
 * OYİ GLOBAL — Olay Yeri İnceleme Teknikleri Küresel Tarama Konfigürasyonu
 * 14 dilde yerelleştirilmiş arama sorguları ve kategori sistemi
 */

export interface ScanLanguage {
  code: string; // ISO kodu
  name: string; // Türkçe dil adı
  flag: string; // emoji bayrak
  queries: string[]; // yerelleştirilmiş sorgular
  relevanceKeywords: string[]; // alaka filtresi için anahtar kelimeler (küçük harf)
}

export interface ScanCategory {
  key: string;
  label: string;
  icon: string;
}

/** Sabit kategori listesi — LLM bu anahtarlardan seçmek zorunda */
export const CATEGORIES: ScanCategory[] = [
  { key: "parmak-izi", label: "Parmak İzi ve İz İncelemesi", icon: "Fingerprint" },
  { key: "dna", label: "DNA ve Biyolojik Kanıt", icon: "Dna" },
  { key: "balistik", label: "Balistik ve Ateşli Silah", icon: "Crosshair" },
  { key: "dijital", label: "Dijital ve Siber Adli Bilimler", icon: "HardDrive" },
  { key: "kimyasal", label: "Kimyasal, Toksikoloji ve Uyuşturucu", icon: "FlaskConical" },
  { key: "3d", label: "3D Belgeleme ve Fotogrametri", icon: "Box" },
  { key: "kan-izi", label: "Kan İzi Deseni Analizi", icon: "Droplets" },
  { key: "yapay-zeka", label: "Yapay Zekâ ve Otomasyon", icon: "BrainCircuit" },
  { key: "goruntu", label: "Ses, Görüntü ve Video Analizi", icon: "Video" },
  { key: "entomoloji", label: "Entomoloji, Antropoloji ve Patoloji", icon: "Bug" },
  { key: "genel", label: "Genel Olay Yeri Yönetimi", icon: "MapPin" },
];

export const CATEGORY_KEYS = CATEGORIES.map((c) => c.key);

export function categoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? "Genel Olay Yeri Yönetimi";
}

/**
 * Tarama dilleri — her dil için olay yeri incelemesi / adli bilim alanında
 * yerelleştirilmiş sorgular ve alaka filtre kelimeleri
 */
export const SCAN_LANGUAGES: ScanLanguage[] = [
  {
    code: "en",
    name: "İngilizce",
    flag: "🇬🇧",
    queries: [
      "crime scene investigation new techniques innovation",
      "forensic science breakthrough technology crime scene",
    ],
    relevanceKeywords: [
      "crime scene", "forensic", "investigation", "fingerprint", "dna", "ballistic",
      "evidence", "csi", "forensics", "trace evidence", "bloodstain",
    ],
  },
  {
    code: "zh",
    name: "Çince",
    flag: "🇨🇳",
    queries: [
      "犯罪现场勘查 新技术 创新",
      "法庭科学 现场勘验 最新技术突破",
    ],
    relevanceKeywords: ["犯罪现场", "勘查", "法庭科学", "痕迹", "指纹", "刑侦", "法医", "取证"],
  },
  {
    code: "de",
    name: "Almanca",
    flag: "🇩🇪",
    queries: [
      "Kriminaltechnik Spurensicherung neue Verfahren Innovation",
      "forensische Wissenschaften Tatort neue Technologie",
    ],
    relevanceKeywords: [
      "kriminaltechnik", "spurensicherung", "tatort", "forensisch", "spurenkunde",
      "kriminalistik", "dna-analyse", "ballistik",
    ],
  },
  {
    code: "fr",
    name: "Fransızca",
    flag: "🇫🇷",
    queries: [
      "police scientifique scène de crime nouvelles techniques innovation",
      "criminalistique investigation scene crime technologie",
    ],
    relevanceKeywords: [
      "police scientifique", "scène de crime", "criminalistique", "indice",
      "empreinte", "medecine legale", "forensique", "enquête",
    ],
  },
  {
    code: "es",
    name: "İspanyolca",
    flag: "🇪🇸",
    queries: [
      "investigación escena del crimen nuevas técnicas forenses innovación",
      "criminalística tecnología escena crimen avance",
    ],
    relevanceKeywords: [
      "escena del crimen", "criminalística", "forense", "investigación",
      "huellas", "adn", "prueba", "criminología",
    ],
  },
  {
    code: "it",
    name: "İtalyanca",
    flag: "🇮🇹",
    queries: [
      "scena del crimine tecniche investigative innovative scienze forensi",
      "polizia scientifica nuove tecniche investigazione",
    ],
    relevanceKeywords: [
      "scena del crimine", "forense", "investigazione", "impronte",
      "polizia scientifica", "medicina legale", "reperti", "indagini",
    ],
  },
  {
    code: "pt",
    name: "Portekizce",
    flag: "🇵🇹",
    queries: [
      "perícia criminal cena do crime novas técnicas inovação",
      "criminalística tecnologia investigação local crime avanço",
    ],
    relevanceKeywords: [
      "cena do crime", "perícia", "criminalística", "forense", "investigação",
      "impressões digitais", "dna", "local de crime",
    ],
  },
  {
    code: "ru",
    name: "Rusça",
    flag: "🇷🇺",
    queries: [
      "осмотр места происшествия новые технологии криминалистика",
      "судебная экспертиза криминалистика инновационные методы",
    ],
    relevanceKeywords: [
      "место происшествия", "криминалистик", "судебн", "экспертиз",
      "следователь", "дактилоскоп", "улик", "расследован",
    ],
  },
  {
    code: "ja",
    name: "Japonca",
    flag: "🇯🇵",
    queries: [
      "犯罪捜査 科学捜査 新技術 現場検証",
      "法科学 鑑識 最新技術 革新",
    ],
    relevanceKeywords: ["科学捜査", "鑑識", "現場検証", "法科学", "指紋", "dna", "捜査", "検視"],
  },
  {
    code: "ko",
    name: "Korece",
    flag: "🇰🇷",
    queries: [
      "범죄 현장 수사 과학수사 새로운 기술 혁신",
      "법과학 현장 감식 최신 기술",
    ],
    relevanceKeywords: ["과학수사", "현장감식", "범죄현장", "법과학", "지문", "수사", "감정", "증거"],
  },
  {
    code: "ar",
    name: "Arapça",
    flag: "🇸🇦",
    queries: [
      "التحقيق في مسرح الجريمة تقنيات جديدة جنائية",
      "الأدلة الجنائية تقنيات حديثة مسرح الجريمة",
    ],
    relevanceKeywords: ["مسرح الجريمة", "جنائي", "الأدلة", "بصمة", "تحقيق", "جنائية", "علمية"],
  },
  {
    code: "nl",
    name: "Felemenkçe",
    flag: "🇳🇱",
    queries: [
      "forensisch onderzoek plaats delict nieuwe technieken innovatie",
      "sporenonderzoek misdaadscène nieuwe technologie",
    ],
    relevanceKeywords: [
      "forensisch", "plaats delict", "sporen", "onderzoek", "cold case",
      "dauwers", "crimineel", "dna-onderzoek",
    ],
  },
  {
    code: "pl",
    name: "Lehçe",
    flag: "🇵🇱",
    queries: [
      "techniki kryminalistyczne miejsce zdarzenia nowoczesne badania",
      "kryminalistyka śledztwo nowe technologie innowacje",
    ],
    relevanceKeywords: [
      "kryminalistyk", "miejsce zdarzenia", "śledztwo", "ślad", "badania",
      "techniczne", " daktyloskop", "zabezpieczenie",
    ],
  },
  {
    code: "tr",
    name: "Türkçe",
    flag: "🇹🇷",
    queries: [
      "olay yeri inceleme yeni teknikler adli bilimler gelişme",
      "kriminalistik olay yeri inceleme teknoloji innovation adli",
    ],
    relevanceKeywords: [
      "olay yeri", "adli", "kriminalistik", "inceleme", "parmak izi", "delil",
      "kanıt", "adli bilimler", "jandarma", "polis",
    ],
  },
];

/** Hızlı tarama kapsamı — en yoğun kaynak dilleri */
export const QUICK_LANGUAGES = ["en", "zh", "de", "ru", "es", "tr"];

export function getLanguages(scope: string): ScanLanguage[] {
  if (scope === "quick") {
    return SCAN_LANGUAGES.filter((l) => QUICK_LANGUAGES.includes(l.code));
  }
  return SCAN_LANGUAGES;
}

export function getLanguage(code: string): ScanLanguage | undefined {
  return SCAN_LANGUAGES.find((l) => l.code === code);
}

/** URL'den kaynak adı üretir: "www.forensicmag.com" -> "ForensicMag" */
export function prettySourceName(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const parts = host.split(".");
    const core = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
    return core.charAt(0).toUpperCase() + core.slice(1);
  } catch {
    return "Bilinmeyen Kaynak";
  }
}
