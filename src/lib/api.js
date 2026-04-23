import axios from "axios";

/**
 * Same-origin API base. Use NEXT_PUBLIC_APP_URL only when the browser must call
 * an absolute URL (unusual for this app).
 */
function baseURL() {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || "";
  }
  return process.env.NEXT_PUBLIC_APP_URL || "";
}

export const api = axios.create({
  baseURL: baseURL(),
  headers: { "Content-Type": "application/json" },
  /** Required so `Set-Cookie` from `/api/*` is stored when using this client in the browser */
  withCredentials: true,
});
