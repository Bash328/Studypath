// Studypath API. One Worker: it serves the static site (via the [assets] binding)
// and everything under /api/* from the `studypath` D1 database.

import { SUBJECTS, normaliseMarks } from './subjects.js';
import { SCORING_SYSTEMS, scoreEverySystem, assessProgram, stellenboschSelection } from './scoring.js';

const json = (data, { status = 200, maxAge = 300 } = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': status === 200 ? `public, max-age=${maxAge}` : 'no-store',
    },
  });

const fail = (status, message) => json({ error: message }, { status });

/**
 * Notes carry their caveats as leading [tokens] so the UI can badge them instead of
 * burying "sources disagree" in a paragraph nobody reads. See db/data/_helpers.mjs.
 */
const KNOWN_FLAGS = {
  conflict: { label: 'Sources disagree', tone: 'warn' },
  unverified: { label: 'Not fully verified', tone: 'warn' },
  'partially-verified': { label: 'Partly verified', tone: 'warn' },
  'dated-document': { label: 'From an older document', tone: 'info' },
  selection: { label: 'Selection programme', tone: 'info' },
  'no-cutoff-published': { label: 'No cut-off published', tone: 'info' },
};

function splitFlags(notes) {
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

function shapeProgram(row) {
  const { flags, notes } = splitFlags(row.notes);
  const system = SCORING_SYSTEMS[row.scoring_system];
  return {
    id: row.id,
    name: row.name,
    faculty: row.faculty,
    durationYears: row.duration_years,
    minScore: row.min_aps,
    scoreType: row.score_type,
    scoringSystem: row.scoring_system,
    scoringSystemLabel: system ? system.label : row.scoring_system,
    scoringSystemUnit: system ? system.unit : '',
    scoreIsComputable: system ? system.computable !== false : false,
    subjectRequirements: safeJson(row.subject_requirements, []),
    notes,
    flags,
    sourceUrl: row.source_url,
    verifiedAt: row.verified_at,
    intakeYear: row.intake_year,
    documentDate: row.document_date,
    university: row.university_id
      ? { id: row.university_id, name: row.university_name, shortName: row.university_short_name, website: row.university_website }
      : null,
    career: row.career_id ? { id: row.career_id, name: row.career_name } : null,
  };
}

const safeJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const PROGRAM_SELECT = `
  SELECT p.*, u.name AS university_name, u.short_name AS university_short_name, u.website AS university_website,
         c.name AS career_name
  FROM programs p
  JOIN universities u ON u.id = p.university_id
  LEFT JOIN careers c ON c.id = p.career_id`;

// ---------------------------------------------------------------------------

const routes = [
  ['GET', /^\/api\/meta$/, meta],
  ['GET', /^\/api\/subjects$/, () => json({ subjects: SUBJECTS })],
  ['GET', /^\/api\/careers$/, listCareers],
  ['GET', /^\/api\/careers\/([\w-]+)$/, getCareer],
  ['GET', /^\/api\/universities$/, listUniversities],
  ['GET', /^\/api\/universities\/([\w-]+)$/, getUniversity],
  ['GET', /^\/api\/programs$/, listPrograms],
  ['GET', /^\/api\/programs\/([\w-]+)$/, getProgram],
  ['POST', /^\/api\/qualify$/, qualify],
  ['GET', /^\/api\/bursaries$/, listBursaries],
  ['POST', /^\/api\/reminders$/, createReminder],
  ['GET', /^\/api\/research-log$/, researchLog],
  ['GET', /^\/api\/coverage$/, coverage],
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204 });

    for (const [method, pattern, handler] of routes) {
      const match = url.pathname.match(pattern);
      if (!match) continue;
      if (method !== request.method) return fail(405, 'Method not allowed');
      try {
        return await handler({ request, env, ctx, url, params: match.slice(1) });
      } catch (err) {
        console.error(url.pathname, err && err.stack);
        return fail(500, 'Something went wrong on our side. Please try again.');
      }
    }
    return fail(404, 'No such endpoint');
  },
};

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function meta({ env }) {
  const [universities, sectors, stats] = await Promise.all([
    env.DB.prepare(
      `SELECT u.id, u.name, u.short_name AS shortName, u.website, COUNT(p.id) AS programCount,
              MAX(p.scoring_system) AS scoringSystem
       FROM universities u LEFT JOIN programs p ON p.university_id = u.id
       GROUP BY u.id ORDER BY u.name`
    ).all(),
    env.DB.prepare(`SELECT sector, COUNT(*) AS n FROM careers GROUP BY sector ORDER BY sector`).all(),
    env.DB.prepare(
      `SELECT (SELECT COUNT(*) FROM programs) AS programs,
              (SELECT COUNT(*) FROM universities) AS universities,
              (SELECT COUNT(*) FROM careers) AS careers,
              (SELECT COUNT(*) FROM research_log WHERE status = 'could_not_verify') AS openGaps`
    ).first(),
  ]);

  return json({
    universities: universities.results,
    sectors: sectors.results,
    stats,
    scoringSystems: Object.entries(SCORING_SYSTEMS).map(([id, s]) => ({
      id,
      label: s.label,
      unit: s.unit,
      max: s.max ?? null,
      computable: s.computable !== false,
      explanation: s.explanation,
      reason: s.reason ?? null,
      sourceUrl: s.sourceUrl ?? null,
    })),
  });
}

async function listCareers({ env, url }) {
  const sector = url.searchParams.get('sector');
  const q = (url.searchParams.get('q') || '').trim();
  const where = [];
  const binds = [];
  if (sector) { where.push('c.sector = ?'); binds.push(sector); }
  if (q) { where.push('(c.name LIKE ? OR c.description LIKE ?)'); binds.push(`%${q}%`, `%${q}%`); }

  const { results } = await env.DB.prepare(
    `SELECT c.*, COUNT(p.id) AS programCount, COUNT(DISTINCT p.university_id) AS universityCount
     FROM careers c LEFT JOIN programs p ON p.career_id = c.id
     ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
     GROUP BY c.id ORDER BY c.sector, c.name`
  ).bind(...binds).all();

  return json({
    careers: results.map((c) => ({
      id: c.id, name: c.name, sector: c.sector, description: c.description,
      typicalSubjects: safeJson(c.typical_subjects, []),
      programCount: c.programCount, universityCount: c.universityCount,
    })),
  });
}

async function getCareer({ env, params }) {
  const career = await env.DB.prepare(`SELECT * FROM careers WHERE id = ?`).bind(params[0]).first();
  if (!career) return fail(404, 'We do not have that career yet.');
  const { results } = await env.DB.prepare(`${PROGRAM_SELECT} WHERE p.career_id = ? ORDER BY u.name, p.name`)
    .bind(params[0]).all();
  return json({
    career: {
      id: career.id, name: career.name, sector: career.sector, description: career.description,
      typicalSubjects: safeJson(career.typical_subjects, []),
    },
    programs: results.map(shapeProgram),
  });
}

async function listUniversities({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT u.id, u.name, u.short_name AS shortName, u.website,
            COUNT(p.id) AS programCount, COUNT(DISTINCT p.faculty) AS facultyCount
     FROM universities u LEFT JOIN programs p ON p.university_id = u.id
     GROUP BY u.id ORDER BY u.name`
  ).all();
  return json({ universities: results });
}

async function getUniversity({ env, params }) {
  const university = await env.DB.prepare(
    `SELECT id, name, short_name AS shortName, website FROM universities WHERE id = ?`
  ).bind(params[0]).first();
  if (!university) return fail(404, 'We do not have that university yet.');

  const [programs, log] = await Promise.all([
    env.DB.prepare(`${PROGRAM_SELECT} WHERE p.university_id = ? ORDER BY p.faculty, p.name`).bind(params[0]).all(),
    env.DB.prepare(`SELECT * FROM research_log WHERE university_id = ? ORDER BY status, id`).bind(params[0]).all(),
  ]);

  const shaped = programs.results.map(shapeProgram);
  const systemId = shaped.length ? shaped[0].scoringSystem : null;
  const system = systemId ? SCORING_SYSTEMS[systemId] : null;

  return json({
    university,
    scoring: system ? { id: systemId, label: system.label, unit: system.unit, computable: system.computable !== false, explanation: system.explanation, reason: system.reason ?? null } : null,
    programs: shaped,
    researchLog: log.results,
  });
}

async function listPrograms({ env, url }) {
  const where = [];
  const binds = [];
  const add = (param, sql) => {
    const v = url.searchParams.get(param);
    if (v) { where.push(sql); binds.push(v); }
  };
  add('university', 'p.university_id = ?');
  add('career', 'p.career_id = ?');
  add('faculty', 'p.faculty = ?');
  const q = (url.searchParams.get('q') || '').trim();
  if (q) { where.push('(p.name LIKE ? OR p.faculty LIKE ? OR u.name LIKE ?)'); binds.push(`%${q}%`, `%${q}%`, `%${q}%`); }

  const limit = Math.min(Number(url.searchParams.get('limit')) || 200, 500);
  const { results } = await env.DB.prepare(
    `${PROGRAM_SELECT} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY u.name, p.faculty, p.name LIMIT ?`
  ).bind(...binds, limit).all();

  return json({ programs: results.map(shapeProgram) });
}

async function getProgram({ env, params }) {
  const row = await env.DB.prepare(`${PROGRAM_SELECT} WHERE p.id = ?`).bind(params[0]).first();
  if (!row) return fail(404, 'We do not have that programme yet.');
  return json({ program: shapeProgram(row) });
}

/**
 * The calculator. One set of marks in; one score PER UNIVERSITY out, each computed
 * that university's own way, plus what each programme says about those marks.
 */
async function qualify({ request, env }) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.marks !== 'object') return fail(400, 'Send your marks as { "marks": { "mathematics": 72, ... } }.');

  const marks = normaliseMarks(body.marks);
  if (marks.length < 4) return fail(400, 'Enter at least 4 subjects so we can work anything out.');

  const { results } = await env.DB.prepare(`${PROGRAM_SELECT} ORDER BY u.name, p.faculty, p.name`).all();
  const programs = results.map(shapeProgram);

  const systems = [...new Set(programs.map((p) => p.scoringSystem))];
  const scores = scoreEverySystem(marks, systems);

  const byUniversity = new Map();
  for (const program of programs) {
    const score = scores[program.scoringSystem];
    const assessment = assessProgram(
      { ...program, subject_requirements: program.subjectRequirements, min_aps: program.minScore },
      marks,
      score
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
        close: [],
        notYet: [],
        cannotTell: [],
      });
    }
    const bucket = byUniversity.get(uid);
    if (score && !bucket.scores.some((s) => s.id === score.id)) bucket.scores.push(score);
    const entry = { program, ...assessment, scoreId: score ? score.id : null };
    if (assessment.verdict === 'qualifies') bucket.qualifies.push(entry);
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
    (a, b) => b.qualifies.length - a.qualifies.length || a.university.name.localeCompare(b.university.name)
  );

  return json(
    {
      marksCounted: marks.length,
      universities,
      warning:
        'These scores are NOT comparable with each other. Each one is worked out using that university’s own formula, from the same marks. Never compare a Wits APS with a UP APS or a UCT FPS.',
    },
    { maxAge: 0 }
  );
}

async function listBursaries({ env, url }) {
  const field = url.searchParams.get('field');
  const where = ['active = 1'];
  const binds = [];
  if (field) { where.push('field_of_study LIKE ?'); binds.push(`%${field}%`); }
  const { results } = await env.DB.prepare(
    `SELECT * FROM bursaries WHERE ${where.join(' AND ')} ORDER BY (deadline IS NULL), deadline ASC`
  ).bind(...binds).all();
  return json({ bursaries: results, count: results.length });
}

/**
 * WhatsApp deadline reminders. This endpoint only records consent and the number -
 * the actual sending reuses the existing WhatsApp sender rather than adding a second
 * notification system. See README: "WhatsApp reminders".
 */
async function createReminder({ request, env }) {
  const body = await request.json().catch(() => null);
  const phone = String((body && body.phone) || '').replace(/[^\d+]/g, '');
  const field = (body && body.field) || null;
  if (!/^\+?\d{9,15}$/.test(phone)) return fail(400, 'That does not look like a phone number. Use the format 0821234567.');
  if (!body.consent) return fail(400, 'We need your okay before we can message you.');

  await env.DB.prepare(
    `INSERT INTO reminder_optins (id, phone, field_of_study, consent, created_at)
     VALUES (?, ?, ?, 1, datetime('now'))
     ON CONFLICT(phone) DO UPDATE SET field_of_study = excluded.field_of_study, consent = 1`
  ).bind(crypto.randomUUID(), phone, field).run();

  return json({ ok: true, message: 'You are on the list. We will WhatsApp you before bursary deadlines close.' }, { maxAge: 0 });
}

async function researchLog({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT r.*, u.name AS university_name FROM research_log r
     LEFT JOIN universities u ON u.id = r.university_id
     ORDER BY CASE r.status WHEN 'could_not_verify' THEN 0 WHEN 'partially_verified' THEN 1 ELSE 2 END, r.id`
  ).all();
  return json({ entries: results });
}

async function coverage({ env }) {
  const [byUni, flags] = await Promise.all([
    env.DB.prepare(
      `SELECT u.id, u.name, u.short_name AS shortName, COUNT(p.id) AS programs,
              SUM(CASE WHEN p.min_aps IS NULL THEN 1 ELSE 0 END) AS withoutScore
       FROM universities u LEFT JOIN programs p ON p.university_id = u.id
       GROUP BY u.id ORDER BY programs DESC`
    ).all(),
    env.DB.prepare(`SELECT notes FROM programs WHERE notes LIKE '[%'`).all(),
  ]);

  const counts = {};
  for (const row of flags.results) {
    for (const f of splitFlags(row.notes).flags) counts[f.id] = (counts[f.id] || 0) + 1;
  }
  return json({ universities: byUni.results, flagCounts: counts });
}
