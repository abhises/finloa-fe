import { lang } from "next/root-params";
import { getTextOverrides } from "@/lib/data";
import { alternatesFor, DEFAULT_LOCALE, isLocale, makeT, type Locale } from "./config";

/** Current locale in any Server Component (read from the [lang] root segment, no prop drilling). */
export async function getLocale(): Promise<Locale> {
  const l = await lang();
  return isLocale(l) ? l : DEFAULT_LOCALE;
}

/** `t("English", "Nederlands")` for Server Components, with the texts edited in the admin applied. */
export async function getT() {
  const [locale, overrides] = await Promise.all([getLocale(), getTextOverrides()]);
  return makeT(locale, overrides);
}

/** Page metadata in the current language, with canonical + hreflang links for `path`. */
export async function pageMetadata(
  path: string,
  title: [en: string, nl: string],
  description: [en: string, nl: string],
) {
  const locale = await getLocale();
  const t = makeT(locale, await getTextOverrides());
  return {
    title: t(...title),
    description: t(...description),
    alternates: alternatesFor(locale, path),
  };
}
