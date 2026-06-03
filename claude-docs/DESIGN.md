# Design

## Theme

Dark. Monochrome. Unapologetic.

Color strategy: **Drenched** — the surface is the darkness. Black is not a background; it is the material. One warm ivory accent used with surgical restraint. No other colors.

Physical scene: ink pressed into skin under a single industrial lamp. Crown of thorns. Cold chain links catching a sliver of light. The warmth is bone-deep, not surface warmth.

## Color Palette

```css
:root {
  /* Ground — true black. No hue tint. */
  --color-bg:       oklch(0.08 0.000 0);

  /* Panels, cards, lifted surfaces */
  --color-surface:  oklch(0.13 0.000 0);

  /* Borders, dividers, subtle structure */
  --color-border:   oklch(0.22 0.000 0);

  /* Primary text — near-white, pure */
  --color-ink:      oklch(0.96 0.000 0);

  /* Secondary text, metadata, captions */
  --color-muted:    oklch(0.52 0.000 0);

  /* Accent — warm ivory / aged bone. The single non-neutral. */
  /* Used for: logo highlights, decorative motifs, hover states, active states, key emphasis */
  --color-accent:   oklch(0.91 0.018 88);

  /* Accent darkened — for pressed/active states on accent elements */
  --color-accent-dim: oklch(0.75 0.014 88);
}
```

### Contrast verification

| Pair | Ratio | WCAG |
|---|---|---|
| `--color-ink` on `--color-bg` | ~18:1 | AAA |
| `--color-accent` on `--color-bg` | ~13:1 | AAA |
| `--color-muted` on `--color-bg` | ~4.8:1 | AA |
| `--color-ink` on `--color-surface` | ~14:1 | AAA |

## Typography

### Voice words
Gothic. Inked. Permanent.

### Font selection

**Display / Logo / Section headings**: `Grenze Gotisch` (Google Fonts)
- Proper gothic blackletter — the same visual language visible in Outcast's own brand posts. Condensed, dramatic, legible at large scale. The weight of illuminated manuscripts crossed with street culture.
- Weights: 600, 800, 900
- Only for display-scale text (headings, hero, logo fallback). Never body copy.

**Body / Subheadings / UI**: `IM Fell English` (Google Fonts)
- Old-style serif with genuine period character — irregular ink traps, slightly rough optical feel, as if handset from worn type. Dark and literary without becoming unreadable.
- Weights: 400 (regular), 400 italic (emphasis)
- For all body copy, artist bios, nav links, form labels, captions.

**No third family.** Two families, both carrying gothic DNA at their respective roles. Grenze Gotisch provides the dramatic entry; IM Fell English carries the voice at reading size.

### Reflex-reject check
Neither Grenze Gotisch nor IM Fell English appears on the reflex-reject list. Neither lands in the editorial-magazine lane. Confirmed.

### Scale

Fluid scale using `clamp()`. Ratio: 1.333 (perfect fourth).

```css
:root {
  --text-xs:   clamp(0.69rem,  0.65rem + 0.2vw,  0.75rem);   /* caption */
  --text-sm:   clamp(0.83rem,  0.78rem + 0.25vw, 0.94rem);   /* small body */
  --text-base: clamp(1rem,     0.94rem + 0.3vw,  1.125rem);  /* body */
  --text-lg:   clamp(1.2rem,   1.1rem  + 0.5vw,  1.4rem);    /* lead / subhead */
  --text-xl:   clamp(1.44rem,  1.3rem  + 0.7vw,  1.75rem);   /* section heading */
  --text-2xl:  clamp(1.73rem,  1.5rem  + 1.15vw, 2.25rem);   /* page heading */
  --text-3xl:  clamp(2.07rem,  1.75rem + 1.6vw,  3rem);      /* hero subhead */
  --text-4xl:  clamp(2.5rem,   2rem    + 2.5vw,  4.5rem);    /* hero display */
  --text-5xl:  clamp(3rem,     2.25rem + 3.75vw, 6rem);      /* hero statement — max 6rem */
}
```

### Line height

- Display (Grenze Gotisch): `line-height: 1.05–1.1`
- Subheadings: `line-height: 1.2`
- Body (IM Fell English): `line-height: 1.6`
- Light text on dark: add 0.05–0.08 to these values
- Body max-width: `65ch`
- `text-wrap: balance` on h1–h3
- `text-wrap: pretty` on long body prose

### Letter spacing

- Grenze Gotisch display: `-0.02em` to `0em` (never tighter than `-0.04em`)
- IM Fell English headings: `-0.01em`
- IM Fell English body: `0`
- Short uppercase labels (IM Fell English, ≤4 words): `0.08em` — used sparingly, not as section grammar

## Spacing & Layout

```css
:root {
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* Section vertical rhythm — fluid */
  --section-pad: clamp(4rem, 8vw, 10rem);

  /* Content container */
  --container-max: 1200px;
  --container-pad: clamp(1.25rem, 5vw, 3rem);
}
```

### Grid

- 12-column grid, `--container-max` centered
- Artist cards: `repeat(auto-fit, minmax(280px, 1fr))` — no fixed breakpoints
- Asymmetric hero layouts encouraged — break the grid intentionally for emphasis
- Generous vertical separation between sections for rhythm; tight groupings within sections

### Z-index scale

```css
:root {
  --z-base:    0;
  --z-above:   10;
  --z-sticky:  100;
  --z-modal:   200;
  --z-toast:   300;
  --z-tooltip: 400;
}
```

## Motion

### Loader — SVG logo builder

The page entry. Logo paths draw themselves in sequence using `stroke-dasharray` / `stroke-dashoffset`. Each path animates in turn, building the complete logo before the page content appears.

```css
/* Per-path animation */
.logo-path {
  stroke-dasharray: var(--path-length);   /* set per path via JS or inline */
  stroke-dashoffset: var(--path-length);
  animation: draw-path var(--draw-duration, 0.8s) var(--draw-delay, 0s)
             cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes draw-path {
  to { stroke-dashoffset: 0; }
}

/* Reduced motion — instant reveal, no draw */
@media (prefers-reduced-motion: reduce) {
  .logo-path {
    animation: none;
    stroke-dashoffset: 0;
  }
}
```

Paths stagger with `--draw-delay` increments (~0.15s apart). Total loader duration: ~1.5–2s max.

### Page transitions & reveals

- Sections reveal on scroll: `opacity: 0 → 1` + `translateY(1.5rem → 0)` using Intersection Observer
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) — never bounce, never elastic
- Duration: 0.5–0.7s per element
- Content is **never hidden** without the reveal class — default state is visible; animation enhances, not gates
- Stagger within lists (artist cards, etc.): 0.08s between items

```css
/* Base state — always visible without JS */
.reveal {
  opacity: 1;
  transform: none;
}

/* Enhanced when JS/IO active */
.reveal[data-pending] {
  opacity: 0;
  transform: translateY(1.5rem);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal[data-pending].is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal[data-pending] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### Interaction micro-motion

- Links/buttons: `transition: color 0.2s ease, opacity 0.2s ease` — no layout shifts
- Artist cards: subtle `scale(1.02)` on hover, `0.25s ease-out` — not a jump
- Navigation: fade opacity on hover, not background fill flash
- Body area SVG selector: path fill transition `0.2s ease` on select/deselect

## Components

### Navigation

- Fixed top, full-width, `background: var(--color-bg)` with bottom border `var(--color-border)`
- Logo left, nav links right
- Mobile: hamburger → slide-in drawer from right (minimal Astro island — toggles class, sets `aria-expanded`)
- Links: IM Fell English 400 italic, `--text-sm`, uppercase, `0.08em` tracking — weight comes from tracking + uppercase, not bold — 3 items max

### Hero

- Full viewport height (`100svh`)
- Large Grenze Gotisch display heading — single bold statement
- Background: full-bleed tattoo photography or pure black with SVG motif overlay
- Single CTA: "Ver Artistas" or "Marcar Sessão" — IM Fell English 400, outlined style (border `var(--color-accent)`, text `var(--color-accent)`). Visual weight via uppercase + tracking, not bold.

### Artist Card

- No nested cards. Full-bleed portrait image top, minimal info below.
- Name: Grenze Gotisch 700, `--text-xl`
- Specialty tags: IM Fell English 400, `--text-xs`, muted
- Bio: IM Fell English 400, `--text-sm`, max `55ch`
- Booking CTA: text link with accent underline, not a button
- Portfolio thumbnails: 3-up grid below bio, click to expand (native `<dialog>`)

### Body Area Selector (Booking)

- Inline SVG — front and back human silhouette
- Selected area: fill transitions to `var(--color-accent)` at `opacity: 0.35`
- Unselected: fill `var(--color-surface)`
- Label: Barlow Condensed 600, `--text-sm`, appears on selection

### Form Elements

```css
input, textarea, select {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-ink);
  border-radius: 2px;   /* sharp, not rounded */
  padding: var(--space-3) var(--space-4);
  font-family: 'IM Fell English', serif;
  font-size: var(--text-base);
}

input:focus, textarea:focus {
  border-color: var(--color-accent);
  outline: none;
}

::placeholder {
  color: var(--color-muted);  /* meets 4.5:1 — not default gray */
}
```

### Buttons & CTAs

- Primary: outlined — `border: 1px solid var(--color-accent)`, text `var(--color-accent)`, background transparent
- Hover: fill with `var(--color-accent)`, text `var(--color-bg)` — invert
- No rounded corners: `border-radius: 2px` maximum
- IM Fell English 400, `--text-sm`, uppercase, `0.08em` tracking — visual weight from tracking + uppercase
- Padding: `var(--space-3) var(--space-8)`

### Decorative Motifs

- Crown of thorns: inline SVG, used as section divider or hero background element
- Chain link geometry: CSS border patterns or inline SVG — horizontal separators
- All motifs: `stroke: var(--color-border)` or `var(--color-accent)` at low opacity — never loud

## Logo

- SVG, multiple paths, white stroke on transparent background
- Dark variant: white paths (default — on black bg)
- Light variant: black paths (for any edge cases)
- Animation: paths draw in sequence on page load (see Motion — Loader)
- SVG to be provided by client

## Imagery

- All tattoo photography: real work from Outcast artists — no stock
- Treatment: high contrast, desaturated if color (shift toward monochrome feel)
- Hero: full-bleed, dark, dramatic — let subject emerge from shadow
- Artist portraits: consistent framing, dark background, face + upper body
- Format: WebP, optimized pre-commit
- Astro `<Image />` for automatic srcset + lazy loading

## Banned Patterns (project-specific)

- Gradient text — absolute ban
- Glassmorphism — absolute ban
- Rounded corners > 4px on any element
- Any warm-neutral background (cream, sand, charcoal-brown) — ground is true black
- Red, orange, purple, green, blue — no color outside the palette
- Section eyebrow labels ("SOBRE NÓS" / "ARTISTAS" above every heading) — structural, not voice
- Numbered section markers as scaffold
- Side-stripe border accents on cards
