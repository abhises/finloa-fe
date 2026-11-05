"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/admin-session";
import { SERVER_API_URL } from "@/lib/data";

export async function login(_prev: { error: string } | null, form: FormData) {
  const res = await fetch(`${SERVER_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: String(form.get("email") ?? ""), password: String(form.get("password") ?? "") }),
  }).catch(() => null);
  if (!res) return { error: "Cannot reach the API. Is finloa-be running?" };
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    return { error: res.status === 401 ? "Invalid email or password" : (body.error ?? "Sign-in failed") };
  }
  const { token } = (await res.json()) as { token: string };
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  const next = String(form.get("next") || "/admin");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
