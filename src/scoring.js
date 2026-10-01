// Per-university scoring.
//
// THE RULE THIS FILE EXISTS TO ENFORCE: South African university admission scores are
// not comparable with each other. A "Wits APS of 42" is not a "UP APS of 35" and neither
// is a "UCT FPS of 500". So there is no universal score anywhere in this product. Every
// programme row carries a `scoring_system`, and we compute that system's own number from
// the same set of marks, then report them separately.
//
// Every formula below was checked against the university's own published rule - see
// scoring-audit.js for what was read, where, and what could not be confirmed.
//
// The second rule: where a formula could not be confirmed from an official source, we do
// NOT calculate it. `computable: false` systems return a reason instead of a number.
// A guessed score is worse than no score, because a student would plan around it.
//
// The third: several universities say "the subjects this programme requires must be
// counted". So a student's score can differ between programmes at the SAME university.
// `scoreForProgram` does that; `scoreEverySystem` gives the general, programme-free figure.

import { isLifeOrientation } from './subjects.js';
import { SCORING_AUDIT, AUDITED_ON } from './scoring-audit.js';

/**
 * The lowest percentage that earns each NSC achievement level. Used when a programme's
 * requirement is written as "Mathematics level 6". Levels 1-7 are the standard NSC
 * scale; 8 is the extra top band a few universities (Wits, UKZN, NWU, UWC, UFS) add at 90%.
 */
export const LEVEL_FLOOR = { 1: 0, 2: 30, 3: 40, 4: 50, 5: 60, 6: 70, 7: 80, 8: 90 };

/** Standard NSC achievement level (1-7). Used by UP and UJ. */
export const nscLevel = (pct) =>
  pct >= 80 ? 7 : pct >= 70 ? 6 : pct >= 60 ? 5 : pct >= 50 ? 4 : pct >= 40 ? 3 : pct >= 30 ? 2 : 1;

/** The 8-band scale (90-100% = 8) used by Wits, UKZN, NWU and UWC. 0-29% is level 1. */
export const witsLevel = (pct) =>
  pct >= 90 ? 8 : pct >= 80 ? 7 : pct >= 70 ? 6 : pct >= 60 ? 5 : pct >= 50 ? 4 : pct >= 40 ? 3 : pct >= 30 ? 2 : 1;

const ok = (value, max, working) => ({ computable: true, value: Math.round(value * 10) / 10, max, working });
const cannot = (reason) => ({ computable: false, reason });

const withoutLO = (marks) => marks.filter((m) => !isLifeOrientation(m));
const findBase = (marks, base) => marks.find((m) => m.base === base);
const byPercentDesc = (a, b) => b.percent - a.percent;
const sum = (list, f) => list.reduce((s, x) => s + f(x), 0);
const say = (list, f) => list.map(f).join(', ');

// ---------------------------------------------------------------------------
// Requirement groups: "the subjects this programme insists on"
// ---------------------------------------------------------------------------

/**
 * Turn a programme's subject_requirements into groups of interchangeable subjects.
 * [{subject:'Mathematics'}, {any_of:[Maths, Maths Lit]}] -> [['Mathematics'], ['Mathematics','Mathematical Literacy']]
 * A group means "at least one of these must be among the subjects counted".
 */
export function requirementGroups(requirements = []) {
  const groups = [];
  const names = (r) => {
    if (!r || r.label || r.not_computable) return [];
    if (r.any_of) return r.any_of.flatMap(names);
    if (r.all_of) return r.all_of.flatMap(names);
    return r.subject && r.subject !== 'Next 3 subjects' ? [r.subject] : [];
  };
  for (const r of requirements || []) {
    if (!r || r.label || r.not_computable) continue;
    if (r.any_of) { const g = r.any_of.flatMap(names); if (g.length) groups.push(g); }
    else if (r.all_of) r.all_of.forEach((x) => { const g = names(x); if (g.length) groups.push(g); });
    else { const g = names(r); if (g.length) groups.push(g); }
  }
  return groups;
}

/**
 * Pick `count` subjects to score: first one from each required group the student has,
 * then the best of whatever is left. Returns null if there aren't enough subjects.
 */
function choose(pool, count, valueOf, mustGroups = []) {
  const left = [...pool];
  const chosen = [];
  for (const group of mustGroups) {
    if (chosen.length >= count) break;
    const candidates = left.filter((m) => group.includes(m.base) && !chosen.includes(m));
    if (!candidates.length) continue;
    candidates.sort((a, b) => valueOf(b) - valueOf(a));
    chosen.push(candidates[0]);
    left.splice(left.indexOf(candidates[0]), 1);
  }
  left.sort((a, b) => valueOf(b) - valueOf(a));
  while (chosen.length < count && left.length) chosen.push(left.shift());
  return chosen.length === count ? chosen : null;
}

const countedNote = (required) => (required.length ? ' (counting the subjects this degree requires)' : '');

// ---------------------------------------------------------------------------
// The scoring systems
// ---------------------------------------------------------------------------

const SYSTEMS = {
  UCT_FPS600: {
    label: 'UCT Faculty Points Score',
    unit: 'out of 600',
    max: 600,
    nearMargin: 30,
    explanation:
      'UCT adds your six best subject percentages, excluding Life Orientation, but always including English and any subject the degree requires. A result below 40% in a subject scores nothing. For Commerce, Engineering & the Built Environment, Humanities and Law this is your Faculty Points Score (FPS), out of 600.',
    compute(marks, { required = [] } = {}) {
      const value = (m) => (m.percent >= 40 ? m.percent : 0);
      if (!findBase(marks, 'English')) return cannot('UCT always counts your English mark, so we need it to work out your score.');
      const chosen = choose(withoutLO(marks), 6, value, [['English'], ...required]);
      if (!chosen) return cannot('UCT needs six subjects excluding Life Orientation - add the rest of yours.');
      return ok(sum(chosen, value), 600,
        say(chosen, (m) => `${m.name} ${m.percent}%${m.percent < 40 ? ' (under 40% scores 0)' : ''}`) + countedNote(required));
    },
  },

  UCT_FPS800: {
    label: 'UCT Science Faculty Points Score',
    unit: 'out of 800',
    max: 800,
    nearMargin: 40,
    explanation:
      'For UCT Science, your English counts once, your Mathematics and Physical Sciences each count twice, and your best three other subjects count once (excluding Life Orientation). A result below 40% in a subject scores nothing.',
    compute(marks) {
      const value = (m) => (m.percent >= 40 ? m.percent : 0);
      const english = findBase(marks, 'English');
      const maths = findBase(marks, 'Mathematics');
      const ps = findBase(marks, 'Physical Sciences');
      if (!english) return cannot('UCT always counts your English mark, so we need it to work out your score.');
      if (!maths || !ps) return cannot('UCT Science counts Mathematics and Physical Sciences twice, so we need both marks to work out your score.');
      const rest = withoutLO(marks).filter((m) => m !== english && m !== maths && m !== ps).sort(byPercentDesc).slice(0, 3);
      if (rest.length < 3) return cannot('UCT Science also counts your best three other subjects - add the rest of yours.');
      return ok(value(english) + 2 * value(maths) + 2 * value(ps) + sum(rest, value), 800,
        `English ${value(english)} + Mathematics ${value(maths)} x 2 + Physical Sciences ${value(ps)} x 2 + ${say(rest, (m) => `${m.name} ${value(m)}`)}`);
    },
  },

  WITS_APS_incLO: {
    label: 'Wits APS',
    unit: 'points',
    max: 56,
    nearMargin: 3,
    explanation:
      'Wits counts your best seven subjects including Life Orientation, and the subjects your degree requires must be among them. Each subject scores 8 (90-100%) down to 3 (40-49%), and nothing below 40%. English and Mathematics get +2 from 60% up. Life Orientation scores only 4, 3, 2 or 1 for 90, 80, 70 or 60% and up.',
    compute(marks, { required = [] } = {}) {
      const lo = marks.find(isLifeOrientation);
      if (!lo) return cannot('Wits counts Life Orientation as one of your seven subjects - add it to see your Wits score.');
      const base = (p) => (p >= 90 ? 8 : p >= 80 ? 7 : p >= 70 ? 6 : p >= 60 ? 5 : p >= 50 ? 4 : p >= 40 ? 3 : 0);
      const points = (m) => {
        const b = base(m.percent);
        return (m.base === 'English' || m.base === 'Mathematics') && b >= 5 ? b + 2 : b;
      };
      const loPoints = lo.percent >= 90 ? 4 : lo.percent >= 80 ? 3 : lo.percent >= 70 ? 2 : lo.percent >= 60 ? 1 : 0;
      const chosen = choose(withoutLO(marks), 6, points, required);
      if (!chosen) return cannot('Wits counts seven subjects including Life Orientation - add the rest of yours.');
      return ok(loPoints + sum(chosen, points), 56,
        `Life Orientation ${lo.percent}% = ${loPoints}, ` + say(chosen, (m) => `${m.name} ${m.percent}% = ${points(m)}`) + countedNote(required));
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
    explanation: 'UP adds the NSC achievement levels (1 to 7) of your six best subjects, excluding Life Orientation.',
    compute(marks) {
      const chosen = choose(withoutLO(marks), 6, (m) => nscLevel(m.percent));
      if (!chosen) return cannot('UP counts 6 subjects excluding Life Orientation - add the rest of yours.');
      return ok(sum(chosen, (m) => nscLevel(m.percent)), 42, say(chosen, (m) => `${m.name} ${m.percent}% = level ${nscLevel(m.percent)}`));
    },
  },

  UJ_APS_exLO: {
    label: 'UJ APS',
    unit: 'points',
    max: 42,
    nearMargin: 3,
    explanation:
      'UJ adds the NSC achievement levels (1 to 7) of six subjects, excluding Life Orientation. The degree’s compulsory subjects are counted first, then your best of the rest.',
    compute(marks, { required = [] } = {}) {
      const chosen = choose(withoutLO(marks), 6, (m) => nscLevel(m.percent), required);
      if (!chosen) return cannot('UJ counts 6 subjects excluding Life Orientation - add the rest of yours.');
      return ok(sum(chosen, (m) => nscLevel(m.percent)), 42,
        say(chosen, (m) => `${m.name} ${m.percent}% = level ${nscLevel(m.percent)}`) + countedNote(required));
    },
  },

  UKZN_APS_exLO: {
    label: 'UKZN APS',
    unit: 'points out of 48',
    max: 48,
    nearMargin: 3,
    explanation:
      'UKZN adds six subjects on an 8-point scale (90-100% = 8, 80-89% = 7 ... 0-29% = 1), excluding Life Orientation. English, Mathematics (or Mathematical Literacy) and your best other subjects make up the six.',
    compute(marks, { required = [] } = {}) {
      const chosen = choose(withoutLO(marks), 6, (m) => witsLevel(m.percent),
        [['English'], ['Mathematics', 'Mathematical Literacy'], ...required]);
      if (!chosen) return cannot('UKZN counts 6 subjects excluding Life Orientation - add the rest of yours.');
      return ok(sum(chosen, (m) => witsLevel(m.percent)), 48,
        say(chosen, (m) => `${m.name} ${m.percent}% = ${witsLevel(m.percent)}`) + countedNote(required));
    },
  },

  SU_aggregate_pct: {
    label: 'Stellenbosch aggregate',
    unit: '%',
    max: 100,
    nearMargin: 5,
    explanation:
      'Stellenbosch does not use APS at all. It uses your NSC average as a percentage, excluding Life Orientation. We average your six best subjects, which is how Stellenbosch works its own selection marks.',
    compute(marks) {
      const chosen = choose(withoutLO(marks), 6, (m) => m.percent);
      if (!chosen) return cannot('Stellenbosch averages your subjects excluding Life Orientation - we need at least 6.');
      return ok(sum(chosen, (m) => m.percent) / 6, 100, `Average of your six best subjects excluding Life Orientation: ${say(chosen, (m) => `${m.percent}`)}`);
    },
  },

  RU_pct_div10: {
    label: 'Rhodes points',
    unit: 'points',
    max: 60,
    nearMargin: 3,
    explanation:
      'Rhodes takes the percentage of each of your six subjects, divides each by 10, and adds them up. Life Orientation is not scored, but you must get at least 50% in it.',
    compute(marks) {
      const chosen = choose(withoutLO(marks), 6, (m) => m.percent);
      if (!chosen) return cannot('Rhodes counts 6 subjects excluding Life Orientation.');
      return ok(sum(chosen, (m) => m.percent) / 10, 60, `(${say(chosen, (m) => `${m.percent}`)}) / 10`);
    },
  },

  UWC_weighted: {
    label: 'UWC weighted points',
    unit: 'points out of 65',
    max: 65,
    nearMargin: 5,
    explanation:
      'UWC weights English and Mathematics most: they score 1, 3, 5 ... 15 from level 1 to 8. Your additional language, Mathematical Literacy and each of your three best other subjects score the level itself (1-8). Life Orientation adds 0-3.',
    compute(marks) {
      const lvl = (p) => (p >= 90 ? 8 : p >= 80 ? 7 : p >= 70 ? 6 : p >= 60 ? 5 : p >= 50 ? 4 : p >= 40 ? 3 : p >= 30 ? 2 : p >= 20 ? 1 : 0);
      const weighted = (p) => (lvl(p) ? 2 * lvl(p) - 1 : 0);
      const loPoints = (p) => [0, 0, 1, 1, 2, 2, 2, 3, 3][lvl(p)];

      const lo = marks.find(isLifeOrientation);
      if (!lo) return cannot('UWC counts Life Orientation - add it to see your UWC score.');
      const english = findBase(marks, 'English');
      if (!english) return cannot('UWC counts English first - add your English mark.');
      const maths = findBase(marks, 'Mathematics') || findBase(marks, 'Mathematical Literacy');
      if (!maths) return cannot('UWC counts Mathematics or Mathematical Literacy - add yours.');
      const additional = marks.filter((m) => m.group === 'Languages' && m !== english).sort(byPercentDesc)[0];
      if (!additional) return cannot('UWC also counts an additional language besides English - add yours.');

      const others = marks
        .filter((m) => !isLifeOrientation(m) && m.group !== 'Languages' && m !== maths)
        .sort(byPercentDesc).slice(0, 3);
      if (others.length < 3) return cannot('UWC counts your three best other subjects - add more of yours.');

      const mathsPts = maths.base === 'Mathematics' ? weighted(maths.percent) : lvl(maths.percent);
      const parts = [
        [english.name, weighted(english.percent)],
        [additional.name, lvl(additional.percent)],
        [maths.name, mathsPts],
        ['Life Orientation', loPoints(lo.percent)],
        ...others.map((m) => [m.name, lvl(m.percent)]),
      ];
      return ok(sum(parts, (p) => p[1]), 65, parts.map(([n, p]) => `${n} = ${p}`).join(', '));
    },
  },

  NWU_APS: {
    label: 'NWU APS',
    unit: 'points out of 48',
    max: 48,
    nearMargin: 3,
    explanation:
      'NWU adds your six best subjects, excluding Life Orientation, on an 8-point scale (90-100% = 8, 80-89% = 7 ... 0-29% = 1).',
    compute(marks) {
      const chosen = choose(withoutLO(marks), 6, (m) => witsLevel(m.percent));
      if (!chosen) return cannot('NWU counts 6 subjects excluding Life Orientation - add the rest of yours.');
      return ok(sum(chosen, (m) => witsLevel(m.percent)), 48, say(chosen, (m) => `${m.name} ${m.percent}% = ${witsLevel(m.percent)}`));
    },
  },

  UNIVEN_APS: {
    label: 'Univen APS',
    unit: '',
    computable: false,
    explanation:
      'Univen publishes a minimum APS of 26 for a bachelor’s degree, worked from your best six or seven subjects excluding Life Orientation (subjects under 40% are not counted). Univen’s own published scoring table did not clearly match a standard NSC achievement-level scale when we checked, so we have not implemented the exact arithmetic - each programme shows its published minimum APS as reference only.',
    reason: 'We could not confirm Univen’s exact APS arithmetic well enough to compute your score yet - see the published minimum on each programme instead.',
  },

  WSU_APS: {
    label: 'WSU APS',
    unit: 'points out of 48',
    computable: false,
    explanation:
      'WSU adds your best six subjects (seven for Education programmes, which also count Life Orientation) on an 8-point scale (90-100% = 8 down to 0-29% = 1): two slots are reserved for languages and the rest for the subjects your programme requires. We have confirmed the full rule from WSU’s own 2027 admissions brochure but have not yet built and tested that two-category logic, so each programme shows its published minimum APS as reference only.',
    reason: 'WSU’s formula is confirmed but not yet implemented in our calculator - see the published minimum on each programme instead.',
  },

  UFH_APS: {
    label: 'UFH APS',
    unit: '',
    computable: false,
    explanation:
      'UFH states a general minimum APS of 26 or higher "depending on the programme", and UFH’s own online APS calculator sums standard NSC achievement levels (1-7) across seven subject slots including Life Orientation. No UFH programme page we checked states its own numeric APS minimum, so there is nothing published yet to compute or compare your score against.',
    reason: 'UFH does not publish a numeric APS minimum on its programme pages, so there is no cut-off for us to check your score against yet.',
  },

  UNIZULU_APS: {
    label: 'UniZulu APS',
    unit: 'points out of 48',
    max: 48,
    nearMargin: 3,
    explanation:
      'UniZulu adds your best six subjects, excluding Life Orientation, on an 8-point scale (90-100% = 8 down to 0-29% = 1) - the same method as NWU and UKZN. We have not yet captured a UniZulu programme with a published APS minimum to check it against, but the formula itself is ready.',
    compute(marks) {
      const chosen = choose(withoutLO(marks), 6, (m) => witsLevel(m.percent));
      if (!chosen) return cannot('UniZulu counts 6 subjects excluding Life Orientation - add the rest of yours.');
      return ok(sum(chosen, (m) => witsLevel(m.percent)), 48, say(chosen, (m) => `${m.name} ${m.percent}% = ${witsLevel(m.percent)}`));
    },
  },

  TUT_APS: {
    label: 'TUT APS',
    unit: 'points',
    max: 42,
    nearMargin: 3,
    explanation:
      'TUT adds the NSC achievement levels (1 to 7) of your best six subjects, excluding Life Orientation and excluding any subject scored at achievement level 1 (0-29%).',
    compute(marks) {
      const pool = withoutLO(marks).filter((m) => nscLevel(m.percent) > 1);
      const chosen = choose(pool, 6, (m) => nscLevel(m.percent));
      if (!chosen) return cannot('TUT counts 6 subjects, excluding Life Orientation and any subject scored at level 1 - add the rest of yours.');
      return ok(sum(chosen, (m) => nscLevel(m.percent)), 42, say(chosen, (m) => `${m.name} ${m.percent}% = level ${nscLevel(m.percent)}`));
    },
  },

  VUT_APS: {
    label: 'VUT APS',
    unit: 'points',
    max: 42,
    nearMargin: 3,
    explanation: 'VUT adds the NSC achievement levels (1 to 7) of your best six subjects, excluding Life Orientation. Several programmes also apply their own additional selection rules on top (e.g. a combined Mathematics + Physical Science threshold) which we show in the programme’s own notes rather than compute.',
    compute(marks) {
      const chosen = choose(withoutLO(marks), 6, (m) => nscLevel(m.percent));
      if (!chosen) return cannot('VUT counts 6 subjects excluding Life Orientation - add the rest of yours.');
      return ok(sum(chosen, (m) => nscLevel(m.percent)), 42, say(chosen, (m) => `${m.name} ${m.percent}% = level ${nscLevel(m.percent)}`));
    },
  },

  DUT_APS: {
    label: 'DUT APS',
    unit: 'points',
    max: 42,
    nearMargin: 3,
    explanation: 'DUT adds the NSC achievement levels (1 to 7) of your best six subjects, excluding Life Orientation. DUT applications go through the CAO, not DUT directly, and several programmes also apply their own additional selection rules on top (e.g. a combined Mathematics + Physical Science threshold) which we show in the programme’s own notes rather than compute.',
    compute(marks) {
      const chosen = choose(withoutLO(marks), 6, (m) => nscLevel(m.percent));
      if (!chosen) return cannot('DUT counts 6 subjects excluding Life Orientation - add the rest of yours.');
      return ok(sum(chosen, (m) => nscLevel(m.percent)), 42, say(chosen, (m) => `${m.name} ${m.percent}% = level ${nscLevel(m.percent)}`));
    },
  },

  CPUT_APS: {
    label: 'CPUT APS',
    unit: '',
    computable: false,
    explanation:
      'CPUT uses one of three methods depending on the programme, each dividing a sum of percentages by 10 (so e.g. "30" means an average around 50-60% across the counted subjects, not an NSC level sum): Method 1 sums your best six subjects, including any the programme requires, excluding Life Orientation. Method 2 (used for CPUT’s Engineering diplomas) also doubles Mathematics and Physical Sciences. Method 3 (used for some Commerce programmes) doubles Mathematics and Accounting instead. We know which method each programme we’ve captured uses, but have not yet implemented the arithmetic, so each programme shows its published minimum APS as reference only.',
    reason: 'CPUT’s three calculation methods are now confirmed but not yet implemented in our calculator - see the published minimum and method noted on each programme instead.',
  },

  CUT_APS: {
    label: 'CUT APS',
    unit: '',
    computable: false,
    explanation:
      'CUT adds the achievement points (8-point scale, 90-100% = 8) of your six academic subjects, plus Life Orientation capped at 1 point no matter how high your LO mark is. A score of 21 or less is not admitted; 22-26 needs a selection test; 27 or more is CUT’s general floor (some programmes, like Engineering, require more). We have confirmed this rule from CUT’s own page but have not yet implemented it, so each programme shows its published minimum APS as reference only.',
    reason: 'CUT’s formula is confirmed but not yet implemented in our calculator - see the published minimum on each programme instead.',
  },

  MUT_APS: {
    label: 'MUT APS',
    unit: '',
    computable: false,
    explanation:
      'MUT’s own pages disagree on the basic rule: its general admissions page says APS is "the best five subjects"; its IT programme page says "a minimum of 24 points in the best six subjects excluding Life Orientation". We show both rather than pick one - see each programme’s note. MUT_APS is non-computable until this is resolved with MUT directly.',
    reason: 'MUT’s own pages disagree on whether APS uses five or six subjects, so we cannot safely compute a score.',
  },

  NMU_AS: {
    label: 'NMU Applicant Score (AS)',
    unit: 'out of 600 (+7 bonus in some cases)',
    computable: false,
    explanation:
      'NMU does not use a 1-7 level-based APS at all - its Applicant Score (AS) sums your best six subjects’ raw percentages (not achievement levels), excluding Life Orientation, out of 600. Applicants from quintile 1-3 schools who score 50%+ in Life Orientation get a 7-point bonus. We have confirmed this formula from NMU’s own page but have not yet captured any NMU programme to check it against.',
    reason: 'We have not yet captured an NMU programme with a published AS minimum to check your score against.',
  },

  UL_APS: {
    label: 'UL APS',
    unit: 'points',
    max: 42,
    nearMargin: 3,
    explanation:
      'UL adds the NSC achievement levels (1-7) of your best six subjects, excluding Life Orientation (though at least level 3 in Life Orientation and level 3 in your language of learning and teaching are separately required, which we show as a note rather than compute). UL states that meeting the minimum APS does not guarantee admission.',
    compute(marks) {
      const chosen = choose(withoutLO(marks), 6, (m) => nscLevel(m.percent));
      if (!chosen) return cannot('UL counts 6 subjects excluding Life Orientation - add the rest of yours.');
      return ok(sum(chosen, (m) => nscLevel(m.percent)), 42, say(chosen, (m) => `${m.name} ${m.percent}% = level ${nscLevel(m.percent)}`));
    },
  },

  SPU_APS: {
    label: 'SPU APS',
    unit: '',
    computable: false,
    explanation:
      'SPU publishes a minimum APS of 30 for a Bachelor’s degree and 25 for a Diploma, with English at NSC level 4 (Home Language) or level 5 (First Additional Language). We could not extract SPU’s prospectus PDF to confirm the exact points-per-subject formula, so each programme shows its published minimum APS as reference only.',
    reason: 'We could not confirm SPU’s exact APS arithmetic from an official source yet - see the published minimum on each programme instead.',
  },

  UMP_APS: {
    label: 'UMP APS',
    unit: '',
    computable: false,
    explanation:
      'UMP appears to add seven subjects on a 7-point scale, with Life Orientation’s points halved rather than excluded - distinctive if accurate, but we have not independently confirmed this on an official UMP page, so we are not treating it as settled. Each programme shows its published minimum APS as reference only.',
    reason: 'We could not fully confirm UMP’s APS formula from an official source yet - see the published minimum on each programme instead.',
  },

  UNISA_APS: {
    label: 'Unisa APS',
    unit: 'points',
    max: 42,
    nearMargin: 3,
    explanation:
      'Unisa adds the NSC achievement levels (1 to 7) of your six best 20-credit subjects, excluding Life Orientation - the same method as UP. Unisa is distance-only: meeting a qualification’s APS and subject minimums does not guarantee a space for qualifications with limited places.',
    compute(marks) {
      const chosen = choose(withoutLO(marks), 6, (m) => nscLevel(m.percent));
      if (!chosen) return cannot('Unisa counts 6 subjects excluding Life Orientation - add the rest of yours.');
      return ok(sum(chosen, (m) => nscLevel(m.percent)), 42, say(chosen, (m) => `${m.name} ${m.percent}% = level ${nscLevel(m.percent)}`));
    },
  },

  SMU_APS: {
    label: 'SMU APS',
    unit: '',
    computable: false,
    explanation:
      'SMU converts marks to points on its own scale (A = 12 points down to F = 3 points) via a published conversion table, which is different from the standard 1-7 NSC achievement level scale used elsewhere on this site. We have the resulting APS minimums per programme but not the full conversion table itself, so each programme shows its published minimum APS as reference only, and subject minimums are described in SMU’s own points rather than converted to our usual level/percentage fields.',
    reason: 'SMU uses its own points scale, which we have not fully confirmed from an official source yet - see the published minimum on each programme instead.',
  },

  UFS_AP: {
    label: 'UFS AP score',
    unit: 'points out of 49',
    max: 49,
    nearMargin: 3,
    explanation:
      'UFS scores six academic subjects from 8 (90-100%) down to 2 (30-39%), and nothing below 30%. Life Orientation adds one point at 60% or more. For Medicine it is the four compulsory subjects plus your best two.',
    compute(marks, { required = [] } = {}) {
      const pts = (p) => (p >= 90 ? 8 : p >= 80 ? 7 : p >= 70 ? 6 : p >= 60 ? 5 : p >= 50 ? 4 : p >= 40 ? 3 : p >= 30 ? 2 : 0);
      const chosen = choose(withoutLO(marks), 6, (m) => pts(m.percent), required);
      if (!chosen) return cannot('UFS counts six academic subjects - add the rest of yours.');
      const lo = marks.find(isLifeOrientation);
      const loPoint = lo && lo.percent >= 60 ? 1 : 0;
      return ok(sum(chosen, (m) => pts(m.percent)) + loPoint, 49,
        say(chosen, (m) => `${m.name} ${m.percent}% = ${pts(m.percent)}`) + `, Life Orientation = ${loPoint}` + countedNote(required));
    },
  },
};

/** The public registry: each system plus its audit record. */
export const SCORING_SYSTEMS = Object.fromEntries(
  Object.entries(SYSTEMS).map(([id, s]) => {
    const audit = SCORING_AUDIT[id] || { status: 'unverified', sources: [], confirmed: [], gaps: [] };
    return [id, {
      ...s,
      computable: s.compute ? true : false,
      audit,
      auditedOn: AUDITED_ON,
      sourceUrl: audit.sources[0] ? audit.sources[0].url : null,
    }];
  })
);

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
      sourceUrl: system.sourceUrl,
      auditStatus: system.audit.status,
      ...(system.computable ? system.compute(marks) : cannot(system.reason)),
    };
  }
  return out;
}

/**
 * The same, but for one specific programme: several universities say the subjects a
 * degree requires must be among those counted, so your score can differ per degree.
 */
export function scoreForProgram(systemId, marks, program) {
  const system = SCORING_SYSTEMS[systemId];
  if (!system) return cannot('Unknown scoring system.');
  if (!system.computable) return cannot(system.reason);
  return system.compute(marks, { required: requirementGroups(program.subject_requirements || program.subjectRequirements) });
}

/**
 * Stellenbosch publishes two extra selection formulas. They are not admission minimums -
 * they are what SU actually selects on - so we show them as context next to the
 * aggregate rather than as a pass/fail.
 */
export function stellenboschSelection(marks, faculty) {
  const subjects = withoutLO(marks);
  const maths = findBase(marks, 'Mathematics');
  if (!maths || subjects.length < 6) return null;

  if (faculty === 'Engineering') {
    const ps = findBase(marks, 'Physical Sciences');
    if (!ps) return null;
    const best6 = [...subjects].sort(byPercentDesc).slice(0, 6);
    const avg = sum(best6, (m) => m.percent) / 6;
    return {
      label: 'SU Engineering selection score',
      value: Math.round(maths.percent + ps.percent + 6 * avg),
      unit: 'out of 800',
      note: 'Maths% + Physical Sciences% + (6 x the average of your six best subjects). SU says 600 or more gave a good chance for some programmes and 620 or more for others - a historical guide, not a cut-off.',
    };
  }
  if (faculty === 'Science') {
    const rest = subjects.filter((m) => m !== maths).sort(byPercentDesc);
    // SU: at least one of the five others must be English or Afrikaans.
    const chosen = choose(rest, 5, (m) => m.percent, [['English', 'Afrikaans']]);
    if (!chosen) return null;
    const hasLang = chosen.some((m) => m.base === 'English' || m.base === 'Afrikaans');
    if (!hasLang) return null;
    return {
      label: 'SU Science selection mark',
      value: Math.round(((maths.percent * 2 + sum(chosen, (m) => m.percent)) / 7) * 10) / 10,
      unit: '%',
      note: '[(Maths x 2) + 5 other subjects, at least one of them English or Afrikaans] / 7. SU states the real threshold is higher than the published minimum.',
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Subject requirements
// ---------------------------------------------------------------------------

/**
 * Check one requirement item against the student's marks.
 * Returns { label, status, detail, gap?, usedBases? } where status is one of:
 *   met | not_met | missing (they don't take that subject) | manual (we can't judge it)
 *
 * `usedBases` (only set when status is 'met') names the subject(s) that actually
 * satisfied this requirement - see checkAllRequirements for why that matters.
 */
export function checkRequirement(req, marks) {
  if (req.not_computable || req.label) {
    return { label: req.label || 'Other requirement', status: 'manual', detail: req.note || '' };
  }

  if (req.any_of) {
    const results = req.any_of.map((r) => checkRequirement(r, marks));
    const met = results.find((r) => r.status === 'met');
    const label = results.map((r) => r.label).join(' OR ');
    if (met) return { label, status: 'met', detail: met.detail, usedBases: met.usedBases };
    const best = results.find((r) => r.status === 'not_met') || results[0];
    return { label, status: best.status, detail: best.detail, gap: best.gap };
  }

  if (req.all_of) {
    const results = req.all_of.map((r) => checkRequirement(r, marks));
    const label = results.map((r) => r.label).join(' AND ');
    const bad = results.find((r) => r.status !== 'met');
    if (!bad) return { label, status: 'met', detail: '', usedBases: results.flatMap((r) => r.usedBases || []) };
    return { label, status: bad.status, detail: bad.detail, gap: bad.gap };
  }

  // "Next 3 subjects" needs to know which bases the OTHER requirements actually used,
  // which checkAllRequirements works out in a first pass - see nextThreeSubjects().
  if (req.subject === 'Next 3 subjects') return nextThreeSubjects(req, marks, new Set());

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
      ? { label, status: 'met', detail: `You have ${mark.percent}%.`, usedBases: ['English'] }
      : { label, status: 'not_met', gap: threshold - mark.percent, detail: `You have ${mark.percent}%.` };
  }

  const threshold = req.min_percent != null ? req.min_percent : LEVEL_FLOOR[req.min_level];
  const shown = req.min_percent != null ? `${req.min_percent}%` : `level ${req.min_level} (${LEVEL_FLOOR[req.min_level]}%)`;
  const label = `${req.subject} at ${shown}`;

  if (!mark) return { label, status: 'missing', detail: `You have not entered a mark for ${req.subject}.` };
  return mark.percent >= threshold
    ? { label, status: 'met', detail: `You have ${mark.percent}%.`, usedBases: [req.subject] }
    : { label, status: 'not_met', gap: threshold - mark.percent, detail: `You have ${mark.percent}%.` };
}

/** "Next 3 subjects at N%" - UCT phrases some Health Sciences rules this way. */
function nextThreeSubjects(req, marks, usedBases) {
  const pool = marks
    .filter((m) => !isLifeOrientation(m) && !usedBases.has(m.base))
    .sort(byPercentDesc)
    .slice(0, 3);
  const label = `Your next 3 best subjects at ${req.min_percent}%`;
  if (pool.length < 3) return { label, status: 'missing', detail: 'Add more of your subjects so we can check this.' };
  const worst = pool[pool.length - 1];
  return worst.percent >= req.min_percent
    ? { label, status: 'met', detail: pool.map((m) => `${m.name} ${m.percent}%`).join(', '), usedBases: pool.map((m) => m.base) }
    : { label, status: 'not_met', gap: req.min_percent - worst.percent, detail: `Your 3rd best other subject is ${worst.name} at ${worst.percent}%.` };
}

/**
 * Check every requirement on a programme. Two passes: first everything except "Next 3
 * subjects", so we know exactly which subject each requirement actually consumed - for
 * an "any_of" like Physical Sciences OR Life Sciences, that's only the ONE that matched,
 * even if the student takes both, so the other stays available to count towards the
 * "next 3 best other subjects" that some UCT Health Sciences degrees also require.
 * (An earlier version excluded every alternative named in an any_of, which wrongly
 * shrank that pool for students who happened to take both Physical and Life Sciences.)
 */
export function checkAllRequirements(requirements, marks) {
  const reqs = requirements || [];
  const isNext3 = (r) => r && r.subject === 'Next 3 subjects';

  const prelim = reqs.map((r) => (isNext3(r) ? null : checkRequirement(r, marks)));
  const usedBases = new Set();
  prelim.forEach((r) => { if (r && r.usedBases) r.usedBases.forEach((b) => usedBases.add(b)); });

  return reqs.map((r, i) => (isNext3(r) ? nextThreeSubjects(r, marks, usedBases) : prelim[i]));
}

// ---------------------------------------------------------------------------
// Putting it together
// ---------------------------------------------------------------------------

/**
 * Work out, for one programme, whether this student qualifies - and if not, by how
 * much they are short. Never returns a verdict based on a score we could not compute.
 *
 * `score` should be the programme-specific score (see scoreForProgram).
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
  // 'qualifies' is reserved for programmes where marks are genuinely the whole story.
  // If there is also an NBT, portfolio, interview, audition or anything else we cannot
  // judge from marks, the honest verdict is 'marks_ok': the marks are enough, but that is
  // not the same as "you meet the requirements".
  if (pointsStatus === 'met' && !subjectGaps.length && !unknownSubjects.length) verdict = manual.length ? 'marks_ok' : 'qualifies';
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
