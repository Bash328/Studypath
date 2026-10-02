import { esc, claims, claim, checksBox, tag, link, hostOf } from '../lib/html.mjs';
import { sectionHead, verificationTag } from '../lib/components.mjs';
import { iconOrEmoji } from '../lib/icons.mjs';

const g = (text) => ({ level: 'general', text, sources: [] });
const r = (text, sources) => ({ level: 'reported', text, sources });
const v = (text, sources) => ({ level: 'verified', text, sources });
const src = (label, url) => ({ label, url });

// Everything on this page is general guidance about a PROCESS. None of it comes from an
// official source we verified, so every paragraph is marked that way and each section
// points the student at places to confirm it. The exception is the "pick a country"
// section below: universities whose own page we actually read and quoted, grouped under
// the country they belong to instead of in one flat list here.

const ROUTES = [
  { emoji: '🌍', title: 'Route 1 – Apply straight to a foreign university',
    paras: [
      g('You apply as an international applicant, straight from matric, and do your whole degree overseas. This gives you the most choice and costs the most.'),
      g('It usually involves: an application through that country’s system (some countries have one central service, others have you apply to each university); having your NSC assessed against that country’s qualifications; sometimes an English test; a student visa that normally needs proof you can pay; and deadlines that can be **a year earlier than you expect**.'),
    ],
    checks: [
      { label: 'The university’s own page for international applicants', url: null },
      { label: 'UK undergraduate applications: UCAS, the centralised application service', url: 'https://www.ucas.com' },
      { label: 'US undergraduate applications: Common App', url: 'https://www.commonapp.org' },
      { label: 'UK: the Student visa page, gov.uk', url: 'https://www.gov.uk/student-visa' },
      { label: 'Australia: the Student visa (subclass 500) page, Study Australia (Australian Government)', url: 'https://www.studyaustralia.gov.au/en/plan-your-move/your-guide-to-visas/student-visa-subclass-500' },
      { label: 'Ireland: study-visa information, Immigration Service Delivery', url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/planning-to-study-in-ireland/' },
      { label: 'New Zealand: student visas, Immigration New Zealand', url: 'https://www.immigration.govt.nz/study/study-visas/' },
      { label: 'Canada: the study permit page, IRCC', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html' },
      { label: 'USA: Study in the States, US Department of Homeland Security', url: 'https://studyinthestates.dhs.gov/' },
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

// ---------------------------------------------------------------------------
// Country pages: money/visas and specific universities, one level deeper than
// the general-process page above. Each country is `published: true` to get its
// own page and a card on the picker grid, or `false` to stay researched-but-held-
// back (the content lives here so a later pass can finish and flip it on).
// ---------------------------------------------------------------------------

/**
 * `contact`, when given, is { email?, phone?, url? } for that university's own
 * international-admissions office - the url is only needed if it differs from the
 * entry-requirement page already linked as the main source.
 * `apply`, when given, is { url, note? } - where to actually submit an application
 * (a portal, UCAS, Studielink, OUAC...), with a short note for the portal name/fee.
 */
function uniCard({ name, field, need, url, level = 'verified', contact, apply }) {
  const badge = level === 'verified' ? verificationTag('verified') : tag(level);
  const contactLine = contact && (contact.email || contact.phone)
    ? `<p class="small"><span class="source__label">Contact:</span> ${[
        contact.email ? `<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>` : null,
        contact.phone ? esc(contact.phone) : null,
      ].filter(Boolean).join(' · ')}${contact.url && contact.url !== url ? ` <span class="muted">(${link(contact.url, hostOf(contact.url))})</span>` : ''}</p>`
    : '';
  const applyLine = apply
    ? `<p class="small"><span class="source__label">How to apply:</span> ${link(apply.url, apply.note || 'Apply here')}</p>`
    : '';
  return `<article class="card">
  <div class="badge-row">${badge}</div>
  <h3>${esc(name)}</h3>
  ${field ? `<p class="card__meta">${esc(field)}</p>` : ''}
  <p>${esc(need)}</p>
  <p class="source"><span class="source__label">Source:</span> ${link(url, hostOf(url))}</p>
  ${applyLine}
  ${contactLine}
</article>`;
}

/** Several UK/Ireland universities quote NSC requirements as a run-together digit
 * string (e.g. "77666") rather than spelling out each subject - this decodes it once,
 * for sections where that notation actually appears. */
const nscScaleNote = () => `<p class="small muted">${iconOrEmoji('❓')} Reading a grade string like <strong>77666</strong>: it’s one NSC achievement level per subject, best to worst, run together – level 7 = 80–100%, 6 = 70–79%, 5 = 60–69%, 4 = 50–59%. So “77666” means two subjects at 80%+ and three at 70–79%. Where a university also gives an “A-level equivalent” (e.g. AAA), that’s just its own conversion of that same NSC string – not a separate requirement.</p>`;

const COUNTRIES = [
  {
    id: 'uk', name: 'United Kingdom', published: true,
    teaser: 'Visa fee, living-cost funds, the Graduate visa change from 2027, and real UCAS deadlines.',
    lead: 'The most matric-friendly major destination – most UK universities publish exactly which NSC/IEB marks they take, straight from your South Africa country page, no A-levels needed.',
    body: `
<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Money and visas</h2>
    ${claims([
      v('Student visa fee: **£558** applying from outside the UK. Living-cost funds you must currently show: **£1,171/month** outside London or **£1,529/month** in London, for up to 9 months (maximum £10,539 / £13,761), held for at least 28 days.', [src('gov.uk', 'https://www.gov.uk/student-visa')]),
      v('Immigration Health Surcharge: **£776/year** for students (other applicant types pay £1,035/year), paid upfront for the whole length of the visa.', [src('gov.uk', 'https://www.gov.uk/healthcare-immigration-application/how-much-pay')]),
      r('Those living-cost figures are rising for applications made on or after **30 November 2026**, under the Home Office’s Statement of Changes HC 584: to **£1,203/month** outside London (maximum £10,827) and **£1,570/month** in London (maximum £14,130). Several immigration-law sources cite these exact figures, but gov.uk’s own guidance page hadn’t been updated to show them as of this check – confirm the live number on gov.uk closer to the date.', [src('HC 584, gov.uk', 'https://www.gov.uk/government/publications/statement-of-changes-to-the-immigration-rules-hc-584-3-september-2026')]),
      v('The Graduate (post-study work) visa is **2 years** if you apply on or before 31 December 2026, but drops to **18 months** for applications from 1 January 2027 (PhD graduates still get 3 years). A learner starting a UK degree in 2027 will graduate under the shorter rule.', [src('gov.uk', 'https://www.gov.uk/student-visa')]),
    ])}
    ${checksBox([{ label: 'UK Student visa, gov.uk', url: 'https://www.gov.uk/student-visa' }])}
  </div>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">UCAS and deadlines (2027 entry)</h2>
    ${claims([
      v('All undergraduate applications go through UCAS, which can take up to 5 choices. Oxford, Cambridge and most Medicine, Dentistry and Veterinary Medicine/Science courses close **15 October 2026, 18:00 UK time**; the main “equal consideration” deadline for most other undergraduate courses is **13 January 2027, 18:00 UK time**.', [src('ucas.com', 'https://www.ucas.com/applying/applying-to-university/dates-and-deadlines-for-uni-applications')]),
      r('Your NSC results only come out in January, after the 13 January deadline – UK universities usually get around this by making **conditional offers** off your Grade 11 and Grade 12 prelim marks, then confirming the place once your final NSC is out.', []),
    ])}
  </div>
</section>

<section class="section wrap wrap--narrow" id="examples">
  ${sectionHead('🎓', 'Universities with published South Africa (NSC/IEB) entry rules')}
  ${nscScaleNote()}
  <div class="stack">
    ${[
      { name: 'University of Edinburgh (Scotland)', field: 'Arts, Humanities & Social Sciences', need: 'Grade 6 (70%) in at least 4 NSC subjects (excluding Life Orientation), with Grade 4 (50%) in English Home/First Additional Language.', url: 'https://www.ed.ac.uk/studying/international/country/africa/south-africa', apply: { url: 'https://www.ed.ac.uk/studying/international/applying/undergraduate', note: 'Apply via UCAS' } },
      { name: 'University of Edinburgh (Scotland)', field: 'Medicine (MBChB)', need: '4 subjects at Grade 7 (80%) including Physical Sciences, Life Sciences and Maths, plus Grade 6 (70%) in English.', url: 'https://www.ed.ac.uk/studying/international/country/africa/south-africa', apply: { url: 'https://www.ed.ac.uk/studying/international/applying/undergraduate', note: 'Apply via UCAS' } },
      { name: 'University of Sheffield (England)', field: 'Most undergraduate degrees', need: '5 subjects at Grade 6 (70%), with any subject the specific degree requires at Grade 7 (80%). NSC English grade 4 or above accepted instead of IELTS.', url: 'https://sheffield.ac.uk/international/entry-requirements/south-africa', apply: { url: 'https://sheffield.ac.uk/international/applying/undergraduate', note: 'Apply via UCAS' }, contact: { email: 'international@sheffield.ac.uk', phone: '+44 114 222 2000', url: 'https://www.sheffield.ac.uk/international/contact/team' } },
      { name: 'University of Manchester (England)', field: 'Guide, varies by course', need: 'Publishes an NSC-to-A-level conversion table, e.g. NSC 77766 ≈ A-level AAA, NSC 76666 ≈ A-level ABB – the exact grades needed still depend on the course.', url: 'https://www.manchester.ac.uk/study/international/country-specific-information/south-africa/entry-requirements/', apply: { url: 'https://www.manchester.ac.uk/study/undergraduate/applying/how-to-apply/', note: 'Apply via UCAS, code M20 MANU' }, contact: { email: 'international@manchester.ac.uk', phone: '+44 (0)161 306 6000' } },
      { name: 'University of Leeds (England)', field: 'Guide, varies by course', need: 'Accepts the NSC with matriculation endorsement or the International Secondary Certificate. Grade bands range from 77666–66655 up to 77776 depending on the course. NSC/ISC English grade 4/C or above accepted instead of IELTS.', url: 'https://www.leeds.ac.uk/admissions-qualifications/21927/south-africa', apply: { url: 'https://www.leeds.ac.uk/undergraduate-how-to-apply/doc/apply', note: 'Apply via UCAS' }, contact: { email: 'study@leeds.ac.uk', url: 'https://www.leeds.ac.uk/about/doc/about-contact-us' } },
      { name: 'University of Birmingham (England)', field: 'Guide, varies by course', need: 'Explicitly names both the NSC and IEB as accepted. Grade-band table in 5 subjects (excluding Life Orientation): A*AA-equivalent 77766, AAA-equivalent 77666, AAB-equivalent 76666, ABB–BBB-equivalent 66666. Separate, stricter requirements apply for Medicine and Dentistry.', url: 'https://www.birmingham.ac.uk/International/students/country/south-africa/index.aspx', apply: { url: 'https://www.birmingham.ac.uk/study/undergraduate/apply', note: 'Apply via UCAS, code B32' }, contact: { email: 'Africa@contacts.bham.ac.uk' } },
      { name: 'University of Nottingham (England)', field: 'Guide, varies by course', need: 'Considers direct entry with 5+ NSC subject passes (Life Orientation excluded), typically accepting grades from 77777 down to 66665 in relevant subjects.', url: 'https://www.nottingham.ac.uk/studywithus/international-applicants/country-info/countryinformation/south-africa.aspx', apply: { url: 'https://www.nottingham.ac.uk/studywithus/ugstudy/applying.html', note: 'Apply via UCAS (£34.50 UCAS fee)' }, contact: { phone: '+44 (0)115 951 5247' } },
      { name: 'University of Glasgow (Scotland)', field: 'Guide, varies by course', need: 'Grade-band table from A*AA-equivalent down to BBB-equivalent. Explicitly states the NSC does not satisfy entry for Medicine or Dentistry – A-levels recommended instead. Accepts both NSC and IEB.', url: 'https://www.gla.ac.uk/international/country/southafrica/', apply: { url: 'https://www.gla.ac.uk/undergraduate/how-to-apply-for-an-undergraduate-degree/ucas', note: 'Apply via UCAS' } },
      { name: 'University of Warwick (England)', field: 'Guide, varies by course', need: 'Considers direct entry from NSC 77777/AAAAA down to 76666/ABBBB, with specific subjects usually needed at grade 7/A. Also runs a Warwick International Foundation Programme for lower marks.', url: 'https://warwick.ac.uk/study/international/countryinformation/africa/southafrica/', apply: { url: 'https://warwick.ac.uk/study/undergraduate/applying/how-to-apply/', note: 'Apply via UCAS, code W20' }, contact: { email: 'Africa@warwick.ac.uk', phone: '+44 (0)24 7657 2686' } },
      { name: 'University of Bristol (England)', field: 'Guide, varies by course', need: 'Considers NSC holders with grades of 7, 6 and 5 for bachelor’s degree courses, needing good grades in five subjects excluding Life Orientation.', url: 'https://www.bristol.ac.uk/international/countries/south-africa.html', apply: { url: 'https://www.bristol.ac.uk/study/undergraduate/apply/international/', note: 'Apply via UCAS, code B78' }, contact: { email: 'support@international.bristol.ac.uk', phone: '+44 (0)117 205 2644' } },
      { name: 'University of Liverpool (England)', field: 'Guide, varies by course', need: 'Grade-band table in 5 subjects: AAA-equivalent 77666, AAB-equivalent 76666, ABB-equivalent 66666, BBB-equivalent 66665. Considers NSC (with Matriculation Endorsement) or IEB for certain science-linked courses.', url: 'https://www.liverpool.ac.uk/international/countries/southafrica.php', apply: { url: 'https://www.liverpool.ac.uk/international/applying/how-to-apply/', note: 'Apply via UCAS, code L41' }, contact: { email: 'SubAfrica@liverpool.ac.uk', phone: '+44 151 794 5927' } },
    ].map(uniCard).join('')}
  </div>
  <p class="small muted">A handful of examples, not a full list. Some courses don’t take the NSC at all (e.g. QMUL’s London MBBS/BDS, or Medicine/Dentistry at Glasgow), and Maths Literacy usually doesn’t count where Mathematics is required – always check the specific course page.</p>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Funding</h2>
    ${claims([
      v('University of Manchester’s **Global Futures Scholarships**, for 2027 entry: up to **£36,000 total** (£12,000/year for 3 years), merit-based. Its own scholarship page names South Africa explicitly as eligible (domiciled in South Africa, with an NSC or IEB qualification). Applications open December 2026, across two rounds (25 February and 8 April 2027). Excludes Medicine, Dentistry, Architecture and foundation-year courses.', [src('manchester.ac.uk', 'https://www.manchester.ac.uk/study/international/country-specific-information/south-africa/scholarships/')]),
      g('**Chevening** is postgraduate only, so it doesn’t apply straight out of matric – worth bookmarking for after your first degree.'),
    ])}
  </div>
</section>`,
  },
  {
    id: 'ireland', name: 'Ireland', published: true,
    teaser: 'Why SA applicants go direct to the university, not through the CAO – Trinity and UCD compared.',
    lead: 'Bachelor’s degrees take 3–4 years, teaching is in English, and both major universities publish exactly what they want from an NSC or IEB certificate.',
    body: `
<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">How you apply</h2>
    ${claims([
      v('South African applicants are normally “non-EU” (this depends on where you live, not your nationality), which means you apply **directly to the university**, not through Ireland’s central CAO system – the CAO is for EU/EEA/UK/Swiss applicants. Trinity College Dublin applies through my.tcd.ie; University College Dublin through UCD Global.', [src('tcd.ie', 'https://www.tcd.ie/study/country/south-africa/')]),
    ])}
  </div>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Money and visas</h2>
    ${claims([
      v('South Africa lost visa-free access to Ireland on 10 July 2024 and is now visa-required. The study (“D”) visa costs **€60** for a single-journey visa (valid up to 90 days) or **€100** for a multi-journey visa (valid up to 5 years).', [src('Education in Ireland (State agency)', 'https://www.educationinireland.com/en/plan-your-study-abroad/student-visas')]),
      v('Proof of funds: for courses starting after 1 July 2023, visa-required students must show access to **€10,000** for the year. A tuition deposit – normally a minimum of **€6,000**, or the full fee if it’s less – is also required before registering.', [src('tcd.ie', 'https://www.tcd.ie/study/international/arriving-in-ireland/visa-immigration/FAQ/')]),
      v('After arrival, you register your immigration permission (Stamp 2) for an **Irish Residence Permit (IRP)**, which costs **€300**. Private medical insurance – or eligible travel insurance with medical cover, valid for your full stay – is mandatory and checked as part of the visa application itself, not just recommended.', [src('Education in Ireland (State agency)', 'https://www.educationinireland.com/en/plan-your-study-abroad/student-visas')]),
    ])}
    ${checksBox([{ label: 'Student visas, Education in Ireland', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/student-visas' }, { label: 'Irish Naturalisation and Immigration Service', url: 'https://www.irishimmigration.ie' }])}
  </div>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Deadlines</h2>
    ${claims([
      v('Trinity opens applications 1 November. Its priority deadline is **1 February** (decision by 1 April); the final deadline is **30 June**. Music, Drama, Dental Science and Medicine all close on 1 February.', [src('tcd.ie', 'https://www.tcd.ie/study/international/how-to-apply/')]),
      r('UCD runs rolling non-EU admissions, reported to open around 1 October for the following September intake with a final deadline around 1 July – apply earlier if you’ll need a visa. UCD’s own deadlines page consistently blocked our fetch, so treat these as indicative only until confirmed directly.', []),
    ])}
  </div>
</section>

<section class="section wrap wrap--narrow" id="examples">
  ${sectionHead('🎓', 'What the universities ask for')}
  ${nscScaleNote()}
  <div class="stack">
    ${[
      { name: 'Trinity College Dublin', field: 'Guide, varies by course', need: 'Publishes four NSC/IEB “bands” based on your five strongest subjects (excluding Life Orientation): Special Entry 77777, Band 1 77776, Band 2 77766, Band 3 77666. You must also meet minimum matriculation requirements: passes in English, Mathematics and a language other than English. Needs “a high level of competence in English” via a recognised exam system.', url: 'https://www.tcd.ie/study/country/south-africa/', apply: { url: 'https://www.tcd.ie/study/international/how-to-apply/', note: 'Apply directly via my.tcd.ie (€55 per course)' }, contact: { email: 'daniel.osullivan@tcd.ie' } },
      { name: 'University College Dublin (UCD)', field: 'Guide, varies by course', need: 'Asks for the award of the NSC (or the old Senior Certificate with matric endorsement), plus whatever grades the specific course sets. Its NSC English requirement is reported as 40% if taught through English or Home Language level, otherwise 60%.', url: 'https://www.ucd.ie/global/study-at-ucd/undergraduate/entryrequirements/southafrica/', level: 'reported', apply: { url: 'https://www.ucd.ie/courses/apply', note: 'Apply via UCD Global (reported ~€60 fee, unconfirmed)' }, contact: { email: 'globaladmissions@ucd.ie', phone: '+353 1 716 8500', url: 'https://www.ucd.ie/global/whoweare/internationaladmissions/' } },
      { name: 'University College Cork (UCC)', field: 'NSC (from 2008), minimum 5 subjects', need: 'Genuinely programme-tiered: Band 1 programmes need a minimum NSC average of grade 7, Band 2 grade 6, Band 3 grade 5. Where Mathematics or a lab science is required, those need at least grade 6.', url: 'https://www.ucc.ie/en/study/comparison/undergrad/africa-me-india/south-africa/', apply: { url: 'https://ucc.elluciancrmrecruit.com/Apply/Account/Login', note: 'Apply via the UCCApply portal' }, contact: { email: 'internationaloffice@ucc.ie', phone: '+353 21 490 4724', url: 'https://www.ucc.ie/en/international/contactus/' } },
      { name: 'University of Galway', field: 'Senior Certificate with matriculation endorsement, 5 subjects', need: 'Five bands by NSC achievement: Band I 60–64%, Band II 64–69%, Band III 70–79%, Band IV 80–90%, Band V 90–100% (Life Orientation excluded). Specific programmes may need a higher band.', url: 'https://www.universityofgalway.ie/global-galway/studyinireland/yourcountry/southafrica/', apply: { url: 'https://nuigalway.elluciancrmrecruit.com/Apply/Account/Login', note: 'Apply via Apply to University of Galway (€35, up to 2 programmes)' }, contact: { phone: '+353 91 524411' } },
      { name: 'University of Limerick', field: 'NSC accepted – no published grade thresholds', need: 'Confirms it accepts the NSC (AS level), but publishes no specific percentages or grade bands – only that some programmes may set a higher bar, and a portfolio, and that meeting minimum grades doesn’t guarantee a place. Worth contacting directly.', url: 'https://www.ul.ie/courses/south-africa', level: 'reported', apply: { url: 'https://www.ul.ie/global/incoming-students/full-degree', note: 'Apply via the “Apply Now” button on your chosen programme’s page' }, contact: { email: 'ULGlobal@ul.ie', phone: '+353 61 202700' } },
    ].map(uniCard).join('')}
  </div>
  <p class="small muted">Both Trinity and UCD also offer an International Foundation route (the Trinity International Foundation Programme and the UCD International Foundation Year) if your marks fall short of direct entry.</p>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Funding</h2>
    ${claims([
      r('Trinity’s **Global Excellence Undergraduate Scholarships** are worth **€2,000–€5,000** (applied to tuition), for non-EU fee-status applicants with an offer for 2026/27 entry. Its exclusion list names China but not South Africa, which suggests South African applicants qualify – but Trinity doesn’t explicitly confirm South Africa as eligible on the page itself, so treat this as likely rather than certain until you check with Trinity directly. Doesn’t cover Medicine, Dentistry, Acting, Engineering, Natural Sciences or Computer Science & Statistics.', [src('tcd.ie', 'https://www.tcd.ie/study/international/scholarships/undergraduate/geug.php')]),
    ])}
  </div>
</section>`,
  },
  {
    id: 'netherlands', name: 'Netherlands', published: true,
    teaser: 'Why a plain matric usually isn’t enough for a research university – HAVO vs VWO explained.',
    lead: 'Read this before assuming your matric is enough – the Netherlands is one of the harder destinations for a plain NSC, and most pages that cover it skip why.',
    body: `
<section class="section wrap wrap--narrow">
  <div class="callout callout--warn">
    <h3>${iconOrEmoji('⚠️')} HAVO vs VWO – why this matters</h3>
    ${claims([
      v('**Nuffic**, the Dutch government body that compares foreign qualifications, rates an NSC as comparable to a **HAVO diploma** when the certificate itself shows you’ve met the minimum admission requirements for a Higher Certificate, (National) Diploma and/or Bachelor’s programme in South Africa – that’s a property of the NSC endorsement, not a separate completed year of study. An IEB-issued NSC meeting that same condition is rated “at least” a HAVO diploma.', [src('nuffic.nl', 'https://www.nuffic.nl/en/education-systems/south-africa/level-of-diplomas')]),
      g('HAVO is the level for **universities of applied sciences** (hogescholen/HBO). Dutch **research universities** (WO) normally ask for VWO, one level higher. So a plain matric usually gets you into a university of applied sciences, but often not straight into a research university.'),
    ])}
  </div>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Money and visas</h2>
    ${claims([
      v('South Africa is **not** on the Netherlands’ MVV-exempt list, so you need an MVV (a “Type D” entry visa) alongside your residence permit – both are applied for together. The combined **residence permit fee is €254** (the 2026 figure) – crucially, **the university applies on your behalf**, not you directly, since it must be an IND-recognised sponsor.', [src('ind.nl', 'https://ind.nl/en/fees-costs-of-an-application'), src('ind.nl, MVV exemptions', 'https://ind.nl/en/mvv-exemptions')]),
      v('Proof of sufficient means for a student residence permit: **€1,130.77/month** for higher professional education (HBO) or university study (the 2026 figure, effective 1 January–31 December 2026).', [src('ind.nl', 'https://ind.nl/en/required-amounts-income-requirements')]),
      v('Health insurance is a **legal requirement**, not just advice. Full-time students who don’t also work must buy private international student insurance; the moment you take on any paid work (even a zero-hour contract), you’re required to switch to Dutch public health insurance instead.', [src('Study in NL, Nuffic', 'https://www.studyinnl.org/plan-your-stay/healthcare-insurance'), src('rug.nl', 'https://www.rug.nl/education/application-enrolment-tuition-fees/admission/procedures/application-informatie/financial-matters/health-insurance-international-students?lang=en')]),
    ])}
    ${checksBox([{ label: 'IND, fees and costs of an application', url: 'https://ind.nl/en/fees-costs-of-an-application' }])}
  </div>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Deadlines</h2>
    ${claims([
      g('Deadlines vary by university and even by programme, so don’t assume one date applies everywhere. Capacity-limited (“numerus fixus”) programmes typically close around **15 January**; most other bachelor’s programmes close around **1 May** – but several universities set an earlier cut-off specifically for non-EU/EEA applicants, to leave time for the residence-permit process.'),
      v('Groningen uses the same dates for every applicant: **1 May** for regular bachelor’s programmes, **15 January** for fixed-quota (numerus fixus) programmes.', [src('rug.nl', 'https://www.rug.nl/education/application-enrolment-tuition-fees/admission/application-deadlines/bachelor-application-deadlines?lang=en')]),
      v('VU Amsterdam sets a separate, earlier deadline for non-EU/EEA applicants: **1 April** for 2027/2028 entry, with applications opening 1 October 2026.', [src('vu.nl', 'https://vu.nl/en/education/more-about/apply-bachelors-programme')]),
      v('Erasmus University College’s own deadlines for 2027/2028: **15 January** (regular) or **1 May** (final).', [src('eur.nl/euc', 'https://www.eur.nl/en/euc/application-admissions/deadlines')]),
    ])}
  </div>
</section>

<section class="section wrap wrap--narrow" id="examples">
  ${sectionHead('🎓', 'Universities that take the NSC directly')}
  <div class="stack">
    ${[
      { name: 'University of Groningen', field: 'Guide, varies by faculty', need: 'Requires the NSC with 7 examination subjects and an overall average of 70% (Life Orientation and Mathematical Literacy excluded); Science/Engineering, Economics and Medical Sciences also set their own required subjects.', url: 'https://www.rug.nl/education/application-enrolment-tuition-fees/admission/procedures/application-informatie/with-non-dutch-diploma/bachelor/bachelor-entry-requirements/bachelorlinkscountry/south-africa?lang=en', apply: { url: 'https://www.rug.nl/education/bachelor/international-students/admission-and-application/?lang=en', note: 'Apply via Studielink' } },
      { name: 'Vrije Universiteit (VU) Amsterdam', field: 'Guide, varies by faculty', need: 'Accepts the NSC (from Umalusi) or IEB with 7 examination subjects, an overall average of 70% (excluding Life Orientation) and no single subject below 65%, where the certificate confirms you’ve met South Africa’s own Bachelor’s-admission minimum.', url: 'https://vu.nl/en/education/more-about/list-of-diplomas-per-country', apply: { url: 'https://vu.nl/en/education/more-about/apply-bachelors-programme', note: 'Apply via Studielink (€100 fee for non-NL diplomas)' }, contact: { phone: '+31 (0)20 59 84510' } },
      { name: 'Erasmus University Rotterdam', field: 'General bachelor’s admission', need: 'Accepts the NSC with an overall average of 70%, each individual subject at 55% or higher, and the certificate confirming you’ve met South Africa’s Bachelor’s-admission minimum.', url: 'https://www.eur.nl/en/education/practical-matters/bachelor-admission-and-application/diploma-overview', apply: { url: 'https://www.eur.nl/en/education/bachelor-programmes/admission-and-application-bachelor', note: 'Apply via Studielink, then the EUR Admissions Portal (€100 fee)' }, contact: { email: 'admissions.office@eur.nl' } },
      { name: 'Erasmus University College (EUC)', field: 'Selective liberal-arts college within Erasmus Rotterdam', need: 'A stricter bar than Erasmus’s own general bachelor’s admission above, from the same university: minimum overall NSC score of 70%, with Mathematics at achievement level 6 or higher.', url: 'https://www.eur.nl/en/euc/application-admissions/admission-requirements', apply: { url: 'https://www.eur.nl/en/euc/application-admissions/application-procedure', note: 'Apply via Studielink (€100 fee)' }, contact: { email: 'admissions@euc.eur.nl' } },
    ].map(uniCard).join('')}
  </div>
  <p class="small muted">Treat these as confirmed exceptions, not a rule – most Dutch research universities still ask for VWO. Always check the specific faculty’s own page.</p>
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('🎓', 'Universities that need more than a plain matric')}
  <div class="stack">
    ${[
      { name: 'TU Delft – a worked example of “not equivalent” in practice', need: 'States the NSC/IEB is “not considered to be equivalent” to the Dutch pre-university (VWO) diploma. Requires South African applicants to have completed at least the first year (60 ECTS) of a BSc/BEng at an accredited academic university, in the same or a closely related field, with a GPA of at least 75%.', url: 'https://www.tudelft.nl/en/education/admission-and-application/bsc-international-diploma/admission-requirements/country-specific-requirements', apply: { url: 'https://www.tudelft.nl/en/education/admission-and-application/bsc-international-diploma/1-admission-requirements', note: 'Apply via Studielink, then MyTUDelft' }, contact: { email: 'info@tudelft.nl', phone: '015-2789111', url: 'https://www.tudelft.nl/en/about-tu-delft/contact' } },
      { name: 'University of Amsterdam – PPLE (Politics, Psychology, Law & Economics)', need: 'Needs the NSC (with the South Africa Bachelor’s-admission endorsement) AND a successfully completed first year of full-time South African university Bachelor’s study, with a university GPA of at least 70, a supplementary maths exam, and an English score of at least 75.', url: 'https://pple.uva.nl/how-to-apply/entry-requirements/requirements-per-diploma-type/your-entry-requirements.html', apply: { url: 'https://pple.uva.nl/how-to-apply/application-guide/application-guide.html', note: 'Apply via Studielink, then the SIS portal' }, contact: { phone: '+31 (0)20 525 9099', url: 'https://pple.uva.nl/contact' } },
    ].map(uniCard).join('')}
  </div>
  <p class="small muted">Both ask for university-level study on top of your NSC, not instead of it – the “not equivalent to VWO” pattern, applied by two different universities.</p>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Funding</h2>
    ${claims([
      v('The Dutch government’s **Holland Scholarship**, run through Nuffic and participating universities (including Groningen, VU, Erasmus, TU Delft and UvA), is worth **€5,000** in your first year of study. Eligibility is non-nationality-restrictive beyond being from outside the EEA – South Africa qualifies. The 2026/27 cycle opened 1 November 2025; check each participating university’s own page for its specific deadline.', [src('Study in NL, Nuffic', 'https://www.studyinnl.org/finances/holland-scholarship')]),
    ])}
  </div>
</section>`,
  },
  {
    id: 'germany', name: 'Germany', published: false,
    teaser: 'The anabin/DAAD process, the blocked account you need, and why it needs checking case by case.',
    lead: 'Expect an extra step, and expect it to differ by university – Germany doesn’t have one simple rule for an NSC, so this page explains the system rather than inventing a number.',
    body: `
<section class="section wrap wrap--narrow">
  <div class="callout callout--warn">
    <h3>${iconOrEmoji('⚠️')} How access is decided</h3>
    ${claims([
      g('Germany decides access through the **anabin** database (run by the Central Office for Foreign Education, ZAB) and the **DAAD admission database**, with universities – often working through **uni-assist’s** preliminary review (VPD) – making the final call. anabin rates individual schools/institutions, by classifying them H+ (direct access), H+/− (conditional – usually a Studienkolleg route) or H− (not sufficient on its own). There is no single anabin “rule” for the NSC as a whole – it depends on your specific school’s classification. An old 2013 DAAD brochure describing a general NSC rule is outdated – the only reliable check is DAAD’s own current admission database and anabin, per school and university.'),
      g('We searched directly on thirteen major German universities’ own international-admissions pages (TU Munich, LMU Munich, RWTH Aachen, Heidelberg, Humboldt Berlin, TU Berlin, Freiburg, Mannheim, Bonn, Stuttgart, Constructor University Bremen, KIT Karlsruhe, TU Dresden) and found none that publish South Africa or NSC-specific entry figures – every one routes international applicants to uni-assist and anabin instead. That absence is itself the finding: unlike the UK, Ireland or the Netherlands, German universities generally don’t publish their own NSC pages, because the classification is centrally brokered.'),
      g('Language also depends on the course: German-taught degrees need a German-language certificate such as the DSH, and Studienkollegs are taught entirely in German.'),
    ])}
    ${checksBox([
      { label: 'DAAD admission database', url: 'https://www2.daad.de/deutschland/nach-deutschland/voraussetzungen/en/' },
      { label: 'anabin, Central Office for Foreign Education', url: 'https://anabin.kmk.org' },
      { label: 'uni-assist, preliminary review (VPD)', url: 'https://www.uni-assist.de' },
    ])}
  </div>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Money: the blocked account (Sperrkonto)</h2>
    ${claims([
      r('A German student visa needs a blocked account – reported at roughly **€11,904/year (€992/month)**, released to you monthly after you arrive, plus any provider’s own set-up fee on top. This figure is consistently cited across multiple sources, but we couldn’t get a clean direct read of the German missions’ own page in this pass – confirm it yourself before you budget around it.', [src('German missions in Africa, blocked account', 'https://germanyinafrica.diplo.de/zadz-en/sperrkonto/388600')]),
    ])}
  </div>
</section>`,
  },
  {
    id: 'canada', name: 'Canada', published: true,
    teaser: 'Study-permit proof-of-funds rules, and what changed for applications from September 2026.',
    lead: 'The study-permit money rule changed for the 2026/27 intake – here’s the current figure, checked directly on canada.ca.',
    body: `
<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Study permit: proof of funds</h2>
    ${claims([
      v('For study-permit applications submitted on or after **1 September 2026**, a single student outside Quebec must show **CAD 23,448** for one year of living expenses (up from CAD 22,895) – this is on top of first-year tuition and travel costs, not instead of them. Quebec sets its own, separate figure.', [src('canada.ca', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html')]),
    ])}
  </div>
</section>

<section class="section wrap wrap--narrow" id="examples">
  ${sectionHead('🎓', 'Universities with published South Africa entry rules', 'Canada has no single national equivalency rule like the UK’s UCAS – each university sets its own.')}
  <div class="stack">
    ${[
      { name: 'University of British Columbia (UBC, Vancouver)', field: 'Programme-specific course requirements', need: 'Needs the National Senior Certificate; past years required around a 75% average (minimum pass 40%). Specific course prerequisites vary by programme, e.g. Applied Science (Engineering) and Science need Pre-Calculus Maths and Physical Sciences; Commerce needs Pre-Calculus Maths; Dental Hygiene needs Life Science, Physical Science, and an interview.', url: 'https://you.ubc.ca/applying-ubc/requirements/international-high-schools/', apply: { url: 'https://you.ubc.ca/applying-ubc/how-to-apply/application/', note: 'Apply via EducationPlannerBC (CAD 173.25 for study-permit applicants)' }, contact: { phone: '604 822 8999', url: 'https://you.ubc.ca/contact-us/' } },
      { name: 'Western University', field: 'Programme-specific course requirements', need: 'Needs the Senior Certificate with Matriculation endorsement; typically admits with the equivalent of a B (3.0) average. Required subjects vary: Medical Sciences needs Biology, Chemistry and Maths; Nursing needs Biology, Chemistry, English and Maths; Arts & Humanities has none.', url: 'https://welcome.uwo.ca/next-steps/requirements/international-high-school/south-africa.html', contact: { email: 'international@uwo.ca', phone: '(519) 661-2100' } },
      { name: 'University of Ottawa', field: 'General undergraduate entry', need: 'Applicants straight from the NSC need a minimum 75% average (higher for some programmes); applicants with some post-secondary study already need a minimum 70% average.', url: 'https://www.uottawa.ca/study/undergraduate-studies/international-applicants/south-africa' },
      { name: 'University of Toronto', field: 'General undergraduate entry, no published percentage', need: 'Requires the National Senior Certificate with matriculation endorsement, but publishes no specific percentage – admission is competitive review on top of meeting the matriculation endorsement.', url: 'https://future.utoronto.ca/international-high-school-requirements-country?page=6', apply: { url: 'https://future.utoronto.ca/international-students/apply-now/', note: 'Apply via OUAC (Ontario Universities’ Application Centre)' }, contact: { email: 'international@utoronto.ca', phone: '+1 416 946 8828', url: 'https://international.utoronto.ca/about/contact-us/' } },
      { name: 'McGill University', field: 'General undergraduate entry', need: 'Accepts “Senior Certificates” with a minimum requirement equivalent to a B+ average – most programmes set a higher bar.', url: 'https://www.mcgill.ca/undergraduate-admissions/apply/requirements/international/other', apply: { url: 'https://www.mcgill.ca/undergraduate-admissions/step-step-guide', note: 'Apply via the McGill Applicant Portal' }, contact: { email: 'futurestudents@mcgill.ca', url: 'https://www.mcgill.ca/undergraduate-admissions/contact-us' } },
    ].map(uniCard).join('')}
  </div>
  <p class="small muted">A handful of examples, not a full list – always check the specific university’s own international-admissions page, since course prerequisites can differ a lot within one university.</p>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Funding</h2>
    ${claims([
      v('UBC’s **Karen McKellin International Leader of Tomorrow (ILOT) Award** is need-and-merit based: it covers significant or full financial need plus tuition, and is renewable for up to 3–4 years, for students who “would be unable to attend university without significant financial assistance.” Fewer than 30 are awarded each year, so it’s highly competitive – but it’s open to all international undergraduate applicants, with no South Africa exclusion on the page.', [src('you.ubc.ca', 'https://you.ubc.ca/financial-planning/scholarships-awards-international-students/international-scholars/')]),
    ])}
  </div>
</section>`,
  },
  {
    id: 'australia', name: 'Australia', published: true,
    teaser: 'Subclass 500 visa fee, living-cost funds, and what UNSW, UWA and Sydney actually ask South Africans for.',
    lead: 'Several Australian universities convert your NSC average directly into an entry score, and the visa money rules are published in plain figures.',
    body: `
<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Student visa (subclass 500)</h2>
    ${claims([
      v('Visa application fee: **AUD 2,500 from 1 July 2026**, up from AUD 2,000, unless you qualify for an exemption.', [src('studyaustralia.gov.au', 'https://www.studyaustralia.gov.au/en/plan-your-move/your-guide-to-visas/student-visa-subclass-500')]),
      v('Proof of funds required: at least **AUD 29,710**, on top of first-year tuition and travel costs. You also need an electronic Confirmation of Enrolment (eCoE), Overseas Student Health Cover (OSHC) for your whole stay, and to meet the Genuine Student requirement.', [src('studyaustralia.gov.au', 'https://www.studyaustralia.gov.au/en/plan-your-move/visa-application-process')]),
    ])}
  </div>
</section>

<section class="section wrap wrap--narrow" id="examples">
  ${sectionHead('🎓', 'Universities with published South Africa (NSC) entry rules')}
  <div class="stack">
    ${[
      { name: 'UNSW Sydney', field: 'Guide, 2027 entry, varies by degree', need: 'Publishes an NSC-to-degree table: your NSC average (best 4 subjects, excluding Life Orientation) needs to be around 62% for most Arts/Science/Social Science degrees, 70% for Engineering (Hons), 72% for Commerce or Combined Law, up to 77% for the Medical Studies/MD pathway and 79% for Actuarial Studies.', url: 'https://www.unsw.edu.au/content/dam/pdfs/future-students/2027-int-ug-entry-table.pdf', apply: { url: 'https://www.unsw.edu.au/study/how-to-apply/international', note: 'Apply via the UNSW Applicant Portal' }, contact: { phone: '+61 2 9385 1844' } },
      { name: 'University of Western Australia', field: 'Guide, varies by course', need: 'Converts your NSC average (best six subjects, excluding Life Orientation, on the 1–7 scale) to an ATAR equivalent, e.g. 4.6 ≈ ATAR 80, 5.8 ≈ ATAR 90, 6.8 ≈ ATAR 98. Course-specific ATAR-equivalent cut-offs, confirmed on UWA’s own course prerequisites table: Environmental Design 75, Engineering (Honours) 80, Commerce 80, Economics 85, Law (JD pathway) 96, Medicine (via Biomedicine) 98.', url: 'https://www.uwa.edu.au/study/how-to-apply/international-and-overseas-qualifications/south-african-national-certificate', apply: { url: 'https://www.uwa.edu.au/study/how-to-apply/international-applicants', note: 'Apply via the UWA Application Portal (AUD 150 fee)' }, contact: { phone: '+61 8 6488 1000' } },
      { name: 'University of Sydney', field: 'Programme-specific, 2027 International Admission Guide', need: 'Publishes an exact NSC average (best 4 subjects, excluding Life Orientation) needed per degree, e.g. Arts 81, Science 84, Commerce 94, Engineering Honours (most streams) 87, Design in Architecture 90, Music 77, Psychology 80 (Honours 91), Physiotherapy 95. Medicine runs through a separate pathway.', url: 'http://www.sydney.edu.au/dam/corporate/documents/study/how-to-apply/international-admission-guide.pdf', apply: { url: 'https://www.sydney.edu.au/study/applying/how-to-apply/international-students.html', note: 'Apply via your course page or an authorised agent' }, contact: { email: 'international.admissions@sydney.edu.au', phone: '1800 793 864 (within Australia)', url: 'https://www.sydney.edu.au/study/applying/how-to-apply/international-students/contact-our-regional-experts.html' } },
      { name: 'University of Queensland (UQ)', field: '⚠️ Addressed to SA-schooled Queensland-domestic applicants, not the standard international pathway', need: 'UQ’s own “South African National Senior Certificate information sheet” gives the most precise NSC-to-score conversion we found anywhere: minimum pass is NSC grade 4 (50%) since 2008, with a full table converting your average of best 5 subjects into a Selection Rank (e.g. 6.00 → Rank 93.00; 5.27 → Rank 82.00). It explicitly addresses domestic/Queensland-resident applicants who did SA schooling – check with UQ which pathway applies to you.', url: 'https://study.uq.edu.au/sites/default/files/2020-03/south-african-senior-certificate-info-sheet.pdf', apply: { url: 'https://apply.uq.edu.au/', note: 'Apply via UQ’s application portal (AUD 150 per application)' }, contact: { email: 'admissions@uq.edu.au', phone: '+61 7 3365 2203' } },
      { name: 'Australian National University (ANU)', field: 'NSC average to ANU Entrance Rank', need: 'Publishes a direct conversion table from your NSC indicative score to an ANU Entrance Rank, e.g. 64 → 80, 70 → 90, 76 → 95, 82 → 98, 85 → 99.', url: 'https://study.anu.edu.au/apply/indicative-entry-requirement/south-african-national-senior-certificate', apply: { url: 'https://study.anu.edu.au/apply/international-applications', note: 'Apply via ANU StudyLink (AUD 150 per application)' }, contact: { email: 'admissions@anu.edu.au' } },
    ].map(uniCard).join('')}
  </div>
  <p class="small muted">A handful of examples, not a full list.</p>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Funding</h2>
    ${claims([
      v('University of Sydney’s **International Undergraduate Academic Excellence Scholarship** covers **100% of tuition fees and the Student Services and Amenities Fee (SSAF)** for your degree’s full published duration. Around 20 are awarded globally each year, across two intakes – highly competitive, but currently open with no nationality exclusion on the page.', [src('sydney.edu.au', 'https://www.sydney.edu.au/scholarships/e/sydney-international-undergraduate-academic-excellence-scholarship.html')]),
    ])}
  </div>
</section>`,
  },
  {
    id: 'usa', name: 'United States', published: true,
    teaser: 'The SEVIS fee, F-1 visa steps, and where the NSC fits into a Common App application.',
    lead: 'Applications go through each university individually (or the Common App), and the visa process has its own fees and steps separate from admission itself.',
    body: `
<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">F-1 student visa: fees and steps</h2>
    ${claims([
      v('SEVIS I-901 fee: **US$350** for F-1 students, paid before your visa interview and separate from any university application fee.', [src('ice.gov', 'https://www.ice.gov/sevis/i901')]),
      r('Visa application (MRV) fee: reported at **US$185**, unchanged through 2026. A separate US$250 “Visa Integrity Fee” was created by US law for FY2026 and applies broadly to nonimmigrant visa categories including F-1, but as of the most recent reporting we found, it was **not yet being collected**. This could change at short notice, so confirm the current total on travel.state.gov before you budget.', [src('travel.state.gov', 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html')]),
      g('Broad steps: your university issues the I-20 → you pay the SEVIS fee → you complete the DS-160 form → you interview at a US Embassy or Consulate.'),
    ])}
    ${checksBox([{ label: 'Common App', url: 'https://www.commonapp.org' }])}
  </div>
</section>

<section class="section wrap wrap--narrow" id="examples">
  ${sectionHead('🎓', 'Universities with published South Africa entry rules')}
  <div class="stack">
    ${[
      { name: 'University of Southern Indiana', field: 'General undergraduate entry', need: 'States its equivalent-credentials requirement for South African applicants as the National Senior Certificate (NSC, from 2008 onwards) with 130 credits.', url: 'https://www.usi.edu/international/admissions/how-to-apply/equivalent-credentials', apply: { url: 'https://connect.usi.edu/apply/', note: 'Apply online ($40 fee)' }, contact: { email: 'usi1apply@usi.edu', phone: '+1 812 464 1768' } },
      { name: 'Oregon State University', field: 'General undergraduate entry, 3 pathways', need: 'Its country-requirements table (headed “Senior Certificate,” which may be older terminology but matches the NSC’s post-2008 achievement scale) sets: 55% average for its foundation pathway; 60% average (minimum 40% per subject) for direct/accelerated entry; 55% on transferable coursework for direct transfer.', url: 'https://admissions.oregonstate.edu/sites/admissions.oregonstate.edu/files/ug_country_requirements_1.pdf', apply: { url: 'https://intlapps.oregonstate.edu/login/', note: 'Apply via OSU’s international applicant portal (not the Common App)' }, contact: { email: 'intladmit@oregonstate.edu', url: 'https://admissions.oregonstate.edu/international/contact-us' } },
      { name: 'University of Iowa', field: 'General undergraduate entry', need: 'Names the National Senior Certificate directly: minimum grade “B or 70%” for certificates issued since 2008, “C or 60%” for pre-2008 certificates. South African applicants are exempt from the usual English-proficiency requirement.', url: 'https://admissions.uiowa.edu/apply/academic-requirements-country', apply: { url: 'https://admissions.uiowa.edu/apply/international-application-process', note: 'Apply via the University of Iowa application or Common App ($80 fee)' }, contact: { email: 'international@uiowa.edu' } },
      { name: 'Andrews University', field: 'General undergraduate entry', need: 'Names the NSC directly: at least five subjects passed, including English and Maths, with a minimum GPA of 2.50 on the NSC’s 7-point achievement scale.', url: 'https://www.andrews.edu/services/international/ugcountryreqs/africa-ug.html', apply: { url: 'https://apply.andrews.edu/en-US/andrews-application-transition', note: 'Apply online ($30 fee, plus a $100 international student fee)' }, contact: { email: 'iss@andrews.edu', phone: '+1 269 471 6395' } },
      { name: 'University of Memphis', field: 'Document acceptance, no stated minimum average', need: 'Its South Africa-specific page lists which SA certificates it accepts (NSC, Senior Certificate, Senior Certificate with Matriculation Exemption, and several provincial variants) but publishes no numeric minimum average – a separate general English-proficiency requirement still applies.', url: 'https://www.memphis.edu/admissions/international/southafrica.pdf', apply: { url: 'https://apply.memphis.edu/apply/', note: 'Apply via a Tiger Tracks account ($50 fee)' }, contact: { email: 'admissions@memphis.edu' } },
    ].map(uniCard).join('')}
  </div>
  <p class="small muted">A handful of examples, not a full list. Some universities require your NSC to be independently evaluated by a service like World Education Services (WES) before they’ll accept it, separately from admission itself.</p>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Funding</h2>
    ${claims([
      r('University of Southern Indiana’s **International Merit Scholarships** are reported to be worth **$500–$3,000 per year**, renewed each year, for incoming freshmen with a minimum 3.25 high-school GPA – a separate scholarship application is required. We cross-referenced this against USI’s own international-admissions language rather than reading it directly off a USI scholarships page, so treat the exact figures as reported, not verified, until you confirm them with USI directly.', [src('usi.edu, cross-referenced via a scholarship directory', 'https://www.usi.edu/international/admissions/how-to-apply')]),
    ])}
  </div>
</section>`,
  },
  {
    id: 'hungary', name: 'Hungary', published: false,
    teaser: 'Stipendium Hungaricum – the clearest fully-funded undergraduate scholarship open to South Africans.',
    lead: 'Most fully-funded scholarships overseas are postgraduate only. Stipendium Hungaricum is the clearest exception – it’s open to undergraduates, and South Africa is an eligible country.',
    body: `
<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">What it covers</h2>
    ${claims([
      v('Full tuition, a contribution toward accommodation, a monthly stipend and medical insurance. It explicitly covers **Bachelor’s (undergraduate)** level, not just Master’s or PhD study, at Hungarian universities.', [src('stipendiumhungaricum.hu', 'https://stipendiumhungaricum.hu'), src('dhet.gov.za', 'https://www.internationalscholarships.dhet.gov.za/index.php/scholarships/undergraduate-scholarships/253-hungary-stipendium-hungaricum-for-south-africa-2027')]),
    ])}
  </div>
</section>

<section class="section wrap wrap--narrow">
  <div class="card">
    <h2 class="h3">Eligibility and how to apply</h2>
    ${claims([
      v('DHET’s published eligibility rules for South African applicants: a South African citizen in good health; born before 31 August 2008; a minimum 60% NSC average for undergraduate applicants (Life Orientation excluded) or 60% in your previous degree for postgraduate applicants; a genuine interest in studying in Hungary and a commitment to South Africa’s development; meets the chosen programme’s own entry requirements; not already self-funded at the same or a lower level in Hungary.', [src('dhet.gov.za', 'https://www.internationalscholarships.dhet.gov.za/index.php/scholarships/undergraduate-scholarships/253-hungary-stipendium-hungaricum-for-south-africa-2027')]),
      r('You apply online to the Tempus Public Foundation, plus nomination through South Africa’s DHET process. For the cycle that closed 15 January 2026 (for September 2026 entry), those were the live rules. DHET hadn’t yet published the next cycle’s (2027/28) dates at the time of this check – secondary sources estimate a similar mid-January deadline by pattern, but that is not officially confirmed.', []),
    ])}
  </div>
</section>

<section class="section wrap wrap--narrow" id="examples">
  ${sectionHead('🎓', 'A university with published South Africa entry rules')}
  <div class="stack">
    ${[
      { name: 'University of Pécs', field: 'General admission, undergraduate (BA/BSc) and preparatory programmes', need: 'Names South Africa specifically: accepts the National Senior Certificate (from Umalusi or IEB), as long as the certificate indicates you’ve met South Africa’s own minimum requirement for admission to a Bachelor’s programme.', url: 'https://international.pte.hu/sites/international.pte.hu/files/2025-10/general-admission-diploma-requirements_1.pdf' },
    ].map(uniCard).join('')}
  </div>
  <p class="small muted">We directly checked Semmelweis, Debrecen, ELTE, BME, Szeged, Corvinus and several others – Pécs is the only one that names South Africa or the NSC/IEB on its own published admissions page. The rest use generic “equivalent foreign certificate” wording with no country list, so this is a genuine gap, not something we haven’t looked for.</p>
</section>`,
  },
  {
    id: 'newzealand', name: 'New Zealand', published: false,
    teaser: 'One confirmed university so far – held back until we’ve checked a few more, and the visa and money rules.',
    lead: 'We’ve only checked one New Zealand university’s own page so far, and haven’t yet checked its visa or money rules – this page is held back until there’s enough here to be useful.',
    body: `
<section class="section wrap wrap--narrow" id="examples">
  ${sectionHead('🎓', 'A university with published South Africa entry rules')}
  <div class="stack">
    ${[
      { name: 'University of Auckland', field: 'Guide, varies by programme', need: 'Converts the NSC (an aggregate of your best 6 subjects, excluding Life Orientation) into a required aggregate score per programme, e.g. 27 for most Arts/Science/Architecture degrees, 30 for Business/Creative Arts, 36 for a Bachelor of Commerce, and 37 for Law or Health Sciences (which must include Mathematics and Physical Sciences).', url: 'https://www.auckland.ac.nz/assets/study/applications-and-admissions/entry-requirements/undergraduate-entry-requirements/overseas-secondary-school-applicants/2025-Undergraduate-programme-specific-entry-requirements-J-Z-Final%20v2.pdf' },
    ].map(uniCard).join('')}
  </div>
</section>`,
  },
];

function countryHub() {
  const published = COUNTRIES.filter((c) => c.published);
  return `
<section class="section wrap wrap--narrow" id="examples">
  ${sectionHead('🎓', 'Costs, funding, visas, and deadlines – pick a country', 'A few foreign universities publish exactly what NSC/matric grades they want, and each country has its own visa fees and money rules that change most years. Each guide below is checked against official sources, with every figure linked to where it came from.')}
  <div class="grid grid--2">
    ${published.map((c) => `<a class="card card--link" href="/study-abroad/${esc(c.id)}"><h3>${esc(c.name)}</h3><p class="small muted">${esc(c.teaser)}</p></a>`).join('')}
  </div>
  <p class="small muted jargon-key">${iconOrEmoji('🔜')} More countries are added once we can verify their universities and visa rules against official sources – Germany, Hungary and New Zealand are researched but held back for now, for the same reason.</p>
</section>`;
}

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
    <h3>Why this page itself has no entry requirements</h3>
    <p>Everywhere else on Studypath, every requirement links to the official page it came from. Entry requirements, money, visas and funding differ by country, so rather than repeat what agents and forums say in one general place, <strong>those numbers live on each country’s own guide below</strong>, each checked against the official source.</p>
    <p>Everything on this page is ${tag('general', 'general guidance about the process')} unless it’s tagged ${tag('verified', 'checked against the official source')} – each paragraph is marked, and each section tells you where to check it.</p>
  </div>
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('🛤️', 'Two ways to do it')}
  <div class="stack">
    ${ROUTES.map((r) => `<article class="card"><h3><span aria-hidden="true">${r.emoji}</span> ${r.title}</h3>${claims(r.paras)}${checksBox(r.checks)}</article>`).join('')}
  </div>
</section>

${countryHub()}

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
    <div class="card"><h3>Will your NSC need independent evaluation?</h3>${claims([
      { level: 'reported', text: 'Some countries want your NSC checked by a credential-evaluation service before a university or visa office will accept it, separately from the university’s own admissions decision – UK ENIC (formerly UK NARIC) does this for the UK, and World Education Services (WES) is commonly required for the USA and Canada.', sources: [{ label: 'UK ENIC', url: 'https://www.enic.org.uk' }, { label: 'World Education Services (WES)', url: 'https://www.wes.org' }] },
      g('Even where your NSC was taught in English, some universities still ask for an English test like IELTS or TOEFL – whether you’re exempt depends on the specific university, not a general rule, so check the course page itself.'),
    ])}</div>
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

/** One page per published country - see COUNTRIES above. Germany and Hungary are
 * researched but `published: false`, so they generate no page and no link until a
 * later pass finishes them (more universities, confirmed figures where we're still
 * "reported"). */
export function abroadCountryPages() {
  return COUNTRIES.filter((c) => c.published).map((c) => ({
    path: `/study-abroad/${c.id}`,
    title: `Studying in ${c.name === 'United States' ? 'the United States' : c.name === 'United Kingdom' ? 'the UK' : c.name} from South Africa`,
    description: `${c.teaser} Checked against official sources, with every figure linked to where it came from.`,
    body: `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow"><a href="/study-abroad">Study abroad</a> › ${esc(c.name)}</p>
    <h1>${iconOrEmoji('🌍')} Studying in ${c.name === 'United States' ? 'the United States' : c.name === 'United Kingdom' ? 'the UK' : esc(c.name)}</h1>
    <p class="lead">${esc(c.lead)}</p>
  </div>
</section>
${c.body}
<section class="section wrap wrap--narrow">
  <div class="callout">
    <h3>Not sure ${esc(c.name)} is the right fit?</h3>
    <p><a href="/study-abroad">See every country we’ve checked →</a></p>
  </div>
</section>`,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Study abroad', path: '/study-abroad' }, { name: c.name, path: `/study-abroad/${c.id}` }],
  }));
}
