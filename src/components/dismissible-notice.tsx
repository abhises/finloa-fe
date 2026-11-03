"use client";

import { useState, type ReactNode } from "react";

export function DismissibleNotice({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="border-b border-ink-line-2 bg-ink text-white" role="note">
      <div className="mx-auto flex max-w-[1180px] items-start gap-4 px-6 py-3.5">
        <span className="mt-px flex-none rounded-[5px] border border-[#5A4A26] px-[7px] py-[3px] font-mono text-[11.5px] tracking-[0.06em] text-[#F2C46B]">
          NOTICE
        </span>
        <p className="flex-1 text-[13.5px] leading-normal text-[oklch(0.85_0.01_265)]">{children}</p>
        <button
          type="button"
          aria-label="Close notice"
          onClick={() => setOpen(false)}
          className="size-8 flex-none cursor-pointer text-xl leading-none text-[oklch(0.75_0.02_265)] hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}
