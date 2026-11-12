import type { Metadata } from "next";
import { LocaleProvider } from "@/i18n/client";
import { HTML_LANG, LOCALES } from "@/i18n/config";
import { getLocale, getT } from "@/i18n/server";
import { fontVariables } from "../fonts";
import "../globals.css";

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t(
      "Finloa — Affordable video creation for businesses",
      "Finloa — Betaalbare video's voor bedrijven",
    ),
    description: t(
      "Professional videos for YouTube, TikTok, Instagram and LinkedIn at a clear monthly price. We edit, optimise and post so your channels keep growing.",
      "Professionele video's voor YouTube, TikTok, Instagram en LinkedIn voor een duidelijke maandprijs. Wij monteren, optimaliseren en posten, zodat je kanalen blijven groeien.",
    ),
    openGraph: { locale: (await getLocale()) === "nl" ? "nl_NL" : "en_US" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  return (
    <html lang={HTML_LANG[locale]} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
