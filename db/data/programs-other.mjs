import { lvl, pct, engLvl, engPct, anyOf, manual, flag } from './_helpers.mjs';

// UJ, UWC, Rhodes, NWU and UFS - the partially covered universities.
// Each block carries its own caveat, because each was blocked in a different way.

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

export const otherPrograms = [...ujPrograms, ...uwcPrograms, ...ruWithLO, ...nwuPrograms, ...ufsPrograms];
