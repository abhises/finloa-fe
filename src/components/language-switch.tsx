"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/client";
import { hostFor, isLocale, LOCALES, type Locale } from "@/i18n/config";

const LABEL: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  nl: { short: "NL", name: "Nederlands" },
};

const langAttr = (l: Locale) => (l === "nl" ? "nl-NL" : "en");

/**
 * Language picker. Each language lives on its own subdomain, so switching keeps the path and changes the host.
 * `variant="auto"` (default) shows a compact dropdown on phones and the EN | NL toggle from `sm` up;
 * `variant="toggle"` always shows the toggle (e.g. inside the mobile menu).
 */
export function LanguageSwitch({ onBrand, variant = "auto" }: { onBrand?: boolean; variant?: "auto" | "toggle" }) {
  const current = useLocale();
  const raw = usePathname() ?? "/";
  // Strip the internal /en or /nl prefix in case the rewritten path leaks through
  const first = raw.split("/")[1];
  const path = isLocale(first) ? raw.slice(first.length + 1) || "/" : raw;

  function go(e: React.MouseEvent<HTMLAnchorElement>, locale: Locale) {
    e.preventDefault();
    if (locale === current) return;
    const { protocol, host, search, hash } = window.location;
    // Another host (the other language's subdomain), so a full navigation is required
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`${protocol}//${hostFor(locale, host)}${path}${search}${hash}`);
  }

  const groupLabel = current === "nl" ? "Taal" : "Language";

  const toggle = (
    <div
      role="group"
      aria-label={groupLabel}
      className={`items-center rounded-[9px] border p-0.5 text-[13px] font-semibold ${
        variant === "auto" ? "hidden sm:flex" : "flex"
      } ${onBrand ? "border-white/40" : "border-line bg-white"}`}
    >
      {LOCALES.map((l) => {
        const active = l === current;
        return (
          <a
            key={l}
            href={path}
            hrefLang={langAttr(l)}
            lang={langAttr(l)}
            aria-current={active ? "true" : undefined}
            title={LABEL[l].name}
            onClick={(e) => go(e, l)}
            className={`rounded-[7px] px-2.5 py-1.5 leading-none transition-colors ${
              active
                ? onBrand
                  ? "bg-white text-ink"
                  : "bg-ink text-white"
                : onBrand
                  ? "text-white/80 hover:text-white"
                  : "text-muted hover:text-ink"
            }`}
          >
            {LABEL[l].short}
          </a>
        );
      })}
    </div>
  );

  if (variant === "toggle") return toggle;

  return (
    <>
      {toggle}
      <LanguageDropdown current={current} path={path} onBrand={onBrand} label={groupLabel} go={go} />
    </>
  );
}

function LanguageDropdown({
  current,
  path,
  onBrand,
  label,
  go,
}: {
  current: Locale;
  path: string;
  onBrand?: boolean;
  label: string;
  go: (e: React.MouseEvent<HTMLAnchorElement>, locale: Locale) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative sm:hidden">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label}: ${LABEL[current].name}`}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 items-center gap-1 rounded-[9px] border px-2 min-[380px]:gap-1.5 min-[380px]:px-2.5 text-[13px] font-semibold transition-colors ${
          onBrand ? "border-white/40 text-white hover:bg-white/10" : "border-line bg-white text-ink hover:bg-surface"
        }`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        {LABEL[current].short}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          aria-label={label}
          className="absolute right-0 z-30 mt-2 flex w-44 flex-col rounded-xl border border-line bg-white p-1.5 text-ink shadow-[0_20px_40px_-20px_oklch(0.25_0.06_265/0.45)]"
        >
          {LOCALES.map((l) => {
            const active = l === current;
            return (
              <a
                key={l}
                role="menuitem"
                href={path}
                hrefLang={langAttr(l)}
                lang={langAttr(l)}
                aria-current={active ? "true" : undefined}
                onClick={(e) => {
                  setOpen(false);
                  go(e, l);
                }}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
                  active ? "bg-surface text-ink" : "text-body-2 hover:bg-surface hover:text-ink"
                }`}
              >
                <span>
                  {LABEL[l].name}
                  <span className="ml-2 font-mono text-xs text-muted">{LABEL[l].short}</span>
                </span>
                {active && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden className="text-brand">
                    <path d="M5 12l5 5 9-10" />
                  </svg>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
