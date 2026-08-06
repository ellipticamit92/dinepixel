# Handoff: Plate — AI Digital Menu Platform

## Overview
Plate is a platform where a cafe/restaurant owner uploads their existing paper menu (photo or PDF) and an AI agent turns it into a live, mobile-friendly digital menu page — auto-categorized into **Veg / Non-Veg** — complete with a QR code and a shareable (WhatsApp) link. This bundle contains three design references:

- **Plate - Menu Platform** — the owner-facing web app: marketing **landing page** + the **builder** flow (Upload → AI Review → Publish) with a live phone preview.
- **The Bistro Menu** — a standalone example of the **customer-facing** menu page (what a diner sees after scanning the QR).
- **MELT Menu** — an earlier customer-facing menu concept (smash-burger brand), kept for reference.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing the intended look and behavior. They are **not production code to copy directly**. They are authored as "Design Components" (a streaming HTML prototype format) and include a small runtime (`support.js`) and an `image-slot.js` web component used only for the drag-and-drop photo placeholders in the prototype.

Your task is to **recreate these designs in the target codebase's environment** (React, Vue, SwiftUI, native, etc.) using its established patterns, component library, and state management. If no environment exists yet, choose the most appropriate stack for the product (a React + TypeScript SPA is a natural fit) and implement there. Do not ship the HTML prototypes or their runtime.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, radii, shadows, and interactions are final and intended to be matched closely. The one deliberate placeholder is the QR code (a stylized grid) — replace it with a real QR generated from the published menu URL. Food images are empty drop-slots — wire them to real uploaded/served images.

---

## Visual Language

The entire product uses a **soft neumorphic** (soft-UI) system on a single warm background color. Surfaces are the *same* color as the page; depth comes only from a paired light/dark shadow. There are three surface states:

- **Raised** (default cards, buttons): `box-shadow: 6px 6px 14px <dark>, -6px -6px 14px <light>`
- **Raised small** (chips, small buttons, rows): `box-shadow: 4px 4px 10px <dark>, -4px -4px 10px <light>`
- **Inset / pressed** (active tab, active chip, input wells, selected state): `box-shadow: inset 3px 3px 7px <dark>, inset -3px -3px 7px <light>`

Active/selected controls use the **inset** state; idle ones use **raised**. This is the single most important rule to reproduce the look.

Colors are authored in **oklch**. Hex equivalents are given below for convenience (approximate — prefer the oklch values if the target supports them).

---

## Design Tokens

### Colors — Plate app (warm theme)
| Token | oklch | ~hex | Use |
|---|---|---|---|
| Surface / page bg | `oklch(0.93 0.014 82)` | `#e7e0d5` | Everything — page and all cards |
| Preview inner bg | `oklch(0.94 0.014 82)` | `#eae3d8` | Phone screen / nested surfaces |
| Card inner (customer menu) | `oklch(0.95 0.012 84)` | `#ece6dc` | Inner cards on the menu |
| Shadow dark | `oklch(0.85 0.02 72)` | `#cfc6b6` | Neumorphic dark side |
| Shadow dark (deeper) | `oklch(0.82 0.04 72)` | `#c3b7a0` | Larger elevations |
| Shadow light | `oklch(0.99 0.008 88)` | `#fdfbf6` | Neumorphic light side |
| Accent (primary/orange) | `oklch(0.62 0.17 42)` | `#d2662f` | Primary buttons, prices, active accents |
| Accent pressed text | `oklch(0.5 0.14 45)` | `#a5622f` | Accent text on inset buttons |
| Ink / heading | `oklch(0.24 0.02 60)` | `#3a352d` | Headings |
| Ink secondary | `oklch(0.46 0.02 60)` | `#726a5e` | Body text |
| Muted | `oklch(0.55–0.6 0.03 60)` | `#8b8375` | Labels, captions |
| Veg green | `oklch(0.5 0.14 150)` | `#3f8c53` | Veg mark/tag |
| Non-Veg red | `oklch(0.55 0.19 25)` | `#c0472f` | Non-Veg mark/tag |
| Success/publish green | `oklch(0.62 0.14 150)` | `#52a86a` | "Done", WhatsApp, live badge |
| Dark button | `oklch(0.28 0.02 60)` | `#453f36` | "Copy" button, high-contrast CTA |

### Colors — The Bistro (customer menu, cool theme)
| Token | oklch | ~hex | Use |
|---|---|---|---|
| Page bg | `oklch(0.92 0.025 295)` | `#e4dced` | Menu background (lavender) |
| Phone bezel | `oklch(0.28 0.05 295)` | `#332a44` | Device frame |
| Shadow dark | `oklch(0.82 0.04 295)` | `#c6bdd6` | Neumorphic dark |
| Shadow light | `oklch(0.98 0.015 300)` | `#f8f4fb` | Neumorphic light |
| Accent purple | `oklch(0.55 0.16 295)` | `#7b5bc4` | Badges, cart, active chip text |
| Price purple | `oklch(0.55 0.18 292)` | `#7a54cf` | Prices |
| Veg green | `oklch(0.42 0.12 150)` | `#357045` | Veg tag |
| Spicy red | `oklch(0.52 0.17 30)` | `#b0492e` | Spicy tag |

### Typography
- **Plate app**: `Anton` (display headings — hero, section titles, numbers), `Barlow` (body), `Barlow Semi Condensed` 600/700 (buttons, item names, labels). Google Fonts.
- **The Bistro menu**: `Fraunces` 500/600/700 (headings, italic tagline), `Barlow` (body/buttons). Google Fonts.
- Scale: hero display 60px (Anton) / 30px (Fraunces); section titles 24–38px; item name 16–17px; body 13–16px; labels/captions 10–12px uppercase with 0.4–1.4px letter-spacing.

### Radii
- Large surfaces / phone screen: `28–42px`
- Cards: `16–24px`
- Buttons / chips / inputs: `10–16px`
- Small photo thumbs: `11–15px`
- Pills / tags: `999px`

### Spacing
- Page gutters: 40px desktop (landing/app), 14–22px inside phone.
- Card padding: 14–30px. Gaps between cards: 9–22px (flex/grid `gap`).
- Two-column app workspace: `grid-template-columns: 1fr 380px; gap: 32px; max-width: 1180px`.

---

## Screens / Views

### 1. Landing page (`view === 'landing'`)
**Purpose:** Explain the product and push the owner into the builder.

**Layout (top → bottom), centered `max-width:1120–1180px`:**
- **Sticky top nav**: logo (rotated "P" tile, raised) + wordmark; right side Home / Builder toggle buttons (active = inset) + orange "Get started free" button.
- **Hero**: two columns `1fr 360px`. Left: pill badge ("AI-powered · no typing required", inset), `Anton` 60px headline with orange accent word, 18px subhead, primary CTA "Build my menu" + "Free to start / No card needed", and a row of 3 stats (`2,400+ menus`, `20s avg build`, `0 reprints`). Right: a **floating phone mockup** (see below), `animation: plFloat 5s ease-in-out infinite` (translateY 0 → -10 → 0).
- **How it works**: centered eyebrow + `Anton` 38px title; 3-column grid of raised cards, each with an inset number tile, title, body.
- **Features**: 2-column grid of raised cards; each has a tinted icon tile + title + body. Four features: Reads any format, Auto Veg/Non-Veg, Edit price & ingredients, QR + link instantly.
- **Pricing**: 3-column grid. Starter (Free), **Pro (₹299/mo, "Most popular", card is INSET to stand out)**, Chain (₹999/mo). Each lists checkmark features + a CTA that enters the builder.
- **Final CTA**: full-width inset panel, `Anton` 42px headline + CTA.
- **Footer**: © 2026 Plate · Privacy / Terms / Contact.

**Floating phone mockup (landing):** a complete mini customer-menu:
- Hero image slot with dark gradient, ♡ and ⤴ glass icons top-right, "Bloom Cafe / ◉ Downtown District / ★ 4.9 (2k+)" bottom.
- Section heading (`Signature Veg` / `Signature Non-Veg`, driven by the toggle).
- One **featured card** ("★ Popular this week" pill, veg/nonveg mark, name, price, description, inset "＋ Add to Order").
- Two **item rows** (photo thumb, name, price, description, veg/nonveg mark, raised "+").
- **Pinned bottom Veg / Non-Veg segmented toggle** (active side inset). Toggling swaps the whole menu dataset (heading + featured + rows).

### 2. Builder (`view === 'app'`)
Shared: a **step indicator** (Upload → AI Review → Publish; active step pill is inset, completed step dots are green) above a two-column workspace. **Left** = step content; **right** = a sticky **live preview phone** ("Live preview" label with a pulsing dot).

**Step: Upload (`step === 'upload'`)**
- `Anton` headline, subhead, then a large **inset drop-well** (280px, holds the `image-slot`) reading "Drop your menu photo or PDF here".
- Orange "Generate my menu with AI" button + "Takes about 20 seconds".
- Three raised value-prop cards.
- Preview phone shows an **empty state** ("Your live menu will appear here once AI reads your upload").

**Step: Processing (`step === 'processing'`, transient ~2.6s)**
- Headline "Reading your menu…". The uploaded image in an inset frame with a **scan line** (`animation: plScan 1.6s ease-in-out infinite alternate`, a glowing 3px orange bar sweeping top↔bottom) + faint orange overlay.
- A list of "detected" dishes popping in staggered (`animation: plPop 0.4s both`, `animation-delay` 0/0.28/0.56…s), each showing a veg/nonveg dot, name, tag, price.
- Triggered from Upload's Generate button; auto-advances to Review via `setTimeout`.

**Step: Review (`step === 'review'`)**
- Header: "Review & tweak", count of dishes, and Veg/Non-Veg totals.
- Scrollable list (`max-height:460px`) of dish rows, each raised (inset while being edited). Row = a square **veg/nonveg toggle button** (tap flips category — border+dot switch green↔red), name, ingredient summary (uppercase), price, and an **Edit** button (raised → inset when open).
- **Expanded editor** (when a row is being edited): a **Price** number field in an inset well (₹ prefix), and an **Ingredients** editor — existing ingredients as raised removable chips (× removes), plus an inset text input + round orange "+" to add (Enter also adds). A green "Done" collapses it.
- Bottom: orange "Publish my menu" + raised "Start over".
- Preview phone reflects edits live.

**Step: Published (`step === 'published'`)**
- Inset "Live & published" badge, headline, subhead.
- **QR card** (raised): a 23×23 grid QR **placeholder** in an inset frame with three finder squares + pseudo-random modules, "Scan at the table" label, raised "Download QR" button. **Replace with a real QR of the menu URL.**
- **Shareable link** card: inset link field (`plate.menu/bloom-cafe`) + dark "Copy" button; green "Share on WhatsApp" button; raised "Edit menu items" (→ back to Review).

**Live preview phone (builder, all steps):** same rich layout as the landing phone — hero (Bloom Cafe), **Veg / Non-Veg tabs** (active inset), a featured "Popular this week" card (first item of the active category) with "＋ Add to Order", then the remaining items as rows. Driven by real builder state (dishes, prices, categories update instantly).

### 2b. Auth — Login / Register (`view === 'auth'`, `authMode: 'login' | 'register'`)
**Purpose:** owner sign-in / sign-up. Opened from nav "Sign in" (login) and "Get started free" (register). Two-column: left brand panel (contextual badge, `Anton` headline, perks checklist — copy changes per mode); right form card (raised) with an **inset Sign in / Register tab toggle**, inset input wells (Register adds a "Cafe / Restaurant name" field; Login adds Remember-me checkbox + "Forgot password?"), orange primary CTA, Google/Apple social buttons, and a switch link. Submitting/CTA enters the builder (`view = 'app'`).

### 3. The Bistro Menu (customer-facing example)
**Purpose:** what a diner sees after scanning the QR / opening the link. Rendered inside a phone frame (lavender/purple neumorphic theme).
- **Status bar** ("9:41 · Customer Menu").
- **Hero**: food image, gradient, ↩/♡/⤴ glass icons, "The Bistro", "◉ Downtown Culinary District", "★ 4.9 (2k+ reviews)" pill.
- **Category chips**: Burgers (active, inset), Pizzas, Sides, Beverages.
- **Search well** (inset) with magnifier, "Search menu…".
- **Signature Burgers**: raised cards — square photo thumb (optional "CHEF'S CHOICE" badge), name (`Fraunces`), price (purple), description, veg/spicy tags, raised "+". Items: *Truffle Umami Burger* $18.50 (Chef's, veg+spicy), *Spicy Crispy Chicken* $15.00 (spicy).
- **Artisanal Pizzas**: a large **featured card** — image with "★ POPULAR THIS WEEK" pill, *Burrata & Prosciutto* $22.00, description, full-width raised "＋ Add to Order"; then a second row card *Mediterranean Garden* $19.00 (Vegetarian).
- **Footer**: "MENU · TECH-POWERED EXPERIENCE" eyebrow + italic `Fraunces` tagline "Dedicated to the art of fresh flavors since 2012."
- **Floating bottom nav** (raised bar): Menu (active, purple), Saved, a **raised purple cart button** with a red count badge ("6"), Table, Profile.

---

## Interactions & Behavior
- **View toggle**: top-nav Home/Builder and every CTA switch `view` between `landing` and `app`.
- **Builder flow**: Upload → (Generate) → Processing → (auto after ~2.6s) → Review → (Publish) → Published. "Edit menu items" returns Published → Review. "Start over" resets to Upload and clears edits.
- **Flip Veg/Non-Veg**: tapping a review row's square toggle flips that dish's category; totals and the preview update immediately.
- **Edit price**: number input writes back to the dish; preview price updates live.
- **Edit ingredients**: add (button or Enter) / remove (× chip); ingredient summary and preview update.
- **Veg/Non-Veg tabs & toggles**: landing phone toggle swaps a static demo dataset; builder preview tabs filter real dishes by category. Active = inset, idle = raised.
- **Animations**: `plFloat` (phone bob, 5s), `plScan` (processing scan bar, 1.6s alternate), `plPop` (detected rows, 0.4s staggered), `plPulse` (live-preview dot, 1.8s). Easings as in files; keep durations.
- **Hover/active**: reproduce with the codebase's conventions; the key affordance is raised→inset on press/active.

## State Management
State variables (from the prototype's logic class):
- `view`: `'landing' | 'app'`
- `step`: `'upload' | 'processing' | 'review' | 'published'`
- `items`: array of dishes `{ id, name, type, cat: 'veg'|'nonveg', price:number, ingredients: string[] }` — null until first edit (falls back to a seed list of 15 dishes)
- `previewTab`: `'veg' | 'nonveg'` (builder preview filter)
- `landingTab`: `'veg' | 'nonveg'` (landing phone demo toggle)
- `editingId`: id of the dish whose editor is open (or null)
- `drafts`: `{ [dishId]: string }` in-progress "add ingredient" text per row

Transitions: Generate sets `processing` then a timer sets `review`; Publish sets `published`; flip/price/ingredient edits map over `items` immutably; reset clears `items`, `editingId`, `previewTab`.

Data requirements in production: real OCR/vision AI to extract dishes+prices+veg/nonveg from the upload; persistence of the menu; real QR generation from the published URL; image uploads per dish; WhatsApp share intent; owner auth.

## Assets
- **Fonts** (Google Fonts): Anton, Barlow, Barlow Semi Condensed, Fraunces.
- **Icons**: currently simple Unicode glyphs (♡ ⤴ ◉ ★ ✦ ▤ ◔ 🛒 ✓ ＋). Replace with the codebase's icon set (e.g. Lucide/SF Symbols).
- **Food images**: empty drag-drop slots in the prototype (`image-slot` web component). In production these are owner-uploaded / served images. No proprietary imagery is included.
- **QR**: placeholder grid — generate a real QR in production.
- No Anthropic brand assets are used.

## Files
In this bundle:
- `Plate - Menu Platform.dc.html` — landing + builder (primary).
- `The Bistro Menu.dc.html` — customer-facing menu example.
- `MELT Menu.dc.html` — earlier customer-menu concept (reference).
- `image-slot.js`, `support.js` — prototype runtime/components only; **do not port** — they exist to make the HTML prototype run. Reproduce their effect (image upload, component rendering) with the target stack.

> Note: `.dc.html` files are streaming-HTML prototypes. To simply view them, open in a browser. To read the structure, the markup is standard HTML with inline styles; the logic (state + handlers) is in the `<script>` class near the bottom of each file.
