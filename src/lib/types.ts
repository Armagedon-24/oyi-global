/** İstemci tarafında paylaşılan tipler */

export interface FindingItem {
  id: string;
  scanId: string | null;
  url: string;
  originalTitle: string;
  originalSnippet: string;
  trTitle: string;
  trSummary: string;
  language: string;
  sourceName: string;
  category: string;
  importance: number;
  isNewTech: boolean;
  keywords: string; // JSON dizi string'i
  publishedDate: string | null;
  images: string; // JSON: [{url, alt}] | "[]" (denenmedi) | "none" (yok)
  deepAnalysis: string | null;
  bookmarked: boolean;
  isRead: boolean;
  notes: string | null;
  createdAt: string;
  commentCount: number; // habere yapılan yorum sayısı
}

export interface StatsData {
  total: number;
  bookmarked: number;
  newTech: number;
  categories: { key: string; count: number }[];
  languages: { code: string; count: number }[];
  lastScan: {
    id: string;
    status: string;
    scope: string;
    newItems: number;
    languagesCovered: number;
    startedAt: string;
    completedAt: string | null;
  } | null;
}

export interface ScanLogEntry {
  id: string;
  flag: string;
  langName: string;
  status: "searching" | "done" | "error";
  searched?: number;
  relevant?: number;
  added?: number;
}
