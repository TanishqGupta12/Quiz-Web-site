import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { assertSessionSecret, isSuperadminConfigured } from "@/lib/session-cookie";
import { issueSuperadminCookie } from "@/lib/superadmin-auth";

function constantTimeEqualStrings(a, b) {
  const bufA = Buffer.alloc(4096, 0);
  const bufB = Buffer.alloc(4096, 0);
  Buffer.from(String(a ?? ""), "utf8").copy(bufA);
  Buffer.from(String(b ?? ""), "utf8").copy(bufB);
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req) {
  try {
    if (!isSuperadminConfigured()) {
      return NextResponse.json(
        { error: "Superadmin is not configured. Set SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD, and ADMIN_SESSION_SECRET in .env." },
        { status: 503 }
      );
    }
    assertSessionSecret();
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = body.password ?? "";
    const expectedEmail = String(process.env.SUPERADMIN_EMAIL || "").trim().toLowerCase();
    if (!constantTimeEqualStrings(email, expectedEmail) || !constantTimeEqualStrings(password, process.env.SUPERADMIN_PASSWORD)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const c = issueSuperadminCookie();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(c.name, c.value, c.options);
    return res;
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
