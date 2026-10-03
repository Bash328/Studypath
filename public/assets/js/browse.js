// "What can I get into with my APS?" - a lighter, faster alternative to the full marks
// calculator. You pick a university and type the single score IT gave you (its own APS,
// FPS, AS ...), and we show which of its degrees you're in range for, grouped by field.
// This checks points only, not subject requirements - the page says so up front.

import { $, el, set, store, track, sourceLine } from './core.js';
import { SCORING_SYSTEMS } from './engine/scoring.js';

const root = $('#browse');
const KEY_UNI = 'studypath.browse.uni';
const KEY_SCORES = 'studypath.browse.scores';

let programs = [];
let universities = [];
let state = {
  uniId: store.get(KEY_UNI, null),
  scores: store.get(KEY_SCORES, {}), // { scoringSystemId: number }
  showResults: false,
};

// Mirrors the grouping in site/lib/data.mjs#facultyGroup, kept in sync by hand since one
// runs server-side at build time and this runs in the browser - see that file first if
// degrees start showing up in the wrong group.
function facultyGroup(faculty = '') {
  const f = faculty.toLowerCase();
  if (/engineer|built/.test(f)) return 'Engineering & built environment';
  if (/health|medicine/.test(f)) return 'Health sciences';
  if (/commerce|econom|management|business|financial/.test(f)) return 'Commerce & business';
  if (/science|agric/.test(f)) return 'Science';
  if (/law/.test(f)) return 'Law';
  return 'Humanities, education & arts';
}

const TYPE_ORDER = ['Traditional', 'Traditional (health)', 'Comprehensive', 'University of Technology', 'Comprehensive (distance)'];
const typeRank = (t) => { const i = TYPE_ORDER.indexOf(t); return i === -1 ? TYPE_ORDER.length : i; };
const byTypeOrder = (a, b) => typeRank(a) - typeRank(b);

function saveUni(id) { state.uniId = id; store.set(KEY_UNI, id); }
function saveScores() { store.set(KEY_SCORES, state.scores); }

// ---------------------------------------------------------------- Step 1: university
function renderUniPicker() {
  const withData = universities.filter((u) => u.hasRequirements).sort((a, b) => a.name.localeCompare(b.name));
  const groups = {};
  for (const u of withData) (groups[u.type || 'Other'] ||= []).push(u);
  const types = Object.keys(groups).sort(byTypeOrder);

  const body = el('div', {},
    el('p', {}, 'Which university gave you this score?'),
    ...types.map((type) => el('div', { class: 'subj-group' },
      el('h3', {}, type),
      el('div', { class: 'subj-chips' }, groups[type].map((u) =>
        el('button', {
          type: 'button', class: 'subj', 'aria-pressed': state.uniId === u.id ? 'true' : 'false',
          onclick: () => { saveUni(u.id); state.scores = {}; saveScores(); render(); },
        }, u.name))))));

  set(root, body);
}

// ---------------------------------------------------------------- Step 2: score(s)
function systemsForUni(uniId) {
  const ids = [...new Set(programs.filter((p) => p.university.id === uniId).map((p) => p.scoringSystem))];
  return ids.map((id) => ({ id, ...SCORING_SYSTEMS[id] })).filter((s) => s.label);
}

function renderScoreEntry() {
  const uni = universities.find((u) => u.id === state.uniId);
  if (!uni) { saveUni(null); return renderUniPicker(); }
  const systems = systemsForUni(state.uniId);
  const computable = systems.filter((s) => s.computable !== false);
  const notComputable = systems.filter((s) => s.computable === false);

  const inputs = computable.map((s) => el('div', { class: 'mark-row' },
    el('label', { for: `score-${s.id}` }, s.label, s.unit ? el('span', { class: 'muted' }, ` (${s.unit})`) : null),
    el('input', {
      type: 'number', inputmode: 'decimal', id: `score-${s.id}`, min: '0', step: 'any',
      value: state.scores[s.id] ?? '',
      oninput: (e) => { state.scores[s.id] = e.target.value === '' ? undefined : Number(e.target.value); saveScores(); },
    })));

  const body = el('div', {},
    el('p', {}, el('button', { type: 'button', class: 'btn btn--ghost', onclick: () => { saveUni(null); render(); } }, '← Change university')),
    el('h3', {}, uni.name),
    inputs.length ? el('div', { class: 'stack' }, inputs) : el('p', { class: 'muted' }, 'We don’t calculate a score for this university yet.'),
    notComputable.length ? el('p', { class: 'small muted' },
      `We also don’t calculate ${notComputable.map((s) => s.label).join(' or ')} here - its degrees will show with their published minimum only, for you to compare by hand.`) : null,
    el('div', { class: 'btn-row' },
      el('button', {
        class: 'btn btn--primary btn--big', type: 'button',
        disabled: computable.length && !computable.some((s) => state.scores[s.id] != null && state.scores[s.id] !== '') ? true : null,
        onclick: () => { state.showResults = true; track('browse_run', { university: state.uniId }); render(); },
      }, 'Show me what I can get into →')));

  set(root, body);
}

// ---------------------------------------------------------------- Step 3: results
function statusFor(program) {
  const sys = SCORING_SYSTEMS[program.scoringSystem];
  if (!sys || sys.computable === false) return { tone: 'unknown', label: 'Check by hand' };
  if (program.minScore == null) return { tone: 'unknown', label: 'No cut-off published' };
  const score = state.scores[program.scoringSystem];
  if (score == null || score === '') return { tone: 'unknown', label: 'Enter your score above' };
  if (score >= program.minScore) return { tone: 'good', label: 'In range' };
  const gap = Math.round((program.minScore - score) * 10) / 10;
  if (sys.nearMargin && gap <= sys.nearMargin) return { tone: 'nearly', label: `${gap} short` };
  return { tone: 'no', label: `${gap} short` };
}

function resultRow(program) {
  const status = statusFor(program);
  const bits = [program.faculty, program.durationYears ? `${program.durationYears} years` : null].filter(Boolean).join(' · ');
  return el('div', { class: 'prow' },
    program.flags.length ? el('div', { class: 'badge-row' }, program.flags.map((f) =>
      el('span', { class: `badge badge--${f.tone === 'warn' ? 'warn' : 'info'}` }, f.label))) : null,
    el('div', { class: 'prow__head' },
      el('h4', { class: 'prow__name' }, program.name, ' ', el('span', { class: `pill pill--${status.tone === 'good' ? 'good' : status.tone === 'nearly' ? 'nearly' : status.tone === 'no' ? 'warn' : 'unknown'}` }, status.label)),
      el('p', { class: 'prow__meta' }, bits)),
    el('p', { class: 'prow__line muted' }, program.minScore != null
      ? `Needs ${program.minScore}${SCORING_SYSTEMS[program.scoringSystem] ? ` ${SCORING_SYSTEMS[program.scoringSystem].unit || ''}` : ''}`
      : 'No points cut-off published for this one.'),
    program.notes ? el('p', { class: 'small muted' }, program.notes) : null,
    sourceLine(program.sourceUrl, program.intakeYear ? `${program.intakeYear} intake` : null));
}

function renderResults() {
  const list = programs.filter((p) => p.university.id === state.uniId);
  const withStatus = list.map((p) => ({ p, status: statusFor(p) }));
  const inRange = withStatus.filter((x) => x.status.tone === 'good');
  const nearly = withStatus.filter((x) => x.status.tone === 'nearly');
  const rest = withStatus.filter((x) => x.status.tone !== 'good' && x.status.tone !== 'nearly');

  const grouped = (items) => {
    const byGroup = {};
    for (const { p } of items) (byGroup[facultyGroup(p.faculty)] ||= []).push(p);
    return Object.entries(byGroup).sort((a, b) => b[1].length - a[1].length);
  };

  const section = (title, items, open) => {
    if (!items.length) return null;
    const groups = grouped(items);
    const inner = groups.map(([group, progs]) => el('div', { class: 'group' },
      el('h4', {}, `${group} (${progs.length})`),
      progs.map(resultRow)));
    const heading = el('h3', {}, `${title} (${items.length})`);
    return open
      ? el('div', { class: 'group' }, heading, inner)
      : el('details', { class: 'group group--collapsible' }, el('summary', {}, heading), inner);
  };

  const body = el('div', {},
    el('p', {}, el('button', { type: 'button', class: 'btn btn--ghost', onclick: () => { state.showResults = false; render(); } }, '← Change your score')),
    section('In range', inRange, true),
    section('Nearly', nearly, true),
    section('Everything else', rest, false),
    !inRange.length && !nearly.length ? el('p', { class: 'muted' }, 'Nothing in range yet with that score - check "Everything else" below to see how close you are.') : null);

  set(root, body);
}

function render() {
  if (!state.uniId) return renderUniPicker();
  if (!state.showResults) return renderScoreEntry();
  return renderResults();
}

async function init() {
  try {
    const [progData, uniData] = await Promise.all([
      fetch(root.dataset.src).then((r) => r.json()),
      fetch(root.dataset.unis).then((r) => r.json()),
    ]);
    programs = progData.programs;
    universities = uniData.universities;
    render();
  } catch {
    set(root, el('div', { class: 'callout callout--warn' }, el('p', {}, 'Could not load the degree data. Please try again.')));
  }
}

init();
