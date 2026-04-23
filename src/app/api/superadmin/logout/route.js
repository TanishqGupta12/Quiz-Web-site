import { NextResponse } from "next/server";
import { clearSuperadminCookie } from "@/lib/superadmin-auth";

export async function POST() {
  const c = clearSuperadminCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(c.name, c.value, c.options);
  return res;
}
