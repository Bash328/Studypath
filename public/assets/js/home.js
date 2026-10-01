// Home page: the grade picker (remembered for next visit) and the "coming up" widget.

import { $, $$, el, set, getJson, store, prettyDate, daysUntil } from './core.js';

// ---------------------------------------------------------------- grade picker
const chips = $$('#grade-chips .chip');
const panels = $('#grade-panels');
const KEY_GRADE = 'studypath.grade';

function showGrade(grade) {
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.grade === grade)));
  panels.classList.add('has-choice');
  $$('.grade-panel', panels).forEach((p) => p.classList.toggle('is-on', p.dataset.for.split(' ').includes(grade)));
  store.set(KEY_GRADE, grade);
}

chips.forEach((chip) => chip.addEventListener('click', () => showGrade(chip.dataset.grade)));

const saved = store.get(KEY_GRADE, null);
if (saved && chips.some((c) => c.dataset.grade === saved)) showGrade(saved);

// ---------------------------------------------------------------- coming up
const KIND_LABEL = { close: 'Applications close', open: 'Applications open', nbt: 'NBT', funding: 'Funding', open_day: 'Open day' };
const KIND_PILL = { close: 'warn', open: 'open', nbt: 'nbt', funding: 'funding', open_day: 'open_day' };

async function loadUpcoming() {
  const box = $('#upcoming');
  try {
    const { dates } = await getJson(box.dataset.src);
    const upcoming = dates
      .filter((d) => d.date && (daysUntil(d.date_end || d.date) ?? -1) >= 0)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);

    if (!upcoming.length) {
      set(box, el('p', { class: 'muted' }, 'Nothing open right now for the dates we track. ', el('a', { href: '/dates.html' }, 'See all dates →')));
      return;
    }

    set(box, 
      upcoming.map((d) => {
        const days = daysUntil(d.date_end || d.date);
        return el('div', { class: 'card', style: 'display:flex;gap:14px;align-items:center;flex-wrap:wrap' },
          el('span', { class: `pill pill--${KIND_PILL[d.kind] || 'close'}` }, KIND_LABEL[d.kind] || d.kind),
          el('div', { style: 'flex:1;min-width:180px' },
            el('p', { style: 'margin:0;font-weight:700' }, d.university ? `${d.university} – ${d.title}` : d.title),
            el('p', { class: 'small muted', style: 'margin:0' }, prettyDate(d.date))),
          el('span', { class: 'pill' }, days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'}`));
      }),
      el('p', { class: 'small' }, el('a', { href: '/dates.html' }, 'See every date →')));
  } catch {
    set(box, el('p', { class: 'muted' }, el('a', { href: '/dates.html' }, 'See all dates →')));
  }
}
loadUpcoming();
