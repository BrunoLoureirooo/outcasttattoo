# Directus as headless CMS, consumed at build time only

We are moving content (artists, events, pieces, styles) out of repo JSON into a self-hosted Directus instance. The site stays fully static: `astro build` fetches the Directus REST API and bakes content into HTML — there is no runtime dependency on Directus. Client-side fetch was rejected (crawlers see nothing, violates the project's SEO/zero-JS rules); SSR was rejected (couples every page view to the availability and latency of a single self-hosted box, for content that changes weekly).

## Consequences

- **Freshness pipeline**: a content edit publishes via Directus Flow webhook → Cloudflare Pages deploy hook → rebuild (~1 min). Additionally, a **daily scheduled rebuild** (cron-triggered Flow or Worker cron hitting the same deploy hook) is required — past-event filtering happens at build, so without it an expired event would stay on the landing page until the next content edit.
- **Images**: piece/artist images are fetched from the Directus asset endpoint *at build time* and run through the Astro `<Image />` pipeline, served from the Cloudflare Pages CDN. Visitors never hit the Directus box. Hotlinking Directus asset transforms was rejected — it would re-couple availability and bandwidth to the self-hosted server.
- **Deletion semantics**: removing a photo in Directus removes it from production on the next rebuild (deploys are immutable snapshots). It may persist in older Pages deployment preview URLs until those are pruned.
- **Auth**: the build authenticates with a static token (`DIRECTUS_TOKEN` secret + `DIRECTUS_URL` in Cloudflare Pages env) bound to a read-only role scoped to published items. Public API read access was rejected to keep the box closed to scraping and to make draft leakage impossible.
