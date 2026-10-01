import { esc, claims, checksBox, tag, weakestLevel } from '../lib/html.mjs';
import { FAQ_CATEGORIES } from '../lib/data.mjs';
import { sectionHead } from '../lib/components.mjs';
import { iconOrEmoji } from '../lib/icons.mjs';

export const plain = (s) => String(s || '').replace(/\*\*/g, '');
export const answerText = (f) => f.answer.map((p) => plain(p.text)).join(' ');

export function faqPage(data) {
  const { faq } = data;

  const item = (f) => {
    const worst = weakestLevel(f.answer);
    return `
  <details class="faq" id="${esc(f.id)}" data-cat="${esc(f.category)}" data-text="${esc((f.question + ' ' + answerText(f)).toLowerCase())}">
    <summary><span class="faq__q">${esc(f.question)}</span>${worst === 'verified' ? '' : tag(worst)}</summary>
    <div class="faq__body">
      ${f.conflict ? `<div class="callout callout--warn"><p>${tag('conflict')} ${esc(f.conflict)}</p></div>` : ''}
      ${claims(f.answer)}
      ${checksBox(f.checks)}
    </div>
  </details>`;
  };

  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">Quick answers</p>
    <h1>Frequently asked questions</h1>
    <p class="lead">Plain-language answers about marks, the NBT, applying and money. Each paragraph is tagged so you can see how sure we are.</p>
    <div class="searchbar">
      <label class="sr-only" for="faq-search">Search the FAQ</label>
      <input type="search" id="faq-search" placeholder="Search: NBT, Life Orientation, NSFAS…" autocomplete="off">
    </div>
    <div class="chip-row" id="faq-cats" role="group" aria-label="Topic">
      <button class="chip" type="button" data-cat="" aria-pressed="true">All</button>
      ${FAQ_CATEGORIES.map((c) => `<button class="chip" type="button" data-cat="${esc(c.id)}" aria-pressed="false">${iconOrEmoji(c.emoji)} ${esc(c.label)}</button>`).join('')}
    </div>
  </div>
</section>

<section class="section wrap wrap--narrow" id="faq-list">
  <p class="small muted faq-key">${tag('verified')} we read the official page · ${tag('reported')} from our research, source cited · ${tag('general')} common knowledge we couldn’t source – check it yourself.</p>
  ${FAQ_CATEGORIES.map((c) => {
    const items = faq.filter((f) => f.category === c.id);
    return items.length ? `
  <div class="faq-group" data-cat="${esc(c.id)}">
    ${sectionHead(c.emoji, c.label)}
    ${items.map(item).join('')}
  </div>` : '';
  }).join('')}
  <p class="empty" id="faq-empty" hidden>No answer matches that yet. <a href="/ask.html">Ask us</a> and we’ll add it.</p>

  <div class="callout">
    <h3>Not in here?</h3>
    <p>Ask us a question, or ask a university directly – we’ll point you at the right person.</p>
    <div class="btn-row"><a class="btn btn--primary" href="/ask.html">Ask us a question</a><a class="btn btn--ghost" href="/ask-a-university.html">Ask a university</a></div>
  </div>
</section>`;

  return [{
    path: '/faq.html',
    title: 'FAQ – APS, the NBT, applying and funding for South African universities',
    description: 'Plain answers to the questions Grade 9–12 learners ask most: how APS works, who must write the NBT, when applications close, NSFAS, and more – each tagged with how well it is sourced.',
    body,
    scripts: ['/assets/js/faq.js'],
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq.html' }],
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: answerText(f) } })),
    }],
  }];
}

export function askPage() {
  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">Can’t find it?</p>
    <h1>Ask us a question</h1>
    <p class="lead">First we’ll check whether it’s already answered. If not, send it to us.</p>
  </div>
</section>

<section class="wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">What do you want to know?</h2>
    <form id="ask-form" novalidate>
      <div class="field">
        <label for="q">Your question</label>
        <textarea id="q" name="question" rows="4" maxlength="600" placeholder="e.g. Can I study medicine if I take Maths Literacy?" required></textarea>
        <span class="hint"><span id="q-count">0</span>/600 · Please don’t include your ID number or other private details.</span>
      </div>

      <div id="suggest" class="suggest" aria-live="polite" hidden>
        <h3>These might already answer it</h3>
        <ul id="suggest-list"></ul>
      </div>

      <div class="field field--hp" aria-hidden="true"><label for="website">Leave this empty</label><input type="text" id="website" name="website" tabindex="-1" autocomplete="off"></div>

      <details class="optional">
        <summary>Want a reply? (optional)</summary>
        <div class="field">
          <label for="contact">Your email or WhatsApp number</label>
          <input type="text" id="contact" name="contact" autocomplete="off" placeholder="name@example.com or 082 123 4567">
        </div>
        <label class="check"><input type="checkbox" id="consent" name="consent"> <span>Yes, you may use these details to reply to this question. See our <a href="/privacy.html">privacy page</a>.</span></label>
      </details>

      <div class="btn-row"><button class="btn btn--primary btn--big" type="submit">Send my question</button></div>
      <div id="ask-status" aria-live="polite"></div>
    </form>
  </div>

  <div class="callout">
    <h3>What happens to it?</h3>
    <p>Your question is saved so we can add a <strong>checked</strong> answer to the FAQ. We don’t generate answers automatically – an invented answer about admissions could cost you a place. If you leave contact details we may reply, but we can’t promise a personal answer to every question.</p>
    <p>For something about <em>your</em> application, <a href="/ask-a-university.html">ask the university directly</a> – they are the only ones who can answer it for sure.</p>
  </div>
</section>`;

  return [{
    path: '/ask.html',
    title: 'Ask us a question about studying in South Africa',
    description: 'Can’t find your question in the FAQ? Ask Studypath. We check every answer against official university sources before we publish it.',
    body,
    scripts: ['/assets/js/ask.js'],
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Ask us a question', path: '/ask.html' }],
  }];
}
