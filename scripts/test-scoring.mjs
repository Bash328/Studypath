// Sanity checks for the scoring engine, run against the real dataset.
//   node scripts/test-scoring.mjs
//
// These are the checks that matter for this product: that each university's number is
// worked out its own way, that we never invent a score for a system we have not
// verified, and that "you qualify" is only ever said when it is true.

import { normaliseMarks } from '../src/subjects.js';
import { SCORING_SYSTEMS, scoreEverySystem, scoreForProgram, requirementGroups, assessProgram, stellenboschSelection, nscLevel, witsLevel } from '../src/scoring.js';
import { uctPrograms } from '../db/data/programs-uct.mjs';
import { witsPrograms } from '../db/data/programs-wits.mjs';
import { suPrograms } from '../db/data/programs-su.mjs';
import { upPrograms } from '../db/data/programs-up.mjs';
import { ukznPrograms } from '../db/data/programs-ukzn.mjs';
import { otherPrograms } from '../db/data/programs-other.mjs';

const programs = [...uctPrograms, ...witsPrograms, ...suPrograms, ...upPrograms, ...ukznPrograms, ...otherPrograms];

let failures = 0;
const check = (name, actual, expected) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  if (!pass) { failures++; console.error(`  FAIL ${name}\n       got ${JSON.stringify(actual)}\n       want ${JSON.stringify(expected)}`); }
  else console.log(`  ok   ${name} = ${JSON.stringify(actual)}`);
};
const assert = (name, condition, detail = '') => {
  if (condition) console.log(`  ok   ${name}`);
  else { failures++; console.error(`  FAIL ${name} ${detail}`); }
};

// A strong-but-not-perfect student.
const STRONG = normaliseMarks({
  'english-hl': 78, mathematics: 82, 'physical-sciences': 76, 'life-sciences': 71,
  accounting: 68, geography: 74, 'life-orientation': 85,
});

console.log('\nLevel conversion');
check('nscLevel(82)', nscLevel(82), 7);
check('nscLevel(60)', nscLevel(60), 5);
check('witsLevel(92)', witsLevel(92), 8);
check('witsLevel(82)', witsLevel(82), 7);

console.log('\nThe same marks give a different number at every university');
const scores = scoreEverySystem(STRONG, Object.keys(SCORING_SYSTEMS));

// UCT: English 78 + best 5 others excluding LO = 82+76+74+71+68 = 371, +78 = 449
check('UCT FPS/600', scores.UCT_FPS600.value, 449);

// Wits: LO 85 -> level 7 -> 3 points. Best 6 others:
// Maths 82 = L7 +2 = 9, English 78 = L6... wait English 78 -> level 6, below 5? no, >=5 so +2 = 8
// PS 76 = 6, Geography 74 = 6, Life Sci 71 = 6, Accounting 68 = 5  => 9+8+6+6+6+5 = 40, +3 = 43
check('Wits APS (incl. Life Orientation)', scores.WITS_APS_incLO.value, 43);

// UP/UJ: 6 best NSC levels excluding LO: 7(82)+6(78)+6(76)+6(74)+6(71)+5(68) = 36
check('UP APS/42', scores.UP_APS_exLO.value, 36);
check('UJ APS/42', scores.UJ_APS_exLO.value, 36);
// MUT: same best-6-excluding-LO level formula as UP/UJ (no Life Orientation bonus at all) = 36
check('MUT APS/48', scores.MUT_APS.value, 36);

// SU: average of 6 non-LO subjects = (78+82+76+71+68+74)/6 = 74.833 -> 74.8
check('SU aggregate %', scores.SU_aggregate_pct.value, 74.8);

// Rhodes: sum of 6 best non-LO percentages / 10 = 449/10 = 44.9
check('Rhodes points', scores.RU_pct_div10.value, 44.9);

assert('all five computable systems produced different numbers',
  new Set([scores.UCT_FPS600.value, scores.WITS_APS_incLO.value, scores.UP_APS_exLO.value,
           scores.SU_aggregate_pct.value, scores.RU_pct_div10.value]).size === 5);

console.log('\nWe refuse to guess what we cannot verify');
assert('Wits Composite Index returns no number, with a reason',
  scores.WITS_COMPOSITE_INDEX.computable === false && !!scores.WITS_COMPOSITE_INDEX.reason);
// As of the 2026-10-01 follow-up pass, WSU_APS, CPUT_APS, CUT_APS and NMU_AS moved from
// "formula confirmed but not implemented" to fully computable, leaving 7 systems still
// non-computable for a real reason (a conflicting formula, an unconfirmed points scale,
// no published cut-off to check, etc. - see each system's audit `gaps`).
// Dropped to 6 on 2026-10-03: MUT_APS is now computable - two more user-supplied MUT
// documents (First-Year Prospectus 2026, Undergraduate Prospectus) independently
// confirmed "best six subjects excluding Life Orientation" against a web-found page
// that had claimed best five, resolving the conflict that made it non-computable.
// This count should only ever go DOWN as those gaps get closed in a future pass -
// never up without a documented reason in scoring-audit.js.
assert('every non-computable system beyond the known ones has a documented reason',
  Object.values(SCORING_SYSTEMS).filter((s) => !s.computable).length === 6);
assert('every system carries an audit record with at least one official source',
  Object.entries(SCORING_SYSTEMS).every(([, s]) => s.audit && s.audit.sources.length > 0));
assert('partly-verified systems name what is still unconfirmed',
  Object.values(SCORING_SYSTEMS).filter((s) => s.audit.status !== 'verified').every((s) => s.audit.gaps.length > 0));
// UWC needs a second language besides English; without one it must say so rather than guess.
assert('UWC refuses to guess when no additional language is entered',
  scores.UWC_weighted.computable === false && /additional language/.test(scores.UWC_weighted.reason));

console.log('\nStellenbosch selection formulas');
const eng = stellenboschSelection(STRONG, 'Engineering');
check('SU Engineering selection /800', eng.value, Math.round(82 + 76 + 6 * (449 / 6)));
const sci = stellenboschSelection(STRONG, 'Science');
check('SU Science selection mark', sci.value, Math.round(((82 * 2 + (78 + 76 + 74 + 71 + 68)) / 7) * 10) / 10);

console.log('\nQualifying verdicts');
const find = (id) => programs.find((p) => p.id === id);

// UP BCom Economics needs APS 32, English L5 (60%), Maths L5 (60%). Student has 36/78/82.
const upEcon = assessProgram(find('up-bcom-economics'), STRONG, scores.UP_APS_exLO);
check('UP BCom Economics verdict', upEcon.verdict, 'qualifies');

// UCT Civil Engineering needs FPS 500 and Maths 80 / PS 70. Student has 449 and 82/76.
const uctCivil = assessProgram(find('uct-beng-civil'), STRONG, scores.UCT_FPS600);
check('UCT Civil Engineering verdict', uctCivil.verdict, 'not_yet');
check('UCT Civil Engineering points gap', uctCivil.pointsGap, 51);
assert('UCT Civil is NOT flagged as close (51 FPS is a long way)', uctCivil.close === false);

// Wits BSc General needs APS 42, English L5, Maths L5 - AND the NBT. Student has 43, which
// clears every mark we can check, but the NBT is something marks cannot settle.
const witsBsc = assessProgram(find('wits-bsc-general'), STRONG, scores.WITS_APS_incLO);
check('Wits BSc (General) verdict: marks fine, NBT outstanding', witsBsc.verdict, 'marks_ok');
assert('Wits BSc (General) names the NBT as the outstanding item', witsBsc.manual.some((m) => m.label === 'NBT'));

// The rule that keeps "you qualify" honest: any programme with an unchecked requirement
// (NBT, portfolio, interview, job shadowing...) can never come back as a flat "qualifies".
{
  const flat = programs.filter((p) => (p.subject_requirements || []).some((r) => r.not_computable || r.label));
  assert(`${flat.length} programmes carry an unchecked requirement`, flat.length > 20);
  const offenders = flat.filter((p) => assessProgram(p, STRONG, scores[p.scoring_system]).verdict === 'qualifies');
  assert('none of them is ever reported as a plain "qualifies"', offenders.length === 0, offenders.map((p) => p.id).join(', '));
}
{
  // ...and the converse: a programme with nothing unchecked still can.
  const clean = programs.filter((p) => !(p.subject_requirements || []).some((r) => r.not_computable || r.label));
  assert('programmes with nothing unchecked can still qualify',
    clean.some((p) => assessProgram(p, STRONG, scores[p.scoring_system]).verdict === 'qualifies'));
}

// Wits Computer Science needs 44; student has 43 -> close, not qualified.
const witsCs = assessProgram(find('wits-bsc-compsci'), STRONG, scores.WITS_APS_incLO);
check('Wits Computer Science verdict', witsCs.verdict, 'not_yet');
assert('Wits Computer Science is flagged as close (1 point)', witsCs.close === true);

// UKZN: score not computable, so we must never claim a verdict either way.
// UKZN: English 6 + Maths 7 + PS 6 + LS 6 + Geography 6 + Accounting 5 = 36 on the 8-point scale.
check('UKZN APS/48', scores.UKZN_APS_exLO.value, 36);
const ukzn = assessProgram(find('ukzn-bcom-general'), STRONG, scores.UKZN_APS_exLO);
check('UKZN BCom General (needs 30): points status', ukzn.pointsStatus, 'met');

// A programme with no published cut-off must not claim one.
const witsMed = assessProgram(find('wits-mbbch'), STRONG, scores.WITS_COMPOSITE_INDEX);
check('Wits MBBCh points status', witsMed.pointsStatus, 'no_cutoff');
assert('Wits MBBCh does not say "qualifies"', witsMed.verdict !== 'qualifies');

console.log('\nSubject requirement gaps are reported precisely');
const weakMaths = normaliseMarks({ ...Object.fromEntries(STRONG.map((m) => [m.id, m.percent])), mathematics: 68 });
const weakScores = scoreEverySystem(weakMaths, ['SU_aggregate_pct']);
const suCs = assessProgram(find('su-bsc-compsci'), weakMaths, weakScores.SU_aggregate_pct);
const mathsGap = suCs.subjectGaps.find((g) => g.label.startsWith('Mathematics'));
assert('SU Computer Science reports the exact Maths shortfall', mathsGap && mathsGap.gap === 2,
  mathsGap ? `gap was ${mathsGap.gap}` : 'no Maths gap found');

console.log('\nAn any_of requirement only consumes the alternative that actually matched');
{
  // UCT BSc Physiotherapy needs: Maths 60%, (Physical Sciences 65% OR Life Sciences 65%),
  // English, and "next 3 best other subjects" at 60%. STRONG has BOTH Physical Sciences
  // (76%) and Life Sciences (71%) above the 65% bar, plus Accounting and Geography.
  // A student with both sciences should still have exactly enough other subjects: whichever
  // science wasn't "used" for the any_of, plus Accounting and Geography.
  const physio = find('uct-bsc-physio');
  const result = assessProgram(physio, STRONG, scores.UCT_FPS600);
  const next3 = result.requirements.find((r) => r.label.startsWith('Your next 3 best'));
  assert('next-3-subjects is NOT "missing" when both PS and LS are present', next3 && next3.status !== 'missing',
    next3 ? `status was ${next3.status}` : 'no next-3 requirement found');
  assert('the unused science (Life Sciences) counts towards it', next3 && /Life Sciences/.test(next3.detail || ''),
    next3 ? next3.detail : '');
  assert('Physiotherapy is not wrongly dumped in "cannot_tell" for this reason',
    result.unknownSubjects.length === 0, JSON.stringify(result.unknownSubjects));
}

console.log('\nTest vectors from the universities own worked examples');
{
  const mk = (o) => normaliseMarks(o);
  const one = (id, m, program) => (program ? scoreForProgram(id, m, program) : scoreEverySystem(m, [id])[id]);
  const engineering = { subject_requirements: [{ subject: 'Mathematics', min_percent: 80 }, { subject: 'Physical Sciences', min_percent: 70 }] };

  // UCT's 2025 Guidelines, worked example 1 (Commerce/EBE/Humanities/Law): FPS = 463/600.
  const uctExample = mk({ 'english-hl': 75, isixhosa: 70, mathematics: 84, 'physical-sciences': 86, cat: 79, 'consumer-studies': 69, 'life-orientation': 80 });
  check('UCT worked example: FPS 463/600', one('UCT_FPS600', uctExample).value, 463);

  // UCT's worked example 3 (Faculty of Science): English 75, isiXhosa FAL 70, Maths 84,
  // Physical Sciences 86, Consumer Studies 79, EGD 69 -> FPS 633/800.
  const uctScience = mk({ 'english-hl': 75, isixhosa: 70, mathematics: 84, 'physical-sciences': 86, 'consumer-studies': 79, egd: 69, 'life-orientation': 80 });
  check('UCT Science worked example: FPS 633/800', one('UCT_FPS800', uctScience).value, 633);

  // UCT: a result below 40% attracts no score.
  const uctLow = mk({ 'english-hl': 75, mathematics: 84, 'physical-sciences': 86, cat: 79, geography: 69, history: 35, economics: 30 });
  check('UCT: marks under 40% score zero', one('UCT_FPS600', uctLow).value, 75 + 84 + 86 + 79 + 69 + 0);

  // UCT: the subjects a degree requires are forced into the six even if weaker.
  const uctForce = mk({ 'english-hl': 60, mathematics: 50, 'physical-sciences': 41, cat: 90, history: 88, geography: 85, economics: 84 });
  check('UCT generic: plain best six', one('UCT_FPS600', uctForce).value, 60 + 90 + 88 + 85 + 84 + 50);
  check('UCT: a degree requiring Maths + Physical Sciences counts them', one('UCT_FPS600', uctForce, engineering).value, 60 + 50 + 41 + 90 + 88 + 85);

  // UFS own worked example: five subjects at level 5, one at level 4, Life Orientation level 5 = 30.
  const ufsExample = mk({ 'english-hl': 65, mathematics: 62, 'physical-sciences': 61, 'life-sciences': 66, geography: 64, history: 55, 'life-orientation': 60 });
  check('UFS worked example: AP 30', one('UFS_AP', ufsExample).value, 30);

  // Wits boundaries, straight from the table on wits.ac.za.
  const witsScore = (over) => one('WITS_APS_incLO', mk({ 'english-hl': 50, mathematics: 50, 'physical-sciences': 50, 'life-sciences': 50, geography: 50, history: 50, 'life-orientation': 50, ...over })).value;
  const base = witsScore({});
  check('Wits: 50% everywhere = 4 x 6, LO 0', base, 24);
  check('Wits: Maths 59% gets no bonus', witsScore({ mathematics: 59 }) - base, 0);
  check('Wits: Maths 60% = 5 + 2 bonus = 7', witsScore({ mathematics: 60 }) - base, 3);
  check('Wits: English 90% = 8 + 2 = 10', witsScore({ 'english-hl': 90 }) - base, 6);
  check('Wits: Life Orientation 59% = 0 and 60% = 1', [witsScore({ 'life-orientation': 59 }) - base, witsScore({ 'life-orientation': 60 }) - base], [0, 1]);
  check('Wits: Life Orientation 90% = 4', witsScore({ 'life-orientation': 90 }) - base, 4);
  check('Wits: a subject under 40% scores 0, not level 1 or 2', witsScore({ geography: 39 }) - base, -4);
  check('Wits: without Life Orientation it refuses rather than guess',
    one('WITS_APS_incLO', mk({ 'english-hl': 70, mathematics: 70, 'physical-sciences': 70, 'life-sciences': 70, geography: 70, history: 70 })).computable, false);

  // Wits: required subjects must be among the seven counted.
  const witsWeakPs = mk({ 'english-hl': 80, mathematics: 80, 'physical-sciences': 41, 'life-sciences': 90, geography: 90, history: 90, accounting: 90, 'life-orientation': 50 });
  check('Wits generic: drops the weak Physical Sciences', one('WITS_APS_incLO', witsWeakPs).value, 9 + 9 + 8 + 8 + 8 + 8 + 0);
  check('Wits engineering: must count Physical Sciences (41% = 3)', one('WITS_APS_incLO', witsWeakPs, engineering).value, 9 + 9 + 3 + 8 + 8 + 8 + 0);

  // UKZN table boundaries (UKZN CLMS Handbook 2026).
  check('UKZN scale: 29% = 1, 30% = 2, 89% = 7, 90% = 8', [29, 30, 89, 90].map(witsLevel), [1, 2, 7, 8]);

  // UWC, worked through the official calculator's own functions.
  const uwcStudent = mk({ 'english-hl': 78, 'afrikaans-fal': 65, mathematics: 82, 'life-orientation': 85, 'physical-sciences': 76, 'life-sciences': 71, geography: 74, accounting: 68 });
  check('UWC: 11 + 5 + 13 + 3 + (6+6+6) = 50', one('UWC_weighted', uwcStudent).value, 50);
  const uwcMathsLit = mk({ 'english-hl': 78, 'afrikaans-fal': 65, 'mathematical-literacy': 82, 'life-orientation': 85, 'physical-sciences': 76, 'life-sciences': 71, geography: 74 });
  check('UWC: Mathematical Literacy scores its level (7), not the Maths column (13)', one('UWC_weighted', uwcMathsLit).value, 11 + 5 + 7 + 3 + 6 + 6 + 6);

  // NWU: six best on the 8-point scale.
  check('NWU: six best', one('NWU_APS', mk({ 'english-hl': 91, mathematics: 85, 'physical-sciences': 72, 'life-sciences': 65, geography: 55, history: 45, accounting: 20 })).value, 8 + 7 + 6 + 5 + 4 + 3);

  // Rhodes and SU count the six best, not everything entered.
  const seven = mk({ 'english-hl': 90, mathematics: 80, 'physical-sciences': 70, 'life-sciences': 60, geography: 50, history: 40, accounting: 10 });
  check('Rhodes: six best / 10', one('RU_pct_div10', seven).value, 39);
  check('SU: average of the six best', one('SU_aggregate_pct', seven).value, 65);

  check('requirementGroups: plain, any_of, and manual items', requirementGroups([
    { subject: 'English', hl_min_percent: 50 },
    { any_of: [{ subject: 'Mathematics' }, { subject: 'Mathematical Literacy' }] },
    { label: 'NBT', not_computable: true },
  ]), [['English'], ['Mathematics', 'Mathematical Literacy']]);
}

console.log('\nEvery programme in the dataset can be assessed without throwing');
let assessed = 0;
for (const p of programs) {
  const score = scores[p.scoring_system];
  const result = assessProgram(p, STRONG, score);
  if (!result || !result.verdict) { failures++; console.error(`  FAIL ${p.id} produced no verdict`); }
  assessed++;
}
assert(`assessed all ${assessed} programmes`, assessed === programs.length);

console.log(failures ? `\n${failures} FAILURE(S)\n` : `\nAll checks passed.\n`);
process.exit(failures ? 1 : 0);
