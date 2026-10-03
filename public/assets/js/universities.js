// Filter chips on the universities index (by type) and on an individual university's
// degree list (by field). Both lists are rendered server-side, so browsing still works
// with JavaScript off - this just narrows what's shown. Whichever elements aren't on the
// current page are simply absent, so one script serves both pages.

import { $, $$ } from './core.js';

function wireFilter({ chipsSel, itemsSel, dataKey, emptySel }) {
  const chips = $$(chipsSel);
  if (!chips.length) return;
  const items = $$(itemsSel);
  const empty = emptySel ? $(emptySel) : null;

  chips.forEach((chip) => chip.addEventListener('click', () => {
    const value = chip.dataset[dataKey];
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    let shown = 0;
    items.forEach((item) => {
      const ok = !value || item.dataset[dataKey] === value;
      item.hidden = !ok;
      if (ok) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  }));
}

wireFilter({ chipsSel: '#type-filters .chip', itemsSel: '.uni-card', dataKey: 'type', emptySel: '#uni-empty' });
wireFilter({ chipsSel: '#degree-filters .chip', itemsSel: '.degree-block', dataKey: 'group' });
