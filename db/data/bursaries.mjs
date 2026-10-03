// Bursaries and funding we have verified against the provider's own page.
//
// The rule is the same as for admission requirements: a bursary is listed only once we
// have its closing date and terms from an official source, and we link to that source.
// A list of unverified "opportunities" would do more harm than an empty one - bursary
// scams are common and students are exactly who they target.
//
// Researching bursaries is ONGOING. NSFAS, Eskom, the FirstRand Empowerment Foundation
// bursary, Vodacom's, and the six added 2026-10-02 (Funza Lushaka, Harmony Gold, Implats,
// Nedbank, GCRA and Masakh'iSizwe) are `verified` (each one's provider/administrator page
// was fetched directly in the relevant pass). The rest are `reported` - sourced to the
// provider's own page by an earlier Studypath research pass, not re-fetched by us this pass.
// Do not add a bursary here without at least a provider page for `source_url`.
//
// Fields match the D1 `bursaries` table.

export const bursaries = [
  {
    id: 'nsfas-2027',
    name: 'NSFAS funding for 2027',
    provider: 'National Student Financial Aid Scheme (NSFAS)',
    field_of_study: 'Any course at a public university or TVET college',
    deadline: '2026-11-18',
    amount_covers: null, // not confirmed from the sources we read, so not stated
    eligibility:
      'South African citizens studying (or applying to study) at a public university or TVET college, with a combined household income of R350,000 or less per year (R600,000 or less with a disability; R122,000 for students who registered before 2018). SASSA grant recipients (Child Support, Foster Care, Care Dependency) automatically meet the income test. Confirmed directly from nsfas.org.za\'s own "bursary scheme" page.',
    apply_url: 'https://www.nsfas.org.za',
    source_url: 'https://nsfas.org.za/content/bursary-scheme.html',
    active: 1,
    // Not a D1 column - shown on the page:
    note: 'Applications opened 18 September 2026 and close 18 November 2026; funding outcomes are communicated in December. One other website gave 31 October - the Minister’s launch speech and the SAnews report both say 18 November.',
    verification: 'verified',
  },
  {
    id: 'eskom-bursary-2027',
    name: 'Eskom Bursary Programme (Engineering Diploma)',
    provider: 'Eskom',
    field_of_study: 'Engineering diplomas at a university of technology (electrical, mechanical, civil, chemical, measurement control & instrumentation, BEng Tech)',
    deadline: '2026-09-22',
    amount_covers: null, // Eskom's wider bursary scheme is reported elsewhere to cover tuition and more, but the page we read (the diploma stream's own application page) does not itemise what it covers, so we do not state one
    eligibility:
      'South African citizen, not already holding another bursary, with Grade 11 final or Grade 12 results showing English level 4, Mathematics level 4 and Physical Science level 4, and conditional acceptance to an engineering diploma at a University of Technology.',
    apply_url: 'https://eskomcareers.ci.hr',
    source_url: 'https://eskomcareers.ci.hr/?amp=&amp=&bursaryid=c1f1088a-71ee-4f15-a51c-73c194f5542e&controller=Bursaries&method=view',
    active: 1,
    note: 'This is Eskom\'s Engineering Diploma stream specifically - the page we read states Grade 11 year-end results will be considered but the final decision depends on 2026 matric results. Eskom also runs an Engineering Degree stream and a Non-Technical stream (accounting, law, nursing, psychology, data science, supply chain) covering the same 22 September 2026 closing date per secondary sources, but we have not independently fetched those pages, so only the Diploma stream is shown here.',
    verification: 'verified',
  },
  {
    id: 'firstrand-empowerment-2027',
    name: 'FirstRand Empowerment Foundation Undergraduate Bursary',
    provider: 'FirstRand Empowerment Foundation (administered by StudyTrust)',
    field_of_study: 'Commerce, Engineering, Science and Technology',
    deadline: '2026-09-30',
    amount_covers: 'Tuition fees, accommodation, meals, learning resources, a monthly stipend, and a computer for first-year students',
    eligibility:
      'Black South African citizens as defined by the B-BBEE Act; Grade 12 Mathematics (not Maths Literacy) at least level 5; not older than 21 in their first year of study; provisionally admitted to a South African public traditional university to start a first degree in 2027; combined family gross annual income up to R700,000.',
    apply_url: 'https://studytrust.org.za/fref-bursary/',
    source_url: 'https://studytrust.org.za/fref-bursary/',
    active: 1,
    note: 'Application season runs 1 June to 30 September each year.',
    verification: 'verified',
  },
  {
    id: 'vodacom-external-2027',
    name: 'Vodacom External Bursary Programme',
    provider: 'Vodacom',
    field_of_study: 'Science, Technology, Engineering, Mathematics (STEM), Business and Commercial fields',
    deadline: '2026-08-31',
    amount_covers: 'Full registration and tuition, full university accommodation (or a capped amount for private accommodation), textbooks, a meal allowance, a laptop and a cellphone',
    eligibility:
      'South African citizen by birth; full-time undergraduate study at a South African tertiary institution; Matric with exemption and an average of 70% or higher for new applicants, or 65% or higher if already at tertiary level.',
    apply_url: 'https://www.vodacom.com/bursary-programme.php',
    source_url: 'https://www.vodacom.com/bursary-programme.php',
    active: 1,
    note: null,
    verification: 'verified',
  },
  // The five below come from a prior Studypath research pass (sourced to each provider's own
  // page or media release), not re-fetched by us this pass - several SA bursary sites block
  // automated fetches, including Sasol's (confirmed live during this pass). They're `reported`,
  // not `verified`, and link to the provider's main site rather than a guessed deep link.
  {
    id: 'sasol-mainstream-2027',
    name: 'Sasol Bursary Programme (Mainstream)',
    provider: 'Sasol',
    field_of_study: 'Engineering and Science (full-time undergraduate)',
    deadline: '2026-05-17',
    amount_covers: 'Tuition, a living allowance, and psychosocial support',
    eligibility: '"Exceptional young South African talent" studying full-time Engineering or Science. UNISA (distance) studies are not considered.',
    apply_url: 'https://www.sasolbursaries.com',
    source_url: 'https://www.sasolbursaries.com',
    active: 1,
    note: 'Applications opened 1 April 2026 and closed 17 May 2026, with outcomes by the end of September 2026. Sasol says recipients "can begin their careers at Sasol after completing their degrees" - the exact contractual work-back terms aren’t published on the page we found, so don’t assume specifics. Search "Sasol Bursaries" if the link above doesn’t take you straight there.',
    verification: 'reported',
  },
  {
    id: 'sasol-foundation-2027',
    name: 'Sasol Foundation Bursary Programme',
    provider: 'Sasol Foundation',
    field_of_study: 'Mainly STEM, with limited places for some non-STEM fields (e.g. Accounting, Financial Sciences)',
    deadline: '2026-08-23',
    amount_covers: '"All-inclusive" undergraduate bursary (exact components not itemised on the page we found)',
    eligibility: 'Academically talented learners/students from Sasol’s local communities, children of Sasol employees, and children of Sasol Khanyisa shareholders; aimed at low-income and "missing middle" households.',
    apply_url: 'https://www.sasolbursaries.com',
    source_url: 'https://www.sasolbursaries.com',
    active: 1,
    note: 'Window was 1-23 August 2026. This is a different, more targeted programme from the Mainstream bursary above - check which one you actually qualify for before applying.',
    verification: 'reported',
  },
  {
    id: 'allan-gray-orbis-2027',
    name: 'Allan Gray Orbis Foundation University Fellowship',
    provider: 'Allan Gray Orbis Foundation',
    field_of_study: 'Any (the Fellowship funds the person, not a specific field)',
    deadline: '2026-04-30',
    amount_covers: 'Needs-based university funding, mentorship, and entrepreneurial development',
    eligibility: 'Current Grade 12 learners, no older than 21, South African citizens.',
    apply_url: 'https://www.allangrayorbis.org',
    source_url: 'https://www.allangrayorbis.org',
    active: 1,
    note: 'Closed 30 April 2026 at 17h00 SAST, with an online interview around 31 July and a selection camp in September 2026. Unlike some corporate bursaries, the Foundation’s own announcement says Fellows "are not tied to working for a specific organisation" afterwards - there’s no employer work-back requirement.',
    verification: 'reported',
  },
  {
    id: 'investec-tertiary-2027',
    name: 'Investec Tertiary Bursary Programme',
    provider: 'Investec (with StudyTrust)',
    field_of_study: 'Financial-sector-related degrees',
    deadline: '2026-09-30',
    amount_covers: null,
    eligibility: 'Young South Africans with academic potential and financial need, from first year through to Honours.',
    apply_url: 'https://www.investec.com',
    source_url: 'https://www.investec.com',
    active: 1,
    note: 'Aggregator sites describe it as covering the "full cost" of study, but we could not confirm the exact coverage on Investec’s own page in this pass. Search "Investec Tertiary Bursary" if the link above doesn’t take you straight there.',
    verification: 'reported',
  },
  {
    id: 'saica-thuthuka-2027',
    name: 'SAICA Thuthuka Bursary Fund',
    provider: 'SAICA (South African Institute of Chartered Accountants)',
    field_of_study: 'SAICA-accredited BCom Accounting (the CA(SA) route)',
    deadline: null,
    amount_covers: null,
    eligibility: 'South African citizen; Black African or Coloured; in Grade 12 or no more than two years out of school; at least 60% (level 5) in Mathematics; combined family income of R350,000 a year or less; must apply for and write the National Benchmark Tests (NBTs) before the end of August.',
    apply_url: 'https://www.saica.org.za',
    source_url: 'https://www.saica.org.za',
    active: 1,
    note: 'The eligibility rules above are confirmed on SAICA’s own "Apply to the Thuthuka Bursary" page, but its closing date and time were not shown there - sources disagree on both the exact date and whether it’s an AM or PM cut-off, so we show no deadline rather than guess. Search "SAICA Thuthuka" and confirm the current closing date yourself.',
    verification: 'reported',
  },
  // The six below were added 2026-10-02, each verified by a direct fetch of the provider's
  // own page this pass.
  {
    id: 'funza-lushaka-2027',
    name: 'Funza Lushaka Bursary Programme',
    provider: 'Department of Basic Education (DBE)',
    field_of_study: 'B.Ed degree or PGCE, specialising in two or more priority teaching subjects/phases (e.g. Mathematics, Science, languages, Foundation Phase, Technology)',
    deadline: '2027-01-31',
    amount_covers: null, // not itemised on the pages we read
    eligibility:
      'South African citizen under 30; accepted into an approved B.Ed or PGCE programme specialising in two or more priority areas; an exemption/endorsement or "admission to bachelor degree studies" matric pass; at least a level 4 (50%) pass in the matric subject linked to the chosen priority area (Foundation Phase specialists also need a Mathematics or Mathematical Literacy pass plus level 4 Home Language; Technology/CAT specialists without those subjects at matric need at least level 4 Mathematics); does not fund extended programmes. Recipients must teach at a public school - wherever placed by a Provincial Education Department - for the same number of years the bursary was held.',
    apply_url: 'https://www.eservices.gov.za/FunzaLushaka/',
    source_url: 'https://www.eservices.gov.za/FunzaLushaka/',
    active: 1,
    note: 'New applications for the 2027 academic year close 31 January 2027 (secondary sources say returning bursars close earlier, 30 November 2026, which we have not independently confirmed). This closes a gap flagged in an earlier Studypath pass, which found DBE pages confirming eligibility but no 2027-specific closing date. Coverage amounts (tuition, accommodation, stipend) are not itemised on either official page we read (the main site or its National Selection Criteria PDF).',
    verification: 'verified',
  },
  {
    id: 'harmony-gold-2027',
    name: 'Harmony Gold Bursary Programme',
    provider: 'Harmony Gold Mining Company',
    field_of_study: 'Mining-related disciplines - the company describes its intake as "60% core and critical, 30% non-core but mining-related, 10% other disciplines", varying annually; Engineering applicants specifically need Mathematics and Physical Science',
    deadline: '2026-10-09',
    amount_covers: 'Full-time financial support for students from communities near Harmony’s mining operations (exact components not itemised on the page we read)',
    eligibility:
      '18-35 years old; South African citizen with a valid ID; National Senior Certificate with at least 60% in all subjects (Engineering applicants need at least 70% in Mathematics and Physical Science); current tertiary students must maintain at least 60% average in major subjects; full-time study; a 3-page CV is required.',
    apply_url: 'https://www.harmony.co.za/careers/opportunities-for-students/',
    source_url: 'https://www.harmony.co.za/careers/opportunities-for-students/',
    active: 1,
    note: 'Closing date is for the 2027 academic year, per Harmony’s own careers page.',
    verification: 'verified',
  },
  {
    id: 'implats-bursary-2027',
    name: 'Implats Bursary Programme',
    provider: 'Impala Platinum Holdings (Implats)',
    field_of_study: 'Engineering, mining, metallurgy, electrical (heavy current), chemistry, geology, accounting and survey, and human resources (BCom) - several to Honours level',
    deadline: null,
    amount_covers: 'Registration and tuition fees for the duration of the course, residence fees, and a cash allowance',
    eligibility:
      'Specific academic thresholds are not itemised on the page we read; applicants download and complete Implats’ own bursary application form and email it to bursaries@implats.co.za. Recipients must work for the company for the full period of the bursary and complete vacation work each year.',
    apply_url: 'https://www.implats.co.za/young-talent.php',
    source_url: 'https://www.implats.co.za/young-talent.php',
    active: 1,
    note: 'The page we read does not state a closing date for the current intake - aggregator sites claim 31 August, but we could not confirm that on implats.co.za itself, so we show no deadline rather than guess. Email bursaries@implats.co.za to confirm the current window.',
    verification: 'verified',
  },
  {
    id: 'nedbank-external-2027',
    name: 'Nedbank External Bursary Programme',
    provider: 'Nedbank (Nedbank Educational Trust)',
    field_of_study: 'Science, Technology, Engineering, Mathematics (STEM) and green-economy fields',
    deadline: null,
    amount_covers: 'Full-time undergraduate or Honours study funding (exact components not itemised on the page we read)',
    eligibility:
      'South African citizen; proven financial need based on household income; at least 65% average including 65% in subjects relevant to the chosen degree; Mathematical Literacy does not qualify; admission to a South African public university or university of technology.',
    apply_url: 'https://group.nedbank.co.za/careers/graduates-and-bursaries.html',
    source_url: 'https://group.nedbank.co.za/careers/graduates-and-bursaries.html',
    active: 1,
    note: 'Nedbank’s own page states applications for the 2027 academic year are already closed, with the next window opening in 2027 for 2028 study - so no deadline is shown here rather than guessed. Other (non-Nedbank) sources describe an annual 1 February - 30 April window, which we have not independently confirmed on Nedbank’s own page.',
    verification: 'verified',
  },
  {
    id: 'gcra-gauteng-bursary',
    name: 'Gauteng City Region Academy (GCRA) Bursary',
    provider: 'Gauteng Department of Education (GCRA)',
    field_of_study: 'Any undergraduate or postgraduate programme at an accredited Post-School Education and Training (PSET) institution (university or TVET college)',
    deadline: null,
    amount_covers: 'Full cost of study, subject to conditions in the bursary contract',
    eligibility:
      'South African citizen aged 18-35; resident in Gauteng (proof of residence required); completed matric and accepted at an accredited PSET institution. The top 3 Grade 12 learners from Gauteng no-fee, SSIP and LSEN government schools automatically qualify but must still apply online.',
    apply_url: 'https://gcrabursary.gauteng.gov.za/',
    source_url: 'https://gcrabursary.gauteng.gov.za/',
    active: 1,
    note: 'The page we read states the bursary application is closed for the current cycle but does not itself state the exact closing date it used (a secondary source claimed 28 February 2026, which we have not confirmed on the Gauteng government page), so we show no deadline rather than guess. Check the page directly for when the next cycle opens.',
    verification: 'verified',
  },
  {
    id: 'masakhisizwe-2027',
    name: 'Masakh’iSizwe Bursary Programme',
    provider: 'Western Cape Government (Department of Infrastructure)',
    field_of_study: 'Engineering and built-environment degrees/diplomas: property studies, geomatics, electrical/electronic engineering, civil engineering, construction management, mechanical engineering, quantity surveying, town/city and regional planning, architecture',
    deadline: null,
    amount_covers: 'Full-time tertiary study funding, plus a support-services programme, internship/learning opportunities and graduate employment placement assistance',
    eligibility:
      'Full-time study at UCT, Stellenbosch University or CPUT only. The programme states it prioritises disadvantaged learners, especially women, students with disabilities and learners from rural communities. Awards are competitive and, in the page’s own words, "not guaranteed".',
    apply_url: 'https://wa-dtpw-misbursary-prod-zan.azurewebsites.net/',
    source_url: 'https://www.westerncape.gov.za/service/masakhisizwe-bursary-programme',
    active: 1,
    note: 'The page states applications close "31 August" every year but does not state which year on that notice itself (the page separately references both a 2026 date and a "2027 Advert" document elsewhere), so we show no deadline rather than guess the year. Limited to study at UCT, Stellenbosch or CPUT specifically.',
    verification: 'verified',
  },
];
