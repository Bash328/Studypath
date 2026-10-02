// Dates that matter to a student: when applications close, when the NBT can be written,
// when funding closes, and when universities hold open days.
//
// CYCLE: everything here is for the 2027 intake (applying in Grade 12 during 2026). As of
// 1 October 2026 most of these dates have already passed. The site shows that honestly
// ("Closed") rather than hiding it, because a Grade 11 learner needs to know roughly when
// the next cycle's dates will fall. We do NOT predict 2028 dates: they have not been
// published, and a guessed deadline is the kind of error that costs a student a place.
//
// verification (same meaning as contacts.mjs):
//   verified   - read on an official page or document by us
//   reported   - from the Study Path research pack or an official-site search excerpt;
//                the page itself was not re-read by us (often because it blocks bots)
//   unverified - missing, conflicting, or only from an out-of-date document
//
// kind: close | open | nbt | funding | open_day

const d = (row) => ({ university_id: null, date_end: null, applies_to: null, note: null, time: null, ...row });

export const CYCLE = { intake: 2027, label: '2027 intake (you apply during Grade 12 in 2026)' };

export const dates = [
  // ================================================================ Application closing dates
  d({ id: 'uct-close', university_id: 'uct', kind: 'close', title: 'Applications close', date: '2026-07-31', applies_to: 'All undergraduate programmes',
      verification: 'reported', note: 'From the UCT 2027 Undergraduate Prospectus.',
      source_url: 'https://www.uct.ac.za/sites/default/files/media/documents/2027-uct-undergraduate-prospectus-1-april-2026.pdf' }),
  d({ id: 'wits-close-health', university_id: 'wits', kind: 'close', title: 'Health Sciences applications close', date: '2026-06-30', applies_to: 'Health Sciences (Medicine, Dentistry, Pharmacy, Physiotherapy ...)',
      verification: 'reported', note: 'Wits says applications open in March. The Bachelor of Arts in Film & Television (BAFT) portfolio was due 31 August 2026 (research pack). We did not find a single closing date for Wits’s other faculties.',
      source_url: 'https://www.wits.ac.za/course-finder/undergraduate/health/medicine-and-surgery/' }),
  d({ id: 'up-close', university_id: 'up', kind: 'close', title: 'Most applications close', date: '2026-06-30', applies_to: 'Most programmes; Veterinary Science closed 31 May 2026',
      verification: 'reported', note: 'Grade 12 applicants apply using their final Grade 11 results. Always check the programme’s own date.',
      source_url: 'https://drupalwebprod-files.up.ac.za/Public/2026-03/UP_DESA_Application%20requirements%20tables_2027_web.pdf?VersionId=vw30gCBk2BMAXzOhFSBflmkFOHOMFOoa' }),
  d({ id: 'ukzn-close-med', university_id: 'ukzn', kind: 'close', title: 'Medicine (MBChB) applications close', date: '2026-06-30', applies_to: 'Nelson R Mandela School of Medicine',
      verification: 'verified', source_url: 'https://studyatukzn.ukzn.ac.za/apply-at-ukzn/how-to-apply/' }),
  d({ id: 'ukzn-close', university_id: 'ukzn', kind: 'close', title: 'Applications close', date: '2026-09-30', applies_to: 'Colleges of Agriculture, Engineering & Science; Humanities; Law & Management Studies; and the other Health Sciences programmes',
      verification: 'verified', note: 'First-time South African applicants apply through the CAO.', source_url: 'https://studyatukzn.ukzn.ac.za/apply-at-ukzn/how-to-apply/' }),
  d({ id: 'ufs-close-1', university_id: 'ufs', kind: 'close', title: 'Health programmes close', date: '2026-05-31',
      applies_to: 'MBChB, Occupational Therapy, Optometry, Physiotherapy, Radiation Science, Biokinetics, Dietetics, Sports Coaching',
      verification: 'verified', source_url: 'https://apply.ufs.ac.za/Application/Start' }),
  d({ id: 'ufs-close-2', university_id: 'ufs', kind: 'close', title: 'Nursing, Social Work and Architecture close', date: '2026-07-31',
      verification: 'verified', source_url: 'https://apply.ufs.ac.za/Application/Start' }),
  d({ id: 'ufs-close-3', university_id: 'ufs', kind: 'close', title: 'International undergraduate applications close', date: '2026-08-31',
      verification: 'verified', source_url: 'https://apply.ufs.ac.za/Application/Start' }),
  d({ id: 'ufs-close-4', university_id: 'ufs', kind: 'close', title: 'All other programmes close', date: '2026-09-30', applies_to: 'All other selection and non-selection programmes, and transferring students',
      verification: 'verified', source_url: 'https://apply.ufs.ac.za/Application/Start' }),
  d({ id: 'ru-close', university_id: 'ru', kind: 'close', title: 'Online applications close', date: '2026-09-30', applies_to: 'Applications opened 1 April',
      verification: 'verified', source_url: 'https://www.ru.ac.za/media/rhodesuniversity/content/registrar/documents/information/studentrecruitment/RU_READY_Undergraduate_Prospectus_2026_DIGITAL_A5_Landscape_24pp_18Mar2026.pdf' }),
  d({ id: 'uwc-close', university_id: 'uwc', kind: 'close', title: 'Applications close', date: '2026-09-30', applies_to: 'Undergraduate; Dentistry closed 31 August 2026',
      verification: 'reported', source_url: 'https://www.uwc.ac.za/admission-and-financial-aid/apply/undergraduate-applications' }),
  d({ id: 'nwu-open', university_id: 'nwu', kind: 'open', title: 'Applications opened', date: '2026-06-01',
      verification: 'reported', note: 'NWU’s site currently shows undergraduate applications as closed. Check studies.nwu.ac.za.',
      source_url: 'https://studies.nwu.ac.za/studies/apply' }),
  d({ id: 'cput-close', university_id: 'cput', kind: 'close', title: 'Applications close', date: '2026-09-30', applies_to: 'South African applicants',
      verification: 'reported', source_url: 'https://www.cput.ac.za/study/apply' }),
  d({ id: 'cut-close', university_id: 'cut', kind: 'close', title: 'Applications close', date: '2026-09-30',
      verification: 'reported', source_url: 'https://www.cut.ac.za/application-process/' }),
  d({ id: 'dut-close', university_id: 'dut', kind: 'close', title: 'Applications close', date: '2026-09-30', applies_to: 'Via the CAO',
      verification: 'reported', source_url: 'https://www.dut.ac.za/wp-content/uploads/2026/06/How-to-Apply-2027.pdf' }),
  d({ id: 'mut-close', university_id: 'mut', kind: 'close', title: 'Applications close', date: '2026-09-30', date_end: '2026-11-30',
      applies_to: 'Via the CAO; late applications are accepted until 30 November with a CAO late fee',
      verification: 'reported', source_url: 'https://www.mut.ac.za/prospective-students/apply/' }),
  d({ id: 'wsu-close', university_id: 'wsu', kind: 'close', title: 'Applications close', date: '2026-10-31',
      verification: 'reported', source_url: 'https://www.wsu.ac.za/en/study-with-us/application-and-registration/how-to-apply-the-process' }),
  d({ id: 'ufh-close', university_id: 'ufh', kind: 'close', title: 'Applications close', date: '2026-10-31',
      verification: 'reported', source_url: 'https://www.ufh.ac.za/apply/apply-undergraduate' }),
  d({ id: 'spu-close', university_id: 'spu', kind: 'close', title: 'Applications close', date: '2026-10-31',
      verification: 'reported', note: 'SPU’s page still carries an out-of-date year label in places - confirm on the page.',
      source_url: 'https://www.spu.ac.za/index.php/how-to-apply/' }),
  d({ id: 'ump-close', university_id: 'ump', kind: 'close', title: 'Applications close', date: '2026-11-30',
      verification: 'reported', source_url: 'https://www.ump.ac.za/Study-with-us/Application-Process/Online-Applications' }),
  d({ id: 'smu-close', university_id: 'smu', kind: 'close', title: 'Undergraduate applications closed', date: '2026-07-31',
      verification: 'reported', source_url: 'https://www.smu.ac.za/students/apply/online-application/' }),
  d({ id: 'vut-close', university_id: 'vut', kind: 'close', title: 'Applications close - SOURCES DISAGREE', date: null,
      note: 'VUT’s how-to-apply page says 30 October 2026 but its homepage banner says 30 September 2026. Ask VUT before relying on either.',
      verification: 'unverified', source_url: 'https://vut.ac.za/how-to-apply/' }),
  d({ id: 'uj-close', university_id: 'uj', kind: 'close', title: 'Applications close', date: '2026-10-31', time: '12:00',
      applies_to: 'First-time undergraduate applicants', note: 'Applications open 1 April. No late applications are accepted after this date.',
      verification: 'reported', source_url: 'https://www.uj.ac.za/faq/' }),
  d({ id: 'ul-close', university_id: 'ul', kind: 'close', title: 'Applications close', date: '2026-09-30',
      applies_to: 'All other qualifications; MBChB and international students close 30 July 2026',
      verification: 'verified', source_url: 'https://www.ul.ac.za/study-with-us-university-of-limpopo-2027-application-now-open/' }),
  d({ id: 'unisa-close', university_id: 'unisa', kind: 'close', title: 'Applications close', date: '2026-10-09',
      applies_to: 'All undergraduate qualifications', note: 'Applications open 17 August 2026. Unisa is distance-only and not first-come-first-served.',
      verification: 'verified', source_url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission/Undergraduate-qualifications/Qualifications/All-qualifications/Bachelor-of-Commerce-(98314-%E2%80%93-GEN)' }),
  d({ id: 'nmu-open', university_id: 'nmu', kind: 'open', title: 'Applications opened', date: '2026-04-13', verification: 'reported',
      note: 'We did not find NMU’s closing date.', source_url: 'https://www.mandela.ac.za/Study-at-Mandela/Application/Apply-Undergraduate' }),
  d({ id: 'tut-open', university_id: 'tut', kind: 'open', title: 'Applications opened', date: '2026-04-01', verification: 'reported',
      note: 'TUT programmes may close when full. We did not find a single closing date.', source_url: 'https://www.tut.ac.za/media/tshwane-interim/site-content/documents/General-Information-First-Year-Enrolment.pdf' }),
  d({ id: 'ufs-open', university_id: 'ufs', kind: 'open', title: 'Applications opened', date: '2026-04-01', verification: 'reported',
      source_url: 'https://apply.ufs.ac.za/Application/Start' }),

  // ================================================================ NBT
  d({ id: 'nbt-window', kind: 'nbt', title: 'NBT sittings run from May until the first Saturday in January', date: null,
      applies_to: 'Everyone who needs the NBT', verification: 'verified',
      note: 'You book a specific date and venue on the NBT website; changes are allowed until that sitting’s closing date. Each university sets its own deadline for receiving results - these can be as early as June or July.',
      source_url: 'https://www.nbt.ac.za/content/faq-0' }),
  d({ id: 'uct-nbt-final', university_id: 'uct', kind: 'nbt', title: 'Final NBT date for UCT', date: '2026-10-03', verification: 'reported',
      source_url: 'https://www.uct.ac.za/sites/default/files/media/documents/2027-uct-undergraduate-prospectus-1-april-2026.pdf' }),
  d({ id: 'wits-nbt-health', university_id: 'wits', kind: 'nbt', title: 'NBT deadline for Health Sciences', date: '2026-08-17',
      applies_to: 'Must be written in person; online NBTs are not considered', verification: 'reported',
      source_url: 'https://www.wits.ac.za/course-finder/undergraduate/health/medicine-and-surgery/' }),
  d({ id: 'wits-nbt-science', university_id: 'wits', kind: 'nbt', title: 'NBT for Science applicants', date: '2026-10-31',
      applies_to: 'Science applicants - "before the end of October"', verification: 'reported',
      note: 'The date is the research pack’s wording ("before the end of October"); confirm the exact day on Wits’s Science course pages.',
      source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/bsc/' }),
  d({ id: 'su-nbt-law', university_id: 'su', kind: 'nbt', title: 'NBT deadline for Law', date: '2026-07-31',
      applies_to: 'LLB and BA Law: AQL. BCom (Law) and BAccLLB: AQL and MAT.', verification: 'verified',
      source_url: 'https://files.su.ac.za/public/undergraduate-maties/documents/2026-01/su-admissions-booklet-2027.pdf' }),

  // ================================================================ Funding
  d({ id: 'nsfas-2027', kind: 'funding', title: 'NSFAS 2027 applications', date: '2026-09-18', date_end: '2026-11-18',
      applies_to: 'South African students planning to study at a public university or TVET college', verification: 'verified',
      note: 'Opened 18 September 2026 and closes 18 November 2026; successful applicants hear in December. NSFAS is a separate application from your university application. One secondary website gave 31 October and another snippet showed a different date - the Minister’s launch speech and the SAnews report, both 18 September 2026, say 18 November, so we use that. Always check nsfas.org.za.',
      source_url: 'https://www.gov.za/news/speeches/minister-buti-manamela-launch-nsfas-2027-application-cycle-18-sep-2026' }),

  // ================================================================ Open days
  d({ id: 'uct-open-2027', university_id: 'uct', kind: 'open_day', title: 'UCT Open Day 2027', date: '2027-04-10',
      applies_to: 'Grade 10, 11 and 12 learners, families and teachers; on campus', verification: 'verified',
      source_url: 'https://uct.ac.za/students/prospective-students/open-day' }),
  d({ id: 'uct-open-2026', university_id: 'uct', kind: 'open_day', title: 'UCT Open Day 2026', date: '2026-04-25', time: '10:00-15:00',
      verification: 'reported', source_url: 'https://www.news.uct.ac.za/article/-2026-04-30-why-ucta-prospective-students-answer-at-the-2026-open-day' }),
  d({ id: 'su-open-2027', university_id: 'su', kind: 'open_day', title: 'Stellenbosch Open Day 2027', date: '2027-04-17', time: '08:00-15:00',
      applies_to: 'Undergraduate, on campus', verification: 'reported',
      note: 'Seen in an excerpt of SU’s official site; SU’s new website blocks automated access, so confirm the date on su.ac.za.',
      source_url: 'https://www.su.ac.za/en/faculties/agrisciences/open-day/' }),
  d({ id: 'su-open-2026', university_id: 'su', kind: 'open_day', title: 'Stellenbosch Open Day 2026', date: '2026-04-18',
      applies_to: 'Grade 11 and 12 learners, parents, teachers and guidance counsellors', verification: 'verified',
      note: 'There was also an Online Open Day from 20 April to 31 July 2026.',
      source_url: 'https://files.su.ac.za/public/undergraduate-maties/documents/2026-01/su-admissions-booklet-2027.pdf' }),
  d({ id: 'ukzn-open-westville-2026', university_id: 'ukzn', kind: 'open_day', title: 'UKZN Open Day 2026 - Westville', date: '2026-03-07', time: '09:00-13:00',
      verification: 'reported', note: 'UKZN’s 2027 open day dates had not been announced when we checked.', source_url: 'https://studyatukzn.ukzn.ac.za/ukzn-open-day-2026/' }),
  d({ id: 'ukzn-open-pmb-2026', university_id: 'ukzn', kind: 'open_day', title: 'UKZN Open Day 2026 - Pietermaritzburg', date: '2026-03-14', time: '09:00-13:00',
      verification: 'reported', source_url: 'https://studyatukzn.ukzn.ac.za/ukzn-open-day-2026/' }),
  d({ id: 'up-open-2026', university_id: 'up', kind: 'open_day', title: 'UP NextGen Open Day 2026', date: '2026-03-07', time: '08:00-13:00',
      applies_to: 'Grade 8 to 12 learners with parents and teachers; free', verification: 'reported',
      note: 'UP’s 2027 date had not been announced when we checked.', source_url: 'https://www.up.ac.za/faculty-of-natural-agricultural-sciences/nextgen-open-day-7-march-2026' }),
  d({ id: 'nwu-open-potch-2026', university_id: 'nwu', kind: 'open_day', title: 'NWU Open Day 2026 - Potchefstroom', date: '2026-05-09',
      verification: 'reported', note: 'Vanderbijlpark was 16 May and Mahikeng 23 May 2026. NWU’s 2027 dates had not been announced.', source_url: 'https://studies.nwu.ac.za/open-days' }),
  d({ id: 'nwu-open-vaal-2026', university_id: 'nwu', kind: 'open_day', title: 'NWU Open Day 2026 - Vanderbijlpark', date: '2026-05-16',
      verification: 'reported', source_url: 'https://studies.nwu.ac.za/open-days' }),
  d({ id: 'nwu-open-mahikeng-2026', university_id: 'nwu', kind: 'open_day', title: 'NWU Open Day 2026 - Mahikeng', date: '2026-05-23',
      verification: 'reported', source_url: 'https://studies.nwu.ac.za/open-days' }),
  d({ id: 'wits-parents-2026', university_id: 'wits', kind: 'open_day', title: 'Wits Parents Day 2026', date: '2026-08-15',
      applies_to: 'Prospective students and their families, hosted by the Schools Liaison Office', verification: 'reported',
      note: 'We did not find a general Wits open day. Ask the Schools Liaison Office about 2027.', source_url: 'https://www.wits.ac.za/news/latest-news/general-news/2026/2026-08/future-witsies-get-a-glimpse-of-campus-life.html' }),
];

// Where to look for open days at universities with no confirmed date yet.
export const OPEN_DAY_PAGES = [
  { university_id: 'ufs', label: 'UFS events hub', url: 'https://www.ufs.ac.za/prospective/study-at-ufs/events-hub/current-and-upcoming-events', verification: 'reported' },
  { university_id: 'uwc', label: 'UWC annual open day', url: 'https://www.uwc.ac.za/admission-and-financial-aid/admission-support-services/annual-open-day', verification: 'reported' },
  { university_id: 'uj', label: 'UJ news and events', url: 'https://news.uj.ac.za/', verification: 'reported' },
];

// Application fees, per university (R = rand). Applying is free at some.
export const APPLICATION_FEES = [
  { university_id: 'wits', fee: 'R100', verification: 'verified', source_url: 'https://www.wits.ac.za/undergraduate/apply-to-wits/' },
  { university_id: 'uct', fee: 'R100 (South Africa/SADC) – free for UCT students and graduates', verification: 'verified', source_url: 'https://uct.ac.za/students/applications-apply-undergraduate-qualifications/application-procedure' },
  { university_id: 'su', fee: 'R100 (South African citizens, permanent residents, refugees)', verification: 'reported', source_url: 'https://www.sun.ac.za/english/maties/fees/application-fee' },
  { university_id: 'up', fee: 'R300 – waived if household income is R150,000/year or less', verification: 'reported', source_url: 'https://www.up.ac.za/online-application/application-fee' },
  { university_id: 'ufs', fee: 'Free', verification: 'verified', source_url: 'https://apply.ufs.ac.za/Application/Start' },
  { university_id: 'ukzn', fee: 'R250 (paid to the CAO, non-refundable)', verification: 'verified', source_url: 'https://studyatukzn.ukzn.ac.za/apply-at-ukzn/how-to-apply/' },
  { university_id: 'uj', fee: 'Free when you apply online (a fee applies to paper applications)', verification: 'reported', source_url: 'https://www.uj.ac.za/wp-content/uploads/2021/09/uj-application-form-2025-1.pdf' },
  { university_id: 'cut', fee: 'Free', verification: 'reported', source_url: 'https://www.cut.ac.za/application-process/' },
  { university_id: 'tut', fee: 'R240', verification: 'reported', source_url: 'https://www.tut.ac.za/media/tshwane-interim/site-content/documents/General-Information-First-Year-Enrolment.pdf' },
  { university_id: 'smu', fee: 'R300', verification: 'reported', source_url: 'https://www.smu.ac.za/students/apply/online-application/' },
  { university_id: 'ul', fee: 'R200', verification: 'reported', source_url: 'https://www.ul.ac.za/admissions/undergraduate-studies/' },
  { university_id: 'ump', fee: 'R200', verification: 'reported', source_url: 'https://www.ump.ac.za/Study-with-us/Application-Process/Online-Applications' },
  { university_id: 'ufh', fee: 'R120', verification: 'reported', source_url: 'https://www.ufh.ac.za/apply/apply-undergraduate' },
  { university_id: 'wsu', fee: 'R100', verification: 'reported', source_url: 'https://www.wsu.ac.za/en/study-with-us/application-and-registration/how-to-apply-the-process' },
];
