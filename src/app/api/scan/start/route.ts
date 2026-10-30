import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLanguages } from "@/lib/forensics-config";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

/** POST /api/scan/start — yeni tarama oturumu başlatır (yalnızca yönetici) */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json().catch(() => ({}));
    const scope: string = body.scope === "quick" ? "quick" : "all";
    const focusCategory: string | null =
      typeof body.focusCategory === "string" && body.focusCategory !== "all"
        ? body.focusCategory
        : null;

    const languages = getLanguages(scope);

    const scan = await db.scanRun.create({
      data: {
        scope,
        focusCategory,
        status: "running",
      },
    });

    return NextResponse.json({
      success: true,
      scanId: scan.id,
      startedAt: scan.startedAt,
      languages: languages.map((l) => ({
        code: l.code,
        name: l.name,
        flag: l.flag,
        steps: l.queries.length,
      })),
    });
  } catch (error) {
    console.error("[scan/start]", error);
    const msg = String((error as { message?: string })?.message ?? "");
    const dbIssue =
      /DATABASE_URL|Can't reach database|Unable to open|does not exist|Protocol|P1001|P1003|P2021|P2022/i.test(
        msg
      );
    return NextResponse.json(
      {
        success: false,
        error: dbIssue
          ? "Veritabanı bağlantısı kurulamadı (DATABASE_URL kontrol edin — Vercel'de Postgres gerekir)."
          : "Tarama oturumu başlatılamadı",
      },
      { status: 500 }
    );
  }
}
