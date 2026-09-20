/* chingyawhao.github.io — theme, map hero, Sarah web-chat demo, scroll reveals. No dependencies beyond MapLibre. */
'use strict';

const TILES_DARK = 'https://tiles.openfreemap.org/styles/dark';
const TILES_LIGHT = 'https://tiles.openfreemap.org/styles/positron';
const MAP_CENTER = [101.6869, 3.139];
const MAP_ZOOM = 11.5;

const PINS = [
  { lngLat: [101.744, 3.089], label: 'Cheras', text: '3-bed condo · from RM480K' },
  { lngLat: [101.760, 3.150], label: 'Ampang', text: '2-bed serviced apt · from RM390K' },
  { lngLat: [101.651, 3.166], label: 'Mont Kiara', text: '3-bed condo · from RM1.2M' },
  { lngLat: [101.671, 3.128], label: 'Bangsar', text: '2-bed condo · from RM750K' },
  { lngLat: [101.717, 3.198], label: 'Setapak', text: '3-bed apartment · from RM320K' },
];

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
  ['sarah', "Done — Saturday, 3:00 PM. Amirah will confirm with you here. I've pinned both on your map 📍"],
];
const CHERAS_PIN = 0; // index into PINS; both listing cards target it

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
const DRIFT_STOPS = [[101.70, 3.15], [101.67, 3.12], [101.71, 3.12], [101.66, 3.16]];

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

  map = new maplibregl.Map({
    container: 'map',
    style: document.documentElement.dataset.theme === 'dark' ? TILES_DARK : TILES_LIGHT,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    attributionControl: { compact: true },
  });
  HANDLERS.forEach((h) => map[h].disable());
  map.getCanvas().tabIndex = -1;

  /* Pins are real <button>s so Enter/Space work natively. Popups are toggled by hand rather than
     via Marker.setPopup, which would double-fire on keyboard (its keypress + the synthetic click). */
  const popups = [];
  PINS.forEach(({ lngLat, label, text }) => {
    const el = document.createElement('button');
    el.className = 'pin';
    el.type = 'button';
    const popup = new maplibregl.Popup({ offset: 12, closeOnClick: false })
      .setLngLat(lngLat)
      .setHTML(`<b>${label}</b>${text}<small>Sample listing</small>`);
    popups.push(popup);
    el.addEventListener('click', () => {
      const open = popup.isOpen();
      popups.forEach((p) => p.remove());
      if (!open) popup.addTo(map);
    });
    new maplibregl.Marker({ element: el }).setLngLat(lngLat).addTo(map);
    el.setAttribute('aria-label', `${label}: ${text}`); // after addTo, which may set its own
  });

  /* Slow drift: ease between a few stops around the centre; stops while the user explores. */
  let drifting = !reducedMotion;
  let stop = 0;
  function drift() {
    if (!drifting) return;
    stop = (stop + 1) % DRIFT_STOPS.length;
    map.easeTo({ center: DRIFT_STOPS[stop], duration: 28000, easing: (t) => t, essential: true }); // essential: MapLibre would otherwise zero the duration under reduced motion and moveend would recurse synchronously
  }
  map.on('moveend', drift);

  /* Chat "View on map": open the pin's popup and bring it into the part of the map
     not covered by the hero panel; drift pauses so it stays put. */
  showPin = (i) => {
    popups.forEach((p) => p.remove());
    popups[i].addTo(map);
    drifting = false;
    map.easeTo({
      center: PINS[i].lngLat,
      padding: { bottom: Math.min(panel.offsetHeight, map.getContainer().clientHeight * 0.5) },
      duration: reducedMotion ? 0 : 1200,
      essential: true,
    });
  };

  function setExploring(on) {
    hero.classList.toggle('is-exploring', on);
    HANDLERS.forEach((h) => map[h][on ? 'enable' : 'disable']());
    map.getCanvas().tabIndex = on ? 0 : -1;
    panel.inert = on;
    explore.textContent = on ? 'Exit map' : 'Explore map';
    if (on) {
      drifting = false;
      map.stop();
      map.getCanvas().focus();
    } else {
      drifting = !reducedMotion;
      explore.focus();
      drift();
    }
  }
  explore.addEventListener('click', () => setExploring(!hero.classList.contains('is-exploring')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hero.classList.contains('is-exploring')) setExploring(false);
  });

  map.once('load', () => {
    hero.classList.add('is-live');
    explore.hidden = false;
    drift();
  });
  map.on('error', (e) => {
    /* Tile/style errors are non-fatal; only log so nothing else breaks. */
    console.warn('map', e && e.error);
  });
}

try { initMap(); } catch (e) { console.warn('map unavailable', e); }

/* ---------- Sarah chat ---------- */

const thread = $('thread');
const replay = $('replay');
let run = 0; // increments on each play so a stale timer chain exits early

function card({ title, area, spec, price, tag }) {
  const el = document.createElement('div');
  el.className = 'listing';
  const a = document.createElement('a');
  a.href = '#top';
  a.className = 'listing__map';
  a.textContent = 'View on map';
  a.addEventListener('click', () => showPin(CHERAS_PIN)); // the anchor itself does the scroll
  el.innerHTML = `<b>${title}</b><span>${area} · ${spec}</span><span class="listing__price">${price}<em>${tag}</em></span><small>Sample listing</small>`;
  if (map) el.append(a);
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
