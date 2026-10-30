import { NextResponse } from "next/server";
import { db, resolveDatabaseUrl } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * OYİ GLOBAL — Veritabanı bağlantı teşhisi (yalnızca yönetici).
 *
 * ŞİFRE ASLA DÖNMEZ: sadece seçilen env anahtarının ADI ve URL'in maskeli
 * yapısı (şema, kullanıcı adı, host:port, db adı, ssl parametreleri) döner.
 * Ek olarak gerçek bir `SELECT 1` denemesinin sonucunu raporlar.
 */
function mask(url: string): string {
  return url
    .replace(/(postgres(ql)?:\/\/[^:\/@]*:)[^@]*@/i, "$1***@")
    .replace(/([?&]password=)[^&]*/gi, "$1***");
}

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Bu işlem yalnızca yönetici içindir." },
        { status: 401 }
      );
    }

    const resolved = resolveDatabaseUrl();
    const candidates = Object.entries(process.env)
      .filter(
        ([key, val]) =>
          typeof val === "string" &&
          /^postgres(ql)?:\/\//i.test(val) &&
          /(DATABASE_URL|POSTGRES_URL|POSTGRES_PRISMA_URL)$/i.test(key)
      )
      .map(([key, val]) => ({
        key,
        masked: mask(val),
        userPart: (val.match(/^[^:\/@]+:\/\/([^:@]*)/) || [])[1] ?? null,
        hostPart: (val.match(/@([^\/?]+)/) || [])[1] ?? null,
        dbPart: (val.match(/\/([^\/?]+)(\?|$)/) || [])[1] ?? null,
        sslParam: (val.match(/[?&]sslmode=([^&]+)/) || [])[1] ?? null,
      }));

    let probe: { ok: boolean; error?: string } = { ok: false };
    if (resolved) {
      try {
        await db.$queryRawUnsafe("SELECT 1 as ok");
        probe = { ok: true };
      } catch (e) {
        probe = { ok: false, error: String(e).slice(0, 800) };
      }
    }

    return NextResponse.json({
      success: true,
      resolvedFound: !!resolved,
      resolvedMasked: resolved ? mask(resolved) : null,
      candidates,
      probe,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, fatal: String(e && (e as Error).stack ? (e as Error).stack : e).slice(0, 1500) },
      { status: 500 }
    );
  }
}
