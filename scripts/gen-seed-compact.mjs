// Writes db/seed-compact.sql: the same dataset as db/seed.sql, but with the long
// repeated `notes` text factored out.
//
// Many programmes share word-for-word identical notes (every UP row carries the same
// closing-date sentence, every SU row the same selection caveat, and so on). This
// version inserts the programme rows without notes, then sets each distinct note once
// with an `UPDATE ... WHERE id IN (...)`. Same end state, roughly half the bytes -
// which matters when the file has to be pushed over a connection with a size budget.
//
// db/seed.sql remains the canonical, readable artifact. Use this one for loading.

import { writeFileSync } from 'node:fs';
import { universities } from '../db/data/universities.mjs';
import { careers } from '../db/data/careers.mjs';
import { uctPrograms } from '../db/data/programs-uct.mjs';
import { witsPrograms } from '../db/data/programs-wits.mjs';
import { suPrograms } from '../db/data/programs-su.mjs';
import { upPrograms } from '../db/data/programs-up.mjs';
import { ukznPrograms } from '../db/data/programs-ukzn.mjs';
import { otherPrograms } from '../db/data/programs-other.mjs';
import { researchLog } from '../db/data/research-log.mjs';

const programs = [
  ...uctPrograms, ...witsPrograms, ...suPrograms,
  ...upPrograms, ...ukznPrograms, ...otherPrograms,
];

const q = (v) => {
  if (v === null || v === undefined || v === '') return 'NULL';
  if (typeof v === 'number') return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
};
const json = (v) => (v === null || v === undefined ? 'NULL' : q(JSON.stringify(v)));

const out = [];
const push = (s) => { out.push(s); out.push(''); };

push('DELETE FROM programs;');

// --- programme rows, without notes ---
const COLS = ['id', 'university_id', 'career_id', 'name', 'faculty', 'duration_years', 'min_aps',
  'subject_requirements', 'source_url', 'scoring_system', 'score_type', 'intake_year', 'document_date'];
const tuple = (p) => '  (' + [q(p.id), q(p.university_id), q(p.career_id), q(p.name), q(p.faculty),
  q(p.duration_years ?? null), q(p.min_aps ?? null), json(p.subject_requirements ?? []),
  q(p.source_url), q(p.scoring_system), q(p.score_type), q(p.intake_year ?? null),
  q(p.document_date ?? null)].join(', ') + ')';

let batch = [], len = 0;
const flushRows = () => {
  if (!batch.length) return;
  push(`INSERT INTO programs (${COLS.join(', ')}) VALUES\n` + batch.join(',\n') + ';');
  batch = []; len = 0;
};
for (const p of programs) {
  const t = tuple(p);
  if (len + t.length > 14000) flushRows();
  batch.push(t); len += t.length;
}
flushRows();

// --- notes, one UPDATE per distinct text ---
const byNote = new Map();
for (const p of programs) {
  const n = p.notes || '';
  if (!n) continue;
  if (!byNote.has(n)) byNote.set(n, []);
  byNote.get(n).push(p.id);
}
let stmts = [], slen = 0;
const flushNotes = () => {
  if (!stmts.length) return;
  push(stmts.join('\n'));
  stmts = []; slen = 0;
};
for (const [note, ids] of byNote) {
  const s = `UPDATE programs SET notes = ${q(note)} WHERE id IN (${ids.map(q).join(', ')});`;
  if (slen + s.length > 14000) flushNotes();
  stmts.push(s); slen += s.length;
}
flushNotes();

writeFileSync(new URL('../db/seed-compact.sql', import.meta.url), out.join('\n'));
console.log(`Wrote db/seed-compact.sql: ${programs.length} programmes, ${byNote.size} distinct note texts ` +
  `(was ${programs.filter((p) => p.notes).length} copies).`);
