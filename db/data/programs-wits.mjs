import { lvl, pct, engLvl, anyOf, manual, flag } from './_helpers.mjs';

// University of the Witwatersrand.
// Wits APS = the best 7 subjects INCLUDING Life Orientation, on NSC levels, with
// English and Maths getting +2 at level 5 and above, and Life Orientation scoring
// only 4 / 3 / 2 / 1 at levels 8 / 7 / 6 / 5.
//
// Two sources. Source A is the Wits schools-liaison Grade 12 guide, which is headed
// "prospective students for 2026" - every row that rests on it alone is flagged
// [dated-document]. Source B is the individual 2027 course-finder pages, which are
// current. Where both give a figure, they usually agree.
//
// Spot-check pass (2026-10-01, see wits-slo-2026-label in research-log.mjs): Civil,
// Chemical and Electrical Engineering, BCom (General), BSc Computer Science and MBBCh
// were each re-checked against their live course-finder pages (direct fetches succeeded
// for wits.ac.za in this pass) and found unchanged - moved onto Source B. LLB (4-year)
// was also re-checked and is APS-unchanged but has a genuine Mathematics-level conflict
// with the schools-liaison guide, shown via flag('conflict', ...) rather than silently
// resolved. BCom with Law was spot-checked by search only (no working course-finder URL
// found) and is unchanged.
//
// Follow-up pass (2026-10-02, see wits-raw-read-sweep-2026-10-02 in research-log.mjs):
// every remaining Source A row except BCom with Law was re-checked by a direct fetch of
// its own course-finder page and moved onto Source B. Two real corrections came out of
// it: Architectural Studies' true minimum is APS 29 (not the 34 a prior search-synthesis
// pass had shown, with no 29-33 discretionary band - that distinction doesn't exist),
// and Actuarial Science is APS 44 (not 42). BCom with Law remains the one unresolved row
// - the general BCom page gives APS 38, not Law's reported 43, so a Law-major-specific
// page still needs to be found.

const SLO = 'https://www.wits.ac.za/media/wits-university/study/schools-liaison/documents/Wits%20SLO%20Grade%2012_100125.pdf';
const CF = 'https://www.wits.ac.za/course-finder/undergraduate';

const base = {
  university_id: 'wits',
  scoring_system: 'WITS_APS_incLO',
  score_type: 'minimum',
  intake_year: 2027,
};

// Row sourced only from the 2026-labelled schools-liaison guide.
const sourceA = {
  ...base,
  source_url: SLO,
  document_date: '2025-01-10',
};
const datedNote = 'This figure comes from the Wits schools-liaison Grade 12 guide, which is headed for 2026 entry. We have not yet found a 2027 course-finder page confirming it, so treat it as the most recent official figure rather than a confirmed 2027 one.';

const ENG_APS = [engLvl(5, 5), lvl('Mathematics', 5), lvl('Physical Sciences', 5)];
const engNote = 'Wits notes that level 5 across the board means you are likely to be wait-listed; level 6 is advised.';

// Spot-check passes (2026-10-01 and 2026-10-02, see wits-slo-2026-label and
// wits-engineering-raw-read-2026-10-02 in research-log.mjs): every Engineering & the
// Built Environment discipline below has now been confirmed unchanged by a direct
// fetch of its own 2027 course-finder page (APS 42+, English/Mathematics/Physical
// Sciences all Level 5, a Level 5-only applicant is wait-listed) - none remain on the
// dated schools-liaison guide.
const engCF = (id, career_id, name, slug) => ({
  ...base, id, career_id, name,
  faculty: 'Engineering & the Built Environment', duration_years: 4, min_aps: 42,
  source_url: `https://www.wits.ac.za/course-finder/undergraduate/ebe/${slug}/`,
  subject_requirements: ENG_APS,
  notes: engNote + ' Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-01 spot-check).',
});

export const witsPrograms = [
  // ---------------- Engineering & the Built Environment ----------------
  engCF('wits-beng-chemical', 'chemical-engineer', 'BSc (Eng) Chemical Engineering', 'chemical-engineering'),
  engCF('wits-beng-metallurgy', 'mining-engineer', 'BSc (Eng) Metallurgy and Materials Engineering', 'metallurgy-and-materials-engineering'),
  engCF('wits-beng-civil', 'civil-engineer', 'BSc (Eng) Civil Engineering', 'civil-engineering'),
  engCF('wits-beng-electrical', 'electrical-engineer', 'BSc (Eng) Electrical Engineering', 'electrical-engineering'),
  engCF('wits-beng-aeronautical', 'aeronautical-engineer', 'BSc (Eng) Aeronautical Engineering', 'aeronautical-engineering'),
  engCF('wits-beng-industrial', 'industrial-engineer', 'BSc (Eng) Industrial Engineering', 'industrial-engineering'),
  engCF('wits-beng-mining', 'mining-engineer', 'BSc (Eng) Mining Engineering', 'mining-engineering'),
  { ...base, id: 'wits-beng-mechanical', career_id: 'mechanical-engineer', name: 'BSc (Eng) Mechanical Engineering',
    faculty: 'Engineering & the Built Environment', duration_years: 4, min_aps: 42,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/ebe/mechanical-engineering/',
    subject_requirements: ENG_APS,
    notes: engNote + ' These figures are confirmed on the 2027 Mechanical Engineering course-finder page.' },

  { ...base, id: 'wits-biomedical-eng', career_id: 'biomedical-engineer', name: 'BSc (Eng) Biomedical Engineering',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 42,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/ebe/biomedical-engineering/',
    subject_requirements: ENG_APS,
    notes: engNote + ' Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check).' },

  { ...base, id: 'wits-digital-arts', career_id: 'digital-artist', name: 'BEngSc Digital Arts',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 42,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/ebe/digital-arts/',
    subject_requirements: ENG_APS,
    notes: engNote + ' Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check).' },

  // RESOLVED 2026-10-01: Wits's own course-finder page (found via web search, not a raw
  // fetch - this environment's network egress blocks direct fetches to university
  // domains) reconciles the schools-liaison guide (APS 34+) and the BAS FAQ (APS 29) as
  // two bands of the same rule, rather than a real conflict - see the note below.
  { ...base, id: 'wits-bas-architecture', career_id: 'architect', name: 'Bachelor of Architectural Studies',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 29,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/ebe/architectural-studies/',
    subject_requirements: [lvl('Mathematics', 4), engLvl(4, 4),
      manual('Application exercise', 'A written and graphic application exercise is required, and some applicants are invited to an interview; the exercise, interview and Wits APS score are weighted equally in the final decision. No NBT.')],
    notes: flag('selection', 'CORRECTED 2026-10-02 by a direct, verbatim-quoted fetch of the live course-finder page: the minimum is a Wits APS of 29 - there is no 34 "standard" threshold or 29-33 discretionary band. An earlier pass (via web search, not a raw read) had found a 34-vs-29 conflict and resolved it the wrong way round, showing 34 as the qualifying figure; this correction reverses that. Meeting 29 plus the subject minimums does not guarantee a place - admission is ranked against that year’s applicant pool, and places are limited.') },

  { ...base, id: 'wits-urban-planning', career_id: 'urban-planner', name: 'Urban & Regional Planning',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 36,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/ebe/urban-and-regional-planning/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check). APS 30-35 is wait-listed subject to place availability.' },
  { ...base, id: 'wits-construction-studies', career_id: 'quantity-surveyor', name: 'Construction Studies',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 36,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/ebe/construction-studies/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check). APS 30-35 is wait-listed subject to place availability.' },
  { ...base, id: 'wits-property-studies', career_id: 'quantity-surveyor', name: 'Property Studies',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 36,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/ebe/property-studies/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check). APS 30-35 is wait-listed subject to place availability.' },

  // ---------------- Health Sciences (Composite Index, NOT APS) ----------------
  { ...base, id: 'wits-mbbch', career_id: 'doctor', name: 'MBBCh (Medicine)',
    faculty: 'Health Sciences', duration_years: 6, min_aps: null,
    scoring_system: 'WITS_COMPOSITE_INDEX',
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/health/medicine-and-surgery/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5),
      anyOf(lvl('Life Sciences', 5), lvl('Physical Sciences', 5)),
      manual('NBT', 'The NBT must be written in person by 17 August.')],
    notes: flag('no-cutoff-published', 'Wits Health Sciences does not use APS. It uses a Composite Index: 75% school average across 5 subjects and 25% NBT. Wits does not publish the Composite Index cut-off scores, so nobody - including us - can tell you the number you need. Applications close 30 June 2026.') },

  ...[
    ['wits-dental', 'dentist', 'Bachelor of Dental Science', 5, [engLvl(5, 5), lvl('Mathematics', 5), lvl('Life Sciences', 5), lvl('Physical Sciences', 5), manual('Job shadowing', 'Job shadowing is required.')]],
    ['wits-pharmacy', 'pharmacist', 'Bachelor of Pharmacy', 4, [engLvl(5, 5), lvl('Mathematics', 5), lvl('Physical Sciences', 5)]],
    ['wits-physio', 'physiotherapist', 'Bachelor of Physiotherapy', 4, [engLvl(5, 5), lvl('Mathematics', 5), lvl('Physical Sciences', 5), manual('Job shadowing', 'Job shadowing is required.')]],
    ['wits-ot', 'occupational-therapist', 'Bachelor of Occupational Therapy', 4, [engLvl(4, 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)]],
    ['wits-nursing', 'nurse', 'Bachelor of Nursing', 4, [engLvl(4, 4), lvl('Mathematics', 4), lvl('Physical Sciences', 4)]],
    ['wits-clinical-practice', 'clinical-associate', 'Bachelor of Clinical Medical Practice', 3, [engLvl(4, 4), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 7)), lvl('Physical Sciences', 4)]],
    ['wits-oral-health', 'oral-hygienist', 'Bachelor of Oral Health Sciences', 3, [engLvl(4, 4), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 7)), lvl('Physical Sciences', 4)]],
  ].map(([id, career_id, name, duration_years, subject_requirements]) => ({
    ...sourceA, id, career_id, name, faculty: 'Health Sciences', duration_years, min_aps: null,
    scoring_system: 'WITS_COMPOSITE_INDEX', subject_requirements,
    notes: flag(['no-cutoff-published', 'dated-document'], 'Wits Health Sciences uses a Composite Index (75% school average across 5 subjects, 25% NBT), not APS, and does not publish the cut-off scores. ' + datedNote),
  })),

  // ---------------- Commerce, Law & Management ----------------
  { ...base, id: 'wits-bcom-general', career_id: 'business-manager', name: 'BCom General / PPE (all specialisations except those listed separately)',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 38,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/clm/bcom/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-01 spot-check). An APS of 35-37 with English and Mathematics Level 6 may be wait-listed.' },
  { ...base, id: 'wits-bcom-information-systems', career_id: 'information-systems', name: 'BCom Information Systems',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 38,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/clm/information-systems/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'Same APS and subject minimums as the general BCom above (wait-listed at APS 35-37), but Wits gives this specialisation its own course-finder page and programme code (CBA10) - split out here so it points at the right career rather than the generic business one.' },

  { ...base, id: 'wits-bcom-finance', career_id: 'financial-manager', name: 'BCom Finance',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 38,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/clm/finance/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'An APS of 35-37 may be wait-listed.' },

  { ...base, id: 'wits-accounting-science', career_id: 'chartered-accountant', name: 'Bachelor of Accounting Science (CA route)',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 44,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/clm/accounting-science-baccsc/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6)],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check). APS 39-43 with English 6 and Mathematics 6 may be wait-listed.' },
  { ...base, id: 'wits-accounting', career_id: 'chartered-accountant', name: 'BCom Accounting',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 38,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/clm/accounting/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check). APS 35-37 with English 6 and Mathematics 6 may be wait-listed.' },
  { ...base, id: 'wits-economic-science', career_id: 'economist', name: 'Bachelor of Economic Science',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 42,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/clm/economic-science/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 7)],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check). APS 39-41 with English 5 and Mathematics 7 may be wait-listed.' },
  { ...sourceA, id: 'wits-bcom-law', career_id: 'lawyer', name: 'BCom with Law',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 43,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: flag('dated-document', 'A 2026-10-01 spot-check via web search (the exact course-finder URL could not be located) found APS 43+, English Level 5 and Mathematics Level 5 still quoted for this programme - no change found, but this is not a raw page read. ' + datedNote) },
  // CONFLICT found in the 2026-10-01 Wits spot-check: a direct fetch of the 2027
  // course-finder page confirms APS 46+ (unchanged) but gives Mathematics at Level 5,
  // not the Level 4 the 2026 schools-liaison guide states - we show the course-finder's
  // Level 5 since it is the current, directly-fetched official source, and flag the
  // discrepancy rather than silently dropping the older figure.
  { ...base, id: 'wits-llb', career_id: 'lawyer', name: 'LLB (4-year stream)',
    faculty: 'Commerce, Law & Management', duration_years: 4, min_aps: 46,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/clm/llb-law/',
    subject_requirements: [engLvl(6, 6), anyOf(lvl('Mathematics', 5), lvl('Mathematical Literacy', 6))],
    notes: flag('conflict', 'CONFLICT: a direct fetch of the 2027 LLB (LFA14) course-finder page gives Mathematics at Level 5 (or Mathematical Literacy Level 6), but the 2026 schools-liaison guide this row previously rested on states Mathematics Level 4. APS (46+) and the English requirement (Level 6) are unchanged between the two sources. We show the course-finder’s Level 5 as the current, directly-verified figure. An APS of 40-45 with English Level 6 and Mathematics Level 5 (or Mathematical Literacy Level 6) may be wait-listed.') },

  // ---------------- Science (NBT required) ----------------
  { ...base, id: 'wits-bsc-general', career_id: 'biologist', name: 'BSc (General)',
    faculty: 'Science', duration_years: 3, min_aps: 42,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/bsc/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), manual('NBT', 'The NBT is required for Science.')],
    notes: '' },
  { ...base, id: 'wits-bsc-compsci', career_id: 'software-engineer', name: 'BSc Computer Science',
    faculty: 'Science', duration_years: 3, min_aps: 44,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/computer-science/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6), manual('NBT', 'The NBT (AL, QL and Mathematics, in one sitting by 31 October 2026) is required for all Faculty of Science applicants.')],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-01 spot-check). An APS of 41-43 may be wait-listed.' },
  { ...base, id: 'wits-bsc-applied-maths', career_id: 'mathematician', name: 'BSc Computational & Applied Mathematics',
    faculty: 'Science', duration_years: 3, min_aps: 44,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/computational-and-applied-mathematics/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6), manual('NBT', 'The NBT is required for Science.')],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check). APS 41-43 may be wait-listed.' },
  { ...base, id: 'wits-bsc-actuarial', career_id: 'actuary', name: 'BSc Actuarial Science',
    faculty: 'Science', duration_years: 3, min_aps: 44,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/actuarial-science/',
    subject_requirements: [engLvl(7, 7), lvl('Mathematics', 7), lvl('Physical Sciences', 7), manual('NBT', 'The NBT is required for Science.')],
    notes: 'CORRECTED 2026-10-02 by a direct fetch of the live course-finder page: APS 44+, not the 42 the 2026 schools-liaison guide gave. A wait-list band exists at 44+ with English Level 6 instead of 7.' },
  { ...base, id: 'wits-bsc-maths', career_id: 'mathematician', name: 'BSc Mathematical Sciences',
    faculty: 'Science', duration_years: 3, min_aps: 44,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/mathematical-sciences/',
    subject_requirements: [engLvl(7, 7), lvl('Mathematics', 7), lvl('Physical Sciences', 7), manual('NBT', 'The NBT is required for Science.')],
    notes: flag('conflict', 'The 2027 course-finder page (re-confirmed by a direct fetch 2026-10-02) says APS 44+; the 2026 schools-liaison guide says 42+. We show the course-finder figure because it is the more recent, directly-verified official source, but the two do disagree - check with Wits if you are between 42 and 44. A wait-list band exists at 44+ with English Level 6 instead of 7.') },
  { ...base, id: 'wits-bsc-physics', career_id: 'physicist', name: 'BSc Physics',
    faculty: 'Science', duration_years: 3, min_aps: 42,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/physics/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6), lvl('Physical Sciences', 5), manual('NBT', 'The NBT is required for Science.')],
    notes: '' },
  { ...base, id: 'wits-bsc-chem-eng', career_id: 'chemist', name: 'BSc Chemistry with Chemical Engineering',
    faculty: 'Science', duration_years: 3, min_aps: 43,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/chemistry-with-chemical-engineering/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6), lvl('Physical Sciences', 6), manual('NBT', 'The NBT is required for Science.')],
    notes: 'A 3-year BSc (Chemistry), not the 4-year ECSA-accredited BSc(Eng) Chemical Engineering shown elsewhere on this site. Wits’s own course-finder page says graduates can continue into a BScEng in Chemical Engineering with two further years of study - so this is a real route toward becoming a chemical engineer, just not a direct one. Named career reflects what the 3-year BSc alone qualifies you as.' },
  { ...base, id: 'wits-bsc-biological', career_id: 'biologist', name: 'BSc Biological Sciences',
    faculty: 'Science', duration_years: 3, min_aps: 43,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/organismal-biology/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), manual('NBT', 'The NBT is required for Science.')],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check) - "Biological Sciences" is an umbrella entry point covering six majors (Biodiversity/Organismal Biology, Ecology & Conservation, Genetics & Developmental Biology, Microbiology & Biotechnology, Biochemistry & Cell Biology, Applied Bioinformatics), which share this APS. APS 41-42 may be wait-listed.' },

  // ---------------- Humanities & Education ----------------
  // All four BA rows share one entry point, confirmed unchanged by a direct fetch of
  // the live course-finder page (2026-10-02 spot-check): APS 36+, English Level 5
  // (Home Language or First Additional), APS 30-35 wait-listed.
  { ...base, id: 'wits-ba', career_id: 'humanities-generalist', name: 'BA (General)',
    faculty: 'Humanities', duration_years: 3, min_aps: 36,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/humanities/ba/',
    subject_requirements: [engLvl(5, 5)],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check). APS 30-35 may be wait-listed.' },
  { ...base, id: 'wits-ba-psychology', career_id: 'clinical-psychologist', name: 'BA (General, with Psychology as a major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 36,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/humanities/ba/',
    subject_requirements: [engLvl(5, 5)],
    notes: flag('unverified', 'Wits does not list Psychology as its own admission line - you’re admitted to the general BA (confirmed unchanged by a direct fetch, 2026-10-02 spot-check) and choose Psychology as a major from second year. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise.') },
  { ...base, id: 'wits-ba-psychology-counselling', career_id: 'counselling-educational-psychologist', name: 'BA (General, with Psychology as a major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 36,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/humanities/ba/',
    subject_requirements: [engLvl(5, 5)],
    notes: flag('unverified', 'Wits does not list Psychology as its own admission line - you’re admitted to the general BA (confirmed unchanged by a direct fetch, 2026-10-02 spot-check) and choose Psychology as a major from second year. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise.') },
  { ...base, id: 'wits-ba-journalism', career_id: 'journalist-communications', name: 'BA (General, with a media/communications-related major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 36,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/humanities/ba/',
    subject_requirements: [engLvl(5, 5)],
    notes: flag('unverified', 'Wits does not list Journalism as its own admission line - you’re admitted to the general BA (confirmed unchanged by a direct fetch, 2026-10-02 spot-check) and choose your major from second year. Confirm which specific major Wits offers in this area before relying on it.') },
  { ...base, id: 'wits-bed-foundation', career_id: 'teacher', name: 'BEd Foundation Phase Teaching',
    faculty: 'Humanities', duration_years: 4, min_aps: 37,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/humanities/bed-foundation-phase-teaching/',
    subject_requirements: [engLvl(5, 5), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 5), lvl('Technical Mathematics', 5))],
    notes: 'An APS of 31-36 may be wait-listed.' },
  { ...base, id: 'wits-bed-intermediate', career_id: 'teacher', name: 'BEd Intermediate Phase Teaching',
    faculty: 'Humanities', duration_years: 4, min_aps: 37,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/humanities/bed-intermediate-phase-teaching/',
    subject_requirements: [engLvl(5, 5), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 5), lvl('Technical Mathematics', 5))],
    notes: '' },
  { ...base, id: 'wits-bed-senior-fet', career_id: 'teacher', name: 'BEd Senior Phase & FET Teaching',
    faculty: 'Humanities', duration_years: 4, min_aps: 37,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/humanities/bed-senior-phase-teaching/',
    subject_requirements: [engLvl(5, 5),
      manual('Teaching subjects', 'Your teaching subjects are compulsory, and Mathematics or Technical Mathematics must be at 65% where relevant.')],
    notes: 'Confirmed unchanged by a direct fetch of the 2027 course-finder page (2026-10-02 spot-check): APS 37+, English Level 5, APS 31-36 wait-listed. The Mathematics teaching-subject note isn’t on this general admission page - it’s carried over from the schools-liaison guide’s per-subject detail.' },
  { ...base, id: 'wits-audiology', career_id: 'audiologist', name: 'BA Speech-Language Pathology & Audiology: Audiology',
    faculty: 'Humanities', duration_years: 4, min_aps: 34,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/humanities/audiology/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4), manual('NBT', 'The NBT must be written by 17 August.')],
    notes: 'An APS of 30-33 may be wait-listed. About 30 places.' },
  { ...base, id: 'wits-slp', career_id: 'speech-therapist', name: 'BA Speech-Language Pathology & Audiology: Speech-Language Pathology',
    faculty: 'Humanities', duration_years: 4, min_aps: 34,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/humanities/audiology/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 4), manual('NBT', 'The NBT must be written by 17 August.')],
    notes: 'An APS of 30-33 may be wait-listed.' },
  { ...base, id: 'wits-social-work', career_id: 'social-worker', name: 'Bachelor of Social Work',
    faculty: 'Humanities', duration_years: 4, min_aps: 36,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/humanities/social-work/',
    subject_requirements: [engLvl(5, 5)],
    notes: 'About 60 places.' },
  { ...base, id: 'wits-fine-arts', career_id: 'artist', name: 'BA Fine Arts',
    faculty: 'Humanities', duration_years: 4, min_aps: 34,
    source_url: 'https://www.wits.ac.za/media/wits-university/study/undergraduate/documents/Bachelor%20of%20Arts%20in%20Fine%20Arts.pdf',
    subject_requirements: [pct('English', 60), manual('Portfolio', 'A portfolio and a questionnaire are required.')],
    notes: 'An APS of 30-33 is also considered.' },
];
