import { lvl, pct, engLvl, engPct, flag } from './_helpers.mjs';

// University of Pretoria, 2027 intake.
// UP APS = 6 subjects, EXCLUDING Life Orientation, on NSC achievement levels.
// Subject requirements below are NSC achievement levels unless shown as a percentage.
//
// Durations are only recorded where the UP tables state them. Where UP does not state
// a duration we leave it null rather than filling in the usual number.

const TABLES = 'https://drupalwebprod-files.up.ac.za/Public/2026-03/UP_DESA_Application%20requirements%20tables_2027_web.pdf?VersionId=vw30gCBk2BMAXzOhFSBflmkFOHOMFOoa';

const base = {
  university_id: 'up',
  source_url: TABLES,
  scoring_system: 'UP_APS_exLO',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: '2026-03-01',
};

const CLOSING = 'Most UP closing dates are 30 June; Veterinary Science closes 31 May. Grade 12 applicants apply with their final Grade 11 results.';

const beng = (id, career_id, name) => ({
  ...base, id, career_id, name, faculty: 'Engineering, Built Environment & IT', duration_years: 4, min_aps: 35,
  subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6), lvl('Physical Sciences', 6)],
  notes: CLOSING + ' A 5-year extended BEng route (previously ENGAGE) exists at APS 33 with English, Mathematics and Physical Sciences at 65%.',
});

export const upPrograms = [
  // ---------------- Engineering, Built Environment & IT ----------------
  beng('up-beng-chemical', 'chemical-engineer', 'BEng Chemical Engineering'),
  beng('up-beng-civil', 'civil-engineer', 'BEng Civil Engineering'),
  beng('up-beng-computer', 'software-engineer', 'BEng Computer Engineering'),
  beng('up-beng-electrical', 'electrical-engineer', 'BEng Electrical Engineering'),
  beng('up-beng-electronic', 'electrical-engineer', 'BEng Electronic Engineering'),
  beng('up-beng-industrial', 'industrial-engineer', 'BEng Industrial Engineering'),
  beng('up-beng-mechanical', 'mechanical-engineer', 'BEng Mechanical Engineering'),
  beng('up-beng-metallurgical', 'mining-engineer', 'BEng Metallurgical Engineering'),
  beng('up-beng-mining', 'mining-engineer', 'BEng Mining Engineering'),

  { ...base, id: 'up-beng-5year', career_id: 'civil-engineer', name: 'BEng 5-year programme (previously ENGAGE)',
    faculty: 'Engineering, Built Environment & IT', duration_years: 5, min_aps: 33,
    subject_requirements: [engPct(65, 65), pct('Mathematics', 65), pct('Physical Sciences', 65)],
    notes: 'An extended route into any BEng discipline for students who meet these requirements but not the 4-year entry level. ' + CLOSING },

  { ...base, id: 'up-bsc-compsci', career_id: 'software-engineer', name: 'BSc Computer Science',
    faculty: 'Engineering, Built Environment & IT', duration_years: null, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6)], notes: CLOSING },
  { ...base, id: 'up-bsc-it', career_id: 'information-systems', name: 'BSc Information Technology (Information & Knowledge Systems)',
    faculty: 'Engineering, Built Environment & IT', duration_years: null, min_aps: 30,
    subject_requirements: [engLvl(4, 4), lvl('Mathematics', 6)], notes: CLOSING },
  { ...base, id: 'up-bit', career_id: 'information-systems', name: 'BIT (Information Technology)',
    faculty: 'Engineering, Built Environment & IT', duration_years: null, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)], notes: CLOSING },
  { ...base, id: 'up-bcom-information-systems', career_id: 'information-systems', name: 'BCom Informatics (Information Systems)',
    faculty: 'Engineering, Built Environment & IT', duration_years: null, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)], notes: CLOSING },
  { ...base, id: 'up-bsc-architecture', career_id: 'architect', name: 'BSc Architecture',
    faculty: 'Engineering, Built Environment & IT', duration_years: null, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag('selection', 'BSc Architecture is a selection programme - meeting the minimum does not guarantee a place. ' + CLOSING) },

  // ---------------- Health Sciences (all selection programmes) ----------------
  { ...base, id: 'up-mbchb', career_id: 'doctor', name: 'MBChB (Medicine)', faculty: 'Health Sciences',
    duration_years: null, min_aps: 35,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6), lvl('Physical Sciences', 5)],
    notes: flag('selection', 'All UP Health Sciences programmes are selection programmes - meeting the minimum does not guarantee a place. ' + CLOSING) },
  { ...base, id: 'up-bds', career_id: 'dentist', name: 'BDS (Dentistry)', faculty: 'Health Sciences',
    duration_years: null, min_aps: 35,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6), lvl('Physical Sciences', 5)],
    notes: flag('selection', 'A selection programme. ' + CLOSING) },
  ...[
    ['up-physio', 'physiotherapist', 'BPhysT (Physiotherapy)'],
    ['up-ot', 'occupational-therapist', 'BOccTher (Occupational Therapy)'],
    ['up-radiography', 'radiographer', 'BRad (Radiography)'],
  ].map(([id, career_id, name]) => ({
    ...base, id, career_id, name, faculty: 'Health Sciences', duration_years: null, min_aps: 30,
    subject_requirements: [engLvl(4, 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag('selection', 'A selection programme. ' + CLOSING),
  })),
  { ...base, id: 'up-nursing', career_id: 'nurse', name: 'BNurs (Nursing Science)', faculty: 'Health Sciences',
    duration_years: null, min_aps: 28,
    subject_requirements: [engLvl(4, 4), lvl('Mathematics', 4), lvl('Life Sciences', 4)],
    notes: flag('selection', 'A selection programme. ' + CLOSING) },
  { ...base, id: 'up-dietetics', career_id: 'dietitian', name: 'BSc Dietetics', faculty: 'Health Sciences',
    duration_years: null, min_aps: 28,
    subject_requirements: [engLvl(4, 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag('selection', 'A selection programme. ' + CLOSING) },
  { ...base, id: 'up-oral-hygiene', career_id: 'oral-hygienist', name: 'BOH (Oral Hygiene)', faculty: 'Health Sciences',
    duration_years: null, min_aps: 25,
    subject_requirements: [engLvl(4, 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag('selection', 'A selection programme. ' + CLOSING) },

  // ---------------- Economic & Management Sciences ----------------
  { ...base, id: 'up-bcom-accounting-sciences', career_id: 'chartered-accountant', name: 'BCom Accounting Sciences',
    faculty: 'Economic & Management Sciences', duration_years: null, min_aps: 34,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6)], notes: CLOSING },
  { ...base, id: 'up-bcom-investment', career_id: 'financial-manager', name: 'BCom Investment Management',
    faculty: 'Economic & Management Sciences', duration_years: null, min_aps: 34,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6)], notes: CLOSING },
  { ...base, id: 'up-bcom-economics', career_id: 'economist', name: 'BCom Economics',
    faculty: 'Economic & Management Sciences', duration_years: null, min_aps: 32,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)], notes: CLOSING },
  { ...base, id: 'up-bcom-financial-management', career_id: 'financial-manager', name: 'BCom Financial Management',
    faculty: 'Economic & Management Sciences', duration_years: null, min_aps: 32,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)], notes: CLOSING },
  { ...base, id: 'up-bcom-3year', career_id: 'business-manager', name: 'BCom (3-year)',
    faculty: 'Economic & Management Sciences', duration_years: null, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4)], notes: CLOSING },

  // ---------------- Law ----------------
  { ...base, id: 'up-llb', career_id: 'lawyer', name: 'LLB', faculty: 'Law', duration_years: null, min_aps: 35,
    subject_requirements: [engLvl(6, 6)], notes: CLOSING },

  // ---------------- Natural & Agricultural Sciences ----------------
  { ...base, id: 'up-bsc-actuarial', career_id: 'actuary', name: 'BSc Actuarial & Financial Mathematics',
    faculty: 'Natural & Agricultural Sciences', duration_years: null, min_aps: 36,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 7)], notes: CLOSING },
  ...[
    ['up-bsc-chemistry', 'chemist', 'BSc Chemistry'],
    ['up-bsc-physics', 'physicist', 'BSc Physics'],
    ['up-bsc-geology', 'geologist', 'BSc Geology'],
  ].map(([id, career_id, name]) => ({
    ...base, id, career_id, name, faculty: 'Natural & Agricultural Sciences', duration_years: null, min_aps: 34,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), lvl('Physical Sciences', 5)],
    notes: 'The UP tables group Chemistry, Physics, Geology and similar BSc streams together at this level. ' + CLOSING,
  })),
  { ...base, id: 'up-bsc-biological', career_id: 'biologist', name: 'BSc Biological Sciences (Biochemistry, Genetics, Microbiology)',
    faculty: 'Natural & Agricultural Sciences', duration_years: null, min_aps: 32,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), lvl('Physical Sciences', 5)], notes: CLOSING },

  // ---------------- Education & Humanities ----------------
  { ...base, id: 'up-bed', career_id: 'teacher', name: 'BEd (all phases)', faculty: 'Education',
    duration_years: null, min_aps: 28, subject_requirements: [engLvl(4, 4)], notes: CLOSING },
  { ...base, id: 'up-ba', career_id: 'humanities-generalist', name: 'BA', faculty: 'Humanities',
    duration_years: null, min_aps: 30, subject_requirements: [engLvl(5, 5)], notes: CLOSING },
  { ...base, id: 'up-ba-audiology', career_id: 'audiologist', name: 'BA Audiology', faculty: 'Humanities',
    duration_years: null, min_aps: 32, subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4)], notes: CLOSING },
  { ...base, id: 'up-ba-slp', career_id: 'speech-therapist', name: 'BA Speech-Language Pathology', faculty: 'Humanities',
    duration_years: null, min_aps: 32, subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4)], notes: CLOSING },
];
