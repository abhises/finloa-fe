import Link from "next/link";
import { HEADER_NAV } from "@/lib/site";

export function SiteHeader({ ctaHref = "#contact", ctaLabel = "Get a quote" }: { ctaHref?: string; ctaLabel?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/88 backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-[1180px] items-center gap-7 px-6 py-3.5">
        <Link href="/" className="font-display text-[22px] tracking-[0.01em] text-ink">
          FINLOA
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {HEADER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14.5px] font-medium text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href={ctaHref}
            className="whitespace-nowrap rounded-[9px] bg-ink px-4 py-[9px] text-[14.5px] font-medium text-white transition-colors hover:bg-ink-2"
          >
            {ctaLabel}
          </Link>
          <details className="group relative lg:hidden">
            <summary
              aria-label="Menu"
              className="grid size-10 cursor-pointer list-none place-items-center rounded-[9px] border border-line bg-white [&::-webkit-details-marker]:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" className="group-open:hidden" />
                <path d="M6 6l12 12M18 6L6 18" className="hidden group-open:block" />
              </svg>
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 mt-2 flex w-56 flex-col rounded-xl border border-line bg-white p-2 shadow-[0_20px_40px_-20px_oklch(0.25_0.06_265/0.35)]"
            >
              {HEADER_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-body-2 hover:bg-surface hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
