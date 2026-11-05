"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Options = { title: string; message?: string; confirmLabel?: string };
type Pending = Options & { resolve: (ok: boolean) => void };

const ConfirmContext = createContext<((o: Options) => Promise<boolean>) | null>(null);

/** `const confirm = useConfirm(); if (!(await confirm({ title: "Delete?" }))) return;` */
export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return ctx;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const okBtn = useRef<HTMLButtonElement>(null);

  const confirm = useCallback((o: Options) => new Promise<boolean>((resolve) => setPending({ ...o, resolve })), []);
  const close = useCallback((ok: boolean) => {
    setPending((p) => {
      p?.resolve(ok);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!pending) return;
    okBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <div className="ad-modal" onClick={() => close(false)}>
          <div
            className="ad-modal__box"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="ad-confirm-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="ad-confirm-title">{pending.title}</h2>
            {pending.message && <p>{pending.message}</p>}
            <div className="ad-confirm__actions">
              <button type="button" className="ad-btn" onClick={() => close(false)}>
                Cancel
              </button>
              <button ref={okBtn} type="button" className="ad-btn ad-btn--danger-solid" onClick={() => close(true)}>
                {pending.confirmLabel ?? "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
