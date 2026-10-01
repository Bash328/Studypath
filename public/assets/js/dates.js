// Dates page: live "closes in N days" status on each row, plus the kind/university/
// past-dates filters. All the rows are rendered server-side, so the page is readable
// with JavaScript off - this adds the countdown and narrows the list.

import { $, $$, daysUntil } from './core.js';

const rows = $$('.date');
const kindChips = $$('#kind-chips .chip');
const uniFilter = $('#uni-filter');
const showPast = $('#show-past');
const empty = $('#dates-empty');
let kind = '';

function paintStatus(row) {
  const status = $('[data-status]', row);
  const date = row.dataset.date;
  const end = row.dataset.end;
  const days = daysUntil(end || date);
  const isPast = days != null && days < 0;
  row.classList.toggle('is-past', isPast);
  if (!status) return;
  if (!date) { status.textContent = ''; return; }

  if (row.dataset.kind === 'open_day' || row.dataset.kind === 'open') {
    const startDays = daysUntil(date);
    if (startDays != null && startDays >= 0) { status.textContent = startDays === 0 ? 'Today' : `In ${startDays} day${startDays === 1 ? '' : 's'}`; status.className = 'date__status is-open'; return; }
  }
  if (days == null) { status.textContent = ''; return; }
  if (days < 0) { status.textContent = 'Closed'; status.className = 'date__status'; }
  else if (days === 0) { status.textContent = 'Today'; status.className = 'date__status is-soon'; }
  else if (days <= 30) { status.textContent = `${days} day${days === 1 ? '' : 's'} left`; status.className = 'date__status is-soon'; }
  else { status.textContent = `${days} days left`; status.className = 'date__status'; }
}
rows.forEach(paintStatus);

function apply() {
  const uni = uniFilter.value;
  const past = showPast.checked;
  let shown = 0;
  rows.forEach((row) => {
    const ok = (!kind || row.dataset.kind === kind) && (!uni || row.dataset.uni === uni) && (past || !row.classList.contains('is-past'));
    row.hidden = !ok;
    if (ok) shown++;
  });
  empty.hidden = shown !== 0;
}

kindChips.forEach((chip) => chip.addEventListener('click', () => {
  kind = chip.dataset.kind;
  kindChips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
  apply();
}));
uniFilter.addEventListener('change', apply);
showPast.addEventListener('change', apply);

// Deep links from other pages, e.g. /dates.html?kind=open_day or ?uni=uct
const params = new URLSearchParams(location.search);
if (params.get('kind')) {
  kind = params.get('kind');
  const match = kindChips.find((c) => c.dataset.kind === kind);
  if (match) kindChips.forEach((c) => c.setAttribute('aria-pressed', String(c === match)));
}
if (params.get('uni') && [...uniFilter.options].some((o) => o.value === params.get('uni'))) uniFilter.value = params.get('uni');
apply();
