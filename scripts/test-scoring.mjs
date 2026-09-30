// Sanity checks for the scoring engine, run against the real dataset.
//   node scripts/test-scoring.mjs
//
// These are the checks that matter for this product: that each university's number is
// worked out its own way, that we never invent a score for a system we have not
// verified, and that "you qualify" is only ever said when it is true.

import { normaliseMarks } from '../src/subjects.js';
import { SCORING_SYSTEMS, scoreEverySystem, assessProgram, stellenboschSelection, nscLevel, witsLevel } from '../src/scoring.js';
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

// SU: average of 6 non-LO subjects = (78+82+76+71+68+74)/6 = 74.833 -> 74.8
check('SU aggregate %', scores.SU_aggregate_pct.value, 74.8);

// Rhodes: sum of 6 best non-LO percentages / 10 = 449/10 = 44.9
check('Rhodes points', scores.RU_pct_div10.value, 44.9);

assert('all five computable systems produced different numbers',
  new Set([scores.UCT_FPS600.value, scores.WITS_APS_incLO.value, scores.UP_APS_exLO.value,
           scores.SU_aggregate_pct.value, scores.RU_pct_div10.value]).size === 5);

console.log('\nWe refuse to guess the systems we have not verified');
for (const id of ['UKZN_APS_exLO', 'UWC_weighted', 'NWU_APS', 'UFS_AP', 'WITS_COMPOSITE_INDEX']) {
  assert(`${id} returns no number`, scores[id].computable === false && !!scores[id].reason);
}

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

// Wits BSc General needs APS 42, English L5, Maths L5. Student has 43.
const witsBsc = assessProgram(find('wits-bsc-general'), STRONG, scores.WITS_APS_incLO);
check('Wits BSc (General) verdict', witsBsc.verdict, 'qualifies');

// Wits Computer Science needs 44; student has 43 -> close, not qualified.
const witsCs = assessProgram(find('wits-bsc-compsci'), STRONG, scores.WITS_APS_incLO);
check('Wits Computer Science verdict', witsCs.verdict, 'not_yet');
assert('Wits Computer Science is flagged as close (1 point)', witsCs.close === true);

// UKZN: score not computable, so we must never claim a verdict either way.
const ukzn = assessProgram(find('ukzn-bcom-general'), STRONG, scores.UKZN_APS_exLO);
assert('UKZN programme never says "qualifies" without a score', ukzn.verdict !== 'qualifies');

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
