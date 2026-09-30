// Turns db/data/*.mjs into db/seed.sql.
// Regenerate and re-apply whenever the dataset changes:
//   npm run seed:generate && npm run seed:apply

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

// ---- validation: the whole product rests on these invariants ----
const errors = [];
const careerIds = new Set(careers.map((c) => c.id));
const uniIds = new Set(universities.map((u) => u.id));
const seen = new Set();

for (const p of programs) {
  if (seen.has(p.id)) errors.push(`duplicate program id: ${p.id}`);
  seen.add(p.id);
  if (!p.source_url) errors.push(`${p.id}: source_url is required - every number must cite an official page`);
  else if (!/^https:\/\//.test(p.source_url)) errors.push(`${p.id}: source_url must be https`);
  else if (!/\.ac\.za|\.edu|\.org/.test(new URL(p.source_url).hostname)) {
    errors.push(`${p.id}: source_url is not an official university host (${new URL(p.source_url).hostname})`);
  }
  if (!uniIds.has(p.university_id)) errors.push(`${p.id}: unknown university_id ${p.university_id}`);
  if (p.career_id && !careerIds.has(p.career_id)) errors.push(`${p.id}: unknown career_id ${p.career_id}`);
  if (!p.scoring_system) errors.push(`${p.id}: scoring_system is required - scores are never comparable across universities`);
  if (!['minimum', 'band_a', 'band_b', 'band_c', 'waitlist'].includes(p.score_type)) {
    errors.push(`${p.id}: bad score_type ${p.score_type}`);
  }
}
const orphanCareers = careers.filter((c) => !programs.some((p) => p.career_id === c.id));
if (orphanCareers.length) {
  console.warn(`note: ${orphanCareers.length} career(s) have no verified programme yet: ${orphanCareers.map((c) => c.id).join(', ')}`);
}
if (errors.length) {
  console.error('Seed validation failed:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

// ---- emit ----
const lines = [
  '-- GENERATED FILE - do not edit by hand.',
  '-- Source of truth: db/data/*.mjs. Regenerate with `npm run seed:generate`.',
  `-- Generated ${new Date().toISOString()}`,
  '',
  '-- Replaces the dataset wholesale so re-running is safe and idempotent.',
  'DELETE FROM programs;',
  'DELETE FROM research_log;',
  'DELETE FROM careers;',
  'DELETE FROM universities;',
  '',
];

/**
 * Emits one multi-row INSERT per batch rather than one statement per row.
 * Batches are capped so each statement stays comfortably inside D1's limits.
 */
const insertMany = (table, columns, rows, toValues, maxChars = 16000) => {
  const head = `INSERT INTO ${table} (${columns.join(', ')}) VALUES`;
  let batch = [];
  let len = 0;
  const flush = () => {
    if (!batch.length) return;
    lines.push(head + '\n' + batch.join(',\n') + ';');
    lines.push('');
    batch = [];
    len = 0;
  };
  for (const row of rows) {
    const tuple = '  (' + toValues(row).join(', ') + ')';
    if (len + tuple.length > maxChars) flush();
    batch.push(tuple);
    len += tuple.length;
  }
  flush();
};

insertMany('universities', ['id', 'name', 'short_name', 'website'], universities,
  (u) => [q(u.id), q(u.name), q(u.short_name), q(u.website)]);

insertMany('careers', ['id', 'name', 'sector', 'description', 'typical_subjects'], careers,
  (c) => [q(c.id), q(c.name), q(c.sector), q(c.description), json(c.typical_subjects)]);

insertMany('programs',
  ['id', 'university_id', 'career_id', 'name', 'faculty', 'duration_years', 'min_aps',
   'subject_requirements', 'notes', 'source_url', 'scoring_system', 'score_type', 'intake_year', 'document_date'],
  programs,
  (p) => [q(p.id), q(p.university_id), q(p.career_id), q(p.name), q(p.faculty), q(p.duration_years ?? null),
          q(p.min_aps ?? null), json(p.subject_requirements ?? []), q(p.notes || null), q(p.source_url),
          q(p.scoring_system), q(p.score_type), q(p.intake_year ?? null), q(p.document_date ?? null)]);

insertMany('research_log', ['id', 'university_id', 'faculty_or_program', 'status', 'notes'], researchLog,
  (r) => [q(r.id), q(r.university_id), q(r.faculty_or_program), q(r.status), q(r.notes)]);

writeFileSync(new URL('../db/seed.sql', import.meta.url), lines.join('\n') + '\n');
console.log(`Wrote db/seed.sql: ${universities.length} universities, ${careers.length} careers, ${programs.length} programmes, ${researchLog.length} research-log entries.`);
