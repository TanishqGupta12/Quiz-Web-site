import { createHmac, timingSafeEqual } from "crypto";

const SEP = ".";

export function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

export function assertSessionSecret() {
  const s = getSessionSecret();
  if (!s || s.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET must be set and at least 16 characters");
  }
  return s;
}

export function signSessionPayload(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}${SEP}${sig}`;
}

export function verifySessionPayload(token, secret) {
  if (!token || !secret) return null;
  const i = token.lastIndexOf(SEP);
  if (i === -1) return null;
  const body = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  try {
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function cookieBaseOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function isSuperadminConfigured() {
  const email = process.env.SUPERADMIN_EMAIL?.trim();
  const password = process.env.SUPERADMIN_PASSWORD;
  const secret = getSessionSecret();
  return Boolean(email && password && secret && secret.length >= 16);
}
