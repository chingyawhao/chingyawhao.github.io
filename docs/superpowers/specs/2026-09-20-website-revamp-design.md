# chingyawhao.github.io revamp — design

Date: 2026-09-20

## Goal

Replace the 2018 React/Material-UI site with a one-page founder site for
investors and partners. Not a resume: no timeline, no skills grid, no CV
download. Editorial-minimal look. Zero build step so it still works untouched
in ten years.

## Decisions (already made)

- Audience: investors & partners. Founder/CTO story first.
- Look: editorial minimal. Off-white / near-black, one serif display face,
  system sans body, dark mode via `prefers-color-scheme`.
- Stack: plain HTML + CSS. No JS, no framework, no bundler, no `package.json`.
- Keep from old site: only the Ai Chan Chatbot link.
- Drop: avatar illustration, picker demo pages, DeviantArt, all favicon PNGs
  derived from the avatar, SPA 404 redirect trick.
- Contact: email (`chingyawhao14@gmail.com`), GitHub, LinkedIn. No phone.
- No resume PDF hosted (it contains the phone number).

## Files (the whole repo after this change)

```
index.html          the page
style.css           all styling
404.html            static not-found page, link home
favicon.svg         monogram, inline SVG, respects dark mode
favicon.ico         fallback for Safari / old browsers, generated from the SVG
apple-touch-icon.png 180×180, generated from the SVG
fonts/<display>.woff2  one self-hosted OFL serif (see Typography)
.gitignore          `.DS_Store`
docs/superpowers/   this spec and the plan
```

Everything else currently in the repo is deleted: `src/`, `webpack.config.js`,
`tsconfig.json`, `package.json`, `package-lock.json`, `*.bundle.js`,
`*.chunk.js`, hashed `.ttf`/`.svg`, `android-chrome-*.png`, `mstile-*.png`,
`favicon-*.png`, `safari-pinned-tab.svg`, `browserconfig.xml`,
`site.webmanifest`.

Deployment stays GitHub Pages serving `master` root. No Actions, no `gh-pages`
branch.

## Page structure

Single column, `max-width: 42rem`, generous vertical rhythm. Section order:

1. **Hero** — name as the only `h1`; role line "Co-founder & CTO, MyRumahBaru ·
   Kuala Lumpur"; one-paragraph positioning; inline links to email, GitHub,
   LinkedIn.
2. **Now** — MyRumahBaru. One paragraph on founding / pre-seed / what he owns,
   then four short items (Sarah, lead funnel, geospatial layer, semantic
   search). Items are a `<ul>` with a bold lead-in, not cards.
3. **Before** — Didian, MoneyLion, UTAR MIMOS Lab. Three short paragraphs,
   each starting with the company name in bold and the years in muted small
   text. Prose, not a timeline.
4. **Working with** — one paragraph-style inline list of the stack, grouped by
   ` · ` separators. Muted. Exists because partners evaluating technical fit
   look for it; kept to three lines.
5. **Recognition** — three awards as a `<ul>`; one line "Side project: Ai Chan
   Chatbot" linking to `https://ai-chan-chatbot.github.io/`.
6. **Footer** — email, GitHub, LinkedIn again, `© 2026 Ching Yaw Hao`.

Section headings are small caps / muted `h2`s, not big display type — the
display face is reserved for the name and pull-figures.

## Copy

Final copy lives in `index.html`; this is the source of truth for tone. Voice:
first person, plain, concrete numbers, no adjectives about himself.

**Hero positioning**
> I build consumer and marketplace products. Ten years in — five of them as
> the first engineer and later Head of Engineering at a proptech startup that
> grew to RM266M GDV — I now run product, engineering and AI at my own.

**Now — MyRumahBaru (2024–)**
> Co-founded MyRumahBaru in April 2024 and raised a USD 200K pre-seed. I built
> the product and engineering function from zero and own product engineering,
> geospatial infrastructure and our production LLM agent systems.

- **Sarah** — an AI WhatsApp agent that qualifies inbound leads and books
  agent appointments end to end. LangGraph, BullMQ, Redis and Postgres/PostGIS,
  wired to Meta click-to-WhatsApp ads and the WhatsApp Cloud API.
- **Lead funnel** — rebuilt with server-side conversion attribution and
  appointment instrumentation; traced failed appointments back to listing
  staleness and drove the data-quality work that followed.
- **Geospatial layer** — self-hosted map tiles (MapLibre, Protomaps/PMTiles)
  and a Nominatim instance for Malaysian address geocoding.
- **Search** — multilingual (EN/MS/ZH) semantic search over listings on
  pgvector/HNSW embeddings.

**Before**
- **Didian** (2018–2024) — First engineering hire. Chose and stood up every
  part of the stack from the first commit and owned all production systems for
  five and a half years, latterly as Head of Engineering leading a team of six
  across web and mobile. The platform scaled to RM266M GDV serving around 300
  agents across Malaysia.
- **MoneyLion** (2017–2018) — Software engineer. React and TypeScript in a
  large production codebase.
- **UTAR MIMOS Lab** (2016–2017) — Research assistant. Built the front end for
  DeepWood, a wood-species identification project with FRIM.

**Working with**
> TypeScript · React, React Native · Node.js · PostgreSQL, PostGIS, pgvector ·
> Redis, BullMQ · MapLibre, Protomaps, Nominatim, OpenStreetMap · LangGraph,
> MCP · DigitalOcean, AWS

**Recognition**
- e27 Luminaries 2021 — Breakthrough
- hack2hired 2017 — 1st runner-up, main hack; winner, mini and warm-up hacks
- e-Genting Programming Competition 2015 — Merit

Side project: [Ai Chan Chatbot](https://ai-chan-chatbot.github.io/)

## Typography & colour

- Display: one OFL serif, self-hosted as a single variable `woff2` in `fonts/`
  (candidate: Newsreader or Instrument Serif; picked at build time by eye).
  Used for the `h1` and nothing else large. `font-display: swap`.
- Body: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Fluid sizes via `clamp()`. Body 17–18px, line-height 1.6.
- Colours as custom properties on `:root`; redefined under
  `@media (prefers-color-scheme: dark)`. Light: `#faf9f6` bg / `#1a1a1a` text /
  `#6b6b6b` muted. Dark: `#121212` bg / `#ececec` text / `#9a9a9a` muted. One
  accent for links, underlined, no colour change on hover — just underline
  thickness. Contrast ≥ AA for text and muted text in both schemes.
- No animation. No hover effects beyond underline.

## Head / meta

`<title>Ching Yaw Hao</title>`, description meta, canonical
`https://chingyawhao.github.io/`, Open Graph title/description/url, viewport,
`theme-color` for both schemes, `<link rel="icon" href="favicon.svg">` with
`.ico` fallback, `apple-touch-icon`. A JSON-LD `Person` block with name, job
title, worksFor, sameAs (GitHub, LinkedIn) — ten lines, helps search.

## Accessibility

Semantic landmarks (`header`, `main`, `section` with `aria-labelledby`,
`footer`). Visible focus ring. Links have discernible text (no icon-only
links). Colour is never the only signal. Nothing moves.

## 404

Static page in the same style: "Nothing here." and a link to `/`. No redirect
script — there are no client-side routes any more.

## Verification

- `tidy -q -e index.html 404.html` (ships with macOS) reports no errors.
- Open in the browser pane at 375px and 1280px, light and dark: no horizontal
  scroll, readable, links work.
- All external links resolve (curl -I).

## Out of scope

Blog, analytics, contact form, multiple pages, resume download, deleting the
stale Dependabot branches on the remote (worth doing separately — they are
all against the removed `package.json`).
