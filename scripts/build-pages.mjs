// Generates the data-driven pages as REAL STATIC HTML, plus robots/sitemap.
//
// Why static rather than fetching from the API in the browser: these are the pages that
// have to rank. "What APS do I need for BCom at UP" is the search a 17-year-old actually
// types, and a page that renders its content in JavaScript competes with one hand tied
// behind its back. Everything here ships as HTML with the numbers and the source links
// already in the markup.
//
// It builds from db/data/*.mjs - the same source the database is seeded from - so the
// pages and the API can never drift apart. Run `npm run build` after any data change.

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { universities } from '../db/data/universities.mjs';
import { careers } from '../db/data/careers.mjs';
import { uctPrograms } from '../db/data/programs-uct.mjs';
import { witsPrograms } from '../db/data/programs-wits.mjs';
import { suPrograms } from '../db/data/programs-su.mjs';
import { upPrograms } from '../db/data/programs-up.mjs';
import { ukznPrograms } from '../db/data/programs-ukzn.mjs';
import { otherPrograms } from '../db/data/programs-other.mjs';
import { researchLog } from '../db/data/research-log.mjs';
import { SCORING_SYSTEMS, LEVEL_FLOOR } from '../src/scoring.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public');

// Placeholder until the real domain lands. Keep in step with wrangler.toml SITE_ORIGIN.
const ORIGIN = process.env.SITE_ORIGIN || 'https://studypath.example';

const programs = [...uctPrograms, ...witsPrograms, ...suPrograms, ...upPrograms, ...ukznPrograms, ...otherPrograms];
const uniById = Object.fromEntries(universities.map((u) => [u.id, u]));
const careerById = Object.fromEntries(careers.map((c) => [c.id, c]));

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const FLAG_LABELS = {
  conflict: ['Sources disagree', 'warn'],
  unverified: ['Not fully verified', 'warn'],
  'partially-verified': ['Partly verified', 'warn'],
  'dated-document': ['From an older document', 'info'],
  selection: ['Selection programme', 'info'],
  'no-cutoff-published': ['No cut-off published', 'info'],
};

function splitFlags(notes) {
  let rest = notes || '';
  const flags = [];
  for (;;) {
    const m = rest.match(/^\s*\[([a-z-]+)\]\s*/);
    if (!m || !FLAG_LABELS[m[1]]) break;
    flags.push(m[1]);
    rest = rest.slice(m[0].length);
  }
  return { flags, notes: rest.trim() };
}

function requirementText(req) {
  if (req.label) return req.label + (req.note ? ` — ${req.note}` : '');
  if (req.any_of) return req.any_of.map(requirementText).join(' OR ');
  if (req.all_of) return req.all_of.map(requirementText).join(' AND ');
  if (req.subject === 'English' && (req.hl_min_percent != null || req.hl_min_level != null)) {
    const hl = req.hl_min_percent != null ? `${req.hl_min_percent}%` : `level ${req.hl_min_level}`;
    const fal = req.fal_min_percent != null ? `${req.fal_min_percent}%` : `level ${req.fal_min_level}`;
    return `English: ${hl} if it is your Home Language, ${fal} if it is your First Additional Language`;
  }
  if (req.min_percent != null) return `${req.subject}: ${req.min_percent}%`;
  if (req.min_level != null) return `${req.subject}: level ${req.min_level} (${LEVEL_FLOOR[req.min_level]}% or more)`;
  return req.subject || '';
}

const hostOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } };

const NAV = `
    <nav class="nav" aria-label="Main">
      <a href="/careers.html">Careers</a>
      <a href="/universities.html">Universities</a>
      <a href="/nbt.html">The NBT</a>
      <a href="/bursaries.html">Bursaries</a>
      <a href="/study-abroad.html">Study abroad</a>
      <a href="/data-sources.html">Where our data comes from</a>
      <a class="nav__cta" href="/calculator.html">Check my marks</a>
    </nav>`;

const FOOTER = `
<footer class="site-footer">
  <div class="wrap">
    <nav aria-label="Footer">
      <a href="/careers.html">Careers</a>
      <a href="/calculator.html">Calculator</a>
      <a href="/universities.html">Universities</a>
      <a href="/nbt.html">The NBT</a>
      <a href="/bursaries.html">Bursaries</a>
      <a href="/study-abroad.html">Study abroad</a>
      <a href="/data-sources.html">Data &amp; sources</a>
    </nav>
    <p class="small">Always confirm on the university's own page before you rely on anything &mdash; that's why we link to it every time.</p>
  </div>
</footer>`;

function page({ path, title, description, body, jsonLd, breadcrumbs }) {
  const url = `${ORIGIN}${path}`;
  const crumbLd = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${ORIGIN}${c.path}` })),
  } : null;

  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Studypath">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:locale" content="en_ZA">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2f3e9e">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/css/site.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
${crumbLd ? `<script type="application/ld+json">${JSON.stringify(crumbLd)}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="logo" href="/"><span class="logo__mark">SP</span> Studypath</a>${NAV}
  </div>
</header>
<main id="main">
${body}
</main>
${FOOTER}
<script type="module" src="/assets/js/core.js"></script>
</body>
</html>
`;
}

/** One programme, as static HTML, with its citation always visible. */
function programCardHtml(program, { showUniversity = true } = {}) {
  const { flags, notes } = splitFlags(program.notes);
  const uni = uniById[program.university_id];
  const system = SCORING_SYSTEMS[program.scoring_system] || {};

  const meta = [
    showUniversity ? (uni.short_name || uni.name) : null,
    program.faculty,
    program.duration_years ? `${program.duration_years} years` : null,
  ].filter(Boolean).join(' · ');

  const badges = flags.map((f) => {
    const [label, tone] = FLAG_LABELS[f];
    return `<span class="badge badge--${tone}">${esc(label)}</span>`;
  }).join('');

  const score = program.min_aps != null
    ? `<p><strong>${esc(system.label || program.scoring_system)}: ${program.min_aps}${system.unit ? ' ' + esc(system.unit) : ''}</strong>${
        program.score_type && program.score_type !== 'minimum' ? ` (${esc(program.score_type.replace('_', ' '))})` : ''}</p>`
    : `<p class="muted">No points cut-off published for this one &mdash; read the note below.</p>`;

  const reqs = (program.subject_requirements || []).length
    ? `<ul class="req-list">${program.subject_requirements.map((r) => `<li><span class="mark">&bull;</span><span>${esc(requirementText(r))}</span></li>`).join('')}</ul>`
    : '';

  return `<article class="card" id="${esc(program.id)}">
  ${badges ? `<div class="badge-row">${badges}</div>` : ''}
  <h3>${esc(program.name)}</h3>
  <p class="card__meta">${esc(meta)}</p>
  ${score}
  ${reqs}
  ${notes ? `<p class="small muted">${esc(notes)}</p>` : ''}
  <p class="source"><span class="source__label">Source:</span> <span><a href="${esc(program.source_url)}" target="_blank" rel="noopener">View the official page (${esc(hostOf(program.source_url))})</a>${
    program.intake_year ? ` &middot; ${program.intake_year} intake` : ''}</span></p>
</article>`;
}

// ---------------------------------------------------------------------------
// careers
// ---------------------------------------------------------------------------

function buildCareersIndex() {
  const bySector = {};
  for (const c of careers) (bySector[c.sector] ||= []).push(c);

  const counts = Object.fromEntries(careers.map((c) => {
    const list = programs.filter((p) => p.career_id === c.id);
    return [c.id, { programs: list.length, universities: new Set(list.map((p) => p.university_id)).size }];
  }));

  const sectors = Object.keys(bySector).sort();

  const body = `
  <section class="hero wrap">
    <p class="eyebrow">Start here if you're not sure yet</p>
    <h1>What do you want to do?</h1>
    <p class="lead">
      Browse ${careers.length} careers by the kind of work they are. Each one shows the school
      subjects that usually lead there, and the actual degrees that get you in &mdash; with the
      real requirements, from the university's own page.
    </p>
    <div class="filters" style="margin-top:1.5rem">
      <label class="sr-only" for="career-search">Search careers</label>
      <input type="search" id="career-search" placeholder="Search &mdash; try &quot;nurse&quot; or &quot;engineer&quot;" style="flex:1;min-width:240px">
    </div>
    <div class="chip-row" id="sector-filters">
      <button class="chip" type="button" data-sector="" aria-pressed="true">All</button>
      ${sectors.map((s) => `<button class="chip" type="button" data-sector="${esc(s)}" aria-pressed="false">${esc(s)}</button>`).join('')}
    </div>
  </section>

  <section class="section wrap">
    ${sectors.map((sector) => `
    <div class="sector-block" data-sector="${esc(sector)}">
      <h2>${esc(sector)}</h2>
      <div class="grid grid--3">
        ${bySector[sector].map((c) => `
        <a class="card career-card" href="/careers/${esc(c.id)}.html" data-name="${esc(c.name.toLowerCase())}" data-sector="${esc(sector)}">
          <h3>${esc(c.name)}</h3>
          <p>${esc(c.description)}</p>
          <p class="card__meta">${counts[c.id].programs} degree${counts[c.id].programs === 1 ? '' : 's'} at ${counts[c.id].universities} universit${counts[c.id].universities === 1 ? 'y' : 'ies'}</p>
        </a>`).join('')}
      </div>
    </div>`).join('')}
    <p class="empty" id="career-empty" hidden>Nothing matched that. Try a different word.</p>
  </section>

  <script>
  (function () {
    var search = document.getElementById('career-search');
    var chips = document.querySelectorAll('#sector-filters .chip');
    var cards = document.querySelectorAll('.career-card');
    var blocks = document.querySelectorAll('.sector-block');
    var empty = document.getElementById('career-empty');
    var sector = '';

    function apply() {
      var q = (search.value || '').trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var ok = (!sector || card.dataset.sector === sector) && (!q || card.dataset.name.indexOf(q) !== -1);
        card.hidden = !ok;
        if (ok) shown++;
      });
      blocks.forEach(function (block) {
        block.hidden = ![].slice.call(block.querySelectorAll('.career-card')).some(function (c) { return !c.hidden; });
      });
      empty.hidden = shown !== 0;
    }
    search.addEventListener('input', apply);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        sector = chip.dataset.sector;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        apply();
      });
    });
  })();
  </script>`;

  writeFileSync(join(OUT, 'careers.html'), page({
    path: '/careers.html',
    title: 'Career explorer — which degree leads to which job in South Africa | Studypath',
    description: `Browse ${careers.length} careers, see the school subjects that lead to each one, and find the South African degrees that get you there — with real admission requirements from official university sources.`,
    body,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers.html' }],
  }));
}

function buildCareerPages() {
  mkdirSync(join(OUT, 'careers'), { recursive: true });
  for (const career of careers) {
    const list = programs.filter((p) => p.career_id === career.id);
    const byUni = {};
    for (const p of list) (byUni[p.university_id] ||= []).push(p);
    const uniIds = Object.keys(byUni).sort((a, b) => uniById[a].name.localeCompare(uniById[b].name));

    const body = `
  <section class="hero wrap wrap--narrow">
    <p class="eyebrow"><a href="/careers.html">Careers</a> &rsaquo; ${esc(career.sector)}</p>
    <h1>How to become a ${esc(career.name)}</h1>
    <p class="lead">${esc(career.description)}</p>
  </section>

  <section class="wrap wrap--narrow">
    <div class="card">
      <h2 style="margin-top:0;font-size:1.15rem">School subjects that usually help</h2>
      <ul>${career.typical_subjects.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <p class="small muted" style="margin-bottom:0">
        This is general guidance, not an admission requirement. The real requirements are on
        each degree below, and every one of them links to the university page that states it.
      </p>
    </div>
  </section>

  <section class="section wrap">
    <h2>Degrees that lead here</h2>
    ${list.length === 0
      ? `<p class="empty">We haven't captured a verified degree for this career yet. It's queued for the next data pass &mdash; we only publish a programme once we have it from an official source.</p>`
      : `<p class="small muted">${list.length} programme${list.length === 1 ? '' : 's'} at ${uniIds.length} universit${uniIds.length === 1 ? 'y' : 'ies'}. More are added twice a week.</p>
    ${uniIds.map((id) => `
    <h3 style="margin-top:2rem"><a href="/universities/${esc(id)}.html">${esc(uniById[id].name)}</a></h3>
    <div class="grid grid--2">${byUni[id].map((p) => programCardHtml(p, { showUniversity: false })).join('')}</div>`).join('')}`}
  </section>

  <section class="section wrap wrap--narrow">
    <div class="callout">
      <h3>Want to know if your marks are enough?</h3>
      <p>Put your subjects in once and we'll check them against every programme above, using each university's own way of counting.</p>
      <p style="margin-bottom:0"><a class="btn btn--primary" href="/calculator.html">Check my marks</a></p>
    </div>
  </section>`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Degrees that lead to ${career.name} in South Africa`,
      numberOfItems: list.length,
      itemListElement: list.slice(0, 50).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Course',
          name: p.name,
          description: `${p.name} at ${uniById[p.university_id].name}`,
          provider: { '@type': 'CollegeOrUniversity', name: uniById[p.university_id].name, url: uniById[p.university_id].website },
          url: p.source_url,
        },
      })),
    };

    writeFileSync(join(OUT, 'careers', `${career.id}.html`), page({
      path: `/careers/${career.id}.html`,
      title: `How to become a ${career.name} in South Africa — subjects, APS and degrees | Studypath`,
      description: `What you need to study to become a ${career.name} in South Africa: the school subjects that help, and ${list.length} verified degree${list.length === 1 ? '' : 's'} with their real admission requirements and official sources.`,
      body,
      jsonLd,
      breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers.html' }, { name: career.name, path: `/careers/${career.id}.html` }],
    }));
  }
}

// ---------------------------------------------------------------------------
// universities
// ---------------------------------------------------------------------------

function buildUniversitiesIndex() {
  const withData = universities
    .map((u) => ({ u, list: programs.filter((p) => p.university_id === u.id) }))
    .filter((x) => x.list.length)
    .sort((a, b) => b.list.length - a.list.length);

  const notYet = researchLog.filter((r) => r.id.startsWith('not-researched-'));

  const body = `
  <section class="hero wrap">
    <p class="eyebrow">${withData.length} of South Africa's 26 public universities, so far</p>
    <h1>Universities and what they actually require</h1>
    <p class="lead">
      Every university counts your marks differently. Pick one to see how it scores you, which
      degrees it offers, and exactly what each one needs &mdash; with the official source next
      to every number.
    </p>
  </section>

  <section class="section wrap">
    <div class="grid grid--3">
      ${withData.map(({ u, list }) => {
        const sys = [...new Set(list.map((p) => p.scoring_system))].map((id) => SCORING_SYSTEMS[id] || {});
        return `<a class="card" href="/universities/${esc(u.id)}.html">
          <h3>${esc(u.name)}</h3>
          <p>${esc(sys.map((x) => x.label).filter(Boolean).join(' + '))}${sys.every((x) => x.computable === false) ? ' &mdash; we do not calculate this one' : ''}</p>
          <p class="card__meta">${list.length} programmes &middot; ${new Set(list.map((p) => p.faculty)).size} faculties</p>
        </a>`;
      }).join('')}
    </div>
  </section>

  <section class="section wrap">
    <h2>Not on here yet</h2>
    <p>
      We publish a university only once we've captured its requirements from its own official
      sources. These ${notYet.length} are queued for the recurring data pass:
    </p>
    <p>${notYet.map((r) => esc(r.faculty_or_program.replace(' - all programmes', ''))).join(' &middot; ')}</p>
    <p class="small muted">
      We'd rather show you a short honest list than a long one padded with numbers we guessed.
      <a href="/data-sources.html">See exactly what's missing and why →</a>
    </p>
  </section>`;

  writeFileSync(join(OUT, 'universities.html'), page({
    path: '/universities.html',
    title: 'South African university admission requirements, by university | Studypath',
    description: 'Admission requirements and APS for South African universities — UCT, Wits, Stellenbosch, UP, UKZN, UJ, UWC, Rhodes, NWU and UFS. Every requirement linked to the official university page or PDF.',
    body,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Universities', path: '/universities.html' }],
  }));
}

function buildUniversityPages() {
  mkdirSync(join(OUT, 'universities'), { recursive: true });
  for (const u of universities) {
    const list = programs.filter((p) => p.university_id === u.id);
    if (!list.length) continue;

    const byFaculty = {};
    for (const p of list) (byFaculty[p.faculty || 'Other'] ||= []).push(p);
    const faculties = Object.keys(byFaculty).sort();

    // A university can score different faculties differently (Wits: APS for most, a
    // Composite Index for Health Sciences), so describe every system it actually uses.
    const systems = [...new Set(list.map((p) => p.scoring_system))].map((id) => [id, SCORING_SYSTEMS[id] || {}]);
    const gaps = researchLog.filter((r) => r.university_id === u.id);

    const body = `
  <section class="hero wrap">
    <p class="eyebrow"><a href="/universities.html">Universities</a></p>
    <h1>${esc(u.name)}</h1>
    <p class="lead">
      ${list.length} degree programmes captured from ${esc(u.short_name || u.name)}'s own official
      sources, across ${faculties.length} faculties.
    </p>
    <p><a href="${esc(u.website)}" target="_blank" rel="noopener">${esc(hostOf(u.website))}</a></p>
  </section>

  <section class="wrap">
    <h2 style="font-size:1.2rem">How ${esc(u.short_name || u.name)} scores you</h2>
    <div class="grid grid--2">
    ${systems.map(([, system]) => `<div class="card">
      <h3>${esc(system.label || '')}</h3>
      <p>${esc(system.explanation || '')}</p>
      ${system.computable === false
        ? `<div class="callout callout--warn"><p style="margin:0">${esc(system.reason || '')}</p></div>`
        : `<p class="small muted">Our calculator works this out for you from your marks.</p>`}
      <p class="small"><strong>This score means nothing at another university.</strong> It cannot be compared with any other university's score &mdash; they measure different things.</p>
      ${system.sourceUrl ? `<p class="source"><span class="source__label">Source:</span> <span><a href="${esc(system.sourceUrl)}" target="_blank" rel="noopener">View the official page (${esc(hostOf(system.sourceUrl))})</a></span></p>` : ''}
    </div>`).join('')}
    </div>
  </section>

  <section class="section wrap">
    <h2>Programmes</h2>
    ${faculties.map((f) => `
    <h3 style="margin-top:2rem">${esc(f)}</h3>
    <div class="grid grid--2">${byFaculty[f].map((p) => programCardHtml(p, { showUniversity: false })).join('')}</div>`).join('')}
  </section>

  ${gaps.length ? `
  <section class="section wrap">
    <h2>What we couldn't verify at ${esc(u.short_name || u.name)}</h2>
    <p>We publish our gaps rather than hiding them. These are the things we tried to confirm and couldn't.</p>
    <div class="grid grid--2">
      ${gaps.map((g) => `<div class="card">
        <div class="badge-row"><span class="badge badge--${g.status === 'could_not_verify' ? 'bad' : g.status === 'partially_verified' ? 'warn' : 'good'}">${esc(g.status.replace(/_/g, ' '))}</span></div>
        <h4 style="margin:0 0 .3rem;font-size:1rem">${esc(g.faculty_or_program)}</h4>
        <p class="small muted" style="margin:0">${esc(g.notes)}</p>
      </div>`).join('')}
    </div>
  </section>` : ''}

  <section class="section wrap wrap--narrow">
    <div class="callout">
      <h3>Do your marks get you in here?</h3>
      <p>Enter your subjects once and we'll check them against every ${esc(u.short_name || u.name)} programme above.</p>
      <p style="margin-bottom:0"><a class="btn btn--primary" href="/calculator.html">Check my marks</a></p>
    </div>
  </section>`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollegeOrUniversity',
      name: u.name,
      alternateName: u.short_name,
      url: u.website,
      address: { '@type': 'PostalAddress', addressCountry: 'ZA' },
    };

    writeFileSync(join(OUT, 'universities', `${u.id}.html`), page({
      path: `/universities/${u.id}.html`,
      title: `${u.name} (${u.short_name}) admission requirements and APS | Studypath`,
      description: `${u.name} admission requirements for ${list.length} undergraduate programmes: the APS or score you need, subject minimums, and a link to the official ${u.short_name} source for every number.`,
      body,
      jsonLd,
      breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Universities', path: '/universities.html' }, { name: u.name, path: `/universities/${u.id}.html` }],
    }));
  }
}

// ---------------------------------------------------------------------------
// robots + sitemap
// ---------------------------------------------------------------------------

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ['/', '1.0', 'weekly'],
    ['/calculator.html', '0.9', 'weekly'],
    ['/careers.html', '0.9', 'weekly'],
    ['/universities.html', '0.9', 'weekly'],
    ['/nbt.html', '0.8', 'monthly'],
    ['/bursaries.html', '0.8', 'daily'],
    ['/study-abroad.html', '0.6', 'monthly'],
    ['/data-sources.html', '0.6', 'weekly'],
    ...careers.map((c) => [`/careers/${c.id}.html`, '0.7', 'weekly']),
    ...universities.filter((u) => programs.some((p) => p.university_id === u.id))
      .map((u) => [`/universities/${u.id}.html`, '0.8', 'weekly']),
  ];

  writeFileSync(join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(([loc, priority, freq]) =>
      `  <url><loc>${ORIGIN}${loc}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`
    ).join('\n') +
    `\n</urlset>\n`);

  writeFileSync(join(OUT, 'robots.txt'),
    `# Studypath\nUser-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

  return urls.length;
}

// ---------------------------------------------------------------------------

mkdirSync(OUT, { recursive: true });
buildCareersIndex();
buildCareerPages();
buildUniversitiesIndex();
buildUniversityPages();
const urlCount = buildSitemap();

console.log(
  `Built ${careers.length} career pages, ` +
  `${universities.filter((u) => programs.some((p) => p.university_id === u.id)).length} university pages, ` +
  `careers.html, universities.html, robots.txt and a sitemap with ${urlCount} URLs.`
);
console.log(`Origin used: ${ORIGIN} (override with SITE_ORIGIN=... once the domain is bought)`);
