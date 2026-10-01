// Search and category filter on the FAQ. Answers are rendered server-side, so reading
// the FAQ works with JavaScript off - this narrows the list and opens a direct match.

import { $, $$ } from './core.js';

const search = $('#faq-search');
const chips = $$('#faq-cats .chip');
const items = $$('.faq');
const groups = $$('.faq-group');
const empty = $('#faq-empty');
let cat = '';

function apply() {
  const q = (search.value || '').trim().toLowerCase();
  let shown = 0;
  items.forEach((item) => {
    const ok = (!cat || item.dataset.cat === cat) && (!q || item.dataset.text.includes(q));
    item.hidden = !ok;
    if (ok) shown++;
  });
  groups.forEach((g) => { g.hidden = ![...g.querySelectorAll('.faq')].some((i) => !i.hidden); });
  empty.hidden = shown !== 0;

  // A single match while searching is probably what they want - open it.
  if (q && shown === 1) { const only = items.find((i) => !i.hidden); if (only) only.open = true; }
}

search.addEventListener('input', apply);
chips.forEach((chip) => chip.addEventListener('click', () => {
  cat = chip.dataset.cat;
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
  apply();
}));

const params = new URLSearchParams(location.search);
if (params.get('q')) { search.value = params.get('q'); apply(); }
