// University contacts - who to ask, and how.
//
// verification:
//   verified   - we read this on an official .ac.za page or document on 2026-10-01
//                (for UP and UJ, whose sites block automated access, we saw it in
//                excerpts of the official pages - noted on the row)
//   reported   - from the Study Path research pack (30 Sept 2026), which cites an
//                official .ac.za source, but we have not re-read that page ourselves
//   unverified - the research pack could not confirm it, or sources disagree
//
// topics (what a student might be asking about; drives the "Ask a university" page):
//   applying | requirements | status | nbt | money | international | subject-advice | health
//
// Contacts change. Re-check every application cycle. Nothing here is a guess: where a
// field is unknown it is null and the row says why.

const CHECKED = '2026-10-01';
const c = (row) => ({ checked: CHECKED, topics: ['applying', 'requirements', 'status'], kind: 'admissions', email: null, phone: null, url: null, hours: null, note: null, ...row });

export const contacts = [
  // ------------------------------------------------------------------ UCT
  c({ id: 'uct-admissions', university_id: 'uct', label: 'Admissions Office',
      email: 'admissions@uct.ac.za', phone: '+27 (0)21 650 2128', hours: '08:30-16:30, Monday to Friday',
      url: 'https://uct.ac.za/applicants-and-students', verification: 'verified',
      source_url: 'https://www.uct.ac.za/general-contacts' }),
  c({ id: 'uct-nbt', university_id: 'uct', kind: 'nbt', label: 'National Benchmark Tests (at UCT)',
      email: 'adp-aarp@uct.ac.za', phone: '+27 (0)21 650 3523 or +27 (0)21 650 5045', topics: ['nbt'], verification: 'verified',
      note: 'UCT’s own contacts page lists this address. The research pack gave a different one (nbt@uct.ac.za) which we could not find on UCT’s site, so we do not use it.',
      source_url: 'https://www.uct.ac.za/general-contacts' }),
  c({ id: 'uct-finaid', university_id: 'uct', kind: 'financial_aid', label: 'Undergraduate Financial Aid',
      email: 'financialaid@uct.ac.za', phone: '+27 (0)21 650 3545', topics: ['money'], verification: 'verified',
      note: 'The research pack gave a different address (sfa-finaid@uct.ac.za / 021 650 2125). UCT’s own contacts page lists the ones shown here, so we use them.',
      source_url: 'https://www.uct.ac.za/general-contacts' }),
  c({ id: 'uct-international', university_id: 'uct', kind: 'international', label: 'International students (IAPO)',
      email: 'iapo@uct.ac.za', phone: '+27 21 650 2822/3740 or +27 21 650 5667', hours: '08:30-16:30 Mon-Thurs, 08:30-16:00 Fri',
      topics: ['international'], verification: 'verified', source_url: 'https://www.uct.ac.za/general-contacts' }),

  // ------------------------------------------------------------------ Wits
  c({ id: 'wits-callcentre', university_id: 'wits', kind: 'call_centre', label: 'Student Call Centre (Ask Wits)',
      email: 'ask.wits@wits.ac.za', phone: '+27 (0)11 717 1888', hours: '08:00-16:30 Monday to Friday (Wednesday from 09:00)',
      url: 'https://www.wits.ac.za/askwits', topics: ['applying', 'requirements', 'status', 'nbt', 'money', 'international'],
      verification: 'verified',
      note: 'A general call-centre address, not a dedicated admissions office. After you apply an Admissions Consultant is assigned to you, and Wits’s Kudubot answers programme admission questions 24/7.',
      source_url: 'https://www.wits.ac.za/undergraduate/contact-us/' }),

  // ------------------------------------------------------------------ Stellenbosch
  c({ id: 'su-info', university_id: 'su', kind: 'call_centre', label: 'Client Services Centre',
      email: 'info@sun.ac.za', phone: '+27 21 808 9111', url: 'https://www.su.ac.za/en/apply/undergrad',
      topics: ['applying', 'status', 'money', 'international'], verification: 'verified',
      source_url: 'https://files.su.ac.za/public/undergraduate-maties/documents/2026-01/su-admissions-booklet-2027.pdf' }),
  c({ id: 'su-recruitment', university_id: 'su', kind: 'subject_advice', label: 'Student recruitment - book a consultation',
      email: 'csr@sun.ac.za', phone: '021 808 4709', topics: ['requirements', 'subject-advice'], verification: 'verified',
      note: 'Book individual face-to-face or online appointments with a student recruitment practitioner about programmes, admission requirements and the application process. SU also points learners here for subject-choice guidance.',
      source_url: 'https://files.su.ac.za/public/undergraduate-maties/documents/2026-01/su-admissions-booklet-2027.pdf' }),
  c({ id: 'su-whatsapp', university_id: 'su', kind: 'whatsapp', label: 'WhatsApp chatbot',
      phone: '061 729 8858', topics: ['applying', 'requirements'], verification: 'reported',
      source_url: 'https://files.su.ac.za/public/undergraduate-maties/documents/2025-09/grade-12-faqspdf.pdf' }),

  // ------------------------------------------------------------------ UP
  c({ id: 'up-ssc', university_id: 'up', kind: 'call_centre', label: 'Student Service Centre',
      email: 'ssc@up.ac.za', phone: '+27 (0)12 420 3111', hours: '08:00-16:00, Monday to Friday',
      url: 'https://www.up.ac.za/online-application', topics: ['applying', 'requirements', 'status', 'money'],
      verification: 'verified',
      note: 'Seen in excerpts of UP’s official contact pages; UP’s website blocks automated access so we could not open the page itself. Handles online applications, registration, student finance and financial aid, and residence enquiries.',
      source_url: 'https://www.up.ac.za/department-enrolment-and-student-administration/welcome-student-service-centre' }),
  c({ id: 'up-tollfree', university_id: 'up', kind: 'call_centre', label: 'Toll-free line',
      phone: '080 000 6428', topics: ['applying'], verification: 'reported',
      source_url: 'https://www.up.ac.za/contact-us' }),

  // ------------------------------------------------------------------ UJ
  c({ id: 'uj-mylife', university_id: 'uj', kind: 'call_centre', label: 'Admission enquiries (Call Centre)',
      email: 'mylife@uj.ac.za', phone: '+27 (0)11 559 4555', url: null, verification: 'verified',
      note: 'Seen in UJ’s official application form and in excerpts of its pages; UJ’s website blocks automated access. We could not confirm UJ’s main admissions page address, so none is shown.',
      source_url: 'https://www.uj.ac.za/wp-content/uploads/2021/09/uj-application-form-2025-1.pdf' }),

  // ------------------------------------------------------------------ Rhodes
  c({ id: 'ru-registrar', university_id: 'ru', label: 'Registrar’s Division (Student Bureau)',
      email: 'registrar@ru.ac.za', phone: '(046) 603 8276', url: 'https://www.ru.ac.za/admissiongateway/', verification: 'verified',
      note: 'From the back page of the Rhodes undergraduate prospectus. Online applications go through Rhodes’s ROSS portal (ross.ru.ac.za; from the research pack).',
      source_url: 'https://www.ru.ac.za/media/rhodesuniversity/content/registrar/documents/information/studentrecruitment/RU_READY_Undergraduate_Prospectus_2026_DIGITAL_A5_Landscape_24pp_18Mar2026.pdf' }),

  // ------------------------------------------------------------------ UKZN
  c({ id: 'ukzn-enquiries', university_id: 'ukzn', label: 'General enquiries',
      email: 'enquiries@ukzn.ac.za', phone: '+27 (0)31 260 2212 / 1084 or +27 (0)33 260 5212',
      url: 'https://studyatukzn.ukzn.ac.za/apply-at-ukzn/how-to-apply/', verification: 'verified',
      note: 'International students apply directly to UKZN. South African first-time applicants apply through the CAO (next row).',
      source_url: 'https://studyatukzn.ukzn.ac.za/apply-at-ukzn/how-to-apply/' }),
  c({ id: 'ukzn-cao', university_id: 'ukzn', kind: 'cao', label: 'Central Applications Office (CAO)',
      phone: '+27 (0)31 268 4444', url: 'https://www.cao.ac.za', topics: ['applying', 'status'], verification: 'verified',
      note: 'A non-refundable CAO application fee of R250 is payable via the CAO website or at any EasyPay outlet. The CAO handles first-time applications for UKZN (and, per the research pack, DUT, MUT and UniZulu).',
      source_url: 'https://studyatukzn.ukzn.ac.za/apply-at-ukzn/how-to-apply/' }),

  // ------------------------------------------------------------------ NWU
  c({ id: 'nwu-callcentre', university_id: 'nwu', kind: 'call_centre', label: 'NWU Call Centre',
      email: 'studies@nwu.ac.za', phone: '0860 169 698', url: 'https://studies.nwu.ac.za/studies/apply', verification: 'verified',
      note: 'A general call-centre address rather than a dedicated admissions office.',
      source_url: 'https://studies.nwu.ac.za/studies/contact-us' }),
  c({ id: 'nwu-whatsapp', university_id: 'nwu', kind: 'whatsapp', label: 'WhatsApp',
      phone: '+27 (0)60 070 2606', topics: ['applying', 'requirements'], verification: 'verified',
      note: 'NWU also lists an SMS line: 31750.', source_url: 'https://studies.nwu.ac.za/studies/contact-us' }),

  // ------------------------------------------------------------------ UFS
  c({ id: 'ufs-applications', university_id: 'ufs', label: 'Undergraduate applications',
      email: 'applications@ufs.ac.za', phone: '+27 (0)51 401 3000', url: 'https://apply.ufs.ac.za/Application/Start', verification: 'verified',
      note: 'Applying to UFS is free.', source_url: 'https://apply.ufs.ac.za/Application/Start' }),
  c({ id: 'ufs-whatsapp', university_id: 'ufs', kind: 'whatsapp', label: 'KovsieChat (WhatsApp)',
      phone: '087 240 6370', topics: ['applying', 'requirements'], verification: 'verified',
      source_url: 'https://apply.ufs.ac.za/Application/Start' }),
  c({ id: 'ufs-health', university_id: 'ufs', kind: 'health', label: 'Faculty of Health Sciences applications',
      email: 'fhsapplications@ufs.ac.za', topics: ['health', 'applying', 'requirements'], verification: 'verified',
      source_url: 'https://www.ufs.ac.za/docs/librariesprovider23/ems-documents/e3_ufs-undergraduade-programme-2024.pdf?sfvrsn=71432920_3' }),

  // ------------------------------------------------------------------ UWC
  c({ id: 'uwc-admissions', university_id: 'uwc', label: 'Admissions',
      email: 'admissions@uwc.ac.za', phone: '021 959 3900 / 3901', url: 'https://www.uwc.ac.za/admission-and-financial-aid/apply/undergraduate-applications',
      verification: 'verified', source_url: 'https://www.uwc.ac.za/admission-and-financial-aid/undergraduate-admission/application-information' }),

  // =========================================================== Not yet researched for requirements
  // Everything below is "reported": from the research pack, citing the official page shown,
  // not re-read by us. Unverified fields are null with the reason in `note`.
  c({ id: 'nmu-info', university_id: 'nmu', kind: 'call_centre', label: 'General enquiries',
      email: 'info@mandela.ac.za', phone: '+27 (0)41 504 1111', url: 'https://www.mandela.ac.za/Study-at-Mandela/Application/Apply-Undergraduate',
      verification: 'reported', note: 'The Registrar’s page also lists admissions@mandela.ac.za. Applications for 2027 opened on 13 April 2026.',
      source_url: 'https://registrarsoffice.mandela.ac.za/Academic-Administration' }),
  c({ id: 'ul-enrolment', university_id: 'ul', label: 'Enrolment',
      email: 'enrolment@ul.ac.za', phone: '015 268 3332', url: 'https://www.ul.ac.za/admissions/undergraduate-studies/', verification: 'reported',
      source_url: 'https://www.ul.ac.za/admissions/undergraduate-studies/' }),
  c({ id: 'univen-admissions', university_id: 'univen', label: 'Undergraduate admissions',
      email: null, phone: '+27 15 962 8959', url: 'https://www.univen.ac.za/student-affairs/student-support-services/how-to-apply/', verification: 'unverified',
      note: 'No general admissions email was found - only named staff addresses - so none is shown. Use the phone number or the page.',
      source_url: 'https://www.univen.ac.za/student-affairs/student-support-services/how-to-apply/' }),
  c({ id: 'wsu-enquiries', university_id: 'wsu', label: 'Enquiries',
      email: 'enquiries@wsu.ac.za', phone: '+27 43 709 4000', url: 'https://www.wsu.ac.za/en/study-with-us/application-and-registration/how-to-apply-the-process', verification: 'reported',
      note: 'WSU also has campus-specific application emails - see its how-to-apply page.',
      source_url: 'https://www.wsu.ac.za/en/study-with-us/application-and-registration/how-to-apply-the-process' }),
  c({ id: 'ufh-admissions', university_id: 'ufh', label: 'Admissions',
      email: 'admissions@ufh.ac.za', phone: '+27 40 602 2011', url: 'https://www.ufh.ac.za/apply/apply-undergraduate', verification: 'reported',
      source_url: 'https://www.ufh.ac.za/admission-contact' }),
  c({ id: 'spu-applications', university_id: 'spu', label: 'Applications',
      email: 'applications@spu.ac.za', phone: '053 491 0116', url: 'https://www.spu.ac.za/index.php/how-to-apply/', verification: 'reported',
      source_url: 'https://www.spu.ac.za/index.php/contact-spu/' }),
  c({ id: 'ump-applications', university_id: 'ump', label: 'Student applications',
      email: 'studentapplications@ump.ac.za', phone: '013 002 0047 / 0050', url: 'https://www.ump.ac.za/Study-with-us/Application-Process/Online-Applications', verification: 'reported',
      source_url: 'https://www.ump.ac.za/Study-with-us/Application-Process/Online-Applications' }),
  c({ id: 'cut-enquiries', university_id: 'cut', label: 'Enquiries',
      email: null, phone: '+27 51 507 3911', url: 'https://www.cut.ac.za/application-process/', verification: 'unverified',
      note: 'No admissions email was found. CUT directs enquiries through its online helpdesk (askcut.cut.ac.za).',
      source_url: 'https://www.cut.ac.za/application-process/' }),
  c({ id: 'cput-info', university_id: 'cput', kind: 'call_centre', label: 'Call Centre',
      email: 'info@cput.ac.za', phone: '+27 21 959 6767', url: 'https://www.cput.ac.za/study/apply', verification: 'reported',
      note: 'admissions@cput.ac.za is for changing personal details on an existing application, not for general questions.',
      source_url: 'https://www.cput.ac.za/study/apply/step-5-follow-up-and-get-your-admission-status' }),
  c({ id: 'dut-info', university_id: 'dut', label: 'General enquiries',
      email: 'info@dut.ac.za', phone: '031 373 5005', url: 'https://www.dut.ac.za/wp-content/uploads/2026/06/How-to-Apply-2027.pdf', verification: 'reported',
      note: 'DUT’s how-to-apply guide is a PDF; no HTML application page was found. First-time applicants apply through the CAO.',
      source_url: 'https://www.dut.ac.za/wp-content/uploads/2026/06/How-to-Apply-2027.pdf' }),
  c({ id: 'tut-contact', university_id: 'tut', kind: 'call_centre', label: 'Contact Centre',
      email: 'general@tut.ac.za', phone: '086 110 2421', url: null, verification: 'reported',
      note: 'A general contact-centre address. A 2024 fees document lists admission@tut.ac.za / 012 382 5750 / 5780, so ask which is current. TUT says it "will never charge any prospective student money for making enquiries" and asks you to report scams on its ethics hotline, 0800 006 924. We could not confirm a single TUT application page.',
      source_url: 'https://www.tut.ac.za/about/contact-us/' }),
  c({ id: 'mut-info', university_id: 'mut', label: 'General enquiries',
      email: 'info@mut.ac.za', phone: '031 819 9280', url: 'https://www.mut.ac.za/prospective-students/apply/', verification: 'reported',
      note: 'Applications are through the CAO only.',
      source_url: 'https://www.mut.ac.za/prospective-students/study-at-mut/contacting-mut/' }),
  c({ id: 'vut-enquiries', university_id: 'vut', label: 'Student enquiries',
      email: 'studentenquiries@vut.ac.za', phone: '0861 861 888', url: 'https://vut.ac.za/how-to-apply/', verification: 'reported',
      note: 'VUT’s how-to-apply page prints the number as "0861 681 888", which is probably a typo; 0861 861 888 is used here. Its closing date is also shown differently on two VUT pages (see the dates page).',
      source_url: 'https://vut.ac.za/contact-us/' }),
  c({ id: 'unizulu-admissions', university_id: 'unizulu', label: 'Admissions',
      email: 'admissions@unizulu.ac.za', phone: '035 902 6715', url: 'https://www.unizulu.ac.za/office-of-the-registrar/admissions/', verification: 'reported',
      note: 'First-time applicants apply through the CAO.', source_url: 'https://www.unizulu.ac.za/office-of-the-registrar/admissions/' }),
  c({ id: 'unisa-study', university_id: 'unisa', label: 'Study information',
      email: 'study-info@unisa.ac.za', phone: '0800 00 1870', url: null, verification: 'reported',
      note: 'General email: enquire@unisa.ac.za. UNISA’s site refers to www.unisa.ac.za/apply but we could not confirm a single application page.',
      source_url: 'https://www.unisa.ac.za/sites/corporate/default/Contact-us/Student-enquiries' }),
  c({ id: 'smu-apply', university_id: 'smu', label: 'Applications',
      email: 'apply@smu.ac.za', phone: '012 521 4204', url: 'https://www.smu.ac.za/students/apply/online-application/', verification: 'reported',
      note: 'General enquiries: enquiries@smu.ac.za.', source_url: 'https://www.smu.ac.za/application-enquiries/' }),
];

// What students can ask about, and which contact kinds best answer each.
export const ASK_TOPICS = [
  { id: 'applying',       emoji: '📝', label: 'How and when to apply', hint: 'Deadlines, the application form, fees, my application status' },
  { id: 'requirements',   emoji: '🎯', label: 'Will my marks and subjects get me in?', hint: 'Entry requirements for a specific degree' },
  { id: 'nbt',            emoji: '✍️', label: 'The NBT', hint: 'Whether I must write it, and when' },
  { id: 'money',          emoji: '💰', label: 'Money: financial aid and bursaries', hint: 'NSFAS, university financial aid, fees' },
  { id: 'subject-advice', emoji: '🧠', label: 'Choosing my school subjects', hint: 'What to take in Grade 10 to keep doors open' },
  { id: 'international',  emoji: '🌍', label: 'I am an international student', hint: 'Applying from outside South Africa' },
  { id: 'health',         emoji: '⚕️', label: 'Health sciences (medicine, nursing, therapy...)', hint: 'These often have their own office and earlier deadlines' },
];

export const VERIFICATION_LABELS = {
  verified:   'Checked on an official page',
  reported:   'From our research - not re-checked yet',
  unverified: 'Could not be confirmed',
};
