/** Locales are picked by subdomain: nl.finloa.com serves Dutch, every other host serves English. */
export const LOCALES = ["en", "nl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale);

/** Value for <html lang>, Intl formatting and og:locale. */
export const HTML_LANG: Record<Locale, string> = { en: "en", nl: "nl-NL" };

/** `t("English", "Nederlands")` picks the string for the current locale. */
export type T = (en: string, nl: string) => string;

/** Texts edited in the admin (Admin → Pages), by textKey(). A missing language uses the default from the code. */
export type TextOverrides = Record<string, { en?: string; nl?: string }>;

/**
 * Stable id for a t("English", "Nederlands") pair (53-bit hash, base 36). The admin stores edits under this key.
 * Keep in sync with scripts/extract-texts.mjs.
 */
export function textKey(en: string, nl: string) {
  const str = `${en}\u0000${nl}`;
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export function makeT(locale: Locale, overrides?: TextOverrides): T {
  const edited = overrides && Object.keys(overrides).length > 0;
  return (en, nl) => {
    const o = edited ? overrides[textKey(en, nl)] : undefined;
    return locale === "nl" ? (o?.nl ?? nl) : (o?.en ?? en);
  };
}

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
