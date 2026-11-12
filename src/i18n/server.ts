import { lang } from "next/root-params";
import { alternatesFor, DEFAULT_LOCALE, isLocale, makeT, type Locale } from "./config";

/** Current locale in any Server Component (read from the [lang] root segment, no prop drilling). */
export async function getLocale(): Promise<Locale> {
  const l = await lang();
  return isLocale(l) ? l : DEFAULT_LOCALE;
}

export async function getT() {
  return makeT(await getLocale());
}

/** Page metadata in the current language, with canonical + hreflang links for `path`. */
export async function pageMetadata(
  path: string,
  title: [en: string, nl: string],
  description: [en: string, nl: string],
) {
  const locale = await getLocale();
  const t = makeT(locale);
  return {
    title: t(...title),
    description: t(...description),
    alternates: alternatesFor(locale, path),
  };
}
