/** Locales are picked by subdomain: nl.finloa.com serves Dutch, every other host serves English. */
export const LOCALES = ["en", "nl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale);

/** Value for <html lang>, Intl formatting and og:locale. */
export const HTML_LANG: Record<Locale, string> = { en: "en", nl: "nl-NL" };

/** `t("English", "Nederlands")` picks the string for the current locale. */
export type T = (en: string, nl: string) => string;
export const makeT =
  (locale: Locale): T =>
  (en, nl) =>
    locale === "nl" ? nl : en;

/** Host for the other language: finloa.com ⇄ nl.finloa.com (also works for nl.localhost:3000). */
export function hostFor(locale: Locale, currentHost: string) {
  const base = currentHost.replace(/^(www|nl)\./, "");
  return locale === "nl" ? `nl.${base}` : base;
}

/** Public origin per language (used for canonical and hreflang links). */
export const SITE_URL: Record<Locale, string> = { en: "https://finloa.com", nl: "https://nl.finloa.com" };

/** canonical + hreflang alternates for a path such as "/seo" ("" for home). */
export function alternatesFor(locale: Locale, path: string) {
  return {
    canonical: `${SITE_URL[locale]}${path}`,
    languages: { en: `${SITE_URL.en}${path}`, "nl-NL": `${SITE_URL.nl}${path}`, "x-default": `${SITE_URL.en}${path}` },
  };
}
