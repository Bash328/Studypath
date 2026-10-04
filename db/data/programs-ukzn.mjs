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
// page. Engineering's faculty-wide formula spot-checked via Agricultural and Chemical
// Engineering's own live engineering.ukzn.ac.za pages and confirmed unchanged.
//
// User-supplied brochure pass (2026-10-02, see ukzn-user-brochure-2026-10-02 in
// research-log.mjs): the user supplied UKZN's own "Undergraduate Degree Requirements
// Guide" PDF, which covers every college in one document. Cross-checked against it and
// found three real corrections (Engineering Access Programme is 5 years not 3; Optometry
// was missing English/LO and wrongly required both Life and Physical Sciences instead of
// either; BSc Computer Science & IT's English/Life Orientation conflict now favours level
// 4, 2-1) plus added Foundation Phase subject detail to the BEd row. Also surfaced
// programmes not yet in this file at all - Architectural Studies and eight Health
// Sciences programmes (Audiology, Speech-Language Therapy, Dental Therapy, Dietetics &
// Human Nutrition, Medical Science: Anatomy, Medical Science: Physiology, Occupational
// Therapy, Oral Hygiene, Sport Science) - logged as a finding for a future pass rather
// than added now.

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
  notes: flag('dated-document', 'The published APS range is 48-33. CONFIRMED 2026-10-02 for every discipline: a user-supplied copy of UKZN’s own Undergraduate Degree Requirements Guide lists Agricultural, Chemical, Civil, Computer, Electrical, Electronic and Mechanical Engineering as one merged table row sharing this exact entry text and APS range - so this is UKZN’s own stated position that all seven share the formula, not just an inference from Agricultural and Chemical’s own pages (both separately confirmed live, 2026-10-02). ' + DATED),
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
    faculty: 'Agriculture, Engineering & Science', duration_years: 5, min_aps: null,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)],
    notes: flag('dated-document', 'CORRECTED 2026-10-02: a user-supplied copy of UKZN’s own Undergraduate Degree Requirements Guide states this programme is 5 years, not the 3 we previously showed. No APS is published for the Access Programme. ' + DATED) },

  { ...base, id: 'ukzn-bsc-compsci', career_id: 'software-engineer', name: 'BSc Computer Science & Information Technology',
    faculty: 'Agriculture, Engineering & Science', duration_years: 3, min_aps: 30,
    subject_requirements: [lvl('Mathematics', 5), lvl('English', 4), lvl('Life Orientation', 4),
      manual('A science subject', 'Agricultural Science, Life Sciences or Physical Science at level 4.')],
    notes: flag('conflict', 'CORRECTED 2026-10-02: a prior pass found UKZN’s own School of Mathematics, Statistics & Computer Science page (via web search, not a raw fetch) stating English and Life Orientation at level 5, and switched to that figure over the 2026 Study@UKZN brochure’s level 4. A user-supplied copy of UKZN’s own Undergraduate Degree Requirements Guide now gives a third reading, and it agrees with the original brochure: English and Life Orientation at level 4. With two official UKZN documents now saying level 4 against one school-page search result saying level 5, we show level 4 as the majority reading but flag the conflict rather than discard the school page’s figure outright. Mathematics (level 5) and the APS range (48-30) are unchanged across all three sources.') },

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
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), anyOf(lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'CORRECTED 2026-10-02: a user-supplied copy of UKZN’s own Undergraduate Degree Requirements Guide shows English and Life Orientation at level 4 are also required (previously missing here), and that Life Sciences and Physical Sciences are an either/or choice, not both required as this row previously showed. The published APS range is 48-33. UKZN does not appear to offer a BDS; the brochure lists Dental Therapy instead. ' + DATED) },

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
    subject_requirements: [engLvl(4, 4), manual('Varies by phase', 'Foundation Phase (Grade R-3) also needs another official SA language at Home/First Additional Language level 4 and Mathematics level 3 or Mathematical Literacy level 4. Intermediate (Grade 4-6) and Senior/FET (Grade 7-12) need level 5 in two further subjects relevant to your chosen teaching package instead - see UKZN’s own guide for the exact list per package.')],
    notes: 'ADDED DETAIL 2026-10-02 from a user-supplied copy of UKZN’s own Undergraduate Degree Requirements Guide: the three phases share English Home/First Additional Language level 4 and this APS range (48-28), but differ in their other subject requirements - see the Foundation Phase detail above. A Matriculation Exemption route exists for all three phases via an NQF Level 4 National Certificate (Vocational) with a Bachelor’s-grade endorsement, considered through selection criteria at 32 points.' },
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

  // ---- Added 2026-10-04 from the Study@UKZN 2026 brochure tables (programmes not previously captured) ----
  { ...base, id: 'ukzn-audiology', career_id: 'audiologist', name: 'Bachelor of Audiology', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 3), anyOf(lvl('Life Sciences', 3), lvl('Physical Sciences', 3))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-W-BPA); published APS range 48-30. First to third choice only. ' + DATED) },
  { ...base, id: 'ukzn-speech-language-therapy', career_id: 'speech-therapist', name: 'Bachelor of Speech-Language Therapy', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 3), anyOf(lvl('Life Sciences', 3), lvl('Physical Sciences', 3))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-W-BPB); published APS range 48-30. First to third choice only. ' + DATED) },
  { ...base, id: 'ukzn-dental-therapy', career_id: 'oral-hygienist', name: 'Bachelor of Dental Therapy', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 3), lvl('Life Sciences', 3)],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-W-BDT); published APS range 48-30. First to third choice only. The brochure prints levels only for Life Orientation (4) and Mathematics (3); English at 4 and Life Sciences at 3 follow UKZN’s other health rows and should be checked. ' + DATED) },
  { ...base, id: 'ukzn-oral-hygiene', career_id: 'oral-hygienist', name: 'Bachelor of Oral Hygiene', faculty: 'Health Sciences',
    duration_years: 3, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 3), lvl('Life Sciences', 3)],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-W-BON); published APS range 48-30. First to third choice only. The brochure prints levels only for Life Orientation (4) and Mathematics (3); English at 4 and Life Sciences at 3 follow UKZN’s other health rows and should be checked. ' + DATED) },
  { ...base, id: 'ukzn-dietetics', career_id: 'dietitian', name: 'BSc Dietetics and Human Nutrition', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), anyOf(lvl('Agricultural Sciences', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-BSD); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-occupational-therapy', career_id: 'occupational-therapist', name: 'Bachelor of Occupational Therapy', faculty: 'Health Sciences',
    duration_years: 4, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 3), anyOf(lvl('Life Sciences', 3), lvl('Physical Sciences', 3))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-W-BOT); published APS range 48-30. First to third choice only. ' + DATED) },
  { ...base, id: 'ukzn-sport-science', career_id: 'sport-scientist', name: 'Bachelor of Sport Science', faculty: 'Health Sciences',
    duration_years: 3, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 3))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-W-BRT); published APS range 48-30. ' + DATED) },
  { ...base, id: 'ukzn-medical-science-innovation', career_id: null, name: 'Bachelor of Medical Science, Innovation and Entrepreneurship', faculty: 'Health Sciences',
    duration_years: null, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4), lvl('Life Sciences', 4)],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code BMS-IE); published APS range 48-30. First to third choice only. ' + DATED) },
  { ...base, id: 'ukzn-bcom-accounting-extended', career_id: 'chartered-accountant', name: 'BCom Extended Curriculum (Accounting)', faculty: 'Law & Management Studies',
    duration_years: 4, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4)],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-BCO / KN-W-BCO); published APS range 48-28. Only for applicants from quintile 1-3 schools. ' + DATED) },
  { ...base, id: 'ukzn-bcom-general-extended', career_id: 'business-manager', name: 'BCom Extended Curriculum (General)', faculty: 'Law & Management Studies',
    duration_years: 4, min_aps: 26,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 3)],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-BCG / KN-W-BCG); published APS range 48-26. Only for applicants from quintile 1-3 schools. ' + DATED) },
  { ...base, id: 'ukzn-badmin', career_id: 'public-administrator', name: 'Bachelor of Administration', faculty: 'Law & Management Studies',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 3)],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-W-BAD); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-bba', career_id: 'business-manager', name: 'Bachelor of Business Administration (evening classes)', faculty: 'Law & Management Studies',
    duration_years: 3, min_aps: 26,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 3)],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-BBA / KN-W-BBA); published APS range 48-26. The brochure prints the APS range but not the subject levels in a separate cell; the levels shown are those that sit with the Bachelor of Administration row above it. Check with UKZN. ' + DATED) },
  { ...base, id: 'ukzn-bbussc-finance', career_id: 'financial-manager', name: 'Bachelor of Business Science in Finance', faculty: 'Law & Management Studies',
    duration_years: 4, min_aps: 33,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 6)],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-W-B5F); published APS range 48-33. ' + DATED) },
  { ...base, id: 'ukzn-bbussc-investment-science', career_id: 'financial-manager', name: 'Bachelor of Business Science in Investment Science', faculty: 'Law & Management Studies',
    duration_years: 4, min_aps: 33,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 6)],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-W-B5I); published APS range 48-33. ' + DATED) },
  { ...base, id: 'ukzn-llb-part-time', career_id: 'lawyer', name: 'Bachelor of Laws (part-time)', faculty: 'Law & Management Studies',
    duration_years: 6, min_aps: 32,
    subject_requirements: [engLvl(5, 6), anyOf(lvl('Mathematics', 3), lvl('Mathematical Literacy', 5)), lvl('Life Orientation', 4)],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-H-BLZ); published APS range 48-32. English Home Language 5 or First Additional Language 6. Six years part-time. ' + DATED) },
  { ...base, id: 'ukzn-b-architectural-studies', career_id: 'architect', name: 'Bachelor of Architectural Studies', faculty: 'Agriculture, Engineering & Science',
    duration_years: 3, min_aps: 30,
    subject_requirements: [lvl('Mathematics', 5), manual('Portfolio', 'Applicants who meet the minimum are asked to submit a portfolio of original creative work.')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-H-BAR); published APS range 48-30. ' + DATED) },
  { ...base, id: 'ukzn-bscagric-agricultural-economics', career_id: 'agricultural-scientist', name: 'BSc Agriculture: Agricultural Economics', faculty: 'Agriculture, Engineering & Science',
    duration_years: 4, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), anyOf(lvl('Agricultural Sciences', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-SAE); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-b-agricultural-management', career_id: 'agricultural-scientist', name: 'Bachelor of Agricultural Management', faculty: 'Agriculture, Engineering & Science',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), anyOf(lvl('Agricultural Sciences', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-BAQ); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-bscagric-plant-sciences', career_id: 'agricultural-scientist', name: 'BSc Agriculture: Agricultural Plant Sciences', faculty: 'Agriculture, Engineering & Science',
    duration_years: 4, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), anyOf(lvl('Agricultural Sciences', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-SAP); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-bscagric-agribusiness', career_id: 'agricultural-scientist', name: 'BSc Agriculture: Agribusiness', faculty: 'Agriculture, Engineering & Science',
    duration_years: 4, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), anyOf(lvl('Agricultural Sciences', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-BSB); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-bscagric-animal-poultry', career_id: 'agricultural-scientist', name: 'BSc Agriculture: Animal and Poultry Science', faculty: 'Agriculture, Engineering & Science',
    duration_years: 4, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), anyOf(lvl('Agricultural Sciences', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-SAA); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-bscagric-soil-science', career_id: 'agricultural-scientist', name: 'BSc Agriculture: Soil Science', faculty: 'Agriculture, Engineering & Science',
    duration_years: 4, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), anyOf(lvl('Agricultural Sciences', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-BSI); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-bsc-gis-earth-observation', career_id: 'land-surveyor', name: 'BSc Geographic Information Systems and Earth Observation', faculty: 'Agriculture, Engineering & Science',
    duration_years: 3, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 5), anyOf(lvl('Agricultural Sciences', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-BSG); published APS range 48-30. ' + DATED) },
  { ...base, id: 'ukzn-bsc-geological-science', career_id: 'geologist', name: 'BSc Geological Science', faculty: 'Agriculture, Engineering & Science',
    duration_years: 3, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 5), anyOf(lvl('Agricultural Sciences', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-W-BSG); published APS range 48-30. ' + DATED) },
  { ...base, id: 'ukzn-bsc-environmental-science', career_id: 'environmental-scientist', name: 'BSc Environmental Science', faculty: 'Agriculture, Engineering & Science',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), anyOf(lvl('Agricultural Sciences', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-BSS / KN-W-BSS); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-bsc-generic', career_id: 'biologist', name: 'BSc Generic Degree', faculty: 'Agriculture, Engineering & Science',
    duration_years: null, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 4), anyOf(lvl('Agricultural Sciences', 4), lvl('Life Sciences', 4), lvl('Physical Sciences', 4))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-BG4 / KN-W-BG4); published APS range 48-28. The brochure does not list the majors of the generic BSc, only its entry rule. ' + DATED) },
  { ...base, id: 'ukzn-bsc-augmented', career_id: null, name: 'BSc Augmented Programme', faculty: 'Agriculture, Engineering & Science',
    duration_years: 4, min_aps: 26,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), lvl('Mathematics', 3), anyOf(lvl('Agricultural Sciences', 3), lvl('Life Sciences', 3), lvl('Physical Sciences', 3))],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-BS4 / KN-W-BS4); published APS range 48-26. A four-year route with extra support. ' + DATED) },
  { ...base, id: 'ukzn-bsw', career_id: 'social-worker', name: 'Bachelor of Social Work', faculty: 'Humanities',
    duration_years: 4, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), manual('One listed subject', 'One subject from UKZN’s designated list at level 5 (Business Studies, Consumer Studies, Dramatic Arts, Economics, Geography, History, Information Technology, Life Sciences, Mathematics or Mathematical Literacy at level 2, Music, Religion Studies, Visual Arts, or a language at Home or First Additional level 5).')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-H-BSX); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-ba-cultural-heritage-tourism', career_id: 'hospitality-manager', name: 'BA Cultural & Heritage Tourism', faculty: 'Humanities',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), manual('One listed subject', 'One subject from UKZN’s designated list at level 5 (Business Studies, Consumer Studies, Dramatic Arts, Economics, Geography, History, Information Technology, Life Sciences, Mathematics or Mathematical Literacy at level 2, Music, Religion Studies, Visual Arts, or a language at Home or First Additional level 5).')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-H-ABT); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-bsocsci-geography-environmental', career_id: 'environmental-scientist', name: 'BSocSc Geography & Environmental Management', faculty: 'Humanities',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), manual('One listed subject', 'One subject from UKZN’s designated list at level 5 (Business Studies, Consumer Studies, Dramatic Arts, Economics, Geography, History, Information Technology, Life Sciences, Mathematics or Mathematical Literacy at level 2, Music, Religion Studies, Visual Arts, or a language at Home or First Additional level 5).')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-H-SGE / KN-P-SGE); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-ba-philosophy-politics-law', career_id: 'humanities-generalist', name: 'BA Philosophy, Politics and Law', faculty: 'Humanities',
    duration_years: 3, min_aps: 30,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), manual('One listed subject', 'One subject from UKZN’s designated list at level 5 (Business Studies, Consumer Studies, Dramatic Arts, Economics, Geography, History, Information Technology, Life Sciences, Mathematics or Mathematical Literacy at level 2, Music, Religion Studies, Visual Arts, or a language at Home or First Additional level 5).')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-H-ABP / KN-P-ABP); published APS range 48-30. ' + DATED) },
  { ...base, id: 'ukzn-ba-international-studies', career_id: 'humanities-generalist', name: 'BA International Studies', faculty: 'Humanities',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), manual('One listed subject', 'One subject from UKZN’s designated list at level 5 (Business Studies, Consumer Studies, Dramatic Arts, Economics, Geography, History, Information Technology, Life Sciences, Mathematics or Mathematical Literacy at level 2, Music, Religion Studies, Visual Arts, or a language at Home or First Additional level 5).')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-ABI); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-ba-visual-art', career_id: 'artist', name: 'BA Visual Art', faculty: 'Humanities',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), manual('One listed subject', 'One subject from UKZN’s designated list at level 5 (Business Studies, Consumer Studies, Dramatic Arts, Economics, Geography, History, Information Technology, Life Sciences, Mathematics or Mathematical Literacy at level 2, Music, Religion Studies, Visual Arts, or a language at Home or First Additional level 5).')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-AAV); published APS range 48-28. Offered on the Pietermaritzburg campus. ' + DATED) },
  { ...base, id: 'ukzn-bsocsci-government-business-ethics', career_id: 'public-administrator', name: 'BSocSc Government, Business and Ethics', faculty: 'Humanities',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), manual('One listed subject', 'One subject from UKZN’s designated list at level 5 (Business Studies, Consumer Studies, Dramatic Arts, Economics, Geography, History, Information Technology, Life Sciences, Mathematics or Mathematical Literacy at level 2, Music, Religion Studies, Visual Arts, or a language at Home or First Additional level 5).')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-P-SOG); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-bsocsci-housing', career_id: 'urban-planner', name: 'BSocSc Housing', faculty: 'Humanities',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), manual('One listed subject', 'One subject from UKZN’s designated list at level 5 (Business Studies, Consumer Studies, Dramatic Arts, Economics, Geography, History, Information Technology, Life Sciences, Mathematics or Mathematical Literacy at level 2, Music, Religion Studies, Visual Arts, or a language at Home or First Additional level 5).')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-H-SOR); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-ba-music', career_id: 'performer', name: 'BA Music', faculty: 'Humanities',
    duration_years: 3, min_aps: 28,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), manual('One listed subject', 'One subject from UKZN’s designated list at level 5 (Business Studies, Consumer Studies, Dramatic Arts, Economics, Geography, History, Information Technology, Life Sciences, Mathematics or Mathematical Literacy at level 2, Music, Religion Studies, Visual Arts, or a language at Home or First Additional level 5).'), manual('Practical audition', 'Contact the School of Music to arrange an audition for the instrumental or vocal course.')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-H-BAM); published APS range 48-28. ' + DATED) },
  { ...base, id: 'ukzn-ba-music-extended', career_id: 'performer', name: 'BA in Music Extended Curriculum', faculty: 'Humanities',
    duration_years: 4, min_aps: 22,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), manual('Audition and diagnostic tests', 'A practical audition before a panel of music staff, plus diagnostic pre-entrance tests in theory and oral work.')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-H-BMX); published APS range 48-22. After the foundation year, students continue into the standard BA Music curriculum. ' + DATED) },
  { ...base, id: 'ukzn-bsocsci-extended', career_id: 'humanities-generalist', name: 'BSocSc Extended Curriculum (4 years)', faculty: 'Humanities',
    duration_years: 4, min_aps: 20,
    subject_requirements: [lvl('English', 4), lvl('Life Orientation', 4), manual('One listed subject', 'One subject from UKZN’s designated list at level 5 (Business Studies, Consumer Studies, Dramatic Arts, Economics, Geography, History, Information Technology, Life Sciences, Mathematics or Mathematical Literacy at level 2, Music, Religion Studies, Visual Arts, or a language at Home or First Additional level 5).')],
    notes: flag('dated-document', 'Read 2026-10-04 from the table in the Study@UKZN 2026 brochure (CAO code KN-H-SO4 / KN-P-SO4); published APS range 48-20. Only for students from quintile 1-3 schools; students who have attended a university or any tertiary access programme for a semester are not admitted. ' + DATED) },
];
