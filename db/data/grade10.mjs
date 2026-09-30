// Grade 10 subject choice (you choose at the end of Grade 9).
//
// Drafted from the Study Path research pack (30 Sept 2026), then checked. Paragraph
// levels are the same as in faq.mjs:
//   v = verified by us against an official page/document
//   r = reported (cited in the pack or an official excerpt; not re-read by us)
//   g = general knowledge / advice, NOT from an official source - shown with a clear mark
//
// The page ALSO contains facts generated at build time from Studypath's own sourced
// programme data (how many captured degrees need Mathematics, which accept Maths
// Literacy, ...). Those are computed, not typed here, so they cannot drift from the data.

const src = (label, url) => ({ label, url });
const S = {
  uct: src('UCT Guidelines for Admission for NSC holders (2025)', 'https://www.uct.ac.za/sites/default/files/media/documents/2025_National-Senior-Certificate-NSC_Guidelines-for-Admissions.pdf'),
  uct27: src('UCT 2027 Undergraduate Prospectus', 'https://www.uct.ac.za/sites/default/files/media/documents/2027-uct-undergraduate-prospectus-1-april-2026.pdf'),
  up: src('UP Faculty of Humanities admission document', 'https://drupalwebprod-files.up.ac.za/Public/2025-12/2020-hum_ug-final.zp176067.pdf?VersionId=4wZe_mMeDEmQMs5LCJiz4a__0U.IbD3J'),
  ukzn: src('UKZN College of Law & Management Studies Handbook 2026', 'https://clms.ukzn.ac.za/wp-content/uploads/2026/01/UKZN-CLMS-Handbook-2026.pdf'),
  nwu: src('NWU APS calculator', 'https://studies.nwu.ac.za/studies/aps-calculator'),
  wits: src('Wits undergraduate entry requirements', 'https://www.wits.ac.za/undergraduate/entry-requirements/'),
  ufs: src('UFS Undergraduate Programmes 2024 (AP score)', 'https://www.ufs.ac.za/docs/librariesprovider23/ems-documents/e3_ufs-undergraduade-programme-2024.pdf?sfvrsn=71432920_3'),
  uwc: src('UWC official APS calculator', 'https://www.uwc.ac.za/admission-point-score-calculator/south-african-aps-calculator'),
  ru: src('Rhodes Undergraduate Prospectus', 'https://www.ru.ac.za/media/rhodesuniversity/content/registrar/documents/information/studentrecruitment/RU_READY_Undergraduate_Prospectus_2026_DIGITAL_A5_Landscape_24pp_18Mar2026.pdf'),
  su: src('Stellenbosch Admissions Booklet 2027', 'https://files.su.ac.za/public/undergraduate-maties/documents/2026-01/su-admissions-booklet-2027.pdf'),
  suGuidance: src('Stellenbosch: book a consultation (csr@sun.ac.za, 021 808 4709)', 'https://files.su.ac.za/public/undergraduate-maties/documents/2026-01/su-admissions-booklet-2027.pdf'),
  gazette: { label: 'Government Gazette 42100 (2018) - seen by the research pack only in secondary copies, not on dhet.gov.za', url: null },
  witsBed: src('Wits BEd Foundation Phase (course finder)', 'https://www.wits.ac.za/course-finder/undergraduate/humanities/bed-foundation-phase-teaching/'),
  witsBas: src('Wits Bachelor of Architectural Studies - application exercise', 'https://www.wits.ac.za/soap/architecture/bas-application-exercise/'),
};
const v = (text, sources) => ({ level: 'verified', text, sources });
const r = (text, sources) => ({ level: 'reported', text, sources });
const g = (text) => ({ level: 'general', text, sources: [] });

export const GRADE10 = {
  intro: [
    g('The subjects you pick at the end of Grade 9 decide which university doors are open in Grade 12. Some choices are easy to change later and some are not, so it is worth ten minutes now.'),
  ],

  // The floor: the least you need for ANY bachelor's degree
  floor: {
    title: 'The bare minimum for a degree',
    paras: [
      v('To be considered for a bachelor’s degree at UCT you need an NSC with **level 4 (50-59%) or better in four subjects**. That is the floor - not the goal.', [S.uct]),
      r('Nationally, the requirement is 30% in the language the university teaches in plus 50% in any four 20-credit subjects; a diploma needs 40% in four. Since August 2018 there is **no "designated subjects" list** - many websites still say four designated subjects, and they are out of date. Universities are now allowed to set their own subject requirements for each programme, and **that is where the real barriers are**.', [S.gazette]),
    ],
  },

  // Maths vs Maths Lit
  maths: {
    title: 'Mathematics or Mathematical Literacy: the choice that matters most',
    lead: 'If there is one decision to get right, it is this one. Mathematics keeps almost every door open. Mathematical Literacy closes most of the Science, Commerce, Engineering and Health doors.',
    fields: [
      { field: 'Engineering', emoji: '⚙️', verdict: 'Needs Mathematics and Physical Sciences',
        paras: [
          v('UCT is explicit: "Mathematical Literacy or Technical Mathematics cannot be substituted for Mathematics, and Technical Science cannot be substituted for Physical Sciences."', [S.uct]),
          r('UCT asks for Mathematics 80% and Physical Sciences 70-75% for its engineering degrees. Other universities ask for less - the table further down is generated from every engineering degree we have captured, with a link to each one.', [S.uct27]),
          g('Not every university is as strict as UCT: UJ, for example, accepts Technical Mathematics for engineering. Always check the specific degree.'),
        ] },
      { field: 'Commerce & business', emoji: '💼', verdict: 'Needs Mathematics',
        paras: [
          r('UCT says you must take Mathematics at school: "Mathematical Literacy is NOT sufficient." Its Commerce minimums are Maths 60% (70% for Computer Science and Analytics, 80% for Actuarial Science).', [S.uct27]),
          g('Accounting, Economics, Business Studies and IT are **not** required for UCT Commerce - Maths is.'),
        ] },
      { field: 'Architecture & property', emoji: '🏛️', verdict: 'Needs Mathematics',
        paras: [
          r('UCT requires Mathematics for Architecture and Property Studies and does not consider Maths Literacy. Wits Architectural Studies likewise requires a minimum of 50% in Mathematics and does not accept Mathematical Literacy. (Wits publishes two different APS figures for this degree - see our data page.)', [S.uct27, S.witsBas]),
        ] },
      { field: 'Health sciences', emoji: '⚕️', verdict: 'Medicine needs Maths + Physical Sciences; some allied health accepts Maths Literacy',
        paras: [
          g('Medicine everywhere in our data needs Mathematics and Physical Sciences, and often Life Sciences too - see the table below for each university.'),
          g('Some allied-health and nursing degrees accept Mathematical Literacy as an alternative - the list below is generated from the programmes we have captured, each with its own source link. It varies by university, so never assume.'),
        ] },
      { field: 'Humanities, Law & teaching', emoji: '📚', verdict: 'Often open to Maths Literacy - but usually at a higher mark',
        paras: [
          r('Wits BEd Foundation Phase accepts Mathematics level 4 OR Mathematical Literacy level 5 OR Technical Mathematics level 5 (note: the Maths Literacy bar is one level higher). Some Law degrees combine with Commerce and then need Maths: Stellenbosch’s BCom (Law) needs Mathematics 60% and the MAT.', [S.witsBed, S.su]),
          g('Specific majors inside an "open" degree can still need Maths - for example UCT’s Economics major needs Maths 60%.'),
        ] },
    ],
    rule: g('**If you can pass Mathematics, keep Mathematics.** It is far easier to drop from Mathematics to Maths Literacy later than to go the other way, and it keeps nearly every degree possible. (This is advice based on the evidence above, not an official rule.)'),
  },

  sciences: {
    title: 'Physical Sciences and Life Sciences',
    paras: [
      g('Engineering and most BSc degrees ask for **Mathematics plus Physical Sciences**. Medicine and most health degrees ask for Mathematics plus Physical Sciences and often Life Sciences. The table below is generated from the degrees we have captured, each linking to its source.'),
      v('Technical Mathematics and Technical Sciences do **not** replace Mathematics and Physical Sciences for UCT Engineering.', [S.uct]),
    ],
  },

  pitfalls: {
    title: 'Mistakes that catch people out',
    items: [
      { title: 'Life Orientation',
        paras: [v('At UCT, UP, UJ, UKZN, NWU and Stellenbosch it does not count towards your score. Rhodes does not score it but wants at least 50% in it. Wits counts it a little (up to 4 points), and UFS and UWC give it small points.', [S.uct, S.up, S.ukzn, S.nwu, S.su, S.ru, S.wits, S.ufs, S.uwc]), g('So do not count on Life Orientation to lift your score - at most universities it will not.')] },
      { title: 'Your language mark has its own bar',
        paras: [r('The legal floor is 30% in the language of teaching, but faculties set much higher bars. UCT Commerce, for instance, asks for English Home Language 50% or First Additional Language 60%.', [S.uct27])] },
      { title: 'Advanced Programme (AP) subjects',
        paras: [v('UCT’s APS leaves out scores for "Advanced Programme" subjects.', [S.uct])] },
      { title: 'Grade 10 and 11 marks count',
        paras: [v('You apply in Grade 12 using your final Grade 11 results (UCT counts Grade 11 final, Grade 12 preliminary and Grade 12 final marks).', [S.uct]), g('So the work you do from Grade 10 builds the record universities will see.')] },
    ],
  },

  official: {
    title: 'Who to ask',
    paras: [
      g('We could not find an official Department of Basic Education Grade 9 subject-choice document that we could check, so this page does not claim to be DBE guidance.'),
      v('Stellenbosch’s student recruitment team gives individual subject-choice advice: csr@sun.ac.za or 021 808 4709.', [S.suGuidance]),
    ],
    checks: [
      { label: 'Your school’s Life Orientation or guidance teacher', url: null },
      { label: 'The faculty page of a degree you like - look at its subject requirements', url: '/universities.html' },
      { label: 'Our "Ask a university" page', url: '/ask-a-university.html' },
    ],
  },
};
