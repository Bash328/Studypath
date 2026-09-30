import { lvl, pct, engLvl, anyOf, manual, flag } from './_helpers.mjs';

// University of KwaZulu-Natal.
//
// TWO caveats apply to every row here, and the UI shows both:
//
// 1. The most recent official source we could find is the Study@UKZN 2026 brochure.
//    No 2027 table was published at the time of research, so intake_year is left null
//    and every row is flagged [dated-document].
// 2. UKZN's APS runs on levels 1-8 across 6 subjects excluding Life Orientation
//    (maximum 48). The percentage-to-level conversion table for that 8-point scale was
//    NOT captured from an official UKZN source, so we deliberately do not calculate a
//    UKZN score from your marks. We would rather show nothing than a guessed number.
//    See research_log entry ukzn-aps-scale.

const BROCHURE = 'https://studyatukzn.ukzn.ac.za/wp-content/uploads/2026/02/Study@UKZN-BROCHURE-2026.pdf';

const base = {
  university_id: 'ukzn',
  source_url: BROCHURE,
  scoring_system: 'UKZN_APS_exLO',
  score_type: 'minimum',
  intake_year: null,
  document_date: '2026-02-01',
};

const DATED = 'This comes from the Study@UKZN 2026 brochure, the most recent official source we could find. UKZN had not published a 2027 table when we checked, so treat these as 2026 figures pending a 2027 update. Applications go through the CAO.';

const eng = (id, career_id, name) => ({
  ...base, id, career_id, name, faculty: 'Agriculture, Engineering & Science', duration_years: 4, min_aps: 33,
  subject_requirements: [pct('Mathematics', 65), pct('Physical Sciences', 65), lvl('English', 4), lvl('Life Orientation', 4)],
  notes: flag('dated-document', 'The published APS range is 48-33. ' + DATED),
});

export const ukznPrograms = [
  // ---------------- Agriculture, Engineering & Science ----------------
  eng('ukzn-beng-agricultural', 'agricultural-engineer', 'BSc Eng Agricultural Engineering'),
  eng('ukzn-beng-chemical', 'chemical-engineer', 'BSc Eng Chemical Engineering'),
  eng('ukzn-beng-civil', 'civil-engineer', 'BSc Eng Civil Engineering'),
  eng('ukzn-beng-computer', 'software-engineer', 'BSc Eng Computer Engineering'),
  eng('ukzn-beng-electrical', 'electrical-engineer', 'BSc Eng Electrical Engineering'),
  eng('ukzn-beng-electronic', 'electrical-engineer', 'BSc Eng Electronic Engineering'),
  eng('ukzn-beng-mechanical', 'mechanical-engineer', 'BSc Eng Mechanical Engineering'),
  eng('ukzn-bsc-land-surveying', 'land-surveyor', 'BSc Land Surveying'),

  { ...base, id: 'ukzn-eng-access', career_id: 'civil-engineer', name: 'BSc Engineering Access Programme',
    faculty: 'Agriculture, Engineering & Science', duration_years: 3, min_aps: null,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag('dated-document', 'No APS is published for the Access Programme. ' + DATED) },

  { ...base, id: 'ukzn-bsc-compsci', career_id: 'software-engineer', name: 'BSc Computer Science & Information Technology',
    faculty: 'Agriculture, Engineering & Science', duration_years: 3, min_aps: 30,
    subject_requirements: [lvl('Mathematics', 5), lvl('English', 4), lvl('Life Orientation', 4),
      manual('A science subject', 'One science subject at level 4.')],
    notes: flag('dated-document', 'The published APS range is 48-30. ' + DATED) },

  // ---------------- Health Sciences ----------------
  { ...base, id: 'ukzn-mbchb', career_id: 'doctor', name: 'MBChB (Medicine)', faculty: 'Health Sciences',
    duration_years: 6, min_aps: null,
    subject_requirements: [lvl('Mathematics', 5), lvl('Physical Sciences', 5), lvl('Life Sciences', 5), lvl('English', 5),
      lvl('Life Orientation', 4), manual('Aggregate', 'An overall aggregate of 65% is required.')],
    notes: flag(['dated-document', 'no-cutoff-published'], 'UKZN publishes no APS for MBChB - entry is by the subject levels and aggregate shown. Applications close 30 June. Also stated at https://chs.ukzn.ac.za/undergraduate-progra/bachelor-of-medicine-and-bachelor-of-surgery-mbchb/ . ' + DATED) },

  { ...base, id: 'ukzn-pharmacy', career_id: 'pharmacist', name: 'Bachelor of Pharmacy', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 33,
    subject_requirements: [lvl('English', 4), lvl('Life Sciences', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag('dated-document', 'The published APS range is 48-33. ' + DATED) },
  { ...base, id: 'ukzn-physio', career_id: 'physiotherapist', name: 'Bachelor of Physiotherapy', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4)],
    notes: flag('dated-document', 'The published APS range is 48-30. ' + DATED) },
  { ...base, id: 'ukzn-nursing', career_id: 'nurse', name: 'Bachelor of Nursing', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Life Sciences', 4),
      anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 3))],
    notes: flag('dated-document', 'The published APS range is 48-30. ' + DATED) },
  { ...base, id: 'ukzn-optometry', career_id: 'optometrist', name: 'Bachelor of Optometry', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 33,
    subject_requirements: [lvl('Mathematics', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4)],
    notes: flag('dated-document', 'The published APS range is 48-33. UKZN does not appear to offer a BDS; the brochure lists Dental Therapy instead. ' + DATED) },

  // ---------------- Law & Management Studies ----------------
  { ...base, id: 'ukzn-llb', career_id: 'lawyer', name: 'LLB', faculty: 'Law & Management Studies',
    duration_years: 4, min_aps: 32,
    subject_requirements: [engLvl(5, 6), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 5)), lvl('Life Orientation', 4)],
    notes: flag('dated-document', 'The published APS range is 48-32. ' + DATED) },
  { ...base, id: 'ukzn-bcom-accounting', career_id: 'chartered-accountant', name: 'BCom Accounting', faculty: 'Law & Management Studies',
    duration_years: 3, min_aps: 32,
    subject_requirements: [lvl('Mathematics', 5), lvl('English', 4), lvl('Life Orientation', 4)],
    notes: flag('dated-document', 'The published APS range is 48-32. ' + DATED) },
  { ...base, id: 'ukzn-bcom-general', career_id: 'business-manager', name: 'BCom General', faculty: 'Law & Management Studies',
    duration_years: 3, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4)],
    notes: flag('dated-document', 'The published APS range is 48-30. ' + DATED) },

  // ---------------- Humanities ----------------
  { ...base, id: 'ukzn-bed', career_id: 'teacher', name: 'BEd Foundation / Intermediate / Senior-FET Phase', faculty: 'Humanities',
    duration_years: 4, min_aps: 28,
    subject_requirements: [manual('Varies by phase', 'Subject requirements vary by teaching phase - see the UKZN brochure for the phase you want.')],
    notes: flag('dated-document', 'The published APS range is 48-28. ' + DATED) },
  { ...base, id: 'ukzn-ba', career_id: 'humanities-generalist', name: 'BA / BSocSc (General Studies)', faculty: 'Humanities',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4),
      manual('One listed subject', 'One subject from UKZN’s designated list at level 5.')],
    notes: flag('dated-document', 'The published APS range is 48-28. ' + DATED) },
];
