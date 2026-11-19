"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sharp YouTube thumbnail. Tries the high-res variant first and falls back to hqdefault (always exists).
 * - long:  maxresdefault (1280×720) → hqdefault (480×360)
 * - short: oardefault (1080×1920, vertical) → maxresdefault → hqdefault
 * A missing variant answers 404 with a 120×90 grey placeholder, so we also treat tiny images as failures.
 */
export function YtThumb({ id, kind = "long", className = "" }: { id: string; kind?: "long" | "short"; className?: string }) {
  const chain = kind === "short" ? ["oardefault", "maxresdefault", "hqdefault"] : ["maxresdefault", "hqdefault"];
  // Step is tied to the id it was reached for, so a new id (e.g. switching tabs) starts over at the sharpest variant
  const [state, setState] = useState({ id, step: 0 });
  const step = state.id === id ? state.step : 0;
  const next = () => step < chain.length - 1 && setState({ id, step: step + 1 });
  const ref = useRef<HTMLImageElement>(null);

  const check = (img: HTMLImageElement) => {
    if (!img.complete) return;
    if (img.naturalWidth <= 120) next();
  };

  // The image may finish loading (or fail) before hydration, when React's onLoad/onError aren't attached yet
  useEffect(() => {
    if (ref.current) check(ref.current);
  });

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={`https://i.ytimg.com/vi/${id}/${chain[step]}.jpg`}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      onLoad={(e) => check(e.currentTarget)}
      onError={next}
      className={`absolute inset-0 size-full object-cover ${className}`}
    />
  );
}
