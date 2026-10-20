import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { assistantReply, searchWeb, type AssistantMessage } from "@/lib/llm";
import { categoryLabel, getLanguage } from "@/lib/forensics-config";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * POST /api/assistant
 * Gövde: { messages: AssistantMessage[] }
 * Arşiv bağlamı + (opsiyonel) güncel web araması ile Türkçe yanıt üretir.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages: AssistantMessage[] = Array.isArray(body?.messages)
      ? body.messages
          .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-12)
          .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
      : [];

    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    if (!lastUser.trim()) {
      return NextResponse.json({ success: false, error: "Soru boş olamaz" }, { status: 400 });
    }

    // 1) Arşiv bağlamı: en güncel 60 bulguyu kompakt biçimde derle
    const recent = await db.finding.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 60,
      select: {
        id: true,
        trTitle: true,
        trSummary: true,
        category: true,
        importance: true,
        isNewTech: true,
        language: true,
        sourceName: true,
        publishedDate: true,
        notes: true,
      },
    });

    const archiveContext =
      recent.length > 0
        ? `ARŞİV BAĞLAMI (en güncel ${recent.length} bulgu; [B#n] kodlarıyla atıf yapabilirsin):\n${recent
            .map((f, i) => {
              const lang = getLanguage(f.language);
              return `[B#${i + 1}] ${f.trTitle} — ${categoryLabel(f.category)} · önem ${f.importance}/5 · ${lang?.name ?? f.language} · ${f.sourceName}\n   ${f.trSummary.slice(0, 160)}`;
            })
            .join("\n")}\n\n`
        : "ARŞİV BAĞLAMI: Arşiv şu anda boş; genel bilgine güven.\n\n";

    // 2) Güncel web bağlamı: kullanıcının sorusuyla canlı arama (hata olursa sessizce geç)
    let webContext = "";
    try {
      // Soru cümleleri arama motorunda 422 verebilir: soru işaretlerini temizle, kısalt
      const searchQuery = `olay yeri inceleme adli bilimler ${lastUser}`
        .replace(/[?¿?!]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);
      const webResults = await searchWeb(searchQuery, 6, 180);
      if (webResults.length > 0) {
        webContext = `GÜNCEL WEB SONUÇLARI (sorunun yanıtı için ek kaynak):\n${webResults
          .map((r, i) => `[W${i + 1}] ${r.name} (${r.host_name})\n    ${r.snippet?.slice(0, 200) ?? ""}`)
          .join("\n")}\n`;
      }
    } catch {
      // web araması başarısızsa sadece arşivle yanıtla
    }

    const reply = await assistantReply(messages, archiveContext, webContext);

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("[assistant POST]", error);
    return NextResponse.json(
      { success: false, error: "Asistan yanıtı üretilemedi" },
      { status: 500 }
    );
  }
}
