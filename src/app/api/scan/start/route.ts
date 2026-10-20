import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLanguages } from "@/lib/forensics-config";

export const runtime = "nodejs";
export const maxDuration = 60;

/** POST /api/scan/start — yeni tarama oturumu başlatır */
export async function POST(req: Request) {
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
    return NextResponse.json(
      { success: false, error: "Tarama oturumu başlatılamadı" },
      { status: 500 }
    );
  }
}
