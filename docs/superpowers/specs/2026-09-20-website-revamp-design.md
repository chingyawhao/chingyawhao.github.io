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
fonts/instrument-serif.woff2  one self-hosted OFL serif (see Typography)
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
> TypeScript · React, React Native, Flutter · Node.js · PostgreSQL, PostGIS, pgvector ·
> Redis, BullMQ · MapLibre, Protomaps, Nominatim, OpenStreetMap · LangGraph,
> MCP · DigitalOcean, AWS

**Recognition**
- e27 Luminaries 2021 — Breakthrough
- hack2hired 2017 — 1st runner-up, main hack; winner, mini and warm-up hacks
- e-Genting Programming Competition 2015 — Merit

Side project: [Ai Chan Chatbot](https://ai-chan-chatbot.github.io/)

## Typography & colour

- Display: Instrument Serif (OFL), regular weight only, self-hosted as one
  `woff2` (~30 KB) in `fonts/`, fetched once from the fontsource package.
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

---

# Revision 2 — "Show, don't tell" (2026-09-20, supersedes Look, Files, Page structure, Typography, Verification above)

The owner is a UI/UX person and v1 read as generic minimalism. v2 keeps the copy
and the zero-build rule but makes the page a working demo of what he builds.

## Still true

Copy section above is unchanged and remains the source of truth for text. No
framework, no bundler, no `package.json`. GitHub Pages from `master` root.
No CV, no phone. Editorial serif for the name only.

## Now different

- **JS allowed**: one vanilla `app.js`. One external dependency: MapLibre GL JS
  5.x pinned from jsDelivr (`https://cdn.jsdelivr.net/npm/maplibre-gl@5.24.0/dist/`).
- **Dark-first**. Light mode still supported via `prefers-color-scheme`, plus a
  visible toggle that persists to `localStorage`.
- **Motion is welcome**: scroll-driven reveals, chat typing, map drift, hover
  states. All gated by `prefers-reduced-motion`.

## Files

```
index.html  style.css  app.js  404.html
favicon.svg favicon.ico apple-touch-icon.png
fonts/instrument-serif.woff2
```

## Page structure

1. **Hero — live map.** Full-viewport MapLibre map of Kuala Lumpur, centre
   `[101.6869, 3.139]`, zoom ~11.5, slow drift (`easeTo` loop or bearing
   rotation), non-interactive by default (scroll passes through) with a small
   "explore" control that enables interaction. Style URL is a single constant:
   dark `https://tiles.openfreemap.org/styles/dark`, light
   `https://tiles.openfreemap.org/styles/positron`, swapped on theme change.
   Overlay: `h1` name, role line, hero positioning paragraph, contact links,
   caption "This map runs on the stack I built for MyRumahBaru — MapLibre,
   Protomaps." Five sample-listing pins with popups (data below). If MapLibre
   fails to load or WebGL is unavailable, the hero shows a static gradient and
   nothing else changes.
2. **Sarah — chat demo.** A phone frame containing a WhatsApp-style thread that
   auto-plays when scrolled into view (IntersectionObserver): typing indicator
   → message, ~900 ms cadence, then a "Replay" button. Beside it the Sarah copy
   from the spec. Script is fixed (below).
3. **Track record — numbers.** Didian as three stat tiles: `RM266M` GDV ·
   `~300` agents · `5½ yrs` first engineer → Head of Engineering. Under them
   one line each for MoneyLion and UTAR MIMOS Lab (copy from spec).
4. **Now — the other three items** (Lead funnel, Geospatial layer, Search) as
   a compact list beside or below the map/chat, copy from spec.
5. **Recognition + Working with** — compact.
6. **Footer** — links, ©.

## Fixed content for the demos

Sarah thread (lead = right/green bubbles, Sarah = left):

```
lead   Hi, I saw the ad for the new condo in Cheras. Is it still open for booking?
sarah  Hi! Yes it is 😊 I'm Sarah from MyRumahBaru. A few quick questions so I can match you with the right unit — what's your budget?
lead   Around 500k
sarah  Got it, up to RM500K. How many bedrooms are you looking for?
lead   3, for family
sarah  Noted — 3 bedrooms. Is this your first home purchase?
lead   Yes
sarah  Great, you may qualify for first-time buyer incentives. Would you like to visit the show unit this weekend?
lead   Saturday can
sarah  Saturday it is. 11 AM or 3 PM?
lead   3pm
sarah  Booked ✅ Saturday, 3:00 PM at the Cheras sales gallery with Amirah. She'll confirm with you tomorrow morning. See you there!
```

Map pins (`[lng, lat]`, label, popup):

```
[101.744, 3.089]  Cheras       3-bed condo · from RM480K
[101.760, 3.150]  Ampang       2-bed serviced apt · from RM390K
[101.651, 3.166]  Mont Kiara   3-bed condo · from RM1.2M
[101.671, 3.128]  Bangsar      2-bed condo · from RM750K
[101.717, 3.198]  Setapak      3-bed apartment · from RM320K
```
Popups carry a muted "sample listing" line.

## Build method

Three independent variants built in parallel from this spec, each a complete
`index.html` + `style.css` + `app.js`, then screenshotted for the owner to
choose from. The chosen one is promoted to the repo root.

## Verification

- Each variant loads with no console errors; map renders tiles; chat plays;
  toggle switches map style and page theme; reduced-motion disables autoplay
  drift and reveals.
- 375px and 1280px, light and dark, no horizontal scroll.
- With `maplibre-gl.js` blocked, the page still renders.

---

# Revision 3 — Sarah is a web chatbot (2026-09-20, supersedes the Sarah parts of Revision 2)

Owner correction: Sarah is the AI property advisor on myrumahbaru.com — a web
chat, not WhatsApp. Verified against the live site: greeting "Hi! I'm Sarah 👋
Tell me what you're looking for in a home", quick chips ("I want to buy…",
"I want to rent…", "Help me find a house"), a text box and an "Ask" button.
Positioning on the site: "Not a search engine. A conversation" — remembers the
whole conversation, asks before recommending, explains the neighbourhood, gives
opinionated recommendations, finds matches across new launches / subsale /
rental, shows them on a map, connects to verified agents for viewings.

## Copy (replaces the Sarah bullet in the Copy section)

- **Sarah** — the AI property advisor on myrumahbaru.com. Buyers say what they
  want in plain language; she asks before recommending, remembers the whole
  conversation, and turns matches into viewings with verified agents.
  LangGraph, BullMQ, Redis and Postgres/PostGIS.

The hero positioning, meta description and everything else are unchanged. All
mentions of WhatsApp, click-to-WhatsApp ads and the WhatsApp Cloud API are
removed from the page.

## Demo (replaces the phone frame)

A web chat widget, styled per variant but with this anatomy: header (avatar
circle with "S", "Sarah", muted "AI property advisor", green online dot);
scrollable message list; user turns appear as a **quick-reply chip being
chosen** (the chip highlights, then becomes a right-aligned user bubble);
Sarah turns show a typing indicator first; two **listing cards** appear inline
in one Sarah turn (title, area, beds/baths/sqft, price, a small "View on map"
link that scrolls to the hero and opens that pin's popup); an input bar at the
bottom with placeholder "Tell Sarah what you're looking for…" and an **Ask**
button (decorative — the demo is scripted; a muted line under the widget says
"Scripted demo. The real Sarah runs on myrumahbaru.com."). Auto-plays once when
40% visible; Replay button after the last turn; reduced-motion renders the full
thread instantly.

## Fixed script

```
sarah  Hi! I'm Sarah 👋 Tell me what you're looking for in a home
user   [chip] Looking to buy a 3-bedroom condo near an LRT, budget around 500k
sarah  Got it — 3 bedrooms, near LRT, up to RM500K. Is this for your own stay or an investment?
user   [chip] Own stay, small family
sarah  Then I'd weigh schools and a proper car park over rental yield. Which side of KL — Cheras/Ampang, or Setapak/Wangsa Maju?
user   [chip] Cheras side
sarah  Two that fit well:
       [card] Curvo Residence · Cheras · 3 bed · 2 bath · 952–1,345 sqft · from RM520K · New launch
       [card] Residensi Bukit Cheras · Cheras · 3 bed · 2 bath · 1,050 sqft · RM468K · Subsale
       Curvo is a touch over your number, but the developer is covering legal fees right now, so upfront it lands under. Want me to set up viewings with Amirah? She's the verified agent for both.
user   [chip] Yes, Saturday afternoon
sarah  Done — Saturday, 3:00 PM. Amirah will confirm with you here. I've pinned both on your map 📍
```

Both listing cards' "View on map" target the Cheras pin `[101.744, 3.089]`.
Cards are sample data and say so in a muted line.

## Also in this revision

- Variant C: `[hidden] { display: none !important; }` — the "Done exploring"
  button was visible at load because `.btn { display: flex }` beat the `hidden`
  attribute.

---

# Revision 4 — MRB is a team (2026-09-20, copy only)

Owner correction: MyRumahBaru is a team; the page must not read as if he built
the company alone. Rule: **"we" for anything the company did; "I" only for
what he personally owns as CTO.** These replace the earlier copy verbatim.

**Hero positioning**
> I build consumer and marketplace products. Ten years in — five of them as
> the first engineer and later Head of Engineering at a proptech startup that
> grew to RM266M GDV — I now lead product, engineering and AI at MyRumahBaru,
> which I co-founded in 2024.

**Now — MyRumahBaru**
> We started MyRumahBaru in April 2024 and raised a USD 200K pre-seed. The
> team built the product from zero; I own product engineering, geospatial
> infrastructure and our production LLM agent systems.

**Hero map caption**
> This map runs on MyRumahBaru's stack — MapLibre, Protomaps.

**Didian stat-tile labels** (where a variant uses them)
> RM266M — GDV on the platform we built at Didian
> ~300 — agents served across Malaysia
> 5½ yrs — first engineer → Head of Engineering

The four "Now" items (Sarah per Revision 3, Lead funnel, Geospatial layer,
Search) stay as subject-less fragments after their bold lead-in, so they claim
neither "I" nor "we". Under-the-hood / "Also at MyRumahBaru" style section
labels are fine. Any remaining "I built … for MyRumahBaru" phrasing anywhere
on the page becomes "we built" or is made subject-less.

---

# Revision 5 — The story replaces "Before" (2026-09-20, copy only)

The Track record section is now the owner's growth narrative — the story he
tells when introducing himself professionally — instead of three resume
paragraphs. Stat tiles stay, under the Didian beat.

**Eyebrow:** The story · 2015–
**Heading:** Each move was the next thing to learn

> I make career decisions on one question: where will I grow fastest?
>
> **University** — Hackathons and open source were how I tested whether my
> skills held up outside coursework. A research assistantship at UTAR's MIMOS
> Lab, building the front end for DeepWood with FRIM, was the first time my
> code had real users.
>
> **MoneyLion** (2017–2018) — I joined to learn how an engineering team
> actually works: agile process, code review, shipping inside a large
> production codebase.
>
> **Didian** (2018–2024) — The next step was building a product from the
> ground up. As the first engineering hire I chose the stack, owned the
> product, ran the analytics and iterated on what the numbers said. By the
> end: five and a half years, a team of six, RM266M GDV, around 300 agents.
>
> [stat tiles: RM266M · ~300 · 5½ yrs]
>
> **MyRumahBaru** (2024–) — After owning someone else's product, the only
> thing left to learn was building a company from nothing. Everything before
> this was practice for it.

The last beat deliberately lands on MyRumahBaru rather than implying a next
step, so "I prioritise growth" does not read as "I'll leave when I stop
learning."

---

# Revision 6 — The map shows where he worked (2026-09-21)

Owner question: "what's the purpose of the map as the hero?" Sample listings
were decoration. The map is now the story's other half: one pin per chapter,
and the hero tours them in order.

## Pins (`[lng, lat]`, geocoded from OSM)

```
0  UTAR MIMOS Lab   Sungai Long                 2016–2017  [101.79428, 3.03981]  zoom 13.5
1  MoneyLion        Q Sentral                   2017–2018  [101.68762, 3.13666]  zoom 13.5
2  Didian           KL Eco City · Strata Office 2018–2024  [101.67461, 3.12028]  zoom 15
3  MyRumahBaru      KL Eco City · Mercu 2       2024–      [101.67390, 3.11868]  zoom 16.5
```

Popup: org (bold), one-line beat, muted "place · years". Strata Office and
Mercu 2 are ~200 m apart; the Didian leg's zoom shows both, the MRB leg's
popup says so ("Two hundred metres from the last job").

## Tour

Initial view fits all four pins above the hero panel. Then, timer-driven:
ease to pin 0 → open popup → dwell → pin 1 → … → pin 3 → pull back to the
overview → repeat. 6 s travel, 7 s dwell. Explore mode and the story links
stop it; leaving explore restarts it. Reduced motion: overview only, popups
on click.

Map padding is set once on the map (`setPadding`, refreshed on resize) so
the hero panel never covers the point of interest. It is **not** passed per
camera call — MapLibre persists easeTo/fitBounds padding, and passing it
again stacks it (the "cannot fit within canvas" warning).

## Story links

Each beat in the story section carries an "on the map" link (`data-pin`)
that scrolls to the hero and jumps to that chapter. Links are removed when
the map failed to initialise.

## Removed

Sample-listing pins, the chat cards' "View on map" links, and the map-stack
caption. Sarah's last line is now "Done — Saturday, 3:00 PM at the Cheras
gallery. Amirah will confirm with you here. See you there! 🏡". Hero caption:
"Ten years, four addresses. Each pin is a chapter of the story below."

Popups have their arrow back (variant A had hidden the tip); the bubble's
border became an outer ring so the arrow reads as part of the bubble.

## Revision 6 addenda (2026-09-21)

- **Phones**: the hero is a 56svh map band. The card stays a card, overlapping
  the band's bottom edge by 2.5rem; the hero itself is transparent so `main`'s
  dot grid runs right up to the map (owner: "the dotted background should
  continue to where the map ends"). Attribution sits above the card. Popups are
  kept clear of the Explore button via top padding.
- **Camera rules** (from review): padding is set on the map, then the overview
  is fitted once against it; the constructor's `fitBoundsOptions` is not used
  (it would fit against zero padding and the later `setPadding` would shift
  the view). One `goTo()` path with an arrival token: `map.stop()` → register
  `once('moveend')` → `easeTo`, because MapLibre fires the previous ease's
  `moveend` synchronously inside `stop()` and finishes a 0 ms ease inside
  `easeTo` itself. Popups use `focusAfterOpen: false` so the tour never steals
  focus; story links focus the pin instead (announces "org, place, when").
  Resize replays the interrupted leg. The map reveals on `style.load`, not
  `load`, so tiles paint progressively.
- **Popup arrow**: an outlined rotated square clipped to its outward half, so
  the bubble's ring continues around the arrow in both themes.
