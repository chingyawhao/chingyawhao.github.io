'use strict';

/* ---------- constants ---------- */
const MAP_STYLE = {
  dark: 'https://tiles.openfreemap.org/styles/dark',
  light: 'https://tiles.openfreemap.org/styles/positron'
};
const MAP_CENTER = [101.6869, 3.139];
const MAP_ZOOM = 11.5;
const MAP_PITCH = 30;
const DRIFT_DEG = 45;          // bearing change per drift leg
const DRIFT_MS = 90000;        // duration of one leg: slow, barely noticeable

// [lng, lat, label, popup line]
const PINS = [
  [101.744, 3.089, 'Cheras', '3-bed condo · from RM480K'],
  [101.760, 3.150, 'Ampang', '2-bed serviced apt · from RM390K'],
  [101.651, 3.166, 'Mont Kiara', '3-bed condo · from RM1.2M'],
  [101.671, 3.128, 'Bangsar', '2-bed condo · from RM750K'],
  [101.717, 3.198, 'Setapak', '3-bed apartment · from RM320K']
];

// [who, text] — fixed script from the spec, verbatim
const CHAT = [
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
  ['sarah', "Booked ✅ Saturday, 3:00 PM at the Cheras sales gallery with Amirah. She'll confirm with you tomorrow morning. See you there!"]
];
const TYPING_MS = 1100;        // Sarah "types" before each message
const LEAD_MS = 600;           // lead replies come faster

const THEME_COLOR = { dark: '#141210', light: '#f6f2ea' };

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- theme ---------- */
const themeBtn = document.getElementById('theme-toggle');
let map = null;

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (themeBtn) themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => { m.content = THEME_COLOR[theme]; });
  try { localStorage.setItem('theme', theme); } catch (e) { /* private mode: theme just won't persist */ }
  if (map) map.setStyle(MAP_STYLE[theme]);
}

if (themeBtn) {
  themeBtn.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  themeBtn.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
}

/* ---------- map ---------- */
function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) {
    return false;
  }
}

function initMap() {
  const hero = document.getElementById('hero');
  const el = document.getElementById('map');
  const exploreBtn = document.getElementById('explore');

  if (!el || !hero || !exploreBtn) return;
  if (typeof maplibregl === 'undefined' || !hasWebGL()) { el.remove(); return; }

  try {
    map = new maplibregl.Map({
      container: el,
      style: MAP_STYLE[root.dataset.theme],
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      pitch: MAP_PITCH,
      attributionControl: false
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    for (const [lng, lat, label, line] of PINS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pin';
      btn.setAttribute('aria-label', `${label}: ${line}`);
      const popup = new maplibregl.Popup({ offset: 14 })
        .setHTML(`<strong>${label}</strong>${line}<small>sample listing</small>`);
      new maplibregl.Marker({ element: btn }).setLngLat([lng, lat]).setPopup(popup).addTo(map);
    }
  } catch (e) {
    map = null;
    el.remove();
    return;
  }

  hero.classList.add('has-map');
  exploreBtn.hidden = false;

  // Slow bearing rotation, one leg at a time; moveend chains the next.
  // Skipped entirely under reduced motion (MapLibre would make each leg
  // instantaneous, which would otherwise spin the loop).
  let exploring = false;
  function drift() {
    if (exploring || reduceMotion) return;
    map.easeTo({ bearing: map.getBearing() + DRIFT_DEG, duration: DRIFT_MS, easing: t => t });
  }
  map.on('moveend', drift);
  map.once('load', drift);

  function setExploring(on) {
    exploring = on;
    el.toggleAttribute('inert', !on);        // inert = no pointer, no focus, no AT until asked for
    hero.classList.toggle('is-exploring', on);
    exploreBtn.setAttribute('aria-pressed', String(on));
    exploreBtn.textContent = on ? 'Exit map' : 'Explore map';
    if (on) {
      map.stop();
      map.getCanvas().focus();
    } else {
      drift();
    }
  }
  exploreBtn.addEventListener('click', () => setExploring(!exploring));
  hero.addEventListener('keydown', e => {
    if (e.key === 'Escape' && exploring) {
      setExploring(false);
      exploreBtn.focus();
    }
  });
}

initMap();

/* ---------- chat ---------- */
const log = document.getElementById('chat-log');
const replayBtn = document.getElementById('replay');
const wait = ms => new Promise(r => setTimeout(r, ms));
let playing = false;

function bubble(who, text) {
  const li = document.createElement('li');
  li.className = `msg msg--${who}`;
  li.textContent = text;
  return li;
}

function typingBubble() {
  const li = bubble('sarah', '');
  li.classList.add('msg--typing');
  li.setAttribute('aria-hidden', 'true');  // keep the live region quiet until the real message
  li.append(...[0, 1, 2].map(() => document.createElement('i')));
  return li;
}

function scrollDown() { log.scrollTop = log.scrollHeight; }

async function play() {
  if (playing) return;
  playing = true;
  replayBtn.hidden = true;
  log.replaceChildren();

  if (reduceMotion) {
    for (const [who, text] of CHAT) log.append(bubble(who, text));
  } else {
    for (const [who, text] of CHAT) {
      if (who === 'sarah') {
        const t = typingBubble();
        log.append(t);
        scrollDown();
        await wait(TYPING_MS);
        t.remove();
      } else {
        await wait(LEAD_MS);
      }
      log.append(bubble(who, text));
      scrollDown();
    }
  }

  replayBtn.hidden = false;
  playing = false;
}

const phone = document.getElementById('phone');
if (log && replayBtn && phone) {
  replayBtn.addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        io.disconnect();
        play();
      }
    }, { threshold: 0.4 });
    io.observe(phone);
  } else {
    play();
  }
}
