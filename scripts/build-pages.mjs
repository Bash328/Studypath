// Builds the whole static site into public/.
//
//   npm run build
//
// Everything is generated from db/data/*.mjs and site/, so the pages, the JSON the browser
// reads and the API's seed can never drift apart. The output is plain files: it works on
// GitHub Pages, Cloudflare, or anywhere else that serves static files. Only the two forms
// (reminders, questions) need the optional API - see README.

import { mkdirSync, writeFileSync, rmSync, copyFileSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { loadData, ASK_TOPICS } from '../site/lib/data.mjs';
import { renderPage, ORIGIN } from '../site/lib/layout.mjs';
import { home } from '../site/pages/home.mjs';
import { calculator } from '../site/pages/calculator.mjs';
import { careersIndex, careerPages } from '../site/pages/careers.mjs';
import { universitiesIndex, universityPages } from '../site/pages/universities.mjs';
import { grade10Page } from '../site/pages/grade10.mjs';
import { faqPage, askPage, plain, answerText } from '../site/pages/faq.mjs';
import { askUniversityPage } from '../site/pages/askuni.mjs';
import { datesPage } from '../site/pages/dates.mjs';
import { nbtPage } from '../site/pages/nbt.mjs';
import { moneyPage } from '../site/pages/money.mjs';
import { abroadPage } from '../site/pages/abroad.mjs';
import { dataSourcesPage } from '../site/pages/datasources.mjs';
import { privacyPage, notFoundPage } from '../site/pages/misc.mjs';
import { weakestLevel } from '../site/lib/html.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const write = (rel, content) => {
  const file = join(PUBLIC, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
};

const data = loadData();

// Start clean so a removed career or university can't leave a stale page behind.
for (const dir of ['careers', 'universities']) rmSync(join(PUBLIC, dir), { recursive: true, force: true });

// ---------------------------------------------------------------- pages
const pages = [
  ...home(data), ...calculator(data),
  ...careersIndex(data), ...careerPages(data),
  ...universitiesIndex(data), ...universityPages(data),
  ...grade10Page(data), ...faqPage(data), ...askPage(), ...askUniversityPage(data),
  ...datesPage(data), ...nbtPage(data), ...moneyPage(data), ...abroadPage(),
  ...dataSourcesPage(data), ...privacyPage(), ...notFoundPage(),
];

for (const page of pages) {
  const rel = page.path === '/' ? 'index.html' : page.path.replace(/^\//, '') + '.html';
  write(rel, renderPage(page));
}

// ---------------------------------------------------------------- data for the browser
const json = (rel, obj) => write(rel, JSON.stringify(obj));

json('data/programs.json', { generated: new Date().toISOString(), programs: data.programs });
json('data/careers.json', { careers: data.careers.map((c) => ({ id: c.id, name: c.name, sector: c.sector, description: c.description, typicalSubjects: c.typical_subjects })) });
json('data/dates.json', {
  cycle: 'Dates for the 2027 intake. The 2028 dates have not been published.',
  dates: data.dates.map((d) => ({ ...d, university: d.university_id ? data.uniById[d.university_id].short_name : null })),
});
json('data/contacts.json', {
  topics: ASK_TOPICS,
  universities: data.universities.map((u) => ({ id: u.id, name: u.name, short: u.short_name, website: u.website, type: u.type, cao: !!u.cao, hasRequirements: u.hasRequirements })),
  contacts: data.contacts,
  fees: data.fees,
  dates: data.dates.filter((d) => d.kind === 'close' || d.kind === 'open').map((d) => ({ university_id: d.university_id, title: d.title, date: d.date, date_end: d.date_end, applies_to: d.applies_to, verification: d.verification })),
});
json('data/faq.json', {
  faq: data.faq.map((f) => ({ id: f.id, category: f.category, question: f.question, text: answerText(f), level: weakestLevel(f.answer) })),
});

// ---------------------------------------------------------------- the shared engine
// The calculator runs in the browser using the SAME modules the Worker uses, so the
// two can never disagree. These are copies, regenerated on every build.
const engine = ['subjects.js', 'scoring-audit.js', 'scoring.js', 'qualify-core.js'];
mkdirSync(join(PUBLIC, 'assets/js/engine'), { recursive: true });
for (const f of engine) copyFileSync(join(ROOT, 'src', f), join(PUBLIC, 'assets/js/engine', f));

// ---------------------------------------------------------------- sitemap + robots
const today = new Date().toISOString().slice(0, 10);
const priority = (p) => (p === '/' ? '1.0' : /^\/(calculator|careers|universities|dates|grade-10-subjects)$/.test(p) ? '0.9' : /^\/(careers|universities)\//.test(p) ? '0.7' : '0.6');
const indexable = pages.filter((p) => !p.noindex);
write('sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  indexable.map((p) => `  <url><loc>${ORIGIN}${p.path}</loc><lastmod>${today}</lastmod><priority>${priority(p.path)}</priority></url>`).join('\n') +
  `\n</urlset>\n`);
write('robots.txt', `# Studypath\nUser-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

// GitHub Pages serves this file to tie the site to the custom domain.
const cname = ORIGIN.replace(/^https?:\/\//, '');
if (!existsSync(join(PUBLIC, 'CNAME')) || readFileSync(join(PUBLIC, 'CNAME'), 'utf8').trim() !== cname) write('CNAME', cname + '\n');
// A .nojekyll file stops GitHub Pages from running Jekyll over our files (it would ignore _headers etc.).
write('.nojekyll', '');

console.log(`Built ${pages.length} pages (${indexable.length} in the sitemap) for ${ORIGIN}`);
console.log(`  ${data.careers.length} careers, ${data.universities.length} universities, ${data.programs.length} programmes, ${data.dates.length} dates, ${data.contacts.length} contacts, ${data.faq.length} FAQs`);
