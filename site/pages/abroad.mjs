import { esc, claims, claim, checksBox, tag, link, hostOf } from '../lib/html.mjs';
import { sectionHead, verificationTag } from '../lib/components.mjs';
import { iconOrEmoji } from '../lib/icons.mjs';

const g = (text) => ({ level: 'general', text, sources: [] });

// Everything on this page is general guidance about a PROCESS. None of it comes from an
// official source we verified, so every paragraph is marked that way and each section
// points the student at places to confirm it. The one exception is REAL_EXAMPLES below:
// a short list of foreign universities whose own page we actually read and quoted (UK:
// Edinburgh x2, Sheffield, Manchester; Australia: UNSW Sydney, UWA), kept deliberately
// small so every row stays something we checked ourselves.

// Each requirement is quoted from the university's own international-admissions page
// (fetched and read directly), not from an agent site or forum. "NSC Grade 7/80%" etc
// is the South African matric scale, not a percentage on a foreign exam.
const REAL_EXAMPLES = [
  {
    name: 'University of Edinburgh (Scotland)', field: 'Arts, Humanities & Social Sciences',
    need: 'Grade 6 (70%) in at least 4 NSC subjects (excluding Life Orientation), with Grade 4 (50%) in English Home/First Additional Language.',
    url: 'https://www.ed.ac.uk/studying/international/country/africa/south-africa',
  },
  {
    name: 'University of Edinburgh (Scotland)', field: 'Medicine (MBChB)',
    need: '4 subjects at Grade 7 (80%) including Physical Sciences, Life Sciences and Maths, plus Grade 6 (70%) in English.',
    url: 'https://www.ed.ac.uk/studying/international/country/africa/south-africa',
  },
  {
    name: 'University of Sheffield (England)', field: 'Most undergraduate degrees',
    need: '5 subjects at Grade 6 (70%), with any subject the specific degree requires at Grade 7 (80%).',
    url: 'https://sheffield.ac.uk/international/entry-requirements/south-africa',
  },
  {
    name: 'University of Manchester (England)', field: 'Guide, varies by course',
    need: 'Publishes an NSC-to-A-level conversion table, e.g. NSC 77766 ≈ A-level AAA, NSC 76666 ≈ A-level ABB – the exact grades needed still depend on the course.',
    url: 'https://www.manchester.ac.uk/study/international/country-specific-information/south-africa/entry-requirements/',
  },
  {
    name: 'UNSW Sydney (Australia)', field: 'Guide, 2027 entry, varies by degree',
    need: 'Publishes an NSC-to-degree table: your NSC average (best 4 subjects, excluding Life Orientation) needs to be around 62% for most Arts/Science/Social Science degrees, 70% for Engineering (Hons), 72% for Commerce or Combined Law, up to 77% for the Medical Studies/MD pathway and 79% for Actuarial Studies.',
    url: 'https://www.unsw.edu.au/content/dam/pdfs/future-students/2027-int-ug-entry-table.pdf',
  },
  {
    name: 'University of Western Australia (Australia)', field: 'Guide, varies by course',
    need: 'Converts your NSC average (achievement level of your best six subjects, excluding Life Orientation, on the 1–7 scale) to an ATAR equivalent, e.g. 4.6 ≈ ATAR 80, 5.8 ≈ ATAR 90, 6.8 ≈ ATAR 98 – the course itself then sets its own ATAR cut-off.',
    url: 'https://www.uwa.edu.au/study/how-to-apply/international-and-overseas-qualifications/south-african-national-certificate',
  },
];

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
      { label: 'Our Ask a university page (choose “I am an international student” for one example contact)', url: '/ask-a-university' },
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
    <h1>Studying abroad</h1>
    <p class="lead">Studying overseas is a real option – and the area with the most confident-sounding wrong information online. This page explains how the process works and what to check.</p>
  </div>
</section>

<section class="wrap wrap--narrow">
  <div class="callout callout--warn">
    <h3>Why most of this page has no entry requirements</h3>
    <p>Everywhere else on Studypath, every requirement links to the official page it came from. We’ve only verified a handful of foreign universities’ requirements so far (see below) – for everywhere else, rather than repeat what agents and forums say, <strong>we’ve left the numbers out</strong>.</p>
    <p>Everything below is ${tag('general', 'general guidance about the process')} unless it’s tagged ${tag('verified', 'checked against the official source')} – each paragraph is marked, and each section tells you where to check it.</p>
  </div>
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('🛤️', 'Two ways to do it')}
  <div class="stack">
    ${ROUTES.map((r) => `<article class="card"><h3><span aria-hidden="true">${r.emoji}</span> ${r.title}</h3>${claims(r.paras)}${checksBox(r.checks)}</article>`).join('')}
  </div>
</section>

<section class="section wrap wrap--narrow" id="examples">
  ${sectionHead('🎓', 'Universities', 'A few foreign universities publish exactly what NSC/matric grades they want – we read their own pages and quoted them below. This is a handful of examples, not a full list, so it never gets stale.')}
  <div class="stack">
    ${REAL_EXAMPLES.map((e) => `
    <article class="card">
      <div class="badge-row">${verificationTag('verified')}</div>
      <h3>${esc(e.name)}</h3>
      <p class="card__meta">${esc(e.field)}</p>
      <p>${esc(e.need)}</p>
      <p class="source"><span class="source__label">Source:</span> ${link(e.url, hostOf(e.url))}</p>
    </article>`).join('')}
  </div>
  <p class="small muted">These are general undergraduate entry grades – the exact subjects and grade a specific degree needs (e.g. a science degree wanting Maths at a higher grade) can be stricter. Always check the course page itself before you plan around a number here.</p>
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('🗓️', 'What to line up, and roughly when')}
  ${claim(g('This is a rough order, not a rule – every country and university has its own calendar.'))}
  <div class="table-scroll"><table class="data">
    <thead><tr><th scope="col">When</th><th scope="col">What to sort out</th></tr></thead>
    <tbody>${TIMELINE.map(([when, what]) => `<tr><th scope="row">${when}</th><td data-label="What to sort out">${what}</td></tr>`).join('')}</tbody>
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
    <h3>${iconOrEmoji('🛡️')} A note on scams</h3>
    ${claims([g('Nobody legitimate guarantees admission, and nobody legitimate asks for a large payment to “secure your place” before the university has made you an offer in writing. If a claim can’t be found on the university’s own website, treat it as false.')])}
    <p><a href="/universities">Meanwhile, see what South African universities actually require →</a></p>
  </div>
</section>`;

  return [{
    path: '/study-abroad',
    title: 'Studying abroad from South Africa – the two routes and what to check',
    description: 'An honest guide to studying overseas as a South African learner: applying direct vs starting here and going abroad, what to line up, and the questions to ask. No invented entry requirements.',
    body,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Study abroad', path: '/study-abroad' }],
  }];
}
