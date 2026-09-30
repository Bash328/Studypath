import { claims, tag } from '../lib/html.mjs';
import { sectionHead } from '../lib/components.mjs';
import { ORIGIN } from '../lib/layout.mjs';

export function calculator(data) {
  const { faq } = data;
  const pick = (id) => faq.find((f) => f.id === id);

  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">About 2 minutes · no account · your marks stay on your device</p>
    <h1>What do I qualify for?</h1>
    <p class="lead">Pick your subjects, type your marks, and see which degrees are open to you – scored the way <strong>each university</strong> scores.</p>
  </div>
</section>

<section class="wrap wrap--narrow" aria-label="Calculator">
  <noscript><div class="callout callout--warn"><p>The calculator runs on your own device so your marks stay private, which means it needs JavaScript switched on.</p></div></noscript>

  <ol class="steps" id="steps" aria-label="Progress">
    <li class="steps__i is-current" data-step="1"><span>1</span> Subjects</li>
    <li class="steps__i" data-step="2"><span>2</span> Marks</li>
    <li class="steps__i" data-step="3"><span>3</span> Results</li>
  </ol>

  <div id="calc" class="calc" aria-live="polite">
    <p class="loading">Loading the calculator…</p>
  </div>

  <p class="hint calc__privacy">🔒 Your marks are worked out in your browser and saved only on this device, so you don’t have to type them again. We have no accounts and keep no copy.</p>
</section>

<section class="section wrap wrap--narrow" aria-labelledby="read">
  ${sectionHead('📖', 'How to read your results')}
  <div class="stack">
    <div class="card result-key"><h3><span class="pill pill--good">✓ Good to go</span></h3><p>Your score and every subject rule we can check are met, and nothing else is needed. If it also says <span class="badge badge--info">Selection programme</span>, meeting the minimum still doesn’t guarantee a place.</p></div>
    <div class="card result-key"><h3><span class="pill pill--more">+ More to it</span></h3><p>Your marks are enough, but the degree also needs something marks can’t show – an <a href="/nbt.html">NBT</a>, a portfolio, an audition, an interview. The card lists exactly what.</p></div>
    <div class="card result-key"><h3><span class="pill pill--nearly">≈ Nearly</span></h3><p>You’re within a few points, or a few percent in one subject. We tell you what’s missing, like “2% to go in Maths”.</p></div>
    <div class="card result-key"><h3><span class="pill pill--unknown">? Can’t tell</span></h3><p>Either the university publishes no points cut-off for that degree, or we don’t calculate its score because we couldn’t confirm how. We’d rather say so than guess.</p></div>
  </div>
  <p class="small muted">How sure are we of each formula? ${tag('verified')} means we read the rule on the official page – <a href="/data-sources.html#scoring">see every formula and its source</a>.</p>
</section>

<section class="section wrap wrap--narrow" aria-labelledby="why">
  ${sectionHead('🤔', 'Why do I get a different score for each university?')}
  ${claims(pick('what-is-aps').answer)}
  ${claims(pick('life-orientation').answer.slice(0, 1))}
  <p><a href="/faq.html">More answers in the FAQ →</a></p>
</section>
`;

  return [{
    path: '/calculator.html',
    title: 'What do I qualify for? – APS calculator for South African universities',
    description: 'Enter your subjects and marks once. Studypath works out your score the way each South African university does – UCT, Wits, UP, Stellenbosch, UKZN, Rhodes and more – and shows which degrees you qualify for.',
    body,
    scripts: ['/assets/js/calculator.js'],
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'What do I qualify for?', path: '/calculator.html' }],
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Studypath APS calculator',
      url: `${ORIGIN}/calculator.html`, applicationCategory: 'EducationalApplication', operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'ZAR' }, inLanguage: 'en-ZA',
    }],
  }];
}
