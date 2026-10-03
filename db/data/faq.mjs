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
  nbtCost: src('NBT Project - NBT cost', 'https://www.nbt.ac.za/content/nbt-cost'),
  nsfas: src('Minister Buti Manamela: launch of the NSFAS 2027 application cycle (gov.za)', 'https://www.gov.za/news/speeches/minister-buti-manamela-launch-nsfas-2027-application-cycle-18-sep-2026'),
  nsfasEligibility: src('NSFAS - the bursary scheme (nsfas.org.za)', 'https://nsfas.org.za/content/bursary-scheme.html'),
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

  // Added 2026-10-02: university FAQ pages, degree-types explainer sources.
  witsApply: src('Wits - Apply to Wits', 'https://www.wits.ac.za/undergraduate/apply-to-wits/'),
  suApply2027: src('Stellenbosch - How to apply, 2027 intake (PDF)', 'https://blogs.sun.ac.za/open-day/files/2026/03/How-to-Apply-Undergraduate-programmes-2027-intake.pdf'),
  ukznFaqs: src('Study@UKZN FAQs', 'https://studyatukzn.ukzn.ac.za/faqs/'),
  uwcAppInfo: src('UWC application information', 'https://www.uwc.ac.za/admission-and-financial-aid/undergraduate-admission/application-information'),
  ujPolicy: src('UJ Policy on Applications and Selections (PDF)', 'https://www.uj.ac.za/wp-content/uploads/2023/02/applications-and-selections.pdf'),
  nwuChange1: src('NWU LibAnswers - How do I change my qualifications after applying?', 'https://nwu.libanswers.com/faq/356446'),
  nwuChange2: src('NWU LibAnswers - Can I change my course after I have applied?', 'https://nwu.libanswers.com/faq/369144'),
  saqaLevels: src('SAQA Level Descriptors for the National Qualifications Framework (2012)', 'https://saqa.org.za/wp-content/uploads/2023/02/level_descriptors.pdf'),
  heqsf: src('CHE Higher Education Qualifications Sub-Framework (2013)', 'https://che.ac.za/sites/default/files/inline-files/PUB_Higher%20Education%20Qualifications%20Sub-Framework%20(HEQSF)%202013.pdf'),
  ecsaReg: src('ECSA - Registration categories', 'https://www.ecsa.co.za/ecsa-registration/'),
  ujBengTech: src('UJ - BEng Tech in Civil Engineering (example programme page)', 'https://www.uj.ac.za/university-courses/beng-tech-in-civil-engineering/'),
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
      v('For the current test cycle, the NBT costs **R195** to write the AQL on its own, or **R390** to write the AQL and MAT together. Fees are paid through Lesaka EasyPay; international applicants, and those in countries bordering South Africa without EasyPay facilities, pay by EFT or direct deposit to the NBT Project\'s Standard Bank (UCT) account instead. A re-mark costs extra; a make-up test after a hospital or police report is free.', [S.nbtCost]),
      g('We have not found an official page stating whether this fee is waived for NSFAS-qualifying learners - some bursary and school-guidance sites claim it is, but we are not going to repeat that without seeing it on nbt.ac.za ourselves. Ask when you book.'),
    ],
    checks: [{ label: 'Book a test at nbt.ac.za - the fee is shown before you pay', url: 'https://www.nbt.ac.za' }],
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
      r('Once you accept an offer, several universities want more than just your results. **Wits** asks already-matriculated applicants for certified copies of matric certificates (or foreign school-leaving certificates), and anyone who has studied at another tertiary institution for certified academic transcripts plus a statement of good conduct/standing. **UKZN** requires a certified copy of your Statement of Results and a certified copy of your ID when you accept an offer. **UWC** asks post-matric applicants for a certified NSC/Senior Certificate and a certified ID, with extra documents (an official transcript, a certificate of good conduct) for transfer students.', [S.witsApply, S.ukznFaqs, S.uwcAppInfo]),
      g('Other universities may work differently - check the "documents" section of the application form.'),
    ],
    checks: [{ label: 'The "how to apply" page of the university', url: null }],
  },
  {
    id: 'multiple-applications', category: 'applying',
    question: 'Can I apply to more than one programme, or more than one university, at the same time?',
    answer: [
      v('Yes to both, and most students do. Each university is a **separate application** with its own fee, and within one university you can usually choose more than one programme on a single application: **UCT** allows up to 2 programme choices (which can span different faculties), **Wits** and **Stellenbosch** allow up to 3, and **UJ** and **UWC** allow up to 2.', [S.uctFaq, S.witsApply, S.suApply2027, S.ujPolicy, S.uwcAppInfo]),
      v('If you qualify for more than one of your choices you can receive **multiple offers**, but you can only hold one active acceptance at a time - accepting a new offer normally replaces whichever one you accepted before.', [S.suApply2027, S.ukznFaqs]),
      g('Applying to several universities as a backup is normal and sensible - just track each one’s own closing date and application fee separately.'),
    ],
    checks: [{ label: 'Each university’s own "how to apply" page', url: null }],
  },
  {
    id: 'conditional-offer', category: 'applying',
    question: 'What is a conditional offer, and what happens if my final results don’t meet it?',
    answer: [
      v('A conditional offer is made before your final results are out, usually from Grade 11 or mid-year Grade 12 marks: it admits you **on condition** that your final National Senior Certificate results still meet the programme’s requirements. A firm/final offer follows once your actual results are in. Stellenbosch and UCT both describe conditional offers this way.', [S.suApply2027, S.uctFaq]),
      v('UKZN works the same way: a conditional offer applies when you’ve applied with Grade 11 results, and is checked against your real results once they are released.', [S.ukznFaqs]),
      r('If your final results do not meet the condition, UCT says plainly that the application becomes unsuccessful and you will be told. We have not found an official page from another university promising anything different, so a conditional offer should be treated as genuinely conditional.', [S.uctFaq]),
      g('What happens next if you fall short - a different programme, a diploma route, a deferral - depends entirely on the university and programme, so ask its admissions office directly rather than assuming.'),
    ],
    checks: [{ label: 'The university’s own offer letter - it states the exact condition', url: null }],
  },
  {
    id: 'change-programme', category: 'applying',
    question: 'Can I change my programme choice after I’ve already applied?',
    answer: [
      v('It depends on the university, and most set a deadline. **UCT** lets you change your choices for free up to 31 August. **Wits** lets you amend your choices yourself through its online portal any time before that programme’s applications close, and its own guidance is explicit: "do not submit a new application." **Stellenbosch** requires any change request to reach its Client Services Centre by the application closing date (31 July for the 2027 intake); after that it is up to the faculty whether to accommodate you.', [S.uctFaq, S.witsApply, S.suApply2027]),
      v('**NWU** does not allow changes once an application is submitted at all - you can only apply once per academic year - though accepted students can apply to change their qualification during an "amendment period" in their first year, subject to space being available.', [S.nwuChange1, S.nwuChange2]),
      r('**UWC** asks you not to submit a new application if you change your mind, and instead to contact its Contact Centre about changing your choice. **UJ**’s own admissions policy states that once an application is submitted, no changes, modifications or additions can be made.', [S.uwcAppInfo, S.ujPolicy]),
      g('Policies differ enough between universities that the only safe approach is to check your specific university’s page and act well before its closing date.'),
    ],
    checks: [{ label: 'The "how to apply" or admissions FAQ page of the university you applied to', url: null }],
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
    question: 'When do I apply for NSFAS, and do I qualify?',
    answer: [
      v('The NSFAS 2027 application cycle **opened on 18 September 2026 and closes on 18 November 2026**, with funding outcomes communicated in December. NSFAS is a **separate application** from applying to a university.', [S.nsfas, S.sanews]),
      g('We saw a different closing date (31 October) on at least one other website. The Minister’s own launch speech and the SAnews report both say 18 November, so we use that - but always confirm on nsfas.org.za.'),
      v('To qualify, you need South African citizenship, a place (or application) at a public university or TVET college, and a combined household income of **R350,000 or less per year** - R600,000 or less if you or a sibling has a disability. Anyone whose household already receives a SASSA grant (Child Support, Foster Care or Care Dependency) automatically meets the income test. Students registered before 2018 fall under an older, lower threshold of R122,000.', [S.nsfasEligibility]),
    ],
    checks: [{ label: 'nsfas.org.za - the application page', url: 'https://www.nsfas.org.za' }, { label: 'Check your own eligibility', url: '/bursaries#nsfas-check' }],
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
  {
    id: 'qualification-types', category: 'words',
    question: 'What is the difference between a Higher Certificate, Diploma, Advanced Diploma and Bachelor’s Degree?',
    answer: [
      v('South Africa’s Higher Education Qualifications Sub-Framework (HEQSF), set by the Council on Higher Education, pegs each qualification type to a specific NQF level and a minimum number of credits (roughly 10 study hours per credit). A **Higher Certificate** sits at **NQF level 5** (120 credits, about 1 year). A **Diploma** sits at **NQF level 6** (240 or 360 credits, 2-3 years - the 360-credit version can include up to 120 credits of workplace-based learning). An **Advanced Diploma** sits at **NQF level 7** (120 credits, about 1 further year on top of a Diploma or Bachelor’s degree - it is not something a school leaver enrols into directly). A **Bachelor’s Degree** can sit at **NQF level 7** (360 credits, 3 years, a "general" degree) or **NQF level 8** (480 credits, 4 years, a more demanding "professional" degree - the track most accredited engineering, law and similar degrees use). A **Bachelor Honours Degree** sits at **NQF level 8** (120 credits, about 1 further year on top of a Bachelor’s degree).', [S.heqsf]),
      v('The jump in level is about more than time. SAQA’s own level descriptors describe **level 6** as applying known methods to solve problems in **unfamiliar contexts**, **level 7** as **integrating** knowledge across a field and applying research methods to resolve problems, and **level 8** as engaging with knowledge **at the forefront** of a field and critically evaluating how that knowledge was produced.', [S.saqaLevels]),
      g('In everyday conversation people often use "diploma" loosely for any shorter, career-focused qualification. The HEQSF names above are the precise, registered meaning, and what programme listings on this site use.'),
    ],
    checks: [
      { label: 'CHE Higher Education Qualifications Sub-Framework (2013)', url: S.heqsf.url },
      { label: 'SAQA Level Descriptors for the NQF', url: S.saqaLevels.url },
    ],
  },
  {
    id: 'beng-vs-engtech', category: 'words',
    question: 'What’s the difference between a BEng/BSc(Eng) and a BEngTech or engineering Diploma?',
    answer: [
      v('These lead to **different professional registration categories with the Engineering Council of South Africa (ECSA)**, not just different-sounding names. ECSA’s own registration page sets out three categories: a **Professional Engineer (Pr Eng)**, whose benchmark qualification is a 4-year **BEng or BSc(Eng)**, who solves "complex engineering problems"; a **Professional Engineering Technologist (Pr Tech Eng)**, whose qualification is a **Bachelor of Engineering Technology (BEngTech)**, who applies "established engineering principles and advanced technological knowledge" to more narrowly-scoped work; and a **Professional Engineering Technician (Pr Techni Eng)**, whose qualification is a **National Diploma/Diploma in Engineering**, who solves "well-defined engineering problems."', [S.ecsaReg]),
      r('BEngTech is itself a Bachelor’s degree, not a diploma - it typically sits at **NQF level 7** with 360 credits over **3 years**, offered at universities of technology, and is the current route into the Pr Tech Eng category (the older standalone BTech top-up qualification is being phased out). We found this stated consistently across several universities-of-technology programme pages but have not read a single CHE/SAQA document that states the BEngTech level directly, so this paragraph is reported rather than verified.', [S.ujBengTech]),
      g('Practically: this site lists many engineering qualifications at universities of technology (CPUT, CUT, DUT, MUT, TUT, VUT) as BEngTech or National Diploma programmes rather than BEng. These are real, respected, accredited routes into engineering - including into a Professional Engineering Technologist or Technician career - but they sit in a **different ECSA category from a BEng/BSc(Eng)**, which is specifically the route to becoming a Professional Engineer. If your goal is specifically "Professional Engineer," check whether a programme is accredited as a BEng/BSc(Eng) before applying - the university’s own faculty page will say so.'),
    ],
    checks: [
      { label: 'ECSA - Registration categories', url: S.ecsaReg.url },
      { label: 'The programme’s own page - check whether it is accredited as BEng/BSc(Eng), BEngTech, or a Diploma', url: null },
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
