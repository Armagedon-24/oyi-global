/**
 * OYİ GLOBAL — Yerel SQLite içeriğini src/data/seed-dump.json dosyasına aktarır.
 * Bu JSON, canlıya (Vercel/Postgres) kurulum sırasında /api/admin/setup-db
 * aracılığıyla içeri aktarılır (POST { seed: true }).
 *
 * Çalıştırma: bun scripts/export-sqlite-json.mjs
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync } from "node:fs";

const db = new PrismaClient();

try {
  const [scanRuns, findings, comments, watchKeywords, briefings] = await Promise.all([
    db.scanRun.findMany({ orderBy: { startedAt: "asc" } }),
    db.finding.findMany({ orderBy: { createdAt: "asc" } }),
    db.comment.findMany({ orderBy: { createdAt: "asc" } }),
    db.watchKeyword.findMany({ orderBy: { createdAt: "asc" } }),
    db.briefing.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  const dump = { exportedAt: new Date().toISOString(), scanRuns, findings, comments, watchKeywords, briefings };

  mkdirSync("src/data", { recursive: true });
  writeFileSync("src/data/seed-dump.json", JSON.stringify(dump));

  const kb = Math.round(JSON.stringify(dump).length / 1024);
  console.log(
    `seed-dump.json yazıldı (${kb} KB): ${scanRuns.length} tarama, ${findings.length} bulgu, ${comments.length} yorum, ${watchKeywords.length} kelime, ${briefings.length} bülten`
  );
} catch (err) {
  console.error("Dışa aktarma hatası:", err);
  process.exitCode = 1;
} finally {
  await db.$disconnect().catch(() => {});
}
