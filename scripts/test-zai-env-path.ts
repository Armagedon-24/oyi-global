/**
 * OYİ GLOBAL — ZAI env-kurucu yolu testi (tek seferlik).
 * Vercel'de llm.ts getZAI() env değişkenleriyle SDK'yı kurar; aynı yolu
 * yerelde birebir simüle edip web_search çağrısını doğrular.
 * Değerler yazdırılmaz, yalnızca başarı bilgisi gösterilir.
 */
import fs from "node:fs";
import ZAI from "z-ai-web-dev-sdk";

const cfg = JSON.parse(fs.readFileSync("/etc/.z-ai-config", "utf8"));
console.log("Kaynak config:", {
  baseUrlVar: !!cfg.baseUrl,
  apiKeyVar: !!cfg.apiKey,
  tokenVar: !!cfg.token,
});

const Ctor = ZAI as unknown as new (config: Record<string, string>) => typeof ZAI;
const zai = new Ctor({
  baseUrl: String(cfg.baseUrl),
  apiKey: String(cfg.apiKey),
  chatId: String(cfg.chatId ?? ""),
  userId: String(cfg.userId ?? ""),
  token: String(cfg.token ?? ""),
});

try {
  const results = (await zai.functions.invoke("web_search", {
    query: "crime scene investigation new technology",
    num: 3,
  })) as unknown[];
  console.log("web_search SONUÇ:", Array.isArray(results) ? `${results.length} adet döndü ✅` : `tip=${typeof results}`);
  if (Array.isArray(results) && results[0]) {
    const r = results[0] as { name?: string; url?: string };
    console.log("ilk sonuç url var mı:", !!r.url);
  }
} catch (err) {
  console.error("web_search HATA:", String((err as Error)?.message ?? err).slice(0, 300));
  process.exit(1);
}
