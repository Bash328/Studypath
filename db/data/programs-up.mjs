import { lvl, pct, engLvl, engPct, flag, anyOf, manual } from './_helpers.mjs';

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
const EMS_CONFIRMED = 'Confirmed against the user-supplied EMS 2027 Faculty Brochure. ' + CLOSING;

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
    faculty: 'Engineering, Built Environment & IT', duration_years: 3, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'Confirmed against the user-supplied EBIT 2027 Faculty Yearbook (programme code 12133215). ' + CLOSING },
  { ...base, id: 'up-bis', career_id: 'information-systems', name: 'Bachelor of Information Science',
    faculty: 'Engineering, Built Environment & IT', duration_years: 3, min_aps: 28,
    subject_requirements: [engLvl(4, 4), manual('Mathematics', 'No Mathematics minimum for the general stream - but if Informatics is chosen as a first-year elective, Mathematics level 5 is required.')],
    notes: 'From the user-supplied EBIT 2027 Faculty Yearbook (programme code 12131012). ' + CLOSING },
  { ...base, id: 'up-bis-multimedia', career_id: 'information-systems', name: 'Bachelor of Information Science specialising in Multimedia',
    faculty: 'Engineering, Built Environment & IT', duration_years: 3, min_aps: 30,
    subject_requirements: [engLvl(4, 4), lvl('Mathematics', 5)],
    notes: 'From the user-supplied EBIT 2027 Faculty Yearbook (programme code 12131013). ' + CLOSING },
  { ...base, id: 'up-bis-publishing', career_id: 'information-systems', name: 'Bachelor of Information Science specialising in Publishing',
    faculty: 'Engineering, Built Environment & IT', duration_years: 3, min_aps: 28,
    subject_requirements: [engLvl(5, 5)],
    notes: 'From the user-supplied EBIT 2027 Faculty Yearbook (programme code 12131014). ' + CLOSING },
  { ...base, id: 'up-btrp', career_id: 'urban-planner', name: 'Bachelor of Town and Regional Planning',
    faculty: 'Engineering, Built Environment & IT', duration_years: 4, min_aps: 27,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4)],
    notes: 'From the user-supplied EBIT 2027 Faculty Yearbook (programme code 12132026). ' + CLOSING },
  { ...base, id: 'up-bsc-construction-management', career_id: 'quantity-surveyor', name: 'BSc Construction Management',
    faculty: 'Engineering, Built Environment & IT', duration_years: 3, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), anyOf(lvl('Physical Sciences', 4), lvl('Accounting', 4))],
    notes: 'From the user-supplied EBIT 2027 Faculty Yearbook (programme code 12132034). ' + CLOSING },
  { ...base, id: 'up-bsc-quantity-surveying', career_id: 'quantity-surveyor', name: 'BSc Quantity Surveying',
    faculty: 'Engineering, Built Environment & IT', duration_years: 3, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), anyOf(lvl('Physical Sciences', 4), lvl('Accounting', 4))],
    notes: 'From the user-supplied EBIT 2027 Faculty Yearbook (programme code 12132032). ' + CLOSING },
  { ...base, id: 'up-bsc-real-estate', career_id: 'quantity-surveyor', name: 'BSc Real Estate',
    faculty: 'Engineering, Built Environment & IT', duration_years: 3, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), anyOf(lvl('Physical Sciences', 4), lvl('Accounting', 4))],
    notes: 'From the user-supplied EBIT 2027 Faculty Yearbook (programme code 12132033) - leads to registration as a professional property valuer after an Honours year, not quantity surveying, but no dedicated career page exists for that yet. ' + CLOSING },
  { ...base, id: 'up-bcom-information-systems', career_id: 'information-systems', name: 'BCom specialising in Information Systems',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'CORRECTED 2026-10-02 against the user-supplied EMS 2027 Faculty Brochure: this is an EMS-faculty Commerce degree (previously mislabelled under Engineering/IT), the only one in South Africa internationally endorsed by ABET’s Computing Accreditation Commission. 3 years. ' + CLOSING },
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

  // ---------------- Veterinary Science ----------------
  { ...base, id: 'up-bvsc', career_id: 'veterinarian', name: 'BVSc (Veterinary Science)', faculty: 'Veterinary Science',
    duration_years: 6, min_aps: 35,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), lvl('Physical Sciences', 5)],
    notes: flag('selection', 'Confirmed against the user-supplied Veterinary Science 2027 Faculty Yearbook. The only BVSc offered by a South African public university. Closes 31 May - earlier than every other UP programme, including the rest of Health Sciences.') },

  // ---------------- Economic & Management Sciences ----------------
  // Cross-checked 2026-10-02 against the user-supplied EMS 2027 Faculty Brochure (see
  // up-ems-brochure-2026-10-02 in research-log.mjs): the five rows already here all
  // matched exactly, just missing duration_years (every EMS programme below is 3 years
  // unless noted). The brochure also names several specialisations not previously
  // captured, added below where a career page already exists to point them at; three
  // (Public Administration & International Relations, Human Resource Management,
  // Marketing Management) have no matching career page yet and are logged as a gap
  // instead of guessed into an ill-fitting one.
  { ...base, id: 'up-bcom-accounting-sciences', career_id: 'chartered-accountant', name: 'BCom Accounting Sciences',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 34,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6)], notes: EMS_CONFIRMED },
  { ...base, id: 'up-bcom-investment', career_id: 'financial-manager', name: 'BCom specialising in Investment Management',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 34,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6)], notes: EMS_CONFIRMED },
  { ...base, id: 'up-bcom-economics', career_id: 'economist', name: 'BCom specialising in Economics',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 32,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)], notes: EMS_CONFIRMED },
  { ...base, id: 'up-bcom-financial-management', career_id: 'financial-manager', name: 'BCom specialising in Financial Management Sciences',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 32,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)], notes: EMS_CONFIRMED },
  { ...base, id: 'up-bcom-3year', career_id: 'business-manager', name: 'BCom (3-year, general)',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4)], notes: EMS_CONFIRMED },
  { ...base, id: 'up-bcom-4year', career_id: 'business-manager', name: 'BCom (4-year, extended)',
    faculty: 'Economic & Management Sciences', duration_years: 4, min_aps: 26,
    subject_requirements: [engLvl(4, 4), lvl('Mathematics', 3)],
    notes: 'A foundation-year entry route for applicants who don’t meet the 3-year programme’s minimum, with selection criteria beyond the figures shown here. ' + EMS_CONFIRMED },
  { ...base, id: 'up-bcom-agribusiness', career_id: 'agricultural-scientist', name: 'BCom specialising in Agribusiness Management',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'Presented jointly with UP’s Faculty of Natural and Agricultural Sciences. ' + EMS_CONFIRMED },
  { ...base, id: 'up-bcom-business-management', career_id: 'business-manager', name: 'BCom specialising in Business Management',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4)], notes: EMS_CONFIRMED },
  { ...base, id: 'up-bcom-econometrics', career_id: 'economist', name: 'BCom specialising in Econometrics',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 32,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6)],
    notes: 'A higher Mathematics bar (level 6) than the general BCom Economics specialisation above (level 5) - distinct programmes, not the same one twice. ' + EMS_CONFIRMED },
  { ...base, id: 'up-bcom-law', career_id: 'lawyer', name: 'BCom specialising in Law',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 32,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'A Commerce degree with law modules, not the direct LLB (see up-llb below, which needs a higher APS and no Mathematics) - lets you register for the 2-year LLB afterwards, the same combined-route pattern seen at other universities. ' + EMS_CONFIRMED },
  { ...base, id: 'up-bcom-statistics-datascience', career_id: 'data-scientist', name: 'BCom specialising in Statistics and Data Science',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 32,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'Presented jointly with UP’s Faculty of Natural and Agricultural Sciences. ' + EMS_CONFIRMED },
  { ...base, id: 'up-bcom-supplychain', career_id: 'supply-chain-logistics', name: 'BCom specialising in Supply Chain Management',
    faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 30,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4)],
    notes: 'UP is the only European Logistics Association National Certification Centre in Sub-Saharan Africa; students can earn a Level 4 cEJLog certificate alongside the degree. ' + EMS_CONFIRMED },

  // ---------------- Law ----------------
  { ...base, id: 'up-llb', career_id: 'lawyer', name: 'LLB', faculty: 'Law', duration_years: 4, min_aps: 35,
    subject_requirements: [engLvl(6, 6)], notes: 'Confirmed against the user-supplied Law 2027 Faculty Yearbook - the only undergraduate qualification this faculty offers (everything else is postgraduate LLM/LLD). ' + CLOSING },

  // ---------------- Natural & Agricultural Sciences ----------------
  // Cross-checked 2026-10-02 against the user-supplied Natural & Agricultural Sciences
  // 2027 Faculty Yearbook (see up-sci-yearbook-2026-10-02 in research-log.mjs): the four
  // rows already here all matched exactly. The yearbook names ~30 more undergraduate BSc/
  // BScAgric streams; added below wherever an existing career page fits, skipped where
  // none does (Consumer Science x2, Food Management x2, Food Science, Entomology, Human
  // Genetics, Human Physiology/Genetics/Psychology, Medical Sciences, Meteorology).
  { ...base, id: 'up-bsc-actuarial', career_id: 'actuary', name: 'BSc Actuarial & Financial Mathematics',
    faculty: 'Natural & Agricultural Sciences', duration_years: 3, min_aps: 36,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 7)], notes: CLOSING },
  ...[
    ['up-bsc-chemistry', 'chemist', 'BSc Chemistry'],
    ['up-bsc-physics', 'physicist', 'BSc Physics'],
    ['up-bsc-geology', 'geologist', 'BSc Geology'],
  ].map(([id, career_id, name]) => ({
    ...base, id, career_id, name, faculty: 'Natural & Agricultural Sciences', duration_years: 3, min_aps: 34,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), lvl('Physical Sciences', 5)],
    notes: 'The UP tables group Chemistry, Physics, Geology and similar BSc streams together at this level. ' + CLOSING,
  })),
  { ...base, id: 'up-bsc-biological', career_id: 'biologist', name: 'BSc Biological Sciences (Biochemistry, Genetics, Microbiology)',
    faculty: 'Natural & Agricultural Sciences', duration_years: 3, min_aps: 32,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), lvl('Physical Sciences', 5)], notes: CLOSING },
  ...[
    ['up-bsc-applied-maths', 'mathematician', 'BSc Applied Mathematics', 34, [lvl('Mathematics', 6)]],
    ['up-bsc-mathematical-stats', 'mathematician', 'BSc Mathematical Statistics', 34, [lvl('Mathematics', 6)]],
    ['up-bsc-mathematics', 'mathematician', 'BSc Mathematics', 34, [lvl('Mathematics', 6)]],
    ['up-bsc-zoology', 'biologist', 'BSc Zoology', 32, [lvl('Mathematics', 5), lvl('Physical Sciences', 5)]],
    ['up-bsc-ecology', 'environmental-scientist', 'BSc Ecology', 32, [lvl('Mathematics', 5), lvl('Physical Sciences', 5)]],
    ['up-bsc-plant-science', 'agricultural-scientist', 'BSc Plant Science', 32, [lvl('Mathematics', 5), lvl('Physical Sciences', 5)]],
    ['up-bsc-biotechnology', 'biologist', 'BSc Biotechnology', 32, [lvl('Mathematics', 5), lvl('Physical Sciences', 5)]],
    ['up-bsc-human-physiology', 'biologist', 'BSc Human Physiology', 32, [lvl('Mathematics', 5), lvl('Physical Sciences', 5)]],
    ['up-bsc-geoinformatics', 'land-surveyor', 'BSc Geoinformatics', 34, [lvl('Mathematics', 5), lvl('Physical Sciences', 5)]],
    ['up-bsc-geography', 'environmental-scientist', 'BSc Geography (Geography and Environmental Science)', 34, [lvl('Mathematics', 5), lvl('Physical Sciences', 5)]],
    ['up-bsc-env-eng-geology', 'geologist', 'BSc Environmental and Engineering Geology', 34, [lvl('Mathematics', 5), lvl('Physical Sciences', 5)]],
  ].map(([id, career_id, name, min_aps, extraSubjects]) => ({
    ...base, id, career_id, name, faculty: 'Natural & Agricultural Sciences', duration_years: 3, min_aps,
    subject_requirements: [engLvl(5, 5), ...extraSubjects],
    notes: 'From the user-supplied Natural & Agricultural Sciences 2027 Faculty Yearbook. ' + CLOSING,
  })),
  ...[
    ['up-bscagric-animal-science', 'BScAgric in Animal Science'],
    ['up-bscagric-agribusiness', 'BScAgric in Agricultural Economics (Agribusiness Management)'],
    ['up-bscagric-plant-soil', 'BScAgric in Applied Plant and Soil Sciences'],
    ['up-bscagric-plant-pathology', 'BScAgric in Plant Pathology'],
  ].map(([id, name]) => ({
    ...base, id, career_id: 'agricultural-scientist', name, faculty: 'Natural & Agricultural Sciences',
    duration_years: 4, min_aps: 32,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), lvl('Physical Sciences', 5)],
    notes: 'From the user-supplied Natural & Agricultural Sciences 2027 Faculty Yearbook - a 5-year extended version also exists for Applied Plant and Soil Sciences and Plant Pathology, not shown as its own row. ' + CLOSING,
  })),

  // ---------------- Education & Humanities ----------------
  { ...base, id: 'up-bed', career_id: 'teacher', name: 'BEd (all phases)', faculty: 'Education',
    duration_years: 4, min_aps: 28, subject_requirements: [engLvl(4, 4)],
    notes: 'Confirmed against the user-supplied Education 2027 Faculty Brochure: all four BEd phases (Early Childhood Care and Education, Foundation, Intermediate, Senior Phase & FET) share this exact APS and English requirement, each a 4-year degree. The Faculty also offers a 1-year (contact) or 2-year (online) Higher Certificate in Sports Sciences at a lower APS 20, not shown as its own row here. ' + CLOSING },
  { ...base, id: 'up-ba', career_id: 'humanities-generalist', name: 'BA', faculty: 'Humanities',
    duration_years: null, min_aps: 30, subject_requirements: [engLvl(5, 5)], notes: CLOSING },
  { ...base, id: 'up-ba-psychology', career_id: 'clinical-psychologist', name: 'BA (with Psychology as a major)', faculty: 'Humanities',
    duration_years: null, min_aps: 30, subject_requirements: [engLvl(5, 5)],
    notes: flag('unverified', 'UP’s official table does not list Psychology as its own admission line - like most SA universities, you’re admitted to the general BA (shown here) and choose Psychology as a major from second year. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise. ' + CLOSING) },
  { ...base, id: 'up-ba-psychology-counselling', career_id: 'counselling-educational-psychologist', name: 'BA (with Psychology as a major)', faculty: 'Humanities',
    duration_years: null, min_aps: 30, subject_requirements: [engLvl(5, 5)],
    notes: flag('unverified', 'UP’s official table does not list Psychology as its own admission line - you’re admitted to the general BA (shown here) and choose Psychology as a major from second year. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise. ' + CLOSING) },
  { ...base, id: 'up-ba-journalism', career_id: 'journalist-communications', name: 'BA (with a Journalism/Communications-related major)', faculty: 'Humanities',
    duration_years: null, min_aps: 30, subject_requirements: [engLvl(5, 5)],
    notes: flag('unverified', 'UP’s official table does not list Journalism as its own admission line - you’re admitted to the general BA (shown here) and choose your major from second year. Confirm which specific major UP offers in this area before relying on it. ' + CLOSING) },
  { ...base, id: 'up-ba-audiology', career_id: 'audiologist', name: 'BA Audiology', faculty: 'Humanities',
    duration_years: null, min_aps: 32, subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4)], notes: CLOSING },
  { ...base, id: 'up-ba-slp', career_id: 'speech-therapist', name: 'BA Speech-Language Pathology', faculty: 'Humanities',
    duration_years: null, min_aps: 32, subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4)], notes: CLOSING },
];
