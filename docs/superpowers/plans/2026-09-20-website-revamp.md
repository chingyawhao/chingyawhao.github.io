# Website Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2018 React site with a one-page, zero-build HTML/CSS founder site served by GitHub Pages from `master` root.

**Architecture:** Three hand-written files (`index.html`, `style.css`, `404.html`) plus a favicon set and one self-hosted font. No JS, no `package.json`, no build. Everything else in the repo is deleted.

**Tech Stack:** HTML5, CSS (custom properties, `clamp()`, `prefers-color-scheme`), Instrument Serif (OFL, woff2). Tooling on this Mac only for asset generation: `rsvg-convert`, `magick`, `tidy`.

**Spec:** `docs/superpowers/specs/2026-09-20-website-revamp-design.md`

## Global Constraints

- No JavaScript on the page. No external requests except the self-hosted font.
- Copy is taken verbatim from the spec's **Copy** section.
- Contact shown: `chingyawhao14@gmail.com`, `https://github.com/chingyawhao`, `https://www.linkedin.com/in/chingyawhao`. No phone. No CV.
- Colours: light `#faf9f6` bg / `#1a1a1a` text / `#6b6b6b` muted; dark `#121212` / `#ececec` / `#9a9a9a`.
- Display face `Instrument Serif` on the `h1` only. Body is the system sans stack.
- No animation, no hover effect beyond underline thickness.
- Commit after every task with the `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` trailer.

---

### Task 1: Clear the old site

**Files:**
- Delete: `src/`, `webpack.config.js`, `tsconfig.json`, `package.json`, `package-lock.json`, `index.html`, `404.html`, `*.bundle.js`, `*.chunk.js`, `0d6c704126891b79c4bfc5358d16d457.ttf`, `f5dfd569f68fc51c8d9854e50efeb1a0.svg`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `apple-touch-icon.png`, `mstile-150x150.png`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico`, `safari-pinned-tab.svg`, `browserconfig.xml`, `site.webmanifest`
- Modify: `.gitignore`

**Interfaces:** Produces an empty repo root except `docs/` and `.gitignore`. Later tasks create files at root.

- [ ] **Step 1: Delete everything except docs and git metadata**

```bash
git rm -rq src webpack.config.js tsconfig.json package.json package-lock.json index.html 404.html \
  *.bundle.js *.chunk.js 0d6c704126891b79c4bfc5358d16d457.ttf f5dfd569f68fc51c8d9854e50efeb1a0.svg \
  android-chrome-192x192.png android-chrome-512x512.png apple-touch-icon.png mstile-150x150.png \
  favicon-16x16.png favicon-32x32.png favicon.ico safari-pinned-tab.svg browserconfig.xml site.webmanifest
rm -rf node_modules
printf '.DS_Store\n' > .gitignore
```

- [ ] **Step 2: Verify only docs remain**

Run: `ls -A`
Expected: `.git  .gitignore  docs`

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Revamp * Remove 2018 React site

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Favicon set

**Files:**
- Create: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`

**Interfaces:** Produces the three icon files referenced by `<link rel="icon">` / `<link rel="apple-touch-icon">` in Task 5.

- [ ] **Step 1: Write the SVG monogram (geometric "H", dark-mode aware)**

`favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <style>
    .bg{fill:#1a1a1a}.fg{fill:#faf9f6}
    @media (prefers-color-scheme:dark){.bg{fill:#ececec}.fg{fill:#121212}}
  </style>
  <rect class="bg" width="64" height="64" rx="12"/>
  <rect class="fg" x="17" y="15" width="8" height="34"/>
  <rect class="fg" x="39" y="15" width="8" height="34"/>
  <rect class="fg" x="17" y="29" width="30" height="6"/>
</svg>
```

- [ ] **Step 2: Rasterise the fallbacks**

```bash
rsvg-convert -w 180 -h 180 -b '#1a1a1a' favicon.svg -o apple-touch-icon.png
magick -background none favicon.svg -define icon:auto-resize=32,16 favicon.ico
```

- [ ] **Step 3: Verify**

Run: `file favicon.svg favicon.ico apple-touch-icon.png`
Expected: SVG image; MS Windows icon resource, 2 icons; PNG 180 x 180.

- [ ] **Step 4: Commit**

```bash
git add favicon.svg favicon.ico apple-touch-icon.png
git commit -m "Revamp * Monogram favicon set

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Self-hosted display font

**Files:**
- Create: `fonts/instrument-serif.woff2`

**Interfaces:** Produces the file `style.css` references in its `@font-face` (Task 4).

- [ ] **Step 1: Download (user approved: fontsource package via jsDelivr, 21 KB)**

```bash
mkdir -p fonts
curl -fsSL "https://cdn.jsdelivr.net/npm/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2" -o fonts/instrument-serif.woff2
```

- [ ] **Step 2: Verify**

Run: `file fonts/instrument-serif.woff2 && stat -f %z fonts/instrument-serif.woff2`
Expected: `Web Open Font Format (Version 2)` and `21032`.

- [ ] **Step 3: Commit**

```bash
git add fonts/instrument-serif.woff2
git commit -m "Revamp * Self-host Instrument Serif

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Stylesheet

**Files:**
- Create: `style.css`

**Interfaces:** Produces classes used by Tasks 5 and 6: `.wrap`, `.role`, `.lede`, `.links`, `.years`, `.muted`. Element selectors `h1`, `h2`, `p`, `ul`, `li`, `b`, `a`, `header.wrap`, `footer.wrap`, `section`.

- [ ] **Step 1: Write the stylesheet**

`style.css`:
```css
/* chingyawhao.github.io — one page, no build */

:root {
  --bg: #faf9f6;
  --text: #1a1a1a;
  --muted: #6b6b6b;
  --rule: #e6e3dc;
  color-scheme: light dark;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #121212;
    --text: #ececec;
    --muted: #9a9a9a;
    --rule: #2b2b2b;
  }
}

@font-face {
  font-family: "Instrument Serif";
  src: url("fonts/instrument-serif.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

* { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: clamp(1.0625rem, 1rem + 0.2vw, 1.125rem);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.wrap {
  max-width: 42rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

header.wrap { padding-top: clamp(4rem, 12vh, 8rem); }

h1 {
  font-family: "Instrument Serif", Georgia, serif;
  font-weight: 400;
  font-size: clamp(3rem, 2rem + 4vw, 5rem);
  line-height: 1;
  letter-spacing: -0.015em;
  margin: 0 0 0.75rem;
}

.role {
  color: var(--muted);
  margin: 0 0 2rem;
}

.lede {
  font-size: 1.15em;
  line-height: 1.5;
  margin: 0 0 2rem;
}

section { margin-top: clamp(3.5rem, 8vh, 5rem); }

h2 {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 1.25rem;
}

p {
  margin: 0 0 1rem;
  text-wrap: pretty;
}

ul {
  list-style: none;
  margin: 0 0 1rem;
  padding: 0;
}
li {
  margin: 0 0 1rem;
  text-wrap: pretty;
}

b { font-weight: 600; }

.years {
  color: var(--muted);
  font-size: 0.85em;
  font-variant-numeric: tabular-nums;
}

.muted { color: var(--muted); }

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.6em;
}
.links li { margin: 0; }
.links li + li::before {
  content: "·";
  color: var(--muted);
  margin-right: 0.6em;
}

a {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-decoration-color: var(--muted);
  text-underline-offset: 0.18em;
}
a:hover { text-decoration-thickness: 2px; }
a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
  border-radius: 2px;
}

footer.wrap {
  margin-top: 6rem;
  padding-top: 2rem;
  padding-bottom: 4rem;
  border-top: 1px solid var(--rule);
  font-size: 0.9em;
}
footer p { margin: 1rem 0 0; }
```

- [ ] **Step 2: Verify it parses (no CSS linter in stdlib — visual check happens in Task 7)**

Run: `grep -c "prefers-color-scheme" style.css`
Expected: `1`

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "Revamp * Stylesheet

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: The page

**Files:**
- Create: `index.html`

**Interfaces:** Consumes `style.css` classes from Task 4, icons from Task 2. Uses relative paths so it also opens from `file://`.

- [ ] **Step 1: Write index.html**

`index.html`:
```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ching Yaw Hao</title>
<meta name="description" content="Co-founder &amp; CTO at MyRumahBaru. Ten years building consumer and marketplace products in Malaysia — proptech, geospatial infrastructure and production LLM agents.">
<link rel="canonical" href="https://chingyawhao.github.io/">
<meta property="og:type" content="profile">
<meta property="og:title" content="Ching Yaw Hao">
<meta property="og:description" content="Co-founder &amp; CTO at MyRumahBaru. Ten years building consumer and marketplace products in Malaysia.">
<meta property="og:url" content="https://chingyawhao.github.io/">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#faf9f6">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#121212">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preload" href="fonts/instrument-serif.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="style.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ching Yaw Hao",
  "jobTitle": "Co-founder & CTO",
  "worksFor": {"@type": "Organization", "name": "MyRumahBaru"},
  "address": {"@type": "PostalAddress", "addressLocality": "Kuala Lumpur", "addressCountry": "MY"},
  "email": "mailto:chingyawhao14@gmail.com",
  "url": "https://chingyawhao.github.io/",
  "sameAs": ["https://github.com/chingyawhao", "https://www.linkedin.com/in/chingyawhao"]
}
</script>
</head>
<body>

<header class="wrap">
  <h1>Ching Yaw Hao</h1>
  <p class="role">Co-founder &amp; CTO, MyRumahBaru · Kuala Lumpur</p>
  <p class="lede">I build consumer and marketplace products. Ten years in — five of them as the first engineer and later Head of Engineering at a proptech startup that grew to RM266M GDV — I now run product, engineering and AI at my own.</p>
  <ul class="links">
    <li><a href="mailto:chingyawhao14@gmail.com">chingyawhao14@gmail.com</a></li>
    <li><a href="https://github.com/chingyawhao">GitHub</a></li>
    <li><a href="https://www.linkedin.com/in/chingyawhao">LinkedIn</a></li>
  </ul>
</header>

<main class="wrap">

  <section aria-labelledby="now">
    <h2 id="now">Now</h2>
    <p>Co-founded <a href="https://myrumahbaru.com">MyRumahBaru</a> in April 2024 and raised a USD 200K pre-seed. I built the product and engineering function from zero and own product engineering, geospatial infrastructure and our production LLM agent systems.</p>
    <ul>
      <li><b>Sarah</b> — an AI WhatsApp agent that qualifies inbound leads and books agent appointments end to end. LangGraph, BullMQ, Redis and Postgres/PostGIS, wired to Meta click-to-WhatsApp ads and the WhatsApp Cloud API.</li>
      <li><b>Lead funnel</b> — rebuilt with server-side conversion attribution and appointment instrumentation; traced failed appointments back to listing staleness and drove the data-quality work that followed.</li>
      <li><b>Geospatial layer</b> — self-hosted map tiles (MapLibre, Protomaps/PMTiles) and a Nominatim instance for Malaysian address geocoding.</li>
      <li><b>Search</b> — multilingual (EN/MS/ZH) semantic search over listings on pgvector/HNSW embeddings.</li>
    </ul>
  </section>

  <section aria-labelledby="before">
    <h2 id="before">Before</h2>
    <p><b>Didian</b> <span class="years">2018–2024</span> — First engineering hire. Chose and stood up every part of the stack from the first commit and owned all production systems for five and a half years, latterly as Head of Engineering leading a team of six across web and mobile. The platform scaled to RM266M GDV serving around 300 agents across Malaysia.</p>
    <p><b>MoneyLion</b> <span class="years">2017–2018</span> — Software engineer. React and TypeScript in a large production codebase.</p>
    <p><b>UTAR MIMOS Lab</b> <span class="years">2016–2017</span> — Research assistant. Built the front end for DeepWood, a wood-species identification project with FRIM.</p>
  </section>

  <section aria-labelledby="stack">
    <h2 id="stack">Working with</h2>
    <p class="muted">TypeScript · React, React Native · Node.js · PostgreSQL, PostGIS, pgvector · Redis, BullMQ · MapLibre, Protomaps, Nominatim, OpenStreetMap · LangGraph, MCP · DigitalOcean, AWS</p>
  </section>

  <section aria-labelledby="recognition">
    <h2 id="recognition">Recognition</h2>
    <ul>
      <li>e27 Luminaries 2021 — Breakthrough</li>
      <li>hack2hired 2017 — 1st runner-up, main hack; winner, mini and warm-up hacks</li>
      <li>e-Genting Programming Competition 2015 — Merit</li>
    </ul>
    <p class="muted">Side project: <a href="https://ai-chan-chatbot.github.io/">Ai Chan Chatbot</a></p>
  </section>

</main>

<footer class="wrap">
  <ul class="links">
    <li><a href="mailto:chingyawhao14@gmail.com">chingyawhao14@gmail.com</a></li>
    <li><a href="https://github.com/chingyawhao">GitHub</a></li>
    <li><a href="https://www.linkedin.com/in/chingyawhao">LinkedIn</a></li>
  </ul>
  <p class="muted">© 2026 Ching Yaw Hao</p>
</footer>

</body>
</html>
```

- [ ] **Step 2: Validate**

Run: `tidy -q -e index.html; echo "exit $?"`
Expected: no `Error:` lines; exit 0 or 1 (1 = warnings only; check none are about structure).

- [ ] **Step 3: Confirm the MyRumahBaru link resolves (it is not in the spec; drop the `<a>` if it 404s)**

Run: `curl -sIL https://myrumahbaru.com | grep -E "^HTTP" | tail -1`
Expected: `HTTP/2 200` (or 301→200).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Revamp * One-page founder site

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: 404 page

**Files:**
- Create: `404.html`

**Interfaces:** Consumes `style.css`. Uses absolute paths because GitHub Pages serves it at any unknown URL.

- [ ] **Step 1: Write 404.html**

`404.html`:
```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Not found · Ching Yaw Hao</title>
<meta name="robots" content="noindex">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#faf9f6">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#121212">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<main class="wrap" style="padding-top:clamp(4rem,12vh,8rem)">
  <h1>Nothing here.</h1>
  <p><a href="/">Back to the front page</a></p>
</main>
</body>
</html>
```

- [ ] **Step 2: Validate**

Run: `tidy -q -e 404.html; echo "exit $?"`
Expected: no `Error:` lines.

- [ ] **Step 3: Commit**

```bash
git add 404.html
git commit -m "Revamp * Static 404

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Verify in a browser

**Files:**
- Create: `.claude/launch.json` (dev-server config for the browser pane; not part of the site)

- [ ] **Step 1: Add a static server config**

`.claude/launch.json`:
```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "site",
      "runtimeExecutable": "python3",
      "runtimeArgs": ["-m", "http.server", "8765"],
      "port": 8765
    }
  ]
}
```

- [ ] **Step 2: Open the site in the browser pane** (`preview_start` name `site`) and check at 375×812 and 1280 wide, light and dark:
  - no horizontal scroll
  - `h1` renders in Instrument Serif (not Georgia fallback)
  - section headings are small uppercase muted
  - links row wraps cleanly on mobile
  - `/does-not-exist` shows the 404 page styled

- [ ] **Step 3: External links resolve**

```bash
for u in https://github.com/chingyawhao https://www.linkedin.com/in/chingyawhao https://ai-chan-chatbot.github.io/ https://myrumahbaru.com; do
  printf "%-45s %s\n" "$u" "$(curl -sIL -o /dev/null -w '%{http_code}' "$u")"
done
```
Expected: 200 for each (LinkedIn may return 999 to bots — that is LinkedIn's anti-scraper, not a broken link).

- [ ] **Step 4: Fix anything found, re-check, commit**

```bash
git add -A
git commit -m "Revamp * Verified in browser

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```
