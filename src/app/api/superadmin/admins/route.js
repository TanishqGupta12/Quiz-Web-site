import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AdminModel } from "@/models/Admin";
import { isSuperadminConfigured } from "@/lib/session-cookie";
import { requireSuperadminSession } from "@/lib/superadmin-auth";

export async function GET() {
  if (!isSuperadminConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  if (!requireSuperadminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await AdminModel.find().sort({ createdAt: -1 }).lean();
  const admins = rows.map((r) => ({
    id: String(r._id),
    email: r.email,
    name: r.name || "",
    role: r.role === "superadmin" ? "superadmin" : "admin",
    createdAt: r.createdAt,
  }));
  return NextResponse.json({ admins });
}

export async function POST(req) {
  if (!isSuperadminConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  if (!requireSuperadminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();
    const rawRole = String(body.role || "admin").toLowerCase();
    const role = rawRole === "superadmin" ? "superadmin" : "admin";
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    const exists = await AdminModel.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: "An admin with this email already exists." }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const doc = await AdminModel.create({ email, passwordHash, name, role });
    return NextResponse.json({
      ok: true,
      admin: { id: String(doc._id), email: doc.email, name: doc.name, role: doc.role },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
