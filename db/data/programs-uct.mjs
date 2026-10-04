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

  { ...base, id: 'uct-bsw', career_id: 'social-worker', name: 'Bachelor of Social Work',
    faculty: 'Humanities', duration_years: 4, min_aps: 450, score_type: 'band_a',
    subject_requirements: [
      engPct(50, 60),
      manual('NBT', 'An NBT Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out.'),
      manual('Interview', 'Applicants may be required to attend an admissions interview and demonstrate they will meet the South African Council for Social Service Professions’ professional requirements.'),
    ],
    notes: bands(450, 450, 380) + ' A standalone structured degree (not a BA/BSocSc major), capped at 80 places a year. This qualification lets you register as a professional social worker with the South African Council for Social Service Professions.' },

  { ...base, id: 'uct-bafa', career_id: 'artist', name: 'Bachelor of Arts in Fine Art',
    faculty: 'Humanities', duration_years: 4, min_aps: 380, score_type: 'minimum',
    subject_requirements: [
      engPct(50, 60),
      manual('NBT', 'An NBT Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out.'),
      manual('Portfolio', 'A supplementary application questionnaire and a portfolio of work are required - this is the leading factor in admission, with places awarded on merit. Applicants below the minimum FPS who excel in the portfolio may still be considered.'),
    ],
    notes: 'FPS 380 or above is the published minimum, but unlike the general BA/BSocSc there are no separate guaranteed/likely bands here - the portfolio evaluation decides it. A four-year structured degree at the Michaelis School of Fine Art, not a BA major.' },

  // ---------------- Commerce specialisations (added 2026-10-04 from the 2027 prospectus, pages 24-30) ----------------
  // Every Commerce specialisation uses the same two entry tables; an offer lets you register for ANY specialisation you meet the criteria for.

  { ...base, id: 'uct-bcom-financial-accounting', career_id: 'chartered-accountant', name: 'BCom Financial Accounting (Chartered Accountant)',
    faculty: 'Commerce', duration_years: 3, min_aps: 435, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 60), engPct(50, 60), manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. The NBT Maths test is not required for Commerce.')],
    notes: bands(435, 470, '430-434, Education Development Unit only') + ' The three-year route to CA(SA): then a one-year Postgraduate Diploma in Accounting, a three-year training contract and the SAICA qualifying exams.' },

  { ...base, id: 'uct-bbussc-financial-accounting', career_id: 'chartered-accountant', name: 'BBusSc Financial Accounting: Finance with Accounting',
    faculty: 'Commerce', duration_years: 4, min_aps: 435, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 60), engPct(50, 60), manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. The NBT Maths test is not required for Commerce.')],
    notes: bands(435, 470, '430-434, Education Development Unit only') + ' The four-year route to CA(SA); also followed by the Postgraduate Diploma in Accounting and a three-year training contract.' },

  { ...base, id: 'uct-bcom-economics', career_id: 'economist', name: 'BCom Economics (Economics, Economics & Statistics, Economics & Finance, Economics with Law)',
    faculty: 'Commerce', duration_years: 3, min_aps: 435, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 60), engPct(50, 60), manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. The NBT Maths test is not required for Commerce.')],
    notes: bands(435, 470, '430-434, Education Development Unit only') + ' Economics with Law leads to the two-year postgraduate LLB.' },

  { ...base, id: 'uct-bcom-finance', career_id: 'financial-manager', name: 'BCom / BBusSc Finance',
    faculty: 'Commerce', duration_years: 3, min_aps: 435, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 60), engPct(50, 60), manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. The NBT Maths test is not required for Commerce.')],
    notes: bands(435, 470, '430-434, Education Development Unit only') + ' Finance can be combined with Accounting, Economics or Information Systems as core courses. BBusSc takes four years.' },

  { ...base, id: 'uct-bcom-information-systems', career_id: 'information-systems', name: 'BCom Information Systems',
    faculty: 'Commerce', duration_years: 3, min_aps: 435, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 60), engPct(50, 60), manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. The NBT Maths test is not required for Commerce.')],
    notes: bands(435, 470, '430-434, Education Development Unit only') + ' BBusSc takes four years. Information Systems combined with Computer Science needs Mathematics 70% (see the Computer Science row).' },

  { ...base, id: 'uct-bcom-management-studies', career_id: 'business-manager', name: 'BCom Management Studies',
    faculty: 'Commerce', duration_years: 3, min_aps: 435, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 60), engPct(50, 60), manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. The NBT Maths test is not required for Commerce.')],
    notes: bands(435, 470, '430-434, Education Development Unit only') + ' UCT’s most flexible Commerce degree: a core of 11 Commerce courses plus a wide choice of electives from across the university.' },

  { ...base, id: 'uct-bcom-marketing', career_id: 'marketing-professional', name: 'BCom / BBusSc Marketing Studies',
    faculty: 'Commerce', duration_years: 3, min_aps: 435, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 60), engPct(50, 60), manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. The NBT Maths test is not required for Commerce.')],
    notes: bands(435, 470, '430-434, Education Development Unit only') + ' BBusSc takes four years.' },

  { ...base, id: 'uct-bbussc-industrial-psychology', career_id: 'industrial-psychologist', name: 'BBusSc Industrial & Organisational Psychology',
    faculty: 'Commerce', duration_years: 4, min_aps: 435, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 60), engPct(50, 60), manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. The NBT Maths test is not required for Commerce.')],
    notes: bands(435, 470, '430-434, Education Development Unit only') + ' Only open to students who took pure Mathematics in matric. The same major can be taken inside a BA/BSocSc in Humanities.' },

  { ...base, id: 'uct-bbussc-statistics-data-science', career_id: 'data-scientist', name: 'BBusSc Statistics & Data Science',
    faculty: 'Commerce', duration_years: 4, min_aps: 435, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 70), engPct(50, 60), manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. The NBT Maths test is not required for Commerce.')],
    notes: bands(435, 470, '430-434, Education Development Unit only') + ' Mathematics 70% and a four-year BBusSc; the three-year BCom version also exists.' },

  { ...base, id: 'uct-bbussc-quantitative-finance', career_id: 'financial-manager', name: 'BBusSc Quantitative Finance',
    faculty: 'Commerce', duration_years: 4, min_aps: 500, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 80), engPct(60, 80), manual('NBT', 'NBT Academic Literacy and Quantitative Literacy must be Upper Intermediate or above. The NBT Maths test is not required for Commerce.')],
    notes: bands(500, 525, '475-479, Education Development Unit only') + ' Shares its foundations with Actuarial Science but is aimed at investment banking, derivatives trading and quantitative asset management. First Additional Language applicants need Proficient AL and QL NBTs.' },


  // ---------------- Science majors (BSc; one faculty-wide entry table, majors are chosen once you are in) ----------------

  { ...base, id: 'uct-bsc-applied-mathematics', career_id: 'mathematician', name: 'BSc Applied Mathematics',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-applied-statistics', career_id: 'data-scientist', name: 'BSc Applied Statistics',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-artificial-intelligence', career_id: 'data-scientist', name: 'BSc Artificial Intelligence',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + ' Designed to be completed as a co-major with Computer Science, Mathematical Statistics or Mathematics.' },

  { ...base, id: 'uct-bsc-astrophysics', career_id: 'physicist', name: 'BSc Astrophysics',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-biology', career_id: 'biologist', name: 'BSc Biology',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-biochemistry', career_id: 'biologist', name: 'BSc Biochemistry',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + ' Capacity-limited: selection into this major is on first-year academic performance.' },

  { ...base, id: 'uct-bsc-chemistry', career_id: 'chemist', name: 'BSc Chemistry',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-environmental-geographical-science', career_id: 'environmental-scientist', name: 'BSc Environmental & Geographical Science',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + ' One of only two majors open to applicants without Physical Sciences or Information Technology.' },

  { ...base, id: 'uct-bsc-genetics', career_id: 'biologist', name: 'BSc Genetics',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + ' Capacity-limited: selection into this major is on first-year academic performance.' },

  { ...base, id: 'uct-bsc-geology', career_id: 'geologist', name: 'BSc Geology',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-human-anatomy-physiology', career_id: 'sport-scientist', name: 'BSc Human Anatomy & Physiology',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + ' Capacity-limited, with courses starting at second-year level: selection is on first-year academic performance.' },

  { ...base, id: 'uct-bsc-marine-biology', career_id: 'biologist', name: 'BSc Marine Biology',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-mathematics', career_id: 'mathematician', name: 'BSc Mathematics',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-mathematical-statistics', career_id: 'data-scientist', name: 'BSc Mathematical Statistics',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-ocean-atmosphere-science', career_id: 'environmental-scientist', name: 'BSc Ocean & Atmosphere Science',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-physics', career_id: 'physicist', name: 'BSc Physics',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-quantitative-biology', career_id: 'biologist', name: 'BSc Quantitative Biology',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },

  { ...base, id: 'uct-bsc-statistics-data-science', career_id: 'data-scientist', name: 'BSc Statistics & Data Science',
    faculty: 'Science', duration_years: 3, min_aps: 660, score_type: 'band_a', scoring_system: 'UCT_FPS800',
    subject_requirements: [pct('Mathematics', 70), pct('Physical Sciences', 60)],
    notes: bands(660, 640, 550) + ' All Science majors share these entry bands (Mathematics 70%+, Physical Sciences 60%+; NBTs in Mathematics, AL and QL must be written but do not affect admission). Admission is to the BSc and a major is chosen once you are in; selected students may be counselled onto the four-year Extended Degree Programme.' + '' },


  // ---------------- Engineering streams that share an entry table ----------------

  { ...base, id: 'uct-beng-electrical-computer', career_id: 'electrical-engineer', name: 'BSc (Eng) Electrical & Computer Engineering',
    faculty: 'Engineering & the Built Environment', duration_years: 4, min_aps: 500, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 80), pct('Physical Sciences', 75)],
    notes: bands(500, 480, 420) + ' Mathematical Literacy and Technical Mathematics do not count as Mathematics, and Technical Sciences does not count as Physical Sciences.' + ' Shares one entry table with Electrical Engineering and Mechatronics.' },

  { ...base, id: 'uct-beng-mechatronics', career_id: 'mechanical-engineer', name: 'BSc (Eng) Mechatronics',
    faculty: 'Engineering & the Built Environment', duration_years: 4, min_aps: 500, score_type: 'band_a',
    subject_requirements: [pct('Mathematics', 80), pct('Physical Sciences', 75)],
    notes: bands(500, 480, 420) + ' Mathematical Literacy and Technical Mathematics do not count as Mathematics, and Technical Sciences does not count as Physical Sciences.' + ' Shares one entry table with Electrical Engineering; Mechanical & Mechatronic Engineering is listed on the Mechanical row.' },


  // ---------------- Humanities, performing and creative arts ----------------

  { ...base, id: 'uct-bmus', career_id: 'performer', name: 'Bachelor of Music (BMus)',
    faculty: 'Humanities', duration_years: 4, min_aps: 380, score_type: 'minimum',
    subject_requirements: [engPct(50, 60), manual('NBT', 'NBT Academic Literacy at Intermediate level or above.'), pct('Music', 60), manual('Audition, interview and music theory test', 'The audition is the leading factor and places are awarded on merit. Unisa Music Theory Grade V and Practical Grade VII or above are expected.')],
    notes: 'FPS 380 is the published minimum for an NSC degree pass, but admission is decided by the audition, interview and theory test, not by points. Applicants below the minimum who excel at audition may be considered for the Diploma in Music Performance.' },

  { ...base, id: 'uct-ba-theatre-performance', career_id: 'performer', name: 'Bachelor of Arts in Theatre & Performance (BA(T&P))',
    faculty: 'Humanities', duration_years: 3, min_aps: 380, score_type: 'minimum',
    subject_requirements: [engPct(50, 60), manual('NBT', 'NBT Academic Literacy at Intermediate level or above.'), manual('Audition', 'A satisfactory audition is required; it is the leading indicator and places are awarded on merit.')],
    notes: 'FPS 380 is the published minimum; the audition decides admission. Applicants below the minimum who excel at audition may be considered for the Diploma in Theatre & Performance.' },

  { ...base, id: 'uct-dip-music-performance', career_id: 'performer', name: 'Diploma in Music Performance',
    faculty: 'Humanities', duration_years: 3, min_aps: null, score_type: 'minimum',
    subject_requirements: [engPct(50, 60), manual('NBT', 'NBT Academic Literacy at Intermediate level or above.'), manual('Audition, interview and music theory test', 'The audition is the leading indicator and places are awarded on merit.')],
    notes: 'Needs an NSC endorsed for diploma study, English 50% (Home Language) or 60% (First Additional Language), NBT Academic Literacy at Intermediate or above, and a satisfactory audition, interview and music theory test. UCT publishes no points cut-off.' },

  { ...base, id: 'uct-dip-theatre-performance', career_id: 'performer', name: 'Diploma in Theatre & Performance',
    faculty: 'Humanities', duration_years: 3, min_aps: null, score_type: 'minimum',
    subject_requirements: [engPct(50, 60), manual('NBT', 'NBT Academic Literacy at Intermediate level or above.'), manual('Audition', 'A satisfactory audition is required; it is the leading indicator and places are awarded on merit.')],
    notes: 'Needs an NSC endorsed for diploma study, English 50% (Home Language) or 60% (First Additional Language), NBT Academic Literacy at Intermediate or above and a satisfactory audition. UCT publishes no points cut-off.' },

  { ...base, id: 'uct-bsocsc-ppe', career_id: 'economist', name: 'BSocSc Philosophy, Politics & Economics (PPE)',
    faculty: 'Humanities', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [engPct(50, 60), pct('Mathematics', 60), manual('NBT', 'NBT Academic Literacy: Proficient, and Quantitative Literacy: Upper Intermediate or above.')],
    notes: bands(450, 450, 380) + ' Band B (WPS 450) needs an Upper Intermediate Academic Literacy NBT; Band A needs Proficient.' },
  { ...base, id: 'uct-ba-film-media-production', career_id: 'journalist-communications', name: 'BA specialising in Film & Media Production',
    faculty: 'Humanities', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [engPct(50, 60), pct('Life Orientation', 50), manual('NBT', 'An NBT Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out.')],
    notes: bands(450, 450, 380) + ' You register for the general BA and are accepted into the Film & Media Production specialisation only in the second semester of second year, selected on first-year performance and work on campus media.' },
];
