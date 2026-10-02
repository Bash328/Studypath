import { lvl, pct, engLvl, anyOf, manual, flag } from './_helpers.mjs';

// University of KwaZulu-Natal.
//
// TWO caveats apply to every row here, and the UI shows both:
//
// 1. The most recent official source we could find is the Study@UKZN 2026 brochure.
//    No 2027 table was published at the time of research, so intake_year is left null
//    and every row is flagged [dated-document].
// 2. UKZN's APS runs on levels 1-8 across 6 subjects excluding Life Orientation
//    (maximum 48): 90-100% = 8, 80-89% = 7 ... 0-29% = 1. That table was read from
//    UKZN's own 2026 College handbook, so the calculator now computes it - see
//    src/scoring-audit.js for the sources.
//
// Spot-check pass (2026-10-01, see ukzn-2027-table in research-log.mjs): MBChB, LLB and
// BCom Accounting were re-checked against their live ukzn.ac.za pages (direct fetches
// succeeded for chs.ukzn.ac.za and commerce.ukzn.ac.za; the School of Computer Science's
// own subdomain did not resolve, so that one is a web-search check instead) and found
// unchanged in APS - MBChB and BCom Accounting are now cited to those current pages.
// BSc Computer Science & IT's English/Life Orientation levels turned out to be higher
// (level 5, not 4) on its own school's page than in the 2026 brochure - a genuine
// conflict, shown via flag('conflict', ...) rather than silently resolved.
//
// Follow-up pass (2026-10-02, see ukzn-engineering-bcom-2026-10-02 in research-log.mjs):
// BCom General re-checked and confirmed unchanged against its own live clms.ukzn.ac.za
// page. Engineering's faculty-wide formula spot-checked via Agricultural Engineering's
// own live engineering.ukzn.ac.za page and confirmed unchanged; other engineering
// disciplines' own pages don't publish their figures yet, so they still rest on the
// brochure/faculty-wide convention rather than their own confirmed page.

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
  notes: flag('dated-document', 'The published APS range is 48-33. Spot-checked 2026-10-02 via a direct fetch of Agricultural Engineering’s own live discipline page (engineering.ukzn.ac.za), which confirmed this exact formula unchanged - other disciplines’ own pages (e.g. Civil Engineering’s) don’t yet show their own admission figures ("currently being uploaded"), so they’re shown on the same faculty-wide formula rather than their own confirmed page. ' + DATED),
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
    source_url: 'https://wp-smscs.ukzn.ac.za/computer-science/',
    subject_requirements: [lvl('Mathematics', 5), lvl('English', 5), lvl('Life Orientation', 5),
      manual('A science subject', 'Agricultural Science, Life Sciences or Physical Science at level 4.')],
    notes: flag(['conflict', 'dated-document'], 'CONFLICT found in a 2026-10-01 spot-check: UKZN’s own School of Mathematics, Statistics & Computer Science page (via web search, not a raw fetch - its domain did not resolve for this pass’s fetch tool) states English and Life Orientation at level 5, not the level 4 the 2026 Study@UKZN brochure gives - Mathematics (level 5) and the APS range (48-30) are unchanged between the two sources. We show the school page’s level 5 figures as the more specific, programme-level source. ' + DATED) },

  // ---------------- Health Sciences ----------------
  { ...base, id: 'ukzn-mbchb', career_id: 'doctor', name: 'MBChB (Medicine)', faculty: 'Health Sciences',
    duration_years: 6, min_aps: null,
    source_url: 'https://chs.ukzn.ac.za/undergraduate-progra/bachelor-of-medicine-and-bachelor-of-surgery-mbchb/',
    subject_requirements: [lvl('Mathematics', 5), lvl('Physical Sciences', 5), lvl('Life Sciences', 5), lvl('English', 5),
      lvl('Life Orientation', 4), manual('Aggregate', 'An overall aggregate of 65% is required.')],
    notes: flag('no-cutoff-published', 'UKZN publishes no APS for MBChB - entry is by the subject levels and aggregate shown. Applications close 30 June. Confirmed unchanged by a direct fetch of UKZN’s own College of Health Sciences page (2026-10-01 spot-check).') },

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
    notes: flag('dated-document', 'A 2026-10-01 spot-check via web search found these same figures (APS 32, subject levels) still quoted, plus a lower 28-31 extended-programme band not previously captured - no change found to the standard entry, but this is not a raw page read. ' + DATED) },
  { ...base, id: 'ukzn-bcom-accounting', career_id: 'chartered-accountant', name: 'BCom Accounting', faculty: 'Law & Management Studies',
    duration_years: 3, min_aps: 32,
    source_url: 'https://commerce.ukzn.ac.za/undergraduate/bachelor-of-commerce-in-accounting/',
    subject_requirements: [lvl('Mathematics', 5), lvl('English', 4), lvl('Life Orientation', 4)],
    notes: 'Confirmed unchanged by a direct fetch of UKZN’s own School of Commerce page (2026-10-01 spot-check): "National senior certificate degree with Mathematics level 5, English and Life Orientation level 4. Minimum, 32 NSC points." An Extended Curriculum version also exists at APS 28.' },
  { ...base, id: 'ukzn-bcom-general', career_id: 'business-manager', name: 'BCom General', faculty: 'Law & Management Studies',
    duration_years: 3, min_aps: 30,
    source_url: 'https://clms.ukzn.ac.za/bachelor-of-commerce-general-bcom/',
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4)],
    notes: 'Confirmed unchanged by a direct fetch of UKZN’s own programme page (2026-10-02 spot-check): "NSC Degree with a minimum of 30 NSC points (excluding Life Orientation), Level 4 Mathematics, Level 4 English (home or first additional language), and Level 4 Life Orientation." A Matriculation Exemption route (36 points, Mathematics HG ‘D’ or SG ‘B’) also exists for non-NSC applicants.' },

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
  { ...base, id: 'ukzn-ba-psychology', career_id: 'clinical-psychologist', name: 'BA / BSocSc (with Psychology as a major)', faculty: 'Humanities',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4),
      manual('One listed subject', 'One subject from UKZN’s designated list at level 5.')],
    notes: flag(['dated-document', 'unverified'], 'UKZN does not list Psychology as its own admission line - you’re admitted to the general BA/BSocSc (shown here) and choose Psychology as a major from second year. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise. The published APS range is 48-28. ' + DATED) },
  { ...base, id: 'ukzn-ba-psychology-counselling', career_id: 'counselling-educational-psychologist', name: 'BA / BSocSc (with Psychology as a major)', faculty: 'Humanities',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4),
      manual('One listed subject', 'One subject from UKZN’s designated list at level 5.')],
    notes: flag(['dated-document', 'unverified'], 'UKZN does not list Psychology as its own admission line - you’re admitted to the general BA/BSocSc (shown here) and choose Psychology as a major from second year. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise. The published APS range is 48-28. ' + DATED) },
  { ...base, id: 'ukzn-ba-journalism', career_id: 'journalist-communications', name: 'BA / BSocSc (with a media/communications-related major)', faculty: 'Humanities',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4),
      manual('One listed subject', 'One subject from UKZN’s designated list at level 5.')],
    notes: flag(['dated-document', 'unverified'], 'UKZN does not list Journalism as its own admission line - you’re admitted to the general BA/BSocSc and choose your major from second year. Confirm which specific major UKZN offers in this area before relying on it. The published APS range is 48-28. ' + DATED) },
];
