import { claims, claim, checksBox, tag } from '../lib/html.mjs';
import { sectionHead } from '../lib/components.mjs';

const g = (text) => ({ level: 'general', text, sources: [] });

// Everything on this page is general guidance about a PROCESS. None of it comes from an
// official source we verified, so every paragraph is marked that way and each section
// points the student at places to confirm it. We deliberately give NO foreign entry
// requirements: we have not verified any.

const ROUTES = [
  { emoji: '🌍', title: 'Route 1 – Apply straight to a foreign university',
    paras: [
      g('You apply as an international applicant, straight from matric, and do your whole degree overseas. This gives you the most choice and costs the most.'),
      g('It usually involves: an application through that country’s system (some countries have one central service, others have you apply to each university); having your NSC assessed against that country’s qualifications; sometimes an English test; a student visa that normally needs proof you can pay; and deadlines that can be **a year earlier than you expect**.'),
    ],
    checks: [
      { label: 'The university’s own page for international applicants', url: null },
      { label: 'The official student-visa page of the country’s government', url: null },
    ] },
  { emoji: '🔁', title: 'Route 2 – Start in South Africa, go abroad part-way',
    paras: [
      g('You register for a degree here, then spend a semester or a year at a partner university overseas through an exchange or study-abroad agreement. Your home university still gives you the degree.'),
      g('People often prefer this because it is usually far cheaper (you keep paying South African fees), you apply using your university results, and the degree stays a South African one. Which partners exist, and who qualifies, differs by university and faculty.'),
    ],
    checks: [
      { label: 'Your university’s international office', url: null },
      { label: 'Our Ask a university page (choose “I am an international student” for one example contact)', url: '/ask-a-university.html' },
    ] },
];

const TIMELINE = [
  ['Grade 11', 'Shortlist countries and universities. Find each one’s page for international applicants and write down its deadline.'],
  ['Grade 11', 'Work out the real total cost: tuition, living costs, visa, flights, medical cover – and the rand exchange rate over three or four years.'],
  ['Early Grade 12', 'Book any admission or language tests; some sittings fill up. Apply – many northern-hemisphere deadlines fall while you’re still in Grade 12.'],
  ['Grade 12', 'Apply to South African universities too. An overseas plan with no backup is not a plan.'],
  ['After results', 'Qualification assessment, visa application, proof of funds, accommodation.'],
];

export function abroadPage() {
  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">Guide</p>
    <h1>Studying abroad, honestly</h1>
    <p class="lead">Studying overseas is a real option – and the area with the most confident-sounding wrong information online. This page explains how the process works and what to check.</p>
  </div>
</section>

<section class="wrap wrap--narrow">
  <div class="callout callout--warn">
    <h3>Why there are no entry requirements on this page</h3>
    <p>Everywhere else on Studypath, every requirement links to the official page it came from. We haven’t verified any foreign university’s requirements, so rather than repeat what agents and forums say, <strong>we’ve left them out</strong>.</p>
    <p>Everything below is ${tag('general', 'general guidance about the process')} – each paragraph is marked, and each section tells you where to check it.</p>
  </div>
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('🛤️', 'Two ways to do it')}
  <div class="stack">
    ${ROUTES.map((r) => `<article class="card"><h3><span aria-hidden="true">${r.emoji}</span> ${r.title}</h3>${claims(r.paras)}${checksBox(r.checks)}</article>`).join('')}
  </div>
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('🗓️', 'What to line up, and roughly when')}
  ${claim(g('This is a rough order, not a rule – every country and university has its own calendar.'))}
  <div class="table-scroll"><table class="data">
    <thead><tr><th scope="col">When</th><th scope="col">What to sort out</th></tr></thead>
    <tbody>${TIMELINE.map(([when, what]) => `<tr><th scope="row">${when}</th><td>${what}</td></tr>`).join('')}</tbody>
  </table></div>
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('🤔', 'Questions to ask before you commit')}
  <div class="grid grid--2">
    <div class="card"><h3>Will the degree be recognised back home?</h3>${claims([g('If you plan to work in South Africa in a regulated profession – medicine, engineering, law, teaching, accounting – check with that profession’s registration body **before** you enrol, not after you graduate.')])}</div>
    <div class="card"><h3>What does it really cost?</h3>${claims([g('Compare the full multi-year total against the same degree here, including the rand weakening. International student fees are usually much higher than local ones.')])}</div>
    <div class="card"><h3>Can you work while studying?</h3>${claims([g('Student-visa work rules vary by country. Plans that depend on part-time income can fall apart if the visa doesn’t allow it.')])}</div>
    <div class="card"><h3>Who is advising you?</h3>${claims([g('Some agents are paid commission by the universities they recommend. That doesn’t make them dishonest, but verify everything on the university’s own site.')])}</div>
  </div>
  ${checksBox([
    { label: 'The registration body for your profession', url: null },
    { label: 'The destination university’s official fees page', url: null },
    { label: 'The destination country’s official student-visa page', url: null },
  ])}
</section>

<section class="section wrap wrap--narrow">
  <div class="callout">
    <h3>🛡️ A note on scams</h3>
    ${claims([g('Nobody legitimate guarantees admission, and nobody legitimate asks for a large payment to “secure your place” before the university has made you an offer in writing. If a claim can’t be found on the university’s own website, treat it as false.')])}
    <p><a href="/universities.html">Meanwhile, see what South African universities actually require →</a></p>
  </div>
</section>`;

  return [{
    path: '/study-abroad.html',
    title: 'Studying abroad from South Africa – the two routes and what to check',
    description: 'An honest guide to studying overseas as a South African learner: applying direct vs starting here and going abroad, what to line up, and the questions to ask. No invented entry requirements.',
    body,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Study abroad', path: '/study-abroad.html' }],
  }];
}
