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
  if (target && target.tagName === 'DETAILS') {
    target.open = true;
    target.scrollIntoView({ block: 'start' });
  }
}
window.addEventListener('hashchange', openTarget);
openTarget();

// Open outbound source links without the page keeping a reference to us.
$$('a[target="_blank"]').forEach((a) => { if (!a.rel.includes('noopener')) a.rel = (a.rel + ' noopener').trim(); });
