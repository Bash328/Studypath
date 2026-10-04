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
    gaps: [],
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
    gaps: [],
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
    gaps: [],
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
    gaps: [],
  },

  UJ_APS_exLO: {
    status: 'verified',
    sources: [{ label: 'UJ 2027 Undergraduate Prospectus, “How to determine your Admission Point Score (APS)” (p. 15-16)', url: 'https://www.uj.ac.za/wp-content/uploads/2026/07/uj_undergrad_prospectus2027_online_25jun2026.pdf' }],
    confirmed: [
      'Six subjects, added up on the NSC 1-7 scale (7 = 80-100%, 6 = 70-79%, 5 = 60-69%, 4 = 50-59%, 3 = 40-49%, 2 = 30-39%, 1 = 0-29%), maximum 42.',
      'Life Orientation is not counted. The prospectus’s own worked example (65%, 71%, 61%, 68%, 81%, 86% = 5+6+5+5+7+7 = 35) matches our calculation.',
    ],
    gaps: [],
  },

  UKZN_APS_exLO: {
    status: 'partial',
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
    status: 'partial',
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
    gaps: [],
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

  TUT_APS: {
    status: 'partial',
    sources: [{ label: 'TUT General Information for First-Year Enrolment 2027', url: 'https://www.tut.ac.za/media/tshwane-interim/site-content/documents/General-Information-First-Year-Enrolment.pdf' }],
    confirmed: ['Best six subjects, excluding Life Orientation and excluding any subject scored at achievement level 1.', 'Standard NSC achievement levels 1-7.'],
    gaps: ['We have not independently confirmed whether the level-1 exclusion changes which six subjects are selected versus simply scoring a level-1 subject as 0 - we implement it as excluding that subject from the selection pool entirely.'],
  },
  VUT_APS: {
    status: 'partial',
    sources: [{ label: 'VUT 2027 Undergraduate Minimum Admission Requirements', url: 'https://vut.ac.za/wp-content/uploads/2026/03/2027-Undergraduate-Minimum-Admission-Requirements.pdf' }],
    confirmed: ['Best six subjects, excluding Life Orientation.'],
    gaps: ['VUT’s document did not spell out the exact points-per-percentage table, so we assume the standard NSC 1-7 achievement-level scale (no extra 90%+ band) used by UP, UJ and UL - VUT’s published programme APS figures are consistent with that scale. Several programmes also apply additional selection rules (e.g. a combined Mathematics + Physical Science threshold) we show as a note rather than compute.'],
  },
  DUT_APS: {
    status: 'partial',
    sources: [{ label: 'DUT Study Opportunities 2027', url: 'https://www.dut.ac.za/wp-content/uploads/2026/06/Study-Opportunities-2027.pdf' }],
    confirmed: ['Best six subjects, excluding Life Orientation ("not a 20-credit subject").'],
    gaps: ['DUT’s document did not spell out the exact points-per-percentage table; we assume the standard NSC 1-7 achievement-level scale, consistent with its published programme APS figures. Several programmes also apply additional selection rules (e.g. a combined Mathematics + Physical Science threshold) we show as a note rather than compute, and many DUT programmes publish no single APS cut-off at all.'],
  },
  UNIZULU_APS: {
    status: 'partial',
    sources: [{ label: 'UniZulu "Applying to Study"', url: 'https://www.unizulu.ac.za/wp-content/uploads/2022/10/ApplyingToStudy.pdf' }],
    confirmed: ['Best six subjects, excluding Life Orientation.', 'Points: 90-100% = 8, 80-89% = 7, 70-79% = 6, 60-69% = 5, 50-59% = 4, 40-49% = 3, 30-39% = 2, 0-29% = 1 - the same scale as NWU and UKZN.'],
    gaps: ['The source document’s URL and content carry no explicit 2027 label, so its currency for the 2027 intake is not independently confirmed (the arithmetic matches standard national practice). We have not yet captured a UniZulu programme with a published APS minimum to check this against.'],
  },
  UL_APS: {
    status: 'partial',
    sources: [{ label: 'UL Undergraduate Prospectus 2027', url: 'https://www.ul.ac.za/wp-content/uploads/2025/03/Undergraduate-Prospectus-2027.pdf' }],
    confirmed: ['Best six subjects, excluding Life Orientation.', 'Points: NSC level 7 (80-99%) down to level 1 (0-29%) - the standard 1-7 scale.', 'Separately required: at least level 3 in Life Orientation and at least level 3 in the language of learning and teaching.'],
    gaps: ['This document’s admissions content was diffed against an older edition and found unchanged, so treated as current rather than independently re-confirmed page by page. UL states meeting the minimum APS does not guarantee admission, which we cannot model.'],
  },
  UNISA_APS: {
    status: 'verified',
    sources: [{ label: 'Unisa General Admission Requirements', url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission/Undergraduate-qualifications/Qualifications/General-admission-requirements' }],
    confirmed: ['"The APS calculation is done by using the NSC 1 to 7 scale of achievement. It is based on your achievement in six recognised 20-credit subjects." Maximum 42. Life Orientation (a 10-credit subject) is explicitly excluded.', 'Scale: 7=80-100%, 6=70-79%, 5=60-69%, 4=50-59%, 3=40-49%, 2=30-39%, 1=0-29%.'],
    gaps: [],
  },

  UNIVEN_APS: {
    status: 'partial',
    sources: [
      { label: 'Univen 2027 Undergraduate Prospectus', url: 'https://www.univen.ac.za/wp-content/uploads/2026/09/UniVen-2027-Prospectus.pdf' },
      { label: 'Univen "How to calculate your APS" (user-supplied screenshot)', url: 'https://univen.ac.za/student-affairs/student-support-services/how-to-calculate-your-aps' },
    ],
    confirmed: ['"Points are calculated on the best six subjects excluding Life Orientation" (more than 7 subjects: best 7 are used); subjects under 40% are not counted; general Bachelor’s minimum is APS 26.', 'RESOLVED 2026-10-03: the user supplied a screenshot of Univen\'s own scoring-scale table (Matric symbol / NSC level / Percentage / Score) - the "Score" column is simply the percentage divided by 10 (e.g. 85% = 8.5), with 0 for anything under 30% (the table\'s F/G bands) - not a flat per-level score as every other university on this site uses. This matches the RU_pct_div10-style percentage formula, just with a 40%-floor twist layered on by the Prospectus text above.'],
    gaps: ['We have not checked it against a worked example with a shown total, and the “best 7 if more than 7 subjects” rule in the prospectus text is not modelled - we always use your best 6.'],
  },
  WSU_APS: {
    status: 'partial',
    sources: [{ label: 'WSU 2027 Undergraduate Information Brochure & Admission Requirements', url: 'https://wsu.ac.za/media/attachments/2026/05/27/2027-information-brochure-admission-requirements.pdf' }],
    confirmed: ['Best six subjects (seven for Education programmes, which also count Life Orientation), excluding Life Orientation otherwise.', 'Points: 90-100% = 8 down to 0-29% = 1.', 'Two subjects reserved for languages (Category 1); four for the subjects the programme requires (Category 2).'],
    gaps: ['We use your best two languages for Category 1. The brochure does not say whether it means your two best or one specific pair (for example English plus your home language), so this is our reading of “languages”.'],
  },
  UFH_APS: {
    status: 'verified',
    sources: [{ label: 'UFH Admission requirements / APS Calculator (user-supplied screenshot)', url: 'https://www.ufh.ac.za/admission' }],
    confirmed: ['General minimum APS of 26 or higher "depending on the programme".', 'UFH’s own online APS-calculator JavaScript sums standard NSC achievement levels (1-7) across seven subject slots (two languages, Mathematics/Mathematical Literacy, Life Orientation, three electives), with no exclusion or cap logic found in that code.', 'RESOLVED 2026-10-03: the user supplied a screenshot of a worked example run through UFH\'s own calculator (English HL 65%, Afrikaans FAL 55%, Mathematics 80%, Life Orientation 85%, Physical Science 75%, Life Sciences 80%, Geography 65% -> "Total APS: 41") - a plain sum of all seven subjects\' standard NSC levels (5+4+7+7+6+7+5=41) matches exactly, confirming Life Orientation is NOT halved or capped in practice despite denser policy text elsewhere suggesting it might be.'],
    gaps: [],
  },
  CPUT_APS: {
    status: 'partial',
    sources: [{ label: 'CPUT 2027 Undergraduate Prospectus (p.3)', url: 'https://issuu.com/cput6/docs/2027_prospectus' }],
    confirmed: ['Method 1 (best of six subjects): six highest-scoring subjects, including any the programme requires, excluding Life Orientation; percentages summed and divided by 10.', 'Method 2 (double Maths and Science): required subjects plus the 4th-highest, excluding LO, with Mathematics and Physical Sciences doubled, divided by 10 - used for CPUT’s Engineering diplomas.', 'Method 3 (double Maths and Accounting): Mathematics and Accounting doubled, plus English and the next three best subjects excluding LO, divided by 10 - used for some Commerce programmes.'],
    gaps: ['Method 3 has no captured CPUT programme to check against, so it is built from the confirmed rule but not tested against a real example. The source is an Issuu flipbook that could not be re-read.'],
  },
  CUT_APS: {
    status: 'partial',
    sources: [{ label: 'CUT Admission Points (AP)', url: 'https://www.cut.ac.za/admission-points-ap' }],
    confirmed: ['"A candidate must score at least 27 or more points on the CUT scoring scale, for admission to CUT." Points 30-39%=2 up to 90-100%=8 for six academic subjects.', '"Life Orientation forms part of the final score, with a maximum value of one" regardless of the actual LO mark.', '21 or fewer points: not admitted. 22-26: a selection test is required.'],
    gaps: ['The page does not say whether a student who fails Life Orientation (under 30%) still earns 1 point or 0, and we found no worked example to settle it.'],
  },
  MUT_APS: {
    status: 'partial',
    sources: [
      { label: 'MUT Diploma in Information Technology (programme page)', url: 'https://www.mut.ac.za/wp-content/uploads/2025/12/2026-Applied-and-Health-Sciences-Handbook.pdf' },
      { label: 'MUT First-Year Prospectus 2026 (user-supplied)', url: 'https://www.mut.ac.za' },
      { label: 'MUT Undergraduate Prospectus (user-supplied)', url: 'https://www.mut.ac.za' },
      { label: 'MUT "Point calculation matrix" (user-supplied screenshot)', url: 'https://mut.ac.za/admission-requirements/' },
    ],
    confirmed: ['Best six subjects excluding Life Orientation, each on the standard 1-8 NSC level scale, summed - no Life Orientation bonus at all.', 'RESOLVED 2026-10-03: a 4th independent MUT document (its own admission-requirements page, screenshotted by the user) shows the identical NSC-level-to-points matrix already implemented (90-100%=8 down to 40-49%=3) - a fourth source now agrees on the six-subject, no-LO-bonus formula.'],
    gaps: ['Best six rests on four official MUT documents agreeing against one older page that said best five; no single current page states the older claim was wrong.'],
  },
  NMU_AS: {
    status: 'partial',
    sources: [{ label: 'NMU "How do I calculate my APS?"', url: 'https://www.mandela.ac.za/Apply/Frequently-asked-questions/Admissions/How-do-I-calculate-my-APS-' }],
    confirmed: ['NMU’s "Applicant Score" (AS) sums the raw percentages (not NSC achievement levels) of your best six 20-credit subjects, excluding Life Orientation, out of 600.', 'Applicants from quintile 1-3 schools who score 50%+ in Life Orientation get a 7-point bonus.', '16 programmes now captured, each with a published AS minimum consistent with this formula.'],
    gaps: ['Most of the faculty guides behind these programmes are dated 2024 (apparently the 2025 intake) and are not confirmed as current for 2027. The quintile 1-3 Life Orientation bonus is not modelled; we show the base AS, which is never higher than a student’s true score.'],
  },
  SMU_APS: {
    status: 'verified',
    sources: [
      { label: 'SMU Medicine undergraduate admission requirements', url: 'https://www.smu.ac.za/schools/medicine/medicine-undergraduate-admission-requirements/' },
      { label: 'SMU Health Care Sciences undergraduate admission requirements', url: 'https://www.smu.ac.za/schools/health-care-sciences/health-care-sciences-undergraduate-admission-requirements/' },
    ],
    confirmed: ['RESOLVED 2026-10-03: a raw read of the HTML tables on SMU\'s own Medicine admission-requirements page (an earlier pass had misread an AI-summarised version of the same page, which merged columns from Table 2 and reported the wrong conversion) shows Table 2\'s "NSC marks %" column is just the standard 1-7 NSC achievement-level scale (80-100%=7 down to 0-29%=1) - its higher points (8-12) are for other qualifications (A-Level, IB, IGCSE etc.), not NSC marks at all.', 'Table 1\'s apparent 29-vs-38 mismatch is not an error: it shows two different totals side by side - a 29-point "SMU Admission Score for preselection" using only the five named subjects (English, Mathematics, Physical Science, Life Sciences, Life Orientation), and a 38-point "Minimum APS Points" total that also includes two unnamed "Additional subject" slots (minimums 5 and 4). So MBChB\'s real APS is the standard seven-subject sum, same shape as most other universities on this site.', 'SMU Pharmacy and Health Care Sciences programmes (Dietetics, Nursing, OT, Physiotherapy, Speech-Language Pathology, Audiology) already state subject minimums on this same standard 1-7 scale.'],
    gaps: [],
  },
  SPU_APS: {
    status: 'partial',
    sources: [
      { label: 'SPU Faculty of Natural & Applied Sciences programmes', url: 'https://www.spu.ac.za/index.php/spu-nas-programmes/' },
      { label: 'SPU APS Calculator (user-supplied screenshot)', url: 'https://spu.ac.za/index.php/admission-requirements-2/' },
    ],
    confirmed: ['General minimums: Bachelor’s degree APS 30, Diploma APS 25.', 'English: NSC level 4 (Home Language) or level 5 (First Additional Language).', 'RESOLVED 2026-10-03: the user supplied a screenshot of SPU\'s own live APS Calculator table (NSC Achievement Level / NSC% / SPU Points Score / Additional points for Mathematics and Language (HL) / Points for Life Orientation). It names seven fixed subject slots (Home Language, First Additional Language, Mathematics, Life Orientation, three electives), scores six of them on the standard 8-point scale (90-100%=8), gives Mathematics and the Home Language subject a further bonus from their own level (+2 at level 5+, +1 at level 3-4), and scores Life Orientation on its own separate 0-4 scale instead of the main one.'],
    gaps: ['The calculator screenshot showed no calculated total, so we have not checked our arithmetic end to end against a worked example. The scale itself is read directly from SPU’s table.'],
  },
  UMP_APS: {
    status: 'verified',
    sources: [
      { label: 'UMP Bachelor of Commerce (programme page)', url: 'https://www.ump.ac.za/Study-with-us/Faculties-and-Schools/Faculty-of-Economics,-Development-and-Business-Sci/School-of-Development-Studies/Bachelor-of-Commerce.aspx' },
      { label: 'UMP Undergraduate Programmes (official PDF, 2026-10-03 - a navyblue.co.za reference led us to search ump.ac.za directly for this)', url: 'https://www.ump.ac.za/getattachment/Study-with-us/Application-Process/Online-Applications/Undergraduate-Programmes.pdf.aspx?lang=en-US' },
    ],
    confirmed: ['This and UMP’s BEd Foundation Phase page confirm a numeric APS minimum is published per programme.', 'RESOLVED 2026-10-03: pdftotext on the official Undergraduate Programmes PDF (WebFetch saves binary PDFs locally even when it cannot summarise them) returned the formula word-for-word: "The prescribed seven subjects are the subjects to be used in calculating the APS. The APS achievement rating of Life Orientation is divided by two in the calculation of the APS. If an applicant included more than the minimum of three electives in the applicant\'s NSC, the four compulsories and the three best of the electives will be used." - i.e. six academic subjects (four required + best three electives) plus Life Orientation at half its standard NSC level.'],
    gaps: [],
  },
};

export const auditLabel = (status) => ({
  verified: 'Checked against the official source',
  partial: 'Partly checked',
  unverified: 'Could not be checked',
})[status] || status;
