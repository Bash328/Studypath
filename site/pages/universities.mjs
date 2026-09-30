import { esc, md, link, hostOf, tag, claim, plural, prettyDate } from '../lib/html.mjs';
import { programCard, contactCard, dateRow, sectionHead, verificationTag } from '../lib/components.mjs';
import { SCORING_SYSTEMS } from '../lib/data.mjs';
import { auditLabel } from '../../src/scoring-audit.js';

const STATUS_LEVEL = { verified: 'verified', partial: 'reported', unverified: 'unverified' };

export function universitiesIndex(data) {
  const { universities, stats } = data;
  const withData = universities.filter((u) => u.hasRequirements).sort((a, b) => b.programCount - a.programCount);
  const without = universities.filter((u) => !u.hasRequirements).sort((a, b) => a.name.localeCompare(b.name));

  const card = (u) => `
  <a class="card card--link uni-card" href="/universities/${esc(u.id)}.html">
    <h3>${esc(u.name)}</h3>
    <p class="card__meta">${esc(u.type || '')}${u.cao ? ' · applies via the CAO' : ''}</p>
    <p>${u.hasRequirements ? `<strong>${plural(u.programCount, 'degree', 'degrees')}</strong> with requirements and sources` : 'Contacts and closing dates – requirements coming'}</p>
  </a>`;

  const body = `
<section class="hero hero--slim">
  <div class="wrap">
    <p class="eyebrow">${stats.universitiesWithData} of ${stats.universities} public universities have their requirements captured so far</p>
    <h1>Universities</h1>
    <p class="lead">Pick one to see how it scores you, what its degrees need, when applications close and exactly who to contact – with the official source next to every number.</p>
  </div>
</section>

<section class="section wrap">
  ${sectionHead('✅', 'Requirements captured', 'These are in the “What do I qualify for?” calculator.')}
  <div class="grid grid--3">${withData.map(card).join('')}</div>
</section>

<section class="section wrap">
  ${sectionHead('🔜', 'Coming soon', 'We publish a university’s requirements only once we’ve captured them from its official sources, so this list shrinks every week. Contacts and closing dates are here already.')}
  <div class="grid grid--3">${without.map(card).join('')}</div>
  <p class="small muted">${tag('general')} The labels “traditional” and “comprehensive” are general knowledge we haven’t checked against the Department of Higher Education. Only the “University of Technology” labels follow from the names.</p>
</section>`;

  return [{
    path: '/universities.html',
    title: 'South African university admission requirements, contacts and dates',
    description: 'Admission requirements, closing dates and contact details for South African universities – UCT, Wits, Stellenbosch, UP, UKZN, UJ, Rhodes and more – with the official source for every number.',
    body,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Universities', path: '/universities.html' }],
  }];
}

function scoringCard(id) {
  const s = SCORING_SYSTEMS[id];
  if (!s) return '';
  const level = STATUS_LEVEL[s.audit.status] || 'unverified';
  return `<div class="card">
    <div class="badge-row">${tag(level, auditLabel(s.audit.status))}${s.computable ? '' : '<span class="badge badge--warn">We do not calculate this</span>'}</div>
    <h3>${esc(s.label)}</h3>
    <p>${esc(s.explanation)}</p>
    ${s.computable ? '' : `<div class="callout callout--warn"><p>${esc(s.reason)}</p></div>`}
    <p class="small"><strong>This score means nothing at another university</strong> – it can’t be compared with any other university’s.</p>
    ${s.audit.gaps.length ? `<details class="checks"><summary>What we couldn’t confirm</summary><ul>${s.audit.gaps.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></details>` : ''}
    <p class="source"><span class="source__label">Checked against:</span> ${s.audit.sources.map((x) => link(x.url, x.label)).join(' · ')}</p>
  </div>`;
}

export function universityPages(data) {
  const { universities, programs, contactsByUni, datesByUni, fees, researchLog } = data;

  return universities.map((u) => {
    const list = programs.filter((p) => p.university.id === u.id);
    const byFaculty = {};
    for (const p of list) (byFaculty[p.faculty || 'Other'] ||= []).push(p);
    const faculties = Object.keys(byFaculty).sort();
    const systems = [...new Set(list.map((p) => p.scoringSystem))];
    const myContacts = contactsByUni[u.id] || [];
    const myDates = (datesByUni[u.id] || []).slice().sort((a, b) => String(a.date || '9999').localeCompare(String(b.date || '9999')));
    const fee = fees.find((f) => f.university_id === u.id);
    const gaps = researchLog.filter((r) => r.university_id === u.id);

    const body = `
<section class="hero hero--slim">
  <div class="wrap">
    <p class="eyebrow"><a href="/universities.html">Universities</a></p>
    <h1>${esc(u.name)}</h1>
    <p class="lead">${list.length
      ? `${plural(list.length, 'degree', 'degrees')} captured from ${esc(u.short_name)}’s own official sources, across ${plural(faculties.length, 'faculty', 'faculties')}.`
      : `We haven’t captured ${esc(u.short_name)}’s admission requirements yet – but here are its contacts and dates.`}</p>
    <p class="chip-row">
      <span class="pill">${esc(u.type || '')}</span>
      ${u.cao ? '<span class="pill pill--warn">Apply through the CAO</span>' : ''}
      ${link(u.website, hostOf(u.website), 'pill pill--link')}
    </p>
  </div>
</section>

${list.length ? `
<section class="section wrap" id="scoring">
  ${sectionHead('🧮', `How ${u.short_name} scores you`, 'Every university does this differently.')}
  <div class="grid grid--2">${systems.map(scoringCard).join('')}</div>
</section>` : ''}

<section class="section wrap" id="dates">
  ${sectionHead('📅', 'Dates', 'For the 2027 intake. **2028 dates aren’t published yet.**')}
  ${myDates.length ? `<ul class="dates dates--plain">${myDates.map((d) => dateRow(d)).join('')}</ul>` : `<p class="empty">We haven’t found ${esc(u.short_name)}’s dates on an official page yet. Check its website, or ask below.</p>`}
  ${fee ? `<p class="small"><strong>Application fee:</strong> ${esc(fee.fee)} ${verificationTag(fee.verification)} ${link(fee.source_url, hostOf(fee.source_url))}</p>` : ''}
  <p class="small"><a href="/dates.html?uni=${esc(u.id)}">All ${esc(u.short_name)} dates →</a> · <a href="/nbt.html">Do I need the NBT? →</a></p>
</section>

<section class="section wrap" id="contact">
  ${sectionHead('📞', `Who to contact at ${u.short_name}`)}
  ${myContacts.length ? `<div class="grid grid--2">${myContacts.map(contactCard).join('')}</div>` : '<p class="empty">No verified contact yet.</p>'}
  <p class="small"><a href="/ask-a-university.html?uni=${esc(u.id)}">Get help writing your question →</a></p>
</section>

${list.length ? `
<section class="section wrap" id="degrees">
  ${sectionHead('🎓', 'Degrees')}
  ${faculties.map((f) => `
  <h3 class="uni-head">${esc(f)}</h3>
  <div class="grid grid--2">${byFaculty[f].map((p) => programCard(p, { showUniversity: false })).join('')}</div>`).join('')}
</section>` : `
<section class="section wrap">
  <div class="callout">
    <h3>Requirements coming</h3>
    <p>We add a university’s degrees only once we’ve captured them from its official pages or documents – we don’t guess. In the meantime, ${link(u.website, `${hostOf(u.website)}`)} is the place for ${esc(u.short_name)}’s requirements.</p>
  </div>
</section>`}

${gaps.length ? `
<section class="section wrap" id="gaps">
  ${sectionHead('⚠️', `What we couldn’t verify at ${u.short_name}`, 'We publish our gaps instead of hiding them.')}
  <div class="grid grid--2">
    ${gaps.map((g) => `<div class="card"><div class="badge-row"><span class="badge badge--${g.status === 'could_not_verify' ? 'bad' : g.status === 'partially_verified' ? 'warn' : 'good'}">${esc(g.status.replace(/_/g, ' '))}</span></div><h4>${esc(g.faculty_or_program)}</h4><p class="small muted">${esc(g.notes)}</p></div>`).join('')}
  </div>
</section>` : ''}

${list.length ? `
<section class="section wrap wrap--narrow">
  <div class="callout callout--good">
    <h3>Do your marks get you in here?</h3>
    <p>Enter your subjects once and we’ll check them against every ${esc(u.short_name)} degree above.</p>
    <p><a class="btn btn--primary" href="/calculator.html">What do I qualify for?</a></p>
  </div>
</section>` : ''}`;

    return {
      path: `/universities/${u.id}.html`,
      title: list.length
        ? `${u.name} (${u.short_name}) admission requirements, APS, dates and contacts`
        : `${u.name} (${u.short_name}) – admissions contacts and closing dates`,
      description: list.length
        ? `${u.name} admission requirements for ${list.length} degrees: the score you need, subject minimums, closing dates and who to contact – with the official ${u.short_name} source for every number.`
        : `How to contact ${u.name} about applying, when applications close, and where to find its entry requirements.`,
      body,
      breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Universities', path: '/universities.html' }, { name: u.name, path: `/universities/${u.id}.html` }],
      jsonLd: [{ '@context': 'https://schema.org', '@type': 'CollegeOrUniversity', name: u.name, alternateName: u.short_name, url: u.website, address: { '@type': 'PostalAddress', addressCountry: 'ZA' } }],
    };
  });
}
