"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { subscribe, type ApiError } from "@/lib/api";

/**
 * Hero email capture: input + button, with a short consent line underneath.
 * `tone="light"` sits on the light grid heroes (blue button); `tone="brand"` sits on the blue heroes (dark button).
 */
export function EmailSignup({
  source,
  cta,
  tone = "light",
  align = "center",
}: {
  /** Stored with the subscriber, e.g. "seo" or "home" (lowercase, digits, dashes). */
  source: string;
  cta: string;
  tone?: "light" | "brand";
  align?: "center" | "start";
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      await subscribe(email.trim(), source);
      setState("done");
    } catch (err) {
      const apiErr = err as Partial<ApiError> | undefined;
      setError(
        apiErr?.details?.email?.[0] ?? (typeof apiErr?.error === "string" ? apiErr.error : "Could not sign you up. Try again."),
      );
      setState("idle");
    }
  }

  const brand = tone === "brand";
  const wrap = `w-full max-w-[580px] ${align === "center" ? "mx-auto text-center" : "text-left"}`;

  if (state === "done") {
    return (
      <div
        role="status"
        className={`${wrap} flex flex-col gap-1.5 rounded-2xl bg-white p-[22px] text-left! text-ink ${brand ? "" : "border border-line"}`}
      >
        <div className="text-xl font-extrabold tracking-[-0.02em]">You&apos;re on the list.</div>
        <div className="text-base text-muted">We&apos;ll email {email.trim()} within one business day.</div>
      </div>
    );
  }

  const link = brand ? "text-white underline hover:text-[#dfe7ff]" : "text-brand underline hover:text-brand-hover";

  return (
    <form onSubmit={onSubmit} className={`${wrap} flex flex-col gap-3`}>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`h-[58px] min-w-0 flex-1 rounded-xl border bg-white px-[18px] text-[17px] font-medium text-ink outline-none placeholder:text-[#8a93a8] aria-[invalid=true]:border-red-400 ${
            brand
              ? "border-white focus:shadow-[0_0_0_4px_rgba(255,255,255,.35)]"
              : "border-[#d9dde8] focus:border-brand focus:shadow-[0_0_0_4px_rgba(47,107,255,.18)]"
          }`}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className={`h-[58px] flex-none cursor-pointer rounded-xl px-[26px] text-[17px] font-semibold whitespace-nowrap text-white transition-colors disabled:opacity-70 ${
            brand ? "bg-ink hover:bg-[#1a2140]" : "bg-brand hover:bg-brand-hover"
          }`}
        >
          {state === "sending" ? "Sending…" : cta}
        </button>
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className={`text-[14px] ${brand ? "text-white" : "text-red-600"}`}>
          {error}
        </p>
      )}
      <p className={`mt-0.5 text-[13px] leading-normal ${brand ? "text-[#e3e9ff]" : "text-[#5a6380]"}`}>
        No spam. By signing up you agree to our{" "}
        <Link href="/terms" className={link}>
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className={link}>
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
