"use client";

import { useState } from "react";

/** Poster with a play button; loads the (privacy-enhanced) YouTube player only when clicked. */
export function YoutubePlayer({ youtubeId, title, label }: { youtubeId: string; title: string; label?: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing)
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    );

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group absolute inset-0 w-full cursor-pointer overflow-hidden rounded-[14px] border-0 bg-[radial-gradient(ellipse_60%_70%_at_40%_40%,#3A6BFF_0%,#16286B_45%,#0A1022_85%)] p-0"
    >
      <span
        className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-100"
        style={{ backgroundImage: `url(https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg)` }}
        aria-hidden
      />
      <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,16,34,.7),transparent_55%)]" aria-hidden />
      <span className="absolute top-1/2 left-1/2 flex size-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-105">
        <span className="ml-1.5 h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-ink" />
      </span>
      {label && (
        <span className="absolute bottom-4 left-[18px] font-mono text-[11px] tracking-[0.14em] text-white uppercase">{label}</span>
      )}
    </button>
  );
}
