import { pct, engPct, anyOf, manual, flag } from './_helpers.mjs';

// Stellenbosch University, 2027 intake.
// SU does not use APS at all. It uses an "aggregate": your NSC average excluding
// Life Orientation, as a percentage. min_aps here therefore holds a PERCENTAGE, and
// scoring_system tells the app to read it that way.
//
// Every SU programme is a selection programme: the published minimum is a floor, not
// a cut-off. SU says so itself, so every row carries the [selection] flag.
//
// Two faculties also have a published selection formula, which we compute as extra
// context (see src/scoring.js): Engineering = Maths% + Physical Sciences% + (6 x average),
// out of 800; Science = [(Maths x 2) + 5 other subjects] / 7.

const BOOKLET = 'https://files.su.ac.za/public/undergraduate-maties/documents/2026-01/su-admissions-booklet-2027.pdf';

const base = {
  university_id: 'su',
  source_url: BOOKLET,
  scoring_system: 'SU_aggregate_pct',
  score_type: 'minimum',
  intake_year: 2027,
  document_date: '2026-01-01',
};

const SELECTION = 'Every Stellenbosch programme is a selection programme. The figures shown are the published minimum requirements - the actual selection threshold is usually higher.';

const NBT_NOTE = 'NBTs are not required for 2027 entry at SU, except for Law programmes, the School for Tomorrow, AHSD and online-school applicants.';

const engineering = (id, career_id, name) => ({
  ...base, id, career_id, name, faculty: 'Engineering', duration_years: 4, min_aps: 70,
  subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60), engPct(50, 60)],
  notes: flag('selection', SELECTION + ' The Engineering selection score is Maths% + Physical Sciences% + (6 x your average), out of 800. SU says 600 or more gave a good chance for some programmes and 620 or more for others - that is a historical guide, not a fixed cut-off. An extended (ECP) 5-year route exists. Afrikaans language combinations are also accepted. ' + NBT_NOTE),
});

export const suPrograms = [
  // ---------------- Engineering ----------------
  engineering('su-beng-chemical', 'chemical-engineer', 'BEng Chemical Engineering'),
  engineering('su-beng-civil', 'civil-engineer', 'BEng Civil Engineering'),
  engineering('su-beng-electrical', 'electrical-engineer', 'BEng Electrical & Electronic Engineering (incl. Data Engineering)'),
  engineering('su-beng-industrial', 'industrial-engineer', 'BEng Industrial Engineering'),
  engineering('su-beng-mechanical', 'mechanical-engineer', 'BEng Mechanical Engineering'),
  engineering('su-beng-mechatronic', 'mechanical-engineer', 'BEng Mechatronic Engineering'),

  // ---------------- Medicine & Health Sciences ----------------
  { ...base, id: 'su-mbchb', career_id: 'doctor', name: 'MBChB (Medicine)', faculty: 'Medicine & Health Sciences',
    duration_years: 6, min_aps: 75,
    subject_requirements: [pct('Mathematics', 60), pct('Physical Sciences', 50), pct('Life Sciences', 50)],
    notes: flag('selection', SELECTION + ' About 280 students are selected, and non-academic merit is also assessed. ' + NBT_NOTE) },

  { ...base, id: 'su-physio', career_id: 'physiotherapist', name: 'BSc Physiotherapy', faculty: 'Medicine & Health Sciences',
    duration_years: 4, min_aps: 60,
    subject_requirements: [pct('Mathematics', 60), pct('Physical Sciences', 50)],
    notes: flag('selection', SELECTION + ' About 55 students are selected.') },

  { ...base, id: 'su-ot', career_id: 'occupational-therapist', name: 'B Occupational Therapy', faculty: 'Medicine & Health Sciences',
    duration_years: 4, min_aps: 60,
    subject_requirements: [pct('Mathematics', 50), pct('Life Sciences', 50)],
    notes: flag('selection', SELECTION + ' About 50 students are selected.') },

  { ...base, id: 'su-nursing', career_id: 'nurse', name: 'B Nursing', faculty: 'Medicine & Health Sciences',
    duration_years: 4, min_aps: 60,
    subject_requirements: [anyOf(pct('Mathematics', 40), pct('Mathematical Literacy', 70)), pct('Life Sciences', 50)],
    notes: flag('selection', SELECTION + ' About 50 students are selected.') },

  { ...base, id: 'su-dietetics', career_id: 'dietitian', name: 'BSc Dietetics', faculty: 'Medicine & Health Sciences',
    duration_years: 4, min_aps: 60,
    subject_requirements: [pct('Mathematics', 50), pct('Physical Sciences', 50), pct('Life Sciences', 50)],
    notes: flag('selection', SELECTION + ' About 35 students are selected.') },

  { ...base, id: 'su-speech-hearing', career_id: 'speech-therapist', name: 'B Speech-Language & Hearing Therapy', faculty: 'Medicine & Health Sciences',
    duration_years: 4, min_aps: 60,
    subject_requirements: [pct('Mathematics', 50), anyOf(pct('Physical Sciences', 50), pct('Life Sciences', 60)),
      manual('Two languages', 'Two languages at 60% are required.')],
    notes: flag('selection', SELECTION + ' About 30 students are selected.') },

  // ---------------- Science ----------------
  { ...base, id: 'su-bsc-compsci', career_id: 'software-engineer', name: 'BSc Computer Science', faculty: 'Science',
    duration_years: 3, min_aps: 65,
    subject_requirements: [pct('Mathematics', 70), manual('Language', 'A language at 50% is required.')],
    notes: flag('selection', SELECTION + ' SU states specifically that the actual threshold for Computer Science is higher than the published minimum. The Science selection mark is [(Maths x 2) + your 5 other subjects] / 7. SU offers only two computing degrees: this one and the BEng Data Engineering stream.') },

  { ...base, id: 'su-bsc-maths', career_id: 'mathematician', name: 'BSc Mathematical Sciences', faculty: 'Science',
    duration_years: 3, min_aps: 65, subject_requirements: [pct('Mathematics', 70)],
    notes: flag('selection', SELECTION) },
  { ...base, id: 'su-bsc-physics', career_id: 'physicist', name: 'BSc Physics', faculty: 'Science',
    duration_years: 3, min_aps: 65, subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 50)],
    notes: flag('selection', SELECTION) },
  { ...base, id: 'su-bsc-chemistry', career_id: 'chemist', name: 'BSc Chemistry', faculty: 'Science',
    duration_years: 3, min_aps: 65, subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 50)],
    notes: flag('selection', SELECTION) },
  { ...base, id: 'su-bsc-biodiversity', career_id: 'environmental-scientist', name: 'BSc Biodiversity & Ecology', faculty: 'Science',
    duration_years: 3, min_aps: 65, subject_requirements: [pct('Mathematics', 60), pct('Physical Sciences', 50)],
    notes: flag('selection', SELECTION) },
  { ...base, id: 'su-bsc-sport-science', career_id: 'sport-scientist', name: 'BSc Sport Science', faculty: 'Science',
    duration_years: 3, min_aps: 65, subject_requirements: [pct('Mathematics', 60), pct('Physical Sciences', 50)],
    notes: flag('selection', SELECTION) },
  { ...base, id: 'su-bsc-human-life', career_id: 'biologist', name: 'BSc Human Life Sciences', faculty: 'Science',
    duration_years: 3, min_aps: 65, subject_requirements: [pct('Mathematics', 60), pct('Physical Sciences', 50)],
    notes: flag('selection', SELECTION + ' Mathematics of 60% or 70% is required depending on which first-year Mathematics module you take.') },
  { ...base, id: 'su-bsc-molecular-biology', career_id: 'biologist', name: 'BSc Molecular Biology & Biotechnology', faculty: 'Science',
    duration_years: 3, min_aps: 65, subject_requirements: [pct('Mathematics', 60), pct('Physical Sciences', 50)],
    notes: flag('selection', SELECTION + ' Mathematics of 60% or 70% is required depending on which first-year Mathematics module you take.') },
  { ...base, id: 'su-bsc-earth-science', career_id: 'geologist', name: 'BSc Earth Science', faculty: 'Science',
    duration_years: 3, min_aps: 65, subject_requirements: [pct('Mathematics', 60), pct('Physical Sciences', 50)],
    notes: flag('selection', SELECTION + ' Mathematics of 60% or 70% is required depending on which first-year Mathematics module you take.') },
  { ...base, id: 'su-bdatsci', career_id: 'data-scientist', name: 'BDatSci (Data Science)', faculty: 'Science',
    duration_years: 4, min_aps: 80, subject_requirements: [pct('Mathematics', 80), engPct(60, 75)],
    notes: flag('selection', SELECTION) },

  // ---------------- Economic & Management Sciences ----------------
  { ...base, id: 'su-bacc', career_id: 'chartered-accountant', name: 'BAcc (CA route)', faculty: 'Economic & Management Sciences',
    duration_years: 3, min_aps: 70,
    subject_requirements: [anyOf(pct('Mathematics', 70), { all_of: [pct('Mathematics', 60), pct('Accounting', 70)] }), engPct(50, 70)],
    notes: flag('selection', SELECTION) },
  { ...base, id: 'su-bcom-actuarial', career_id: 'actuary', name: 'BCom Actuarial Science', faculty: 'Economic & Management Sciences',
    duration_years: 3, min_aps: 80,
    subject_requirements: [pct('Mathematics', 80), manual('Home Language', 'Your Home Language at 60% is required.')],
    notes: flag('selection', SELECTION) },
  ...[
    ['su-bcom-management', 'business-manager', 'BCom Management Sciences'],
    ['su-bcom-economics', 'economist', 'BCom Economic Sciences'],
    ['su-bcom-industrial-psych', 'industrial-psychologist', 'BCom Industrial Psychology'],
  ].map(([id, career_id, name]) => ({
    ...base, id, career_id, name, faculty: 'Economic & Management Sciences', duration_years: 3, min_aps: 65,
    subject_requirements: [pct('Mathematics', 60)], notes: flag('selection', SELECTION),
  })),
  { ...base, id: 'su-bcom-financial-accounting', career_id: 'chartered-accountant', name: 'BCom Financial Accounting (ACCA)', faculty: 'Economic & Management Sciences',
    duration_years: 3, min_aps: 65, subject_requirements: [pct('Mathematics', 60)],
    notes: flag('selection', SELECTION + ' SU’s own programme page states this prepares graduates "for a career as a Chartered Certified Accountant" via ACCA (the UK-based body), not SAICA/CA(SA) like the BAcc above - SU says it carries the maximum nine-paper ACCA exemption. A real but different route to chartered-accountant status from the BAcc.') },
  { ...base, id: 'su-bcom-maths', career_id: 'mathematician', name: 'BCom Mathematical Sciences', faculty: 'Economic & Management Sciences',
    duration_years: 3, min_aps: 70, subject_requirements: [pct('Mathematics', 75)],
    notes: flag('selection', SELECTION) },
  { ...base, id: 'su-bcom-international-business', career_id: 'business-manager', name: 'BCom International Business', faculty: 'Economic & Management Sciences',
    duration_years: 4, min_aps: 80, subject_requirements: [pct('Mathematics', 70), engPct(70, 80)],
    notes: flag('selection', SELECTION) },

  // ---------------- Law ----------------
  { ...base, id: 'su-llb', career_id: 'lawyer', name: 'LLB (4-year)', faculty: 'Law', duration_years: 4, min_aps: 70,
    subject_requirements: [engPct(60, 70), manual('NBT', 'The NBT AQL must be written before 31 July.')],
    notes: flag('selection', SELECTION + ' Selection is 80% school results and 20% NBT. About 120 places. Afrikaans Home Language at 60% or First Additional at 70% is also accepted.') },
  { ...base, id: 'su-bcom-law', career_id: 'lawyer', name: 'BCom (Law)', faculty: 'Law', duration_years: 3, min_aps: 70,
    subject_requirements: [pct('Mathematics', 60), manual('NBT', 'The NBT AQL and MAT are required.')],
    notes: flag('selection', SELECTION + ' About 80 places.') },
  { ...base, id: 'su-baccllb', career_id: 'lawyer', name: 'BAccLLB', faculty: 'Law', duration_years: 5, min_aps: 80,
    subject_requirements: [anyOf(pct('Mathematics', 70), { all_of: [pct('Mathematics', 60), pct('Accounting', 70)] })],
    notes: flag('selection', SELECTION + ' About 35 places.') },

  // ---------------- Education ----------------
  ...[
    ['su-bed-foundation', 'BEd Foundation Phase'],
    ['su-bed-intermediate', 'BEd Intermediate Phase'],
  ].map(([id, name]) => ({
    ...base, id, career_id: 'teacher', name, faculty: 'Education', duration_years: 4, min_aps: 60,
    subject_requirements: [anyOf(pct('Mathematics', 40), pct('Mathematical Literacy', 60)),
      manual('Languages', 'Your language of teaching at Home Language 60%, plus a second language at 50%.')],
    notes: flag('selection', SELECTION + ' About 125 places each.'),
  })),

  // ---------------- Arts & Social Sciences ----------------
  { ...base, id: 'su-ba-humanities', career_id: 'humanities-generalist', name: 'BA Humanities', faculty: 'Arts & Social Sciences',
    duration_years: 3, min_aps: 63,
    subject_requirements: [manual('Home Language', 'Home Language at 50%.'), manual('First Additional Language', 'First Additional Language at 40%.')],
    notes: flag('selection', SELECTION) },
  { ...base, id: 'su-ba-visual-arts', career_id: 'artist', name: 'BA Visual Arts', faculty: 'Arts & Social Sciences',
    duration_years: 4, min_aps: 60, subject_requirements: [manual('Portfolio', 'A portfolio is required.')],
    notes: flag('selection', SELECTION + ' The published aggregate for BA Visual Arts, BA Drama and BMus is 60-65% depending on the programme; we show the lower end of that range.') },
  { ...base, id: 'su-ba-drama', career_id: 'performer', name: 'BA Drama', faculty: 'Arts & Social Sciences',
    duration_years: 3, min_aps: 60, subject_requirements: [manual('Audition', 'An audition is required.')],
    notes: flag('selection', SELECTION + ' The published aggregate for BA Visual Arts, BA Drama and BMus is 60-65% depending on the programme; we show the lower end of that range.') },
  { ...base, id: 'su-bmus', career_id: 'performer', name: 'BMus', faculty: 'Arts & Social Sciences',
    duration_years: 4, min_aps: 60, subject_requirements: [manual('Audition', 'An audition is required.')],
    notes: flag('selection', SELECTION + ' The published aggregate for BA Visual Arts, BA Drama and BMus is 60-65% depending on the programme; we show the lower end of that range.') },
];
