// The page shell: <head>, header, mobile tab bar and footer. Every page goes through
// renderPage(), so a navigation change is made in exactly one place.

import { esc } from './html.mjs';

export const ORIGIN = (process.env.SITE_ORIGIN || 'https://studypath.co.za').replace(/\/$/, '');
export const SITE_NAME = 'Studypath';

/** Main navigation on desktop. Kept short: it is what a 16-year-old actually needs. */
export const NAV = [
  ['/careers.html', 'Careers'],
  ['/universities.html', 'Universities'],
  ['/grade-10-subjects.html', 'Choose subjects'],
  ['/dates.html', 'Dates'],
  ['/nbt.html', 'The NBT'],
  ['/bursaries.html', 'Money'],
  ['/faq.html', 'FAQ'],
];

/** Everything else, for the "More" sheet on phones and the footer. */
export const MORE = [
  ['/universities.html', '\ud83c\udfeb', 'Universities'],
  ['/grade-10-subjects.html', '\ud83e\udde0', 'Choose your subjects'],
  ['/nbt.html', '\u270d\ufe0f', 'The NBT explained'],
  ['/bursaries.html', '\ud83d\udcb0', 'Money & bursaries'],
  ['/faq.html', '\u2753', 'FAQ'],
  ['/ask-a-university.html', '\ud83d\udcde', 'Ask a university'],
  ['/ask.html', '\ud83d\udcac', 'Ask us a question'],
  ['/study-abroad.html', '\ud83c\udf0d', 'Study abroad'],
  ['/data-sources.html', '\ud83d\udd0e', 'Where our data comes from'],
  ['/privacy.html', '\ud83d\udd12', 'Privacy'],
];

const TABS = [
  ['/', '\ud83c\udfe0', 'Home'],
  ['/careers.html', '\ud83e\udded', 'Careers'],
  ['/calculator.html', '\ud83e\uddee', 'My marks', true],
  ['/dates.html', '\ud83d\udcc5', 'Dates'],
];

const isHere = (path, href) => (href === '/' ? path === '/' : path === href || path.startsWith(href.replace(/\.html$/, '/')));
const cur = (path, href) => (isHere(path, href) ? ' aria-current="page"' : '');

function jsonLdScripts(blocks) {
  return (blocks || []).filter(Boolean).map((b) =>
    `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`).join('\n');
}

export function breadcrumbLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${ORIGIN}${c.path}` })),
  };
}

/**
 * @param {object} p
 * @param {string} p.path         e.g. "/faq.html"
 * @param {string} p.title        <title> - keep it a real, specific phrase
 * @param {string} p.description  meta description (~150 chars)
 * @param {string} p.body         inner HTML of <main>
 * @param {string[]} [p.scripts]  page-specific module scripts
 * @param {object[]} [p.jsonLd]   structured-data blocks
 * @param {{name:string,path:string}[]} [p.breadcrumbs]
 */
export function renderPage({ path, title, description, body, scripts = [], jsonLd = [], breadcrumbs, ogType = 'website', noindex = false, pageClass = '' }) {
  const url = `${ORIGIN}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const ld = [...jsonLd, breadcrumbs ? breadcrumbLd(breadcrumbs) : null];

  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:locale" content="en_ZA">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#3a35c8">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/css/site.css">
${jsonLdScripts(ld)}
</head>
<body${pageClass ? ` class="${pageClass}"` : ''}>
<a class="skip" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="logo" href="/" aria-label="Studypath home"><span class="logo__mark" aria-hidden="true">SP</span><span class="logo__text">Studypath</span></a>
    <nav class="nav" aria-label="Main">
      ${NAV.map(([href, label]) => `<a href="${href}"${cur(path, href)}>${esc(label)}</a>`).join('\n      ')}
      <a class="nav__cta" href="/calculator.html"${cur(path, '/calculator.html')}>What do I qualify for?</a>
    </nav>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="site-footer">
  <div class="wrap">
    <div class="site-footer__grid">
      <div>
        <p class="site-footer__brand">Studypath</p>
        <p class="small">Free and independent help for South African learners choosing what to study. We are not a university and cannot apply for you.</p>
        <p class="small"><strong>Always confirm on the university\u2019s own page before you rely on anything</strong> \u2013 that is why we link to it every time.</p>
      </div>
      <nav aria-label="Footer">
        ${MORE.map(([href, , label]) => `<a href="${href}">${esc(label)}</a>`).join('\n        ')}
      </nav>
    </div>
  </div>
</footer>

<nav class="tabbar" aria-label="Quick navigation">
  ${TABS.map(([href, icon, label, big]) =>
    `<a class="tab${big ? ' tab--main' : ''}" href="${href}"${cur(path, href)}><span class="tab__i" aria-hidden="true">${icon}</span><span class="tab__l">${esc(label)}</span></a>`).join('\n  ')}
  <details class="tab tab--more">
    <summary><span class="tab__i" aria-hidden="true">\u22ef</span><span class="tab__l">More</span></summary>
    <div class="sheet" role="menu">
      ${MORE.map(([href, icon, label]) => `<a role="menuitem" href="${href}"><span aria-hidden="true">${icon}</span> ${esc(label)}</a>`).join('\n      ')}
    </div>
  </details>
</nav>

<script type="module" src="/assets/js/app.js"></script>
${scripts.map((s) => `<script type="module" src="${s}"></script>`).join('\n')}
</body>
</html>
`;
}
