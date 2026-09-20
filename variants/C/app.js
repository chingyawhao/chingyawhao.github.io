/* chingyawhao.github.io — variant C. Theme toggle, hero map, Sarah chat, stat counters. */
'use strict';

const TILE_STYLE_DARK = 'https://tiles.openfreemap.org/styles/dark';
const TILE_STYLE_LIGHT = 'https://tiles.openfreemap.org/styles/positron';
const MAP_CENTER = [101.6869, 3.139];
const MAP_ZOOM = 11.5;

const PINS = [
  { lngLat: [101.744, 3.089], name: 'Cheras', line: '3-bed condo · from RM480K' },
  { lngLat: [101.760, 3.150], name: 'Ampang', line: '2-bed serviced apt · from RM390K' },
  { lngLat: [101.651, 3.166], name: 'Mont Kiara', line: '3-bed condo · from RM1.2M' },
  { lngLat: [101.671, 3.128], name: 'Bangsar', line: '2-bed condo · from RM750K' },
  { lngLat: [101.717, 3.198], name: 'Setapak', line: '3-bed apartment · from RM320K' },
];

/* Verbatim from the spec. */
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
const SARAH_TYPING_MS = 900;
const LEAD_DELAY_MS = 500;

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

/* ---------- Theme ---------- */
const root = document.documentElement;
const toggle = $('theme-toggle');
let map = null;

function applyTheme(theme) {
  root.dataset.theme = theme;
  toggle?.setAttribute('aria-pressed', String(theme === 'dark'));
  try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked */ }
  if (map) map.setStyle(theme === 'dark' ? TILE_STYLE_DARK : TILE_STYLE_LIGHT);
}
toggle?.setAttribute('aria-pressed', String(root.dataset.theme !== 'light'));
toggle?.addEventListener('click', () => applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light'));

/* ---------- Hero map ---------- */
function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) { return false; }
}

function initMap() {
  if (typeof maplibregl === 'undefined' || !hasWebGL()) return;
  const hero = $('top');
  const mapEl = $('map');
  const explore = $('explore');
  const exit = $('explore-exit');
  const HANDLERS = ['scrollZoom', 'boxZoom', 'dragRotate', 'dragPan', 'keyboard', 'doubleClickZoom', 'touchZoomRotate'];

  map = new maplibregl.Map({
    container: mapEl,
    style: root.dataset.theme === 'light' ? TILE_STYLE_LIGHT : TILE_STYLE_DARK,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    pitch: 30,
    attributionControl: { compact: true },
  });
  HANDLERS.forEach((h) => map[h].disable());
  map.getCanvas().tabIndex = -1;

  const pins = PINS.map((p) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'pin';
    const popup = new maplibregl.Popup({ offset: 16 })
      .setHTML(`<strong>${p.name}</strong><br>${p.line}<br><span class="muted">sample listing</span>`);
    new maplibregl.Marker({ element: el }).setLngLat(p.lngLat).setPopup(popup).addTo(map);
    /* After addTo: Marker sets its own tabindex/aria-label defaults. */
    el.setAttribute('aria-label', `${p.name}: ${p.line} (sample listing)`);
    el.tabIndex = -1;
    return el;
  });

  /* Slow bearing rotation, chained one full turn at a time. Stops while exploring. */
  let drifting = !reducedMotion;
  const drift = () => {
    if (!drifting) return;
    map.rotateTo(map.getBearing() + 360, { duration: 240000, easing: (t) => t });
  };
  map.on('moveend', drift);
  map.once('load', () => { drift(); explore.hidden = false; });

  const setExploring = (on) => {
    hero.classList.toggle('is-exploring', on);
    mapEl.setAttribute('aria-hidden', String(!on));
    HANDLERS.forEach((h) => map[h][on ? 'enable' : 'disable']());
    map.getCanvas().tabIndex = on ? 0 : -1;
    pins.forEach((el) => { el.tabIndex = on ? 0 : -1; });
    exit.hidden = !on;
    drifting = !on && !reducedMotion;
    if (on) { map.stop(); map.getCanvas().focus(); }
    else { drift(); explore.focus(); }
  };
  explore.addEventListener('click', () => setExploring(true));
  exit.addEventListener('click', () => setExploring(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hero.classList.contains('is-exploring')) setExploring(false);
  });
}

try { initMap(); } catch (e) {
  /* Fallback gradient is already painted by CSS; the rest of the page is unaffected. */
  console.warn('Map unavailable:', e);
}

/* ---------- Sarah chat ---------- */
const thread = $('thread');
const replay = $('replay');
let playing = false;

const bubble = (who, text) => {
  const li = document.createElement('li');
  li.className = `msg ${who}`;
  li.textContent = text;
  return li;
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function playChat() {
  if (playing || !thread) return;
  playing = true;
  if (replay) replay.hidden = true;
  thread.replaceChildren();

  if (reducedMotion) {
    SCRIPT.forEach(([who, text]) => thread.append(bubble(who, text)));
  } else {
    for (const [who, text] of SCRIPT) {
      if (who === 'sarah') {
        const typing = document.createElement('li');
        typing.className = 'msg typing';
        typing.innerHTML = '<i></i><i></i><i></i><span class="sr-only">Sarah is typing</span>';
        thread.append(typing);
        await wait(SARAH_TYPING_MS);
        typing.remove();
      } else {
        await wait(LEAD_DELAY_MS);
      }
      thread.append(bubble(who, text));
    }
  }
  if (replay) replay.hidden = false;
  playing = false;
}
replay?.addEventListener('click', playChat);

/* ---------- Stat counters ---------- */
function countUp(el) {
  const target = Number(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const finalText = el.textContent;
  const duration = 1200;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = t < 1 ? prefix + Math.round(target * eased) + suffix : finalText;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* One observer: chat autoplays once at >= 40% visible; stats count once when they appear. */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    io.unobserve(entry.target);
    if (entry.target === thread) playChat();
    else if (!reducedMotion) countUp(entry.target);
  });
}, { threshold: 0.4 });
if (thread) io.observe(thread);
document.querySelectorAll('.stat-n').forEach((el) => io.observe(el));
