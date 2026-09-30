import { esc, tag, link, hostOf } from '../lib/html.mjs';
import { CYCLE, OPEN_DAY_PAGES } from '../lib/data.mjs';
import { dateRow, sectionHead, verificationTag } from '../lib/components.mjs';
import { prettyDate } from '../lib/html.mjs';

export function datesPage(data) {
  const { dates, uniById, universities, fees } = data;
  const sorted = dates.slice().sort((a, b) => String(a.date || '9999-12-31').localeCompare(String(b.date || '9999-12-31')));
  const dated = sorted.filter((d) => d.date);
  const undated = sorted.filter((d) => !d.date);

  const usedUnis = [...new Set(dates.map((d) => d.university_id).filter(Boolean))].sort((a, b) => uniById[a].name.localeCompare(uniById[b].name));
  // Open days with a 2027 date, versus universities that held one in 2026 (or have an
  // events page) but have not announced 2027 yet. Computed, so it cannot drift from the data.
  const next = dates.filter((d) => d.kind === 'open_day' && d.date >= '2027-01-01').sort((a, b) => a.date.localeCompare(b.date));
  const announced = new Set(next.map((d) => d.university_id));
  const hadOne = new Set([...dates.filter((d) => d.kind === 'open_day').map((d) => d.university_id), ...OPEN_DAY_PAGES.map((p) => p.university_id)]);
  const noOpenDay2027 = universities.filter((u) => hadOne.has(u.id) && !announced.has(u.id));

  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">Don’t miss one</p>
    <h1>Dates that matter</h1>
    <p class="lead">When applications close, when you can write the NBT, when NSFAS closes and when universities open their doors.</p>
  </div>
</section>

<section class="wrap wrap--narrow">
  <div class="callout callout--warn">
    <h3>Read this first</h3>
    <p>These are dates for the <strong>${esc(CYCLE.label)}</strong>. Most have already passed. <strong>The 2028 dates have not been published</strong>, and we won’t guess them – check each university from early next year. Still-open dates are at the top below.</p>
  </div>
</section>

<section class="section wrap wrap--narrow" id="dates-list">
  <div class="filters" role="group" aria-label="Filter dates">
    <div class="chip-row" id="kind-chips">
      <button class="chip" type="button" data-kind="" aria-pressed="true">All</button>
      <button class="chip" type="button" data-kind="close" aria-pressed="false">⏰ Closing dates</button>
      <button class="chip" type="button" data-kind="open_day" aria-pressed="false">🏫 Open days</button>
      <button class="chip" type="button" data-kind="nbt" aria-pressed="false">✍️ NBT</button>
      <button class="chip" type="button" data-kind="funding" aria-pressed="false">💰 Money</button>
    </div>
    <div class="filters__row">
      <label class="sr-only" for="uni-filter">University</label>
      <select id="uni-filter">
        <option value="">All universities</option>
        ${usedUnis.map((id) => `<option value="${esc(id)}">${esc(uniById[id].name)}</option>`).join('')}
      </select>
      <label class="check"><input type="checkbox" id="show-past"> <span>Show dates that have passed</span></label>
    </div>
  </div>

  <ul class="dates" id="dates">
    ${dated.map((d) => dateRow(d, d.university_id ? uniById[d.university_id].short_name : null)).join('\n')}
  </ul>
  <p class="empty" id="dates-empty" hidden>Nothing to show with those filters. Try “Show dates that have passed”.</p>

  ${undated.length ? `
  <h2 class="h3">Dates we couldn’t pin down</h2>
  <ul class="dates dates--plain">${undated.map((d) => dateRow(d, d.university_id ? uniById[d.university_id].short_name : null)).join('\n')}</ul>` : ''}
</section>

<section class="section wrap wrap--narrow" id="open-days">
  ${sectionHead('🏫', 'Open days: what’s next?', 'Open days are on a Saturday in March–May at most universities. Only some have announced 2027 dates.')}
  <div class="card">
    ${next.length ? next.map((d) => `<p>${verificationTag(d.verification)} <strong>${esc(uniById[d.university_id].short_name)}</strong> – ${esc(prettyDate(d.date))}${d.time ? ' (' + esc(d.time) + ')' : ''}${d.applies_to ? ' · ' + esc(d.applies_to) : ''} ${link(d.source_url, hostOf(d.source_url))}</p>`).join('') : '<p>No university has announced a 2027 open day that we have found.</p>'}
    <p class="small">Not announced yet when we checked: ${noOpenDay2027.map((u) => esc(u.short_name)).join(', ')}. Their 2026 events have passed (show past dates above to see them). Follow the links below for the next announcement.</p>
    <ul class="tidy">
      ${OPEN_DAY_PAGES.map((p) => `<li>${link(p.url, `${uniById[p.university_id].short_name}: ${p.label}`)} ${verificationTag(p.verification)}</li>`).join('')}
    </ul>
    ${tag('general', 'General tip, not from an official source')}
    <p class="small">Many universities also run campus tours and online sessions outside the main open day. Ask the university’s recruitment or schools-liaison office.</p>
  </div>
</section>

<section class="section wrap wrap--narrow" id="fees">
  ${sectionHead('🧾', 'What does applying cost?', 'Some universities charge nothing. Never pay anyone to “secure” your application.')}
  <div class="table-scroll"><table class="data">
    <thead><tr><th scope="col">University</th><th scope="col">Application fee</th><th scope="col">How sure?</th></tr></thead>
    <tbody>${fees.map((f) => `<tr><th scope="row">${esc(uniById[f.university_id].name)}</th><td>${esc(f.fee)}</td><td>${verificationTag(f.verification)} ${link(f.source_url, hostOf(f.source_url))}</td></tr>`).join('')}</tbody>
  </table></div>
  <p class="small muted">Only universities where we found a fee are listed. For the rest, check the application page.</p>
</section>`;

  return [{
    path: '/dates.html',
    title: 'Application closing dates, open days and NBT dates for South African universities',
    description: 'When applications close, when to write the NBT, when NSFAS closes and when universities hold open days – with the official source and how sure we are of each date.',
    body,
    scripts: ['/assets/js/dates.js'],
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Dates', path: '/dates.html' }],
  }];
}
