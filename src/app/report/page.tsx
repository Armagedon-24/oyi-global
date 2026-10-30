import { db } from "@/lib/db";
import { categoryLabel, getLanguage } from "@/lib/forensics-config";
import { ReportToolbar } from "@/components/forensics/report-toolbar";
import { Fingerprint, Star } from "lucide-react";

export const dynamic = "force-dynamic";

/**
 * /report — Yazdırılabilir profesyonel küresel istihbarat raporu
 * Tarayıcıdan "PDF olarak kaydet" ile A4 rapor çıktısı alınabilir.
 */
export default async function ReportPage() {
  const [total, newTech, bookmarked, categoryGroups, languageGroups, topFindings] =
    await Promise.all([
      db.finding.count(),
      db.finding.count({ where: { isNewTech: true } }),
      db.finding.count({ where: { bookmarked: true } }),
      db.finding.groupBy({ by: ["category"], _count: { _all: true } }),
      db.finding.groupBy({ by: ["language"], _count: { _all: true } }),
      db.finding.findMany({
        orderBy: [
          { importance: "desc" },
          { isNewTech: "desc" },
          { createdAt: "desc" },
        ],
        take: 15,
      }),
    ]);

  const now = new Date();
  const reportDate = now.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const reportNo = `KSG-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const categories = categoryGroups
    .map((g) => ({ key: g.category, count: g._count._all }))
    .sort((a, b) => b.count - a.count);
  const maxCat = Math.max(...categories.map((c) => c.count), 1);

  return (
    <div className="min-h-screen bg-slate-900 print:bg-white">
      <style>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .report-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; max-width: 100% !important; }
          .finding-item { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <ReportToolbar />

      {/* ================= RAPOR KÂĞIDI (A4, açık tema) ================= */}
      <div className="report-sheet max-w-4xl mx-auto my-8 print:my-0 bg-white text-slate-900 shadow-2xl border border-slate-700 rounded-lg print:rounded-none">
        {/* Başlık bloğu */}
        <div className="border-b-4 border-amber-500 px-8 sm:px-12 pt-10 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-amber-500 flex items-center justify-center">
                <Fingerprint className="h-7 w-7 text-slate-950" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                  OYİ <span className="text-amber-600">GLOBAL</span>
                </h1>
                <p className="text-xs text-slate-600 font-medium uppercase tracking-widest">
                  Olay Yeri İnceleme Teknikleri Küresel İzleme Merkezi
                </p>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-600 leading-relaxed shrink-0">
              <p className="font-bold text-slate-700">RAPOR NO</p>
              <p className="font-mono">{reportNo}</p>
              <p className="mt-1 font-bold text-slate-700">TARİH</p>
              <p>{reportDate}</p>
            </div>
          </div>
          <h2 className="mt-6 text-lg sm:text-xl font-bold text-slate-800">
            Küresel İstihbarat Raporu — Dünyada Olay Yeri İnceleme Tekniklerindeki
            Güncel Gelişmeler ve Yenilikler
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            14 kaynak dilde taranan uluslararası kaynaklardan derlenmiş, yapay zekâ destekli
            Türkçe çeviri ve uzman sınıflandırma içeren periyodik değerlendirme raporu
          </p>
        </div>

        {/* Yönetici özeti */}
        <div className="px-8 sm:px-12 py-7">
          <h3 className="text-sm font-black uppercase tracking-widest text-amber-700 mb-4">
            1. Yönetici Özeti
          </h3>
          <p className="text-sm leading-relaxed text-slate-700 text-justify">
            Bu rapor, dünya genelinde olay yeri inceleme teknikleri ve adli bilimler alanında
            yayımlanan güncel gelişmelerin derlemini sunmaktadır. İzleme merkezi bugüne kadar{" "}
            <strong>{total} adet bulgu</strong> kaydetmiş olup bu bulguların{" "}
            <strong>{newTech} tanesi (%{total ? Math.round((newTech / total) * 100) : 0})</strong>{" "}
            yeni teknoloji veya yöntem niteliği taşımaktadır. Bulgular{" "}
            <strong>{categories.length} farklı kategoride</strong> sınıflandırılmış ve{" "}
            <strong>{languageGroups.length} farklı kaynak dilden</strong> Türkçeye çevrilmiştir.
            Kullanıcı tarafından <strong>{bookmarked} bulgu</strong> yer imlerine eklenerek takip
            altına alınmıştır. Aşağıdaki bölümlerde kategori dağılımı ve önem sırasına göre
            seçilmiş en kritik bulgular ayrıntılı olarak sunulmaktadır.
          </p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Toplam Bulgu", value: String(total) },
              { label: "Yeni Teknoloji", value: String(newTech) },
              { label: "Kaynak Dil", value: String(languageGroups.length) },
              { label: "Kategori", value: String(categories.length) },
            ].map((s) => (
              <div key={s.label} className="border border-slate-200 rounded-lg p-3 text-center bg-slate-50">
                <p className="text-xl font-black text-slate-800">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kategori dağılımı */}
        <div className="px-8 sm:px-12 py-7 border-t border-slate-200">
          <h3 className="text-sm font-black uppercase tracking-widest text-amber-700 mb-4">
            2. Kategori Dağılımı
          </h3>
          <div className="space-y-2.5">
            {categories.map((c) => (
              <div key={c.key} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-56 shrink-0 truncate">{categoryLabel(c.key)}</span>
                <div className="flex-1 h-3.5 rounded bg-slate-100 overflow-hidden border border-slate-200">
                  <div
                    className="h-full rounded bg-amber-500"
                    style={{ width: `${(c.count / maxCat) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 w-8 text-right">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Öne çıkan bulgular */}
        <div className="px-8 sm:px-12 py-7 border-t border-slate-200">
          <h3 className="text-sm font-black uppercase tracking-widest text-amber-700 mb-2">
            3. Öne Çıkan Bulgular (Önem Sırasına Göre)
          </h3>
          <p className="text-xs text-slate-600 mb-5">
            Yapay zekâ motoru tarafından 1-5 arası önem puanlanan bulgulardan en yüksek
            puanlı {topFindings.length} kayıt aşağıda listelenmiştir.
          </p>

          <div className="space-y-5">
            {topFindings.map((f, i) => {
              const lang = getLanguage(f.language);
              const date = f.publishedDate
                ? new Date(f.publishedDate).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : null;
              return (
                <div key={f.id} className="finding-item border border-slate-200 rounded-lg p-4 bg-slate-50/60">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 h-7 w-7 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          {categoryLabel(f.category)}
                        </span>
                        {f.isNewTech && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Yenilik
                          </span>
                        )}
                        <span className="text-[11px] text-slate-600 flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star
                              key={si}
                              className={`h-2.5 w-2.5 ${si < f.importance ? "fill-amber-500 text-amber-500" : "text-slate-400"}`}
                            />
                          ))}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 leading-snug">{f.trTitle}</h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600 text-justify">
                        {f.trSummary}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-600">
                        <span>
                          {lang ? `${lang.flag} ${lang.name}` : f.language.toUpperCase()} · {f.sourceName}
                        </span>
                        {date && <span>· {date}</span>}
                        <span className="font-mono break-all">· {f.url}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kapanış / yasal not */}
        <div className="px-8 sm:px-12 py-6 border-t-4 border-amber-500 bg-slate-50 rounded-b-lg print:rounded-b-none">
          <p className="text-[10px] leading-relaxed text-slate-600 text-justify">
            <strong className="text-slate-600">Yöntem ve Kapsam Notu:</strong> Bu rapor; İngilizce,
            Çince, Almanca, Fransızca, İspanyolca, İtalyanca, Portekizce, Rusça, Japonca, Korece,
            Arapça, Felemenkçe, Lehçe ve Türkçe dillerinde gerçekleştirilen otomatik kaynak
            taramaları sonucunda derlenen, yapay zekâ tarafından Türkçeye çevrilmiş ve adli bilimler
            uzmanlığı perspektifinden kategorize edilmiş içeriklerden oluşturulmuştur. Bulguların
            birincil kaynakları künyelerinde belirtilen uluslararası yayınlardır; profesyonel
            kullanım öncesinde orijinal kaynaklardan teyit edilmesi önerilir. Yer imlerine eklenen{" "}
            {bookmarked} bulgu, sonraki raporlarda öncelikli takip listesine dahil edilecektir.
          </p>
        </div>
      </div>
    </div>
  );
}
