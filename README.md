# finloa-fe

Finloa website — Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.
The homepage is the **Video Creation** page for businesses.

## Setup

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                  # http://localhost:3000
```

Start `../finloa-be` first. Pricing plans load from `GET /api/plans` (cached for a few minutes,
with a built-in fallback if the API is down).

## Pages

`/` Video Creation (home) · `/services` · `/ai-marketing` · `/website-design` · `/seo` · `/content-marketing` ·
`/paid-media` · `/for-creators` · `/why-finloa` · `/blog` · `/careers` · `/privacy` · `/terms`

Every service page ends with a contact form that posts to `POST /api/leads` with its own `source`.
Blog posts come from `GET /api/posts`; the subscribe box posts to `POST /api/subscribers`.

Shared building blocks live in `src/components/ui.tsx`; nav and footer links in `src/lib/site.ts`.

Design tokens (colours, fonts) live in `src/app/globals.css` under `@theme`.
