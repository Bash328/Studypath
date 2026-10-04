import { sectionHead } from '../lib/components.mjs';
import { ORIGIN } from '../lib/layout.mjs';

export function browsePage() {
  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">30 seconds · just one number</p>
    <h1>Already know your APS or points score?</h1>
    <p class="lead">Pick your university, type the score it gave you, and see which programmes are open to you – grouped by faculty, the way you'd browse a prospectus.</p>
  </div>
</section>

<section class="wrap wrap--narrow" aria-label="Browse by score">
  <noscript><div class="callout callout--warn"><p>This runs on your own device, which means it needs JavaScript switched on.</p></div></noscript>

  <div class="callout">
    <p><strong>This only checks your points score</strong> – not subject requirements like needing Physical Sciences or Mathematics at a certain level. A programme can show as "in range" here and still need a subject you don't have. For the full picture, use <a href="/calculator">the marks calculator</a> instead – it checks everything in about 2 minutes.</p>
  </div>

  <div id="browse" class="browse" data-src="/data/programs.json" data-unis="/data/universities.json" aria-live="polite">
    <p class="loading">Loading…</p>
  </div>
</section>

<section class="section wrap wrap--narrow" aria-labelledby="why">
  ${sectionHead('🤔', "Don't know your score yet?")}
  <p>Every university works it out differently, so there's no single "your APS" to type in until you've picked which one. <a href="/calculator">Enter your subject marks instead</a> and we'll work out your score at every university at once.</p>
</section>
`;

  return [{
    path: '/browse',
    title: 'What can I get into with my APS? – Studypath',
    description: "Already have an APS or points score from a university? Pick the university, type your score, and browse which programmes you're in range for, grouped by faculty.",
    body,
    scripts: ['/assets/js/browse.js'],
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'What can I get into?', path: '/browse' }],
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Studypath score browser',
      url: `${ORIGIN}/browse`, applicationCategory: 'EducationalApplication', operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'ZAR' }, inLanguage: 'en-ZA',
    }],
  }];
}
