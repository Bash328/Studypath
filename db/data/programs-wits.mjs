import { lvl, pct, engLvl, anyOf, manual, flag } from './_helpers.mjs';

// University of the Witwatersrand.
// Wits APS = the best 7 subjects INCLUDING Life Orientation, on NSC levels, with
// English and Maths getting +2 at level 5 and above, and Life Orientation scoring
// only 4 / 3 / 2 / 1 at levels 8 / 7 / 6 / 5.
//
// Two sources. Source A is the Wits schools-liaison Grade 12 guide, which is headed
// "prospective students for 2026" - every row that rests on it alone is flagged
// [dated-document]. Source B is the individual 2027 course-finder pages, which are
// current. Where both give a figure, they agree.

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

const eng = (id, career_id, name) => ({
  ...sourceA, id, career_id, name,
  faculty: 'Engineering & the Built Environment', duration_years: 4, min_aps: 42,
  subject_requirements: ENG_APS,
  notes: flag('dated-document', engNote + ' ' + datedNote),
});

export const witsPrograms = [
  // ---------------- Engineering & the Built Environment ----------------
  eng('wits-beng-chemical', 'chemical-engineer', 'BSc (Eng) Chemical Engineering'),
  eng('wits-beng-metallurgy', 'mining-engineer', 'BSc (Eng) Metallurgy'),
  eng('wits-beng-civil', 'civil-engineer', 'BSc (Eng) Civil Engineering'),
  eng('wits-beng-electrical', 'electrical-engineer', 'BSc (Eng) Electrical Engineering'),
  eng('wits-beng-aeronautical', 'aeronautical-engineer', 'BSc (Eng) Aeronautical Engineering'),
  eng('wits-beng-industrial', 'industrial-engineer', 'BSc (Eng) Industrial Engineering'),
  eng('wits-beng-mining', 'mining-engineer', 'BSc (Eng) Mining Engineering'),
  { ...base, id: 'wits-beng-mechanical', career_id: 'mechanical-engineer', name: 'BSc (Eng) Mechanical Engineering',
    faculty: 'Engineering & the Built Environment', duration_years: 4, min_aps: 42,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/ebe/mechanical-engineering/',
    subject_requirements: ENG_APS,
    notes: engNote + ' These figures are confirmed on the 2027 Mechanical Engineering course-finder page.' },

  { ...sourceA, id: 'wits-biomedical-eng', career_id: 'biomedical-engineer', name: 'BSc (Eng) Biomedical Engineering',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 42,
    subject_requirements: ENG_APS,
    notes: flag('dated-document', datedNote) },

  { ...sourceA, id: 'wits-digital-arts', career_id: 'digital-artist', name: 'BSc Digital Arts',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 42,
    subject_requirements: ENG_APS,
    notes: flag('dated-document', datedNote) },

  // Two official Wits sources give different numbers here. We show both and pick neither.
  { ...base, id: 'wits-bas-architecture', career_id: 'architect', name: 'Bachelor of Architectural Studies',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: null,
    source_url: 'https://www.wits.ac.za/soap/architecture/bas-application-exercise/',
    subject_requirements: [lvl('Mathematics', 4), engLvl(4, 4),
      manual('Application exercise', 'An application exercise and an interview are required. No NBT.')],
    notes: flag('conflict', 'Two official Wits sources disagree. The schools-liaison Grade 12 guide gives APS 34+ with English level 4 and Maths level 4. The Bachelor of Architectural Studies application FAQ gives a minimum APS of 29 with Maths 50% and English 50%. We are not picking a side - check both with the School of Architecture before you rely on either. Guide: ' + SLO) },

  { ...sourceA, id: 'wits-urban-planning', career_id: 'urban-planner', name: 'Urban & Regional Planning',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 36,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: flag('dated-document', datedNote) },
  { ...sourceA, id: 'wits-construction-studies', career_id: 'quantity-surveyor', name: 'Construction Studies',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 36,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: flag('dated-document', datedNote) },
  { ...sourceA, id: 'wits-property-studies', career_id: 'quantity-surveyor', name: 'Property Studies',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 36,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: flag('dated-document', datedNote) },

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
  { ...sourceA, id: 'wits-bcom-general', career_id: 'business-manager', name: 'BCom General / Information Systems / PPE',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 38,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: flag('dated-document', datedNote) },

  { ...base, id: 'wits-bcom-finance', career_id: 'financial-manager', name: 'BCom Finance',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 38,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/clm/finance/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: 'An APS of 35-37 may be wait-listed.' },

  { ...sourceA, id: 'wits-accounting-science', career_id: 'chartered-accountant', name: 'Bachelor of Accounting Science (CA route)',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 44,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6)],
    notes: flag('dated-document', datedNote) },
  { ...sourceA, id: 'wits-accounting', career_id: 'chartered-accountant', name: 'BCom Accounting',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 38,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: flag('dated-document', datedNote) },
  { ...sourceA, id: 'wits-economic-science', career_id: 'economist', name: 'Bachelor of Economic Science',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 42,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 7)],
    notes: flag('dated-document', datedNote) },
  { ...sourceA, id: 'wits-bcom-law', career_id: 'lawyer', name: 'BCom with Law',
    faculty: 'Commerce, Law & Management', duration_years: 3, min_aps: 43,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5)],
    notes: flag('dated-document', datedNote) },
  { ...sourceA, id: 'wits-llb', career_id: 'lawyer', name: 'LLB (4-year stream)',
    faculty: 'Commerce, Law & Management', duration_years: 4, min_aps: 46,
    subject_requirements: [engLvl(6, 6), anyOf(lvl('Mathematics', 4), lvl('Mathematical Literacy', 6))],
    notes: flag('dated-document', datedNote) },

  // ---------------- Science (NBT required) ----------------
  { ...base, id: 'wits-bsc-general', career_id: 'biologist', name: 'BSc (General)',
    faculty: 'Science', duration_years: 3, min_aps: 42,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/bsc/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), manual('NBT', 'The NBT is required for Science.')],
    notes: '' },
  { ...sourceA, id: 'wits-bsc-compsci', career_id: 'software-engineer', name: 'BSc Computer Science',
    faculty: 'Science', duration_years: 3, min_aps: 44,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6), manual('NBT', 'The NBT is required for Science.')],
    notes: flag('dated-document', datedNote) },
  { ...sourceA, id: 'wits-bsc-applied-maths', career_id: 'mathematician', name: 'BSc Computational & Applied Mathematics',
    faculty: 'Science', duration_years: 3, min_aps: 44,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6), manual('NBT', 'The NBT is required for Science.')],
    notes: flag('dated-document', datedNote) },
  { ...sourceA, id: 'wits-bsc-actuarial', career_id: 'actuary', name: 'BSc Actuarial Science',
    faculty: 'Science', duration_years: 3, min_aps: 42,
    subject_requirements: [engLvl(7, 7), lvl('Mathematics', 7), lvl('Physical Sciences', 7), manual('NBT', 'The NBT is required for Science.')],
    notes: flag('dated-document', datedNote) },
  { ...base, id: 'wits-bsc-maths', career_id: 'mathematician', name: 'BSc Mathematical Sciences',
    faculty: 'Science', duration_years: 3, min_aps: 44,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/mathematical-sciences/',
    subject_requirements: [engLvl(7, 7), lvl('Mathematics', 7), lvl('Physical Sciences', 7), manual('NBT', 'The NBT is required for Science.')],
    notes: flag('conflict', 'The 2027 course-finder page says APS 44+; the 2026 schools-liaison guide says 42+. We show the course-finder figure because it is the more recent official source, but the two do disagree - check with Wits if you are between 42 and 44.') },
  { ...base, id: 'wits-bsc-physics', career_id: 'physicist', name: 'BSc Physics',
    faculty: 'Science', duration_years: 3, min_aps: 42,
    source_url: 'https://www.wits.ac.za/course-finder/undergraduate/science/physics/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6), lvl('Physical Sciences', 5), manual('NBT', 'The NBT is required for Science.')],
    notes: '' },
  { ...base, id: 'wits-bsc-chem-eng', career_id: 'chemist', name: 'BSc Chemistry with Chemical Engineering',
    faculty: 'Science', duration_years: 3, min_aps: 43,
    source_url: CF + '/science/',
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 6), lvl('Physical Sciences', 6), manual('NBT', 'The NBT is required for Science.')],
    notes: '' },
  { ...sourceA, id: 'wits-bsc-biological', career_id: 'biologist', name: 'BSc Biological Sciences',
    faculty: 'Science', duration_years: 3, min_aps: 43,
    subject_requirements: [engLvl(5, 5), lvl('Mathematics', 5), manual('NBT', 'The NBT is required for Science.')],
    notes: flag('dated-document', datedNote) },

  // ---------------- Humanities & Education ----------------
  { ...sourceA, id: 'wits-ba', career_id: 'humanities-generalist', name: 'BA (General)',
    faculty: 'Humanities', duration_years: 3, min_aps: 36,
    subject_requirements: [engLvl(5, 5)],
    notes: flag('dated-document', datedNote) },
  { ...sourceA, id: 'wits-ba-psychology', career_id: 'clinical-psychologist', name: 'BA (General, with Psychology as a major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 36,
    subject_requirements: [engLvl(5, 5)],
    notes: flag(['dated-document', 'unverified'], 'Wits does not list Psychology as its own admission line - you’re admitted to the general BA (shown here) and choose Psychology as a major from second year. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise. ' + datedNote) },
  { ...sourceA, id: 'wits-ba-psychology-counselling', career_id: 'counselling-educational-psychologist', name: 'BA (General, with Psychology as a major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 36,
    subject_requirements: [engLvl(5, 5)],
    notes: flag(['dated-document', 'unverified'], 'Wits does not list Psychology as its own admission line - you’re admitted to the general BA (shown here) and choose Psychology as a major from second year. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise. ' + datedNote) },
  { ...sourceA, id: 'wits-ba-journalism', career_id: 'journalist-communications', name: 'BA (General, with a media/communications-related major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 36,
    subject_requirements: [engLvl(5, 5)],
    notes: flag(['dated-document', 'unverified'], 'Wits does not list Journalism as its own admission line - you’re admitted to the general BA (shown here) and choose your major from second year. Confirm which specific major Wits offers in this area before relying on it. ' + datedNote) },
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
  { ...sourceA, id: 'wits-bed-senior-fet', career_id: 'teacher', name: 'BEd Senior Phase & FET Teaching',
    faculty: 'Humanities', duration_years: 4, min_aps: 37,
    subject_requirements: [engLvl(5, 5),
      manual('Teaching subjects', 'Your teaching subjects are compulsory, and Mathematics or Technical Mathematics must be at 65% where relevant.')],
    notes: flag('dated-document', datedNote) },
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
