// Endpoint checks that run the Worker's real SQL against SQLite loaded with the real seed.
//   node scripts/test-sql.mjs

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
const ALL = [...uctPrograms, ...witsPrograms, ...suPrograms, ...upPrograms, ...ukznPrograms, ...otherPrograms];
const DB = createRealDb();
const env = { DB, ASSETS: { fetch: async () => new Response('x') } };
const get = async (p, init) => { const r = await worker.fetch(new Request('https://t.test' + p, init), env, {}); return { s: r.status, b: await r.json().catch(() => null) }; };

let bad = 0; const ok = (n, c, d='') => { console.log((c ? '  ok   ' : '  FAIL ') + n + (c ? '' : ' ' + d)); if (!c) bad++; };

let r = await get('/api/programs?university=uct');
ok('programs?university=uct', r.s === 200 && r.b.programs.length === uctPrograms.length && r.b.programs.every(p => p.university.id === 'uct'), JSON.stringify(r.b).slice(0,200));
r = await get('/api/programs?q=nursing');
ok('programs?q=nursing finds nursing degrees', r.s === 200 && r.b.programs.length >= 4, r.b.programs && r.b.programs.length);
r = await get('/api/programs?career=doctor&university=su');
ok('combined filters', r.b.programs.length === 1 && r.b.programs[0].id === 'su-mbchb');
r = await get('/api/programs/wits-bas-architecture');
ok('conflict programme carries the conflict flag', r.b.program.flags.some(f => f.id === 'conflict') && r.b.program.minScore === null);
r = await get('/api/programs/uct-mbchb');
ok('selection flag split out, note text clean', r.b.program.flags[0].id === 'selection' && !r.b.program.notes.startsWith('['));
r = await get('/api/universities');
ok('universities list', r.b.universities.length === universities.length && r.b.universities.filter(u => u.programCount > 0).length === new Set(ALL.map(p => p.university_id)).size);
r = await get('/api/careers?sector=Health');
ok('careers?sector=Health', r.b.careers.length > 10 && r.b.careers.every(c => c.sector === 'Health'));
r = await get('/api/careers?q=engineer');
ok('careers?q=engineer', r.b.careers.length >= 8);
r = await get('/api/coverage');
ok('coverage has flag counts', r.b.flagCounts.selection > 20 && r.b.flagCounts.conflict === 3, JSON.stringify(r.b.flagCounts));
r = await get('/api/research-log');
ok('research-log: open gaps sorted first', r.b.entries[0].status === 'could_not_verify' && r.b.entries.at(-1).status === 'verified');
r = await get('/api/meta');
ok('meta stats', r.b.stats.programs === ALL.length && r.b.stats.careers === careers.length && r.b.universities.length === universities.length, JSON.stringify(r.b.stats));

// bursaries: sort by deadline, nulls last, inactive hidden, field filter
DB.raw.exec(`INSERT INTO bursaries (id,name,provider,field_of_study,deadline,apply_url,source_url,active) VALUES
 ('b1','Late one','P','Engineering','2026-11-30','https://a.ac.za','https://a.ac.za',1),
 ('b2','Soon one','P','Engineering, Science','2026-10-15','https://b.ac.za','https://b.ac.za',1),
 ('b3','No date','P','Law',NULL,'https://c.ac.za','https://c.ac.za',1),
 ('b4','Inactive','P','Engineering','2026-10-01','https://d.ac.za','https://d.ac.za',0)`);
r = await get('/api/bursaries');
ok('bursaries: soonest first, undated last, inactive hidden',
  r.b.bursaries.map(b => b.id).join() === 'allan-gray-orbis-2027,sasol-mainstream-2027,sasol-foundation-2027,investec-tertiary-2027,b2,nsfas-2027,b1,saica-thuthuka-2027,b3',
  r.b.bursaries.map(b=>b.id).join());
r = await get('/api/bursaries?field=Engineering');
ok('bursaries field filter', r.b.bursaries.map(b => b.id).join() === 'sasol-mainstream-2027,b2,b1', r.b.bursaries.map(b=>b.id).join());

// reminders: stored, and a second sign-up for the same address updates rather than errors
const post = (body) => get('/api/reminders', { method: 'POST', body: JSON.stringify(body) });
r = await post({ email: 'Learner@Example.com', field: 'Nursing', consent: true });
ok('reminder stored', r.s === 200);
r = await post({ email: 'learner@example.com', field: 'Law', consent: true });
ok('same address again is an upsert, not an error', r.s === 200);
const rows = DB.raw.prepare('SELECT email, field_of_study FROM reminder_optins').all();
ok('one row, latest field wins', rows.length === 1 && rows[0].field_of_study === 'Law', JSON.stringify(rows));

console.log(bad ? `\n${bad} FAILURE(S)\n` : '\nAll SQL endpoint checks passed.\n');
process.exit(bad ? 1 : 0);
