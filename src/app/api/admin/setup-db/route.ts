import { NextResponse } from "next/server";
import { db, resolveDatabaseUrl } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import seedDump from "@/data/seed-dump.json";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * OYİ GLOBAL — Canlı (Vercel/Postgres) veritabanı kurulumu (yalnızca yönetici).
 *
 * Ne yapar?
 *  1) Prisma şemasıyla (prisma/schema.postgres.prisma) birebir uyumlu tabloları,
 *    indeksleri ve dış anahtarları OLUŞTURUR (CREATE IF NOT EXISTS — tekrar
 *    çalıştırmaya güvenli, veri kaybettirmez).
 *  2) İstek gövdesinde { "seed": true } varsa ve tablolar boşsa, depoda bundled
 *    gelen src/data/seed-dump.json içindeki dergi içeriğini (bulgular, yorumlar,
 *    taramalar, izleme kelimeleri, bültenler) Postgres'e aktarır.
 *
 * Kullanım: POST /api/admin/setup-db  gövde: { "seed": true }
 */
const DDL: string[] = [
  `CREATE TABLE IF NOT EXISTS "ScanRun" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'all',
    "focusCategory" TEXT,
    "status" TEXT NOT NULL DEFAULT 'running',
    "totalFound" INTEGER NOT NULL DEFAULT 0,
    "newItems" INTEGER NOT NULL DEFAULT 0,
    "languagesCovered" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "ScanRun_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "WatchKeyword" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WatchKeyword_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "WatchKeyword_term_key" ON "WatchKeyword"("term")`,
  `CREATE TABLE IF NOT EXISTS "Finding" (
    "id" TEXT NOT NULL,
    "scanId" TEXT,
    "url" TEXT NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "originalSnippet" TEXT NOT NULL DEFAULT '',
    "trTitle" TEXT NOT NULL,
    "trSummary" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'genel',
    "importance" INTEGER NOT NULL DEFAULT 3,
    "isNewTech" BOOLEAN NOT NULL DEFAULT false,
    "keywords" TEXT NOT NULL DEFAULT '',
    "publishedDate" TEXT,
    "images" TEXT NOT NULL DEFAULT '[]',
    "deepAnalysis" TEXT,
    "fullArticle" TEXT,
    "bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Finding_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Finding_url_key" ON "Finding"("url")`,
  `CREATE INDEX IF NOT EXISTS "Finding_category_idx" ON "Finding"("category")`,
  `CREATE INDEX IF NOT EXISTS "Finding_language_idx" ON "Finding"("language")`,
  `CREATE INDEX IF NOT EXISTS "Finding_createdAt_idx" ON "Finding"("createdAt")`,
  `CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Anonim Okur',
    "body" TEXT NOT NULL,
    "ip" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "Comment_findingId_idx" ON "Comment"("findingId")`,
  `CREATE INDEX IF NOT EXISTS "Comment_createdAt_idx" ON "Comment"("createdAt")`,
  `CREATE TABLE IF NOT EXISTS "Briefing" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Briefing_pkey" PRIMARY KEY ("id")
  )`,
];

/**
 * Dış anahtarlar. NileDB gibi bazı serverless Postgres sunucuları `DO $$ … $$`
 * PL/pgSQL bloklarını desteklemediğinden, anahtar varlığını önce pg_constraint
 * üzerinde okuyor, yoksa koşullu ALTER TABLE ile ekliyoruz.
 */
const FK_CHECKS: { name: string; sql: string }[] = [
  {
    name: "Finding_scanId_fkey",
    sql:
      `ALTER TABLE "Finding" ADD CONSTRAINT "Finding_scanId_fkey" ` +
      `FOREIGN KEY ("scanId") REFERENCES "ScanRun"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
  },
  {
    name: "Comment_findingId_fkey",
    sql:
      `ALTER TABLE "Comment" ADD CONSTRAINT "Comment_findingId_fkey" ` +
      `FOREIGN KEY ("findingId") REFERENCES "Finding"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
  },
];

async function applyForeignKeys(
  results: { step: string; ok: boolean; error?: string }[]
) {
  for (const fk of FK_CHECKS) {
    try {
      const rows = (await db.$queryRawUnsafe<{ n: number }[]>(
        `SELECT COUNT(*)::int AS n FROM pg_constraint WHERE conname = $1`,
        fk.name
      )) as unknown as { n: number }[];
      const exists = Number(Array.isArray(rows) ? rows[0]?.n ?? 0 : 0) > 0;
      if (exists) {
        results.push({ step: `FK ${fk.name} (zaten var)`, ok: true });
      } else {
        await db.$executeRawUnsafe(fk.sql);
        results.push({ step: `FK ${fk.name} eklendi`, ok: true });
      }
    } catch (err) {
      results.push({
        step: `FK ${fk.name}`,
        ok: false,
        error: String((err as Error)?.message ?? err).slice(0, 300),
      });
    }
  }
}

function asDate(value: unknown): Date | null {
  if (!value || typeof value !== "string") return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

async function seedFromDump() {
  const out: Record<string, string> = {};

  if ((await db.scanRun.count()) === 0 && seedDump.scanRuns.length > 0) {
    await db.scanRun.createMany({
      data: seedDump.scanRuns.map((r) => ({
        id: r.id,
        scope: r.scope,
        focusCategory: r.focusCategory ?? null,
        status: r.status,
        totalFound: r.totalFound ?? 0,
        newItems: r.newItems ?? 0,
        languagesCovered: r.languagesCovered ?? 0,
        startedAt: asDate(r.startedAt) ?? new Date(),
        completedAt: asDate(r.completedAt),
      })),
    });
  }
  out.scanRuns = `${await db.scanRun.count()} kayıt`;

  if ((await db.finding.count()) === 0 && seedDump.findings.length > 0) {
    let done = 0;
    for (let i = 0; i < seedDump.findings.length; i += 25) {
      const chunk = seedDump.findings.slice(i, i + 25).map((f) => ({
        id: f.id,
        scanId: f.scanId ?? null,
        url: f.url,
        originalTitle: f.originalTitle,
        originalSnippet: f.originalSnippet ?? "",
        trTitle: f.trTitle,
        trSummary: f.trSummary ?? "",
        language: f.language,
        sourceName: f.sourceName ?? "",
        category: f.category ?? "genel",
        importance: f.importance ?? 3,
        isNewTech: Boolean(f.isNewTech),
        keywords: f.keywords ?? "",
        publishedDate: f.publishedDate ?? null,
        images: f.images ?? "[]",
        deepAnalysis: f.deepAnalysis ?? null,
        fullArticle: f.fullArticle ?? null,
        bookmarked: Boolean(f.bookmarked),
        isRead: Boolean(f.isRead),
        notes: f.notes ?? null,
        createdAt: asDate(f.createdAt) ?? new Date(),
      }));
      await db.finding.createMany({ data: chunk });
      done += chunk.length;
    }
    out.findings = `${done} kayıt aktarıldı`;
  } else {
    out.findings = `${await db.finding.count()} kayıt (hedefte veri vardı, atlandı)`;
  }

  if ((await db.comment.count()) === 0 && seedDump.comments.length > 0) {
    await db.comment.createMany({
      data: seedDump.comments.map((c) => ({
        id: c.id,
        findingId: c.findingId,
        author: c.author ?? "Anonim Okur",
        body: c.body,
        ip: c.ip ?? "",
        createdAt: asDate(c.createdAt) ?? new Date(),
      })),
    });
  }
  out.comments = `${await db.comment.count()} kayıt`;

  if ((await db.watchKeyword.count()) === 0 && seedDump.watchKeywords.length > 0) {
    await db.watchKeyword.createMany({
      data: seedDump.watchKeywords.map((k) => ({
        id: k.id,
        term: k.term,
        createdAt: asDate(k.createdAt) ?? new Date(),
      })),
    });
  }
  out.watchKeywords = `${await db.watchKeyword.count()} kayıt`;

  if ((await db.briefing.count()) === 0 && seedDump.briefings.length > 0) {
    await db.briefing.createMany({
      data: seedDump.briefings.map((b) => ({
        id: b.id,
        content: b.content,
        itemCount: b.itemCount ?? 0,
        createdAt: asDate(b.createdAt) ?? new Date(),
      })),
    });
  }
  out.briefings = `${await db.briefing.count()} kayıt`;

  return out;
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const dbUrl = resolveDatabaseUrl();
  if (dbUrl && !/^postgres(ql)?:\/\//i.test(dbUrl)) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Bu route yalnızca Postgres bağlantısında çalışır. Vercel'de Dergi veritabanını bağlayın ve DATABASE_URL'in postgres:// ile başladığından emin olun.",
      },
      { status: 400 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as { seed?: boolean };
  const results: { step: string; ok: boolean; error?: string }[] = [];

  for (let i = 0; i < DDL.length; i++) {
    const label = DDL[i].slice(0, 60).replace(/\s+/g, " ");
    try {
      await db.$executeRawUnsafe(DDL[i]);
      results.push({ step: `DDL #${i + 1}: ${label}…`, ok: true });
    } catch (err) {
      results.push({
        step: `DDL #${i + 1}: ${label}…`,
        ok: false,
        error: String((err as Error)?.message ?? err).slice(0, 300),
      });
    }
  }

  await applyForeignKeys(results);

  const failed = results.filter((r) => !r.ok);
  let seed: Record<string, string> | null = null;
  if (body.seed && failed.length === 0) {
    try {
      seed = await seedFromDump();
    } catch (err) {
      results.push({
        step: "seed",
        ok: false,
        error: String((err as Error)?.message ?? err).slice(0, 300),
      });
    }
  }

  const anyFailed = results.some((r) => !r.ok);
  return NextResponse.json(
    {
      success: !anyFailed,
      database: "postgres",
      results,
      seed,
      error: anyFailed ? "Bazı adımlar başarısız oldu — results alanına bakın." : undefined,
    },
    { status: anyFailed ? 500 : 200 }
  );
}
