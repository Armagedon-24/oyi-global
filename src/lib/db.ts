import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * OYİ GLOBAL — Veritabanı bağlantı adresi çözümleyici.
 *
 * Vercel/Neon gibi platformlar veritabanı entegrasyonu kurulduğunda bağlantı
 * bilgisini farklı adlarla enjekte edebilir: DATABASE_URL, POSTGRES_URL,
 * POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING, DATABASE_URL_UNPOOLED veya
 * entegrasyon önekiyle (örn. STORAGE_URL_DATABASE_URL) adlandırılmış değişkenler.
 *
 * Bu yüzden adres sırayla şöyle aranır:
 *   1) Doğrudan (non-pooled/unpooled) postgres adresi — pgbouncer hazır
 *      ifade (prepared statement) sorunlarını önler,
 *   2) DATABASE_URL,
 *   3) DATABASE_URL ile biten önekli adlar,
 *   4) POSTGRES_PRISMA_URL / POSTGRES_URL,
 *   5) bilinen ad kalıbına uyan ilk postgres adresi.
 *
 * Hiçbiri bulunamazsa undefined döner ve Prisma şemadaki env("DATABASE_URL")
 * değerini kullanır (yerel geliştirmede SQLite: file:../db/custom.db).
 */
export function resolveDatabaseUrl(): string | undefined {
  const postgresVars = Object.entries(process.env).filter(
    ([key, val]) =>
      typeof val === "string" &&
      /^postgres(ql)?:\/\//i.test(val) &&
      /(DATABASE_URL|POSTGRES_URL|POSTGRES_PRISMA_URL)$/i.test(key) &&
      // Kimlik bilgisi taşımayan URL'leri ele (örn. entegrasyon şablonlarının
      // boş bıraktığı postgres://host/db biçimindeki değişkenler): kullanıcı
      // ve/veya şifre olmadan sunucu kimlik doğrulaması imkânsızdır.
      /\/\/[^@\s]+@/.test(val)
  ) as [string, string][];

  const pick = (re: RegExp): string | undefined => postgresVars.find(([key]) => re.test(key))?.[1];

  const ordered: (string | undefined)[] = [
    pick(/(NON_POOLING|UNPOOLED|DIRECT)$/i),
    process.env.DATABASE_URL?.trim() || undefined,
    pick(/DATABASE_URL$/i),
    pick(/POSTGRES_PRISMA_URL$/i),
    pick(/POSTGRES_URL$/i),
    postgresVars[0]?.[1],
  ];

  return ordered.find((u): u is string => !!u && /^postgres(ql)?:\/\//i.test(u));
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: resolveDatabaseUrl(),
    log: process.env.NODE_ENV === "production" ? ["error"] : ["query"],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
