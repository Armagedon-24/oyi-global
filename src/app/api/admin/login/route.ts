import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, expectedAdminToken, getAdminPassword } from "@/lib/auth";

export const runtime = "nodejs";

/** POST /api/admin/login — şifre doğruysa httpOnly yönetici çerezi yazılır */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = typeof body.password === "string" ? body.password : "";

    if (!password || password !== getAdminPassword()) {
      return NextResponse.json(
        { success: false, error: "Şifre hatalı. Tekrar deneyin." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE, expectedAdminToken(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_COOKIE_MAX_AGE,
    });
    return res;
  } catch (error) {
    console.error("[admin/login]", error);
    return NextResponse.json(
      { success: false, error: "Giriş yapılamadı" },
      { status: 500 }
    );
  }
}
