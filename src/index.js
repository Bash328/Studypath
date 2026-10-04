// Studypath API. One Worker that serves the optional dynamic parts of the site from the
// `pathwise` D1 database (the database keeps the name it was provisioned with).
//
// The static site does NOT depend on this: the calculator runs in the browser from the
// same shared code (qualify-core.js), and content pages are generated at build time. The
// Worker is for what a static host cannot do - storing an email reminder sign-up or a
// question - and for serving the live database if you want it.
//
// Because the site may live on a different host from this API (for example GitHub Pages
// calling a Worker), every response carries CORS headers for the allowed origins.

import { SUBJECTS } from './subjects.js';
import { SCORING_SYSTEMS } from './scoring.js';
import { shapeProgram, splitFlags, safeJson } from './shape.js';
import { qualifyAll, InputError } from './qualify-core.js';

const json = (data, { status = 200, maxAge = 300 } = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': status === 200 && maxAge > 0 ? `public, max-age=${maxAge}` : 'no-store',
    },
  });

const fail = (status, message) => json({ error: message }, { status });

const PROGRAM_SELECT = `
  SELECT p.*, u.name AS university_name, u.short_name AS university_short_name, u.website AS university_website,
         c.name AS career_name
  FROM programs p
  JOIN universities u ON u.id = p.university_id
  LEFT JOIN careers c ON c.id = p.career_id`;

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

/** Origins allowed to call this API from a browser: the site itself, plus local preview. */
function allowedOrigins(env) {
  const configured = String((env && (env.ALLOWED_ORIGINS || env.SITE_ORIGIN)) || '')
    .split(',').map((s) => s.trim()).filter(Boolean);
  return new Set([...configured, 'http://localhost:8788', 'http://127.0.0.1:8788']);
}

function corsHeaders(request, env) {
  const origin = request.headers.get('origin');
  const headers = { vary: 'origin' };
  if (origin && allowedOrigins(env).has(origin)) {
    headers['access-control-allow-origin'] = origin;
    headers['access-control-allow-methods'] = 'GET, POST, OPTIONS';
    headers['access-control-allow-headers'] = 'content-type, authorization';
    headers['access-control-max-age'] = '86400';
  }
  return headers;
}

function withHeaders(response, extra) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(extra)) headers.set(k, v);
  return new Response(response.body, { status: response.status, headers });
}

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
  ['POST', /^\/api\/questions$/, createQuestion],
  ['GET', /^\/api\/admin\/questions$/, adminListQuestions],
  ['POST', /^\/api\/admin\/questions\/([\w-]+)$/, adminUpdateQuestion],
  ['GET', /^\/api\/research-log$/, researchLog],
  ['GET', /^\/api\/coverage$/, coverage],
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    for (const [method, pattern, handler] of routes) {
      const match = url.pathname.match(pattern);
      if (!match) continue;
      if (method !== request.method) return withHeaders(fail(405, 'Method not allowed'), cors);
      try {
        return withHeaders(await handler({ request, env, ctx, url, params: match.slice(1) }), cors);
      } catch (err) {
        console.error(url.pathname, err && err.stack);
        return withHeaders(fail(500, 'Something went wrong on our side. Please try again.'), cors);
      }
    }
    return withHeaders(fail(404, 'No such endpoint'), cors);
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
      audit: { ...s.audit, auditedOn: s.auditedOn },
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
  const systems = [...new Set(shaped.map((p) => p.scoringSystem))]
    .map((id) => [id, SCORING_SYSTEMS[id]]).filter(([, s]) => s)
    .map(([id, s]) => ({ id, label: s.label, unit: s.unit, computable: s.computable !== false, explanation: s.explanation, reason: s.reason ?? null, audit: s.audit }));

  return json({ university, scoring: systems, programs: shaped, researchLog: log.results });
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
 * (The browser runs the same qualifyAll() itself, so this route is optional.)
 */
async function qualify({ request, env }) {
  const body = await request.json().catch(() => null);
  if (!body) return fail(400, 'Send your marks as { "marks": { "mathematics": 72, ... } }.');

  const { results } = await env.DB.prepare(`${PROGRAM_SELECT} ORDER BY u.name, p.faculty, p.name`).all();
  try {
    return json(qualifyAll(body.marks, results.map(shapeProgram)), { maxAge: 0 });
  } catch (err) {
    if (err instanceof InputError) return fail(400, err.message);
    throw err;
  }
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
 * Email deadline reminders. This endpoint only records consent and the address -
 * the actual sending is a separate job against reminder_optins. See README: "Email reminders".
 */
async function createReminder({ request, env }) {
  const body = await request.json().catch(() => null);
  const email = String((body && body.email) || '').trim().toLowerCase();
  const field = (body && body.field) || null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, 'That does not look like an email address.');
  if (!body.consent) return fail(400, 'We need your okay before we can email you.');

  await env.DB.prepare(
    `INSERT INTO reminder_optins (id, email, field_of_study, consent, created_at)
     VALUES (?, ?, ?, 1, datetime('now'))
     ON CONFLICT(email) DO UPDATE SET field_of_study = excluded.field_of_study, consent = 1`
  ).bind(crypto.randomUUID(), email, field).run();

  return json({ ok: true, message: 'You are on the list. We will email you before bursary deadlines close.' }, { maxAge: 0 });
}

/**
 * "Ask a question that's not in the FAQ". We store the question so a person can answer
 * it and add it to the FAQ. We do not generate an answer automatically: an invented
 * answer about admissions is exactly the harm this product exists to avoid.
 *
 * Contact details are optional. If given, consent must be explicit, and we keep them
 * only so we can reply to that one question.
 */
async function createQuestion({ request, env }) {
  const body = await request.json().catch(() => null);
  if (!body) return fail(400, 'Send your question as { "question": "..." }.');

  // A hidden "website" field that real people never fill in: bots do.
  if (body.website) return json({ ok: true, message: 'Thanks - your question is in.' }, { maxAge: 0 });

  const question = String(body.question || '').replace(/\s+/g, ' ').trim();
  if (question.length < 10) return fail(400, 'Tell us a bit more - a question needs at least 10 characters.');
  if (question.length > 600) return fail(400, 'That is a bit long. Please keep your question under 600 characters.');

  const contact = body.contact ? String(body.contact).trim().slice(0, 120) : null;
  if (contact && !body.consent) return fail(400, 'Tick the box so we know it is okay to use your contact details to reply.');

  // Basic guard against someone pasting an ID number: a question never needs one.
  if (/\b\d{13}\b/.test(question.replace(/\s/g, ''))) {
    return fail(400, 'Please take out any ID number - a question never needs one.');
  }

  await env.DB.prepare(
    `INSERT INTO questions (id, question, contact, consent, page, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'new', datetime('now'))`
  ).bind(crypto.randomUUID(), question, contact, contact ? 1 : 0, String(body.page || '').slice(0, 200) || null).run();

  return json({ ok: true, message: 'Thanks - your question is in. We will add an answer to the FAQ once we have checked it against the official sources.' }, { maxAge: 0 });
}

// ---------------------------------------------------------------------------
// Admin: read and close off the questions people send. Protected by the ADMIN_KEY secret
// (`wrangler secret put ADMIN_KEY`); with no secret set these endpoints do not exist.
// ---------------------------------------------------------------------------

async function sameKey(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const [p, q] = [new Uint8Array(x), new Uint8Array(y)];
  let diff = 0;
  for (let i = 0; i < p.length; i++) diff |= p[i] ^ q[i];
  return diff === 0;
}

async function isAdmin(request, env) {
  if (!env.ADMIN_KEY) return false;
  const given = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  return given.length > 0 && sameKey(given, env.ADMIN_KEY);
}

async function adminListQuestions({ request, env }) {
  if (!env.ADMIN_KEY) return fail(404, 'No such endpoint');
  if (!(await isAdmin(request, env))) return fail(401, 'That key is not right.');
  const { results } = await env.DB.prepare(
    `SELECT id, question, contact, page, status, answer, created_at AS createdAt, answered_at AS answeredAt
     FROM questions ORDER BY CASE status WHEN 'new' THEN 0 ELSE 1 END, created_at DESC LIMIT 500`
  ).all();
  return json({ questions: results }, { maxAge: 0 });
}

async function adminUpdateQuestion({ request, env, params }) {
  if (!env.ADMIN_KEY) return fail(404, 'No such endpoint');
  if (!(await isAdmin(request, env))) return fail(401, 'That key is not right.');
  const body = await request.json().catch(() => null);
  const status = body && body.status;
  if (status !== 'new' && status !== 'answered' && status !== 'ignored') return fail(400, 'status must be new, answered or ignored.');
  const answer = body.answer ? String(body.answer).slice(0, 2000) : null;
  const done = await env.DB.prepare(
    `UPDATE questions SET status = ?, answer = COALESCE(?, answer),
       answered_at = CASE WHEN ? = 'new' THEN NULL ELSE datetime('now') END WHERE id = ?`
  ).bind(status, answer, status, params[0]).run();
  if (!done.meta.changes) return fail(404, 'No such question.');
  return json({ ok: true }, { maxAge: 0 });
}

async function researchLog({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT r.*, u.name AS university_name FROM research_log r
     LEFT JOIN universities u ON u.id = r.university_id
     ORDER BY CASE r.status WHEN 'could_not_verify' THEN 0 WHEN 'partially_verified' THEN 1 WHEN 'todo' THEN 3 ELSE 2 END, r.id`
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
