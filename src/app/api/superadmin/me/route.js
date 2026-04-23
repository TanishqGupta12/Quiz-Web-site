import { NextResponse } from "next/server";
import { isSuperadminConfigured } from "@/lib/session-cookie";
import { requireSuperadminSession } from "@/lib/superadmin-auth";

export async function GET() {
  if (!isSuperadminConfigured()) {
    return NextResponse.json({ configured: false, authenticated: false });
  }
  const session = requireSuperadminSession();
  if (!session) {
    return NextResponse.json({ configured: true, authenticated: false });
  }
  return NextResponse.json({ configured: true, authenticated: true });
}
