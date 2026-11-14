import Link from "next/link";
import { getLocale, getT } from "@/i18n/server";
import { FOOTER_COLUMNS } from "@/lib/site";

export async function SiteFooter() {
  const locale = await getLocale();
  const t = await getT();
  return (
    <footer className="mt-auto border-t border-line bg-surface px-6 pt-14 pb-8">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-14">
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/" className="font-display text-[30px] tracking-[0.01em] text-ink">
            {t("FINLOA", "FINLOA")}
          </Link>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <div className="mr-3 flex gap-2.5">
              <a
                href="#"
                aria-label="LinkedIn"
                className="grid size-11 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-brand"
              >
                <span className="text-base font-bold">in</span>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="grid size-11 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-brand"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M10 9l5 3-5 3z" />
                  <rect x="2.5" y="5" width="19" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </a>
            </div>
            <Link
              href="/#goals"
              className="whitespace-nowrap rounded-full bg-brand px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              {t("Plan Your Growth ↗", "Plan je groei ↗")}
            </Link>
            <a
              href="#"
              className="whitespace-nowrap rounded-full border border-brand px-6 py-[13px] text-[15px] font-semibold text-ink transition-colors hover:bg-white"
            >
              {t("Client Login ↗", "Inloggen klanten ↗")}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-x-8 gap-y-10">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title.en} className="flex flex-col gap-4">
              <span className="text-base font-semibold text-brand">{col.title[locale]}</span>
              {col.links.map((l) => (
                <Link key={l.href} href={l.href} className="text-[15px] leading-[1.4] text-body-2 hover:text-brand">
                  {l[locale]}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3.5 text-sm text-[oklch(0.35_0.02_265)]">
          <span>{t("© 2026 Finloa. All rights reserved.", "© 2026 Finloa. Alle rechten voorbehouden.")}</span>
          <span className="text-brand">•</span>
          <Link href="/privacy" className="hover:text-brand">
            {t("Privacy", "Privacy")}
          </Link>
          <span className="text-brand">•</span>
          <Link href="/terms" className="hover:text-brand">
            {t("Terms & Conditions", "Algemene voorwaarden")}
          </Link>
          <span className="text-brand">•</span>
          <a href={`mailto:${t("info@finloa.com", "info@finloa.com")}`} className="hover:text-brand">
            {t("info@finloa.com", "info@finloa.com")}
          </a>
        </div>
      </div>
    </footer>
  );
}
