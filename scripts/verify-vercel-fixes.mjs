/**
 * OYİ GLOBAL — Vercel canlı yayın düzeltmeleri yerel doğrulama scripti.
 * Çalıştırma: bun scripts/verify-vercel-fixes.mjs  (sunucu localhost:3000'de ayakta olmalı)
 * Farklı adres: BASE=https://... bun scripts/verify-vercel-fixes.mjs
 */
import sharp from "sharp";
import { searchWebDuckDuckGo } from "../src/lib/llm.ts";

const BASE = process.env.BASE || "http://localhost:3000";
const PASSWORD = process.env.ADMIN_PASSWORD || "Hakan_1251";
const results = [];
function check(name, cond, extra = "") {
  results.push(cond);
  console.log(`${cond ? "PASS" : "FAIL"} — ${name}${extra ? ` (${extra})` : ""}`);
}

// 1) Giriş
const loginRes = await fetch(`${BASE}/api/admin/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password: PASSWORD }),
});
const setCookies = loginRes.headers.getSetCookie?.() ?? [];
const cookie = setCookies.map((c) => c.split(";")[0]).join("; ");
const loginData = await loginRes.json();
check("Giriş (yönetici şifresi)", loginData.success === true && !!cookie);
if (!cookie) process.exit(1);

// 2) İstatistikler (DB okuma)
const stRes = await fetch(`${BASE}/api/stats`);
const st = await stRes.json();
check("İstatistikler (DB okuma)", stRes.status === 200 && st.success === true);

// 3) Tarama başlat + tamamla (DB yazma)
const scanStartRes = await fetch(`${BASE}/api/scan/start`, {
  method: "POST",
  headers: { "Content-Type": "application/json", cookie },
  body: JSON.stringify({ scope: "quick" }),
});
const scanStart = await scanStartRes.json();
check("Tarama oturumu başlatma (DB yazma)", scanStartRes.status === 200 && scanStart.success === true && !!scanStart.scanId, scanStart.error ?? "");

if (scanStart.scanId) {
  const compRes = await fetch(`${BASE}/api/scan/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ scanId: scanStart.scanId }),
  });
  const comp = await compRes.json();
  check("Tarama oturumu tamamlama", compRes.status === 200 && comp.success === true);
}

// 4) Görsel yükleme → data URL (dosya sistemi kullanmadan)
const img = await sharp({
  create: { width: 640, height: 420, channels: 3, background: { r: 180, g: 90, b: 30 } },
})
  .jpeg({ quality: 90 })
  .toBuffer();
const fd = new FormData();
fd.append("file", new Blob([img], { type: "image/jpeg" }), "test.jpg");
const upRes = await fetch(`${BASE}/api/admin/upload`, { method: "POST", headers: { cookie }, body: fd });
const up = await upRes.json();
check(
  "Görsel yükleme (base64 data URL)",
  upRes.status === 200 && up.success === true && typeof up.url === "string" && up.url.startsWith("data:image/jpeg;base64,"),
  `${up.bytes ?? 0} bayt`
);

// 5) Data URL görselli haber ekleme + silme
const newsRes = await fetch(`${BASE}/api/admin/findings`, {
  method: "POST",
  headers: { "Content-Type": "application/json", cookie },
  body: JSON.stringify({
    trTitle: "Vercel uyumluluk test haberi",
    trSummary:
      "Bu kayıt canlı yayın düzeltmelerini doğrulamak için otomatik oluşturuldu; test sonunda otomatik olarak silinir.",
    category: "genel",
    importance: 3,
    isNewTech: false,
    images: up.success ? [{ url: up.url, alt: "test görseli" }] : [],
  }),
});
const news = await newsRes.json();
check("Haber ekleme (data URL görselli)", newsRes.status === 200 && news.success === true, news.error ?? "");
if (news.success) {
  const delRes = await fetch(`${BASE}/api/findings/${news.finding.id}`, {
    method: "DELETE",
    headers: { cookie },
  });
  const del = await delRes.json();
  check("Test haberi temizlendi", delRes.status === 200 && del.success === true);
}

// 6) DuckDuckGo yedek arama (Z-AI kullanılamadığında taramanın çalışması için)
try {
  const items = await searchWebDuckDuckGo("olay yeri inceleme parmak izi teknolojisi", 5);
  check("DuckDuckGo yedek arama", Array.isArray(items) && items.length > 0, `${items.length} sonuç`);
} catch (e) {
  check("DuckDuckGo yedek arama", false, String(e));
}

const failed = results.filter((r) => !r).length;
console.log(failed ? `SONUÇ: ${failed} test başarısız` : "SONUÇ: tüm testler geçti");
process.exit(failed ? 1 : 0);
