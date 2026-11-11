import Link from "next/link";
import { FOOTER_COLUMNS } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-surface px-6 pt-14 pb-8">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-14">
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/" className="font-display text-[30px] tracking-[0.01em] text-ink">
            FINLOA
          </Link>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <Link
              href="/idea-to-product#contact"
              className="whitespace-nowrap rounded-full bg-brand px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Tell us your idea ↗
            </Link>
            <a
              href="#"
              className="whitespace-nowrap rounded-full border border-brand px-6 py-[13px] text-[15px] font-semibold text-ink transition-colors hover:bg-white"
            >
              Client Login ↗
            </a>
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-x-8 gap-y-10">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <span className="text-base font-semibold text-brand">{col.title}</span>
              {col.links.map((l) => (
                <Link key={l.label} href={l.href} className="text-[15px] leading-[1.4] text-body-2 hover:text-brand">
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3.5 text-sm text-[oklch(0.35_0.02_265)]">
          <span>© 2026 Finloa. All rights reserved.</span>
          <span className="text-brand">•</span>
          <Link href="/privacy" className="hover:text-brand">
            Privacy
          </Link>
          <span className="text-brand">•</span>
          <Link href="/terms" className="hover:text-brand">
            Terms &amp; Conditions
          </Link>
          <span className="text-brand">•</span>
          <a href="mailto:info@finloa.com" className="hover:text-brand">
            info@finloa.com
          </a>
        </div>
      </div>
    </footer>
  );
}
