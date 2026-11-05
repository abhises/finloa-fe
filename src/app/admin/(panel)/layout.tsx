import { Suspense } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { ConfirmProvider } from "@/components/admin/confirm-dialog";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ad">
      {/* The menu reads the current path, which is only known at request time */}
      <Suspense fallback={<aside className="ad-side" />}>
        <AdminNav />
      </Suspense>
      <div className="ad-main">
        <ConfirmProvider>
          <Suspense fallback={<p className="ad-hint">Loading…</p>}>{children}</Suspense>
        </ConfirmProvider>
      </div>
    </div>
  );
}
