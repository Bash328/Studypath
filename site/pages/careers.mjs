import { esc, md, claim, checksBox, plural } from '../lib/html.mjs';
import { programCard, sectionHead } from '../lib/components.mjs';
import { requirementText } from '../lib/data.mjs';
import { iconOrEmoji } from '../lib/icons.mjs';

const SECTOR_EMOJI = {
  Engineering: '⚙️', 'Built environment': '🏗️', Technology: '💻', 'Business & finance': '💼',
  Science: '🔬', Health: '⚕️', Law: '⚖️', Education: '🍎', 'People & society': '🤝', Arts: '🎨',
};

/** Which subjects do the degrees for this career actually ask for? Computed, not typed. */
function subjectDemand(programs) {
  const counts = new Map();
  const walk = (r, seen) => {
    if (!r || r.label || r.not_computable) return;
    if (r.any_of) return r.any_of.forEach((x) => walk(x, seen));
    if (r.all_of) return r.all_of.forEach((x) => walk(x, seen));
    if (r.subject && r.subject !== 'Next 3 subjects' && r.subject !== 'English' && r.subject !== 'Life Orientation') seen.add(r.subject);
  };
  for (const p of programs) {
    const seen = new Set();
    (p.subjectRequirements || []).forEach((r) => walk(r, seen));
    for (const s of seen) counts.set(s, (counts.get(s) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export function careersIndex(data) {
  const { careers, programs } = data;
  const counts = Object.fromEntries(careers.map((c) => {
    const list = programs.filter((p) => p.career && p.career.id === c.id);
    return [c.id, { programs: list.length, unis: new Set(list.map((p) => p.university.id)).size }];
  }));
  const sectors = [...new Set(careers.map((c) => c.sector))].sort();

  const body = `
<section class="hero hero--slim">
  <div class="wrap">
    <p class="eyebrow">Start here if you’re not sure yet</p>
    <h1>What could you do?</h1>
    <p class="lead">Browse ${careers.length} careers by the kind of work they are. Each one shows the real degrees that lead there – with the requirements from the university’s own page.</p>
    <p class="small muted">${iconOrEmoji('🔜')} More degrees and careers are added every week – we only publish one once we’ve verified it against its official source, so this list keeps growing.</p>
    <div class="searchbar">
      <label class="sr-only" for="career-search">Search careers</label>
      <input type="search" id="career-search" placeholder="Try “nurse”, “engineer”, “law”…" autocomplete="off">
    </div>
    <div class="chip-row" id="sector-filters" role="group" aria-label="Filter by area">
      <button class="chip" type="button" data-sector="" aria-pressed="true">All</button>
      ${sectors.map((s) => `<button class="chip" type="button" data-sector="${esc(s)}" aria-pressed="false">${iconOrEmoji(SECTOR_EMOJI[s] || '')} ${esc(s)}</button>`).join('')}
    </div>
  </div>
</section>

<section class="section wrap">
  ${sectors.map((sector) => `
  <div class="sector-block" data-sector="${esc(sector)}">
    <h2 class="sector-title"><span aria-hidden="true">${SECTOR_EMOJI[sector] || ''}</span> ${esc(sector)}</h2>
    <div class="grid grid--3">
      ${careers.filter((c) => c.sector === sector).map((c) => `
      <a class="card card--link career-card" href="/careers/${esc(c.id)}" data-name="${esc(c.name.toLowerCase())}" data-text="${esc((c.name + ' ' + c.description).toLowerCase())}" data-sector="${esc(sector)}">
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.description)}</p>
        <p class="card__meta">${counts[c.id].programs ? `${plural(counts[c.id].programs, 'degree', 'degrees')} at ${plural(counts[c.id].unis, 'university', 'universities')}` : 'Degrees being added'}</p>
      </a>`).join('')}
    </div>
  </div>`).join('')}
  <p class="empty" id="career-empty" hidden>Nothing matched that. Try a different word.</p>
</section>`;

  return [{
    path: '/careers',
    title: 'Career explorer – which degree leads to which job in South Africa',
    description: `Browse ${careers.length} careers, see the degrees that lead to each one at South African universities, and the real admission requirements – with the official source for every number.`,
    body,
    scripts: ['/assets/js/careers.js'],
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }],
  }];
}

export function careerPages(data) {
  const { careers, programs, uniById } = data;
  return careers.map((career) => {
    const list = programs.filter((p) => p.career && p.career.id === career.id);
    const byUni = {};
    for (const p of list) (byUni[p.university.id] ||= []).push(p);
    const uniIds = Object.keys(byUni).sort((a, b) => uniById[a].name.localeCompare(uniById[b].name));
    const demand = subjectDemand(list);

    const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow"><a href="/careers">Careers</a> › ${esc(career.sector)}</p>
    <h1>${iconOrEmoji(SECTOR_EMOJI[career.sector] || '')} How to become a ${esc(career.name)}</h1>
    <p class="lead">${esc(career.description)}</p>
  </div>
</section>

${career.gate ? `<section class="section wrap wrap--narrow" style="padding-bottom:0">
  <div class="callout callout--warn">
    <h3>${iconOrEmoji('🎓')} This needs more than the degree</h3>
    <p>${md(career.gate)}</p>
  </div>
</section>` : ''}
${career.urgent ? `<section class="section wrap wrap--narrow" style="padding-bottom:0">
  <div class="callout callout--warn">
    <h3>${iconOrEmoji('⏰')} Apply early</h3>
    <p>${md(career.urgent)} See the <a href="/dates">Dates page</a> for the exact closing dates.</p>
  </div>
</section>` : ''}

<section class="section wrap wrap--narrow">
  <details class="card career-more">
    <summary><h2 class="h3">What does a ${esc(career.name)} actually do?</h2><span class="career-more__hint">More about this career <span class="career-more__chevron" aria-hidden="true">▾</span></span></summary>
    <div class="career-more__body">
      ${career.whatTheyDo ? `<p>${md(career.whatTheyDo)}</p>` : ''}
      ${(career.relatedRoles || []).length ? `<h4>Where this degree can take you</h4><ul class="pill-list">${career.relatedRoles.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
      ${claim({ level: 'general', text: 'This is our general description of the role and related jobs, not from an official source – it’s here to give you a fuller picture, not as a careers-counselling guarantee.' })}
    </div>
  </details>
</section>

${(career.specializations || []).length ? `<section class="section wrap wrap--narrow">
  <details class="card career-more">
    <summary><h2 class="h3">Specialising after the ${esc(career.name)} degree</h2><span class="career-more__hint">${plural(career.specializations.length, 'specialty', 'specialties')} <span class="career-more__chevron" aria-hidden="true">▾</span></span></summary>
    <div class="career-more__body">
      ${career.specializationPath ? `<p>${md(career.specializationPath)}</p>` : ''}
      ${Object.entries(career.specializations.reduce((groups, s) => {
        (groups[s.category || 'Specialties'] ||= []).push(s);
        return groups;
      }, {})).map(([category, items]) => `
      <h4>${esc(category)}</h4>
      <ul class="specialty-list">${items.map((s) => `<li><strong>${esc(s.name)}</strong> <span class="muted">– ${esc(s.duration)}</span><br>${esc(s.description)}</li>`).join('')}</ul>`).join('')}
      ${claim({ level: 'general', text: career.specializationsNote || 'This is our general description of this field’s specialities, not from an official source.' })}
    </div>
  </details>
</section>` : ''}

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Subjects that usually help</h2>
    <ul class="pill-list">${career.typical_subjects.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    ${claim({ level: 'general', text: 'This is our general guidance about which school subjects suit this career. It is **not** an admission requirement and not from an official source – the real requirements are on the degrees below.' })}
    ${checksBox([{ label: 'The subject requirements on the degree pages below', url: '#degrees' }, { label: 'Your school’s guidance teacher', url: null }])}
  </div>
  ${demand.length ? `<div class="card">
    <h2 class="h3">What the degrees we’ve captured actually ask for</h2>
    <ul class="demand">${demand.slice(0, 6).map(([subject, n]) => `<li><strong>${esc(subject)}</strong> <span class="muted">– asked for by ${n} of ${list.length} degrees</span><span class="demand__bar"><span style="width:${Math.round((n / list.length) * 100)}%"></span></span></li>`).join('')}</ul>
    <p class="small muted">Counted from the requirements below (an “or” alternative counts for each subject named). Each degree links to the page it came from.</p>
  </div>` : ''}
</section>

<section class="section wrap" id="degrees">
  ${sectionHead('🎓', 'Degrees that lead here', list.length ? `${plural(list.length, 'degree', 'degrees')} at ${plural(uniIds.length, 'university', 'universities')}. More are added as we verify them.` : '')}
  ${list.length === 0
    ? `<p class="empty">We haven’t captured a verified degree for this career yet. It’s queued for the next data pass – we only publish a programme once we have it from an official source.</p>`
    : uniIds.map((id) => `
  <h3 class="uni-head"><a href="/universities/${esc(id)}">${esc(uniById[id].name)}</a></h3>
  <div class="grid grid--2">${byUni[id].map((p) => programCard(p, { showUniversity: false })).join('')}</div>`).join('')}
</section>

<section class="section wrap wrap--narrow">
  <div class="callout callout--good">
    <h3>Are your marks enough?</h3>
    <p>Put your subjects in once and we’ll check them against every degree above – scored each university’s own way.</p>
    <p><a class="btn btn--primary" href="/calculator">What do I qualify for?</a></p>
  </div>
</section>`;

    return {
      path: `/careers/${career.id}`,
      title: `How to become a ${career.name} in South Africa – subjects, APS and degrees`,
      description: `What to study to become a ${career.name} in South Africa: ${list.length} verified degree${list.length === 1 ? '' : 's'} with their real admission requirements and the official source for each.`,
      body,
      breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }, { name: career.name, path: `/careers/${career.id}` }],
      jsonLd: [{
        '@context': 'https://schema.org', '@type': 'ItemList', name: `Degrees that lead to ${career.name} in South Africa`, numberOfItems: list.length,
        itemListElement: list.slice(0, 50).map((p, i) => ({
          '@type': 'ListItem', position: i + 1,
          item: { '@type': 'Course', name: p.name, description: `${p.name} at ${p.university.name}`, provider: { '@type': 'CollegeOrUniversity', name: p.university.name, url: p.university.website }, url: p.sourceUrl },
        })),
      }],
    };
  });
}
