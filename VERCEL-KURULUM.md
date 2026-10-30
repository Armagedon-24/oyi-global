# OYİ GLOBAL — Vercel Canlı Yayın Kurulum Rehberi

Bu rehber, uygulamanın https://oyi-global.vercel.app adresinde **tam çalışır** duruma
gelmesi için gereken adımları açıklar. Tarama hatasının kökü: Vercel sunucusuz
(serverless) ortamında SQLite dosyası çalışmaz — kalıcı bir **Postgres** veritabanı
gerekir.

## Adım 1 — Dergi veritabanını projeye bağla (Vercel > Storage)

1. Vercel panelinde **Storage** sekmesine gir, **Dergi** veritabanını seç / "Connect
   to a Database" akışını başlat.
2. "Connect a Project" ekranında:
   - **Project:** `oyi-global`
   - **Environment:** `Production` + `Preview` (ikisi de seçili kalsın)
   - **Custom prefix:** olduğu gibi kalsın (kod, önekli değişken adlarını da tanır)
   - **Sensitive:** kapat (ileride değerleri görmek istersek gerekir)
   - **Skip'e DEĞİL**, "Connect / Continue" butonuna bas.
3. Bağlantı sonrası Vercel, projeye veritabanı bağlantı değişkenlerini (DATABASE_URL
   vb.) otomatik ekler.

> Not: Kod artık `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`,
> `DATABASE_URL_UNPOOLED` ve önekli adları (örn. `STORAGE_URL_DATABASE_URL`)
> otomatik algılar — ek bir ayar gerekmez.

## Adım 2 — Güncel kodu GitHub'a yükle (Vercel otomatik yeniden yayınlar)

Bu paketteki dosyaları GitHub deposuna (armagedon-24/oyi-global) yükle:

**Bu oturumda değişen dosyalar (yalnız bunları yüklemek yeterli):**

| Dosya | Amaç |
| --- | --- |
| `src/lib/db.ts` | Bağlantı adresini önekli env adlarından da çözümler |
| `src/lib/llm.ts` | Ücretsiz çeviri zinciri + RSS yedek arama |
| `src/app/api/admin/setup-db/route.ts` | **YENİ** — tablo kurulumu + veri taşıma (tek istek) |
| `src/data/seed-dump.json` | **YENİ** — dergi arşivi (398 bulgu) kurulum paketi |
| `src/app/api/scan/step/route.ts` | Fonksiyon süresi 60 sn'ye sabitlendi |
| `src/app/api/briefing/route.ts` | Aynı (60 sn) |
| `src/app/api/deep-dive/route.ts` | Aynı (60 sn) |
| `src/app/api/full-article/route.ts` | Aynı (60 sn) |
| `src/app/api/assistant/route.ts` | Aynı (60 sn) |
| `src/app/api/enrich-images/route.ts` | Aynı (60 sn) |
| `prisma/schema.postgres.prisma` | binaryTargets eklendi (Vercel uyumu) |
| `prisma/schema.migrate.prisma` | **YENİ** — taşıma istemcisi şeması |
| `scripts/export-sqlite-json.mjs` | **YENİ** — SQLite → JSON dışa aktarma |
| `scripts/verify-vercel-fixes.mjs` | 8 uçtan uca canlı test |
| `scripts/restart-server.sh` | Temiz env ile başlatma |
| `VERCEL-KURULUM.md` | Bu rehber |

> Emin değilsen zip'teki **tüm** dosyaları (node_modules, .next, download hariç)
> yükleyebilirsin; deponun mevcut dosyalarının üzerine yazar.

GitHub'a yükleme yapılınca Vercel otomatik olarak yeniden derler (Deployments
sekmesinden takip edilebilir). Derleme Postgres Prisma istemcisini üretir
(vercel.json içindeki buildCommand ile).

## Adım 3 — Veritabanını kur ve arşivi taşı (tek istek)

Yayın tamamlandıktan sonra tarayıcıda / komutla **tek bir istek** yeterlidir:

```
POST https://oyi-global.vercel.app/api/admin/setup-db
gövde: { "seed": true }
```

Bu istek (yalnızca yönetici çereziyle çalışır):
1. Postgres'te tüm tabloları, indeksleri ve ilişkileri oluşturur (tekrar
   çalıştırmaya güvenlidir, veri silmez),
2. Dergi arşivini (398 bulgu, yorumlar, taramalar, izleme listesi, bülten)
   içeri aktarır.

Yönetici oturumu açıp (şifre: yönetici şifren) bu isteği bir API aracından
gönderebilirsin — veya sohbetten "deploy tamam" dendiğinde otomatik çalıştırılır.

## Adım 4 — Taramayı doğrula

1. `https://oyi-global.vercel.app/admin` → yönetici şifresiyle giriş,
2. **Tarama Başlat** (Hızlı) → diller sırayla taranır,
3. Canlı doğrulama: `BASE=https://oyi-global.vercel.app bun scripts/verify-vercel-fixes.mjs`

## Teknik notlar

- **Tarama zinciri:** Z-AI arama → (kullanılamazsa) DuckDuckGo HTML → (o da
  olmazsa) Google News RSS. Çeviri: Z-AI LLM → (kullanılamazsa) Google
  clients5/gtx → MyMemory. Böylece anahtar/SDK olmayan ortamlarda bile tarama
  çalışır.
- **Fonksiyon süreleri:** tüm API route'ları 60 sn ile sınırlı (Vercel Hobby
  planının üst sınırı). Tarama dil başına ayrı isteklerle yürür.
- **Görseller:** haber görselleri base64 data URL olarak veritabanında saklanır
  (Vercel'in salt-okunur dosya sistemi sorun yaşamaz).
