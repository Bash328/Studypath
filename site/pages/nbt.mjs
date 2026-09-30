import { esc, claim, claims, tag, link, checksBox } from '../lib/html.mjs';
import { sectionHead, contactCard } from '../lib/components.mjs';

const src = (label, url) => ({ label, url });
const S = {
  nbt: src('NBT Project FAQ', 'https://www.nbt.ac.za/content/faq-0'),
  uct27: src('UCT 2027 Undergraduate Prospectus', 'https://www.uct.ac.za/sites/default/files/media/documents/2027-uct-undergraduate-prospectus-1-april-2026.pdf'),
  uctFaq: src('UCT applications & admissions FAQ', 'https://uct.ac.za/students/prospective-students-faqs/applications-admissions-faq'),
  su: src('Stellenbosch Admissions Booklet 2027', 'https://files.su.ac.za/public/undergraduate-maties/documents/2026-01/su-admissions-booklet-2027.pdf'),
  ru: src('Rhodes Undergraduate Prospectus', 'https://www.ru.ac.za/media/rhodesuniversity/content/registrar/documents/information/studentrecruitment/RU_READY_Undergraduate_Prospectus_2026_DIGITAL_A5_Landscape_24pp_18Mar2026.pdf'),
  up: src('UP Faculty of Humanities admission document', 'https://drupalwebprod-files.up.ac.za/Public/2025-12/2020-hum_ug-final.zp176067.pdf?VersionId=vw30gCBk2BMAXzOhFSBflmkFOHOMFOoa'),
  witsHealth: src('Wits course finder: Medicine and Surgery', 'https://www.wits.ac.za/course-finder/undergraduate/health/medicine-and-surgery/'),
  witsSci: src('Wits course finder: BSc', 'https://www.wits.ac.za/course-finder/undergraduate/science/bsc/'),
  witsBas: src('Wits Bachelor of Architectural Studies', 'https://www.wits.ac.za/soap/architecture/bas-application-exercise/'),
};
const v = (text, sources) => ({ level: 'verified', text, sources });
const r = (text, sources) => ({ level: 'reported', text, sources });
const g = (text) => ({ level: 'general', text, sources: [] });

// Who needs the NBT. Each university is one entry; each paragraph has its own trust level.
const WHO = [
  { id: 'uct', name: 'UCT', paras: [
    r('**Required** for South African resident applicants, and for **all Health Sciences and Commerce** applicants. Commerce needs the AQL at Upper Intermediate or above (the MAT is not required for Commerce). Health Sciences needs Intermediate or above, and your NBT is part of your selection score. Humanities: an Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out.', [S.uct27]),
    r('Engineering & the Built Environment applicants write all three parts, but UCT says the results "are not taken into account for admission". In Science, results are used for placement in the extended degree rather than for admission.', [S.uct27, S.uctFaq]),
  ] },
  { id: 'wits', name: 'Wits', paras: [
    r('**Health Sciences:** the AQL and MAT must be written **in person** (results from online NBTs are not considered) by 17 August. **Science:** required, before the end of October.', [S.witsHealth, S.witsSci]),
    r('Architecture (Bachelor of Architectural Studies): no NBT, but there is an application exercise and an interview.', [S.witsBas]),
  ] },
  { id: 'su', name: 'Stellenbosch', paras: [
    v('**Not required for 2027**, except for all Faculty of Law programmes, applicants from the School of Tomorrow, the South African-based American High School Diploma (AHSD) and all online schools. LLB and BA (Law) need the AQL; BCom (Law) and BAccLLB need the AQL and MAT; all before 31 July. In Law, selection is 80% school results and 20% NBT.', [S.su]),
  ] },
  { id: 'ru', name: 'Rhodes', paras: [
    v('**Recommended** for all first-time university-entering South African applicants; if you miss the automatic entry requirements, your results feed into the Dean’s decision. Everyone should write the AQL; the MAT is for Commerce, Pharmacy and Science.', [S.ru]),
  ] },
  { id: 'up', name: 'UP (Humanities)', paras: [
    v('If your Grade 11 APS for a BA is 26–29 you must write the NBT, and your result (with the places available) can place you in the BA Extended programme. The NBT is not required for all selection degrees.', [S.up]),
    g('The UP document we read does not state its own year (its file name says 2020), so check UP’s current faculty page. Other UP faculties may differ.'),
  ] },
];

export function nbtPage(data) {
  const { faq, contactsByUni } = data;
  const f = (id) => faq.find((x) => x.id === id);
  const nbtContact = (contactsByUni.uct || []).find((c) => c.kind === 'nbt');

  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">The test nobody explains</p>
    <h1>The NBT, in plain language</h1>
    <p class="lead">If a university has told you to “write your NBTs”, this page explains what that is, whether <em>you</em> need to, and when.</p>
  </div>
</section>

<section class="wrap wrap--narrow">
  <p class="small muted">${tag('verified')} we read it on an official page · ${tag('reported')} from our research, source cited · ${tag('general')} not from an official source.</p>
</section>

<section class="section wrap wrap--narrow" id="what">
  ${sectionHead('❓', 'What it is')}
  ${claims(f('what-is-nbt').answer)}
  <div class="grid grid--3 mini">
    <div class="card"><h3>AQL</h3><p>Academic and Quantitative Literacy – reading, reasoning and numbers. Three hours, multiple choice. Written by applicants to every programme that uses the NBT.</p></div>
    <div class="card"><h3>MAT</h3><p>Mathematics. Three hours, multiple choice. Only for programmes where Maths is a requirement – and you write it the same day as the AQL.</p></div>
    <div class="card"><h3>No pass or fail</h3><p>You don’t “pass”. Your result lands in a <strong>band</strong>, and each university says which band it wants.</p></div>
  </div>
  ${claim(r('The bands, from lowest to highest, are: **Basic, Lower Intermediate, Intermediate, Upper Intermediate, Proficient**. These are the names UCT uses in its prospectus when it sets requirements (for example, Commerce wants Upper Intermediate or above in the AQL, and UCT’s top MBChB band needs all domains at Proficient).', [S.uct27]))}
</section>

<section class="section wrap wrap--narrow" id="who">
  ${sectionHead('🏫', 'Do you have to write it?', 'It depends on the **university and the degree**, not on you. Here is what each university we’ve checked says.')}
  <div class="stack">
    ${WHO.map((u) => `<article class="card"><h3>${esc(u.name)}</h3>${claims(u.paras)}</article>`).join('')}
  </div>
  ${claims(f('who-needs-nbt').answer.slice(-1))}
  <p class="small muted">Universities not listed here: we haven’t captured their NBT rules from an official source yet, so we say nothing rather than guess. Ask them on our <a href="/ask-a-university.html">Ask a university</a> page.</p>
</section>

<section class="section wrap wrap--narrow" id="when">
  ${sectionHead('📅', 'When, where and how often')}
  ${claims(f('nbt-when').answer)}
  ${claims(f('nbt-fee').answer)}
  ${checksBox(f('nbt-when').checks)}
  <div class="btn-row"><a class="btn btn--primary" href="https://www.nbt.ac.za" target="_blank" rel="noopener">Book on nbt.ac.za</a><a class="btn btn--ghost" href="/dates.html?kind=nbt">NBT dates by university</a></div>
</section>

<section class="section wrap wrap--narrow" id="contact">
  ${sectionHead('📞', 'Questions about the NBT?')}
  <p>The NBT Project is run from UCT, and UCT’s own contacts page lists its NBT office:</p>
  ${nbtContact ? contactCard(nbtContact) : ''}
  <p class="small">For a question about <em>your</em> application, ask the university you’re applying to – they decide what they’ll accept.</p>
</section>

<section class="section wrap wrap--narrow">
  <div class="callout">
    <h3>What this means for you</h3>
    <ul class="tidy">
      <li><strong>Write early if there’s any chance you need it.</strong> Universities set their own deadline for receiving results, and some are as early as June or July – well before matric results. ${tag('reported')} <span class="small">Stated on the NBT Project FAQ, per our research.</span></li>
      <li>The NBT <strong>can’t rescue a subject requirement</strong>: if a degree needs Maths at 70% and you have 62%, a great NBT doesn’t change that.</li>
      <li>In our calculator, degrees that also need an NBT show up as <span class="pill pill--more">+ More to it</span>, not as “Good to go”.</li>
    </ul>
  </div>
</section>`;

  return [{
    path: '/nbt.html',
    title: 'The NBT explained – who must write it, when, and what the bands mean',
    description: 'A plain-language guide to the National Benchmark Tests: what the AQL and MAT are, which universities require them (UCT, Wits, Stellenbosch, Rhodes, UP), when to write and how often – each claim tagged with its source.',
    body,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'The NBT', path: '/nbt.html' }],
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: ['what-is-nbt', 'who-needs-nbt', 'nbt-when'].map((id) => {
        const item = f(id);
        return { '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer.map((p) => p.text.replace(/\*\*/g, '')).join(' ') } };
      }),
    }],
  }];
}
