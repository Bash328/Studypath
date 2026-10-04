import { esc, md, link, hostOf, tag, plural, prettyDate } from '../lib/html.mjs';
import { SCORING_SYSTEMS } from '../lib/data.mjs';
import { sectionHead } from '../lib/components.mjs';
import { AUDITED_ON, auditLabel } from '../../src/scoring-audit.js';

const STATUS_LEVEL = { verified: 'verified', partial: 'reported', unverified: 'unverified' };
const FLAG_EXPLAIN = {
  conflict: 'two official sources disagree',
  unverified: 'a figure we could not fully verify',
  'partially-verified': 'captured from excerpts of the official page rather than the full page',
  'dated-document': 'the only official source is labelled for an earlier intake',
  selection: 'the published minimum is a floor, not a cut-off',
  'no-cutoff-published': 'the university publishes no cut-off at all',
};

export function dataSourcesPage(data) {
  const { universities, researchLog, contacts, flagCounts, stats, dates } = data;

  const scoring = Object.entries(SCORING_SYSTEMS).map(([id, s]) => {
    const a = s.audit;
    return `
  <article class="card" id="score-${esc(id)}">
    <div class="badge-row">${tag(STATUS_LEVEL[a.status] || 'unverified', auditLabel(a.status))}${s.computable ? '<span class="badge badge--good">We calculate this</span>' : '<span class="badge badge--warn">We do not calculate this</span>'}</div>
    <h3>${esc(s.label)}</h3>
    <p>${esc(s.explanation)}</p>
    ${a.confirmed.length ? `<h4>What we confirmed</h4><ul class="tidy">${a.confirmed.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
    ${a.gaps.length ? `<h4>What we could not confirm</h4><ul class="tidy">${a.gaps.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
    ${!s.computable && s.reason ? `<div class="callout callout--warn"><p>${esc(s.reason)}</p></div>` : ''}
    <p class="source"><span class="source__label">Checked against:</span> ${a.sources.map((x) => link(x.url, x.label)).join(' · ')} <span class="muted">· ${prettyDate(AUDITED_ON)}</span></p>
  </article>`;
  }).join('');

  const coverageRows = universities.slice().sort((a, b) => b.programCount - a.programCount || a.name.localeCompare(b.name)).map((u) => {
    const cs = contacts.filter((c) => c.university_id === u.id);
    const best = cs.some((c) => c.verification === 'verified') ? 'verified' : cs.length ? 'reported' : 'unverified';
    const nd = dates.filter((d) => d.university_id === u.id).length;
    return `<tr>
      <th scope="row"><a href="/universities/${esc(u.id)}">${esc(u.name)}</a></th>
      <td data-label="Programmes captured">${u.hasRequirements ? plural(u.programCount, 'programme', 'programmes') : '<span class="muted">not yet</span>'}</td>
      <td data-label="Contact">${tag(best === 'verified' ? 'verified' : best === 'reported' ? 'reported' : 'unverified', best === 'verified' ? 'Contact checked' : best === 'reported' ? 'Contact from research' : 'No contact')}</td>
      <td data-label="Dates">${nd || '<span class="muted">–</span>'}</td>
    </tr>`;
  }).join('');

  const counts = { verified: 0, reported: 0, unverified: 0 };
  for (const c of contacts) counts[c.verification] = (counts[c.verification] || 0) + 1;

  const logGroup = (status, title, tone) => {
    const list = researchLog.filter((r) => r.status === status);
    if (!list.length) return '';
    return `<details class="more-table">
      <summary>${esc(title)} (${list.length})</summary>
      <div class="grid grid--2">${list.map((e) => {
        const u = e.university_id ? data.uniById[e.university_id] : null;
        return `<div class="card"><div class="badge-row"><span class="badge badge--${tone}">${esc(u ? u.short_name : 'General')}</span></div><h4>${esc(e.faculty_or_program)}</h4><p class="small muted">${esc(e.notes)}</p></div>`;
      }).join('')}</div>
    </details>`;
  };

  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">Our working, shown</p>
    <h1>Where this data comes from</h1>
    <p class="lead">One rule: if a requirement isn’t on an official university page or document, it doesn’t go on Studypath as a fact. This page shows what we have, how sure we are, and – just as important – what we still don’t know.</p>
  </div>
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('🏷️', 'How to read our labels')}
  <div class="stack">
    <div class="card">${tag('verified')} <p>We opened the official page or document ourselves and read the statement. This includes the rule being in a university’s own calculator code.</p></div>
    <div class="card">${tag('reported')} <p>From our research. A source is cited, but we haven’t re-read it ourselves – often because the university’s website blocks automated checks. Treat it as “likely right, please confirm”.</p></div>
    <div class="card">${tag('general')} <p>General knowledge or advice with no official source behind it. We always say so, and suggest where you can check.</p></div>
    <div class="card">${tag('unverified')} ${tag('conflict')} <p>We couldn’t confirm it, or two official sources disagree. We show you both rather than pick one.</p></div>
  </div>
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('📐', 'The rules we hold ourselves to')}
  <div class="stack">
    <div class="card"><h3>Every number links to its source</h3><p>Not in a tooltip. A visible link, next to the number, on every programme. If you find a figure without one, that’s a bug.</p></div>
    <div class="card"><h3>We never put universities on one scale</h3><p>Their scoring systems measure different things. Comparing them would produce a number that is confidently wrong. The calculator gives a separate result per university, every time.</p></div>
    <div class="card"><h3>When sources disagree, we show both</h3><p>Wits’s Bachelor of Architectural Studies is the clearest example: one Wits document says APS 34, the programme’s own FAQ says 29. You see a “Sources disagree” badge and both figures.</p></div>
    <div class="card"><h3>When we can’t compute something, we say so</h3><p>The Wits Health Sciences Composite Index needs your NBT and Wits publishes no cut-off, so we don’t calculate it. Guessing would hand you a number to plan your life around that we made up.</p></div>
  </div>
</section>

<section class="section wrap" id="scoring">
  ${sectionHead('🧮', 'How each university scores you – and whether we got it right', `Every formula below was checked against the university’s own published rule on ${prettyDate(AUDITED_ON)}. Where we found differences in our first attempt, we fixed them.`)}
  <div class="grid grid--2">${scoring}</div>
</section>

<section class="section wrap" id="coverage">
  ${sectionHead('🗺️', 'Coverage right now', `${stats.universitiesWithData} of ${stats.universities} universities have their requirements captured (${stats.programs} programmes). New ones are added as we verify them.`)}
  <div class="table-scroll"><table class="data">
    <thead><tr><th scope="col">University</th><th scope="col">Programmes captured</th><th scope="col">Contact</th><th scope="col">Dates</th></tr></thead>
    <tbody>${coverageRows}</tbody>
  </table></div>
  <p class="small muted jargon-key">Contacts: ${counts.verified} checked on an official page · ${counts.reported} from our research · ${counts.unverified} unconfirmed.</p>

  <h3 class="uni-head">Caveats carried on individual programmes</h3>
  <ul class="tidy">${Object.entries(flagCounts).sort((a, b) => b[1] - a[1]).map(([id, n]) => `<li><strong>${n}</strong> – ${esc(FLAG_EXPLAIN[id] || id)}</li>`).join('')}</ul>
</section>

<section class="section wrap" id="gaps">
  ${sectionHead('⚠️', 'What we could not verify', 'Most sites hide this. A learner deciding their future deserves to know exactly where the information runs out. Planned work is listed separately at the bottom.')}
  ${logGroup('could_not_verify', 'Could not verify', 'bad')}
  ${logGroup('partially_verified', 'Partly verified', 'warn')}
  ${logGroup('todo', 'Still to do (not a verification gap)', 'info')}
</section>

<section class="section wrap" id="checked">
  ${sectionHead('✅', 'What we have checked', 'Findings confirmed against an official source. These are not gaps.')}
  ${logGroup('verified', 'Verified findings', 'good')}
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('🛠️', 'Found something wrong?')}
  <p>Universities change their requirements and replace documents. If a figure here doesn’t match what the university’s own page says today, the university is right and we are wrong – please <a href="/ask">tell us</a> so we can fix it.</p>
</section>`;

  return [{
    path: '/data-sources',
    title: 'Where our data comes from – sources, formulas checked, and what we don’t know',
    description: 'Studypath publishes admission requirements only from official university sources. See how each university’s score is calculated, what we checked it against, and every gap and conflict we haven’t resolved.',
    body,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Data & sources', path: '/data-sources' }],
  }];
}
