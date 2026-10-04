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
// wits-bas-architecture's old APS conflict was resolved in a 2026-10-01 follow-up pass
// (see research-log.mjs) - wits-bsc-maths is the remaining genuine conflict to test against.
r = await get('/api/programs/wits-bsc-maths');
ok('conflict programme carries the conflict flag', r.b.program.flags.some(f => f.id === 'conflict') && r.b.program.minScore === 44);
r = await get('/api/programs/uct-mbchb');
ok('selection flag split out, note text clean', r.b.program.flags[0].id === 'selection' && !r.b.program.notes.startsWith('['));
r = await get('/api/universities');
ok('universities list', r.b.universities.length === universities.length && r.b.universities.filter(u => u.programCount > 0).length === new Set(ALL.map(p => p.university_id)).size);
r = await get('/api/careers?sector=Health');
ok('careers?sector=Health', r.b.careers.length > 10 && r.b.careers.every(c => c.sector === 'Health'));
r = await get('/api/careers?q=engineer');
ok('careers?q=engineer', r.b.careers.length >= 8);
r = await get('/api/coverage');
// conflict count rose from 2 to 5 in a 2026-10-01 research pass that brought UJ, UWC, RU,
// NWU and UFS above the 15-programme floor (see research-log.mjs) - mut-dip-it and
// wits-bsc-maths were already there; uj-social-work, a UWC nursing entry and an NWU BEd
// Foundation Phase entry are the three new genuine conflicts disclosed by that pass.
// Rose again from 5 to 7 in a later 2026-10-01 UCT/UJ/UFS/Wits/UKZN research pass: a
// Wits LLB spot-check found the 2027 course-finder's Mathematics level (5) disagrees
// with the 2026 schools-liaison guide's (4), and a UKZN BSc Computer Science & IT
// spot-check found its own school page's English/Life Orientation levels (5) disagree
// with the 2026 Study@UKZN brochure's (4) - both shown rather than silently resolved.
// Dropped from 7 to 6 on 2026-10-02: the user screenshotted UJ's live Bachelor of Social
// Work page, settling the 31-vs-31.5 conflict between two indexed copies of that page in
// favour of 31 - a genuine resolution, not a dropped disclosure.
// Dropped from 6 to 5 on 2026-10-02: the user supplied UWC's own 2027 General Admissions
// Criteria brochure, a third independent UWC source confirming Nursing's lower APS/subject
// figure over a second source's higher one - another genuine resolution.
// Dropped from 5 to 4 on 2026-10-03: the user supplied NWU's current 2026 Faculty of
// Education Yearbook, which itself lists BEd Foundation Phase/Early Childhood Care and
// Education as a live, active programme at the APS/duration already shown - resolving the
// conflict against an older yearbook PDF that described a phase-out not reflected in this
// current document. A genuine resolution, not a dropped disclosure.
// Rose from 4 to 5 later on 2026-10-03: two more user-supplied MUT documents resolved the
// old best-five-vs-best-six APS formula conflict (MUT_APS is now computable, see
// scripts/test-scoring.mjs), but cross-checking those same documents against MUT's existing
// rows surfaced two NEW, narrower conflicts - the IT diploma's exact APS total (24 vs 25)
// and BSc Environmental Health's duration (4 vs 3 years) - net +2-1 = +1 overall.
ok('coverage has flag counts', r.b.flagCounts.selection > 20 && r.b.flagCounts.conflict >= 5, JSON.stringify(r.b.flagCounts));
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
// Order includes 3 verified entries added in a 2026-10-01 pass (Eskom, FirstRand
// Empowerment Foundation/StudyTrust, Vodacom) and 6 more added 2026-10-02 (Funza Lushaka,
// Harmony Gold, Implats, Nedbank, GCRA, Masakh'iSizwe) - see research-log.mjs - all slotted
// in by deadline (null-deadline rows keep insertion order, which is why saica-thuthuka-2027
// comes before the later-added null-deadline rows, which come before the test's own b3 row).
ok('bursaries: soonest first, undated last, inactive hidden',
  r.b.bursaries.map(b => b.id).join() === 'allan-gray-orbis-2027,sasol-mainstream-2027,sasol-foundation-2027,vodacom-external-2027,eskom-bursary-2027,firstrand-empowerment-2027,investec-tertiary-2027,harmony-gold-2027,b2,nsfas-2027,b1,funza-lushaka-2027,saica-thuthuka-2027,implats-bursary-2027,nedbank-external-2027,gcra-gauteng-bursary,masakhisizwe-2027,b3',
  r.b.bursaries.map(b=>b.id).join());
r = await get('/api/bursaries?field=Engineering');
// harmony-gold-2027 matches via a lowercase "engineering" in its field_of_study text - SQLite's
// LIKE is case-insensitive for ASCII, which is also why this filter was already case-insensitive
// before this pass.
ok('bursaries field filter', r.b.bursaries.map(b => b.id).join() === 'sasol-mainstream-2027,vodacom-external-2027,eskom-bursary-2027,firstrand-empowerment-2027,harmony-gold-2027,b2,b1,implats-bursary-2027,nedbank-external-2027,masakhisizwe-2027', r.b.bursaries.map(b=>b.id).join());

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
