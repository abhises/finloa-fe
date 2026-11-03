const platforms = ["YouTube", "TikTok", "Instagram", "LinkedIn", "Facebook"];

const stats = [
  { value: "48h", label: "first-draft turnaround" },
  { value: "5", label: "platforms covered" },
  { value: "100%", label: "of files are yours" },
];

export function Hero() {
  return (
    <section className="bg-grid px-6 pt-[clamp(28px,5vw,64px)] pb-[clamp(40px,6vw,72px)]">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-[26px] text-center">
        <div className="eyebrow">Video creation &amp; social growth for businesses</div>
        <h1 className="flex max-w-[980px] flex-col items-center gap-1 text-[clamp(40px,6.4vw,76px)] leading-[1.04] font-bold tracking-[-0.045em] text-balance">
          <span>Affordable videos that</span>
          <span className="text-brand">grow your business.</span>
        </h1>
        <p className="max-w-[820px] text-lg leading-[1.55] text-balance text-muted">
          Professional videos for YouTube, TikTok, Instagram and LinkedIn at a clear monthly price.
          We script, edit, optimise and post so your brand shows up every week without adding work
          to your team.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="#pricing"
            className="inline-flex items-center whitespace-nowrap rounded-[11px] bg-brand px-[22px] py-3.5 text-[15.5px] font-medium text-white transition-colors hover:bg-brand-hover"
          >
            See pricing →
          </a>
          <a
            href="#contact"
            className="inline-flex items-center whitespace-nowrap rounded-[11px] border border-line-2 bg-white px-[22px] py-3.5 text-[15.5px] font-medium text-body-2 transition-colors hover:text-ink"
          >
            Book a free consultation
          </a>
        </div>
        <ul className="flex flex-wrap justify-center gap-2" aria-label="Platforms we publish to">
          {platforms.map((p) => (
            <li
              key={p}
              className="rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[12.5px] tracking-[0.04em] text-subtle"
            >
              {p}
            </li>
          ))}
        </ul>
        <dl className="mt-2 grid w-full max-w-[720px] grid-cols-3 divide-x divide-line rounded-[20px] border border-line bg-white">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1 px-3 py-5">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-[clamp(24px,3vw,32px)] leading-none font-extrabold tracking-[-0.03em]">
                {s.value}
              </dd>
              <dd className="text-[13px] leading-[1.35] text-muted-2">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
