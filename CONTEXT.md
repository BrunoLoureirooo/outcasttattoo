# Outcast Tattoo — Domain Glossary

Canonical terms for this project. Update as decisions crystallise.

---

## Typography

**Display font** — `Grenze Gotisch` (Google Fonts, weights 600/800/900). Used for: hero heading, section headings, artist names, logo fallback. Never body copy.

**Body font** — `IM Fell English` (Google Fonts, weight 400 / 400 italic). Used for: body copy, nav links, form labels, captions, buttons, specialty tags, bios.

Two families only. No third family.

**Small-text floor** — `--text-xs` never renders below 14px, `--text-base` (body) never below 16px. Accessibility floor for all-caps tracked labels; 12px and under is banned.

**Weight strategy** — IM Fell English has no bold. Visual weight on UI elements (nav, buttons) comes from uppercase + `0.08em` letter-spacing + scale. No synthetic bold.

**Nav active state** — `2px` border-bottom `var(--color-accent)`. Link color stays `--color-ink`. Structural marker, not decorative highlight.

**Nav link font** — `IM Fell English` 400 regular (non-italic), uppercase, `0.1em` tracking. Grenze Gotisch 600 was too heavy for nav scale. IM Fell English regular reads cleanly while staying on-brand.

---

## External Services

**Google Business** — verified listing exists for "Outcast Tattoo & Piercing" at Rua da Escola, Urbanização Planalto 6, Leiria. Use listing embed URL in `LocationMap.astro`.

**Formspree** — endpoint TBD, stored as `PUBLIC_FORMSPREE_ID` env var. No shop email yet.

**Instagram** — `outcast.tattoopiercing` — real, confirmed.

**TikTok** — `https://www.tiktok.com/@outcasttattoopier` — real, confirmed. Canonical URL stripped of share-tracking params. Shown alongside Instagram in footer and JSON-LD `sameAs`.

---

## Imagery

**Logo** — real SVG at `public/logo.svg`. Two paths: `#logo-center` (crown of thorns) and `#logo-ring`. Loader animates center first, ring second via `stroke-dashoffset`. Crown of thorns for hero background is extracted from this same SVG — no separate asset.

**Loader trigger** — once per session only. `sessionStorage` flag skips animation on subsequent page visits. Prevents annoyance on multi-page browsing. Skippable: clicking anywhere on the loader dismisses it immediately (fast fade) — impatient users are not held hostage by the animation.

**Hero background** — crown of thorns SVG motif (inline). No photography in v1 — none supplied yet. Photography is a v2 swap when client provides assets. Crown of thorns is intentional brand, not placeholder.

**Artist cards** — portrait image when available; fallback is an SVG silhouette (person outline) in `--color-border`. Card face: portrait, name, specialty tags (each links to `/trabalhos?estilo=<name>`), bio, thumbnails of the artist's latest Pieces. Clicking anywhere on the card opens the detail popup; clicking a piece thumbnail opens that piece's lightbox instead (click-stop). Service toggles + "Marcar com {name}" CTA live only in the detail popup — not on the card face. Single-service artists get their service pre-selected. With no service selected, "Marcar" renders greyed out but stays clickable: pressing it shows an inline hint ("Seleciona pelo menos um dos serviços primeiro.") instead of navigating.

**Latest Pieces** — recent finished works (tattoos/piercings). Each piece belongs to exactly one artist, has one service (tattoo | piercing), zero or more styles from the Styles taxonomy (piercing pieces typically none — style filter only meaningful for tattoo), and one or more images (multiple angles of the same work; first image is the grid tile). No dedicated artist profile pages. Lives on its own page `/trabalhos` (full archive, filterable by service, artist, and style — client-side island). Landing gets a teaser strip: 6 latest pieces, no filters, linking to `/trabalhos`. Nav gains a "Trabalhos" item (4 pages total).

**Piece lightbox** — one shared popup for every piece, opened from `/trabalhos` tiles and from artist-card portfolio thumbs. Native `<dialog>`, controls overlaid on the image itself (close top-right, prev/next arrows on the edges, image counter bottom-right). Caption: artist name first (links to `/sobre#<artist-id>`; when already on `/sobre`, opens that artist's popup in place instead of navigating), style tags on the row beneath (on `/trabalhos`: activates that style filter and closes the popup; elsewhere: navigates to `/trabalhos?estilo=<name>`).

**Filter deep links** — `/trabalhos` reads `?servico=`, `?artista=`, `?estilo=` URL params on load and pre-activates the matching filters. Artist-card specialty tags and piece-lightbox style tags across the site link into these.

**Latest** — pieces sorted by `date_completed` (date the work was done, set by editor), descending. Not upload timestamp, not manual curation.

**Style** — controlled vocabulary, single shared Styles taxonomy. Artists' specialties and pieces' styles both reference it — never free text. Filter options derive from the taxonomy. Existing artist specialty strings are the seed data.

---

## Booking

**Booking form** — `/marcar`. Steps: service toggle → artist picker(s) → area selector(s) → reference link → description → submit.

**Service toggle** — checkbox-style buttons at top: [Tatuagem] [Piercing]. Both can be active simultaneously. Controls which artist cards highlight and which selectors appear.

**Artist selector** — card-based: all published artists + one "sem preferência" dice card per picker. Card shows the artist's portrait full-bleed when one exists (initial letter otherwise). Selected card: accent border, expanded full width, details visible. Hover-preview expansion exists only on hover-capable devices (touch selects without sticking). Dimming is **per picker**: a card greys out unless its artist offers that picker's own service — a tattoo-only artist is selectable in the tattoo picker but greyed in the piercing picker even with both services active. When both services active: two separate artist pickers (tattoo + piercing), each with dice card. Email captures both. Requires Astro island.

**Body area selector** — tattoo only. Medium granularity. Front: cabeça, pescoço, peito, abdómen, braço superior ×2, antebraço ×2, coxa ×2, canela ×2. Back: cabeça, costas sup/inf, braço superior ×2, antebraço ×2, isquiotibial ×2, gémeo ×2. Multi-select. Front + back SVG silhouette. Visible only when Tatuagem active.

**Piercing selector** — visible only when Piercing active. Illustrated SVG: face + body outline, clickable piercing points (dots). Two anatomical regions: Orelha (helix, tragus, lobe, conch, daith, rook, etc.) and Corpo (septum, nostril, labret, navel, nipple, etc.). Multi-select. Selected point fills `var(--color-accent)`.

**Reference link** — text field ("link de referência"). Instagram/Pinterest URL. No file upload in v1.

**Submission target** — Formspree → shop email inbox. Email address TBD — no domain email exists yet. Formspree endpoint stored as env var `PUBLIC_FORMSPREE_ID`, placeholder until real address is set up.

---
