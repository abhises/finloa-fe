import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Header + main + footer. Every public page ends with a ContactSection (id="contact"). */
export function PageShell({
  children,
  ctaHref,
  ctaLabel,
  minimalHeader,
  brandHeader,
  mainClassName = "",
}: {
  children: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  minimalHeader?: boolean;
  brandHeader?: boolean;
  /** Extra classes for <main>. Its children must stay the page's blocks (Admin → Pages hides and reorders them). */
  mainClassName?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader ctaHref={ctaHref} ctaLabel={ctaLabel} minimal={minimalHeader} brand={brandHeader} />
      <main className={`flex flex-col overflow-x-clip ${mainClassName}`}>{children}</main>
      <SiteFooter />
    </div>
  );
}
