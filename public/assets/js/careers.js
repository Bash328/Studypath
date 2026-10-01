// Search and sector filter on the careers index. The cards themselves are rendered
// server-side, so browsing still works with JavaScript off - this just narrows them.

import { $, $$ } from './core.js';

const search = $('#career-search');
const chips = $$('#sector-filters .chip');
const cards = $$('.career-card');
const blocks = $$('.sector-block');
const empty = $('#career-empty');
let sector = '';

function apply() {
  const q = (search.value || '').trim().toLowerCase();
  let shown = 0;
  cards.forEach((card) => {
    const ok = (!sector || card.dataset.sector === sector) && (!q || card.dataset.text.includes(q));
    card.hidden = !ok;
    if (ok) shown++;
  });
  blocks.forEach((block) => {
    block.hidden = ![...block.querySelectorAll('.career-card')].some((c) => !c.hidden);
  });
  empty.hidden = shown !== 0;
}

search.addEventListener('input', apply);
chips.forEach((chip) => chip.addEventListener('click', () => {
  sector = chip.dataset.sector;
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
  apply();
}));

// Support a ?q= link from the search box on the home page.
const params = new URLSearchParams(location.search);
if (params.get('q')) { search.value = params.get('q'); apply(); }
