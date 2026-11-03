function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="flex max-w-[720px] flex-col gap-3.5">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance">
        {title}
      </h2>
      {intro && <p className="max-w-[560px] text-base leading-[1.55] text-pretty text-muted">{intro}</p>}
    </div>
  );
}

const steps = [
  {
    title: "Kick-off call",
    body: "We learn your business, audience and goals, then agree on topics and a posting schedule.",
  },
  {
    title: "Send raw footage",
    body: "Upload clips, screen recordings or product shots. No footage? We can script and source it.",
  },
  {
    title: "We edit and optimise",
    body: "Editing, captions, thumbnails, titles and tags tuned for each platform. You review and approve.",
  },
  {
    title: "We publish and report",
    body: "Videos go live on schedule across your channels, with a monthly report on what's working.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-line px-6 py-[72px]">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-11">
        <SectionHeading
          eyebrow="How it works"
          title="From raw footage to published videos in four steps."
        />
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-7">
              <span className="font-mono text-[13px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{s.title}</h3>
              <p className="text-[15px] leading-[1.55] text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const useCases = [
  { tag: "PRODUCT", text: "Product demos and launch videos that show what you sell" },
  { tag: "EXPLAIN", text: "Explainers and how-tos that answer your customers' questions" },
  { tag: "TRUST", text: "Customer testimonials and case studies that build credibility" },
  { tag: "TEAM", text: "Founder, team and behind-the-scenes content for your brand" },
  { tag: "SHORTS", text: "Short clips cut from every long video for TikTok, Reels and Shorts" },
];

export function UseCases() {
  return (
    <section id="use-cases" className="scroll-mt-20 border-t border-line px-6 py-[72px]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(32px,5vw,56px)]">
        <div className="flex flex-col gap-4">
          <SectionHeading
            eyebrow="What we make"
            title="Videos that turn viewers into customers."
            intro="Whether you sell software, services or products, we create the videos your buyers watch before they decide."
          />
          <a
            href="#contact"
            className="self-start whitespace-nowrap rounded-[10px] bg-ink px-5 py-[13px] text-[15px] font-medium text-white transition-colors hover:bg-ink-2"
          >
            Plan your videos →
          </a>
        </div>
        <ul className="flex flex-col border-t border-line-2">
          {useCases.map((u) => (
            <li key={u.tag} className="flex gap-[18px] border-b border-line-2 py-5">
              <span className="w-[68px] flex-none font-mono text-[13px] text-brand">{u.tag}</span>
              <span className="text-[15.5px] leading-normal">{u.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const reasons = [
  { title: "Clear, fixed pricing", body: "One monthly price per package. No hourly billing, no surprise invoices." },
  { title: "Built for growth", body: "Every video is optimised for search and the algorithm, not just edited." },
  { title: "One team, one contact", body: "Editors, designers and strategists working together with a named lead." },
  { title: "You own everything", body: "Raw files, edits and thumbnails are yours, even if you leave." },
];

export function WhyFinloa() {
  return (
    <section className="border-t border-line px-6 py-[72px]">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-11">
        <SectionHeading eyebrow="Why Finloa" title="What sets us apart." />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
          {reasons.map((r, i) => (
            <div key={r.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-7">
              <span className="font-mono text-[13px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{r.title}</h3>
              <p className="text-[15px] leading-[1.55] text-muted">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
