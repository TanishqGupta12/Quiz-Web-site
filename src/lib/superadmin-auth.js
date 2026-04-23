import { cookies } from "next/headers";
import {
  cookieBaseOptions,
  getSessionSecret,
  signSessionPayload,
  verifySessionPayload,
} from "./session-cookie";

export const SUPERADMIN_COOKIE = "quiz_superadmin";
export const ADMIN_COOKIE = "quiz_admin";

export function readSuperadminPayload() {
  if (!getSessionSecret()) return null;
  const token = cookies().get(SUPERADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionPayload(token, getSessionSecret());
}

export function readAdminPayload() {
  if (!getSessionSecret()) return null;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionPayload(token, getSessionSecret());
}

export function requireSuperadminSession() {
  const payload = readSuperadminPayload();
  if (!payload || payload.typ !== "super" || payload.role !== "superadmin") {
    return null;
  }
  return payload;
}

export function issueSuperadminCookie() {
  const secret = getSessionSecret();
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const token = signSessionPayload({ typ: "super", role: "superadmin", exp }, secret);
  return { name: SUPERADMIN_COOKIE, value: token, options: cookieBaseOptions() };
}

/** `dbRole` comes from the Admin document: `admin` or `superadmin` (stored in MongoDB). */
export function issueAdminCookie(adminId, dbRole) {
  const secret = getSessionSecret();
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const role = dbRole === "superadmin" ? "superadmin" : "admin";
  const token = signSessionPayload({ typ: "admin", role, sub: String(adminId), exp }, secret);
  return { name: ADMIN_COOKIE, value: token, options: cookieBaseOptions() };
}

export function clearSuperadminCookie() {
  return { name: SUPERADMIN_COOKIE, value: "", options: { ...cookieBaseOptions(), maxAge: 0 } };
}

export function clearAdminCookie() {
  return { name: ADMIN_COOKIE, value: "", options: { ...cookieBaseOptions(), maxAge: 0 } };
}
