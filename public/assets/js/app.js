// Runs on every page: analytics, and the small behaviours the shared layout needs.

import './analytics.js';
import { $, $$ } from './core.js';

// The "More" sheet in the phone tab bar closes when you tap elsewhere or press Escape.
const more = $('.tab--more');
if (more) {
  document.addEventListener('click', (e) => { if (more.open && !more.contains(e.target)) more.open = false; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && more.open) { more.open = false; $('summary', more).focus(); } });
}

// Anchor links to a closed <details> (like an FAQ answer) should open it.
function openTarget() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  let opened = false;
  for (let el = target; el; el = el.parentElement) {
    if (el.tagName === 'DETAILS' && !el.open) { el.open = true; opened = true; }
  }
  if (opened) target.scrollIntoView({ block: 'start' });
}
window.addEventListener('hashchange', openTarget);
openTarget();

// Open outbound source links without the page keeping a reference to us.
$$('a[target="_blank"]').forEach((a) => { if (!a.rel.includes('noopener')) a.rel = (a.rel + ' noopener').trim(); });

// "Back to the top" button: appears once you have scrolled a screen or so, and fills up from the
// bottom as you read down the page (one CSS number, no extra files or requests).
const toTop = $('#to-top');
if (toTop) {
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const fill = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    toTop.style.setProperty('--fill', fill.toFixed(1));
    toTop.hidden = window.scrollY < 700;
  };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  toTop.addEventListener('click', () => { toTop.blur(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  update();
}
