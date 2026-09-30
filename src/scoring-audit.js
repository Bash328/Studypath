// Audit trail for every scoring formula in scoring.js.
//
// Each university counts your marks its own way, so "is our version of University X's
// calculator actually right?" is the question this product lives or dies on. This file is
// the answer, kept next to the code so the two cannot drift: for every scoring system it
// records what we checked, against which official source, when, and what we could NOT
// confirm or found conflicting.
//
// status:
//   verified    - the rule was read from an official university page/document/calculator
//   partial     - part of it was verified; the gap is named in `gaps`
//   unverified  - not checkable from an official source; we do not calculate it
//
// Shown publicly on /data-sources.html and on each university page.

export const AUDITED_ON = '2026-10-01';

export const SCORING_AUDIT = {
  UCT_FPS600: {
    status: 'verified',
    sources: [{
      label: 'UCT Guidelines for Admission for NSC holders (2025)',
      url: 'https://www.uct.ac.za/sites/default/files/media/documents/2025_National-Senior-Certificate-NSC_Guidelines-for-Admissions.pdf',
    }],
    confirmed: [
      'Add the six best subject percentages, excluding Life Orientation, but including English and any other subject the programme requires.',
      'For Commerce, Engineering & the Built Environment, Humanities and Law the Faculty Points Score (FPS) out of 600 equals the APS.',
      'A result below 40% in any subject does not attract a score.',
    ],
    gaps: [
      'The only UCT document we could read is the 2025 guidelines; the 2027 prospectus (which our programme requirements come from) could not be read in full. The APS rule is assumed unchanged.',
      'UCT Health Sciences (out of 900: APS plus NBT, plus 10 points for a third official language) needs your NBT results, so we do not calculate it. For Health degrees we check your APS against the published APS sub-minimum instead.',
    ],
  },

  UCT_FPS800: {
    status: 'verified',
    sources: [{
      label: 'UCT Guidelines for Admission for NSC holders (2025)',
      url: 'https://www.uct.ac.za/sites/default/files/media/documents/2025_National-Senior-Certificate-NSC_Guidelines-for-Admissions.pdf',
    }],
    confirmed: [
      'For the Faculty of Science the FPS is out of 800: count English, double the scores for Mathematics and Physical Sciences, and add the best three of the remaining scores, other than Life Orientation.',
      'UCT’s own worked example (English 75, isiXhosa 70, Mathematics 84, Physical Sciences 86, Consumer Studies 79, Engineering Graphics & Design 69) gives 633 / 800, and our calculator reproduces it.',
    ],
    gaps: ['The numeric Science cut-offs are on pages of the 2027 prospectus we could not read, so UCT Science degrees show your score but no cut-off to compare it with.'],
  },

  WITS_APS_incLO: {
    status: 'verified',
    sources: [{
      label: 'Wits undergraduate entry requirements',
      url: 'https://www.wits.ac.za/undergraduate/entry-requirements/',
    }],
    confirmed: [
      'Best seven subjects including Life Orientation, and faculty-specific subjects must be included in the calculation.',
      'Points: 90-100% = 8, 80-89% = 7, 70-79% = 6, 60-69% = 5, 50-59% = 4, 40-49% = 3, below 40% = 0.',
      'English and Mathematics get +2 from 60% up (so 90-100% = 10).',
      'Life Orientation scores 4 / 3 / 2 / 1 at 90 / 80 / 70 / 60% and up, otherwise 0, with no bonus.',
    ],
    gaps: [
      'Wits says Mathematical Literacy is considered for LLB, Education and Humanities. It names a bonus only for Mathematics, so we give Mathematical Literacy no bonus.',
    ],
  },

  WITS_COMPOSITE_INDEX: {
    status: 'unverified',
    sources: [{ label: 'Wits Health Sciences (course finder)', url: 'https://www.wits.ac.za/course-finder/undergraduate/health/medicine-and-surgery/' }],
    confirmed: ['Composite Index = 75% school average across 5 subjects + 25% NBT.'],
    gaps: ['Wits does not publish the Composite Index cut-off scores, so there is no number to measure you against. We do not calculate this.'],
  },

  UP_APS_exLO: {
    status: 'verified',
    sources: [{
      label: 'UP Faculty of Humanities undergraduate admission document',
      url: 'https://drupalwebprod-files.up.ac.za/Public/2025-12/2020-hum_ug-final.zp176067.pdf?VersionId=4wZe_mMeDEmQMs5LCJiz4a__0U.IbD3J',
    }],
    confirmed: [
      'Six 20-credit recognised subjects on the NSC 1-7 scale, adding them together, for a maximum of 42.',
      'Life Orientation is excluded.',
      'Level 7 = 80-100%, 6 = 70-79%, 5 = 60-69%, 4 = 50-59%, 3 = 40-49%, 2 = 30-39%, 1 = 0-29%.',
    ],
    gaps: [
      'UP’s website blocked automated access, so this comes from one UP faculty document. Some UP faculties (especially Health Sciences) select on more than the APS.',
    ],
  },

  UJ_APS_exLO: {
    status: 'partial',
    sources: [{ label: 'UJ faculty undergraduate yearbooks (seen via search results)', url: 'https://www.uj.ac.za/faculties/health-sciences/undergraduate/' }],
    confirmed: [
      'Six subjects on the NSC 1-7 scale, Life Orientation excluded.',
      'A programme’s compulsory subjects are counted first, then the best of the remaining subjects.',
    ],
    gaps: ['UJ’s documents blocked automated access, so we only saw these rules as excerpts of UJ’s own pages, not the full pages. Confirm on the UJ programme page.'],
  },

  UKZN_APS_exLO: {
    status: 'verified',
    sources: [
      { label: 'UKZN College of Law & Management Studies Handbook 2026 (points table)', url: 'https://clms.ukzn.ac.za/wp-content/uploads/2026/01/UKZN-CLMS-Handbook-2026.pdf' },
      { label: 'UKZN undergraduate selection procedure', url: 'https://applications.ukzn.ac.za/selection-procedure/undergraduate-selection-procedure/' },
    ],
    confirmed: [
      'Points: 90-100% = 8, 80-89% = 7, 70-79% = 6, 60-69% = 5, 50-59% = 4, 40-49% = 3, 30-39% = 2, 0-29% = 1.',
      'Six subjects, excluding Life Orientation, for a maximum of 48.',
      'English, Mathematics (or Mathematical Literacy) and the best of the other subjects make up the six; no bonus points for extra subjects.',
    ],
    gaps: ['UKZN’s programme figures are from its 2026 documents (no 2027 table was published when we checked), so they are flagged as older.'],
  },

  SU_aggregate_pct: {
    status: 'partial',
    sources: [{ label: 'Stellenbosch Admissions Booklet 2027', url: 'https://files.su.ac.za/public/undergraduate-maties/documents/2026-01/su-admissions-booklet-2027.pdf' }],
    confirmed: [
      'Stellenbosch uses a percentage aggregate excluding Life Orientation, not an APS.',
      'Engineering selection mark = Mathematics% + Physical Sciences% + 6 x the Matric average, where the average is of the six best subjects excluding Life Orientation (maximum 800).',
      'Science selection mark = [(Mathematics x 2) + 5 other subjects, at least one of them English or Afrikaans, excluding Life Orientation] / 7.',
    ],
    gaps: ['The booklet does not define "aggregate" for the minimum requirements in so many words. We use the average of the six best subjects excluding Life Orientation, as it does for the Engineering mark. If you take more than six such subjects this could differ slightly.'],
  },

  RU_pct_div10: {
    status: 'verified',
    sources: [{
      label: 'Rhodes Undergraduate Prospectus',
      url: 'https://www.ru.ac.za/media/rhodesuniversity/content/registrar/documents/information/studentrecruitment/RU_READY_Undergraduate_Prospectus_2026_DIGITAL_A5_Landscape_24pp_18Mar2026.pdf',
    }],
    confirmed: [
      'Take the percentage of each of your 6 subjects, divide each by 10, and add them up.',
      'Life Orientation is not counted for points, but you must get at least 50% in it for acceptance.',
    ],
    gaps: ['Rhodes says "your 6 subjects" without saying which six if you take more; we use your six best.'],
  },

  UWC_weighted: {
    status: 'verified',
    sources: [
      { label: 'UWC official South African APS calculator', url: 'https://www.uwc.ac.za/admission-point-score-calculator/south-african-aps-calculator' },
      { label: 'UWC undergraduate application information', url: 'https://www.uwc.ac.za/admission-and-financial-aid/undergraduate-admission/application-information' },
    ],
    confirmed: [
      'Seven subjects: English, an additional language, Mathematics or Mathematical Literacy, Life Orientation, and your 3 best other subjects.',
      'English and Mathematics score 1, 3, 5, 7, 9, 11, 13, 15 at levels 1-8; the additional language, Mathematical Literacy and each other subject score the level itself (1-8).',
      'Life Orientation scores 0-3.',
    ],
    gaps: [
      'CONFLICT: UWC’s application-information page puts Mathematical Literacy in the same high-points column as Mathematics, but UWC’s own calculator says it "no longer" does and scores it as an ordinary subject. We follow the calculator.',
      'CONFLICT (small): for Life Orientation at level 1 (20-29%) UWC’s table says 1 point and its calculator gives 0. We follow the calculator.',
    ],
  },

  NWU_APS: {
    status: 'verified',
    sources: [{ label: 'NWU APS calculator', url: 'https://studies.nwu.ac.za/studies/aps-calculator' }],
    confirmed: [
      'Six subjects, excluding Life Orientation.',
      'Points: 90-100% = 8, 80-89% = 7, 70-79% = 6, 60-69% = 5, 50-59% = 4, 40-49% = 3, 30-39% = 2, 0-29% = 1.',
    ],
    gaps: ['NWU says "six best subjects" on one page and lists six subject rows on its calculator; we take your six best.'],
  },

  UFS_AP: {
    status: 'partial',
    sources: [
      { label: 'UFS MBChB selection rules 2027', url: 'https://www.ufs.ac.za/docs/librariesprovider25/default-document-library/2027-mbchb-selection-rules.pdf?sfvrsn=34af520_0' },
      { label: 'UFS Undergraduate Programmes 2024 (AP scale)', url: 'https://www.ufs.ac.za/docs/librariesprovider23/ems-documents/e3_ufs-undergraduade-programme-2024.pdf?sfvrsn=71432920_3' },
    ],
    confirmed: [
      'Points for six academic subjects: 90-100% = 8, 80-89% = 7, 70-79% = 6, 60-69% = 5, 50-59% = 4, 40-49% = 3, 30-39% = 2, below 30% = none.',
      'Life Orientation adds 1 point at 60% or more.',
      'For MBChB the AP is worked from the four compulsory subjects (English, Mathematics, Physical Sciences, Life Sciences) plus the best two others.',
    ],
    gaps: ['The 2027 document points to the AP scale "in the official UFS Prospectus". The only scale we could read is from the 2024 prospectus, so we assume it is unchanged. Other UFS faculties may count subjects differently.'],
  },
};

export const auditLabel = (status) => ({
  verified: 'Checked against the official source',
  partial: 'Partly checked',
  unverified: 'Could not be checked',
})[status] || status;
