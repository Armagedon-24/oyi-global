/**
 * KrimiScan Global — Node tabanlı veritabanı ön doldurma
 * Kullanım: node scripts/seed-scan.mjs <lang1> <lang2> ...
 * Dil belirtilmezse kalan tüm diller taranır.
 */
const BASE = "http://localhost:3000";

const ALL_LANGS = ["en", "zh", "de", "fr", "es", "it", "pt", "ru", "ja", "ko", "ar", "nl", "pl", "tr"];

async function main() {
  const args = process.argv.slice(2);
  const langs = args.length > 0 ? args : ALL_LANGS;

  console.log(`[seed] Tarama başlatılıyor: ${langs.join(", ")}`);

  const startRes = await fetch(`${BASE}/api/scan/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scope: "all" }),
  });
  const startData = await startRes.json();
  if (!startData.success) {
    console.error("[seed] Tarama başlatılamadı:", startData.error);
    process.exit(1);
  }
  const scanId = startData.scanId;
  console.log(`[seed] scanId=${scanId}`);

  let totalAdded = 0;
  for (const lang of langs) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${BASE}/api/scan/step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId, langCode: lang }),
      });
      const data = await res.json();
      const secs = ((Date.now() - t0) / 1000).toFixed(0);
      if (data.success) {
        totalAdded += data.added;
        console.log(
          `[seed] ${data.flag} ${data.langName}: arama=${data.searched} alakalı=${data.relevant} eklendi=${data.added} (${secs}s)`
        );
      } else {
        console.log(`[seed] ${lang}: HATA — ${data.error} (${secs}s)`);
      }
    } catch (err) {
      console.log(`[seed] ${lang}: İSTİSNA — ${err.message}`);
    }
  }

  await fetch(`${BASE}/api/scan/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scanId }),
  });

  console.log(`[seed] TAMAMLANDI — toplam ${totalAdded} yeni bulgu eklendi`);
}

main().catch((e) => {
  console.error("[seed] Fatal:", e);
  process.exit(1);
});
