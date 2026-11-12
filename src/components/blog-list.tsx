"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useLocale, useT } from "@/i18n/client";
import { subscribe, type ApiError, type Post } from "@/lib/api";

const ALL = "__all__";
const PAGE = 6;

function Subscribe() {
  const t = useT();
  const locale = useLocale();
  const [state, setState] = useState<"button" | "form" | "sending" | "done">("button");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    setState("sending");
    setError(null);
    try {
      await subscribe(email);
      setState("done");
    } catch (err) {
      const apiErr = err as Partial<ApiError> | undefined;
      setError(
        locale === "nl"
          ? apiErr?.details?.email
            ? "Vul een geldig e-mailadres in."
            : "Inschrijven is niet gelukt. Probeer het opnieuw."
          : (apiErr?.details?.email?.[0] ??
              (typeof apiErr?.error === "string" ? apiErr.error : "Could not subscribe. Try again.")),
      );
      setState("form");
    }
  }

  const pill = "cursor-pointer rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white hover:bg-brand-hover";

  if (state === "done")
    return (
      <span className="text-[15px] font-medium text-brand" role="status">
        {t("Thanks, you're subscribed.", "Bedankt, je bent ingeschreven.")}
      </span>
    );
  if (state === "button")
    return (
      <button type="button" className={pill} onClick={() => setState("form")}>
        {t("Subscribe", "Abonneren")}
      </button>
    );
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-wrap items-center gap-2">
      <label htmlFor="sub-email" className="sr-only">
        {t("Your email", "Je e-mailadres")}
      </label>
      <input
        id="sub-email"
        name="email"
        type="email"
        autoFocus
        placeholder={t("Your email", "Je e-mailadres")}
        aria-invalid={!!error}
        className="min-w-[220px] rounded-full border border-[oklch(0.88_0.01_265)] bg-white px-[18px] py-3 text-[15px] outline-none focus:border-brand aria-[invalid=true]:border-red-400"
      />
      <button type="submit" disabled={state === "sending"} className={`${pill} disabled:opacity-70`}>
        {state === "sending" ? "…" : t("Subscribe", "Abonneren")}
      </button>
      {error && (
        <p className="w-full text-[13px] text-red-500" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export function BlogList({ posts }: { posts: Post[] }) {
  const [topic, setTopic] = useState(ALL);
  const [shown, setShown] = useState(PAGE);
  const t = useT();

  const topics = [ALL, ...Array.from(new Set(posts.map((p) => p.topic).filter(Boolean)))];
  const filtered = posts.filter((p) => topic === ALL || p.topic === topic);
  const visible = filtered.slice(0, shown);

  return (
    <>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <label htmlFor="topic" className="sr-only">
          {t("Filter by topic", "Filter op onderwerp")}
        </label>
        <select
          id="topic"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setShown(PAGE);
          }}
          className="cursor-pointer appearance-none rounded-full border border-[oklch(0.88_0.01_265)] bg-white bg-[length:6px_6px,6px_6px] bg-[position:calc(100%-22px)_55%,calc(100%-16px)_55%] bg-no-repeat py-3 pr-[42px] pl-[18px] text-[15px] font-medium text-ink outline-none [background-image:linear-gradient(45deg,transparent_50%,oklch(0.4_0.02_265)_50%),linear-gradient(135deg,oklch(0.4_0.02_265)_50%,transparent_50%)]"
        >
          {topics.map((x) => (
            <option key={x} value={x}>
              {x === ALL ? t("All topics", "Alle onderwerpen") : x}
            </option>
          ))}
        </select>
        <div className="ml-auto">
          <Subscribe />
        </div>
      </div>

      <div data-slot="list" className="flex flex-col gap-6 pt-14">
        <div className="font-mono text-[13px] tracking-[0.08em] text-muted-2">{t("THE LATEST", "NIEUWSTE ARTIKELEN")}</div>
        {visible.length === 0 ? (
          <p className="rounded-2xl border border-line bg-white p-8 text-[15px] text-muted">
            {t(
              "No articles yet. Subscribe to hear when the first ones go live.",
              "Nog geen artikelen. Schrijf je in, dan hoor je het zodra de eerste online staan.",
            )}
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-6">
            {visible.map((p) => {
              const image = p.coverImage ?? (p.youtubeId ? `https://i.ytimg.com/vi/${p.youtubeId}/hqdefault.jpg` : null);
              return (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className={`group flex flex-col overflow-hidden rounded-2xl border border-line bg-white text-ink transition-colors hover:border-brand ${
                    p.featured && topic === ALL ? "col-span-full" : ""
                  }`}
                >
                  <div className="relative aspect-[16/7.5] bg-[oklch(0.95_0.008_265)]">
                    {image ? (
                      <Image src={image} alt="" fill unoptimized sizes="(min-width: 900px) 50vw, 100vw" className="object-cover" />
                    ) : (
                      <div className="bg-grid absolute inset-0 opacity-70" aria-hidden />
                    )}
                    {p.youtubeId && (
                      <span className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-transform group-hover:scale-105">
                        <span className="ml-1 h-0 w-0 border-y-[9px] border-l-[15px] border-y-transparent border-l-ink" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3.5 px-[30px] pt-7 pb-[30px]">
                    <span className="font-mono text-[12.5px] tracking-[0.08em] text-brand uppercase">
                      {[p.featured && t("Featured", "Uitgelicht"), p.topic, p.youtubeId && "Video"].filter(Boolean).join(" · ")}
                    </span>
                    <h2 className="text-[22px] leading-[1.3] font-semibold tracking-[-0.02em] text-pretty">{p.title}</h2>
                    <span className="mt-auto pt-2.5 text-sm text-subtle">{p.readMinutes} {t("min read", "min. leestijd")}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        {filtered.length > shown && (
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="mt-6 cursor-pointer self-center rounded-full border border-brand px-10 py-[13px] text-[15px] font-semibold text-ink hover:bg-white"
          >
            {t("Load more", "Meer laden")}
          </button>
        )}
      </div>
    </>
  );
}
