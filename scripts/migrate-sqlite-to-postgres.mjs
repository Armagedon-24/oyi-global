/**
 * OYİ GLOBAL — Yerel SQLite içeriğini Postgres'e (Vercel) taşır.
 *
 * Kullanım (proje kökünde, sırayla):
 *   1) Tabloları oluştur:
 *      DATABASE_URL="postgres://<kul>:<sifre>@<host>/<db>?sslmode=require" bunx prisma db push --schema prisma/schema.postgres.prisma
 *   2) Geçici Postgres Prisma istemcisini üret (--output Prisma 6'da şema içindedir):
 *      bunx prisma generate --schema prisma/schema.migrate.prisma
 *   3) Veriyi taşı:
 *      PG_URL="postgres://<kul>:<sifre>@<host>/<db>?sslmode=require" bun scripts/migrate-sqlite-to-postgres.mjs
 *
 * Not: 2. adımdaki prisma/pg-client-gen klasörü geçicidir; taşıma sonrası silinebilir.
 * Otomatik alternatif: tablo kurulumu + veri aktarımı için /api/admin/setup-db
 * (POST { "seed": true }) kullanılabilir — terminal gerekmez.
 */
import { PrismaClient as SqliteClient } from "@prisma/client";
import { PrismaClient as PgClient } from "../prisma/pg-client-gen/index.js";

const pgUrl = process.env.PG_URL;
if (!pgUrl) {
  console.error(
    'HATA: PG_URL gerekli. Örnek: PG_URL="postgres://..." bun scripts/migrate-sqlite-to-postgres.mjs'
  );
  process.exit(1);
}

const src = new SqliteClient();
const dst = new PgClient({ datasourceUrl: pgUrl });

async function copyBatched(rows, createMany, label, size = 20) {
  if (!rows.length) {
    console.log(`- ${label}: kaynak boş, atlandı`);
    return 0;
  }
  let done = 0;
  for (let i = 0; i < rows.length; i += size) {
    await createMany(rows.slice(i, i + size));
    done += Math.min(size, rows.length - i);
    process.stdout.write(`- ${label}: ${done}/${rows.length}\r`);
  }
  process.stdout.write("\n");
  return rows.length;
}

try {
  const [scanRuns, findings, comments, keywords, briefings] = await Promise.all([
    src.scanRun.findMany(),
    src.finding.findMany(),
    src.comment.findMany({ orderBy: { createdAt: "asc" } }),
    src.watchKeyword.findMany(),
    src.briefing.findMany({ orderBy: { createdAt: "asc" } }),
  ]);
  console.log(
    `Kaynak (SQLite): ${scanRuns.length} tarama, ${findings.length} bulgu, ${comments.length} yorum, ${keywords.length} anahtar kelime, ${briefings.length} bülten`
  );

  // 1) ScanRun (bulguların üst kaydı — önce yazılmalı)
  await copyBatched(
    scanRuns,
    (chunk) => dst.scanRun.createMany({ data: chunk, skipDuplicates: true }),
    "ScanRun",
    50
  );

  // 2) Finding (url unique — tekrar çalıştırmada çoğalmaz)
  await copyBatched(
    findings,
    (chunk) => dst.finding.createMany({ data: chunk, skipDuplicates: true }),
    "Finding",
    20
  );

  // 3) Comment (unique alanı yok — hedef boş değilse çoğalmayı önlemek için atlanır)
  const dstComments = await dst.comment.count();
  if (dstComments === 0) {
    await copyBatched(
      comments,
      (chunk) => dst.comment.createMany({ data: chunk }),
      "Comment",
      50
    );
  } else {
    console.log(`- Comment: hedefte ${dstComments} kayıt var, kopyalama atlandı`);
  }

  // 4) WatchKeyword (term unique)
  await copyBatched(
    keywords,
    (chunk) => dst.watchKeyword.createMany({ data: chunk, skipDuplicates: true }),
    "WatchKeyword",
    50
  );

  // 5) Briefing (unique alanı yok — hedef boş değilse atlanır)
  const dstBriefings = await dst.briefing.count();
  if (dstBriefings === 0) {
    await copyBatched(
      briefings,
      (chunk) => dst.briefing.createMany({ data: chunk }),
      "Briefing",
      20
    );
  } else {
    console.log(`- Briefing: hedefte ${dstBriefings} kayıt var, kopyalama atlandı`);
  }

  const [t1, t2, t3, t4, t5] = await Promise.all([
    dst.scanRun.count(),
    dst.finding.count(),
    dst.comment.count(),
    dst.watchKeyword.count(),
    dst.briefing.count(),
  ]);
  console.log(
    `Hedef (Postgres) durum: ${t1} tarama, ${t2} bulgu, ${t3} yorum, ${t4} anahtar kelime, ${t5} bülten`
  );
  console.log("Taşıma tamamlandı.");
} catch (err) {
  console.error("Taşıma hatası:", err);
  process.exitCode = 1;
} finally {
  await src.$disconnect().catch(() => {});
  await dst.$disconnect().catch(() => {});
}
