import { lvl, pct, engLvl, engPct, anyOf, manual, flag } from './_helpers.mjs';

// UJ, UWC, Rhodes, NWU, UFS, Univen, WSU, UFH, TUT, VUT, DUT and CPUT - the partially
// covered universities. Each block carries its own caveat, because each was blocked or
// limited in a different way - see the per-block comments and research-log.mjs.

// =====================================================================
// University of Johannesburg - APS excludes Life Orientation.
// CAVEAT: these figures come from official UJ programme pages, but the text was
// captured from search-engine indexes of those pages; full-page fetches returned only
// the navigation menu and the 2027 prospectus PDF could not be fetched. Every row is
// flagged [partially-verified]. Rows whose exact programme-page URL was not captured
// were left out entirely rather than cited to a generic listing page - they are in
// research_log instead.
// =====================================================================
const ujBase = {
  university_id: 'uj',
  scoring_system: 'UJ_APS_exLO',
  score_type: 'minimum',
  intake_year: null,
  document_date: null,
};
const UJ_CAVEAT = 'This figure was read from the search-engine index of the official UJ programme page rather than from the full page, and UJ’s 2027 prospectus PDF could not be fetched. Confirm it on the UJ page before you rely on it.';

const ujEng = (id, career_id, name, url) => ({
  ...ujBase, id, career_id, name, faculty: 'Engineering & the Built Environment',
  duration_years: 4, min_aps: 32, source_url: url,
  subject_requirements: [engLvl(5, 5), anyOf(lvl('Mathematics', 5), lvl('Technical Mathematics', 5)), lvl('Physical Sciences', 5)],
  notes: flag('partially-verified', 'Captured from the UJ BEng Civil Engineering page; UJ lists the same requirements on the matching Electrical & Electronic and Mechanical Engineering pages. ' + UJ_CAVEAT),
});

const ujPrograms = [
  ujEng('uj-beng-civil', 'civil-engineer', 'BEng Civil Engineering', 'https://www.uj.ac.za/university-courses/beng-in-civil-engineering/'),
  ujEng('uj-beng-electrical', 'electrical-engineer', 'BEng Electrical & Electronic Engineering', 'https://www.uj.ac.za/university-courses/beng-in-civil-engineering/'),
  ujEng('uj-beng-mechanical', 'mechanical-engineer', 'BEng Mechanical Engineering', 'https://www.uj.ac.za/university-courses/beng-in-civil-engineering/'),

  { ...ujBase, id: 'uj-bsc-compsci', career_id: 'software-engineer', name: 'BSc Computer Science & Informatics',
    faculty: 'Science', duration_years: 3, min_aps: 30,
    source_url: 'https://www.uj.ac.za/university-courses/bsc-in-computer-science-and-informatics/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6)],
    notes: flag('partially-verified', UJ_CAVEAT + ' UJ also lists an Artificial Intelligence specialisation at APS 34 with Mathematics at level 7, but we could not capture that specialisation’s own programme page URL, so we are not showing it as a separate verified entry.') },

  { ...ujBase, id: 'uj-nursing', career_id: 'nurse', name: 'Bachelor of Nursing',
    faculty: 'Health Sciences', duration_years: 4, min_aps: 30,
    source_url: 'https://www.uj.ac.za/university-courses/bachelor-of-nursing/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4), lvl('Physical Sciences', 4), lvl('Life Sciences', 4),
      manual('Interview', 'An interview is required.')],
    notes: flag('partially-verified', UJ_CAVEAT) },

  { ...ujBase, id: 'uj-llb', career_id: 'lawyer', name: 'LLB', faculty: 'Law', duration_years: 4, min_aps: 31,
    source_url: 'https://www.uj.ac.za/university-courses/llb-in-law/',
    subject_requirements: [engLvl(5, 5), manual('Additional language', 'An additional language at level 4.'),
      anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 4))],
    notes: flag('partially-verified', 'APS 31 applies if you take Mathematics; APS 32 is required if you take Mathematical Literacy. ' + UJ_CAVEAT) },

  { ...ujBase, id: 'uj-baccounting', career_id: 'chartered-accountant', name: 'Bachelor of Accounting (CA stream)',
    faculty: 'Economic & Financial Sciences', duration_years: 3, min_aps: 33,
    source_url: 'https://www.uj.ac.za/university-courses/bachelor-of-accounting-ca-stream/',
    subject_requirements: [engLvl(4, 4), lvl('Mathematics', 5)],
    notes: flag('partially-verified', UJ_CAVEAT) },

  { ...ujBase, id: 'uj-ba', career_id: 'humanities-generalist', name: 'Bachelor of Arts',
    faculty: 'Humanities', duration_years: null, min_aps: 27,
    source_url: 'https://www.uj.ac.za/university-courses/bachelor-of-arts/',
    subject_requirements: [engLvl(5, 5)],
    notes: flag('partially-verified', 'UJ does not state a duration on this page. ' + UJ_CAVEAT) },
];

// =====================================================================
// University of the Western Cape - weighted points (out of 65).
// The scoring rule is read from UWC's own official APS calculator (see
// src/scoring-audit.js), so the calculator computes it. What we could NOT read is the
// per-subject minimums for each programme - those pages did not render - so the rows
// stay flagged [unverified] for that reason only.
// =====================================================================
const UWC_POINTS = 'https://www.uwc.ac.za/admission-point-score-calculator/south-african-aps-calculator';
const UWC_CAVEAT = 'UWC counts seven subjects (English, an additional language, Mathematics or Mathematical Literacy, Life Orientation and your three best others) with English and Mathematics weighted most, for a total out of 65. The points total shown is what UWC publishes; its subject-by-subject minimums for this programme could not be read, so check them with UWC. Scoring rule: ' + UWC_POINTS;

const uwcBase = {
  university_id: 'uwc',
  scoring_system: 'UWC_weighted',
  score_type: 'minimum',
  intake_year: null,
  document_date: null,
};

const uwcPrograms = [
  { ...uwcBase, id: 'uwc-llb', career_id: 'lawyer', name: 'LLB (4-year)', faculty: 'Law', duration_years: 4, min_aps: 37,
    source_url: 'https://law.uwc.ac.za/programme/bachelor-of-laws/',
    subject_requirements: [manual('Subject minimums', 'UWC’s per-subject minimums for LLB could not be read - the programme page did not render for our research pass.')],
    notes: flag('unverified', UWC_CAVEAT) },
  { ...uwcBase, id: 'uwc-bcom-law', career_id: 'lawyer', name: 'BCom (Law)', faculty: 'Law', duration_years: null, min_aps: 30,
    source_url: 'https://law.uwc.ac.za/programme/bachelor-of-commerce-in-law/',
    subject_requirements: [manual('Subject minimums', 'UWC’s per-subject minimums for this programme could not be read.')],
    notes: flag('unverified', UWC_CAVEAT) },
];

// =====================================================================
// Rhodes University - points = the sum of percentages for 6 subjects divided by 10,
// excluding Life Orientation. Computable.
// Rhodes publishes two tiers: a Dean's-discretion band and a provisional-offer
// threshold. min_aps holds the PROVISIONAL-OFFER threshold, so that when we say you
// qualify, you actually do. The discretion band is in the notes.
// =====================================================================
const RU_PROSPECTUS = 'https://www.ru.ac.za/media/rhodesuniversity/content/registrar/documents/information/studentrecruitment/RU_READY_Undergraduate_Prospectus_2026_DIGITAL_A5_Landscape_24pp_18Mar2026.pdf';

const ruBase = {
  university_id: 'ru',
  source_url: RU_PROSPECTUS,
  scoring_system: 'RU_pct_div10',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: '2026-03-18',
};
const ruNote = (lo, hi, offer) =>
  `Rhodes points of ${lo}-${hi} are considered at the Dean’s discretion; ${offer} or more receives a provisional offer. We show ${offer} as the qualifying number so that "you qualify" means exactly that - but you are still worth an application from ${lo}. Rhodes has no Engineering and no MBChB. The NBT is recommended, not required.`;

const ruPrograms = [
  { ...ruBase, id: 'ru-bpharm', career_id: 'pharmacist', name: 'BPharm', faculty: 'Pharmacy', duration_years: 4, min_aps: 45,
    subject_requirements: [lvl('Mathematics', 6), lvl('Life Sciences', 6), lvl('Physical Sciences', 6)],
    notes: ruNote(40, 44, 45) + ' At 40-44 points the subject levels required drop to level 5.' },
  { ...ruBase, id: 'ru-llb', career_id: 'lawyer', name: 'LLB', faculty: 'Law', duration_years: 4, min_aps: 45,
    subject_requirements: [engLvl(5, 6), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 5))],
    notes: ruNote(40, 44, 45) },
  { ...ruBase, id: 'ru-bcom', career_id: 'business-manager', name: 'BCom', faculty: 'Commerce', duration_years: 3, min_aps: 40,
    subject_requirements: [engLvl(4, 4), lvl('Mathematics', 4)],
    notes: ruNote(34, 39, 40) },
  { ...ruBase, id: 'ru-bbussc', career_id: 'business-manager', name: 'BBusSc', faculty: 'Commerce', duration_years: null, min_aps: 45,
    subject_requirements: [engLvl(4, 4), lvl('Mathematics', 6)],
    notes: ruNote(38, 44, 45) + ' Rhodes does not state the duration for BBusSc in this document.' },
  { ...ruBase, id: 'ru-bsc', career_id: 'biologist', name: 'BSc', faculty: 'Science', duration_years: 3, min_aps: 45,
    subject_requirements: [engPct(60, 65), lvl('Mathematics', 4), anyOf(lvl('Physical Sciences', 5), lvl('Life Sciences', 5))],
    notes: ruNote(39, 44, 45) },
  { ...ruBase, id: 'ru-bsc-info-systems', career_id: 'information-systems', name: 'BSc Information Systems', faculty: 'Science', duration_years: 3, min_aps: 45,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4), lvl('Physical Sciences', 5)],
    notes: ruNote(40, 44, 45) },
  { ...ruBase, id: 'ru-bed-foundation', career_id: 'teacher', name: 'BEd Foundation Phase', faculty: 'Education', duration_years: 4, min_aps: 44,
    subject_requirements: [engLvl(4, 4), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 4))],
    notes: ruNote(39, 43, 44) },
  { ...ruBase, id: 'ru-ba', career_id: 'humanities-generalist', name: 'BA / BSS', faculty: 'Humanities', duration_years: 3, min_aps: 45,
    subject_requirements: [engPct(60, 65)],
    notes: ruNote(34, 44, 45) },
];

// =====================================================================
// North-West University - only two programme entries verified. NWU's APS formula (six
// best subjects, 8-point scale) is read from NWU's own calculator, so it is computed.
// =====================================================================
const nwuBase = {
  university_id: 'nwu',
  scoring_system: 'NWU_APS',
  score_type: 'minimum',
  intake_year: null,
  document_date: null,
};
const NWU_CAVEAT = 'NWU adds your six best subjects (excluding Life Orientation) on an 8-point scale, for a total out of 48 - read from NWU’s own APS calculator. The requirement shown is what NWU publishes.';

const nwuPrograms = [
  { ...nwuBase, id: 'nwu-beng', career_id: 'civil-engineer', name: 'BEng (all disciplines)', faculty: 'Engineering',
    duration_years: null, min_aps: 34,
    source_url: 'https://engineering.nwu.ac.za/engineering/undergraduate',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 70),
      manual('Language of tuition', 'Your language of tuition at 60%.')],
    notes: flag('unverified', 'The NWU pages carry no intake year and do not state the duration. ' + NWU_CAVEAT + ' Also see https://engineering.nwu.ac.za/engineering/applications') },
  { ...nwuBase, id: 'nwu-bsc', career_id: 'chemist', name: 'BSc (Natural Sciences streams, e.g. Biochemistry & Chemistry)',
    faculty: 'Natural & Agricultural Sciences', duration_years: 3, min_aps: 26,
    source_url: 'https://studies.nwu.ac.za/undergraduate-studies/natural-and-agricultural-sciences-2027',
    subject_requirements: [manual('Subject minimums', 'Per-subject minimums were not captured for this stream.')],
    notes: flag('unverified', NWU_CAVEAT) },
];

// =====================================================================
// University of the Free State - one entry verified.
// =====================================================================
const ufsPrograms = [
  { university_id: 'ufs', id: 'ufs-mbchb', career_id: 'doctor', name: 'MBChB (Medicine)', faculty: 'Health Sciences',
    duration_years: null, min_aps: 36, scoring_system: 'UFS_AP', score_type: 'minimum',
    intake_year: 2027, document_date: null,
    source_url: 'https://www.ufs.ac.za/docs/librariesprovider25/default-document-library/2027-mbchb-selection-rules.pdf?sfvrsn=34af520_0',
    // From the 2027 UFS MBChB selection rules: English, Mathematics, Physical Sciences and
    // Life Sciences are compulsory, each at academic level 5 (60%) or better.
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), lvl('Physical Sciences', 5), lvl('Life Sciences', 5)],
    notes: flag(['selection', 'partially-verified'], 'UFS requires an AP score of at least 36 to qualify for selection, plus level 5 (60%) in each of English, Mathematics, Physical Sciences and Life Sciences - both from the 2027 MBChB selection rules. Selection then goes well beyond marks (the document also awards points for other things). The AP scale is worked from the four compulsory subjects plus your best two, plus 1 point for Life Orientation at 60%+; the scale itself comes from UFS’s 2024 prospectus because the 2027 document refers to the prospectus for it. The duration is not stated in the 2027 document.') },
];

// Rhodes: "Life Orientation is not counted for points, but you're required to obtain at
// least Level 4 (50%) for acceptance" - stated for all faculties in the prospectus.
const ruWithLO = ruPrograms.map((p) => ({
  ...p,
  subject_requirements: [...p.subject_requirements, lvl('Life Orientation', 4)],
  notes: p.notes + ' Life Orientation is not scored, but you need at least 50% in it.',
}));

// =====================================================================
// University of Venda - formula confirmed (best 6-7 subjects excluding LO, minimum
// APS 26), but Univen's own published points table did not clearly match a standard
// NSC level scale when checked, so UNIVEN_APS is registered non-computable for now.
// min_aps below is each programme's own published "NSC XX" figure, shown as reference.
// =====================================================================
const univenBase = {
  university_id: 'univen',
  scoring_system: 'UNIVEN_APS',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: '2026-09-01',
  source_url: 'https://www.univen.ac.za/wp-content/uploads/2026/09/UniVen-2027-Prospectus.pdf',
};
const UNIVEN_CAVEAT = 'From Univen’s 2027 Undergraduate Prospectus. We could not confirm the application closing date from the pages we read (applications opened 1 May 2026) - check the current date on univen.ac.za.';

const univenPrograms = [
  { ...univenBase, id: 'univen-nursing', career_id: 'nurse', name: 'Bachelor of Nursing', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 38,
    subject_requirements: [pct('English', 60), pct('Mathematics', 50), pct('Physical Sciences', 60), pct('Life Sciences', 60)],
    notes: flag('partially-verified', UNIVEN_CAVEAT) },
  { ...univenBase, id: 'univen-bed-senior-fet', career_id: 'teacher', name: 'BEd Senior Phase and FET Teaching', faculty: 'Humanities, Social Sciences and Education',
    duration_years: 4, min_aps: 36,
    subject_requirements: [pct('English', 50),
      manual('Two subjects from one elective group', 'Two of Mathematics/Physical Sciences/Life Sciences at 50%, OR two of Accounting/Business Studies/Economics at 50%, OR two of History/Geography/Sepedi/Tshivenda/Xitsonga at 50% - pick one group.')],
    notes: flag('partially-verified', UNIVEN_CAVEAT) },
  { ...univenBase, id: 'univen-bed-foundation', career_id: 'teacher', name: 'BEd Foundation Phase Teaching', faculty: 'Humanities, Social Sciences and Education',
    duration_years: 4, min_aps: 36,
    subject_requirements: [pct('English', 50), anyOf(pct('Mathematics', 40), pct('Mathematical Literacy', 50)),
      manual('Home language', 'Tshivenda, Sepedi or Xitsonga at 50%.')],
    notes: flag('partially-verified', UNIVEN_CAVEAT) },
  { ...univenBase, id: 'univen-bsc-agriculture', career_id: 'agricultural-scientist', name: 'BSc Agriculture (Agricultural Economics, and related streams)', faculty: 'Science, Engineering and Agriculture',
    duration_years: 4, min_aps: 26,
    subject_requirements: [pct('English', 50), pct('Mathematics', 50), pct('Physical Sciences', 50), anyOf(pct('Life Sciences', 50), pct('Agricultural Sciences', 50))],
    notes: flag('partially-verified', 'Univen offers several sibling streams (Agribusiness Management, Animal Science, Horticultural Sciences, Plant Production, Soil Science, Forestry, Food Science & Technology) at the same APS and subject minimums. ' + UNIVEN_CAVEAT) },
  { ...univenBase, id: 'univen-bcom-accounting-sciences', career_id: 'chartered-accountant', name: 'BCom Accounting Sciences', faculty: 'Management, Commerce and Law',
    duration_years: 4, min_aps: 35,
    subject_requirements: [pct('English', 50), pct('Mathematics', 50)],
    notes: flag('partially-verified', UNIVEN_CAVEAT) },
  { ...univenBase, id: 'univen-bcom-accounting', career_id: 'chartered-accountant', name: 'BCom Accounting', faculty: 'Management, Commerce and Law',
    duration_years: 3, min_aps: 32,
    subject_requirements: [pct('English', 50), anyOf(pct('Accounting', 50), pct('Mathematics', 50))],
    notes: flag('partially-verified', 'A shorter, non-CA-stream accounting degree - compare with the 4-year Accounting Sciences stream above. ' + UNIVEN_CAVEAT) },
  { ...univenBase, id: 'univen-llb', career_id: 'lawyer', name: 'LLB', faculty: 'Management, Commerce and Law (School of Law)',
    duration_years: 4, min_aps: 38,
    subject_requirements: [pct('English', 60)],
    notes: flag('partially-verified', UNIVEN_CAVEAT) },
  { ...univenBase, id: 'univen-social-work', career_id: 'social-worker', name: 'Bachelor of Social Work', faculty: 'Humanities, Social Sciences and Education',
    duration_years: 4, min_aps: 35,
    subject_requirements: [pct('English', 50)],
    notes: flag('partially-verified', UNIVEN_CAVEAT) },
];

// =====================================================================
// Walter Sisulu University - formula confirmed in full (best 6 subjects excluding LO
// on an 8-point scale, 2 language slots + 4 required-subject slots; Education also
// counts LO as a 7th subject) from WSU's own 2027 brochure, but we have not yet built
// and tested that two-category selection logic, so WSU_APS is non-computable for now.
// =====================================================================
const wsuBase = {
  university_id: 'wsu',
  scoring_system: 'WSU_APS',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: '2026-05-27',
  source_url: 'https://wsu.ac.za/media/attachments/2026/05/27/2027-information-brochure-admission-requirements.pdf',
};
const WSU_CAVEAT = 'From WSU’s 2027 Undergraduate Information Brochure & Admission Requirements. We could not confirm the application closing date from the pages we read - check the current date on wsu.ac.za.';

const wsuPrograms = [
  { ...wsuBase, id: 'wsu-accounting', career_id: 'chartered-accountant', name: 'Bachelor of Accounting', faculty: 'Economic & Financial Sciences',
    duration_years: 3, min_aps: 25,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4)],
    notes: flag('partially-verified', WSU_CAVEAT) },
  { ...wsuBase, id: 'wsu-bed-foundation', career_id: 'teacher', name: 'BEd Foundation Phase Teaching', faculty: 'Education',
    duration_years: 4, min_aps: 24,
    subject_requirements: [lvl('Life Orientation', 5), manual('Home language', 'isiXhosa (Home Language) at level 4.'), lvl('English', 4),
      anyOf(lvl('Mathematics', 2), lvl('Mathematical Literacy', 4)),
      manual('Two more subjects', 'Any other two subjects totalling at least 8 points on WSU’s scale.')],
    notes: flag('partially-verified', 'WSU counts Life Orientation as a required teaching subject for Education programmes, unlike most of its other degrees. ' + WSU_CAVEAT) },
  { ...wsuBase, id: 'wsu-nursing', career_id: 'nurse', name: 'Bachelor of Nursing', faculty: 'Medicine & Health Sciences',
    duration_years: 4, min_aps: 24,
    subject_requirements: [lvl('English', 4), manual('African language', 'Another African language at level 4.'),
      lvl('Mathematics', 4), lvl('Physical Sciences', 4), lvl('Life Sciences', 4),
      manual('Additional selection criteria', 'Further faculty-specific selection criteria apply beyond these subject minimums.')],
    notes: flag('partially-verified', WSU_CAVEAT) },
  { ...wsuBase, id: 'wsu-bsc-pest-management', career_id: 'agricultural-scientist', name: 'BSc Pest Management', faculty: 'Natural Sciences',
    duration_years: 3, min_aps: 25,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4), lvl('Life Sciences', 4)],
    notes: flag('partially-verified', 'WSU has no Agriculture faculty; this is its closest applied-science equivalent. ' + WSU_CAVEAT) },
  { ...wsuBase, id: 'wsu-bcom', career_id: 'business-manager', name: 'Bachelor of Commerce', faculty: 'Economic & Financial Sciences',
    duration_years: 3, min_aps: 25,
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 5))],
    notes: flag('partially-verified', WSU_CAVEAT) },
  { ...wsuBase, id: 'wsu-llb', career_id: 'lawyer', name: 'Bachelor of Laws (LLB)', faculty: 'Law, Humanities & Social Sciences',
    duration_years: 4, min_aps: 26,
    subject_requirements: [lvl('English', 5), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 4))],
    notes: flag('partially-verified', WSU_CAVEAT) },
  { ...wsuBase, id: 'wsu-social-work', career_id: 'social-worker', name: 'Bachelor of Social Work', faculty: 'Law, Humanities & Social Sciences',
    duration_years: 4, min_aps: 26,
    subject_requirements: [lvl('English', 4), manual('African language', 'Another African language at level 5.'), lvl('Life Sciences', 4),
      manual('Three more subjects', 'Any other three subjects at level 4 or better, excluding Life Orientation.'),
      manual('Character reference check', 'WSU conducts a character reference check for all admitted students; a negative result may lead to deregistration.')],
    notes: flag('partially-verified', WSU_CAVEAT) },
  { ...wsuBase, id: 'wsu-mbchb', career_id: 'doctor', name: 'Bachelor of Medicine and Bachelor of Surgery (MBChB)', faculty: 'Medicine & Health Sciences',
    duration_years: 6, min_aps: 30,
    subject_requirements: [lvl('English', 5), manual('African language', 'Another African language at level 5.'),
      lvl('Mathematics', 5), lvl('Physical Sciences', 5), lvl('Life Sciences', 5),
      manual('One more subject', 'Any other subject at level 5 or better, excluding Life Orientation.')],
    notes: flag('partially-verified', WSU_CAVEAT) },
];

// =====================================================================
// University of Fort Hare - general APS statement and an on-page calculator confirmed,
// but no programme page we checked states its own numeric APS minimum, so min_aps is
// null throughout (UFH_APS is registered non-computable - there is nothing published
// yet for it to compute against). Subject-level requirements are fully captured.
// =====================================================================
const ufhBase = {
  university_id: 'ufh',
  scoring_system: 'UFH_APS',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: null,
};
const UFH_CAVEAT = 'UFH does not state a numeric APS minimum on this programme’s own page, only subject-level requirements. 2027 undergraduate applications: opened 1 May 2026, close 31 October 2026 (from ufh.ac.za/admission).';

const ufhPrograms = [
  { ...ufhBase, id: 'ufh-nursing', career_id: 'nurse', name: 'Bachelor of Nursing', faculty: 'Health Sciences',
    duration_years: 4, min_aps: null,
    source_url: 'https://www.ufh.ac.za/course/bachelor-of-nursing',
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 5)),
      lvl('Physical Sciences', 4), lvl('Life Sciences', 4),
      manual('Two more subjects', 'Any other two subjects at level 4 or better.'), lvl('Life Orientation', 4)],
    notes: flag('partially-verified', UFH_CAVEAT) },
  { ...ufhBase, id: 'ufh-bed-foundation', career_id: 'teacher', name: 'BEd Foundation Phase Teaching', faculty: 'Education',
    duration_years: 4, min_aps: null,
    source_url: 'https://www.ufh.ac.za/course/bachelor-of-education-in-foundation-phase-teaching',
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 5)),
      manual('Home language', 'isiXhosa or Afrikaans (Home Language or First Additional Language) at level 4.')],
    notes: flag('partially-verified', UFH_CAVEAT) },
  { ...ufhBase, id: 'ufh-bsc-agriculture', career_id: 'agricultural-scientist', name: 'BSc Agriculture in Animal Production', faculty: 'Science and Agriculture',
    duration_years: 4, min_aps: null,
    source_url: 'https://www.ufh.ac.za/course/bachelor-of-science-in-agriculture-in-animal-production',
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4),
      anyOf(lvl('Life Sciences', 4), lvl('Geography', 4), lvl('Agricultural Sciences', 4), lvl('Information Technology', 4)),
      manual('Two more subjects', 'Any other two subjects at level 4 or better.'), lvl('Life Orientation', 4)],
    notes: flag('partially-verified', UFH_CAVEAT) },
  { ...ufhBase, id: 'ufh-bcom-accounting', career_id: 'chartered-accountant', name: 'BCom Accounting', faculty: 'Management and Commerce',
    duration_years: 3, min_aps: null,
    source_url: 'https://www.ufh.ac.za/course/bachelor-of-commerce-in-accounting',
    subject_requirements: [lvl('English', 5), lvl('Mathematics', 5),
      manual('Four more subjects', 'Two further subjects at level 4 and two at level 5 or better.'), lvl('Life Orientation', 4)],
    notes: flag('partially-verified', 'SAICA-accredited. ' + UFH_CAVEAT) },
  { ...ufhBase, id: 'ufh-bcom', career_id: 'business-manager', name: 'Bachelor of Commerce', faculty: 'Management and Commerce',
    duration_years: 3, min_aps: null,
    source_url: 'https://www.ufh.ac.za/course/bachelor-of-commerce',
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4),
      manual('Four more subjects', 'Four further subjects at level 4 or better.'), lvl('Life Orientation', 4)],
    notes: flag('partially-verified', UFH_CAVEAT) },
  { ...ufhBase, id: 'ufh-llb', career_id: 'lawyer', name: 'Bachelor of Laws (LLB)', faculty: 'Law',
    duration_years: 4, min_aps: null,
    source_url: 'https://www.ufh.ac.za/course/bachelor-of-laws',
    subject_requirements: [lvl('English', 4),
      manual('Mathematics, Mathematical Literacy or Technical Mathematics', 'A minimum level in one of these three - UFH’s page listed three different level numbers against these three options without making clear which applies to which, so we show this as a note rather than guess which.'),
      manual('Four more subjects', 'Four further subjects at level 4 or better.'), lvl('Life Orientation', 4)],
    notes: flag(['partially-verified', 'unverified'], UFH_CAVEAT) },
  { ...ufhBase, id: 'ufh-social-work', career_id: 'social-worker', name: 'Bachelor of Social Work', faculty: 'Social Sciences and Humanities',
    duration_years: 4, min_aps: null,
    source_url: 'https://www.ufh.ac.za/course/bachelor-of-social-work',
    subject_requirements: [lvl('English', 4), manual('Another language', 'Another language at level 4.'),
      manual('Four more subjects', 'One further subject at level 3 and three at level 4 or better.'), lvl('Life Orientation', 4)],
    notes: flag('partially-verified', UFH_CAVEAT) },
];

// =====================================================================
// Tshwane University of Technology - strong coverage, two official PDFs read in full.
// Formula confirmed (best 6 excl. LO, and a levelled-1 subject is also dropped) but that
// second nuance is not yet implemented, so TUT_APS is registered non-computable for now.
// =====================================================================
const tutBase = {
  university_id: 'tut',
  scoring_system: 'TUT_APS',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: '2026-04-01',
  source_url: 'https://www.tut.ac.za/media/tshwane-interim/site-content/documents/First-Year-Course_Information.pdf',
};
const TUT_CAVEAT = 'From TUT’s 2027 First-Year Course Information and General Information PDFs. Applications opened 1 April 2026 (fee R240).';

const tutPrograms = [
  { ...tutBase, id: 'tut-dip-civil', career_id: 'civil-engineer', name: 'Diploma in Civil Engineering', faculty: 'Engineering & the Built Environment',
    duration_years: 3, min_aps: 26,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4), manual('Engineering Graphics & Design', 'Recommended, not compulsory.')],
    notes: flag('partially-verified', 'Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-electrical', career_id: 'electrical-engineer', name: 'Diploma in Electrical Engineering', faculty: 'Engineering & the Built Environment',
    duration_years: 3, min_aps: 26,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4), manual('Electrical Technology', 'Recommended, not compulsory.')],
    notes: flag('partially-verified', 'Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-bengtech-mechanical', career_id: 'mechanical-engineer', name: 'BEngTech Mechanical Engineering', faculty: 'Engineering & the Built Environment',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 5), lvl('Physical Sciences', 5), manual('Engineering Graphics & Design, Mechanical Technology', 'Recommended, not compulsory.')],
    notes: flag('partially-verified', 'Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-compsci', career_id: 'software-engineer', name: 'Diploma in Computer Science', faculty: 'Information & Communication Technology',
    duration_years: 3, min_aps: 26,
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 5), lvl('Mathematical Literacy', 7))],
    notes: flag('partially-verified', 'APS 26 on the Mathematics route, 28 on the Mathematical Literacy route. Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-accounting', career_id: 'chartered-accountant', name: 'Diploma in Accounting', faculty: 'Management Sciences',
    duration_years: 3, min_aps: 22,
    subject_requirements: [lvl('English', 4), manual('Accounting, Mathematics or Mathematical Literacy', 'Accounting at level 3, or Mathematics/Technical Mathematics at level 3, or Mathematical Literacy at level 5.')],
    notes: flag('partially-verified', 'APS 22 on the Accounting/Maths route, 24 on the Mathematical Literacy route. Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-bed-foundation', career_id: 'teacher', name: 'BEd Foundation Phase Teaching', faculty: 'Humanities',
    duration_years: 4, min_aps: 25,
    subject_requirements: [lvl('English', 5), manual('Home/First Additional Language', 'Your other official language at level 4 or 5 depending on which is Home Language.'), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 5))],
    notes: flag('partially-verified', 'Closes earlier than most TUT programmes - 31 July 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-nursing', career_id: 'nurse', name: 'Bachelor of Nursing', faculty: 'Science',
    duration_years: 4, min_aps: 27,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Life Sciences', 4)],
    notes: flag('partially-verified', 'Closes earlier than most TUT programmes - 15 June 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-hospitality', career_id: 'hospitality-manager', name: 'Diploma in Hospitality Management', faculty: 'Tourism & Hospitality Management',
    duration_years: 3, min_aps: 24,
    subject_requirements: [lvl('English', 3), manual('Mathematics, Technical Mathematics or Mathematical Literacy', 'Any one of these three at level 3.')],
    notes: flag('partially-verified', 'Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-bengtech-chemical', career_id: 'chemical-engineer', name: 'BEngTech Chemical Engineering', faculty: 'Engineering & the Built Environment',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 5), lvl('Technical Mathematics', 5)), anyOf(lvl('Physical Sciences', 5), lvl('Technical Sciences', 5))],
    notes: flag('partially-verified', 'Recommended: Engineering Graphics & Design, Mechanical Technology. Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-bengtech-industrial', career_id: 'industrial-engineer', name: 'BEngTech Industrial Engineering', faculty: 'Engineering & the Built Environment',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 5), lvl('Technical Mathematics', 5)), anyOf(lvl('Physical Sciences', 5), lvl('Technical Sciences', 5))],
    notes: flag('partially-verified', 'Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-informatics', career_id: 'information-systems', name: 'Diploma in Informatics', faculty: 'Information & Communication Technology',
    duration_years: 3, min_aps: 26,
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 5), lvl('Technical Mathematics', 5), lvl('Mathematical Literacy', 7))],
    notes: flag('partially-verified', 'APS 26 on the Mathematics route, 28 on the Mathematical Literacy route. Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-it', career_id: 'software-engineer', name: 'Diploma in Information Technology', faculty: 'Information & Communication Technology',
    duration_years: 3, min_aps: 26,
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 5), lvl('Technical Mathematics', 5), lvl('Mathematical Literacy', 7)), lvl('Physical Sciences', 3)],
    notes: flag('partially-verified', 'APS 26 on the Mathematics route, 28 on the Mathematical Literacy route. Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-supply-chain', career_id: 'industrial-engineer', name: 'Diploma in Supply Chain Management', faculty: 'Management Sciences',
    duration_years: 3, min_aps: 24,
    subject_requirements: [lvl('English', 4), manual('Mathematics, Technical Mathematics or Mathematical Literacy', 'Any one of these three at level 3.')],
    notes: flag('partially-verified', 'Recommended: commercial subjects. Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-marketing', career_id: 'business-manager', name: 'Diploma in Marketing', faculty: 'Management Sciences',
    duration_years: 3, min_aps: 24,
    subject_requirements: [lvl('English', 4), manual('Mathematics, Technical Mathematics or Mathematical Literacy', 'Any one of these three at level 3.')],
    notes: flag('partially-verified', 'Recommended: Accounting, Business Studies, Economics. Closes 30 September 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-bsc-industrial-chemistry', career_id: 'chemist', name: 'BSc Industrial Chemistry', faculty: 'Science',
    duration_years: 4, min_aps: 24,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 5), lvl('Physical Sciences', 5)],
    notes: flag('partially-verified', 'Mathematical Literacy is not accepted. Closes 31 July 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-nature-conservation', career_id: 'environmental-scientist', name: 'Diploma in Nature Conservation', faculty: 'Science',
    duration_years: 3, min_aps: 24,
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 4))],
    notes: flag('partially-verified', 'APS 24 on the Mathematics route, 25 on the Mathematical Literacy route. Recommended: Agricultural Sciences, Geography, Life/Physical/Technical Sciences. Closes 31 July 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-comm-design', career_id: 'digital-artist', name: 'Diploma in Integrated Communication Design', faculty: 'Arts & Design',
    duration_years: 3, min_aps: 24,
    subject_requirements: [lvl('English', 4)],
    notes: flag('partially-verified', 'The only compulsory subject TUT states is English - a portfolio or similar creative requirement is likely but not confirmed on the page we read. Closes 31 July 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-public-affairs', career_id: 'business-manager', name: 'Diploma in Public Affairs (Administration of State)', faculty: 'Humanities',
    duration_years: 3, min_aps: 20,
    subject_requirements: [lvl('English', 3), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 3))],
    notes: flag('partially-verified', 'Public-sector administration specifically (careers include clerk and public official/manager) - there is no dedicated public administration career on Studypath yet, so this is filed under the closest existing category. Closes 31 July 2026. ' + TUT_CAVEAT) },
  { ...tutBase, id: 'tut-dip-crop-production', career_id: 'agricultural-scientist', name: 'Diploma in Crop Production', faculty: 'Science (Agricultural Sciences)',
    duration_years: 3, min_aps: 19,
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 4))],
    notes: flag('partially-verified', 'APS 19 on the Mathematics route, 20 on the Mathematical Literacy route. Recommended: agricultural subjects, Life/Physical Sciences. Closes 31 July 2026. ' + TUT_CAVEAT) },
];

// =====================================================================
// Vaal University of Technology - one official 2027 PDF read in full. Formula
// confirmed (best 6 excl. LO), but several programmes layer their own additional
// selection rules on top, so VUT_APS is registered non-computable for now.
// =====================================================================
const vutBase = {
  university_id: 'vut',
  scoring_system: 'VUT_APS',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: '2026-03-01',
  source_url: 'https://vut.ac.za/wp-content/uploads/2026/03/2027-Undergraduate-Minimum-Admission-Requirements.pdf',
};
const VUT_CAVEAT = 'From VUT’s 2027 Undergraduate Minimum Admission Requirements PDF. Academic applications close 30 September 2026 (residences 31 October 2026); fee R110.';

const vutPrograms = [
  { ...vutBase, id: 'vut-dip-it', career_id: 'information-systems', name: 'Diploma in Information Technology', faculty: 'Applied & Computer Sciences',
    duration_years: 3, min_aps: 26,
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 6))],
    notes: flag('partially-verified', 'APS 26 on the Mathematics route, 28 on the Mathematical Literacy route. ' + VUT_CAVEAT) },
  { ...vutBase, id: 'vut-dip-civil', career_id: 'civil-engineer', name: 'Diploma in Civil Engineering', faculty: 'Engineering & Technology',
    duration_years: null, min_aps: 24,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag('partially-verified', 'The same APS and subject minimums apply across VUT’s mainstream Chemical, Civil, Industrial, Mechanical, Metallurgical, Electronic, Power, Process Control and Computer Systems Engineering diplomas. ' + VUT_CAVEAT) },
  { ...vutBase, id: 'vut-dip-electrical', career_id: 'electrical-engineer', name: 'Diploma in Electrical Engineering', faculty: 'Engineering & Technology',
    duration_years: null, min_aps: 24,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag('partially-verified', VUT_CAVEAT) },
  { ...vutBase, id: 'vut-dip-mechanical', career_id: 'mechanical-engineer', name: 'Diploma in Mechanical Engineering', faculty: 'Engineering & Technology',
    duration_years: null, min_aps: 24,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag('partially-verified', VUT_CAVEAT) },
  { ...vutBase, id: 'vut-dip-operations', career_id: 'industrial-engineer', name: 'Diploma in Operations Management', faculty: 'Management Sciences',
    duration_years: null, min_aps: 23,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 3)],
    notes: flag('partially-verified', VUT_CAVEAT) },
  { ...vutBase, id: 'vut-bhsc-medlab', career_id: 'biologist', name: 'Bachelor of Health Sciences: Medical Laboratory Science', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 27,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4), lvl('Life Sciences', 5)],
    notes: flag('partially-verified', 'Medical laboratory (diagnostic) science specifically, not general biology research - filed under the closest existing career category. We could not confirm whether VUT offers a separate Nursing qualification. ' + VUT_CAVEAT) },
  { ...vutBase, id: 'vut-bed-senior-fet', career_id: 'teacher', name: 'BEd Senior Phase & FET Teaching', faculty: 'Human Sciences',
    duration_years: null, min_aps: 22,
    subject_requirements: [manual('Language of Teaching & Learning', 'At level 4.'), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 6)), lvl('Physical Sciences', 3)],
    notes: flag('partially-verified', 'APS 22 on the Mathematics route, 24 on the Mathematical Literacy route. ' + VUT_CAVEAT) },
  { ...vutBase, id: 'vut-dip-accounting', career_id: 'chartered-accountant', name: 'Diploma in Accounting (Financial Information Systems / Cost & Management Accounting / Internal Auditing)', faculty: 'Accountancy',
    duration_years: null, min_aps: 20,
    subject_requirements: [lvl('Accounting', 4), lvl('English', 4), manual('Mathematics or Mathematical Literacy', 'Mathematics/Technical Mathematics at level 3, or Mathematical Literacy at level 5 or 6 depending on the stream.')],
    notes: flag('partially-verified', 'APS 20 on the Mathematics route, 22-23 on the Mathematical Literacy route (varies by stream). ' + VUT_CAVEAT) },
  { ...vutBase, id: 'vut-dip-hospitality', career_id: 'hospitality-manager', name: 'Diploma in Hospitality Management (Food Service Management)', faculty: 'Human Sciences',
    duration_years: null, min_aps: 20,
    subject_requirements: [lvl('English', 4), manual('Hospitality-related subject', 'One of Hospitality Studies, Hotel Keeping, Tourism, Catering, Accounting, Business Studies or Consumer Studies at level 4.'), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 4))],
    notes: flag('partially-verified', 'VUT also requires chef uniforms as a practical condition of enrolment. APS 20 on the Mathematics route, 21 on the Mathematical Literacy route. ' + VUT_CAVEAT) },
];

// =====================================================================
// Durban University of Technology - two official PDFs read in full. Formula
// confirmed (best 6 excl. LO), but several programmes layer their own additional
// selection rules on top (e.g. a combined Maths + Physical Science threshold), so
// DUT_APS is registered non-computable for now. Applications go through the CAO.
// =====================================================================
const dutBase = {
  university_id: 'dut',
  scoring_system: 'DUT_APS',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: '2026-06-01',
  source_url: 'https://www.dut.ac.za/wp-content/uploads/2026/06/Study-Opportunities-2027.pdf',
};
const DUT_CAVEAT = 'From DUT’s 2027 Study Opportunities prospectus. Applications go through the CAO (cao.ac.za), not directly to DUT; general closing date 30 September 2026 (fee R250 SA / R300 international).';

const dutPrograms = [
  { ...dutBase, id: 'dut-bengtech-civil', career_id: 'civil-engineer', name: 'BEngTech Civil Engineering', faculty: 'Engineering & the Built Environment',
    duration_years: 3, min_aps: null,
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 4), lvl('Technical Mathematics', 5)), anyOf(lvl('Physical Sciences', 4), lvl('Technical Sciences', 5)),
      manual('Combined Maths + Physical Science', 'DUT also requires your Mathematics and Physical Science percentages to add up to at least 120%.')],
    notes: flag(['partially-verified', 'no-cutoff-published'], 'DUT did not state a single APS number for this programme - the combined-subjects rule above is its real selection mechanism. Closes 30 September 2026. ' + DUT_CAVEAT) },
  { ...dutBase, id: 'dut-bengtech-electronic', career_id: 'electrical-engineer', name: 'BEngTech Electronic Engineering', faculty: 'Engineering & the Built Environment',
    duration_years: 3, min_aps: null,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4),
      manual('Combined Maths + Physical Science', 'DUT also requires your Mathematics and Physical Science percentages to add up to at least 100%.')],
    notes: flag(['partially-verified', 'no-cutoff-published'], 'DUT did not state a single APS number for this programme. Closes 30 September 2026. ' + DUT_CAVEAT) },
  { ...dutBase, id: 'dut-bengtech-mechanical', career_id: 'mechanical-engineer', name: 'BEngTech Mechanical Engineering', faculty: 'Engineering & the Built Environment',
    duration_years: 3, min_aps: null,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4),
      manual('Combined Maths + Physical Science', 'DUT also requires your Mathematics and Physical Science percentages to add up to at least 100%.')],
    notes: flag(['partially-verified', 'no-cutoff-published'], 'DUT did not state a single APS number for this programme. Closes 30 September 2026. ' + DUT_CAVEAT) },
  { ...dutBase, id: 'dut-dip-ict', career_id: 'software-engineer', name: 'Diploma in ICT: Applications Development', faculty: 'Accounting & Informatics',
    duration_years: 3, min_aps: null,
    subject_requirements: [lvl('English', 3), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 6)),
      manual('Two more subjects', 'Two further 20-credit NSC subjects.')],
    notes: flag(['partially-verified', 'no-cutoff-published'], 'A 4-year Extended Curriculum Programme route is also available. DUT did not state a single APS number on this page. Closes 30 September 2026. ' + DUT_CAVEAT) },
  { ...dutBase, id: 'dut-dip-accounting', career_id: 'chartered-accountant', name: 'Diploma in Accounting', faculty: 'Accounting & Informatics',
    duration_years: 3, min_aps: null,
    subject_requirements: [lvl('English', 3), anyOf(lvl('Mathematics', 4), lvl('Accounting', 4))],
    notes: flag(['partially-verified', 'no-cutoff-published'], 'A 4-year Extended Curriculum Programme route is also available. DUT did not state a single APS number on this page. Closes 30 September 2026. ' + DUT_CAVEAT) },
  { ...dutBase, id: 'dut-nursing', career_id: 'nurse', name: 'Bachelor of Nursing', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 28,
    subject_requirements: [lvl('English', 3), lvl('Life Sciences', 4), manual('Mathematics, Mathematical Literacy or Physical Science', 'Mathematics at level 4, or Mathematical Literacy at level 6, or Physical Science at level 4.'),
      manual('Two more subjects', 'Two further 20-credit NSC subjects.')],
    notes: flag('partially-verified', 'A 5-year Extended Curriculum Programme route is also available. Several other DUT Health Sciences programmes (Chiropractic, Clinical Technology, Emergency Medical Care, Radiography, Dental Assisting) close much earlier - 15 June or 31 August 2026 - not the standard 30 September date. Closes 30 September 2026 for Nursing. ' + DUT_CAVEAT) },
  { ...dutBase, id: 'dut-bed-senior-fet', career_id: 'teacher', name: 'BEd Senior Phase & FET Teaching', faculty: 'Arts & Design',
    duration_years: 4, min_aps: 28,
    subject_requirements: [lvl('English', 4), manual('Specialisation subjects', 'Subject requirements vary by teaching specialisation, including Technology (Civil/Electrical/Mechanical) - see DUT’s prospectus for the one you want.')],
    notes: flag('partially-verified', 'Closes 30 September 2026. ' + DUT_CAVEAT) },
  { ...dutBase, id: 'dut-dip-hospitality', career_id: 'hospitality-manager', name: 'Diploma in Hospitality Management', faculty: 'Arts & Design',
    duration_years: 3, min_aps: null,
    subject_requirements: [lvl('English', 4), manual('Mathematics, Mathematical Literacy or Accounting', 'Mathematics at level 2, or Mathematical Literacy at level 3, or Accounting at level 3.')],
    notes: flag(['partially-verified', 'no-cutoff-published'], 'DUT did not state a single APS number on this page. Closes 30 September 2026. ' + DUT_CAVEAT) },
];

// =====================================================================
// Cape Peninsula University of Technology - the weakest of this batch. CPUT's own
// explanation of its "Method 1/2/3" APS calculation could not be found in official
// text (only an unread image, plus third-party claims we are not treating as
// confirmed), so CPUT_APS is registered non-computable. Only the programmes whose
// subject requirements were read directly from CPUT's own course pages are included -
// Accounting, IT, Hospitality and Nursing are explicitly left out (see research-log.mjs).
// =====================================================================
const cputBase = {
  university_id: 'cput',
  scoring_system: 'CPUT_APS',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: null,
};
const CPUT_CAVEAT = 'CPUT states this programme’s APS target as calculated "using Method 2", but we could not find CPUT’s own official explanation of what that method actually is - only an unread image on its site and unconfirmed third-party claims. Treat the APS number as real but the underlying arithmetic as unexplained for now.';

const cputPrograms = [
  { ...cputBase, id: 'cput-dip-mechanical', career_id: 'mechanical-engineer', name: 'Diploma in Mechanical Engineering', faculty: 'Engineering, Bellville Campus',
    duration_years: null, min_aps: 30,
    source_url: 'https://prospectus.cput.ac.za/index.php/course-details?q=D3MCHE&f=140',
    subject_requirements: [pct('English', 50), anyOf(pct('Mathematics', 50), pct('Technical Mathematics', 60)), anyOf(pct('Physical Sciences', 50), pct('Technical Sciences', 60))],
    notes: flag(['partially-verified', 'unverified'], 'ECSA-accredited. ' + CPUT_CAVEAT) },
  { ...cputBase, id: 'cput-dip-civil', career_id: 'civil-engineer', name: 'Diploma in Civil Engineering', faculty: 'Civil Engineering and Geomatics, Bellville Campus',
    duration_years: null, min_aps: 30,
    source_url: 'https://prospectus.cput.ac.za/index.php/course-details?q=D3CIVL&f=140',
    subject_requirements: [pct('English', 50), anyOf(pct('Mathematics', 50), pct('Technical Mathematics', 60)), anyOf(pct('Physical Sciences', 50), pct('Technical Sciences', 60))],
    notes: flag(['partially-verified', 'unverified'], 'ECSA-accredited. ' + CPUT_CAVEAT) },
  { ...cputBase, id: 'cput-dip-electrical', career_id: 'electrical-engineer', name: 'Diploma in Engineering Technology in Electrical Engineering', faculty: 'Electrical, Electronic and Computer Engineering, Bellville Campus',
    duration_years: null, min_aps: 30,
    source_url: 'https://prospectus.cput.ac.za/index.php/course-details?q=D2ETEE&f=140',
    subject_requirements: [pct('English', 50), anyOf(pct('Mathematics', 50), pct('Technical Mathematics', 60)), anyOf(pct('Physical Sciences', 50), pct('Technical Sciences', 60), pct('Electrical Technology', 50))],
    notes: flag(['partially-verified', 'unverified'], 'ECSA-accredited. ' + CPUT_CAVEAT) },
  { ...cputBase, id: 'cput-bed-foundation', career_id: 'teacher', name: 'BEd Foundation Phase Teaching', faculty: 'Foundation Phase Studies, Mowbray & Wellington',
    duration_years: null, min_aps: null,
    source_url: 'https://prospectus.cput.ac.za/index.php/course-details?q=BEFNPT&f=100',
    subject_requirements: [manual('Bachelor’s-level NSC', 'Achievement rating 4 or better in four subjects (Bachelor’s Degree endorsement).'),
      manual('Two languages', 'At least one official SA language at level 4 and another at level 3; one of them must be CPUT’s language of teaching and learning.')],
    notes: flag(['partially-verified', 'no-cutoff-published'], 'CPUT states Education admission purely through subject/rating rules, not a single APS number.') },
  { ...cputBase, id: 'cput-nursing', career_id: 'nurse', name: 'Bachelor of Nursing (BPNURS)', faculty: 'Health & Wellness Sciences, Bellville Campus',
    duration_years: 4, min_aps: 30,
    source_url: 'https://prospectus.cput.ac.za/index.php/course-details?q=BPNURS&f=180',
    subject_requirements: [lvl('English', 4), anyOf(pct('Mathematics', 50), pct('Mathematical Literacy', 60)), lvl('Life Sciences', 4), lvl('Physical Sciences', 4)],
    notes: flag('partially-verified', 'Calculated on CPUT’s "Method 1" (best six subjects including the required ones, excluding Life Orientation, percentages summed and divided by 10 - see CPUT_APS). Only 30 applicants are accepted a year; shortlisted applicants complete an online interview, and Hepatitis B and Covid-19 vaccination are required for registration. Closes 30 June 2026 - notably earlier than CPUT’s other programmes in this batch.') },
];

// =====================================================================
// Central University of Technology - APS formula and Civil Engineering confirmed from
// raw HTML; Electrical/Mechanical Engineering, Accountancy and BEd Foundation Phase
// came through an AI-summarized fetch rather than a raw page read (same caveat tier as
// UJ above) - flagged accordingly. A URL/content mismatch for CUT's IT programme page
// made that one unreliable, so it is left out rather than published as a guess.
// =====================================================================
const cutBase = {
  university_id: 'cut',
  scoring_system: 'CUT_APS',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: null,
};
const CUT_SUMMARY_CAVEAT = 'This programme’s figures came through an AI-summarized fetch of the official CUT page rather than a raw read of the page itself - re-verify against cut.ac.za before fully relying on it. No 2027 closing date is stated on CUT’s own pages.';

const cutPrograms = [
  { ...cutBase, id: 'cut-beng-civil', career_id: 'civil-engineer', name: 'BEngTech Civil Engineering', faculty: 'Engineering, Built Environment & IT',
    duration_years: 3, min_aps: 32,
    source_url: 'https://www.cut.ac.za/programmes/civil-engineering-0',
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 5), lvl('Physical Sciences', 4)],
    notes: flag('partially-verified', 'Raw-verified from CUT’s own page. Mathematical Literacy is not accepted for any CUT Engineering discipline. No 2027 closing date is stated on CUT’s own pages.') },
  { ...cutBase, id: 'cut-dip-electrical', career_id: 'electrical-engineer', name: 'Diploma in Engineering Technology in Electrical Engineering', faculty: 'Engineering, Built Environment & IT',
    duration_years: 2, min_aps: 27,
    source_url: 'https://www.cut.ac.za/programmes/dp-engineering-technology-in-electrical-engineer',
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag('partially-verified', 'Mathematical Literacy is not accepted. ' + CUT_SUMMARY_CAVEAT) },
  { ...cutBase, id: 'cut-dip-mechanical', career_id: 'mechanical-engineer', name: 'Diploma in Engineering Technology in Mechanical Engineering', faculty: 'Engineering, Built Environment & IT',
    duration_years: 2, min_aps: 27,
    source_url: 'https://www.cut.ac.za/programmes/engineering-technology-mechanical',
    subject_requirements: [lvl('English', 3), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag(['partially-verified', 'unverified'], 'The English level (3) came through noticeably lower than Mathematics/Physical Sciences (4) in the source we read - double-check this isn’t an extraction error before relying on it. ' + CUT_SUMMARY_CAVEAT) },
  { ...cutBase, id: 'cut-bmgmtsci-accountancy', career_id: 'chartered-accountant', name: 'Bachelor of Management Sciences in Accountancy', faculty: 'Management Sciences',
    duration_years: 4, min_aps: 27,
    source_url: 'https://www.cut.ac.za/programmes/management-sciences-in-accountancy',
    subject_requirements: [pct('English', 50), pct('Accounting', 60), anyOf(pct('Mathematics', 40), pct('Mathematical Literacy', 60))],
    notes: flag('partially-verified', CUT_SUMMARY_CAVEAT) },
  { ...cutBase, id: 'cut-bed-foundation', career_id: 'teacher', name: 'BEd Foundation Phase Teaching', faculty: 'Humanities',
    duration_years: 4, min_aps: null,
    source_url: 'https://www.cut.ac.za/programmes/foundation-phase-teaching',
    subject_requirements: [pct('English', 50), manual('Additional SA language', 'Another official South African language at 50%.'), manual('Bachelor’s endorsement', 'NSC with Bachelor’s Degree endorsement required.')],
    notes: flag(['partially-verified', 'no-cutoff-published'], 'CUT did not state a numeric APS for this programme on the page we read. ' + CUT_SUMMARY_CAVEAT) },
];

// =====================================================================
// Mangosuthu University of Technology - CONFLICT: MUT's own general admissions page
// says APS uses the best FIVE subjects; its IT programme page says best SIX excluding
// Life Orientation. We show both rather than silently pick one - see MUT_APS and the
// [conflict] flag below. Figures are raw-extracted from official MUT PDFs (pdftotext),
// but multi-column tables can misalign in plain-text extraction - treat accordingly.
// =====================================================================
const mutBase = {
  university_id: 'mut',
  scoring_system: 'MUT_APS',
  score_type: 'minimum',
  intake_year: null,
  document_date: '2025-12-01',
};
const MUT_CONFLICT = flag('conflict', 'MUT’s general admissions page states APS is calculated from your best FIVE subjects; this programme’s own page states best SIX excluding Life Orientation. We show both rather than pick one - confirm with MUT directly. Source PDF is labelled "2026", not yet confirmed as the 2027-intake version. No official 2027 closing date was found (only unverified third-party claims).');

const mutPrograms = [
  { ...mutBase, id: 'mut-dip-civil', career_id: 'civil-engineer', name: 'Diploma in Civil Engineering', faculty: 'Engineering',
    duration_years: 3, min_aps: null,
    source_url: 'https://www.mut.ac.za/wp-content/uploads/2025/12/2026-Engineering-Faculty-Prospectus_.pdf',
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag(['partially-verified', 'dated-document', 'no-cutoff-published'], 'MUT’s Engineering Faculty prospectus gives subject minimums for this programme but no single APS number in the section we read. Source PDF labelled "2026", not yet confirmed for 2027. No official closing date found.') },
  { ...mutBase, id: 'mut-dip-electrical', career_id: 'electrical-engineer', name: 'Diploma in Electrical Engineering', faculty: 'Engineering',
    duration_years: 3, min_aps: null,
    source_url: 'https://www.mut.ac.za/wp-content/uploads/2025/12/2026-Engineering-Faculty-Prospectus_.pdf',
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag(['partially-verified', 'dated-document', 'no-cutoff-published'], 'Includes 4 semesters of formal study plus 2 semesters of in-service training. No single APS number stated in the section we read. Source PDF labelled "2026", not yet confirmed for 2027. No official closing date found.') },
  { ...mutBase, id: 'mut-dip-it', career_id: 'information-systems', name: 'Diploma in Information Technology', faculty: 'Applied and Health Sciences',
    duration_years: 3, min_aps: 24,
    source_url: 'https://www.mut.ac.za/wp-content/uploads/2025/12/2026-Applied-and-Health-Sciences-Handbook.pdf',
    subject_requirements: [lvl('English', 3), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 5))],
    notes: MUT_CONFLICT },
  { ...mutBase, id: 'mut-bhsc-medlab', career_id: 'biologist', name: 'Bachelor of Health Sciences: Medical Laboratory Science', faculty: 'Applied and Health Sciences',
    duration_years: 4, min_aps: null,
    source_url: 'https://www.mut.ac.za/wp-content/uploads/2025/12/2026-Applied-and-Health-Sciences-Handbook.pdf',
    subject_requirements: [lvl('English', 4), lvl('Life Sciences', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4),
      manual('Interview and placement test', 'Applicants must undergo an interview and placement testing.')],
    notes: flag(['partially-verified', 'unverified', 'no-cutoff-published'], 'Medical laboratory (diagnostic) science specifically, not general biology research. A "24" appeared near these subjects in the source table but its exact meaning was ambiguous in extraction, so we are not publishing it as the APS. Duration includes 6 months of work-integrated learning in year 3 and 12 months of clinical practice in year 4. Source PDF labelled "2026", not yet confirmed for 2027.') },
  { ...mutBase, id: 'mut-dip-accounting', career_id: 'chartered-accountant', name: 'Diploma in Accounting', faculty: 'Management Sciences',
    duration_years: 3, min_aps: 25,
    source_url: 'https://www.mut.ac.za/wp-content/uploads/2025/12/2026-Management-Sciences-Prospectus.pdf',
    subject_requirements: [lvl('Accounting', 4), lvl('English', 4), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 5)),
      manual('Three more subjects', 'Three further subjects at level 3 or better, excluding Life Orientation.')],
    notes: flag(['partially-verified', 'dated-document'], 'A 4-year Extended Curriculum Programme route exists with the same subject minimums. Source PDF labelled "2026", not yet confirmed for 2027. No official closing date found.') },
];

// =====================================================================
// Nelson Mandela University - only the Applicant Score (AS) FORMULA is confirmed so
// far (it's a 0-600 percentage-sum system, structurally different from the 1-7 level
// APS most other universities use). No programmes were researched yet - full gap,
// see research-log.mjs.
// =====================================================================

// =====================================================================
// University of Limpopo - APS formula and 5 Health Sciences/Law programmes confirmed
// from clean table rows in UL's 2027 prospectus (verified current via a diff against
// an older edition - the admissions content is unchanged). UL has no Engineering
// faculty. BCom/BAcc, BEd, BSc Agriculture and BSc Mathematical Sciences were also
// found but their per-subject level mappings were not reliably extracted from UL's
// flattened multi-column tables, so they are left out rather than published as a
// guess - see research-log.mjs for the follow-up.
// =====================================================================
const ulBase = {
  university_id: 'ul',
  scoring_system: 'UL_APS',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: '2025-03-01',
  source_url: 'https://www.ul.ac.za/wp-content/uploads/2025/03/Undergraduate-Prospectus-2027.pdf',
};
const UL_CAVEAT = 'From UL’s 2027 Undergraduate Prospectus. UL states that meeting the minimum APS does not guarantee admission. No official 2027 closing date was found in the sections we read.';

const ulPrograms = [
  { ...ulBase, id: 'ul-mbchb', career_id: 'doctor', name: 'MBChB (Medicine & Surgery)', faculty: 'Health Sciences (School of Medicine)',
    duration_years: 6, min_aps: 27,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 5), lvl('Physical Sciences', 5), lvl('Life Sciences', 5),
      manual('Two more subjects', 'Two further subjects at level 4 or better.')],
    notes: flag('partially-verified', UL_CAVEAT) },
  { ...ulBase, id: 'ul-bnurs', career_id: 'nurse', name: 'Bachelor of Nursing', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 26,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 5), lvl('Life Sciences', 5),
      manual('Two more subjects', 'Two further subjects at level 4 or better.')],
    notes: flag('partially-verified', UL_CAVEAT) },
  { ...ulBase, id: 'ul-bpharm', career_id: 'pharmacist', name: 'Bachelor of Pharmacy', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 27,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 5), lvl('Physical Sciences', 5), lvl('Life Sciences', 5),
      manual('Two more subjects', 'Two further subjects at level 4 or better.')],
    notes: flag('partially-verified', UL_CAVEAT) },
  { ...ulBase, id: 'ul-boptom', career_id: 'optometrist', name: 'Bachelor of Optometry', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 27,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 5), lvl('Physical Sciences', 5), lvl('Life Sciences', 5),
      manual('Two more subjects', 'Two further subjects at level 4 or better.')],
    notes: flag('partially-verified', UL_CAVEAT) },
  { ...ulBase, id: 'ul-llb', career_id: 'lawyer', name: 'LLB', faculty: 'Management and Law (School of Law)',
    duration_years: null, min_aps: 30,
    subject_requirements: [lvl('English', 4), manual('One more subject', 'One further subject at level 5 or better.')],
    notes: flag('partially-verified', 'A lower-APS (26) Extended Curriculum Programme route also exists. UL’s document did not state this programme’s duration (commonly 4 years elsewhere, but we won’t publish a number we didn’t see stated). ' + UL_CAVEAT) },
];

// =====================================================================
// Sol Plaatje University - general APS minimums (Bachelor's 30, Diploma 25) and
// English rule confirmed, but SPU's prospectus PDF could not be extracted to confirm
// the exact points-per-subject formula, so SPU_APS is non-computable. All 5 programmes
// below came from a direct fetch of SPU's own Natural & Applied Sciences programme
// page. A generic "BSc" with no field-specific subjects was found but left out - it
// doesn't map meaningfully onto any one Studypath career.
// =====================================================================
const spuBase = {
  university_id: 'spu',
  scoring_system: 'SPU_APS',
  score_type: 'minimum',
  intake_year: null,
  document_date: null,
  source_url: 'https://www.spu.ac.za/index.php/spu-nas-programmes/',
};
const SPU_CAVEAT = 'From SPU’s Faculty of Natural & Applied Sciences programme page. We could not confirm the 2027 application closing date (only a stale 2021 date was found on SPU’s applications page).';

const spuPrograms = [
  { ...spuBase, id: 'spu-dip-ict', career_id: 'software-engineer', name: 'Diploma in ICT in Applications Development', faculty: 'Natural & Applied Sciences',
    duration_years: 3, min_aps: null,
    subject_requirements: [manual('English and Mathematics', 'A "reasonably strong" mark in English and Mathematics or Mathematical Literacy - SPU did not state an exact level or percentage.')],
    notes: flag(['partially-verified', 'no-cutoff-published'], SPU_CAVEAT) },
  { ...spuBase, id: 'spu-dip-agriculture', career_id: 'agricultural-scientist', name: 'Diploma in Agriculture', faculty: 'Natural & Applied Sciences',
    duration_years: 3, min_aps: 25,
    subject_requirements: [anyOf(lvl('English', 4), lvl('English', 5)), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 5)), lvl('Physical Sciences', 3), anyOf(lvl('Life Sciences', 3), lvl('Agricultural Sciences', 3))],
    notes: flag('partially-verified', SPU_CAVEAT) },
  { ...spuBase, id: 'spu-benvsc', career_id: 'environmental-scientist', name: 'Bachelor of Environmental Science', faculty: 'Natural & Applied Sciences',
    duration_years: 4, min_aps: 30,
    subject_requirements: [manual('English', 'A "reasonably strong" first-language English mark - Mathematical Literacy is explicitly not accepted for this degree.')],
    notes: flag('partially-verified', SPU_CAVEAT) },
  { ...spuBase, id: 'spu-bsc-datascience', career_id: 'data-scientist', name: 'BSc Data Science', faculty: 'Natural & Applied Sciences',
    duration_years: 3, min_aps: 30,
    subject_requirements: [anyOf(lvl('English', 4), lvl('English', 5)), lvl('Mathematics', 5)],
    notes: flag('partially-verified', SPU_CAVEAT) },
  { ...spuBase, id: 'spu-bsc-geology', career_id: 'geologist', name: 'BSc Physical Sciences (Geology)', faculty: 'Natural & Applied Sciences',
    duration_years: 3, min_aps: 30,
    subject_requirements: [anyOf(lvl('English', 4), lvl('English', 5)), lvl('Mathematics', 4), lvl('Physical Sciences', 4), lvl('Life Sciences', 4)],
    notes: flag('partially-verified', SPU_CAVEAT) },
];

// =====================================================================
// University of Mpumalanga - only the two programmes confirmed by a direct fetch of
// their own official pages are included. Several more (LLB, BA General, two Diplomas)
// were found only via search-result synthesis, not a direct fetch of one specific
// page, and are deliberately left out rather than published at that confidence level.
// =====================================================================
const umpBase = {
  university_id: 'ump',
  scoring_system: 'UMP_APS',
  score_type: 'minimum',
  intake_year: null,
  document_date: null,
};
const UMP_CAVEAT = 'We could not confirm the 2027 application closing date on ump.ac.za itself (only unverified third-party claims).';

const umpPrograms = [
  { ...umpBase, id: 'ump-bcom', career_id: 'business-manager', name: 'Bachelor of Commerce', faculty: 'Economics, Development and Business Sciences',
    duration_years: 3, min_aps: 30,
    source_url: 'https://www.ump.ac.za/Study-with-us/Faculties-and-Schools/Faculty-of-Economics,-Development-and-Business-Sci/School-of-Development-Studies/Bachelor-of-Commerce.aspx',
    subject_requirements: [lvl('Mathematics', 4), lvl('English', 4)],
    notes: flag('partially-verified', 'Mathematical Literacy is not accepted. ' + UMP_CAVEAT) },
  { ...umpBase, id: 'ump-bed-foundation', career_id: 'teacher', name: 'BEd Foundation Phase Teaching', faculty: 'Education',
    duration_years: 4, min_aps: 26,
    source_url: 'https://www.ump.ac.za/Study-with-us/Faculties-and-Schools/Faculty-of-Education/School-of-Early-Childhood-Education/Bachelor-of-Education-in-Foundation-Phase-Teaching.aspx',
    subject_requirements: [lvl('English', 5), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 4)), lvl('Life Orientation', 4)],
    notes: flag('partially-verified', 'APS 26 with Mathematics, 27 with Mathematical Literacy. ' + UMP_CAVEAT) },
];

// =====================================================================
// Unisa - distance-only. Its APS formula is confirmed and is the same NSC best-6-
// excluding-LO method as UP, so UNISA_APS is registered COMPUTABLE (reusing that
// proven logic). Note Unisa is not first-come-first-served: meeting the APS and
// subject minimums does not guarantee a space on qualifications with limited places.
// A generic "BA" was found split across many major-combination qualification codes
// with no single page confirmed, so it is left out.
// =====================================================================
const unisaBase = {
  university_id: 'unisa',
  scoring_system: 'UNISA_APS',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: null,
};
const UNISA_CAVEAT = 'Confirmed current for the 2027 intake: Unisa’s own pages state its 2027 application window as 17 August - 9 October 2026.';

const unisaPrograms = [
  { ...unisaBase, id: 'unisa-bcom', career_id: 'business-manager', name: 'Bachelor of Commerce (General)', faculty: 'Economic & Management Sciences',
    duration_years: null, min_aps: 21,
    source_url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission/Undergraduate-qualifications/Qualifications/All-qualifications/Bachelor-of-Commerce-(98314-%E2%80%93-GEN)',
    subject_requirements: [pct('English', 50), pct('Mathematics', 50)],
    notes: flag('partially-verified', 'NSC with Bachelor’s Degree endorsement required (alternative routes exist via a Senior Certificate or a higher certificate/diploma). Maximum 8 years to complete. ' + UNISA_CAVEAT) },
  { ...unisaBase, id: 'unisa-llb', career_id: 'lawyer', name: 'Bachelor of Laws (LLB)', faculty: 'Law',
    duration_years: null, min_aps: 20,
    source_url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission/Undergraduate-qualifications/Qualifications/All-qualifications/Bachelor-of-Laws-(98680-%E2%80%93-NEW)',
    subject_requirements: [pct('English', 50)],
    notes: flag('partially-verified', 'NSC with Bachelor’s Degree endorsement required (alternative routes exist via a Senior Certificate, a Higher Certificate in Law, or certain other qualifications). Maximum 10 years to complete. ' + UNISA_CAVEAT) },
  { ...unisaBase, id: 'unisa-bed-foundation', career_id: 'teacher', name: 'BEd Foundation Phase Teaching', faculty: 'Education',
    duration_years: null, min_aps: 23,
    source_url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission/Undergraduate-qualifications/Qualifications/All-qualifications/Bachelor-of-Education-in-Foundation-Phase-Teaching-(90102)',
    subject_requirements: [pct('English', 50), anyOf(pct('Mathematics', 40), pct('Mathematical Literacy', 50))],
    notes: flag('partially-verified', 'NSC with Bachelor’s Degree endorsement required. Maximum 10 years to complete. ' + UNISA_CAVEAT) },
  { ...unisaBase, id: 'unisa-bsc-appliedmath-cs', career_id: 'mathematician', name: 'BSc Applied Mathematics and Computer Science', faculty: 'Science, Engineering & Technology',
    duration_years: null, min_aps: 20,
    source_url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission/Undergraduate-qualifications/Qualifications/All-qualifications/Bachelor-of-Science-Applied-Mathematics-and-Computer-Science-(98801-%E2%80%93-AMC)',
    subject_requirements: [pct('English', 50), pct('Mathematics', 50)],
    notes: flag('partially-verified', 'Physical/Technical Science at 50%+ is also required if Physics or Chemistry modules form part of your chosen modules. NSC with Bachelor’s Degree endorsement required. Maximum 8 years to complete. ' + UNISA_CAVEAT) },
  { ...unisaBase, id: 'unisa-social-work', career_id: 'social-worker', name: 'Bachelor of Social Work', faculty: 'Human Sciences',
    duration_years: null, min_aps: 21,
    source_url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission/Undergraduate-qualifications/Qualifications/All-qualifications/Bachelor-of-Social-Work-(90088)',
    subject_requirements: [pct('English', 60), manual('Four content subjects', 'Four further subjects at 60% or better.')],
    notes: flag('partially-verified', 'A police clearance certificate, two testimonials and an online screening test are also required before registration; registers with SACSSP. NSC with Bachelor’s Degree endorsement required. Maximum 10 years to complete. ' + UNISA_CAVEAT) },
  { ...unisaBase, id: 'unisa-ba-psychology', career_id: 'clinical-psychologist', name: 'BA in Psychology', faculty: 'Human Sciences',
    duration_years: null, min_aps: 20,
    source_url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission/Undergraduate-qualifications/Qualifications/All-qualifications/Bachelor-of-Arts-in-Psychology-(90180)',
    subject_requirements: [pct('English', 50)],
    notes: flag('partially-verified', 'At least half of this degree’s 30 modules must be Psychology courses. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise. NSC with Bachelor’s Degree endorsement required. Maximum 8 years to complete. ' + UNISA_CAVEAT) },
  { ...unisaBase, id: 'unisa-ba-psychology-counselling', career_id: 'counselling-educational-psychologist', name: 'BA in Psychology', faculty: 'Human Sciences',
    duration_years: null, min_aps: 20,
    source_url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission/Undergraduate-qualifications/Qualifications/All-qualifications/Bachelor-of-Arts-in-Psychology-(90180)',
    subject_requirements: [pct('English', 50)],
    notes: flag('partially-verified', 'This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise. NSC with Bachelor’s Degree endorsement required. Maximum 8 years to complete. ' + UNISA_CAVEAT) },
  { ...unisaBase, id: 'unisa-bacc-financial-accounting', career_id: 'chartered-accountant', name: 'Bachelor of Accounting Sciences in Financial Accounting', faculty: 'Accounting Sciences',
    duration_years: null, min_aps: 21,
    source_url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission/Undergraduate-qualifications/Qualifications/All-qualifications/Bachelor-of-Accounting-Sciences-in-Financial-Accounting-(Revised-Curriculum-2020)-(98302-%E2%80%93-FA1)',
    subject_requirements: [pct('English', 50), anyOf(pct('Mathematics', 50), pct('Mathematical Literacy', 60))],
    notes: flag('partially-verified', 'SAICA and SAIPA accredited - this is Unisa’s CA(SA)/CTA-track accounting degree, distinct from its general BCom. NSC with Bachelor’s Degree endorsement required. Maximum 8 years to complete. ' + UNISA_CAVEAT) },
  { ...unisaBase, id: 'unisa-badmin', career_id: 'business-manager', name: 'Bachelor of Administration', faculty: 'Human Sciences',
    duration_years: null, min_aps: 21,
    source_url: 'https://www.unisa.ac.za/sites/corporate/default/Register-to-study-through-Unisa/Undergraduate-&-honours-qualifications/Find-your-qualification-&-choose-your-modules/All-qualifications/Bachelor-of-Administration-(98315-%E2%80%93-BAD)',
    subject_requirements: [manual('Subject-level requirements', 'Not shown on the page we read (it covered curriculum/modules, not entry requirements) - only the APS minimum was confirmed.')],
    notes: flag(['partially-verified', 'unverified'], 'A public-administration-flavoured degree with electives across Accounting, Business Management, Economics, Law and Psychology. ' + UNISA_CAVEAT) },
  { ...unisaBase, id: 'unisa-dip-it', career_id: 'software-engineer', name: 'Diploma in Information Technology', faculty: 'Science, Engineering & Technology',
    duration_years: null, min_aps: 18,
    source_url: 'https://www.unisa.ac.za/sites/corporate/default/Register-to-study-through-Unisa/Undergraduate-&-honours-qualifications/Find-your-qualification-&-choose-your-modules/All-qualifications/Diploma-in-Information-Technology-(98806-%E2%80%93-ITE)',
    subject_requirements: [manual('Subject-level requirements', 'Not shown on the page we read - only the APS minimum was confirmed.')],
    notes: flag(['partially-verified', 'unverified'], UNISA_CAVEAT) },
  { ...unisaBase, id: 'unisa-ba-majors', career_id: 'humanities-generalist', name: 'BA (choose two majors, e.g. Psychology & Economics)', faculty: 'Human Sciences',
    duration_years: null, min_aps: 20,
    source_url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission/Undergraduate-qualifications/Qualifications/All-qualifications/Bachelor-of-Arts-(Majors:-Psychology-%26-Economics)-(99311-%E2%80%93-PSE)',
    subject_requirements: [pct('English', 50)],
    notes: flag('partially-verified', 'Unisa’s BA (qualification code 99311) is published as roughly 200 separate major-pair combinations, all sharing this same APS and admission requirement - Psychology & Economics is shown here as one representative example; search Unisa’s qualification list for your own preferred major pair. NSC with Bachelor’s Degree endorsement required. Maximum 8 years to complete. ' + UNISA_CAVEAT) },
];

// =====================================================================
// Sefako Makgatho Health Sciences University - single-faculty health-sciences
// university, confirmed EARLY closing date (31 July 2026 for undergraduates - about
// two months before most other universities in this batch). SMU converts marks on
// its own points scale (A=12 down to F=3), not the standard 1-7 NSC level scale, so
// subject minimums are described in SMU's own words rather than forced into our
// usual level/percentage fields, and SMU_APS is registered non-computable. No page we
// read stated a duration or confirmed an NBT requirement, so both are left out rather
// than assumed.
// =====================================================================
const smuBase = {
  university_id: 'smu',
  scoring_system: 'SMU_APS',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: null,
};
const SMU_CLOSING = 'Closes 31 July 2026 for undergraduate programmes (applications open 1 April 2026) - notably earlier than most universities in this batch.';

const smuPrograms = [
  { ...smuBase, id: 'smu-mbchb', career_id: 'doctor', name: 'MBChB (Medicine)', faculty: 'School of Medicine',
    duration_years: null, min_aps: 38,
    source_url: 'https://www.smu.ac.za/schools/medicine/medicine-undergraduate-admission-requirements/',
    subject_requirements: [manual('Mathematics, Physical Science, Life Science, Life Orientation, English', 'Each needs a minimum of 6 points on SMU’s own APS conversion scale (A = 12 points down to F = 3 points - not the standard 1-7 NSC level scale).')],
    notes: flag(['selection', 'partially-verified'], '38 is the Grade 11 provisional pre-selection threshold for about 250 places a year; final Grade 12 selection is competitive on actual percentage marks, and meeting the minimum does not guarantee a place. ' + SMU_CLOSING) },
  { ...smuBase, id: 'smu-bds', career_id: 'dentist', name: 'BDS (Dentistry / Oral Health Sciences)', faculty: 'School of Oral Health Sciences',
    duration_years: null, min_aps: 37,
    source_url: 'https://www.smu.ac.za/schools/oral-health-sciences/oral-health-sciences-undergraduate-admission-requirements/',
    subject_requirements: [manual('English, Life Sciences, Physical Science, Mathematics', 'Each needs a minimum of 6 points on SMU’s own APS conversion scale (A = 12 points down to F = 3 points).')],
    notes: flag(['selection', 'partially-verified'], 'About 42 places a year, selected by merit order on actual percentage marks. ' + SMU_CLOSING) },
  { ...smuBase, id: 'smu-bpharm', career_id: 'pharmacist', name: 'Bachelor of Pharmacy', faculty: 'School of Pharmacy',
    duration_years: null, min_aps: 32,
    source_url: 'https://www.smu.ac.za/schools/pharmacy/pharmacy-undergraduate-admission-requirements/',
    subject_requirements: [manual('Life Sciences, Mathematics, Physical Sciences, English', 'Each at level 5; Life Orientation at level 4; two further subjects (preferably Accounting and Economics) at level 4 each - these ARE on the standard 1-7 NSC scale, unlike SMU’s Medicine and Dentistry pages above.'),
      manual('Interview', 'Applicants who meet the academic minimums are invited to an interview.')],
    notes: flag('partially-verified', SMU_CLOSING) },
  { ...smuBase, id: 'smu-dietetics', career_id: 'dietitian', name: 'BSc Dietetics', faculty: 'School of Health Care Sciences',
    duration_years: null, min_aps: 25,
    source_url: 'https://www.smu.ac.za/schools/health-care-sciences/health-care-sciences-undergraduate-admission-requirements/',
    subject_requirements: [lvl('Mathematics', 4), lvl('Physical Sciences', 4), lvl('English', 4), lvl('Life Sciences', 4), lvl('Life Orientation', 3),
      manual('Two more subjects', 'Two further subjects at level 3 or better.')],
    notes: flag('partially-verified', SMU_CLOSING) },
  { ...smuBase, id: 'smu-nursing-midwifery', career_id: 'nurse', name: 'Bachelor of Nursing and Midwifery', faculty: 'School of Health Care Sciences',
    duration_years: null, min_aps: 25,
    source_url: 'https://www.smu.ac.za/schools/health-care-sciences/health-care-sciences-undergraduate-admission-requirements/',
    subject_requirements: [lvl('Life Sciences', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4), lvl('English', 4), lvl('Life Orientation', 3),
      manual('Two more subjects', 'Two further subjects at level 3 or better.'), manual('SANC registration', 'Registration with the SA Nursing Council is compulsory within the first 30 days of admission.')],
    notes: flag('partially-verified', 'SMU also lists an older "Bachelor Nursing Sciences and Arts" qualification explicitly marked as being phased out - not included here. ' + SMU_CLOSING) },
  { ...smuBase, id: 'smu-ot', career_id: 'occupational-therapist', name: 'Bachelor of Occupational Therapy', faculty: 'School of Health Care Sciences',
    duration_years: null, min_aps: 25,
    source_url: 'https://www.smu.ac.za/schools/health-care-sciences/health-care-sciences-undergraduate-admission-requirements/',
    subject_requirements: [lvl('Life Sciences', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4), lvl('English', 4), lvl('Life Orientation', 3),
      manual('Two more subjects', 'Two further subjects at level 3 or better.')],
    notes: flag('partially-verified', SMU_CLOSING) },
  { ...smuBase, id: 'smu-physiotherapy', career_id: 'physiotherapist', name: 'BSc Physiotherapy', faculty: 'School of Health Care Sciences',
    duration_years: null, min_aps: 28,
    source_url: 'https://www.smu.ac.za/schools/health-care-sciences/health-care-sciences-undergraduate-admission-requirements/',
    subject_requirements: [lvl('Life Sciences', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4), lvl('English', 4), lvl('Life Orientation', 4),
      manual('Two more subjects', 'Two further subjects at level 4 or better.')],
    notes: flag('partially-verified', SMU_CLOSING) },
  { ...smuBase, id: 'smu-speech-therapy', career_id: 'speech-therapist', name: 'Bachelor of Speech-Language Pathology', faculty: 'School of Health Care Sciences',
    duration_years: null, min_aps: 25,
    source_url: 'https://www.smu.ac.za/schools/health-care-sciences/health-care-sciences-undergraduate-admission-requirements/',
    subject_requirements: [lvl('Mathematics', 4), lvl('English', 4), lvl('Life Sciences', 4), manual('Another language', 'Another language (Home or First Additional) at level 4.'), lvl('Life Orientation', 3),
      manual('Two more subjects', 'Two further subjects at level 3 or better.')],
    notes: flag('partially-verified', SMU_CLOSING) },
  { ...smuBase, id: 'smu-audiology', career_id: 'audiologist', name: 'Bachelor of Audiology', faculty: 'School of Health Care Sciences',
    duration_years: null, min_aps: 25,
    source_url: 'https://www.smu.ac.za/schools/health-care-sciences/health-care-sciences-undergraduate-admission-requirements/',
    subject_requirements: [lvl('Mathematics', 4), lvl('English', 4), lvl('Life Sciences', 4), manual('Another language', 'Another language (Home or First Additional) at level 4.'), lvl('Life Orientation', 3),
      manual('Two more subjects', 'Two further subjects at level 3 or better.')],
    notes: flag('partially-verified', SMU_CLOSING) },
];

// =====================================================================
// University of Zululand - 14 programmes read directly from three official faculty
// handbook PDFs (full text extracted, page-verified). UNIZULU_APS's formula was
// already confirmed and is now put to use. Two Intermediate Phase BEd streams and a
// superseded "pipeline" Nursing degree were explicitly marked as having no new
// intake in the source documents and are deliberately left out, as are several
// programmes (BEng streams, Sport/Hospitality diplomas, individual BSc majors) whose
// general faculty rules were found but not a qualification-specific admission block.
// =====================================================================
const unizuluBase = {
  university_id: 'unizulu',
  scoring_system: 'UNIZULU_APS',
  score_type: 'minimum',
  intake_year: null,
  document_date: '2026-01-01',
};
const UNIZULU_CAVEAT = 'From UniZulu’s own 2026-labelled faculty handbooks, which contain no 2027-specific intake or closing-date information at all - do not assume a date, and treat this as the most recent official figures available rather than confirmed-current for 2027.';

const unizuluPrograms = [
  { ...unizuluBase, id: 'unizulu-bed-foundation', career_id: 'teacher', name: 'BEd Foundation Phase Teaching', faculty: 'Education',
    duration_years: 4, min_aps: 26,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FEDU-Undergraduate-Handbook-2026.pdf',
    subject_requirements: [manual('isiZulu Home Language', 'Level 4.'), lvl('English', 4), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 4))],
    notes: flag(['partially-verified', 'dated-document'], UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-bcom', career_id: 'business-manager', name: 'Bachelor of Commerce (General)', faculty: 'Commerce, Administration & Law',
    duration_years: 3, min_aps: 28,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FCAL-Handbook-2026.pdf',
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 6))],
    notes: flag(['partially-verified', 'dated-document'], UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-bcom-augmented', career_id: 'business-manager', name: 'Bachelor of Commerce (4-Year Augmented Programme)', faculty: 'Commerce, Administration & Law',
    duration_years: 4, min_aps: 26,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FCAL-Handbook-2026.pdf',
    subject_requirements: [lvl('English', 3), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 4))],
    notes: flag(['partially-verified', 'dated-document'], 'A lower-threshold, longer route into the same BCom. ' + UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-bcom-accounting', career_id: 'chartered-accountant', name: 'Bachelor of Commerce (Accounting)', faculty: 'Commerce, Administration & Law',
    duration_years: 3, min_aps: 28,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FCAL-Handbook-2026.pdf',
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4)],
    notes: flag(['partially-verified', 'dated-document'], 'No Mathematical Literacy alternative is offered for this stream. ' + UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-bcom-accounting-science', career_id: 'chartered-accountant', name: 'Bachelor of Commerce (Accounting Science)', faculty: 'Commerce, Administration & Law',
    duration_years: 4, min_aps: 28,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FCAL-Handbook-2026.pdf',
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4)],
    notes: flag(['partially-verified', 'dated-document'], 'No Mathematical Literacy alternative is offered for this stream. ' + UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-bcom-mis', career_id: 'information-systems', name: 'Bachelor of Commerce (Management Information Systems)', faculty: 'Commerce, Administration & Law',
    duration_years: 3, min_aps: 28,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FCAL-Handbook-2026.pdf',
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4)],
    notes: flag(['partially-verified', 'dated-document'], UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-badmin', career_id: 'business-manager', name: 'Bachelor of Administration', faculty: 'Commerce, Administration & Law',
    duration_years: 3, min_aps: 28,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FCAL-Handbook-2026.pdf',
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 4))],
    notes: flag(['partially-verified', 'dated-document'], UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-llb', career_id: 'lawyer', name: 'Bachelor of Laws (LLB)', faculty: 'Commerce, Administration & Law',
    duration_years: 4, min_aps: 30,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FCAL-Handbook-2026.pdf',
    subject_requirements: [lvl('English', 4), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 4))],
    notes: flag(['partially-verified', 'dated-document'], UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-bsc-agric-animal', career_id: 'agricultural-scientist', name: 'BSc Agriculture: Animal Science', faculty: 'Science, Agriculture & Engineering',
    duration_years: 4, min_aps: 28,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FSAE-Undergraduate-Handbook-2026.cleaned.pdf',
    subject_requirements: [pct('English', 50), pct('Mathematics', 50), anyOf(pct('Agricultural Sciences', 50), pct('Life Sciences', 50))],
    notes: flag(['partially-verified', 'dated-document'], 'Mathematical Literacy is not accepted for direct BSc entry. ' + UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-bsc-agribusiness', career_id: 'agricultural-scientist', name: 'BSc Agriculture: Agribusiness', faculty: 'Science, Agriculture & Engineering',
    duration_years: 4, min_aps: 28,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FSAE-Undergraduate-Handbook-2026.cleaned.pdf',
    subject_requirements: [pct('English', 50), pct('Mathematics', 50), anyOf(pct('Agricultural Sciences', 50), pct('Life Sciences', 50))],
    notes: flag(['partially-verified', 'dated-document'], 'Mathematical Literacy is not accepted for direct BSc entry. ' + UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-bsc-agronomy', career_id: 'agricultural-scientist', name: 'BSc Agriculture: Agronomy (Plant Sciences)', faculty: 'Science, Agriculture & Engineering',
    duration_years: 4, min_aps: 28,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FSAE-Undergraduate-Handbook-2026.cleaned.pdf',
    subject_requirements: [pct('English', 50), pct('Mathematics', 50), anyOf(pct('Agricultural Sciences', 50), pct('Life Sciences', 50))],
    notes: flag(['partially-verified', 'dated-document'], 'Mathematical Literacy is not accepted for direct BSc entry. ' + UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-consumer-science-rural', career_id: 'social-worker', name: 'Bachelor of Consumer Science (Extension and Rural Development)', faculty: 'Science, Agriculture & Engineering',
    duration_years: 4, min_aps: 28,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FSAE-Undergraduate-Handbook-2026.cleaned.pdf',
    subject_requirements: [pct('English', 50), pct('Life Sciences', 50)],
    notes: flag(['partially-verified', 'dated-document'], 'Community/rural development work specifically - filed under the closest existing career category. ' + UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-consumer-science-hospitality', career_id: 'hospitality-manager', name: 'Bachelor of Consumer Science (Hospitality and Tourism)', faculty: 'Science, Agriculture & Engineering',
    duration_years: 3, min_aps: 28,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FSAE-Undergraduate-Handbook-2026.cleaned.pdf',
    subject_requirements: [pct('English', 50)],
    notes: flag(['partially-verified', 'dated-document'], UNIZULU_CAVEAT) },
  { ...unizuluBase, id: 'unizulu-nursing', career_id: 'nurse', name: 'Bachelor of Nursing (General Nursing and Midwifery)', faculty: 'Science, Agriculture & Engineering (Department of Nursing Science)',
    duration_years: 4, min_aps: 30,
    source_url: 'https://www.unizulu.ac.za/wp-content/uploads/2026/01/FSAE-Undergraduate-Handbook-2026.cleaned.pdf',
    subject_requirements: [pct('English', 50), pct('Life Sciences', 50), anyOf(pct('Mathematics', 50), pct('Mathematical Literacy', 50))],
    notes: flag(['partially-verified', 'dated-document'], 'A separate "pipeline" version of this degree exists for existing students only (no new intake) and is not shown here. ' + UNIZULU_CAVEAT) },
];

// =====================================================================
// Nelson Mandela University - 16 programmes read directly from official faculty
// "UG Guide" PDFs and programme pages. NMU's Applicant Score (AS, 0-600 scale) was
// already confirmed and independently reconfirmed here via myfuture.mandela.ac.za.
// Most faculty guides used are dated/closing in 2024 (apparently governing the 2025
// intake) rather than confirmed 2027 documents - flagged throughout. Several near-
// duplicate BCom/LLB variants and two Law Enforcement quals were left out to avoid
// clutter; see research-log.mjs for what else NMU offers.
// =====================================================================
const nmuBase = {
  university_id: 'nmu',
  scoring_system: 'NMU_AS',
  score_type: 'minimum',
  intake_year: null,
  document_date: '2024-04-01',
};
const NMU_CAVEAT = 'From NMU’s own faculty "UG Guide" PDFs, most of which are dated/closing in 2024 - apparently covering the 2025 intake, not independently confirmed as current for 2027 (NMU appears to roll these forward with the same structure each year, but treat the figures as "last confirmed" rather than "2027-verified"). No 2027 closing date is stated.';

const nmuPrograms = [
  { ...nmuBase, id: 'nmu-bengtech-civil', career_id: 'civil-engineer', name: 'BEngTech Civil Engineering', faculty: 'Engineering, the Built Environment & Technology',
    duration_years: 3, min_aps: 370,
    source_url: 'https://eleceng.mandela.ac.za/eleceng/media/Store/documents/Prospectus/Faculty-of-Engineering_TheBuiltEnv-and-IT-UG-Guide.pdf',
    subject_requirements: [anyOf(pct('Mathematics', 60), pct('Technical Mathematics', 60)), anyOf(pct('Physical Sciences', 50), pct('Technical Sciences', 50))],
    notes: flag(['partially-verified', 'dated-document'], NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bengtech-electrical', career_id: 'electrical-engineer', name: 'BEngTech Electrical Engineering', faculty: 'Engineering, the Built Environment & Technology',
    duration_years: 3, min_aps: 370,
    source_url: 'https://eleceng.mandela.ac.za/eleceng/media/Store/documents/Prospectus/Faculty-of-Engineering_TheBuiltEnv-and-IT-UG-Guide.pdf',
    subject_requirements: [anyOf(pct('Mathematics', 60), pct('Technical Mathematics', 60)), anyOf(pct('Physical Sciences', 50), pct('Technical Sciences', 50))],
    notes: flag(['partially-verified', 'dated-document'], NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bengtech-industrial', career_id: 'industrial-engineer', name: 'BEngTech Industrial Engineering', faculty: 'Engineering, the Built Environment & Technology',
    duration_years: 3, min_aps: 370,
    source_url: 'https://eleceng.mandela.ac.za/eleceng/media/Store/documents/Prospectus/Faculty-of-Engineering_TheBuiltEnv-and-IT-UG-Guide.pdf',
    subject_requirements: [anyOf(pct('Mathematics', 60), pct('Technical Mathematics', 60)), anyOf(pct('Physical Sciences', 50), pct('Technical Sciences', 50))],
    notes: flag(['partially-verified', 'dated-document'], NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bengtech-mechanical', career_id: 'mechanical-engineer', name: 'BEngTech Mechanical Engineering', faculty: 'Engineering, the Built Environment & Technology',
    duration_years: 3, min_aps: 370,
    source_url: 'https://eleceng.mandela.ac.za/eleceng/media/Store/documents/Prospectus/Faculty-of-Engineering_TheBuiltEnv-and-IT-UG-Guide.pdf',
    subject_requirements: [anyOf(pct('Mathematics', 60), pct('Technical Mathematics', 60)), anyOf(pct('Physical Sciences', 50), pct('Technical Sciences', 50))],
    notes: flag(['partially-verified', 'dated-document'], NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bengtech-marine', career_id: 'mechanical-engineer', name: 'BEngTech Marine Engineering', faculty: 'Engineering, the Built Environment & Technology',
    duration_years: 3, min_aps: 370,
    source_url: 'https://eleceng.mandela.ac.za/eleceng/media/Store/documents/Prospectus/Faculty-of-Engineering_TheBuiltEnv-and-IT-UG-Guide.pdf',
    subject_requirements: [anyOf(pct('Mathematics', 60), pct('Technical Mathematics', 60)), anyOf(pct('Physical Sciences', 50), pct('Technical Sciences', 50))],
    notes: flag(['partially-verified', 'dated-document'], 'There is no dedicated marine-engineering career on Studypath yet, so this is filed under the closest existing category. ' + NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-beng-mechatronics', career_id: 'mechanical-engineer', name: 'BEng Mechatronics', faculty: 'Engineering, the Built Environment & Technology',
    duration_years: 4, min_aps: 410,
    source_url: 'https://eleceng.mandela.ac.za/eleceng/media/Store/documents/Prospectus/Faculty-of-Engineering_TheBuiltEnv-and-IT-UG-Guide.pdf',
    subject_requirements: [pct('Mathematics', 60), pct('Physical Sciences', 65)],
    notes: flag(['partially-verified', 'dated-document'], 'Mathematical Literacy is not accepted; no Technical Mathematics route is shown for this one (unlike the BEngTech diplomas above). ' + NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bit', career_id: 'information-systems', name: 'Bachelor of Information Technology', faculty: 'Engineering, the Built Environment & Technology',
    duration_years: 3, min_aps: 370,
    source_url: 'https://eleceng.mandela.ac.za/eleceng/media/Store/documents/Prospectus/Faculty-of-Engineering_TheBuiltEnv-and-IT-UG-Guide.pdf',
    subject_requirements: [anyOf(pct('Mathematics', 50), pct('Technical Mathematics', 50))],
    notes: flag(['partially-verified', 'dated-document'], NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bas-architecture', career_id: 'architect', name: 'Bachelor of Architectural Studies (BAS)', faculty: 'Engineering, the Built Environment & Technology',
    duration_years: 3, min_aps: 370,
    source_url: 'https://eleceng.mandela.ac.za/eleceng/media/Store/documents/Prospectus/Faculty-of-Engineering_TheBuiltEnv-and-IT-UG-Guide.pdf',
    subject_requirements: [pct('Mathematics', 55), manual('Portfolio and interview', 'A portfolio submission and interview are required; admission is only confirmed after these are held.')],
    notes: flag(['partially-verified', 'dated-document'], 'Followed by a further BAS Honours year and a professional Master of Architecture for full registration. ' + NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-nursing', career_id: 'nurse', name: 'Bachelor of Nursing', faculty: 'Health Sciences',
    duration_years: null, min_aps: 370,
    source_url: 'https://nursing.mandela.ac.za/Qualifications-Offered/Bachelor-of-Nursing',
    subject_requirements: [anyOf(pct('Mathematics', 50), pct('Mathematical Literacy', 65)), pct('Life Sciences', 60), pct('Physical Sciences', 50)],
    notes: flag(['partially-verified', 'unverified'], 'AS 370 on the Mathematics route, 385 on the Mathematical Literacy route. Duration was not stated on the page we read. ' + NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-llb', career_id: 'lawyer', name: 'LLB', faculty: 'Law',
    duration_years: 4, min_aps: 390,
    source_url: 'https://law.mandela.ac.za/law/media/Store/documents/Faculty%20Undergrad%20Guide/FAL-Brochure-2.pdf',
    subject_requirements: [anyOf(pct('English', 65), pct('English', 70)), pct('Mathematics', 50)],
    notes: flag(['partially-verified', 'unverified'], 'English threshold is 65% if it is your Home Language, 70% if First Additional. A 5-year LLB Extended route also exists at a lower threshold. ' + NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bcom-law', career_id: 'lawyer', name: 'BCom Law', faculty: 'Law',
    duration_years: null, min_aps: 390,
    source_url: 'https://law.mandela.ac.za/law/media/Store/documents/Faculty%20Undergrad%20Guide/FAL-Brochure-2.pdf',
    subject_requirements: [anyOf(pct('English', 65), pct('English', 70)), pct('Mathematics', 60)],
    notes: flag(['partially-verified', 'unverified'], 'Mathematical Literacy and Technical Mathematics are not accepted. ' + NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-ba-law', career_id: 'lawyer', name: 'BA Law', faculty: 'Law',
    duration_years: null, min_aps: 390,
    source_url: 'https://law.mandela.ac.za/law/media/Store/documents/Faculty%20Undergrad%20Guide/FAL-Brochure-2.pdf',
    subject_requirements: [anyOf(pct('English', 65), pct('English', 70)), pct('Mathematics', 50)],
    notes: flag(['partially-verified', 'unverified'], 'AS 390 on the Mathematics route, 405 on the Mathematical Literacy/Technical Mathematics route (at a 75% threshold). ' + NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bcom-accounting', career_id: 'chartered-accountant', name: 'BCom General (Accounting)', faculty: 'Business & Economic Sciences',
    duration_years: 3, min_aps: 390,
    source_url: 'https://business.mandela.ac.za/business/media/Store/documents/Prospectus/Faculty-of-Business-and-Economic-Sciences-UG-Guide.pdf',
    subject_requirements: [pct('Mathematics', 50)],
    notes: flag(['partially-verified', 'dated-document'], 'Also offered at George Campus (full-time only); 5 years part-time also available. ' + NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bcom-accounting-ca', career_id: 'chartered-accountant', name: 'BCom (Accounting) - Chartered Accountancy track', faculty: 'Business & Economic Sciences',
    duration_years: 3, min_aps: 410,
    source_url: 'https://business.mandela.ac.za/business/media/Store/documents/Prospectus/Faculty-of-Business-and-Economic-Sciences-UG-Guide.pdf',
    subject_requirements: [pct('Mathematics', 60)],
    notes: flag(['partially-verified', 'dated-document'], 'A higher-threshold stream aimed specifically at the CA(SA) route, distinct from the general Accounting BCom above. ' + NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bcom-economics', career_id: 'economist', name: 'BCom General (Economics)', faculty: 'Business & Economic Sciences',
    duration_years: 3, min_aps: 390,
    source_url: 'https://business.mandela.ac.za/business/media/Store/documents/Prospectus/Faculty-of-Business-and-Economic-Sciences-UG-Guide.pdf',
    subject_requirements: [pct('Mathematics', 50)],
    notes: flag(['partially-verified', 'dated-document'], NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bcom-business-management', career_id: 'business-manager', name: 'BCom General (Business Management)', faculty: 'Business & Economic Sciences',
    duration_years: 3, min_aps: 390,
    source_url: 'https://business.mandela.ac.za/business/media/Store/documents/Prospectus/Faculty-of-Business-and-Economic-Sciences-UG-Guide.pdf',
    subject_requirements: [pct('Mathematics', 50)],
    notes: flag(['partially-verified', 'dated-document'], '5 years part-time also available. ' + NMU_CAVEAT) },
  { ...nmuBase, id: 'nmu-bcom-cs-is', career_id: 'software-engineer', name: 'BCom (Computer Science & Information Systems)', faculty: 'Business & Economic Sciences',
    duration_years: 3, min_aps: 390,
    source_url: 'https://business.mandela.ac.za/business/media/Store/documents/Prospectus/Faculty-of-Business-and-Economic-Sciences-UG-Guide.pdf',
    subject_requirements: [pct('Mathematics', 60)],
    notes: flag(['partially-verified', 'dated-document'], NMU_CAVEAT) },
];

export const otherPrograms = [...ujPrograms, ...uwcPrograms, ...ruWithLO, ...nwuPrograms, ...ufsPrograms, ...univenPrograms, ...wsuPrograms, ...ufhPrograms, ...tutPrograms, ...vutPrograms, ...dutPrograms, ...cputPrograms, ...cutPrograms, ...mutPrograms, ...ulPrograms, ...spuPrograms, ...umpPrograms, ...unisaPrograms, ...smuPrograms, ...unizuluPrograms, ...nmuPrograms];
