# Outcast Tattoo — Domain Glossary

Canonical terms for this project. Update as decisions crystallise.

---

## Typography

**Display font** — `Grenze Gotisch` (Google Fonts, weights 600/800/900). Used for: hero heading, section headings, artist names, logo fallback. Never body copy.

**Body font** — `IM Fell English` (Google Fonts, weight 400 / 400 italic). Used for: body copy, nav links, form labels, captions, buttons, specialty tags, bios.

Two families only. No third family.

**Weight strategy** — IM Fell English has no bold. Visual weight on UI elements (nav, buttons) comes from uppercase + `0.08em` letter-spacing + scale. No synthetic bold.

**Nav active state** — `2px` border-bottom `var(--color-accent)`. Link color stays `--color-ink`. Structural marker, not decorative highlight.

**Nav link font** — `IM Fell English` 400 regular (non-italic), uppercase, `0.1em` tracking. Grenze Gotisch 600 was too heavy for nav scale. IM Fell English regular reads cleanly while staying on-brand.

---

## External Services

**Google Business** — verified listing exists for "Outcast Tattoo & Piercing" at Rua da Escola, Urbanização Planalto 6, Leiria. Use listing embed URL in `LocationMap.astro`.

**Formspree** — endpoint TBD, stored as `PUBLIC_FORMSPREE_ID` env var. No shop email yet.

**Instagram** — `outcast.tattoopiercing` — real, confirmed.

**Booksy** — v2. `booksy_url` in `artists.json` is placeholder, unused in v1.

---

## Imagery

**Logo** — real SVG at `public/logo.svg`. Two paths: `#logo-center` (crown of thorns) and `#logo-ring`. Loader animates center first, ring second via `stroke-dashoffset`. Crown of thorns for hero background is extracted from this same SVG — no separate asset.

**Loader trigger** — once per session only. `sessionStorage` flag skips animation on subsequent page visits. Prevents annoyance on multi-page browsing.

**Hero background** — crown of thorns SVG motif (inline). No photography in v1 — none supplied yet. Photography is a v2 swap when client provides assets. Crown of thorns is intentional brand, not placeholder.

**Artist cards** — no portraits in v1. Placeholder: large Grenze Gotisch initial centered in image area, `--color-muted`. Photography swapped in when client supplies assets. Portfolio section hidden in v1 — no images yet. Shown when images arrive.

---

## Booking

**Booking form** — `/marcar`. Steps: service toggle → artist picker(s) → area selector(s) → reference link → description → submit.

**Service toggle** — checkbox-style buttons at top: [Tatuagem] [Piercing]. Both can be active simultaneously. Controls which artist cards highlight and which selectors appear.

**Artist selector** — card-based. Six cards: five artist cards + one "sem preferência" dice card. Selected card: accent border active, full width. Unselected shrink. Artists tagged with services (`tattoo`, `piercing`, or both). Cards matching active toggles gain color; others go grey. When both services active: two separate artist pickers (tattoo artist + piercing artist), each with dice card. Email captures both. Requires Astro island.

**Body area selector** — tattoo only. Medium granularity. Front: cabeça, pescoço, peito, abdómen, braço superior ×2, antebraço ×2, coxa ×2, canela ×2. Back: cabeça, costas sup/inf, braço superior ×2, antebraço ×2, isquiotibial ×2, gémeo ×2. Multi-select. Front + back SVG silhouette. Visible only when Tatuagem active.

**Piercing selector** — visible only when Piercing active. Illustrated SVG: face + body outline, clickable piercing points (dots). Two anatomical regions: Orelha (helix, tragus, lobe, conch, daith, rook, etc.) and Corpo (septum, nostril, labret, navel, nipple, etc.). Multi-select. Selected point fills `var(--color-accent)`.

**Reference link** — text field ("link de referência"). Instagram/Pinterest URL. No file upload in v1.

**Submission target** — Formspree → shop email inbox. Email address TBD — no domain email exists yet. Formspree endpoint stored as env var `PUBLIC_FORMSPREE_ID`, placeholder until real address is set up.

**Booksy** — v2. Not in v1. Artist cards on `/sobre` have no Booksy link for now. `booksy_url` field stays in `artists.json` schema but unused until v2.

---
