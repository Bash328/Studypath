import { pct, engPct, manual, flag } from './_helpers.mjs';

// University of Cape Town, 2027 intake.
// Source for every row unless noted: the UCT 2027 Undergraduate Prospectus.
//
// UCT's Faculty Points Score (FPS) for Commerce, EBE, Humanities and Law IS the APS:
// English% + the 5 best other subjects excluding Life Orientation, out of 600.
// Science doubles Maths and Physical Sciences (out of 800) and Health Sciences adds
// NBT scores (out of 900). Law and Science's faculty-wide FPS bands were found in a
// follow-up pass (2026-10-01) via web search, since this environment's fetch tool could
// not decode the prospectus or faculty admission-criteria PDFs (binary/stream content
// only) - see uct-law-fps and uct-science-fps in research-log.mjs. Health Sciences' FPS
// (out of 900, needs NBT) is still not captured, so it remains a logged gap.
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
  // RESOLVED 2026-10-01 (search-synthesis, not a raw PDF read - see research-log.mjs
  // uct-law-fps): the 2027 prospectus PDF repeatedly returned binary/undecoded content
  // to the fetch tool (both a direct prospectus fetch and the Law Faculty's own "Choose
  // Law 2026" PDF), so these figures come from two independent web searches surfacing
  // UCT Law's own admission guidelines, which agree with each other.
  { ...base, id: 'uct-llb', career_id: 'lawyer', name: 'LLB',
    faculty: 'Law', duration_years: 4, min_aps: 500, score_type: 'band_a',
    source_url: 'https://law.uct.ac.za/sites/default/files/media/documents/choose-law-2026_1.pdf',
    subject_requirements: [
      manual('NBT', 'NBTs are compulsory for all applicants: Band A needs Academic Literacy Proficient and Quantitative Literacy Intermediate. International applicants also write the AL test.'),
    ],
    notes: flag('partially-verified', bands(500, 485, 470) + ' Found via web search surfacing UCT Law’s own published admission guidelines (the prospectus PDF and the Law Faculty’s "Choose Law" PDF both returned undecoded binary content to this pass’s fetch tool, so this is search-synthesis, not a raw page read) - re-check against the live document before fully relying on it.') },

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
  // This row was already in the database before the bulk import (the first row of the
  // project), so it is preserved with its original wording and source. UCT Science uses
  // an FPS out of 800, which the calculator now computes - but the numeric cut-off is on
  // pages of the 2027 prospectus that could not be read, so no points figure is shown.
  { ...base, id: 'uct-bsc-compsci', career_id: 'software-engineer', name: 'BSc Computer Science',
    faculty: 'Science', duration_years: null, min_aps: 660, score_type: 'band_a',
    source_url: 'https://sit.uct.ac.za/our-degrees-undergraduates/bsc-degrees',
    scoring_system: 'UCT_FPS800', intake_year: null, document_date: null,
    subject_requirements: [pct('Mathematics', 70)],
    notes: flag('partially-verified', bands(660, 640, 550) + ' Mathematics 70%+ and Physical Science 60%+ are also needed for Bands A/B at the faculty level. UCT’s own Computer Science page states the Maths minimum directly but defers full admission rules to the Science Faculty Handbook, so whether Physical Science is required for Computer Science specifically (rather than only mattering for the faculty-wide FPS calculation) is not separately confirmed - not shown as a subject requirement above to avoid overclaiming it. These FPS figures come from a web search surfacing UCT Science’s own admissions-criteria PDF (which returned undecoded binary content to this pass’s fetch tool), not a raw page read, and from a document that was not confirmed as the 2027-specific version - re-check before fully relying on it.') },

  // ---------------- Humanities ----------------
  // Requirements are confirmed; the numeric FPS cut-off was in the truncated part of
  // the prospectus, so min_aps stays null rather than being invented.
  { ...base, id: 'uct-ba-humanities', career_id: 'humanities-generalist', name: 'BA / BSocSc',
    faculty: 'Humanities', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [
      engPct(50, 60), pct('Life Orientation', 50),
      manual('NBT', 'An NBT Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out.'),
      manual('Major-specific', 'An Economics major needs Maths 60%. A Psychology major needs Maths 50% or a Proficient NBT Quantitative Literacy result.'),
    ],
    notes: flag('partially-verified', bands(450, 450, 380) + ' The subject requirements here are confirmed from the UCT 2027 prospectus; the FPS figures above come from a web search surfacing UCT Humanities’ own admission guidelines (the prospectus PDF returned undecoded binary content to this pass’s fetch tool), not a raw page read - re-check before fully relying on it.') },
  { ...base, id: 'uct-ba-psychology', career_id: 'clinical-psychologist', name: 'BA / BSocSc (with Psychology as a major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [
      engPct(50, 60), pct('Life Orientation', 50),
      pct('Mathematics', 50),
      manual('NBT', 'An NBT Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out. UCT’s own page says a Psychology major specifically accepts Maths 50% OR a Proficient NBT Quantitative Literacy result instead - we show the Maths route above since it’s the one we can check from marks alone.'),
    ],
    notes: flag('partially-verified', bands(450, 450, 380) + ' You’re admitted to the general BA/BSocSc (same entry point as humanities-generalist) and choose Psychology as a major from second year - UCT is one of the few universities that publishes a major-specific subject note for Psychology, which is why the Maths requirement above is more specific than the general BA entry. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise. The FPS figures come from a web search surfacing UCT Humanities’ own admission guidelines, not a raw page read - re-check before fully relying on it.') },
  { ...base, id: 'uct-ba-psychology-counselling', career_id: 'counselling-educational-psychologist', name: 'BA / BSocSc (with Psychology as a major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [
      engPct(50, 60), pct('Life Orientation', 50),
      pct('Mathematics', 50),
      manual('NBT', 'An NBT Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out. UCT’s own page says a Psychology major specifically accepts Maths 50% OR a Proficient NBT Quantitative Literacy result instead - we show the Maths route above since it’s the one we can check from marks alone.'),
    ],
    notes: flag('partially-verified', bands(450, 450, 380) + ' You’re admitted to the general BA/BSocSc (same entry point as humanities-generalist) and choose Psychology as a major from second year. This is the undergraduate entry point only - see the career page for the Honours/Master’s route required to actually practise. The FPS figures come from a web search surfacing UCT Humanities’ own admission guidelines, not a raw page read - re-check before fully relying on it.') },
  { ...base, id: 'uct-ba-journalism', career_id: 'journalist-communications', name: 'BA / BSocSc (with a media/communications-related major)',
    faculty: 'Humanities', duration_years: 3, min_aps: 450, score_type: 'band_a',
    subject_requirements: [
      engPct(50, 60), pct('Life Orientation', 50),
      manual('NBT', 'An NBT Academic Literacy result of Lower Intermediate or Basic normally rules an applicant out.'),
    ],
    notes: flag('partially-verified', bands(450, 450, 380) + ' UCT does not list Journalism as its own admission line - you’re admitted to the general BA/BSocSc and choose your major from second year. Confirm which specific major UCT offers in this area before relying on it. The FPS figures come from a web search surfacing UCT Humanities’ own admission guidelines, not a raw page read - re-check before fully relying on it.') },
];
