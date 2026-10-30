import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  getZAI,
  searchWebDuckDuckGo,
  searchWebBingNewsRss,
  searchWebGoogleNewsRss,
} from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * OYİ GLOBAL — Arama hattı teşhisi (yalnızca yönetici).
 *
 * searchWeb'in üç katmanını (Z-AI web_search, DuckDuckGo HTML, Google News
 * RSS) ayrı ayrı deneyip her birinin sonucunu ve hatasını raporlar.
 * Değer sırrı içermez.
 */
export async function GET() {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Bu işlem yalnızca yönetici içindir." },
      { status: 401 }
    );
  }

  const q = "forensic science technology news";
  const report: Record<string, unknown> = {};

  // 1) Z-AI web_search
  try {
    const zai = await getZAI();
    const results = (await zai.functions.invoke("web_search", {
      query: q,
      num: 5,
      recency_days: 365,
    })) as unknown[];
    report.zai = {
      ok: Array.isArray(results) && results.length > 0,
      count: Array.isArray(results) ? results.length : null,
      sample: Array.isArray(results) && results[0]
        ? String((results[0] as { name?: string }).name ?? "").slice(0, 120)
        : null,
    };
  } catch (e) {
    report.zai = { ok: false, error: String(e).slice(0, 400) };
  }

  // 2) DuckDuckGo HTML
  try {
    const ddg = await searchWebDuckDuckGo(q, 5);
    report.ddg = {
      ok: ddg.length > 0,
      count: ddg.length,
      sample: ddg[0] ? String(ddg[0].name).slice(0, 120) : null,
    };
  } catch (e) {
    report.ddg = { ok: false, error: String(e).slice(0, 400) };
  }

  // 2b) Bing News RSS
  try {
    const bing = await searchWebBingNewsRss(q, 5);
    report.bing = {
      ok: bing.length > 0,
      count: bing.length,
      sample: bing[0] ? String(bing[0].name).slice(0, 120) : null,
    };
  } catch (e) {
    report.bing = { ok: false, error: String(e).slice(0, 400) };
  }

  // 3) Google News RSS
  try {
    const rss = await searchWebGoogleNewsRss(q, 5);
    report.rss = {
      ok: rss.length > 0,
      count: rss.length,
      sample: rss[0] ? String(rss[0].name).slice(0, 120) : null,
    };
  } catch (e) {
    report.rss = { ok: false, error: String(e).slice(0, 400) };
  }

  // 4) HTTP çeviri yolları (clients5 → gtx → MyMemory) — arama sonrası
  //    LLM çevirisi kullanılamazsa taramanın bunlara düşmesi gerekir.
  const { httpTranslate } = await import("@/lib/llm");
  const sample = "Forensic scientists use new digital imaging technology.";
  try {
    const tr = await httpTranslate(sample, "en");
    report.httpTranslate = {
      ok: tr.length > 5,
      result: tr.slice(0, 160) || null,
    };
  } catch (e) {
    report.httpTranslate = { ok: false, error: String(e).slice(0, 400) };
  }

  return NextResponse.json({ success: true, query: q, report });
}
