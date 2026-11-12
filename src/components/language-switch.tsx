"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/client";
import { hostFor, isLocale, LOCALES, type Locale } from "@/i18n/config";

const LABEL: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  nl: { short: "NL", name: "Nederlands" },
};

/** EN | NL toggle. Each language lives on its own subdomain, so switching keeps the path and changes the host. */
export function LanguageSwitch({ onBrand }: { onBrand?: boolean }) {
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

  return (
    <div
      role="group"
      aria-label={current === "nl" ? "Taal" : "Language"}
      className={`flex items-center rounded-[9px] border p-0.5 text-[13px] font-semibold ${
        onBrand ? "border-white/40" : "border-line bg-white"
      }`}
    >
      {LOCALES.map((l) => {
        const active = l === current;
        return (
          <a
            key={l}
            href={path}
            hrefLang={l === "nl" ? "nl-NL" : "en"}
            lang={l === "nl" ? "nl-NL" : "en"}
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
}
