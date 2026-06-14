# Outcast Tattoo — Architecture Reference

How the project is structured, what each file does, and why. Read this before touching anything.

---

## Mental Model

```
tokens.css          ← what things look like (design values)
strings.pt.ts       ← what things say (all copy)
artists.json        ← what things are (business data)
Base.astro          ← the HTML wrapper (page structure)
shared/ components  ← repeated UI (Nav, Footer)
sections/ components← page-level blocks (Hero, ArtistGrid, Map)
ui/ components      ← reusable pieces (ArtistCard)
forms/ components   ← form logic (BookingForm)
pages/              ← routes — compose everything above
```

Each layer only knows about the layer below it. Pages use sections and shared components. Sections use ui components. Everything reads from tokens, strings, and data. **Nothing is hardcoded.**

---

## Config Files (root)

### `package.json`
Tells Node what this project is and what commands to run.
- `npm run dev` — starts local dev server
- `npm run build` — compiles the site to static HTML for deployment

Also declares `astro` as a dependency.

### `astro.config.mjs`
Astro's own settings. Key options:
- `output: 'static'` — pure static HTML, no server runtime
- Site URL for sitemap/canonical tags
- Where to add Astro integrations (image optimization, sitemap, etc.) if needed later

### `tsconfig.json`
TypeScript configuration. The critical part is the `paths` alias:
```json
"@/*": ["./src/*"]
```
This means instead of writing `../../components/Nav.astro`, you write `@/components/Nav.astro`. Never breaks when files move. Use `@/` everywhere.

---

## `src/styles/`

### `tokens.css`
**Single source of truth for every design value.**

Colors, font families, type scale, spacing, z-index, motion easing — all defined here as CSS custom properties. Components never hardcode values like `color: #fff` or `font-size: 2rem`. They always use `var(--color-ink)` or `var(--text-xl)`.

To change the accent color sitewide: edit one line here.

### `global.css`
Applied to every page via `Base.astro`. Three responsibilities:
1. **CSS reset** — strips browser default margins/paddings so every browser starts from zero
2. **Base element styles** — what `body`, `h1–h6`, `a`, `p` look like without any class
3. **Utility classes** — `.container` (centered max-width wrapper), `.reveal` (scroll animation base)

Also imports Google Fonts and `tokens.css`.

---

## `src/layouts/`

### `Base.astro`
The HTML shell every page is wrapped in. Contains the full `<head>`:
- charset, viewport
- `<title>` and `<meta name="description">` — injected via props from each page
- OpenGraph and Twitter card tags
- Favicon
- JSON-LD structured data for local business (Google rich results)
- Font and CSS imports

Pages pass their own title/description as props. `Base.astro` injects them. You never repeat `<head>` boilerplate — one file handles it all. The `<slot />` tag is where each page's content renders.

---

## `src/content/`

### `strings.pt.ts`
**Every word the user sees lives here.**

Nav labels, headings, button text, placeholders, error messages, footer copy, meta titles, descriptions — all of it. Components never contain hardcoded text.

Shape:
```ts
export const strings = {
  nav: { ... },
  hero: { ... },
  about: { ... },
  artists: { ... },
  booking: { ... },
  footer: { ... },
  meta: { ... },  // page titles, descriptions, OG tags
} as const
```

Import anywhere as:
```ts
import { strings } from '@/content/strings.pt.ts'
```

**Why:** update copy without touching component code. When English is added, create `strings.en.ts` with the same shape and swap the import — zero component changes needed.

---

## `src/data/`

### `artists.json`
Artist records — names, bios, specialties, image paths. Components loop over this file. Adding a sixth artist means adding one JSON object here. No component changes needed.

Minimum shape per artist:
```json
{
  "id": "string",
  "name": "string",
  "bio": "string",
  "specialties": ["string"],
  "portfolio": ["string"]
}
```

---

## `src/components/`

Organized into four categories by scope and responsibility.

### `shared/` — used on every page

**`Nav.astro`**
Top navigation bar. Fixed position, appears on all pages. Desktop links + mobile hamburger via minimal Astro island (toggles class, sets `aria-expanded` — required for WCAG AA). Uses Astro's current path to highlight the active link.

**`Footer.astro`**
Site-wide footer. Address, hours, Instagram link, copyright. Appears on all pages.

---

### `sections/` — full-width page sections

Each section is used on one specific page. Sections compose ui components; they don't contain raw HTML repeated elsewhere.

**`Hero.astro`**
Full-screen opening section on `/`. Heading, subheading, CTA button, decorative SVG motif. All text sourced from `strings.pt.ts`.

**`ArtistGrid.astro`**
Artist listing section on `/sobre`. Reads `artists.json`, loops over it, renders one `ArtistCard` per artist. Grid uses `auto-fit` — works at any number of artists and any screen size without breakpoint hacks.

**`LocationMap.astro`**
Shop location section on `/sobre`. Address, hours, directions link, Google Maps iframe. The iframe carries `loading="lazy"` — doesn't block the page from painting.

---

### `forms/` — form-specific components

**`BookingForm.astro`**
The full booking form on `/marcar`. Three parts:
1. Artist dropdown — built from `artists.json`
2. Inline SVG body selector — front and back silhouettes, clickable areas, no JS library
3. Description textarea

On submit: sends to Formspree → shop email inbox. Contains minimal inline script for area selection state only.

---

### `ui/` — smaller reusable pieces

**`ArtistCard.astro`**
Single artist card — portrait image, name, specialty tags, bio, portfolio button, booking link. Used inside `ArtistGrid`. Accepts artist data as props. Contains the native `<dialog>` portfolio lightbox (opens on "Ver portfólio"). Fully reusable regardless of content.

---

## `src/pages/`

Pages are routes. They compose components — they do not contain inline UI logic.

| File | Route | Composed from |
|---|---|---|
| `index.astro` | `/` | `Base`, `Nav`, `Hero`, `Footer` |
| `sobre.astro` | `/sobre` | `Base`, `Nav`, `ArtistGrid`, `LocationMap`, `Footer` |
| `marcar.astro` | `/marcar` | `Base`, `Nav`, `BookingForm`, `Footer` |

Each page also carries the Intersection Observer script that drives `.reveal` scroll animations.

---

## `public/`

Static assets served as-is. Not processed by Astro.

```
public/
  images/
    artists/     # WebP portfolio images, one subfolder per artist
    og/          # OpenGraph images (1200×630)
  fonts/         # Self-hosted fonts if Google Fonts ever gets dropped
  logo.svg       # Master logo SVG — multi-path, used by the loader animation
```

**Images must be WebP, optimized before commit.** Use Astro's `<Image />` component in `.astro` files for automatic srcset and lazy loading.

---

## Key Rules (short version)

- **Component rule**: if a UI element appears in more than one place, it is a component. No exceptions.
- **Hardcoding rule**: no text strings, colors, or spacing values in component files. Always tokens/strings/data.
- **JS rule**: zero runtime JS unless unavoidable. Astro islands only when interactivity genuinely requires it.
- **Image rule**: WebP only, optimized, always via `<Image />`.
- **SEO rule**: every page has unique `<title>` and `<meta description>` sourced from `strings.pt.ts`.
