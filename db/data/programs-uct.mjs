import { pct, engPct, manual, flag } from './_helpers.mjs';

// University of Cape Town, 2027 intake.
// Source for every row unless noted: the UCT 2027 Undergraduate Prospectus.
//
// UCT's Faculty Points Score (FPS) for Commerce, EBE, Humanities and Law IS the APS:
// English% + the 5 best other subjects excluding Life Orientation, out of 600.
// Science doubles Maths and Physical Sciences (out of 800) and Health Sciences adds
// NBT scores (out of 900) - the Health Sciences bands are shown in each programme's
// notes but can't be computed by the calculator since we don't know the student's NBT
// result. Every FPS figure in this file (Law, Science, Humanities included) has now
// been confirmed by a raw `pdftotext` read of the 2027 prospectus PDF - see
// research-log.mjs uct-raw-pdf-read-2026-10-02 for how (this environment's WebFetch
// can download the PDF but its own summariser can't parse it; piping the saved file
// through pdftotext -raw recovers clean text).
//
// Band A = guaranteed offer (FPS). Band B = likely (WPS, which adds a 0-10% disadvantage
// factor we cannot compute from marks alone). Band C = redress categories only.
// We store Band A as the qualifying number and carry B/C in the notes, because claiming
// a student "qualifies" on a score we can't actually compute would be a lie.

const PROSPECTUS = 'https://www.uct.ac.za/sites/default/files/media/documents/2027-uct-undergraduate-prospectus-1-april-2026.pdf';
const HEALTH_PAGE = 'https://health.uct.ac.za/home/undergraduate-programmes';

const base = {
  university_id: 'uct',
  source_url: PROSPECTUS,
  scoring_system: 'UCT_FPS600',
  intake_year: 2027,
  document_date: '2026-04-01',
};

const bands = (a, b, c) =>
  `Band A (guaranteed offer) is an FPS of ${a}. Band B (likely offer) is a WPS of ${b} - the WPS adds a 0-10% disadvantage factor that we cannot work out from your marks, so we only check you against Band A. Band C (${c}) applies to redress categories only.`;

export const uctPrograms = [
  // ---------------- Engineering & the Built Environment (FPS out of 600) ----------------
  // NBT Maths, AL and QL must be written but are not used for admission to EBE.
  { ...base, id: 'uct-beng-civil', career_id: 'civil-engineer', name: 'BSc (Eng) Civil Engineering',
    faculty: 'Engineering & the Built Environment', duration_years: 4, min_aps: 500, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 80), pct('Physical Sciences', 70)],
    notes: bands(500, 480, 420) + ' Mathematical Literacy and Technical Mathematics do not count as Mathematics, and Technical Sciences does not count as Physical Sciences. All students start on the 4-year curriculum and may move to the 5-year extended (ASPECT) curriculum. NBT Maths, AL and QL must be written but UCT states they are not taken into account for EBE admission.' },

  { ...base, id: 'uct-beng-electrical', career_id: 'electrical-engineer', name: 'BSc (Eng) Electrical / Electrical & Computer / Mechatronics',
    faculty: 'Engineering & the Built Environment', duration_years: 4, min_aps: 500, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 80), pct('Physical Sciences', 75)],
    notes: bands(500, 480, 420) + ' Mathematical Literacy and Technical Mathematics do not count as Mathematics, and Technical Sciences does not count as Physical Sciences.' },

  { ...base, id: 'uct-beng-chemical', career_id: 'chemical-engineer', name: 'BSc (Eng) Chemical Engineering',
    faculty: 'Engineering & the Built Environment', duration_years: 4, min_aps: 500, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 80), pct('Physical Sciences', 75)],
    notes: bands(500, 480, 420) + ' Physical Sciences 75% applies to Band A; Bands B and C need 70%. Mathematical Literacy and Technical Mathematics do not count as Mathematics.' },

  { ...base, id: 'uct-beng-mechanical', career_id: 'mechanical-engineer', name: 'BSc (Eng) Mechanical / Mechanical & Mechatronic',
    faculty: 'Engineering & the Built Environment', duration_years: 4, min_aps: 500, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 80), pct('Physical Sciences', 75)],
    notes: bands(500, 480, 420) + ' Mathematical Literacy and Technical Mathematics do not count as Mathematics, and Technical Sciences does not count as Physical Sciences.' },

  { ...base, id: 'uct-bsc-geomatics', career_id: 'land-surveyor', name: 'BSc Geomatics',
    faculty: 'Engineering & the Built Environment', duration_years: 4, min_aps: 450, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 75), pct('Physical Sciences', 70)],
    notes: bands(450, 420, 390) + ' The subject minimums shown are the Band A ones; Bands B and C need Maths 65% and Physical Sciences 60%.' },

  { ...base, id: 'uct-bsc-construction', career_id: 'quantity-surveyor', name: 'BSc Construction Studies',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 65), pct('Physical Sciences', 60)],
    notes: bands(450, 420, 390) + ' Physical Sciences 60% applies to Band A; Bands B and C need 55%.' },

  { ...base, id: 'uct-bsc-property', career_id: 'quantity-surveyor', name: 'BSc Property Studies',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 65)],
    notes: bands(450, 420, 390) },

  // ---------------- Law (FPS out of 600) ----------------
  // RESOLVED 2026-10-02 via a raw read: a prior pass's fetch tool couldn't decode the
  // prospectus PDF (binary/stream content) and fell back to web-search synthesis - this
  // pass downloaded the same PDF and ran `pdftotext -raw` on it directly (see
  // research-log.mjs uct-raw-pdf-read-2026-10-02), which recovered clean text and
  // corrected Band B (WPS 500, not the 485 the earlier search-synthesis pass had found).
  { ...base, id: 'uct-llb', career_id: 'lawyer', name: 'LLB (undergraduate, 4-year route)',
    faculty: 'Law', duration_years: 4, min_aps: 500, score_type: 'band_a',
    subject_requirements: [
      manual('NBT', 'NBTs are compulsory for all applicants: Band A and B need Academic Literacy Proficient and Quantitative Literacy Intermediate or above; Band C needs both Proficient. International applicants need an extra 10 FPS points (probable admission at 510) and also write the AL test.'),
    ],
    notes: bands(500, 500, 470) + ' This is the direct-entry undergraduate LLB, capped at 10 international places. UCT also offers two other routes to the same LLB degree: a combined Humanities/Commerce-and-Law route (5+ years, apply to the Humanities or Commerce degree first, then compete for the law major with a 65%/63% first-year GPA), and a 3-year graduate LLB for those who already hold an unrelated degree.' },

  { ...base, id: 'uct-bas-architecture', career_id: 'architect', name: 'Bachelor of Architectural Studies',
    faculty: 'Engineering & the Built Environment', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [
      pct('Mathematics', 50), pct('English', 50),
      manual('Portfolio', 'A portfolio score of 75% is needed for Band A, 68% for Band B and 50% for Band C.'),
      manual('Written motivation', 'A written motivation is required.'),
    ],
    notes: bands(450, 408, 348) },

  // ---------------- Health Sciences ----------------
  // FPS here is out of 900 (APS/600 + NBT/300) and Band B uses a WPS out of 1080.
  // We cannot compute either without NBT results, so we check the published APS
  // sub-minimum (out of 600, which we CAN compute) and show the rest as context.
  { ...base, id: 'uct-mbchb', career_id: 'doctor', name: 'MBChB (Medicine)',
    faculty: 'Health Sciences', duration_years: 6, min_aps: 450, score_type: 'minimum',
    source_url: PROSPECTUS,
    subject_requirements: [
      pct('Mathematics', 70), pct('Physical Sciences', 70), engPct(65, 65), pct('Next 3 subjects', 70),
      manual('NBT', 'NBTs are compulsory and must be at Intermediate level or above. The final NBT date is 3 October 2026.'),
    ],
    notes: flag('selection', `The 450 shown is the APS sub-minimum (out of 600) - meeting it does not get you in. Selection uses an FPS out of 900 (APS/600 + NBT/300): Band A is 810 with all NBT domains Proficient, Band B is a WPS of 807 and Band C is 644. About 240 places. We cannot compute your FPS without your NBT results. Applications close 31 July 2026. Matching figures appear on the faculty page: ${HEALTH_PAGE}`) },

  { ...base, id: 'uct-bsc-physio', career_id: 'physiotherapist', name: 'BSc Physiotherapy',
    faculty: 'Health Sciences', duration_years: 4, min_aps: 360, score_type: 'minimum',
    subject_requirements: [
      pct('Mathematics', 60), { any_of: [pct('Physical Sciences', 65), pct('Life Sciences', 65)] },
      engPct(65, 65), pct('Next 3 subjects', 60),
      manual('NBT', 'NBTs are compulsory and must be at Intermediate level or above.'),
    ],
    notes: flag('selection', 'The 360 shown is the APS sub-minimum (out of 600). Selection: Band A FPS 730, Band B WPS 797, Band C 580 / 610 / 680 for redress categories 1 / 2 / 3-4. About 70 places.') },

  { ...base, id: 'uct-bsc-ot', career_id: 'occupational-therapist', name: 'BSc Occupational Therapy',
    faculty: 'Health Sciences', duration_years: 4, min_aps: 340, score_type: 'minimum',
    subject_requirements: [
      { any_of: [pct('Mathematics', 60), pct('Mathematical Literacy', 70)] },
      { any_of: [pct('Physical Sciences', 65), pct('Life Sciences', 65)] },
      engPct(65, 65), pct('Next 3 subjects', 60),
      manual('NBT', 'NBTs are compulsory and must be at Intermediate level or above.'),
    ],
    notes: flag('selection', 'The 340 shown is the APS sub-minimum (out of 600). Selection: Band A FPS 730, Band B WPS 782, Band C 565 / 580 / 670. About 70 places.') },

  { ...base, id: 'uct-bsc-audiology', career_id: 'audiologist', name: 'BSc Audiology',
    faculty: 'Health Sciences', duration_years: 4, min_aps: 340, score_type: 'minimum',
    subject_requirements: [
      { any_of: [pct('Mathematics', 60), pct('Mathematical Literacy', 70)] },
      { any_of: [pct('Physical Sciences', 65), pct('Life Sciences', 65)] },
      engPct(65, 65), pct('Next 3 subjects', 60),
      manual('NBT', 'NBTs are compulsory and must be at Intermediate level or above.'),
    ],
    notes: flag('selection', 'The 340 shown is the APS sub-minimum (out of 600). Selection: Band A FPS 720, Band B WPS 710, Band C 550 / 565 / 610. About 37 places.') },

  { ...base, id: 'uct-bsc-slp', career_id: 'speech-therapist', name: 'BSc Speech-Language Pathology',
    faculty: 'Health Sciences', duration_years: 4, min_aps: 340, score_type: 'minimum',
    subject_requirements: [
      { any_of: [pct('Mathematics', 60), pct('Mathematical Literacy', 70)] },
      { any_of: [pct('Physical Sciences', 65), pct('Life Sciences', 65)] },
      engPct(65, 65), pct('Next 3 subjects', 60),
      manual('NBT', 'NBTs are compulsory and must be at Intermediate level or above.'),
    ],
    notes: flag('selection', 'The 340 shown is the APS sub-minimum (out of 600). Selection: Band A FPS 715, Band B WPS 670, Band C 510 / 515 / 600. About 40 places.') },

  // ---------------- Commerce (FPS out of 600) ----------------
  { ...base, id: 'uct-bcom-general', career_id: 'business-manager', name: 'BCom / BBusSc (all specialisations except those listed separately)',
    faculty: 'Commerce', duration_years: 3, min_aps: 435, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 60), engPct(50, 60),
      manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. The NBT Maths test is not required for Commerce.')],
    notes: bands(435, 470, '430-434, Education Development Unit only') + ' Includes the CA / Accounting streams. BBusSc is 4 years.' },

  { ...base, id: 'uct-bcom-cs', career_id: 'data-scientist', name: 'BCom / BBusSc Computer Science; Statistics & Data Science',
    faculty: 'Commerce', duration_years: 3, min_aps: 435, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 70), engPct(50, 60),
      manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above.')],
    notes: bands(435, 470, '430-434, Education Development Unit only') + ' BBusSc is 4 years.' },

  { ...base, id: 'uct-bbussc-actuarial', career_id: 'actuary', name: 'BBusSc Actuarial Science; Quantitative Finance',
    faculty: 'Commerce', duration_years: 4, min_aps: 500, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 80), engPct(60, 80),
      manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. First Additional Language applicants need Proficient NBTs.')],
    notes: bands(500, 525, '475-479, Education Development Unit only') },

  // ---------------- Science ----------------
  // RESOLVED 2026-10-02 via a raw read (see research-log.mjs uct-raw-pdf-read-2026-10-02): a prior
  // pass's fetch tool couldn't decode the prospectus PDF and used web search instead;
  // this pass downloaded the PDF and ran `pdftotext -raw` on it directly, confirming the
  // FPS figures the earlier search-synthesis pass had found, and that Physical Sciences
  // is a Faculty-wide requirement (not just a Computer-Science-specific one - it applies
  // to everyone admitted to the Science Faculty, Computer Science included).
  { ...base, id: 'uct-bsc-compsci', career_id: 'software-engineer', name: 'BSc Computer Science',
    faculty: 'Science', duration_years: null, min_aps: 660, score_type: 'band_a',
    scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' Confirmed directly from the 2027 prospectus: the Science Faculty admits on these faculty-wide bands (Mathematics 70%+ and Physical Sciences 60%+ for all three bands), then places you into a major - Computer Science (and its associated majors) is one of a handful capacity-limited once you are in, selected on first-year academic performance rather than your entry score. Where Physical Sciences was not taken, Information Technology may substitute for the Computer Science/Business Computing combination specifically.' },

  // ---------------- Humanities ----------------
  // FPS figures confirmed 2026-10-02 by a raw pdftotext read of the prospectus PDF (see
  // research-log.mjs uct-raw-pdf-read-2026-10-02) - exactly matching an earlier pass's
  // web-search-synthesised figures, so only the confidence tier changed, not the numbers.
  { ...base, id: 'uct-ba-humanities', career_id: 'humanities-generalist', name: 'BA / BSocSc',
    faculty: 'Humanities', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [
      engPct(50, 60), pct('Life Orientation', 50),
      manual('NBT', 'An NBT Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out.'),
      manual('Major-specific', 'An Economics major needs Maths 60%. A Psychology major needs Maths 50% or a Proficient NBT Quantitative Literacy result.'),
    ],
    notes: bands(450, 450, 380) },
  { ...base, id: 'uct-ba-psychology', career_id: 'clinical-psychologist', name: 'BA / BSocSc (with Psychology as a major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [
      engPct(50, 60), pct('Life Orientation', 50),
      pct('Mathematics', 50),
      manual('NBT', 'An NBT Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out. UCT’s own page says a Psychology major specifically accepts Maths 50% OR a Proficient NBT Quantitative Literacy result instead - we show the Maths route above since it’s the one we can check from marks alone.'),
    ],
    notes: bands(450, 450, 380) + ' You’re admitted to the general BA/BSocSc (same entry point as humanities-generalist) and choose Psychology as a major from second year - UCT is one of the few universities that publishes a major-specific subject note for Psychology, which is why the Maths requirement above is more specific than the general BA entry. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise.' },
  { ...base, id: 'uct-ba-psychology-counselling', career_id: 'counselling-educational-psychologist', name: 'BA / BSocSc (with Psychology as a major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [
      engPct(50, 60), pct('Life Orientation', 50),
      pct('Mathematics', 50),
      manual('NBT', 'An NBT Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out. UCT’s own page says a Psychology major specifically accepts Maths 50% OR a Proficient NBT Quantitative Literacy result instead - we show the Maths route above since it’s the one we can check from marks alone.'),
    ],
    notes: bands(450, 450, 380) + ' You’re admitted to the general BA/BSocSc (same entry point as humanities-generalist) and choose Psychology as a major from second year. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise.' },
  { ...base, id: 'uct-ba-journalism', career_id: 'journalist-communications', name: 'BA / BSocSc (with a media/communications-related major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [
      engPct(50, 60), pct('Life Orientation', 50),
      manual('NBT', 'An NBT Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out.'),
    ],
    notes: bands(450, 450, 380) + ' UCT does not list Journalism as its own admission line - you’re admitted to the general BA/BSocSc and choose your major from second year. Confirm which specific major UCT offers in this area before relying on it.' },
];
