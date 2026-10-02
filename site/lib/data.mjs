// Loads every dataset and derives what the pages need. Nothing here is typed by hand:
// counts, tables and "which degrees accept Maths Literacy" lists are computed from the
// sourced programme data, so a page can never say something the data does not.

import { universities, DIRECTORY_SOURCES } from '../../db/data/universities.mjs';
import { careers } from '../../db/data/careers.mjs';
import { uctPrograms } from '../../db/data/programs-uct.mjs';
import { witsPrograms } from '../../db/data/programs-wits.mjs';
import { suPrograms } from '../../db/data/programs-su.mjs';
import { upPrograms } from '../../db/data/programs-up.mjs';
import { ukznPrograms } from '../../db/data/programs-ukzn.mjs';
import { otherPrograms } from '../../db/data/programs-other.mjs';
import { researchLog } from '../../db/data/research-log.mjs';
import { contacts, ASK_TOPICS, VERIFICATION_LABELS } from '../../db/data/contacts.mjs';
import { dates, CYCLE, OPEN_DAY_PAGES, APPLICATION_FEES } from '../../db/data/dates.mjs';
import { faq, FAQ_CATEGORIES } from '../../db/data/faq.mjs';
import { GRADE10 } from '../../db/data/grade10.mjs';
import { bursaries } from '../../db/data/bursaries.mjs';
import { SCORING_SYSTEMS, LEVEL_FLOOR } from '../../src/scoring.js';
import { shapeProgram } from '../../src/shape.js';

export { SCORING_SYSTEMS, ASK_TOPICS, VERIFICATION_LABELS, CYCLE, FAQ_CATEGORIES, GRADE10, DIRECTORY_SOURCES, OPEN_DAY_PAGES };

/** Human-readable version of one requirement item. */
export function requirementText(req) {
  if (req.label) return req.label + (req.note ? ` – ${req.note}` : '');
  if (req.any_of) return req.any_of.map(requirementText).join(' OR ');
  if (req.all_of) return req.all_of.map(requirementText).join(' AND ');
  if (req.subject === 'English' && (req.hl_min_percent != null || req.hl_min_level != null)) {
    const hl = req.hl_min_percent != null ? `${req.hl_min_percent}%` : `level ${req.hl_min_level}`;
    const fal = req.fal_min_percent != null ? `${req.fal_min_percent}%` : `level ${req.fal_min_level}`;
    return `English: ${hl} if it is your Home Language, ${fal} if it is your First Additional Language`;
  }
  if (req.min_percent != null) return `${req.subject}: ${req.min_percent}%`;
  if (req.min_level != null) return `${req.subject}: level ${req.min_level} (${LEVEL_FLOOR[req.min_level]}% or more)`;
  return req.subject || '';
}

const facultyGroup = (faculty = '') => {
  const f = faculty.toLowerCase();
  if (/engineer|built/.test(f)) return 'Engineering & built environment';
  if (/health|medicine/.test(f)) return 'Health sciences';
  if (/commerce|econom|management|business|financial/.test(f)) return 'Commerce & business';
  if (/science|agric/.test(f)) return 'Science';
  if (/law/.test(f)) return 'Law';
  return 'Humanities, education & arts';
};

/** Does this programme's Maths rule allow Mathematical Literacy? */
function mathsRule(program) {
  const reqs = program.subjectRequirements || [];
  let needsMaths = false;
  let allowsLit = false;
  const walk = (r, inAny) => {
    if (!r) return;
    if (r.any_of) return r.any_of.forEach((x) => walk(x, true));
    if (r.all_of) return r.all_of.forEach((x) => walk(x, inAny));
    if (r.label || r.not_computable) return;
    if (r.subject === 'Mathematical Literacy') allowsLit = true;
    if (r.subject === 'Mathematics' && !inAny) needsMaths = true;
  };
  reqs.forEach((r) => walk(r, false));
  if (allowsLit) return 'accepts-lit';
  if (needsMaths) return 'needs-maths';
  // A Maths rule only inside an "or" with a non-Lit alternative (e.g. Technical Maths) is still a Maths rule.
  const flat = JSON.stringify(reqs);
  return /"subject":"Mathematics"/.test(flat) ? 'needs-maths' : 'none-captured';
}

export function loadData() {
  const uniById = Object.fromEntries(universities.map((u) => [u.id, u]));
  const careerById = Object.fromEntries(careers.map((c) => [c.id, c]));
  const rawPrograms = [...uctPrograms, ...witsPrograms, ...suPrograms, ...upPrograms, ...ukznPrograms, ...otherPrograms];

  const programs = rawPrograms.map((p) => shapeProgram({
    ...p,
    university_name: uniById[p.university_id].name,
    university_short_name: uniById[p.university_id].short_name,
    university_website: uniById[p.university_id].website,
    career_name: p.career_id ? careerById[p.career_id].name : null,
    verified_at: null,
  }));

  const withReqIds = new Set(programs.map((p) => p.university.id));
  const unis = universities.map((u) => ({
    ...u,
    hasRequirements: withReqIds.has(u.id),
    programCount: programs.filter((p) => p.university.id === u.id).length,
  }));

  const contactsByUni = {};
  for (const c of contacts) (contactsByUni[c.university_id] ||= []).push(c);
  const datesByUni = {};
  for (const d of dates) if (d.university_id) (datesByUni[d.university_id] ||= []).push(d);

  const flagCounts = {};
  for (const p of programs) for (const f of p.flags) flagCounts[f.id] = (flagCounts[f.id] || 0) + 1;

  // ---- Grade 10 facts, computed from the programmes ----
  const rules = programs.map((p) => ({ p, rule: mathsRule(p), group: facultyGroup(p.faculty) }));
  const mathsByGroup = {};
  for (const { rule, group } of rules) {
    const g = (mathsByGroup[group] ||= { total: 0, 'needs-maths': 0, 'accepts-lit': 0, 'none-captured': 0 });
    g.total++; g[rule]++;
  }
  const mathsTotals = { total: rules.length, 'needs-maths': 0, 'accepts-lit': 0, 'none-captured': 0 };
  for (const { rule } of rules) mathsTotals[rule]++;

  const engineeringCareers = new Set(['civil-engineer', 'electrical-engineer', 'mechanical-engineer', 'chemical-engineer', 'industrial-engineer', 'mining-engineer', 'aeronautical-engineer', 'biomedical-engineer', 'agricultural-engineer']);
  const grade10 = {
    mathsTotals,
    mathsByGroup,
    acceptsLit: rules.filter((r) => r.rule === 'accepts-lit').map((r) => r.p),
    medicine: programs.filter((p) => p.career && p.career.id === 'doctor'),
    engineering: programs.filter((p) => p.career && engineeringCareers.has(p.career.id)),
  };

  return {
    universities: unis, uniById, careers, careerById, programs, researchLog, contacts, contactsByUni,
    dates, datesByUni, fees: APPLICATION_FEES, faq, bursaries, flagCounts, grade10,
    stats: {
      programs: programs.length,
      universities: unis.length,
      universitiesWithData: unis.filter((u) => u.hasRequirements).length,
      careers: careers.length,
    },
  };
}
