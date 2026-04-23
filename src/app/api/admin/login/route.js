import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AdminModel } from "@/models/Admin";
import { assertSessionSecret, getSessionSecret } from "@/lib/session-cookie";
import { issueAdminCookie } from "@/lib/superadmin-auth";

export async function POST(req) {
  try {
    if (!getSessionSecret() || getSessionSecret().length < 16) {
      return NextResponse.json(
        { error: "Server is not configured. Set ADMIN_SESSION_SECRET (16+ chars) in .env." },
        { status: 503 }
      );
    }
    assertSessionSecret();
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = body.password ?? "";
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const c = issueAdminCookie(admin._id, admin.role);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(c.name, c.value, c.options);
    return res;
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
