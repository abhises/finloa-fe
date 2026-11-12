"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, makeT, type Locale, type TextOverrides } from "./config";

const LocaleContext = createContext<{ locale: Locale; overrides?: TextOverrides }>({ locale: DEFAULT_LOCALE });

/** `overrides` are the texts edited in the admin, so client components show them too. */
export function LocaleProvider({ locale, overrides, children }: { locale: Locale; overrides?: TextOverrides; children: ReactNode }) {
  const value = useMemo(() => ({ locale, overrides }), [locale, overrides]);
  return <LocaleContext value={value}>{children}</LocaleContext>;
}

export const useLocale = () => useContext(LocaleContext).locale;
export function useT() {
  const { locale, overrides } = useContext(LocaleContext);
  return useMemo(() => makeT(locale, overrides), [locale, overrides]);
}
