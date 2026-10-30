import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * OYİ GLOBAL — Yönetici kimlik doğrulama yardımcıları.
 * Şifre .env dosyasındaki ADMIN_PASSWORD ile belirlenir.
 * Giriş yapıldığında httpOnly çereze (şifreden türetilmiş SHA-256 jetonu) yazılır;
 * tarama gibi yönetici işlemleri bu jetonla korunur.
 */

const COOKIE_NAME = "oyi_admin_session";
export const ADMIN_COOKIE = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "Hakan_1251";
}

/** Şifreden türetilen oturum jetonu (çerezde düz metin şifre taşınmaz) */
export function expectedAdminToken(): string {
  return crypto
    .createHash("sha256")
    .update(`oyi-global::admin-v1::${getAdminPassword()}`)
    .digest("hex");
}

/** İsteğin yönetici oturumu taşıyıp taşımadığını kontrol eder */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === expectedAdminToken();
}

/** Korumalı route'ların başında çağrılır; yetkisizse 401 yanıtı döner */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json(
    {
      success: false,
      error: "Bu işlem yalnızca yönetici içindir. Lütfen /admin üzerinden giriş yapın.",
    },
    { status: 401 }
  );
}
