# Outcast Tattoo — Project Instructions

## Reference Files

Always read these before any implementation task:

- **[PRODUCT.md](./claude-docs/PRODUCT.md)** — brand register, users, personality, design principles, anti-references
- **[DESIGN.md](./claude-docs/DESIGN.md)** — color palette, typography, spacing, motion, component specs, banned patterns
- **[ARCHITECTURE.md](./claude-docs/ARCHITECTURE.md)** — file structure, what each file does, layer responsibilities, key rules

---

## Project Overview

Website for a tattoo shop based in Portugal. Goals: visually captivating, maximum SEO performance, minimum runtime weight.

## Stack

- **Framework**: Astro (static output, zero JS by default)
- **Hosting**: Cloudflare Pages
- **Domain**: Pending — use `*.pages.dev` for now
- **Language**: Portuguese (PT) only — no i18n for now
- **Styling**: CSS custom properties — see [DESIGN.md](./claude-docs/DESIGN.md) for full token system

## Pages

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Hero, captivating entry point |
| About / Artists | `/sobre` | Shop info, location, artist cards |
| Booking | `/marcar` | Body area selector + Booksy integration |

No additional pages for v1.

---

## Development Rules

### Component-Driven Implementation

- If a UI element appears in more than one place, it is a component. No exceptions.
- Components live in `src/components/` organized by category (see Directory Structure below).
- Prefer small, focused components over large monolithic ones.
- Page files (`src/pages/`) compose components — they do not contain inline UI logic.

### No Hardcoding — Centralized Content

- **All client-facing text** lives in `src/content/strings.pt.ts` (the single source of truth).
- No string literals in `.astro` or component files — always import from the strings file.
- This prepares the project for future translation without refactoring components.
- Data (artists, etc.) lives in `src/data/` as JSON — never inlined in components.
- Design tokens (colors, spacing, type scale) live in `src/styles/tokens.css` — never hardcoded in component `<style>` blocks.

### Content Strings Shape

```ts
// src/content/strings.pt.ts
export const strings = {
  nav: { ... },
  hero: { ... },
  about: { ... },
  artists: { ... },
  booking: { ... },
  footer: { ... },
  meta: { ... },   // page titles, descriptions, OG tags
} as const
```

Import in pages/components as: `import { strings } from '@/content/strings.pt.ts'`

---

## Directory Structure

```
src/
  components/
    shared/          # Used across 2+ pages (Nav, Footer, Logo, Button, etc.)
    sections/        # Full page sections (Hero, ArtistGrid, MapEmbed, etc.)
    forms/           # Form-specific components (BookingForm, BodySelector, etc.)
    ui/              # Atomic UI pieces (ArtistCard, PortfolioThumb, Tag, etc.)
  content/
    strings.pt.ts    # All client-facing text in Portuguese
  data/
    artists.json     # Artist data — single source of truth
  layouts/
    Base.astro       # HTML shell, meta, fonts, global CSS
  pages/
    index.astro      # Landing
    sobre.astro      # About / Artists
    marcar.astro     # Booking
  styles/
    tokens.css       # Design tokens (colors, type scale, spacing, z-index)
    global.css       # Resets, base element styles, font imports
public/
  images/
    artists/         # Per-artist portfolio images (WebP)
    og/              # OpenGraph images
  fonts/             # Self-hosted fonts if needed
  logo.svg           # Master logo SVG (multi-path, for loader animation)
```

---

## Data Architecture

Artists are **data-driven** — defined in `src/data/artists.json`, never hardcoded in components. Currently 5 artists, must support any number without code changes.

### Artist shape (minimum)
```json
{
  "id": "string",
  "name": "string",
  "bio": "string",
  "specialties": ["string"],
  "booksy_url": "string",
  "portfolio": ["string"]
}
```

---

## Booking

- **Platform**: Booksy
- Each artist has their own Booksy booking link (`booksy_url` in artist data)
- Booking page includes:
  - Visual body area selector (inline SVG, clickable, zero JS library)
  - Description textarea
  - File upload: **PINNED** — check if Booksy supports attachments first; fallback is Cloudflare R2 + Worker
- On submit: redirect to artist-specific Booksy page

---

## Images

- Portfolio images stored in repo under `public/images/artists/`
- Format: **WebP**, optimized before commit
- Use Astro `<Image />` component for automatic optimization + srcset
- Upgrade path: Cloudflare Images if repo assets become unwieldy

---

## Maps

- Google Maps iframe embed on About page
- Lazy-load: `loading="lazy"` on the iframe

---

## Loader

- Animated SVG logo — multiple paths draw in sequence via CSS `stroke-dashoffset`
- Pure CSS animation, zero JS
- Logo SVG to be provided by client — see [DESIGN.md](./claude-docs/DESIGN.md) for animation spec
- Reduced motion: instant reveal, no draw animation

---

## Contact Form

**PINNED for later** — not in v1 scope.

---

## Performance Rules

- Zero JS runtime unless absolutely necessary (Astro islands only when needed)
- All images WebP, appropriately sized
- No heavy third-party scripts
- Google Maps iframe lazy-loaded
- SVG assets inlined where possible to reduce requests
- Lighthouse target: 95+ across all categories

## SEO Rules

- All meta tags in Portuguese
- Semantic HTML throughout (`<main>`, `<article>`, `<section>`, `<header>`, `<footer>`)
- Unique `<title>` and `<meta name="description">` per page — sourced from `strings.pt.ts`
- OpenGraph tags on all pages
- JSON-LD structured data for local business on About page
- No JS-rendered content that crawlers cannot see

---

## Decisions Pending (v2+)

- Contact/inquiry form (Formspree or Web3Forms)
- File upload on booking (check Booksy first, then R2 + Worker)
- Custom domain via Cloudflare Registrar
- PT + EN language toggle (strings architecture already prepares for this)
- Gallery page, blog, flash designs, pricing, FAQ
- Cloudflare Images if asset volume grows
