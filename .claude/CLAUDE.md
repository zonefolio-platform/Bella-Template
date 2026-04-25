# Template Identity — Premium Tier
# Codename: Bella

> Brand identity spec for ZoneFolio's second premium template.
> This file is the single source of truth for design, animation, and component decisions.
> All agents read this file first.
> This template is built by copying the Vault folder and redesigning it — the data structure, env injection pattern, and file structure are identical. Only design, colors, fonts, and layout change.

---

## Concept

**Name:** Bella  
**Tagline:** "Where craft becomes visible."  
**Category:** Light Editorial  
**Tier:** PRO ($8/mo)  
**Target users:** Designers, art directors, illustrators, photographers, architects, and motion creatives — people who think in grids and feel uncomfortable with templates that look like templates.

### The idea
Bella is built around the feeling of a blank canvas — open, considered, and full of potential. Unlike Vault's atmospheric dark, Bella works in warm light: cream-white backgrounds, serif typography with italic rhythm, generous whitespace, and a subtle grain texture that makes everything feel printed rather than rendered. The structure is editorial and open. The accent color is the only bold decision — and it's the user's.

The template must never feel AI-generated. It achieves this through imperfection: organic italic shifts, asymmetric row-based work layout, grain overlay, and Cormorant Garamond's historically rooted character. It feels like a Pentagram case study, not a SaaS landing page.

---

## Color System — The 3 Env Colors

Same 3-env-var pattern as Vault. Defaults are warm and editorial rather than electric.

| Env var | CSS token | Role | Default |
|---------|-----------|------|---------|
| `NEXT_PUBLIC_COLOR_ACCENT` | `--accent` | CTAs · links · section labels · active nav · SplashCursor · Silk · eyebrow line | `#C8A96E` |
| `NEXT_PUBLIC_COLOR_SECONDARY` | `--secondary` | Section bg alternates · linen tint surfaces | `#F0EDE6` |
| `NEXT_PUBLIC_COLOR_HIGHLIGHT` | `--highlight` | Card hover glow · focus rings · selection | `#C8A96E` |

> **Hard rule:** If any env var is missing, empty, or an invalid hex — use the default. Never crash. Never throw. Log a warning in development only.

### Derived tokens (auto-generated — never set manually)

```css
--accent-light:   color-mix(in srgb, var(--accent)    10%, transparent);
--accent-border:  color-mix(in srgb, var(--accent)    35%, transparent);
--highlight-glow: color-mix(in srgb, var(--highlight) 15%, transparent);
```

### Where each token is used

```
--accent           → CTA primary text/border · section labels (text + border-left)
                     nav active underline · eyebrow horizontal line
                     SplashCursor fluid colors · Silk bg colorStops
                     Particles particleColors · skill tags (color)
                     email link hover color

--accent-light     → Section label bg · tag bg · hover tint on rows
--accent-border    → Tag borders · ghost CTA border · card hover border

--secondary        → Section alternate bg (linen tint) · About section bg
--highlight        → Card/row hover box-shadow color
--highlight-glow   → Focus rings · card hover glow
```

### Default accent presets (shown in dashboard picker)

| Preset | Accent | Secondary | Highlight | For |
|--------|--------|-----------|-----------|-----|
| Gold | `#C8A96E` | `#F0EDE6` | `#C8A96E` | Default · timeless |
| Slate Blue | `#7B9FBF` | `#EAF0F5` | `#7B9FBF` | Architects · UX |
| Terracotta | `#C47D5E` | `#F5EDE8` | `#C47D5E` | Illustrators · art |
| Sage | `#7FB08A` | `#EAF2EC` | `#7FB08A` | Photographers · film |
| Lavender | `#9B8EC4` | `#EEEAF5` | `#9B8EC4` | Motion · editorial |
| Dusty Rose | `#C46B6B` | `#F5EAEA` | `#C46B6B` | Fashion · brand |

> Note: Secondary is always a very light warm tint of the accent's hue — keeps the editorial feel while making section alternates feel intentional, not generic.

### Base palette (fixed — never user-customizable)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bella-bg` | `#F7F5F0` | Page background — warm parchment |
| `--bella-surface` | `#FFFFFF` | Cards, nav, modals |
| `--bella-surface-2` | `#F0EDE6` | Section alternates, linen tone |
| `--bella-border` | `rgba(26,24,20,0.08)` | Default borders |
| `--bella-border-mid` | `rgba(26,24,20,0.15)` | Emphasis borders |
| `--bella-ink` | `#1A1814` | Headings, display text |
| `--bella-ink-soft` | `#3D3A35` | Strong body text |
| `--bella-mid` | `#8C8880` | Body, captions, meta |
| `--bella-success` | `#4A9B6F` | Live / success states |
| `--bella-error` | `#C0392B` | Error states |

---

## ENV Injection — Full Implementation

Identical pattern to Vault. Only the template name prefix and default values change.

### `lib/theme.ts` — color resolver with validation

```typescript
const DEFAULTS = {
  accent:    '#C8A96E',
  secondary: '#F0EDE6',
  highlight: '#C8A96E',
} as const;

export function isValidHex(value: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

export function safeColor(
  value: string | undefined,
  key: keyof typeof DEFAULTS
): string {
  const fallback = DEFAULTS[key];
  if (!value || !isValidHex(value)) {
    if (process.env.NODE_ENV === 'development' && value) {
      console.warn(`[Bella] Invalid color for ${key}: "${value}" — using default ${fallback}`);
    }
    return fallback;
  }
  return value;
}

export function getThemeColors(): { accent: string; secondary: string; highlight: string } {
  return {
    accent:    safeColor(process.env.NEXT_PUBLIC_COLOR_ACCENT,    'accent'),
    secondary: safeColor(process.env.NEXT_PUBLIC_COLOR_SECONDARY, 'secondary'),
    highlight: safeColor(process.env.NEXT_PUBLIC_COLOR_HIGHLIGHT, 'highlight'),
  };
}
```

### `app/layout.tsx` — inject into `<html>`

```tsx
import { getThemeColors } from '@/lib/theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { accent, secondary, highlight } = getThemeColors();

  return (
    <html
      lang="en"
      style={{
        '--accent':    accent,
        '--secondary': secondary,
        '--highlight': highlight,
      } as React.CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
```

### `app/globals.css` — full token sheet

```css
:root {
  /* ── USER COLORS (from env via layout.tsx style prop) ── */
  --accent:    #C8A96E;
  --secondary: #F0EDE6;
  --highlight: #C8A96E;

  /* ── DERIVED (computed from user colors — never set manually) ── */
  --accent-light:   color-mix(in srgb, var(--accent)    10%, transparent);
  --accent-border:  color-mix(in srgb, var(--accent)    35%, transparent);
  --highlight-glow: color-mix(in srgb, var(--highlight) 15%, transparent);

  /* ── BASE (fixed — never change) ─────────────────────── */
  --bella-bg:          #F7F5F0;
  --bella-surface:     #FFFFFF;
  --bella-surface-2:   #F0EDE6;
  --bella-border:      rgba(26,24,20,0.08);
  --bella-border-mid:  rgba(26,24,20,0.15);
  --bella-ink:         #1A1814;
  --bella-ink-soft:    #3D3A35;
  --bella-mid:         #8C8880;
  --bella-success:     #4A9B6F;
  --bella-error:       #C0392B;
  --bella-font-serif:  'Cormorant Garamond', Georgia, serif;
  --bella-font-body:   'DM Sans', sans-serif;
  --bella-font-mono:   'DM Mono', monospace;

  /* ── SPACING ──────────────────────────────────────────── */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  40px;
  --space-2xl: 64px;
  --space-3xl: 96px;
}

/* Grain texture — what makes it feel printed, not rendered */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* fractalNoise SVG */
  opacity: 0.025;
  pointer-events: none;
  z-index: 999;
}

/* color-mix() fallback */
@supports not (color: color-mix(in srgb, red, blue)) {
  :root {
    --accent-light:   rgba(200,169,110,0.10);
    --accent-border:  rgba(200,169,110,0.35);
    --highlight-glow: rgba(200,169,110,0.15);
  }
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: var(--bella-bg);
  color: var(--bella-ink);
  font-family: var(--bella-font-body);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
}
```

### `.env.local` template (given to user)

```bash
# Bella Template — Color Configuration
# Set these 3 values to customize your portfolio colors.
# Must be valid 6-character hex codes (e.g. #C8A96E).
# Redeploy after changing.

NEXT_PUBLIC_COLOR_ACCENT=#C8A96E
NEXT_PUBLIC_COLOR_SECONDARY=#F0EDE6
NEXT_PUBLIC_COLOR_HIGHLIGHT=#C8A96E
```

---

## Typography

| Role | Font | Weight | Size | Tracking |
|------|------|--------|------|----------|
| Display | Cormorant Garamond | 300 | 64–80px | −2px |
| Section heading | Cormorant Garamond | 300 | 32–40px | −0.5px |
| Subheading | Cormorant Garamond | 400 | 18–20px | 0 |
| Body | DM Sans | 300 | 15px | 0 / 1.75 lh |
| Section label | DM Mono | 500 | 10px | 2px uppercase |
| Caption / tag | DM Mono | 400 | 12–13px | 0.3px |

**Rules:**
- Sentence case always — no all-caps headings
- Display text: `--bella-ink` — never white, never accent
- Italic second lines on display and headings — creates rhythm without a second color
- Section labels: `var(--accent)` + `border-left: 1px solid var(--accent)` + `padding-left: 10px`
- Body: `--bella-mid` at 300 weight — light and editorial
- Never hardcode a hex value in a component — CSS variables only

### Font loading (CDN)

```html
<!-- Cormorant Garamond — weights 300, 400, 300italic, 400italic -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet" />
<!-- DM Sans — weights 300, 400, 500 -->
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
<!-- DM Mono — weights 400, 500 only -->
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

---

## Animation Stack

### Required

| Component | ReactBits URL | Key config | Location |
|-----------|--------------|------------|----------|
| SplashCursor | `/animations/splash-cursor` | **SPLAT_RADIUS: 0.12** (tighter than Vault — ink-like) · colors from `--accent` | Global |
| Silk | `/backgrounds/silk` | accent at 8% opacity · amplitude: 0.5 · speed: 0.3 · warm, tactile | Hero bg |
| BlurText | `/text-animations/blur-text` | duration: 700ms · fires once on mount | Hero display name |
| RotatingText | `/text-animations/rotating-text` | cycles `user.roles[]` · Cormorant italic style | Hero subtitle |
| FadeContent | `/animations/fade-content` | blur: true · 800ms · scroll-triggered once | All sections |

### Recommended

| Component | Config | Location |
|-----------|--------|----------|
| Particles | particleCount: 40 · very sparse · accent color · moveOnHover: true | Stack/Process section bg |

### Key difference from Vault
- Vault uses **Aurora** (dramatic, atmospheric) — Bella uses **Silk** (tactile, warm, subtle)
- Vault SplashCursor `SPLAT_RADIUS: 0.18` (fluid, wide) — Bella `SPLAT_RADIUS: 0.12` (precise, ink-like)
- Vault Particles count 60 — Bella Particles count 40 (sparser, like dust on paper)

### Rules
- All animations fire once — never repeat on scroll re-entry
- `prefers-reduced-motion`: all animations off, instant transitions
- Mobile: Silk amplitude halved · Particles count 20

---

## Layout Structure

### Navigation
- Transparent on load → `rgba(247,245,240,0.88)` + `backdrop-filter: blur(10px)` on scroll
- Left: `user.displayName` — Cormorant Garamond 400, 16px (serif wordmark, not sans)
- Right: nav links in DM Sans 300 — no badge on PRO tier
- Active: 1px underline in `var(--accent)`
- Border-bottom: `1px solid var(--bella-border)` when scrolled

### Sections

| Section | Layout |
|---------|--------|
| Hero | Split layout — display name + italic second line left · portrait image card right · Silk bg |
| Work | **Horizontal magazine rows** — large number left · title + desc center · image right (alternating) |
| About | Three-column — bio left (2col) · portrait center · stats right · Linen bg |
| Process / Stack | Sparse Particles bg · editorial paragraph in Cormorant italic · floating DM Mono skill tags |
| Contact | Single centered column · email in Cormorant italic at display size · DM Mono social links |

### Card / Row system
- Work rows: no card border — full-width horizontal rows with generous padding
- Row hover: background tints to `--accent-light`, accent line appears on the left
- Row image: on hover, image desaturates to accent tint (CSS `filter: saturate(0) sepia(0.3)` + accent color overlay)
- Inner cards (About stats, etc.): `--bella-surface`, `1px solid var(--bella-border)`, 10px radius
- No box-shadows except subtle hover glow: `box-shadow: 0 0 20px var(--highlight-glow)`

---

## UI Components

### Section labels
```css
.section-label {
  font-family: var(--bella-font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--accent);
  padding-left: 10px;
  border-left: 1px solid var(--accent);
  border-radius: 0;
}
```

### CTA buttons
- Primary: `background: var(--bella-ink)` · white text · 4px radius — **ink color, not accent** (accent is reserved for editorial highlights)
- Ghost: `border: 1px solid var(--bella-border-mid)` · `color: var(--bella-ink)` · transparent bg
- Hover: ghost border transitions to `var(--accent-border)`, color to `var(--accent)` — subtle shift, not dramatic

### Work rows (replaces Vault's project cards)
```
Row layout:
[ 01 ]  [ Project Title          ]  [ Image ]
        [ One-line description   ]
        [ Stack tags in DM Mono  ]
```
- Number: Cormorant Garamond 300, 48px, `--bella-mid`
- Title: Cormorant Garamond 400, 24px, `--bella-ink`
- Description: DM Sans 300, 14px, `--bella-mid`
- Stack tags: DM Mono 400, 11px, `var(--accent)` — no bg, no border
- Image: 40% of row width, 200px tall, object-fit cover — alternates left/right per row
- On hover: image desaturates + left accent border appears on the row

### Email link (Contact)
- Cormorant Garamond 300 italic, ~64px
- `color: var(--bella-ink)` default
- Hover: `color: var(--accent)` with `transition: color 0.25s ease`
- No underline by default — underline appears on hover only

---

## Differentiators vs Vault

| Dimension | Bella — PRO (this) | Vault — PRO |
|-----------|-------------------|-------------|
| Theme | Warm cream light · editorial | Near-black dark · atmospheric |
| Display font | Cormorant Garamond serif | Clash Display geometric |
| Body font | DM Sans + DM Mono | Satoshi + JetBrains Mono |
| Texture | Grain noise overlay · printed feel | None — clean digital |
| SplashCursor radius | 0.12 — tight, ink-like | 0.18 — wide, fluid |
| Hero bg | Silk — warm, slow, tactile | Aurora — dramatic, cinematic |
| Work layout | Horizontal magazine rows | Asymmetric card grid |
| About | 3-column · serif italic bio | 2-column · sans-serif bio |
| CTA primary | Ink fill — accent reserved for highlights | Accent fill |
| Contact | Serif italic display email | Geometric display email |
| Audience | Designers · art directors · photographers | Devs · engineers · motion artists |

---

## Voice & Copy

**Template description (gallery):**
A light, tactile portfolio that feels made by hand. Warm cream surfaces, serif editorial typography, and a single accent color that runs everything. Built for designers, art directors, and photographers who want their work to breathe.

**Short version (card):**
Dark is a vault — Bella is a canvas. Light, editorial, and completely yours.

**Category:** Light Editorial

**Rules:**
- Sentence case always — no all-caps headings
- Banned words: "passionate", "stunning", "seamless", "curated"
- DM Mono for all technical metadata — dates, stack tags, labels
- Cormorant italic for emotional or artistic emphasis within body copy
- Contact section: just the email. One availability line above it in DM Mono. Nothing else.

---

## Pre-launch Checklist

### Color injection
- [ ] `NEXT_PUBLIC_COLOR_ACCENT` falls back to `#C8A96E` when missing
- [ ] `NEXT_PUBLIC_COLOR_SECONDARY` falls back to `#F0EDE6` when missing
- [ ] `NEXT_PUBLIC_COLOR_HIGHLIGHT` falls back to `#C8A96E` when missing
- [ ] `isValidHex()` runs before any env var is used
- [ ] Invalid hex: warn in dev, silent fallback in prod
- [ ] `color-mix()` `@supports` fallback block in globals.css
- [ ] All 3 vars injected via `style` prop on `<html>` in layout.tsx
- [ ] Zero hex values hardcoded in any component file
- [ ] SplashCursor fluid color reads `--accent`
- [ ] Silk bg colorStops derived from `--accent` at 8% opacity
- [ ] Particles `particleColors` reads `--accent`
- [ ] Row hover glow reads `--highlight-glow`

### Design integrity
- [ ] Grain texture overlay present on `body::after` (SVG fractalNoise, 2.5% opacity)
- [ ] Cormorant Garamond italic used on second display name line
- [ ] Work section uses horizontal rows — not a card grid
- [ ] CTA primary uses `--bella-ink` fill — not accent
- [ ] About section has 3-column layout (bio · portrait · stats)
- [ ] Email in Contact is Cormorant Garamond italic at ~64px
- [ ] Nav left wordmark uses Cormorant Garamond serif — not DM Sans
- [ ] No box-shadows except `--highlight-glow` on hover

### Animation
- [ ] SplashCursor SPLAT_RADIUS is 0.12 — not 0.18
- [ ] Silk is used in hero — not Aurora
- [ ] `prefers-reduced-motion` disables all animations
- [ ] FadeContent fires once — not on scroll re-entry
- [ ] BlurText fires once on mount
- [ ] Mobile: Silk amplitude halved
- [ ] Mobile: Particles count 20 (not 40)
- [ ] SplashCursor touch tested on mobile

### General
- [ ] ZF badge absent on PRO plan (`plan === 'PRO'`)
- [ ] Nav Cormorant wordmark binds to `user.displayName` dynamically
- [ ] RotatingText reads `user.roles[]`
- [ ] Cormorant Garamond: weights 300, 400, 300italic, 400italic only
- [ ] DM Mono: weights 400, 500 only (subset)
- [ ] DM Sans: weights 300, 400, 500 only
- [ ] No `console.log` in production

---

## Data Structure

Identical to Vault — same `PortfolioData` interface, same `NEXT_PUBLIC_API_URL` pattern, same `public/mock-data.json` for local dev. No changes to types or fetching logic.

---

## Agents

| Agent | When to use |
|-------|-------------|
| `frontend-developer` | React components, row layout, animation wiring, env injection |
| `backend-developer` | Color preference storage, env var write on Vercel deploy |
| `ui-designer` | Row layout spec, hover states, mobile adaptation |
| `brand-designer` | Color system audits, grain texture, CSS variable consistency |
| `content-writer` | Section copy, placeholder text, error states |
| `code-reviewer` | Env validation, color-mix fallbacks, performance, grain overlay |
| `reality-checker` | GO / NEEDS WORK gate before shipping |