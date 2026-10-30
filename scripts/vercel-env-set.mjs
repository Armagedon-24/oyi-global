/**
 * OYİ GLOBAL — Vercel ortam değişkeni ayarlayıcı (tek seferlik operasyon scripti).
 *
 * /etc/.z-ai-config içindeki SDK kimliklerini okuyup Vercel projesine
 * ZAI_BASE_URL, ZAI_API_KEY, ZAI_CHAT_ID, ZAI_USER_ID, ZAI_TOKEN olarak yazar.
 * Değerler ekrana ASLA yazdırılmaz; yalnızca başarı durumu gösterilir.
 *
 * Kullanım: VERCEL_TOKEN=... TEAM_ID=... PROJECT_ID=... bun scripts/vercel-env-set.mjs
 */

const TOKEN = process.env.VERCEL_TOKEN;
const TEAM = process.env.TEAM_ID;
const PROJECT = process.env.PROJECT_ID;

if (!TOKEN || !TEAM || !PROJECT) {
  console.error("VERCEL_TOKEN / TEAM_ID / PROJECT_ID ortam değişkenleri gerekli");
  process.exit(1);
}

const config = JSON.parse((await import("node:fs")).readFileSync("/etc/.z-ai-config", "utf8"));

const mapping = {
  ZAI_BASE_URL: config.baseUrl,
  ZAI_API_KEY: config.apiKey,
  ZAI_CHAT_ID: config.chatId,
  ZAI_USER_ID: config.userId,
  ZAI_TOKEN: config.token,
};

let ok = 0;
for (const [key, value] of Object.entries(mapping)) {
  if (!value || !String(value).trim()) {
    console.log(`${key}: KAYNAK DEĞER BOŞ — atlandı`);
    continue;
  }
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${PROJECT}/env?upsert=true&teamId=${TEAM}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: String(value), type: "encrypted", target: ["production", "preview"] }),
    }
  );
  const body = await res.json().catch(() => ({}));
  if (res.ok) {
    console.log(`${key}: EKLENDİ/GÜNCELLENDİ (created=${body.created ?? "-"})`);
    ok++;
  } else {
    console.log(`${key}: HATA ${res.status} ${JSON.stringify(body.error ?? body).slice(0, 200)}`);
  }
}
console.log(`Tamam: ${ok}/5 ZAI değişkeni yazıldı`);
