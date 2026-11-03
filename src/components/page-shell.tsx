import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Header + main + footer. Pages without a contact section should point the CTA at "/#contact". */
export function PageShell({
  children,
  ctaHref,
  ctaLabel,
  minimalHeader,
}: {
  children: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  minimalHeader?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader ctaHref={ctaHref} ctaLabel={ctaLabel} minimal={minimalHeader} />
      <main className="flex flex-col">{children}</main>
      <SiteFooter />
    </div>
  );
}
