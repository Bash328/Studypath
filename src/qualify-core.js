// The calculator's brain: one set of marks + the list of programmes -> what this student
// qualifies for, worked out separately for each university.
//
// Pure functions with no I/O, so the SAME code runs in the Cloudflare Worker (POST
// /api/qualify) and in the student's browser (so the site works on static hosting with no
// server at all). Marks never need to leave the device.

import { normaliseMarks } from './subjects.js';
import { scoreEverySystem, scoreForProgram, assessProgram, stellenboschSelection } from './scoring.js';

export const NOT_COMPARABLE_WARNING =
  'These scores are NOT comparable with each other. Each one is worked out using that university’s own formula, from the same marks. Never compare a Wits APS with a UP APS or a UCT FPS.';

export class InputError extends Error {}

/**
 * @param rawMarks  { subjectId: percent }
 * @param programs  programmes in the shape produced by shape.js#shapeProgram
 */
export function qualifyAll(rawMarks, programs) {
  if (!rawMarks || typeof rawMarks !== 'object') {
    throw new InputError('Send your marks as { "marks": { "mathematics": 72, ... } }.');
  }
  const marks = normaliseMarks(rawMarks);
  if (marks.length < 4) throw new InputError('Enter at least 4 subjects so we can work anything out.');

  const systems = [...new Set(programs.map((p) => p.scoringSystem))];
  const scores = scoreEverySystem(marks, systems);

  const byUniversity = new Map();
  for (const program of programs) {
    const score = scores[program.scoringSystem];   // the general, programme-free figure for the card
    // Several universities say the subjects a degree requires must be counted, so the
    // number a degree is judged on can differ from the general one.
    const forThis = scoreForProgram(program.scoringSystem, marks, program);
    const assessment = assessProgram(
      { ...program, subject_requirements: program.subjectRequirements, min_aps: program.minScore },
      marks,
      forThis
    );

    const uid = program.university.id;
    if (!byUniversity.has(uid)) {
      byUniversity.set(uid, {
        university: program.university,
        // A university can use more than one system: Wits scores most faculties on its
        // APS but Health Sciences on a Composite Index. Carry every system it uses.
        scores: [],
        selectionScores: [],
        qualifies: [],
        marksOk: [],
        close: [],
        notYet: [],
        cannotTell: [],
      });
    }
    const bucket = byUniversity.get(uid);
    if (score && !bucket.scores.some((s) => s.id === score.id)) bucket.scores.push(score);

    const entry = {
      program, ...assessment,
      scoreId: score ? score.id : null,
      programScore: forThis.computable ? { value: forThis.value, working: forThis.working } : null,
    };
    if (assessment.verdict === 'qualifies') bucket.qualifies.push(entry);
    else if (assessment.verdict === 'marks_ok') bucket.marksOk.push(entry);
    else if (assessment.close) bucket.close.push(entry);
    else if (assessment.verdict === 'not_yet') bucket.notYet.push(entry);
    else bucket.cannotTell.push(entry);
  }

  // Stellenbosch publishes selection formulas on top of the aggregate.
  const su = byUniversity.get('su');
  if (su) {
    for (const faculty of ['Engineering', 'Science']) {
      const extra = stellenboschSelection(marks, faculty);
      if (extra) su.selectionScores.push(extra);
    }
  }

  const universities = [...byUniversity.values()].sort(
    (a, b) =>
      (b.qualifies.length + b.marksOk.length) - (a.qualifies.length + a.marksOk.length) ||
      a.university.name.localeCompare(b.university.name)
  );

  return { marksCounted: marks.length, universities, warning: NOT_COMPARABLE_WARNING };
}
