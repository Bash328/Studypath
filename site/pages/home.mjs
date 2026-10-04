import { esc, md, claim, tag, term } from '../lib/html.mjs';
import { ORIGIN } from '../lib/layout.mjs';
import { sectionHead } from '../lib/components.mjs';
import { iconOrEmoji } from '../lib/icons.mjs';

// The short "words explained" cards reuse the FAQ answers, so there is one source of truth.
const JARGON = ['what-is-aps', 'levels', 'what-is-nbt', 'hl-fal', 'selection', 'bursary-vs-loan'];

export function home(data) {
  const { stats, faq } = data;
  const openGaps = data.researchLog.filter((r) => r.status === 'could_not_verify').length;

  const jargonCards = JARGON.map((id) => faq.find((f) => f.id === id)).filter(Boolean).map((f) => `
    <details class="card jargon">
      <summary><span class="jargon__q">${esc(f.question)}</span></summary>
      ${claim(f.answer[0])}
      <p class="small"><a href="/faq#${esc(f.id)}">Read the full answer →</a></p>
    </details>`).join('');

  const body = `
<section class="hero hero--home">
  <div class="wrap hero__grid">
    <div>
      <h1>Find out which degrees your marks can <span class="hl">actually</span> get you into.</h1>
      <p class="lead">Put in your subjects and marks. Studypath works out your score <strong>the way each university does</strong> – because they all count it differently – and shows you what you qualify for.</p>
      <div class="btn-row">
        <a class="btn btn--sun btn--big" href="/calculator">What do I qualify for? →</a>
        <a class="btn btn--ghost btn--big" href="/careers">I don’t know what I want to do yet</a>
      </div>
      <ul class="trust-row">
        <li><span aria-hidden="true">✓</span> Every number links to the official page</li>
        <li><span aria-hidden="true">🔒</span> Your marks never leave your phone</li>
        <li><span aria-hidden="true">⚠️</span> We tell you what we couldn’t verify</li>
      </ul>
    </div>
    <div class="hero__art" aria-hidden="true">
      <div class="bubble bubble--1">🎓</div>
      <div class="bubble bubble--2">🧮</div>
      <div class="bubble bubble--3">🏫</div>
      <div class="bubble bubble--4">📚</div>
      <div class="hero__score"><em>Example student</em><span>UCT score</span><strong>449</strong><span>Wits score</span><strong>43</strong><em>Same marks. Different numbers.</em></div>
    </div>
  </div>
</section>

<section class="section wrap" aria-labelledby="where">
  ${sectionHead('📍', 'Where are you right now?', 'Tap your grade and we’ll point you at what matters **this year**.')}
  <div class="chip-row" id="grade-chips" role="group" aria-label="Your grade">
    ${[9, 10, 11, 12].map((g) => `<button class="chip chip--big" type="button" data-grade="${g}" aria-pressed="false">Grade ${g}</button>`).join('')}
  </div>
  <div class="grade-panels" id="grade-panels">
    <div class="card card--accent grade-panel" data-for="9 10">
      <h3>${iconOrEmoji('🧠')} Choosing your subjects is your big job</h3>
      <p>The subjects you pick at the end of Grade 9 decide which programmes are open in Grade 12. <strong>Mathematics vs Maths Literacy</strong> is the one that matters most.</p>
      <div class="btn-row"><a class="btn btn--primary" href="/grade-10-subjects">Help me choose</a><a class="btn btn--ghost" href="/careers">Explore careers first</a></div>
    </div>
    <div class="card card--accent grade-panel" data-for="11">
      <h3>${iconOrEmoji('🎯')} Test your marks and go see a campus</h3>
      <p>Universities look at your <strong>Grade 11 results</strong>. Find out where you stand now, while you still have a year to push.</p>
      <div class="btn-row"><a class="btn btn--primary" href="/calculator">Check my marks</a><a class="btn btn--ghost" href="/dates?kind=open_day">Open days</a><a class="btn btn--ghost" href="/nbt">The NBT</a></div>
    </div>
    <div class="card card--accent grade-panel" data-for="12">
      <h3>${iconOrEmoji('⏰')} Deadlines are the thing now</h3>
      <p>Check what you qualify for, then watch the closing dates. Don’t forget <strong>NSFAS</strong> is a separate application.</p>
      <div class="btn-row"><a class="btn btn--primary" href="/dates">Closing dates</a><a class="btn btn--ghost" href="/calculator">Check my marks</a><a class="btn btn--ghost" href="/bursaries">Costs & funding</a></div>
    </div>
    <p class="small muted grade-hint">Pick a grade above. Not sure? Start with <a href="/calculator">What do I qualify for?</a></p>
  </div>
</section>

<section class="section wrap" aria-labelledby="soon">
  ${sectionHead('📅', 'Coming up', 'The next dates that matter. Closed ones are for the 2027 intake – **2028 dates aren’t published yet**.')}
  <div id="upcoming" class="upcoming" data-src="/data/dates.json">
    <p class="muted">Loading the next dates… <a href="/dates">See them all</a></p>
  </div>
</section>

<section class="section wrap" aria-labelledby="tools">
  ${sectionHead('🧰', 'Everything in one place')}
  <div class="grid grid--4">
    <a class="card card--link tool" href="/calculator"><span class="tool__i">🧮</span><h3>What do I qualify for?</h3><p>Your marks → every programme you can apply for.</p></a>
    <a class="card card--link tool" href="/careers"><span class="tool__i">🧭</span><h3>Careers</h3><p>${stats.careers} careers, and the programmes that lead to them.</p></a>
    <a class="card card--link tool" href="/grade-10-subjects"><span class="tool__i">🧠</span><h3>Choose your subjects</h3><p>Grade 9–10? Start here.</p></a>
    <a class="card card--link tool" href="/dates"><span class="tool__i">📅</span><h3>Dates</h3><p>Closing dates, open days and NBT sittings.</p></a>
    <a class="card card--link tool" href="/nbt"><span class="tool__i">✍️</span><h3>The NBT</h3><p>What it is, who needs it, when to write.</p></a>
    <a class="card card--link tool" href="/bursaries"><span class="tool__i">💰</span><h3>Costs & funding</h3><p>NSFAS, bursaries and what applying actually costs, with deadline reminders.</p></a>
    <a class="card card--link tool" href="/ask-a-university"><span class="tool__i">📞</span><h3>Ask a university</h3><p>The right email or phone number for your question.</p></a>
    <a class="card card--link tool" href="/faq"><span class="tool__i">❓</span><h3>FAQs</h3><p>Quick answers – and ask us what’s missing.</p></a>
  </div>
</section>

<section class="section wrap" aria-labelledby="jargon">
  ${sectionHead('📖', 'The words everyone uses and nobody explains', 'If you’ve been told to “check your ' + 'APS” and had no idea what that meant, you’re not behind. Tap one.')}
  <div class="grid grid--2">${jargonCards}</div>
  <p class="small muted jargon-key">Each answer is tagged: ${tag('verified')} we read it on the official page · ${tag('reported')} from our research · ${tag('general')} common knowledge we couldn’t source.</p>
</section>

<section class="section wrap" aria-labelledby="trust">
  ${sectionHead('🤝', 'Why you can trust the numbers', 'Most sites copy a number and move on. Here’s what we do differently.')}
  <div class="grid grid--2">
    <div class="card"><h3>We never guess a number</h3><p>If we can’t find a requirement on an official university page or PDF, we don’t show it. We say we don’t know.</p></div>
    <div class="card"><h3>Every university gets its own score</h3><p>A Wits score of 42 is not a UP score of 35 or a UCT score of 500. We work each one out <em>their</em> way, and <a href="/data-sources#scoring">show you which official page we checked</a>.</p></div>
    <div class="card"><h3>When sources disagree, you see both</h3><p>Sometimes two official pages give different numbers. We show a “Sources disagree” badge instead of quietly picking one.</p></div>
    <div class="card"><h3>We publish what we know</h3><p>Right now we’ve captured requirements for <strong>${stats.universitiesWithData} of ${stats.universities}</strong> universities, and ${openGaps === 1 ? 'one thing is' : `${openGaps} things are`} still open. <a href="/data-sources">See every gap</a>.</p></div>
  </div>
  <div class="stat-row">
    <div class="stat"><strong>${stats.programs}</strong><span>programmes, each with a source link</span></div>
    <div class="stat"><strong>${stats.universitiesWithData}/${stats.universities}</strong><span>universities with requirements</span></div>
    <div class="stat"><strong>${stats.careers}</strong><span>careers to explore</span></div>
  </div>
</section>
`;

  return [{
    path: '/',
    title: 'Studypath – which degrees can your marks actually get you into?',
    description: 'Free South African career and university guide. Put in your marks and see which degrees you qualify for – scored the way each university scores, with a link to the official page for every number.',
    body,
    scripts: ['/assets/js/home.js'],
    jsonLd: [{
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite', '@id': `${ORIGIN}/#website`, name: 'Studypath', url: `${ORIGIN}/`, inLanguage: 'en-ZA',
          description: 'South African career and university guidance with admission requirements sourced from official university pages.',
          potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${ORIGIN}/careers?q={search_term_string}` }, 'query-input': 'required name=search_term_string' },
        },
        { '@type': 'Organization', '@id': `${ORIGIN}/#org`, name: 'Studypath', url: `${ORIGIN}/`, areaServed: { '@type': 'Country', name: 'South Africa' } },
      ],
    }],
  }];
}
