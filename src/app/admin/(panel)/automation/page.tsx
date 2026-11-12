/** How to drive the admin over HTTP (Claude, n8n, Make, scripts). Same endpoints the dashboard uses. */
export default function AutomationPage() {
  const api = "https://finloa.com/api";

  const upsert = `curl -X PUT ${api}/posts/by-slug/get-cited-in-chatgpt \\
  -H "x-admin-key: $ADMIN_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "How to get your brand cited in ChatGPT",
    "titleNl": "Zo wordt je merk genoemd in ChatGPT",
    "excerpt": "Five changes that make AI tools quote you.",
    "excerptNl": "Vijf aanpassingen waardoor AI-tools je citeren.",
    "body": "## Why it matters\\n\\nText in **Markdown**…",
    "bodyNl": "## Waarom het ertoe doet\\n\\nTekst in **Markdown**…",
    "categorySlug": "seo",
    "authorSlug": "maya-collins",
    "coverImage": "https://…",
    "youtube": "https://youtu.be/…",
    "tags": ["SEO", "AI"], "tagsNl": ["SEO", "AI"],
    "faqs": [{ "q": "…", "a": "…" }], "faqsNl": [{ "q": "…", "a": "…" }],
    "seoTitle": "…", "seoDescription": "…",
    "featured": false,
    "published": false
  }'`;

  const media = `# upload a file
curl -X POST ${api}/media -H "x-admin-key: $ADMIN_API_KEY" -F "file=@photo.jpg" -F "alt=Team at work"

# or import one from a URL
curl -X POST ${api}/media/import -H "x-admin-key: $ADMIN_API_KEY" \\
  -H "Content-Type: application/json" -d '{"url":"https://example.com/photo.jpg","alt":"…"}'`;

  const texts = `# every edited page text, by key
curl ${api}/texts

# change texts (keys are listed in finloa-fe/src/i18n/texts.json); null = back to the default
curl -X PUT ${api}/texts -H "x-admin-key: $ADMIN_API_KEY" -H "Content-Type: application/json" \\
  -d '{"items":[{"key":"<key>","en":"New English text","nl":"Nieuwe Nederlandse tekst"}]}'`;

  return (
    <div style={{ maxWidth: 920, display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="ad-head" style={{ marginBottom: 0 }}>
        <div>
          <h1>Automation API</h1>
          <p>
            Everything in this dashboard can also be done over HTTP, so Claude, n8n, Make or a script can write posts directly. Send the{" "}
            <span className="ad-pre-inline">ADMIN_API_KEY</span> from finloa-be&apos;s environment in the <span className="ad-pre-inline">x-admin-key</span> header.
          </p>
        </div>
      </div>

      <section className="ad-panel">
        <h2>Create or update a blog post (by slug)</h2>
        <pre className="ad-pre">{upsert}</pre>
        <p className="ad-hint">
          Idempotent: the first call creates the post, later calls update it. Fields you leave out keep their value. Every text field has a Dutch twin ending in{" "}
          <span className="ad-pre-inline">Nl</span>; empty Dutch fields show the English text on nl.finloa.com. Set{" "}
          <span className="ad-pre-inline">&quot;published&quot;: true</span> to go live, and <span className="ad-pre-inline">publishedAt</span> to schedule.
        </p>
      </section>

      <section className="ad-panel">
        <h2>Upload images</h2>
        <pre className="ad-pre">{media}</pre>
        <p className="ad-hint">
          The response contains <span className="ad-pre-inline">data.url</span>. Use it as <span className="ad-pre-inline">coverImage</span> or in Markdown as{" "}
          <span className="ad-pre-inline">![alt](url)</span>.
        </p>
      </section>

      <section className="ad-panel">
        <h2>Page texts (English and Dutch)</h2>
        <pre className="ad-pre">{texts}</pre>
      </section>

      <section className="ad-panel">
        <h2>All endpoints</h2>
        <pre className="ad-pre">{`GET    /api/posts/admin/all                 all posts (drafts too)
GET    /api/posts/admin/:id                 one post, both languages
POST   /api/posts                           create
PATCH  /api/posts/:id                       update
PUT    /api/posts/by-slug/:slug             create or update
DELETE /api/posts/:id
GET    /api/posts?lang=en|nl                published posts (public)
GET    /api/posts/:slug?lang=en|nl          one published post (public)

GET    /api/categories/admin    POST /api/categories    PATCH|DELETE /api/categories/:id
GET    /api/authors             POST /api/authors       PATCH|DELETE /api/authors/:id
GET    /api/media?page=&q=      POST /api/media (multipart "file")   POST /api/media/import
PATCH  /api/media/:id {alt}     DELETE /api/media/:id
GET    /api/texts               PUT /api/texts {items:[{key,en,nl}]}
GET    /api/videos/all          POST /api/videos        PATCH|DELETE /api/videos/:id
GET    /api/leads               PATCH /api/leads/:id
GET    /api/subscribers
GET    /api/stats`}</pre>
        <p className="ad-hint">Changes made over the API show on the site within a minute (the dashboard refreshes the site cache right away).</p>
      </section>
    </div>
  );
}
