// Every gap and conflict the research pass found. This is deliberately public:
// the "Data & sources" page renders it, because a product whose whole claim is
// "we only show sourced numbers" has to be just as clear about what it does NOT know.
//
// status: verified | partially_verified | could_not_verify

export const researchLog = [
  // ---- UCT ----
  { id: 'log-001', university_id: 'uct', faculty_or_program: 'BSc Computer Science', status: 'partially_verified',
    notes: 'Confirmed Maths >=70% from UCT Computer Science dept page. Full APS and other subject requirements need the Science Faculty Handbook (PDF, not yet located/fetched) before this program can be marked fully verified.' },
  { id: 'uct-law-fps', university_id: 'uct', faculty_or_program: 'Law (LLB) - FPS cut-offs', status: 'could_not_verify',
    notes: 'The UCT 2027 prospectus PDF (about 319 KB) exceeded the fetch limit and was cut off after page 54, before the Law section on page 59. Confirmed: NBTs are compulsory for all LLB applicants and international applicants write the AL test. The numeric FPS thresholds need a targeted re-read of the prospectus.' },
  { id: 'uct-science-fps', university_id: 'uct', faculty_or_program: 'Science - programme FPS cut-offs', status: 'could_not_verify',
    notes: 'Confirmed: UCT Science FPS is out of 800 because Mathematics and Physical Sciences are doubled. The programme-specific thresholds start on page 64 of the prospectus, which was truncated in the fetch. Needs a targeted re-read.' },
  { id: 'uct-humanities-fps', university_id: 'uct', faculty_or_program: 'Humanities - numeric FPS cut-off', status: 'partially_verified',
    notes: 'Subject requirements are captured and shown (English HL 50% or FAL 60%, Life Orientation 50%, NBT AL above Basic/Lower Intermediate, Economics major Maths 60%, Psychology major Maths 50% or Proficient NBT QL). The numeric FPS cut-off was in the truncated part of the PDF.' },
  { id: 'uct-offerings', university_id: 'uct', faculty_or_program: 'Programmes UCT does not offer', status: 'verified',
    notes: 'The 2027 prospectus lists no undergraduate Pharmacy, Dentistry or Nursing, and no undergraduate BEd - UCT offers only a postgraduate PGCE.' },

  { id: 'scoring-uct-2025-doc', university_id: 'uct', faculty_or_program: 'UCT APS rule source is a 2025 document', status: 'partially_verified',
    notes: 'UCT’s APS/FPS rule was read from the 2025 Guidelines for Admission. The 2027 prospectus (source of our programme requirements) could not be read in full, so we assume the rule is unchanged. UCT Science (FPS out of 800) and Health Sciences (FPS out of 900, needs NBT) are described by UCT but not calculated.' },
  { id: 'scoring-wits-verified', university_id: 'wits', faculty_or_program: 'Wits APS table', status: 'verified',
    notes: 'Wits’s entry-requirements page was read in full on 2026-10-01: best seven subjects including Life Orientation, faculty-specific subjects must be included, 90-100% = 8 down to 40-49% = 3 and nothing below 40%, English and Mathematics +2 from 60%, Life Orientation 4/3/2/1. Two corrections to our first version: results below 40% score zero, and required subjects are forced into the seven.' },
  { id: 'scoring-uj-partial', university_id: 'uj', faculty_or_program: 'UJ APS rule', status: 'partially_verified',
    notes: 'UJ’s rule (six subjects on the 1-7 scale excluding Life Orientation, compulsory subjects counted first) was seen only as excerpts of UJ’s own documents; the documents themselves blocked automated access.' },
  { id: 'scoring-up-verified', university_id: 'up', faculty_or_program: 'UP APS rule', status: 'verified',
    notes: 'Read from a UP Faculty of Humanities undergraduate admission document: six 20-credit recognised subjects on the 1-7 scale, Life Orientation excluded, maximum 42. UP’s website blocked automated access, so this is one faculty’s document; other faculties may select on more than the APS.' },
  { id: 'contact-pack-uct-nbt', university_id: 'uct', faculty_or_program: 'UCT NBT contact in the research pack', status: 'partially_verified',
    notes: 'The research pack lists nbt@uct.ac.za for UCT NBT queries. UCT’s own contacts page (uct.ac.za/general-contacts) lists adp-aarp@uct.ac.za and +27 21 650 3523 / 5045 for the National Benchmark Tests. We use UCT’s published contact. The same page lists undergraduate financial aid as financialaid@uct.ac.za / +27 21 650 3545, which differs from the address in the pack.' },
  { id: 'pack-uct-fps-800', university_id: 'uct', faculty_or_program: 'Research pack claim: UCT faculties use FPS out of 800', status: 'partially_verified',
    notes: 'The research pack says UCT faculties use a Faculty Points Score out of 800. UCT’s own guidelines say only the Faculty of Science is out of 800; Commerce, Engineering & the Built Environment, Humanities and Law are out of 600 (equal to the APS) and Health Sciences is out of 900. We use UCT’s wording.' },

  // ---- Wits ----
  { id: 'wits-health-cutoffs', university_id: 'wits', faculty_or_program: 'Health Sciences - Composite Index cut-offs', status: 'could_not_verify',
    notes: 'Wits Health Sciences uses a Composite Index (75% school average across 5 subjects, 25% NBT) rather than APS, and does not publish the cut-off scores at all. This is not a research gap we can close - the numbers are not public.' },
  { id: 'wits-slo-2026-label', university_id: 'wits', faculty_or_program: 'All rows sourced from the schools-liaison guide', status: 'partially_verified',
    notes: 'The Wits schools-liaison Grade 12 guide is headed "prospective students for 2026". Every row resting on it alone is flagged in the product as a dated document. Each needs checking against its 2027 course-finder page.' },
  { id: 'wits-architecture-conflict', university_id: 'wits', faculty_or_program: 'Bachelor of Architectural Studies - APS', status: 'could_not_verify',
    notes: 'CONFLICT between two official Wits sources. The schools-liaison guide says APS 34+ with English 4 and Maths 4. The BAS application FAQ says minimum APS 29 with Maths 50% and English 50%. We show both and no number. Needs the School of Architecture to confirm.' },
  { id: 'wits-maths-sciences-conflict', university_id: 'wits', faculty_or_program: 'BSc Mathematical Sciences - APS', status: 'partially_verified',
    notes: 'CONFLICT: the 2027 course-finder page says APS 44+; the 2026 schools-liaison guide says 42+. We display 44 because the course-finder is the more recent official source, and the conflict is shown on the programme.' },

  // ---- UKZN ----
  { id: 'ukzn-2027-table', university_id: 'ukzn', faculty_or_program: 'All programmes - 2027 figures', status: 'partially_verified',
    notes: 'The most recent official source found is the Study@UKZN brochure labelled 2026. No 2027 table was found on an official UKZN source. All UKZN rows are flagged as a dated document in the product.' },
  { id: 'ukzn-aps-scale', university_id: 'ukzn', faculty_or_program: 'APS scale - percentage to level conversion', status: 'verified',
    notes: 'RESOLVED 2026-10-01. UKZN’s points table was read from its 2026 College of Law and Management Studies handbook: 90-100% = 8, 80-89% = 7, 70-79% = 6, 60-69% = 5, 50-59% = 4, 40-49% = 3, 30-39% = 2, 0-29% = 1, over six subjects excluding Life Orientation (maximum 48). The calculator now computes UKZN scores. UKZN programme figures are still from 2026 documents.' },

  // ---- UJ ----
  { id: 'uj-capture-method', university_id: 'uj', faculty_or_program: 'All programmes', status: 'partially_verified',
    notes: 'UJ figures were captured from search-engine indexed text of official UJ programme pages. Full-page fetches returned only the navigation menu, and the 2027 prospectus PDF was blocked by the fetch tool. Every UJ row is flagged as partially verified in the product.' },
  { id: 'uj-omitted-rows', university_id: 'uj', faculty_or_program: 'BSc CS & Informatics (AI specialisation); BEd Foundation Phase', status: 'could_not_verify',
    notes: 'UJ lists a BSc Computer Science & Informatics AI specialisation at APS 34 with Maths level 7, and a BEd Foundation Phase at APS 28 with English HL 5 or FAL 6 and Maths 3 or Maths Lit 5. We did not capture the exact programme-page URL for either, so they are NOT shown as programmes - citing them to a generic listing page would break the promise that every number links to the page that states it.' },
  { id: 'uj-health', university_id: 'uj', faculty_or_program: 'MBChB, Pharmacy, Physiotherapy', status: 'could_not_verify',
    notes: 'Not found on any official UJ source. UJ appears not to offer these, but that needs confirming rather than assuming.' },

  // ---- UWC ----
  { id: 'uwc-points-table', university_id: 'uwc', faculty_or_program: 'Weighted points conversion table', status: 'partially_verified',
    notes: 'RESOLVED except two conflicts. The scoring rule was read from UWC’s own official APS calculator code: English and Mathematics score 1,3,5...15 from level 1 to 8; the additional language, Mathematical Literacy and other subjects score the level (1-8); Life Orientation 0-3; total = English + additional language + Mathematics or Mathematical Literacy + Life Orientation + 3 best others (maximum 65). CONFLICT 1: UWC’s application-information page puts Mathematical Literacy in the same high-points column as Mathematics, but its calculator says it no longer does. We follow the calculator. CONFLICT 2: for Life Orientation at 20-29% the table says 1 point and the calculator gives 0. We follow the calculator.' },
  { id: 'uwc-subject-minimums', university_id: 'uwc', faculty_or_program: 'Subject minimums, all faculties except Law', status: 'could_not_verify',
    notes: 'The UWC programme pages did not render for the fetch. Only LLB (37 points) and BCom Law (30 points) were captured, and even for LLB the per-subject minimums could not be read.' },
  { id: 'uwc-faculties', university_id: 'uwc', faculty_or_program: 'Dentistry, Pharmacy, Nursing, Natural Sciences, EMS, Education', status: 'could_not_verify',
    notes: 'Not verified in this pass.' },

  // ---- NWU / UFS ----
  { id: 'nwu-remainder', university_id: 'nwu', faculty_or_program: 'LLB, BCom, BEd, BA, Health Sciences', status: 'could_not_verify',
    notes: 'Not researched - the pass ran out of budget. The NWU pages that were captured also carry no intake year and do not state programme durations.' },
  { id: 'nwu-aps-formula', university_id: 'nwu', faculty_or_program: 'APS formula', status: 'verified',
    notes: 'RESOLVED 2026-10-01. NWU’s own APS calculator page shows six subjects on an 8-point scale (90-100% = 8 ... 0-29% = 1) with Life Orientation not counted. The calculator now computes NWU scores. NWU programme coverage is still only two entries.' },
  { id: 'ufs-remainder', university_id: 'ufs', faculty_or_program: 'Everything except MBChB', status: 'could_not_verify',
    notes: 'Not researched - only MBChB is captured. For MBChB the 2027 rules now give the per-subject minimums (level 5 / 60% in English, Mathematics, Physical Sciences and Life Sciences) and the AP of at least 36; the duration is still not stated. UFS also publishes programme closing dates on its application page (31 May for Medicine and several health programmes, 31 July for Nursing, Social Work and Architecture, 30 September for the rest).' },
  { id: 'ufs-ap-formula', university_id: 'ufs', faculty_or_program: 'AP score formula', status: 'partially_verified',
    notes: 'PARTLY RESOLVED. The 2027 MBChB selection rules confirm the structure (four compulsory subjects plus best two, 1 point for Life Orientation at level 5+) but defer to the prospectus for the point scale. The only scale we could read is in UFS’s 2024 prospectus (90-100% = 8, 80-89% = 7 ... 30-39% = 2, below 30% none), so we use it and flag it as coming from an older document. Confirm against the current UFS prospectus.' },

  // ---- Content areas rather than universities ----
  { id: 'nbt-logistics', university_id: null, faculty_or_program: 'NBT registration, fees, test centres and rewrites', status: 'could_not_verify',
    notes: 'The NBT page explains which universities require the test and what bands they ask for, all sourced from those universities’ own documents. What is NOT captured from an official source is the NBT’s own process: how to register, what it costs, where you write, and whether you may write more than once. Those claims are deliberately absent from the site until they come from the NBT project itself.' },
  { id: 'study-abroad-requirements', university_id: null, faculty_or_program: 'Study abroad - foreign university entry requirements', status: 'could_not_verify',
    notes: 'No foreign university’s admission requirements have been verified from official sources. The Studying Abroad page therefore describes the process and the questions to ask, and states plainly that it contains no specific entry requirements, rather than repeating figures from agents and forums.' },
  { id: 'bursaries-none-yet', university_id: null, faculty_or_program: 'Bursaries - the whole dataset', status: 'could_not_verify',
    notes: 'No bursaries have been captured yet. The finder, the deadline sorting and the WhatsApp reminder sign-up are all built and working, but the bursaries table is empty because no bursary has yet been verified against its provider’s own page. A list of unverified bursaries would be worse than an empty page - bursary scams are common.' },

  // ---- Universities not researched at all ----
  ...[
    ['nmu', 'Nelson Mandela University'], ['ul', 'University of Limpopo'], ['univen', 'University of Venda'],
    ['wsu', 'Walter Sisulu University'], ['ufh', 'University of Fort Hare'], ['spu', 'Sol Plaatje University'],
    ['ump', 'University of Mpumalanga'], ['cut', 'Central University of Technology'],
    ['cput', 'Cape Peninsula University of Technology'], ['dut', 'Durban University of Technology'],
    ['tut', 'Tshwane University of Technology'], ['mut', 'Mangosuthu University of Technology'],
    ['unizulu', 'University of Zululand'], ['unisa', 'University of South Africa'],
    ['smu', 'Sefako Makgatho Health Sciences University'],
  ].map(([id, name]) => ({
    id: `not-researched-${id}`, university_id: id, faculty_or_program: `${name} - all programmes`,
    status: 'could_not_verify',
    notes: `${name} has not been researched yet. It is queued for the recurring data pass and will appear on the site once its requirements are captured from official sources.`,
  })),
  { id: 'not-researched-vut', university_id: 'vut', faculty_or_program: 'Vaal University of Technology - all programmes', status: 'could_not_verify',
    notes: 'Not researched yet. VUT does publish a 2027 minimum-requirements PDF on vut.ac.za, which was located but not extracted - that is the starting point for the next pass.' },
];
