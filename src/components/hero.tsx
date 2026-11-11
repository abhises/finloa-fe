import { EmailSignup } from "./email-signup";

export function Hero() {
  return (
    <section className="bg-grid px-6 pt-[clamp(28px,5vw,64px)] pb-[clamp(20px,3vw,32px)]">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-[26px] text-center">
        <div className="font-mono text-[13px] tracking-[0.08em] text-brand">VIDEO CREATION &amp; SOCIAL GROWTH</div>
        <h1 className="flex max-w-[980px] flex-col items-center gap-1 text-[clamp(40px,6.4vw,76px)] leading-[1.04] font-bold tracking-[-0.045em] text-balance">
          <span>Affordable videos that</span>
          <span className="text-brand">grow your audience.</span>
        </h1>
        <p className="max-w-[820px] text-lg leading-[1.55] text-balance text-muted">
          Professional videos for YouTube, TikTok, Instagram and LinkedIn at a clear price. We edit, optimise and post so
          your channels keep growing.
        </p>
        <EmailSignup source="video-creation" cta="Get my video plan →" />
      </div>
    </section>
  );
}
