"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DesignPageEditor, type TextGroup } from "@/components/admin/design-page-editor";
import { adminApi, parseYoutubeId } from "@/lib/admin-client";
import type { PortfolioVideo } from "@/lib/api";

type Video = PortfolioVideo & { active: boolean };

/** The videos the front page shows: the first live video of each slot (Admin → YouTube videos, by placement) */
const SLOTS = [
  { id: "reel", label: "Hero showreel", niche: "showreel", kind: "LONG", nth: 0 },
  { id: "long", label: "Video section: wide frame", niche: "home-video", kind: "LONG", nth: 0 },
  { id: "shortA", label: "Video section: phone (TikTok)", niche: "home-video", kind: "SHORT", nth: 0 },
  { id: "shortB", label: "Video section: phone (Shorts)", niche: "home-video", kind: "SHORT", nth: 1 },
] as const;
type Slot = (typeof SLOTS)[number];

function VideoSlots({ only }: { only: Slot["id"][] }) {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(() => {
    adminApi<{ data: Video[] }>("/videos/all")
      .then((r) => setVideos(r.data))
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const current = (s: Slot) => (videos ?? []).filter((v) => v.active && v.niche === s.niche && v.kind === s.kind)[s.nth];

  async function set(s: Slot, link: string) {
    setError("");
    if (!parseYoutubeId(link)) return setError("Not a valid YouTube link");
    const v = current(s);
    try {
      if (v) await adminApi(`/videos/${v.id}`, { method: "PATCH", json: { youtube: link } });
      else await adminApi("/videos", { method: "POST", json: { niche: s.niche, kind: s.kind, youtube: link, sortOrder: s.nth } });
      load();
      window.dispatchEvent(new Event("fl:preview-reload"));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (!videos) return <p className="ad-hint">{error || "Loading videos…"}</p>;
  return (
    <>
      {SLOTS.filter((s) => only.includes(s.id)).map((s) => {
        const v = current(s);
        return (
          <div key={s.id} className="fp-video">
            {v ? <img src={`https://i.ytimg.com/vi/${v.youtubeId}/mqdefault.jpg`} alt="" /> : <span className="fp-video__empty">No video</span>}
            <div>
              <strong>{s.label}</strong>
              <span className="ad-hint">{v ? (v.title ?? v.youtubeId) : "Shows the animated placeholder."}</span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem("yt") as HTMLInputElement;
                  set(s, input.value).then(() => (input.value = ""));
                }}
              >
                <input name="yt" placeholder={v ? "Replace with a YouTube link" : "Paste a YouTube link"} />
                <button type="submit" className="ad-btn ad-btn--sm">
                  {v ? "Replace" : "Add"}
                </button>
              </form>
            </div>
          </div>
        );
      })}
      {error && <p className="ad-error">{error}</p>}
      <p className="ad-hint">
        Saved right away. All videos and their order: <Link href="/admin/videos">YouTube videos</Link>.
      </p>
    </>
  );
}

/** The front page's blocks in the order of the design (keys of the texts in src/app/[lang]/page.tsx) */
const GROUPS: TextGroup[] = [
  {
    title: "1 · Hero",
    hint: "Big blue block at the top, with the showreel.",
    keys: ["1vwxtyq9wta", "1g6g8700nd7", "1sdaetfd4m6", "90g4lm9dxo", "1h030uq71b6", "1k0xnim8tq6", "th0eamuf2h"],
    extra: <VideoSlots only={["reel"]} />,
  },
  {
    title: "2 · Why Finloa",
    keys: ["25sgetyv8yx", "en7qsod1qz", "1orkip3qbcg", "yrulf3kqq2", "27ll8pj8q36", "1fjqz8bdn2t", "24fl24ewdo7", "20sn8nl4kid", "21d29cz8otg", "1sx5idvomrt"],
  },
  {
    title: "3 · Industry ticker",
    hint: "The scrolling dark band.",
    keys: ["fkulvfw2d2", "lsgvddotzy", "2aayrenmx5c", "b0j6xzo1qc", "14ncj5y40ou", "29ufv1d8ea2", "1a561r5kanp"],
  },
  {
    title: "4 · Your goal",
    hint: "The goal picker below the heading is shared with /services: edit it under Shared parts.",
    keys: ["owm7n6kb9", "1ece288j44m"],
  },
  {
    title: "5 · Services",
    keys: ["apqux67jkt", "21y051s44xw", "20u335hjquz", "15s4rrsmir7", "e8mgp48gqs", "uh28tbl94j", "1am2zvj7al1", "26rfol4sa2q", "1zi64tlguu1", "1dyolpgh5k3", "6ad4r3zo2j", "b1h5t8n2po", "2xzs8aa8rs"],
  },
  {
    title: "6 · Video creation",
    keys: ["2dom7pdmznz", "7fdkenc43j", "24mhw3lbv6u", "16jx44vw17d", "1pc0q8r7pb7", "gyiskn0kvr", "1sxx55zwp88", "ex7fynf4ln", "18sb9pwnvmt", "1q4oadpshws", "1eysnqs8usu", "11sexd9jgj1", "c015oiasyv"],
    extra: <VideoSlots only={["long", "shortA", "shortB"]} />,
  },
  {
    title: "7 · Solutions",
    keys: ["1vaf2hauv1m", "1hr3q8j2fag", "2bevw5qlmrw", "1do6nyk4vuw", "2f9s7alkagt", "27l40cab3hp", "2a85mimktx7", "2dxaxp27gir", "13swcgj5auy"],
  },
  { title: "8 · Call to action", keys: ["16zwivne45t", "24yozpj959c"] },
  { title: "9 · Contact", hint: "The form fields are shared: edit them under Shared parts.", keys: ["sdj68aab39", "1k7vfc5qxp2"] },
];

export default function FrontPageEditor() {
  return (
    <DesignPageEditor
      sectionId="home"
      title="Front page"
      intro="The home page, block by block in the order of the design. Edit the texts in English and Dutch and pick the videos; the preview on the right reloads after each save. Click a text to find it in the preview."
      groups={GROUPS}
    />
  );
}
