// Frequently asked questions.
//
// Drafted from the Study Path research pack (30 Sept 2026) and then checked against
// primary sources. Every PARAGRAPH is tagged with how well it is supported, because a
// single answer often mixes solid facts with general knowledge, and the student should
// be able to tell which is which:
//
//   v(text, sources)  VERIFIED   - we read the official page/document ourselves
//   r(text, sources)  REPORTED   - from the research pack or an official-site excerpt;
//                                  the source is cited but we did not re-read it
//   g(text)           GENERAL    - general knowledge with NO official source behind it.
//                                  Shown with a clear "not from an official source" mark
//                                  and the FAQ's `checks` (where to confirm it yourself)
//
// `checks` are places the student can confirm an answer for themselves. They are
// suggestions of where to look, not claims.

const src = (label, url) => ({ label, url });

const S = {
  uct: src('UCT Guidelines for Admission for NSC holders (2025)', 'https://www.uct.ac.za/sites/default/files/media/documents/2025_National-Senior-Certificate-NSC_Guidelines-for-Admissions.pdf'),
  uct27: src('UCT 2027 Undergraduate Prospectus', 'https://www.uct.ac.za/sites/default/files/media/documents/2027-uct-undergraduate-prospectus-1-april-2026.pdf'),
  wits: src('Wits undergraduate entry requirements', 'https://www.wits.ac.za/undergraduate/entry-requirements/'),
  up: src('UP Faculty of Humanities admission document', 'https://drupalwebprod-files.up.ac.za/Public/2025-12/2020-hum_ug-final.zp176067.pdf?VersionId=4wZe_mMeDEmQMs5LCJiz4a__0U.IbD3J'),
  su: src('Stellenbosch Admissions Booklet 2027', 'https://files.su.ac.za/public/undergraduate-maties/documents/2026-01/su-admissions-booklet-2027.pdf'),
  ru: src('Rhodes Undergraduate Prospectus', 'https://www.ru.ac.za/media/rhodesuniversity/content/registrar/documents/information/studentrecruitment/RU_READY_Undergraduate_Prospectus_2026_DIGITAL_A5_Landscape_24pp_18Mar2026.pdf'),
  ukzn: src('UKZN College of Law & Management Studies Handbook 2026', 'https://clms.ukzn.ac.za/wp-content/uploads/2026/01/UKZN-CLMS-Handbook-2026.pdf'),
  uwc: src('UWC official APS calculator', 'https://www.uwc.ac.za/admission-point-score-calculator/south-african-aps-calculator'),
  nwu: src('NWU APS calculator', 'https://studies.nwu.ac.za/studies/aps-calculator'),
  ufs: src('UFS Undergraduate Programmes 2024 (AP score)', 'https://www.ufs.ac.za/docs/librariesprovider23/ems-documents/e3_ufs-undergraduade-programme-2024.pdf?sfvrsn=71432920_3'),
  ufsApply: src('UFS applications page', 'https://apply.ufs.ac.za/Application/Start'),
  nbt: src('NBT Project FAQ', 'https://www.nbt.ac.za/content/faq-0'),
  nsfas: src('Minister Buti Manamela: launch of the NSFAS 2027 application cycle (gov.za)', 'https://www.gov.za/news/speeches/minister-buti-manamela-launch-nsfas-2027-application-cycle-18-sep-2026'),
  sanews: src('SAnews: NSFAS 2027 application cycle opens', 'https://www.sanews.gov.za/south-africa/nsfas-2027-application-cycle-opens'),
  ukznApply: src('UKZN how to apply', 'https://studyatukzn.ukzn.ac.za/apply-at-ukzn/how-to-apply/'),
  uctContacts: src('UCT general contacts', 'https://www.uct.ac.za/general-contacts'),
  audit: src('How each university scores you (Studypath)', '/data-sources#scoring'),
  uctFaq: src('UCT applications & admissions FAQ', 'https://uct.ac.za/students/prospective-students-faqs/applications-admissions-faq'),
  witsHealth: src('Wits course finder: Medicine and Surgery', 'https://www.wits.ac.za/course-finder/undergraduate/health/medicine-and-surgery/'),
  witsSci: src('Wits course finder: BSc', 'https://www.wits.ac.za/course-finder/undergraduate/science/bsc/'),
  wsu: src('WSU how to apply', 'https://www.wsu.ac.za/en/study-with-us/application-and-registration/how-to-apply-the-process'),
  ufh: src('UFH apply (undergraduate)', 'https://www.ufh.ac.za/apply/apply-undergraduate'),
  spu: src('SPU how to apply', 'https://www.spu.ac.za/index.php/how-to-apply/'),
  ump: src('UMP online applications', 'https://www.ump.ac.za/Study-with-us/Application-Process/Online-Applications'),
  dut: src('DUT how to apply 2027', 'https://www.dut.ac.za/wp-content/uploads/2026/06/How-to-Apply-2027.pdf'),
  mut: src('MUT apply', 'https://www.mut.ac.za/prospective-students/apply/'),
  unizulu: src('UniZulu admissions', 'https://www.unizulu.ac.za/office-of-the-registrar/admissions/'),
  tut: src('TUT general information for first-year enrolment', 'https://www.tut.ac.za/media/tshwane-interim/site-content/documents/General-Information-First-Year-Enrolment.pdf'),
  smu: src('SMU online application', 'https://www.smu.ac.za/students/apply/online-application/'),
  ul: src('UL undergraduate admissions', 'https://www.ul.ac.za/admissions/undergraduate-studies/'),
  cut: src('CUT application process', 'https://www.cut.ac.za/application-process/'),
  gazette: { label: 'Government Gazette 42100 (2018) - the research pack saw it only in secondary copies, not on dhet.gov.za', url: null },
  dhetFramework: { label: 'DHET "Staffing South Africa’s Universities Framework" (named in the research pack; page not re-read by us)', url: null },
  usaf: { label: 'Universities South Africa (USAf), as quoted in the research pack', url: 'https://www.usaf.ac.za' },
};

const v = (text, sources) => ({ level: 'verified', text, sources });
const r = (text, sources) => ({ level: 'reported', text, sources });
const g = (text) => ({ level: 'general', text, sources: [] });

export const FAQ_CATEGORIES = [
  { id: 'marks',     emoji: '🧮', label: 'Marks & APS' },
  { id: 'nbt',       emoji: '✍️', label: 'The NBT' },
  { id: 'applying',  emoji: '📝', label: 'Applying' },
  { id: 'money',     emoji: '💰', label: 'Money' },
  { id: 'words',     emoji: '📖', label: 'Words explained' },
  { id: 'studypath', emoji: '🧭', label: 'About Studypath' },
];

export const faq = [
  // ======================================================================= Marks & APS
  {
    id: 'what-is-aps', category: 'marks',
    question: 'What is an APS, and is it the same at every university?',
    answer: [
      v('APS stands for **Admission Point Score**: a number a university works out from your marks to decide whether you meet its entry requirements. It is **not the same at every university** - each one counts different subjects in a different way, so a score from one university means nothing at another.', [S.audit]),
      v('A few examples. **UCT** adds your six best subject percentages (English is always counted; anything under 40% scores nothing). **Wits** uses a points scale where English and Maths get a bonus and Life Orientation counts a little. **UP** adds the levels (1 to 7) of your six best subjects and leaves out Life Orientation. **Stellenbosch** uses your average percentage and no APS at all. **Rhodes** adds your six subjects’ percentages and divides by 10.', [S.uct, S.wits, S.up, S.su, S.ru]),
      v('That is why Studypath works out a separate score for each university from the same marks, and never shows you one "APS".', [S.audit]),
    ],
    checks: [{ label: 'The "how to calculate your APS" page on the university’s own admissions site', url: null }],
  },
  {
    id: 'ucts-800', category: 'marks',
    question: 'Is UCT’s score out of 600, 800 or 900?',
    answer: [
      v('It depends on the faculty. For **Commerce, Engineering & the Built Environment, Humanities and Law** your Faculty Points Score (FPS) is out of **600** and equals your APS. For **Science** it is out of **800** (your Maths and Physical Sciences are counted twice). For **Health Sciences** it is out of **900** (your APS plus your NBT results).', [S.uct]),
      v('A worked example from UCT’s own guidelines: English 75, isiXhosa 70, Maths 84, Physical Sciences 86, CAT 79 and Sports & Exercise Science 69 give a Commerce/Engineering/Humanities/Law FPS of 463/600, and for Science the same marks give 633/800. Studypath reproduces both numbers.', [S.uct]),
    ],
    checks: [{ label: 'UCT’s "Guidelines for admission for NSC holders"', url: S.uct.url }],
  },
  {
    id: 'life-orientation', category: 'marks',
    question: 'Does Life Orientation count towards my APS?',
    answer: [
      v('It depends on the university. **UCT, UP, UJ, UKZN, NWU and Stellenbosch leave it out** of the score. **Wits counts it**, but only for a little: 4, 3, 2 or 1 point for 90, 80, 70 or 60% and up. **UFS** gives 1 point for 60% or more. **UWC** gives 0 to 3 points. **Rhodes** does not score it but you must get at least 50% for acceptance.', [S.uct, S.wits, S.up, S.ukzn, S.nwu, S.su, S.ufs, S.uwc, S.ru]),
      g('Even where it does not count, most universities still expect you to pass it, so do not ignore it.'),
    ],
    checks: [{ label: 'The "admission requirements" page of the university you are applying to', url: null }],
  },
  {
    id: 'levels', category: 'marks',
    question: 'What are achievement levels (1 to 7)?',
    answer: [
      v('Your percentage in each subject is turned into an **NSC achievement level** from 1 to 7: **7 = 80-100%, 6 = 70-79%, 5 = 60-69%, 4 = 50-59%, 3 = 40-49%, 2 = 30-39%, 1 = 0-29%**. When a university asks for "Maths level 6" it means 70% or more.', [S.up]),
      v('A few universities (Wits, UKZN, NWU, UWC and UFS) split the top band so that **90-100% is level 8** and 80-89% is level 7.', [S.wits, S.ukzn, S.nwu, S.uwc, S.ufs]),
    ],
    checks: [],
  },
  {
    id: 'hl-fal', category: 'marks',
    question: 'What is the difference between Home Language and First Additional Language?',
    answer: [
      g('Your **Home Language** is the language subject you study at the higher level; your **First Additional Language** is the second language subject, studied at a lower level. Every NSC learner takes both.'),
      r('Because the First Additional Language is the easier subject, universities often ask for a **higher mark in it**. For example, UCT Commerce asks for English Home Language 50% or English First Additional Language 60%.', [S.uct27]),
    ],
    checks: [
      { label: 'Your school’s subject-choice or guidance teacher', url: null },
      { label: 'Department of Basic Education (education.gov.za)', url: 'https://www.education.gov.za' },
    ],
  },
  {
    id: 'guarantee', category: 'marks',
    question: 'If I meet the minimum requirements, will I get a place?',
    answer: [
      v('**No.** Rhodes says plainly: "obtaining the minimum requirements does not guarantee acceptance." UWC’s own calculator adds that faculties "may select at higher point scores and subject levels than the published minimums."', [S.ru, S.uwc]),
      v('Many degrees are **selection programmes**: the university has more qualified applicants than places, so it picks the strongest. Stellenbosch, for example, says its real selection threshold is higher than the published minimum. Studypath marks these with a "Selection programme" badge.', [S.su]),
    ],
    checks: [],
  },
  {
    id: 'grade-11', category: 'marks',
    question: 'Which marks do I use - Grade 11 or Grade 12?',
    answer: [
      v('If you are in Grade 12, universities use your **final Grade 11 results** to decide on your application, and your final NSC results decide the final offer. UP says so directly, and UCT counts Grade 11 final, Grade 12 preliminary and Grade 12 final marks.', [S.up, S.uct]),
      r('So apply in Grade 12 using your Grade 11 finals, and check each programme’s own closing date.', [S.su]),
    ],
    checks: [],
  },

  // ======================================================================= NBT
  {
    id: 'what-is-nbt', category: 'nbt',
    question: 'What is the NBT?',
    answer: [
      v('The National Benchmark Tests "measure your academic readiness for University." There are two tests. The **AQL** (Academic and Quantitative Literacy) is written by applicants to all programmes that require the NBT. The **MAT** (Mathematics) is for programmes where Mathematics is a requirement. Each is multiple-choice and takes three hours.', [S.nbt]),
      v('They are written on the **same day** - the NBT Project does not let you write the AQL one day and the MAT another - and the **MAT cannot be written on its own**.', [S.nbt]),
    ],
    checks: [{ label: 'nbt.ac.za', url: 'https://www.nbt.ac.za' }],
  },
  {
    id: 'who-needs-nbt', category: 'nbt',
    question: 'Which universities and faculties require the NBT?',
    answer: [
      v('It is set **by each university and each faculty**, not nationally. Stellenbosch does not require it for 2027 except for Law programmes, the School for Tomorrow, AHSD and online-school applicants: LLB needs the AQL, and BCom (Law) and BAccLLB need the AQL and MAT, all written before 31 July.', [S.su]),
      r('UCT requires it for South African resident applicants and for all Health Sciences and Commerce applicants. UCT Engineering & the Built Environment makes you write all three parts but says the results "are not taken into account for admission".', [S.uct27]),
      r('Wits requires it for all Health Sciences and Science applicants, and Health Sciences applicants must write in person.', [S.witsHealth, S.witsSci]),
      v('Rhodes "recommended[s] that all first-time university-entering South African applicants write the NBT". If you do not meet the automatic entry requirements, your results feed into the Dean’s decision. Everyone should write the AQL; the MAT is for Commerce, Pharmacy and Science applicants.', [S.ru]),
      v('At UP’s Faculty of Humanities, a Grade 11 APS of 26-29 means you must write the NBT, and your result can place you in the BA Extended programme; the NBT is not required for all selection degrees.', [S.up]),
      g('Websites that say "most universities require the NBT" are too vague to rely on: always check the faculty page of the degree you want.'),
    ],
    checks: [{ label: 'The admission-requirements page for your degree at the university', url: null }, { label: 'The NBT Project', url: 'https://www.nbt.ac.za' }],
  },
  {
    id: 'nbt-when', category: 'nbt',
    question: 'When can I write the NBT, and can I write it again?',
    answer: [
      v('"The NBTs are available from May until the first Saturday in January." You book a date and venue on nbt.ac.za and can change the booking until that sitting’s closing date.', [S.nbt]),
      v('You may write the NBT **twice within a cycle**, but you pay the full fee both times. Not every university will accept a second score, so ask before you rewrite.', [S.nbt]),
      r('Universities set their own deadline for receiving your results, and these can be as early as June or July. UCT says you do not need to rewrite if your NBTs were written in the last three years.', [S.uctFaq]),
    ],
    checks: [{ label: 'nbt.ac.za - the test schedule', url: 'https://www.nbt.ac.za' }],
  },
  {
    id: 'nbt-fee', category: 'nbt',
    question: 'How much does the NBT cost?',
    answer: [
      g('We have not confirmed the current fee. The NBT FAQ we read does not state an amount, so we are not going to guess one. The fee is shown when you book.'),
    ],
    checks: [{ label: 'Book a test at nbt.ac.za - the fee is shown before you pay', url: 'https://www.nbt.ac.za' }],
    unverifiedNote: 'No fee amount found on an official page.',
  },

  // ======================================================================= Applying
  {
    id: 'closing-dates', category: 'applying',
    question: 'When do applications open and close?',
    answer: [
      v('It varies a lot. For the 2027 intake, for example, **UFS** closes its health programmes on 31 May, Nursing, Social Work and Architecture on 31 July, and everything else on 30 September. **UKZN** closes Medicine on 30 June and most other colleges on 30 September. **Rhodes** ran applications from 1 April to 30 September.', [S.ufsApply, S.ukznApply, S.ru]),
      r('Others closing later include WSU, UFH and SPU (31 October) and UMP (30 November).', [S.wsu, S.ufh, S.spu, S.ump]),
      g('Selection programmes such as Medicine and Dentistry usually close earlier than the rest - UFS, UKZN and Wits above all close their health programmes in May or June.'),
      g('Most of these dates have now passed for the 2027 intake. The 2028 dates have not been published, so do not assume they will match - check each university from early next year.'),
    ],
    checks: [{ label: 'Our deadlines page, then the university’s own "how to apply" page', url: '/dates' }],
  },
  {
    id: 'not-meeting', category: 'applying',
    question: 'What if I do not meet the requirements?',
    answer: [
      r('There are options. Some universities have **extended or foundation programmes** (UCT Science uses NBT results to place students in its extended degree). **Diplomas and higher certificates** need less than a bachelor’s degree. You can also ask some universities to **defer** your application to next year (UCT will reconsider you, though deferral "does not mean automatic acceptance"), or **rewrite** subjects through the Department of Basic Education’s Second Chance Matric Programme.', [S.uctFaq]),
      r('The national minimum for a bachelor’s degree is 50% in four 20-credit subjects and 30% in the language of teaching; for a diploma it is 40% in four subjects. Universities then add their own subject requirements on top.', [S.gazette]),
    ],
    checks: [
      { label: 'Department of Higher Education and Training (dhet.gov.za)', url: 'https://www.dhet.gov.za' },
      { label: 'The university’s "alternative routes" or "extended programme" page', url: null },
    ],
  },
  {
    id: 'send-results', category: 'applying',
    question: 'Do I have to send my matric results to the university?',
    answer: [
      r('If you wrote the NSC in South Africa, UCT "will obtain your results directly from your examination authority." Applicants with international qualifications need to send certified results.', [S.uctFaq]),
      g('Other universities may work differently - check the "documents" section of the application form.'),
    ],
    checks: [{ label: 'The "how to apply" page of the university', url: null }],
  },
  {
    id: 'cao', category: 'applying',
    question: 'What is the CAO?',
    answer: [
      v('The **Central Applications Office (CAO)** handles first-time applications to UKZN: the CAO application fee is R250 (non-refundable) and its phone number is +27 (0)31 268 4444.', [S.ukznApply]),
      r('Our research also found that first-time applicants to DUT, MUT and UniZulu apply through the CAO.', [S.dut, S.mut, S.unizulu]),
    ],
    checks: [{ label: 'cao.ac.za', url: 'https://www.cao.ac.za' }],
  },
  {
    id: 'free', category: 'applying',
    question: 'Does it cost money to apply?',
    answer: [
      v('It depends on the university. **UFS is free.** The CAO charges R250 for UKZN applications.', [S.ufsApply, S.ukznApply]),
      r('Reported fees elsewhere: TUT R240, SMU R300, UL R200, UMP R200, UFH R120, WSU R100; CUT is free.', [S.tut, S.smu, S.ul, S.ump, S.ufh, S.wsu, S.cut]),
      r('TUT warns that it "will never charge any prospective student money for making enquiries" and asks you to report scams to its ethics hotline, 0800 006 924.', [S.tut]),
    ],
    checks: [{ label: 'Each university’s "how to apply" page', url: null }],
  },

  // ======================================================================= Money
  {
    id: 'nsfas', category: 'money',
    question: 'When do I apply for NSFAS?',
    answer: [
      v('The NSFAS 2027 application cycle **opened on 18 September 2026 and closes on 18 November 2026**, with funding outcomes communicated in December. NSFAS is a **separate application** from applying to a university.', [S.nsfas, S.sanews]),
      g('We saw a different closing date (31 October) on at least one other website. The Minister’s own launch speech and the SAnews report both say 18 November, so we use that - but always confirm on nsfas.org.za. We have not verified the household-income thresholds, so we do not state one.'),
    ],
    checks: [{ label: 'nsfas.org.za - the application page', url: 'https://www.nsfas.org.za' }],
    conflict: 'Sources disagree on the NSFAS closing date (18 November vs 31 October). We follow the two government sources.',
  },
  {
    id: 'financial-aid', category: 'money',
    question: 'Who do I ask about university financial aid?',
    answer: [
      v('Each university has its own financial aid office, separate from NSFAS. For example, UCT’s undergraduate financial aid is financialaid@uct.ac.za or +27 (0)21 650 3545.', [S.uctContacts]),
    ],
    checks: [{ label: 'Our "Ask a university" page lists the contact we have for each one', url: '/ask-a-university' }],
  },

  // ======================================================================= Words explained
  {
    id: 'selection', category: 'words',
    question: 'What is a "selection programme"?',
    answer: [
      v('A degree where the university has **more qualified applicants than places**, so meeting the minimum is not enough: it picks the strongest. Stellenbosch puts it this way: it "receives more applications than we have places available. Therefore, meeting the minimum admission requirements does not guarantee admission to your programme of choice. All programmes are selection programmes."', [S.su]),
      g('Medicine, dentistry, engineering and law are the usual examples, but every university decides which of its degrees are selection programmes.'),
    ],
    checks: [{ label: 'The degree’s page on the university site - look for "selection"', url: null }],
  },
  {
    id: 'bursary-vs-loan', category: 'words',
    question: 'What is the difference between a bursary and a loan?',
    answer: [
      g('A **bursary** is money for your studies that you normally do not pay back (some come with a condition, such as working for the provider for a set time). A **loan** must be repaid. These are general definitions - always read the terms of the specific offer.'),
    ],
    checks: [{ label: 'The provider’s own terms - and ask the university financial aid office', url: null }],
  },
  {
    id: 'uni-vs-uot', category: 'words',
    question: 'What is a university of technology?',
    answer: [
      r('South Africa has 26 public universities, and six of them are universities of technology: CPUT, CUT, DUT, MUT, TUT and VUT.', [S.usaf, S.dhetFramework]),
      g('Universities of technology (the former technikons) mainly offer career-focused diplomas as well as some degrees; traditional universities mainly offer degrees; comprehensive universities offer both. This description is general knowledge, not quoted from an official page, so we have not labelled any university "traditional" or "comprehensive" as fact.'),
    ],
    checks: [
      { label: 'Universities South Africa (usaf.ac.za)', url: 'https://www.usaf.ac.za' },
      { label: 'Department of Higher Education and Training (dhet.gov.za)', url: 'https://www.dhet.gov.za' },
    ],
  },

  // ======================================================================= About Studypath
  {
    id: 'trust', category: 'studypath',
    question: 'How do I know the numbers on Studypath are right?',
    answer: [
      v('Every admission requirement links to the official university page or document it came from, and we publish what we could **not** verify. You can see each scoring formula, the source we checked it against, and every gap or conflict on our data page.', [S.audit]),
      g('Universities change their requirements, and some of their websites block automated checks, so a few entries are marked "partly verified". Always confirm on the university’s own page before you rely on anything.'),
    ],
    checks: [{ label: 'Our data & sources page', url: '/data-sources' }],
  },
  {
    id: 'marks-private', category: 'studypath',
    question: 'Does Studypath keep my marks?',
    answer: [
      v('No. The marks you type into the calculator are worked out in your browser and saved only on your own device so you do not have to retype them. There are no accounts. See our privacy page for exactly what is and is not collected.', [src('Studypath privacy', '/privacy')]),
    ],
    checks: [],
  },
];
