/* chingyawhao.github.io — theme, map hero, Sarah chat, scroll reveals. No dependencies beyond MapLibre. */
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

/* Fixed script from the spec, verbatim. */
const SCRIPT = [
  ['lead', 'Hi, I saw the ad for the new condo in Cheras. Is it still open for booking?'],
  ['sarah', "Hi! Yes it is 😊 I'm Sarah from MyRumahBaru. A few quick questions so I can match you with the right unit — what's your budget?"],
  ['lead', 'Around 500k'],
  ['sarah', 'Got it, up to RM500K. How many bedrooms are you looking for?'],
  ['lead', '3, for family'],
  ['sarah', 'Noted — 3 bedrooms. Is this your first home purchase?'],
  ['lead', 'Yes'],
  ['sarah', 'Great, you may qualify for first-time buyer incentives. Would you like to visit the show unit this weekend?'],
  ['lead', 'Saturday can'],
  ['sarah', 'Saturday it is. 11 AM or 3 PM?'],
  ['lead', '3pm'],
  ['sarah', "Booked ✅ Saturday, 3:00 PM at the Cheras sales gallery with Amirah. She'll confirm with you tomorrow morning. See you there!"],
];

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

document.documentElement.classList.add('js');

/* ---------- theme ---------- */

let map = null;
const themeBtn = $('theme');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeBtn) themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
  try { localStorage.setItem('theme', theme); } catch (e) { /* private mode: ignore */ }
  if (map) map.setStyle(theme === 'dark' ? TILES_DARK : TILES_LIGHT);
}

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
    map.easeTo({ center: DRIFT_STOPS[stop], duration: 28000, easing: (t) => t, essential: false });
  }
  map.on('moveend', drift);

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
  explore.hidden = false;
  explore.addEventListener('click', () => setExploring(!hero.classList.contains('is-exploring')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hero.classList.contains('is-exploring')) setExploring(false);
  });

  map.once('load', () => {
    hero.classList.add('is-live');
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

function stamp(i) {
  const m = 42 + i; // 10:42 onwards, one minute per message
  return `10:${m}`;
}

function bubble(i) {
  const [who, text] = SCRIPT[i];
  const li = document.createElement('li');
  li.className = `msg msg--${who}`;
  const sr = document.createElement('span');
  sr.className = 'sr';
  sr.textContent = who === 'sarah' ? 'Sarah: ' : 'Lead: ';
  const t = document.createElement('time');
  t.textContent = stamp(i);
  li.append(sr, text, t);
  return li;
}

function typing() {
  const li = document.createElement('li');
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
      }
      thread.append(bubble(i));
      scrollThread();
    }
    await wait(400);
    if (id === run) replay.hidden = false;
  })();
}

const phone = thread && thread.closest('.phone');
if (thread && replay && phone) {
  replay.addEventListener('click', play);
  const chatObserver = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      chatObserver.disconnect();
      play();
    }
  }, { threshold: 0.4 });
  chatObserver.observe(phone);
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
