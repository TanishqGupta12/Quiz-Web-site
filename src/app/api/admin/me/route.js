import { NextResponse } from "next/server";
import { AdminModel } from "@/models/Admin";
import { getSessionSecret } from "@/lib/session-cookie";
import { readAdminPayload } from "@/lib/superadmin-auth";

export async function GET() {
  if (!getSessionSecret() || getSessionSecret().length < 16) {
    return NextResponse.json({ authenticated: false, configured: false });
  }
  const payload = readAdminPayload();
  if (!payload || payload.typ !== "admin" || !payload.sub) {
    return NextResponse.json({ authenticated: false, configured: true });
  }
  const admin = await AdminModel.findById(payload.sub).lean();
  if (!admin) {
    return NextResponse.json({ authenticated: false, configured: true });
  }
  return NextResponse.json({
    authenticated: true,
    configured: true,
    email: admin.email,
    name: admin.name || "",
    role: admin.role === "superadmin" ? "superadmin" : "admin",
  });
}
