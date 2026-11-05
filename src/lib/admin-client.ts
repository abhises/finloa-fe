"use client";

export type AdminError = Error & { details?: Record<string, string[] | undefined> };

/** Browser-side calls to the admin API, proxied through /admin-api/* which adds the session token. */
export async function adminApi<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init;
  const res = await fetch(`/admin-api${path}`, {
    ...rest,
    headers: json !== undefined ? { "Content-Type": "application/json", ...rest.headers } : rest.headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  if (res.status === 401) {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    throw new Error("Session expired");
  }
  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => ({}))) as { error?: string; details?: Record<string, string[] | undefined> };
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`) as AdminError;
    err.details = data.details;
    if (data.details) {
      const first = Object.entries(data.details).find(([, v]) => v?.length);
      if (first) err.message = `${first[0]}: ${first[1]![0]}`;
    }
    throw err;
  }
  return data as T;
}

/** Same rules as finloa-be: watch, youtu.be, embed, shorts and live URLs, or a bare 11-character ID. */
export function parseYoutubeId(input: string): string | null {
  const s = input.trim();
  const m = s.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/|live\/)([\w-]{11})/) ?? s.match(/^([\w-]{11})$/);
  return m ? m[1] : null;
}

export const when = (d: string) =>
  new Date(d).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
