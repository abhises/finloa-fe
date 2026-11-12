"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, makeT, type Locale } from "./config";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export const useLocale = () => useContext(LocaleContext);
export const useT = () => makeT(useContext(LocaleContext));
