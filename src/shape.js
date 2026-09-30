// Turning a programme row into the shape the UI uses.
//
// Shared by the Worker (rows from D1), the static-site build (rows from db/data) and the
// browser (programs.json is this shape), so all three describe a programme identically.

import { SCORING_SYSTEMS } from './scoring.js';

/**
 * Notes carry their caveats as leading [tokens] so the UI can badge them instead of
 * burying "sources disagree" in a paragraph nobody reads. See db/data/_helpers.mjs.
 */
export const KNOWN_FLAGS = {
  conflict: { label: 'Sources disagree', tone: 'warn' },
  unverified: { label: 'Not fully verified', tone: 'warn' },
  'partially-verified': { label: 'Partly verified', tone: 'warn' },
  'dated-document': { label: 'From an older document', tone: 'info' },
  selection: { label: 'Selection programme', tone: 'info' },
  'no-cutoff-published': { label: 'No cut-off published', tone: 'info' },
};

export function splitFlags(notes) {
  let rest = notes || '';
  const flags = [];
  for (;;) {
    const m = rest.match(/^\s*\[([a-z-]+)\]\s*/);
    if (!m) break;
    const known = KNOWN_FLAGS[m[1]];
    if (known) flags.push({ id: m[1], ...known });
    rest = rest.slice(m[0].length);
  }
  return { flags, notes: rest.trim() };
}

export const safeJson = (value, fallback) => {
  if (Array.isArray(value) || (value && typeof value === 'object')) return value;
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export function shapeProgram(row) {
  const { flags, notes } = splitFlags(row.notes);
  const system = SCORING_SYSTEMS[row.scoring_system];
  return {
    id: row.id,
    name: row.name,
    faculty: row.faculty,
    durationYears: row.duration_years ?? null,
    minScore: row.min_aps ?? null,
    scoreType: row.score_type,
    scoringSystem: row.scoring_system,
    scoringSystemLabel: system ? system.label : row.scoring_system,
    scoringSystemUnit: system ? system.unit : '',
    scoreIsComputable: system ? system.computable !== false : false,
    subjectRequirements: safeJson(row.subject_requirements, []),
    notes,
    flags,
    sourceUrl: row.source_url,
    verifiedAt: row.verified_at ?? null,
    intakeYear: row.intake_year ?? null,
    documentDate: row.document_date ?? null,
    university: row.university_id
      ? { id: row.university_id, name: row.university_name, shortName: row.university_short_name, website: row.university_website }
      : null,
    career: row.career_id ? { id: row.career_id, name: row.career_name } : null,
  };
}
