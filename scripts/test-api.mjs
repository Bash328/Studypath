// Exercises the Worker's routes against a stub D1 built from the real dataset, so we
// catch routing, shaping and serialisation bugs without needing Cloudflare auth.
//   node scripts/test-api.mjs

import worker from '../src/index.js';
import { createRealDb } from './d1-shim.mjs';
import { universities } from '../db/data/universities.mjs';
import { careers } from '../db/data/careers.mjs';
import { uctPrograms } from '../db/data/programs-uct.mjs';
import { witsPrograms } from '../db/data/programs-wits.mjs';
import { suPrograms } from '../db/data/programs-su.mjs';
import { upPrograms } from '../db/data/programs-up.mjs';
import { ukznPrograms } from '../db/data/programs-ukzn.mjs';
import { otherPrograms } from '../db/data/programs-other.mjs';
import { researchLog } from '../db/data/research-log.mjs';

const programs = [...uctPrograms, ...witsPrograms, ...suPrograms, ...upPrograms, ...ukznPrograms, ...otherPrograms];
const uniById = Object.fromEntries(universities.map((u) => [u.id, u]));
const careerById = Object.fromEntries(careers.map((c) => [c.id, c]));

/** A programme as the PROGRAM_SELECT join would return it. */
const joined = (p) => ({
  ...p,
  subject_requirements: JSON.stringify(p.subject_requirements ?? []),
  duration_years: p.duration_years ?? null,
  min_aps: p.min_aps ?? null,
  notes: p.notes || null,
  university_name: uniById[p.university_id].name,
  university_short_name: uniById[p.university_id].short_name,
  university_website: uniById[p.university_id].website,
  career_name: p.career_id ? careerById[p.career_id].name : null,
});

/**
 * Minimal D1 stub. It doesn't parse SQL - it matches on the distinctive fragments the
 * handlers use and returns the right shape, which is enough to catch the bugs that
 * actually happen here (wrong field names, bad JSON, unhandled nulls).
 */
const STUB_DB = {
  prepare(sql) {
    const binds = [];
    const self = {
      bind: (...args) => { binds.push(...args); return self; },
      all: async () => ({ results: rowsFor(sql, binds) }),
      first: async () => rowsFor(sql, binds)[0] ?? null,
      run: async () => ({ success: true }),
    };
    return self;
  },
};

// --real runs the Worker's actual SQL against SQLite loaded with the real seed.
// (A flag rather than an env var so `npm test` also works in Windows cmd.)
const REAL = process.argv.includes('--real');
const DB = REAL ? createRealDb() : STUB_DB;
console.log(REAL ? 'Using real SQLite + db/seed.sql' : 'Using the stub DB');

function rowsFor(sql, binds) {
  const s = sql.replace(/\s+/g, ' ');
  // Check the stats query first: it mentions several tables inside subqueries and would
  // otherwise be caught by one of the single-table branches below.
  if (s.includes('AS programs,')) {
    return [{ programs: programs.length, universities: universities.length, careers: careers.length, openGaps: researchLog.filter((r) => r.status === 'could_not_verify').length }];
  }
  if (s.includes('FROM programs p')) {
    let list = programs.map(joined);
    if (s.includes('p.career_id = ?')) list = list.filter((p) => p.career_id === binds[0]);
    if (s.includes('p.university_id = ?')) list = list.filter((p) => p.university_id === binds[0]);
    if (s.includes('p.id = ?')) list = list.filter((p) => p.id === binds[0]);
    return list;
  }
  if (s.includes('FROM careers c')) {
    return careers.map((c) => ({ ...c, typical_subjects: JSON.stringify(c.typical_subjects), programCount: programs.filter((p) => p.career_id === c.id).length, universityCount: 1 }));
  }
  if (s.startsWith('SELECT * FROM careers WHERE id = ?')) {
    const c = careerById[binds[0]];
    return c ? [{ ...c, typical_subjects: JSON.stringify(c.typical_subjects) }] : [];
  }
  if (s.includes('FROM universities u LEFT JOIN programs p')) {
    return universities.map((u) => ({
      id: u.id, name: u.name, shortName: u.short_name, website: u.website,
      programCount: programs.filter((p) => p.university_id === u.id).length,
      programs: programs.filter((p) => p.university_id === u.id).length,
      withoutScore: programs.filter((p) => p.university_id === u.id && p.min_aps == null).length,
      facultyCount: 3,
    }));
  }
  if (s.includes('FROM universities WHERE id = ?')) {
    const u = uniById[binds[0]];
    return u ? [{ id: u.id, name: u.name, shortName: u.short_name, website: u.website }] : [];
  }
  if (s.includes('FROM research_log')) {
    let list = researchLog.map((r) => ({ ...r, university_name: r.university_id ? (uniById[r.university_id] || {}).name ?? null : null }));
    if (s.includes('university_id = ?')) list = list.filter((r) => r.university_id === binds[0]);
    return list;
  }
  if (s.includes('FROM programs WHERE notes LIKE')) {
    return programs.filter((p) => (p.notes || '').startsWith('[')).map((p) => ({ notes: p.notes }));
  }
  if (s.includes('FROM bursaries')) return [];
  if (s.includes('SELECT sector')) return [...new Set(careers.map((c) => c.sector))].map((sector) => ({ sector, n: 1 }));
  return [];
}

let failures = 0;
const ok = (name, condition, detail = '') => {
  if (condition) console.log(`  ok   ${name}`);
  else { failures++; console.error(`  FAIL ${name} ${detail}`); }
};

const call = async (path, init) => {
  const res = await worker.fetch(new Request(`https://studypath.test${path}`, init), { DB, ASSETS: { fetch: async () => new Response('asset') } }, {});
  return { res, body: await res.json().catch(() => null) };
};

console.log('\nRoutes');
{
  const { res, body } = await call('/api/meta');
  ok('GET /api/meta is 200', res.status === 200);
  ok('meta reports every programme', body.stats.programs === programs.length, `got ${body.stats && body.stats.programs}`);
  ok('meta lists all scoring systems', body.scoringSystems.length === 12, `got ${body.scoringSystems.length}`);
  ok('meta: only the Wits Composite Index is left uncomputed', body.scoringSystems.filter((s) => !s.computable).length === 1);
  ok('meta carries an audit record for every system', body.scoringSystems.every((s) => s.audit && s.audit.status && s.audit.sources.length > 0));
}
{
  const { res, body } = await call('/api/subjects');
  ok('GET /api/subjects is 200', res.status === 200 && body.subjects.length > 25);
}
{
  const { res, body } = await call('/api/careers/doctor');
  ok('GET /api/careers/doctor is 200', res.status === 200);
  ok('doctor has programmes at several universities', body.programs.length >= 5, `got ${body.programs.length}`);
  ok('every programme carries a source link', body.programs.every((p) => /^https:\/\//.test(p.sourceUrl)));
  ok('flags are split out of the notes text', body.programs.some((p) => p.flags.length) &&
     body.programs.every((p) => !p.notes.startsWith('[')));
}
{
  const { res, body } = await call('/api/universities/wits');
  ok('GET /api/universities/wits is 200', res.status === 200);
  ok('wits detail includes its research-log gaps', body.researchLog.length > 0);
}
{
  const { res } = await call('/api/careers/not-a-real-career');
  ok('unknown career is a 404', res.status === 404);
}
{
  const { res } = await call('/api/nonsense');
  ok('unknown route is a 404', res.status === 404);
}

console.log('\nThe calculator');
{
  const marks = { 'english-hl': 78, mathematics: 82, 'physical-sciences': 76, 'life-sciences': 71, accounting: 68, geography: 74, 'life-orientation': 85 };
  const { res, body } = await call('/api/qualify', { method: 'POST', body: JSON.stringify({ marks }) });
  ok('POST /api/qualify is 200', res.status === 200);
  ok('results are grouped per university', body.universities.length === 10, `got ${body.universities.length}`);
  ok('the non-comparability warning is in the payload', /NOT comparable/.test(body.warning));

  const wits = body.universities.find((u) => u.university.id === 'wits');
  ok('Wits returns BOTH of its scoring systems', wits.scores.length === 2,
     `got ${wits.scores.map((s) => s.id).join(', ')}`);
  ok('Wits APS is computed', wits.scores.find((s) => s.id === 'WITS_APS_incLO').value === 43);
  ok('Wits Composite Index is refused, with a reason',
     wits.scores.find((s) => s.id === 'WITS_COMPOSITE_INDEX').computable === false);

  const ukzn = body.universities.find((u) => u.university.id === 'ukzn');
  ok('UKZN now produces a verified score (36/48)', ukzn.scores.length === 1 && ukzn.scores[0].value === 36, JSON.stringify(ukzn.scores));
  ok('UKZN programmes are judged on that score', ukzn.qualifies.length + ukzn.marksOk.length + ukzn.close.length + ukzn.notYet.length > 0);

  const su = body.universities.find((u) => u.university.id === 'su');
  ok('Stellenbosch adds its published selection scores', su.selectionScores.length === 2);

  const everyEntry = body.universities.flatMap((u) => [...u.qualifies, ...u.marksOk, ...u.close, ...u.notYet, ...u.cannotTell]);
  ok('every programme lands in exactly one bucket', everyEntry.length === programs.length, `got ${everyEntry.length}`);
  ok('every result knows which scoring system judged it', everyEntry.every((e) => 'scoreId' in e));
  ok('somebody qualifies for something', body.universities.some((u) => u.qualifies.length > 0));
  ok('programmes needing an NBT/portfolio are not counted as plain qualifies',
     body.universities.flatMap((u) => u.qualifies).every((e) => e.manual.length === 0));
  ok('...they land in marksOk instead', body.universities.flatMap((u) => u.marksOk).length > 0 &&
     body.universities.flatMap((u) => u.marksOk).every((e) => e.manual.length > 0));
}
{
  const { res, body } = await call('/api/qualify', { method: 'POST', body: JSON.stringify({ marks: { mathematics: 80 } }) });
  ok('too few subjects is a friendly 400', res.status === 400 && /at least 4/.test(body.error));
}
{
  const { res } = await call('/api/qualify', { method: 'POST', body: JSON.stringify({}) });
  ok('missing marks is a 400', res.status === 400);
}
{
  const { res } = await call('/api/qualify', { method: 'GET' });
  ok('GET on a POST route is a 405', res.status === 405);
}

console.log('\nReminder opt-in');
{
  const { res, body } = await call('/api/reminders', { method: 'POST', body: JSON.stringify({ phone: '0821234567', consent: true }) });
  ok('valid sign-up is accepted', res.status === 200 && body.ok === true);
}
{
  const { res } = await call('/api/reminders', { method: 'POST', body: JSON.stringify({ phone: '0821234567', consent: false }) });
  ok('sign-up without consent is refused', res.status === 400);
}
{
  const { res } = await call('/api/reminders', { method: 'POST', body: JSON.stringify({ phone: 'nope', consent: true }) });
  ok('a bad phone number is refused', res.status === 400);
}

console.log('\nStatic assets fall through to the assets binding');
{
  const res = await worker.fetch(new Request('https://studypath.test/careers.html'), { DB, ASSETS: { fetch: async () => new Response('asset', { status: 200 }) } }, {});
  ok('non-API paths are served by ASSETS', res.status === 200 && (await res.text()) === 'asset');
}

console.log(failures ? `\n${failures} FAILURE(S)\n` : '\nAll API checks passed.\n');
process.exit(failures ? 1 : 0);
