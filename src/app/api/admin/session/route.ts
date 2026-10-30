import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

/** GET /api/admin/session — aktif yönetici oturumu var mı? */
export async function GET() {
  try {
    return NextResponse.json({ success: true, authenticated: await isAdmin() });
  } catch {
    return NextResponse.json({ success: true, authenticated: false });
  }
}
