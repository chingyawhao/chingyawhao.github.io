/* chingyawhao.github.io — theme, map hero, Sarah web-chat demo, scroll reveals. No dependencies beyond MapLibre. */
'use strict';

const TILES_DARK = 'https://tiles.openfreemap.org/styles/dark';
const TILES_LIGHT = 'https://tiles.openfreemap.org/styles/positron';
/* The four chapters of the story, in order. The hero map tours them; the story section links to them. */
const PINS = [
  { lngLat: [101.79428, 3.03981], org: 'UTAR MIMOS Lab', place: 'Sungai Long', when: '2016–2017', text: 'Research assistant. First code with real users.', zoom: 13.5 },
  { lngLat: [101.68762, 3.13666], org: 'MoneyLion', place: 'Q Sentral', when: '2017–2018', text: 'How an engineering team actually works.', zoom: 13.5 },
  { lngLat: [101.67461, 3.12028], org: 'Didian', place: 'KL Eco City · Strata Office', when: '2018–2024', text: 'A product from the ground up.', zoom: 15 },
  { lngLat: [101.67390, 3.11868], org: 'MyRumahBaru', place: 'KL Eco City · Mercu 2', when: '2024–', text: 'A company from nothing. Two hundred metres from the last job.', zoom: 16.5 },
];
const BOUNDS = PINS.reduce((b, p) => b.extend(p.lngLat), new (function () {
  /* tiny LngLatBounds stand-in so BOUNDS can be built before maplibregl loads */
  this.sw = [Infinity, Infinity]; this.ne = [-Infinity, -Infinity];
  this.extend = ([lng, lat]) => { this.sw = [Math.min(this.sw[0], lng), Math.min(this.sw[1], lat)]; this.ne = [Math.max(this.ne[0], lng), Math.max(this.ne[1], lat)]; return this; };
})());

/* Fixed script from the spec, verbatim. A Sarah turn is a list of parts: strings, or the CARDS array. */
const CARDS = [
  { title: 'Curvo Residence', area: 'Cheras', spec: '3 bed · 2 bath · 952–1,345 sqft', price: 'from RM520K', tag: 'New launch' },
  { title: 'Residensi Bukit Cheras', area: 'Cheras', spec: '3 bed · 2 bath · 1,050 sqft', price: 'RM468K', tag: 'Subsale' },
];
const SCRIPT = [
  ['sarah', "Hi! I'm Sarah 👋 Tell me what you're looking for in a home"],
  ['user', 'Looking to buy a 3-bedroom condo near an LRT, budget around 500k'],
  ['sarah', 'Got it — 3 bedrooms, near LRT, up to RM500K. Is this for your own stay or an investment?'],
  ['user', 'Own stay, small family'],
  ['sarah', "Then I'd weigh schools and a proper car park over rental yield. Which side of KL — Cheras/Ampang, or Setapak/Wangsa Maju?"],
  ['user', 'Cheras side'],
  ['sarah', 'Two that fit well:', CARDS, "Curvo is a touch over your number, but the developer is covering legal fees right now, so upfront it lands under. Want me to set up viewings with Amirah? She's the verified agent for both."],
  ['user', 'Yes, Saturday afternoon'],
  ['sarah', 'Done — Saturday, 3:00 PM at the Cheras gallery. Amirah will confirm with you here. See you there! 🏡'],
];

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

document.documentElement.classList.add('js');

/* ---------- theme ---------- */

let map = null;
let showPin = () => {}; // set by initMap: opens PINS[i]'s popup
const themeBtn = $('theme');

function applyTheme(theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  if (themeBtn) themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
  try { persist ? localStorage.setItem('theme', theme) : localStorage.removeItem('theme'); } catch (e) { /* private mode: ignore */ }
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.content = theme === 'dark' ? '#0b0b0c' : '#f6f6f7';
  });
  if (map) map.setStyle(theme === 'dark' ? TILES_DARK : TILES_LIGHT);
}

/* The OS setting always wins: a change clears any manual override and is followed live. */
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => applyTheme(e.matches ? 'dark' : 'light', false));

if (themeBtn) {
  themeBtn.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
  themeBtn.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
}

/* ---------- map hero ---------- */

const HANDLERS = ['scrollZoom', 'boxZoom', 'dragRotate', 'dragPan', 'keyboard', 'doubleClickZoom', 'touchZoomRotate'];
const LEG_MS = 6000;   // travel time between chapters
const DWELL_MS = 7000; // time spent on each chapter with its popup open

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) { return false; }
}

function initMap() {
  const hero = document.querySelector('.hero');
  const explore = $('explore');
  const panel = $('hero-panel');
  if (typeof maplibregl === 'undefined' || !hasWebGL() || !hero || !explore || !panel || !$('map')) return;

  /* Keep the map's centre of interest in the part not covered by the hero panel. */
  const mapEl = $('map');
  const pad = () => ({
    top: 72, left: 24, right: 24,
    bottom: Math.min(panel.offsetHeight + 24, mapEl.clientHeight * 0.55),
  });
  map = new maplibregl.Map({
    container: 'map',
    style: document.documentElement.dataset.theme === 'dark' ? TILES_DARK : TILES_LIGHT,
    bounds: [BOUNDS.sw, BOUNDS.ne],
    fitBoundsOptions: { padding: pad() },
    attributionControl: { compact: true },
  });
  HANDLERS.forEach((h) => map[h].disable());
  map.getCanvas().tabIndex = -1;
  /* Padding lives on the map, not on each camera call: MapLibre persists easeTo/fitBounds padding,
     so passing it per call would stack it on itself. */
  map.setPadding(pad());
  map.on('resize', () => map.setPadding(pad()));

  /* Pins are real <button>s so Enter/Space work natively. Popups are toggled by hand rather than
     via Marker.setPopup, which would double-fire on keyboard (its keypress + the synthetic click). */
  const popups = [];
  PINS.forEach(({ lngLat, org, place, when, text }) => {
    const el = document.createElement('button');
    el.className = 'pin';
    el.type = 'button';
    const popup = new maplibregl.Popup({ offset: 12, closeOnClick: false })
      .setLngLat(lngLat)
      .setHTML(`<b>${org}</b>${text}<small>${place} · ${when}</small>`);
    popups.push(popup);
    el.addEventListener('click', () => {
      const open = popup.isOpen();
      popups.forEach((p) => p.remove());
      if (!open) popup.addTo(map);
    });
    new maplibregl.Marker({ element: el }).setLngLat(lngLat).addTo(map);
    el.setAttribute('aria-label', `${org}, ${place}, ${when}`); // after addTo, which may set its own
  });

  /* Guided tour: visit each chapter in order, open its popup, dwell, then pull back to the overview.
     Timer-driven (not moveend-chained) so stopping it is one clearTimeout. */
  let touring = !reducedMotion;
  let leg = -1;
  let dwell = 0;
  function openPopupOnArrival(i) {
    const at = leg;
    map.once('moveend', () => { if (touring && leg === at) { popups.forEach((p) => p.remove()); popups[i].addTo(map); } });
  }
  function tour() {
    if (!touring) return;
    leg = (leg + 1) % (PINS.length + 1);
    popups.forEach((p) => p.remove());
    if (leg === PINS.length) {
      map.fitBounds([BOUNDS.sw, BOUNDS.ne], { duration: LEG_MS, essential: true });
    } else {
      map.easeTo({ center: PINS[leg].lngLat, zoom: PINS[leg].zoom, duration: LEG_MS, essential: true });
      openPopupOnArrival(leg);
    }
    dwell = setTimeout(tour, LEG_MS + DWELL_MS);
  }
  function stopTour() {
    touring = false;
    clearTimeout(dwell);
  }

  /* Story section "on the map" links: jump to that chapter and stay there. */
  showPin = (i) => {
    stopTour();
    popups.forEach((p) => p.remove());
    map.easeTo({ center: PINS[i].lngLat, zoom: PINS[i].zoom, duration: reducedMotion ? 0 : 1200, essential: true });
    map.once('moveend', () => { popups.forEach((p) => p.remove()); popups[i].addTo(map); });
  };

  function setExploring(on) {
    hero.classList.toggle('is-exploring', on);
    HANDLERS.forEach((h) => map[h][on ? 'enable' : 'disable']());
    map.getCanvas().tabIndex = on ? 0 : -1;
    panel.inert = on;
    explore.textContent = on ? 'Exit map' : 'Explore map';
    if (on) {
      stopTour();
      map.stop();
      map.getCanvas().focus();
    } else {
      touring = !reducedMotion;
      explore.focus();
      tour();
    }
  }
  explore.addEventListener('click', () => setExploring(!hero.classList.contains('is-exploring')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hero.classList.contains('is-exploring')) setExploring(false);
  });

  map.once('load', () => {
    hero.classList.add('is-live');
    explore.hidden = false;
    tour();
  });
  map.on('error', (e) => {
    /* Tile/style errors are non-fatal; only log so nothing else breaks. */
    console.warn('map', e && e.error);
  });
}

try { initMap(); } catch (e) { console.warn('map unavailable', e); }

document.querySelectorAll('[data-pin]').forEach((a) => {
  if (!map) { a.remove(); return; } // no map, no link
  a.addEventListener('click', () => showPin(+a.dataset.pin)); // the anchor itself scrolls to #top
});

/* ---------- Sarah chat ---------- */

const thread = $('thread');
const replay = $('replay');
let run = 0; // increments on each play so a stale timer chain exits early

function card({ title, area, spec, price, tag }) {
  const el = document.createElement('div');
  el.className = 'listing';
  el.innerHTML = `<b>${title}</b><span>${area} · ${spec}</span><span class="listing__price">${price}<em>${tag}</em></span><small>Sample listing</small>`;
  return el;
}

function bubble(i) {
  const [who, ...parts] = SCRIPT[i];
  const li = document.createElement('div');
  li.className = `msg msg--${who}`;
  const sr = document.createElement('span');
  sr.className = 'sr';
  sr.textContent = who === 'sarah' ? 'Sarah: ' : 'You: ';
  li.append(sr);
  parts.forEach((part) => {
    if (typeof part === 'string') {
      const p = document.createElement('p');
      p.textContent = part;
      li.append(p);
    } else {
      const wrap = document.createElement('div');
      wrap.className = 'listings';
      wrap.append(...part.map(card));
      li.append(wrap);
    }
  });
  return li;
}

function chip(i) {
  const li = document.createElement('div');
  li.className = 'chips';
  li.setAttribute('aria-hidden', 'true');
  const span = document.createElement('span');
  span.className = 'chip';
  span.textContent = SCRIPT[i][1];
  li.append(span);
  return li;
}

function typing() {
  const li = document.createElement('div');
  li.className = 'msg typing';
  li.setAttribute('aria-hidden', 'true');
  li.append(...[0, 1, 2].map(() => document.createElement('i')));
  return li;
}

function scrollThread() {
  thread.scrollTo({ top: thread.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
}

function play() {
  const id = ++run;
  thread.replaceChildren();
  replay.hidden = true;

  if (reducedMotion) {
    SCRIPT.forEach((_, i) => thread.append(bubble(i)));
    scrollThread();
    return;
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async () => {
    for (let i = 0; i < SCRIPT.length; i++) {
      const isSarah = SCRIPT[i][0] === 'sarah';
      if (isSarah) {
        const dots = typing();
        thread.append(dots);
        scrollThread();
        await wait(1100);
        if (id !== run) return;
        dots.remove();
      } else {
        await wait(600);
        if (id !== run) return;
        const c = chip(i);
        thread.append(c);
        scrollThread();
        await wait(250);
        c.firstChild.classList.add('is-on');
        await wait(400);
        if (id !== run) return;
        c.remove();
      }
      thread.append(bubble(i));
      scrollThread();
    }
    await wait(400);
    if (id === run) replay.hidden = false;
  })();
}

const chat = $('chat');
if (thread && replay && chat) {
  replay.addEventListener('click', () => { thread.setAttribute('aria-live', 'polite'); play(); });
  const chatObserver = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      chatObserver.disconnect();
      play();
    }
  }, { threshold: 0.4 });
  chatObserver.observe(chat);
}

/* ---------- scroll reveals ---------- */

const reveals = document.querySelectorAll('.reveal');
if (reducedMotion) {
  reveals.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  reveals.forEach((el) => io.observe(el));
}
