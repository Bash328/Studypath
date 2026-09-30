// Per-university scoring.
//
// THE RULE THIS FILE EXISTS TO ENFORCE: South African university admission scores
// are not comparable with each other. A "Wits APS of 42" is not a "UP APS of 35" and
// neither is a "UCT FPS of 500". So there is no universal score anywhere in this
// product. Every programme row carries a `scoring_system`, and we compute that
// system's own number from the same set of marks, then report them separately.
//
// The second rule: where we have not verified a university's formula from an official
// source, we do NOT calculate it. `computable: false` systems return a reason instead
// of a number. Showing a guessed score would be worse than showing nothing, because a
// student would plan around it.

import { isLifeOrientation } from './subjects.js';

/**
 * The lowest percentage that earns each NSC achievement level.
 * Levels 1-6 are identical on the standard 7-level scale and on the 8-level scale
 * that Wits and UKZN use, and we only ever test "at least level N", so one floor
 * table is correct for both when checking subject requirements.
 */
export const LEVEL_FLOOR = { 1: 0, 2: 30, 3: 40, 4: 50, 5: 60, 6: 70, 7: 80, 8: 90 };

/** Standard NSC achievement level (1-7) from a percentage. */
export const nscLevel = (pct) =>
  pct >= 80 ? 7 : pct >= 70 ? 6 : pct >= 60 ? 5 : pct >= 50 ? 4 : pct >= 40 ? 3 : pct >= 30 ? 2 : 1;

/**
 * Wits works on an 8-point scale. The Wits entry-requirements page states that for
 * English and Maths "90-100% = 10" once the +2 bonus is applied, which fixes 90-100%
 * at level 8; the rest follows the usual 10% bands.
 */
export const witsLevel = (pct) =>
  pct >= 90 ? 8 : pct >= 80 ? 7 : pct >= 70 ? 6 : pct >= 60 ? 5 : pct >= 50 ? 4 : pct >= 40 ? 3 : pct >= 30 ? 2 : 1;

const withoutLO = (marks) => marks.filter((m) => !isLifeOrientation(m));
const findBase = (marks, base) => marks.find((m) => m.base === base);
const byPercentDesc = (a, b) => b.percent - a.percent;

const ok = (value, max, working) => ({ computable: true, value: Math.round(value * 10) / 10, max, working });
const cannot = (reason) => ({ computable: false, reason });

// ---------------------------------------------------------------------------
// The scoring systems
// ---------------------------------------------------------------------------

export const SCORING_SYSTEMS = {
  UCT_FPS600: {
    label: 'UCT Faculty Points Score',
    unit: 'out of 600',
    max: 600,
    nearMargin: 30,
    computable: true,
    explanation:
      'UCT adds your English percentage to your 5 best other subject percentages, excluding Life Orientation, out of 600. For Commerce, Engineering & the Built Environment, Humanities and Law this APS is the Faculty Points Score.',
    sourceUrl: 'https://www.uct.ac.za/sites/default/files/media/documents/2027-uct-undergraduate-prospectus-1-april-2026.pdf',
    compute(marks) {
      const english = findBase(marks, 'English');
      if (!english) return cannot('UCT counts your English mark first, so we need it to work out your score.');
      const others = withoutLO(marks).filter((m) => m !== english).sort(byPercentDesc).slice(0, 5);
      if (others.length < 5) return cannot('UCT needs English plus 5 other subjects excluding Life Orientation.');
      const total = english.percent + others.reduce((s, m) => s + m.percent, 0);
      return ok(total, 600, `English ${english.percent}% + ${others.map((m) => `${m.name} ${m.percent}%`).join(' + ')}`);
    },
  },

  WITS_APS_incLO: {
    label: 'Wits APS',
    unit: 'points',
    max: 56,
    nearMargin: 3,
    computable: true,
    explanation:
      'Wits counts your best 7 subjects INCLUDING Life Orientation. English and Mathematics each get +2 at level 5 and above. Life Orientation is worth only 4, 3, 2 or 1 point at levels 8, 7, 6 and 5, and nothing below that.',
    sourceUrl: 'https://www.wits.ac.za/undergraduate/entry-requirements/',
    compute(marks) {
      const scoreOne = (m) => {
        const level = witsLevel(m.percent);
        if (isLifeOrientation(m)) return level >= 5 ? level - 4 : 0;
        const bonusSubject = m.base === 'English' || m.base === 'Mathematics';
        return bonusSubject && level >= 5 ? level + 2 : level;
      };
      const lo = marks.find(isLifeOrientation);
      const rest = withoutLO(marks).map((m) => ({ m, points: scoreOne(m) })).sort((a, b) => b.points - a.points);
      const take = lo ? 6 : 7;
      const chosen = rest.slice(0, take);
      if (chosen.length < take) {
        return cannot('Wits counts 7 subjects including Life Orientation - add the rest of your subjects.');
      }
      const loPoints = lo ? scoreOne(lo) : 0;
      const total = loPoints + chosen.reduce((s, c) => s + c.points, 0);
      const working = [
        ...(lo ? [`Life Orientation ${lo.percent}% = ${loPoints}`] : []),
        ...chosen.map((c) => `${c.m.name} ${c.m.percent}% = ${c.points}`),
      ].join(', ');
      return ok(total, 56, working);
    },
  },

  WITS_COMPOSITE_INDEX: {
    label: 'Wits Composite Index',
    unit: '',
    computable: false,
    explanation:
      'Wits Health Sciences does not use APS. It uses a Composite Index of 75% school average across 5 subjects and 25% NBT - and Wits does not publish the cut-off scores.',
    reason:
      'We cannot work this out for you: it needs your NBT results, and Wits does not publish the cut-off you would be measured against.',
  },

  UP_APS_exLO: {
    label: 'UP APS',
    unit: 'points',
    max: 42,
    nearMargin: 3,
    computable: true,
    explanation: 'UP adds the NSC achievement levels of your 6 best subjects, excluding Life Orientation.',
    sourceUrl: 'https://drupalwebprod-files.up.ac.za/Public/2026-03/UP_DESA_Application%20requirements%20tables_2027_web.pdf?VersionId=vw30gCBk2BMAXzOhFSBflmkFOHOMFOoa',
    compute: (marks) => sixSubjectLevelAps(marks, 'UP'),
  },

  UJ_APS_exLO: {
    label: 'UJ APS',
    unit: 'points',
    max: 42,
    nearMargin: 3,
    computable: true,
    explanation: 'UJ adds the NSC achievement levels of your 6 best subjects, excluding Life Orientation.',
    sourceUrl: 'https://www.uj.ac.za/university-courses/',
    compute: (marks) => sixSubjectLevelAps(marks, 'UJ'),
  },

  UKZN_APS_exLO: {
    label: 'UKZN APS',
    unit: 'points out of 48',
    computable: false,
    explanation:
      'UKZN adds levels 1-8 across 6 subjects excluding Life Orientation, up to a maximum of 48.',
    reason:
      'We have not found UKZN’s percentage-to-level table on an official UKZN page, and UKZN uses an 8-point scale rather than the usual 7. Rather than guess the bands and hand you a number to plan around, we show you UKZN’s published requirements and leave the score out until we can source the table.',
  },

  SU_aggregate_pct: {
    label: 'Stellenbosch aggregate',
    unit: '%',
    max: 100,
    nearMargin: 5,
    computable: true,
    explanation:
      'Stellenbosch does not use APS at all. It uses your NSC average as a percentage, excluding Life Orientation.',
    sourceUrl: 'https://files.su.ac.za/public/undergraduate-maties/documents/2026-01/su-admissions-booklet-2027.pdf',
    compute(marks) {
      const subjects = withoutLO(marks);
      if (subjects.length < 6) return cannot('Stellenbosch averages your subjects excluding Life Orientation - we need at least 6.');
      const avg = subjects.reduce((s, m) => s + m.percent, 0) / subjects.length;
      return ok(avg, 100, `Average of ${subjects.length} subjects excluding Life Orientation`);
    },
  },

  RU_pct_div10: {
    label: 'Rhodes points',
    unit: 'points',
    max: 60,
    nearMargin: 3,
    computable: true,
    explanation:
      'Rhodes adds the percentages of your 6 best subjects, excluding Life Orientation, and divides by 10.',
    sourceUrl: 'https://www.ru.ac.za/media/rhodesuniversity/content/registrar/documents/information/studentrecruitment/RU_READY_Undergraduate_Prospectus_2026_DIGITAL_A5_Landscape_24pp_18Mar2026.pdf',
    compute(marks) {
      const best = withoutLO(marks).sort(byPercentDesc).slice(0, 6);
      if (best.length < 6) return cannot('Rhodes counts 6 subjects excluding Life Orientation.');
      const total = best.reduce((s, m) => s + m.percent, 0) / 10;
      return ok(total, 60, `(${best.map((m) => `${m.percent}`).join(' + ')}) / 10`);
    },
  },

  UWC_weighted: {
    label: 'UWC weighted points',
    unit: 'points',
    computable: false,
    explanation:
      'UWC uses a weighted points system in which English and Mathematics are worth up to 15 points at level 8, and Life Orientation up to 3.',
    reason:
      'UWC’s full points conversion table would not load from the official page, so we do not calculate a UWC score. We show the point totals UWC publishes for each programme instead.',
  },

  NWU_APS: {
    label: 'NWU APS',
    unit: 'points',
    computable: false,
    explanation: 'NWU uses its own APS.',
    reason: 'We have not captured NWU’s APS formula from an official NWU page, so we do not calculate an NWU score.',
  },

  UFS_AP: {
    label: 'UFS AP score',
    unit: 'points',
    computable: false,
    explanation: 'UFS uses an AP score.',
    reason: 'We have not captured the UFS AP formula from an official UFS page, so we do not calculate a UFS score.',
  },
};

function sixSubjectLevelAps(marks, who) {
  const best = withoutLO(marks).map((m) => ({ m, level: nscLevel(m.percent) })).sort((a, b) => b.level - a.level).slice(0, 6);
  if (best.length < 6) return cannot(`${who} counts 6 subjects excluding Life Orientation - add the rest of your subjects.`);
  const total = best.reduce((s, b) => s + b.level, 0);
  return ok(total, 42, best.map((b) => `${b.m.name} ${b.m.percent}% = level ${b.level}`).join(', '));
}

/**
 * Stellenbosch publishes two extra selection formulas. They are not admission
 * minimums - they are what SU actually selects on - so we show them as context
 * next to the aggregate rather than as a pass/fail.
 */
export function stellenboschSelection(marks, faculty) {
  const subjects = withoutLO(marks);
  const maths = findBase(marks, 'Mathematics');
  if (!maths || subjects.length < 6) return null;
  const avg = subjects.reduce((s, m) => s + m.percent, 0) / subjects.length;

  if (faculty === 'Engineering') {
    const ps = findBase(marks, 'Physical Sciences');
    if (!ps) return null;
    return {
      label: 'SU Engineering selection score',
      value: Math.round(maths.percent + ps.percent + 6 * avg),
      unit: 'out of 800',
      note: 'Maths% + Physical Sciences% + (6 x your average). SU says 600 or more gave a good chance for some programmes and 620 or more for others - a historical guide, not a cut-off.',
    };
  }
  if (faculty === 'Science') {
    const others = subjects.filter((m) => m !== maths).sort(byPercentDesc).slice(0, 5);
    if (others.length < 5) return null;
    const value = (maths.percent * 2 + others.reduce((s, m) => s + m.percent, 0)) / 7;
    return {
      label: 'SU Science selection mark',
      value: Math.round(value * 10) / 10,
      unit: '%',
      note: '[(Maths x 2) + your 5 other subjects] / 7. SU states the real threshold is higher than the published minimum.',
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Subject requirements
// ---------------------------------------------------------------------------

/**
 * Check one requirement item against the student's marks.
 * Returns { label, status, detail, gap? } where status is one of:
 *   met | not_met | missing (they don't take that subject) | manual (we can't judge it)
 */
export function checkRequirement(req, marks, usedBases = new Set()) {
  if (req.not_computable || req.label) {
    return { label: req.label || 'Other requirement', status: 'manual', detail: req.note || '' };
  }

  if (req.any_of) {
    const results = req.any_of.map((r) => checkRequirement(r, marks, usedBases));
    const met = results.find((r) => r.status === 'met');
    const label = results.map((r) => r.label).join(' OR ');
    if (met) return { label, status: 'met', detail: met.detail };
    const best = results.find((r) => r.status === 'not_met') || results[0];
    return { label, status: best.status, detail: best.detail, gap: best.gap };
  }

  if (req.all_of) {
    const results = req.all_of.map((r) => checkRequirement(r, marks, usedBases));
    const label = results.map((r) => r.label).join(' AND ');
    const bad = results.find((r) => r.status !== 'met');
    if (!bad) return { label, status: 'met', detail: '' };
    return { label, status: bad.status, detail: bad.detail, gap: bad.gap };
  }

  // "Next 3 subjects at 70%" - UCT phrases some Health Sciences rules this way.
  if (req.subject === 'Next 3 subjects') {
    const pool = marks
      .filter((m) => !isLifeOrientation(m) && !usedBases.has(m.base))
      .sort(byPercentDesc)
      .slice(0, 3);
    const label = `Your next 3 best subjects at ${req.min_percent}%`;
    if (pool.length < 3) return { label, status: 'missing', detail: 'Add more of your subjects so we can check this.' };
    const worst = pool[pool.length - 1];
    return worst.percent >= req.min_percent
      ? { label, status: 'met', detail: pool.map((m) => `${m.name} ${m.percent}%`).join(', ') }
      : { label, status: 'not_met', gap: req.min_percent - worst.percent, detail: `Your 3rd best other subject is ${worst.name} at ${worst.percent}%.` };
  }

  const mark = findBase(marks, req.subject);

  // English, with a different bar for Home Language vs First Additional Language.
  if (req.subject === 'English' && (req.hl_min_percent || req.fal_min_percent || req.hl_min_level || req.fal_min_level)) {
    if (!mark) return { label: 'English', status: 'missing', detail: 'Add your English mark.' };
    const home = mark.lang === 'home';
    const needPct = home ? req.hl_min_percent : req.fal_min_percent;
    const needLvl = home ? req.hl_min_level : req.fal_min_level;
    const threshold = needPct != null ? needPct : LEVEL_FLOOR[needLvl];
    const shown = needPct != null ? `${needPct}%` : `level ${needLvl}`;
    const label = `${mark.name} at ${shown}`;
    return mark.percent >= threshold
      ? { label, status: 'met', detail: `You have ${mark.percent}%.` }
      : { label, status: 'not_met', gap: threshold - mark.percent, detail: `You have ${mark.percent}%.` };
  }

  const threshold = req.min_percent != null ? req.min_percent : LEVEL_FLOOR[req.min_level];
  const shown = req.min_percent != null ? `${req.min_percent}%` : `level ${req.min_level} (${LEVEL_FLOOR[req.min_level]}%)`;
  const label = `${req.subject} at ${shown}`;

  if (!mark) return { label, status: 'missing', detail: `You have not entered a mark for ${req.subject}.` };
  return mark.percent >= threshold
    ? { label, status: 'met', detail: `You have ${mark.percent}%.` }
    : { label, status: 'not_met', gap: threshold - mark.percent, detail: `You have ${mark.percent}%.` };
}

/** Which subject bases a programme names explicitly, so "next 3 subjects" excludes them. */
function namedBases(requirements) {
  const set = new Set();
  const walk = (r) => {
    if (!r) return;
    if (r.any_of) return r.any_of.forEach(walk);
    if (r.all_of) return r.all_of.forEach(walk);
    if (r.subject && r.subject !== 'Next 3 subjects') set.add(r.subject);
  };
  requirements.forEach(walk);
  return set;
}

export function checkAllRequirements(requirements, marks) {
  const used = namedBases(requirements);
  return (requirements || []).map((r) => checkRequirement(r, marks, used));
}

// ---------------------------------------------------------------------------
// Putting it together
// ---------------------------------------------------------------------------

/**
 * Work out, for one programme, whether this student qualifies - and if not, by how
 * much they are short. Never returns a verdict based on a score we could not compute.
 */
export function assessProgram(program, marks, score) {
  const requirements = checkAllRequirements(program.subject_requirements || [], marks);
  const subjectGaps = requirements.filter((r) => r.status === 'not_met');
  const unknownSubjects = requirements.filter((r) => r.status === 'missing');
  const manual = requirements.filter((r) => r.status === 'manual');

  const system = SCORING_SYSTEMS[program.scoring_system];
  let pointsStatus = 'unknown';
  let pointsGap = null;

  if (program.min_aps == null) {
    pointsStatus = 'no_cutoff';
  } else if (score && score.computable) {
    pointsGap = Math.round((program.min_aps - score.value) * 10) / 10;
    pointsStatus = pointsGap <= 0 ? 'met' : 'not_met';
  }

  let verdict;
  if (pointsStatus === 'met' && !subjectGaps.length && !unknownSubjects.length) verdict = 'qualifies';
  else if (pointsStatus === 'not_met' || subjectGaps.length) verdict = 'not_yet';
  else verdict = 'cannot_tell';

  // "Close" means: nothing is more than a nudge away. The margin is per scoring
  // system because 3 APS points and 30 UCT FPS points are very different distances.
  const margin = system && system.nearMargin != null ? system.nearMargin : 3;
  const close =
    verdict === 'not_yet' &&
    (pointsGap == null || pointsGap <= margin) &&
    subjectGaps.every((g) => g.gap != null && g.gap <= 5) &&
    (pointsGap != null || subjectGaps.length > 0);

  return { requirements, subjectGaps, unknownSubjects, manual, pointsStatus, pointsGap, verdict, close };
}

/** Compute every university's own score from one set of marks. Never a shared number. */
export function scoreEverySystem(marks, systems) {
  const out = {};
  for (const id of systems) {
    const system = SCORING_SYSTEMS[id];
    if (!system) continue;
    out[id] = {
      id,
      label: system.label,
      unit: system.unit,
      max: system.max ?? null,
      explanation: system.explanation,
      sourceUrl: system.sourceUrl ?? null,
      ...(system.computable ? system.compute(marks) : cannot(system.reason)),
    };
  }
  return out;
}
