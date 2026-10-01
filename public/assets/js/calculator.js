// The calculator. Runs entirely in the browser using the same engine the Worker uses
// (assets/js/engine/*, copied from src/ at build time), so marks never have to leave
// this device and the two can never disagree.

import { $, el, clear, getJson, store, track, sourceLine, plural } from './core.js';
import { SUBJECTS } from './engine/subjects.js';
import { qualifyAll, InputError } from './engine/qualify-core.js';

const $$ = (sel, r = document) => [...r.querySelectorAll(sel)];

const KEY_SUBJECTS = 'studypath.subjects';
const KEY_MARKS = 'studypath.marks';
const STARTER = ['english-hl', 'mathematics', 'life-orientation', 'physical-sciences'];
const SUBJECT_BY_ID = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));

const root = $('#calc');
const steps = $('#steps');
let state = {
  step: 1,
  subjects: store.get(KEY_SUBJECTS, STARTER).filter((id) => SUBJECT_BY_ID[id]),
  marks: store.get(KEY_MARKS, {}),
  resultFilter: null,
  data: null, // { universities } from qualifyAll, once run
};

const setStep = (n) => {
  state.step = n;
  $$('.steps__i', steps).forEach((li) => {
    const i = Number(li.dataset.step);
    li.classList.toggle('is-current', i === n);
    li.classList.toggle('is-done', i < n);
  });
  render();
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function saveSubjects() { store.set(KEY_SUBJECTS, state.subjects); }
function saveMarks() { store.set(KEY_MARKS, state.marks); }

// ---------------------------------------------------------------- Step 1: subjects
function renderSubjectPicker() {
  const groups = {};
  for (const s of SUBJECTS) (groups[s.group] ||= []).push(s);

  const body = el('div', {},
    el('p', {}, 'Tap every subject you take, including Life Orientation – we handle whether each university counts it.'),
    ...Object.entries(groups).map(([group, list]) => el('div', { class: 'subj-group' },
      el('h3', {}, group),
      el('div', { class: 'subj-chips' }, list.map((s) =>
        el('button', {
          type: 'button', class: 'subj', 'aria-pressed': state.subjects.includes(s.id) ? 'true' : 'false',
          onclick: (e) => {
            const on = e.currentTarget.getAttribute('aria-pressed') === 'true';
            if (on) state.subjects = state.subjects.filter((id) => id !== s.id);
            else state.subjects = [...state.subjects, s.id];
            saveSubjects();
            renderSubjectPicker();
          },
        }, s.name)))))
  );

  const count = state.subjects.length;
  const footer = el('div', {},
    el('p', { class: 'pickcount' }, count < 4
      ? `Pick at least ${4 - count} more subject${4 - count === 1 ? '' : 's'} (${count} so far)`
      : `${plural(count, 'subject', 'subjects')} picked – nice.`),
    el('div', { class: 'btn-row' },
      el('button', { class: 'btn btn--primary btn--big', type: 'button', disabled: count < 4 || null, onclick: () => setStep(2) }, 'Next: add your marks →')));

  clear(root).append(body, footer);
}

// ---------------------------------------------------------------- Step 2: marks
function renderMarksEntry() {
  const list = el('ul', { class: 'mark-list' },
    state.subjects.map((id) => {
      const s = SUBJECT_BY_ID[id];
      const value = state.marks[id];
      return el('li', { class: 'mark-row', id: `row-${id}` },
        el('label', { for: `mark-${id}` }, s.name),
        el('input', {
          type: 'number', id: `mark-${id}`, min: '0', max: '100', inputmode: 'numeric', placeholder: '%',
          value: value ?? '',
          oninput: (e) => {
            const row = $(`#row-${id}`);
            const v = e.target.value;
            if (v === '') { delete state.marks[id]; row.classList.remove('is-bad'); }
            else {
              const n = Number(v);
              if (!Number.isFinite(n) || n < 0 || n > 100) { row.classList.add('is-bad'); }
              else { state.marks[id] = n; row.classList.remove('is-bad'); }
            }
            saveMarks();
            updateMarksButton();
          },
        }));
    }));

  const body = el('div', {},
    el('p', {}, 'Your latest real marks – a Grade 11 final or your latest Grade 12 report is fine.'),
    list,
    el('div', { class: 'btn-row' },
      el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => setStep(1) }, '← Change subjects')));

  const footer = el('div', { class: 'btn-row', id: 'marks-footer' },
    el('button', { class: 'btn btn--primary btn--big', type: 'button', id: 'marks-go', onclick: runCalculator }, 'See what I qualify for →'));

  clear(root).append(body, footer);
  updateMarksButton();
}

function updateMarksButton() {
  const btn = $('#marks-go');
  if (!btn) return;
  const allFilled = state.subjects.every((id) => Number.isFinite(state.marks[id]) && state.marks[id] >= 0 && state.marks[id] <= 100);
  btn.disabled = !allFilled;
}

// ---------------------------------------------------------------- Step 3: results
const REQ_MARK = { met: '✓', not_met: '✗', missing: '?', manual: '•' };

function requirementList(requirements) {
  if (!requirements.length) return null;
  return el('ul', { class: 'req-list' },
    requirements.map((r) => el('li', { class: r.status },
      el('span', { class: 'mark', 'aria-hidden': 'true' }, REQ_MARK[r.status] || '•'),
      el('span', {}, r.label, r.detail ? el('span', { class: 'detail' }, ` – ${r.detail}`) : null,
        r.status === 'not_met' && r.gap != null ? el('strong', {}, ` (${r.gap}% to go)`) : null))));
}

function programRow(entry, score) {
  const { program } = entry;
  const bits = [program.faculty, program.durationYears ? `${program.durationYears} years` : null].filter(Boolean).join(' · ');

  let line;
  if (entry.pointsStatus === 'met' && program.minScore != null) {
    line = el('p', { class: 'prow__line' }, el('span', { class: 'pill pill--good' }, 'Enough points'),
      ` needs ${program.minScore}, you have ${score && score.computable ? score.value : '?'}`);
  } else if (entry.pointsStatus === 'not_met') {
    line = el('p', { class: 'prow__line' }, el('span', { class: 'pill pill--warn' }, `${entry.pointsGap} short`),
      ` needs ${program.minScore}, you have ${score.value}`);
  } else if (entry.pointsStatus === 'no_cutoff') {
    line = el('p', { class: 'prow__line muted' }, 'No points cut-off published for this one.');
  } else {
    line = el('p', { class: 'prow__line muted' }, 'We do not calculate a score for this one – see above.');
  }

  return el('div', { class: 'prow' },
    program.flags.length ? el('div', { class: 'badge-row' }, program.flags.map((f) => el('span', { class: `badge badge--${f.tone === 'warn' ? 'warn' : 'info'}` }, f.label))) : null,
    el('div', { class: 'prow__head' }, el('h4', { class: 'prow__name' }, program.name), el('p', { class: 'prow__meta' }, bits)),
    line,
    el('details', {}, el('summary', {}, 'Full requirements'), requirementList(entry.requirements), program.notes ? el('p', { class: 'small muted' }, program.notes) : null, sourceLine(program.sourceUrl, program.intakeYear ? `${program.intakeYear} intake` : null)));
}

function universityCard(block) {
  const total = block.qualifies.length + block.marksOk.length;
  const scoreBoxes = (block.scores || []).map((s) => s.computable
    ? el('div', { class: 'scorebox' }, el('span', {}, s.label), el('span', { class: 'scorebox__n' }, String(s.value)), el('span', { class: 'muted' }, s.unit || ''))
    : el('div', { class: 'scorebox scorebox--none' }, el('strong', {}, s.label), el('span', { class: 'muted' }, ' – we do not calculate this')));

  const groups = [
    ['✓ Good to go', block.qualifies],
    ['+ More to it', block.marksOk],
    ['≈ Nearly', block.close],
    ['Not yet', block.notYet],
    ["Can't tell", block.cannotTell],
  ].filter(([, list]) => list.length);

  const byId = Object.fromEntries((block.scores || []).map((s) => [s.id, s]));

  return el('details', { class: 'uni' },
    el('summary', {},
      el('span', { class: 'uni__name' }, block.university.name),
      el('span', { class: 'uni__counts' },
        total ? el('span', { class: 'pill pill--good' }, `${total} open to you`) : null,
        block.close.length ? el('span', { class: 'pill pill--nearly' }, `${block.close.length} close`) : null)),
    el('div', { class: 'uni__body' },
      scoreBoxes.length ? el('div', {}, scoreBoxes) : null,
      block.selectionScores.length ? el('div', { class: 'callout' },
        el('h4', {}, 'Extra selection scores this university publishes'),
        block.selectionScores.map((s) => el('p', { class: 'small' }, el('strong', {}, `${s.label}: ${s.value} ${s.unit}`), el('br'), el('span', { class: 'muted' }, s.note)))) : null,
      ...groups.map(([title, list]) => el('div', { class: 'group' },
        el('h4', { style: 'margin-top:1.2rem' }, `${title} (${list.length})`),
        list.map((e) => programRow(e, byId[e.scoreId]))))));
}

async function runCalculator() {
  clear(root).append(el('p', { class: 'loading' }, 'Working out your score at every university…'));
  try {
    const { programs } = await getJson('/data/programs.json');
    const result = qualifyAll(state.marks, programs);
    state.data = result;
    track('calculator_run', { subjects: result.marksCounted, universities: result.universities.length });
    setStep(3);
  } catch (err) {
    const msg = err instanceof InputError ? err.message : (err.message || 'Something went wrong.');
    clear(root).append(el('div', { class: 'callout callout--warn' }, el('p', {}, msg),
      el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => setStep(2) }, '← Back')));
  }
}

function renderResults() {
  const data = state.data;
  if (!data) return setStep(2);

  const totalGood = data.universities.reduce((n, u) => n + u.qualifies.length, 0);
  const totalMore = data.universities.reduce((n, u) => n + u.marksOk.length, 0);
  const totalNearly = data.universities.reduce((n, u) => n + u.close.length, 0);

  const summaryTile = (cls, n, label, filter) => el('button', {
    class: `summary__c summary__c--${cls}`, type: 'button', 'aria-pressed': state.resultFilter === filter ? 'true' : 'false',
    onclick: () => { state.resultFilter = state.resultFilter === filter ? null : filter; renderResults(); },
  }, el('span', { class: 'summary__n' }, String(n)), el('span', { class: 'summary__l' }, label));

  const summary = el('div', { class: 'summary' },
    summaryTile('good', totalGood, 'Good to go', 'good'),
    summaryTile('more', totalMore, 'More to it', 'more'),
    summaryTile('nearly', totalNearly, 'Nearly', 'nearly'));

  const headline = totalGood || totalMore
    ? el('p', { style: 'font-size:1.1rem' },
        totalGood ? el('strong', {}, `You meet the published requirements for ${plural(totalGood, 'degree', 'degrees')}.`) : null,
        totalMore ? el('span', {}, `${totalGood ? ' ' : ''}Your marks are enough for ${plural(totalMore, 'more degree', 'more degrees')}, but ${totalMore === 1 ? 'it' : 'each'} also needs something marks can’t show – an NBT, portfolio or interview.`) : null)
    : el('p', { style: 'font-size:1.1rem' }, el('strong', {}, 'You don’t meet the published minimum for anything we’ve captured yet – check “Nearly” below, and remember we’ve only covered some universities so far.'));

  const filtered = state.resultFilter
    ? data.universities.filter((u) => ({ good: u.qualifies, more: u.marksOk, nearly: u.close })[state.resultFilter].length)
    : data.universities;

  clear(root).append(
    el('div', { class: 'callout callout--warn' },
      el('h3', {}, 'These scores cannot be compared with each other'),
      el('p', {}, data.warning)),
    headline,
    summary,
    el('div', {}, filtered.map(universityCard)),
    el('div', { class: 'btn-row', style: 'margin-top:1.4rem' },
      el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => setStep(2) }, '← Change my marks'),
      el('button', { class: 'btn btn--ghost', type: 'button', onclick: resetAll }, 'Start over')));
}

function resetAll() {
  state = { step: 1, subjects: STARTER, marks: {}, resultFilter: null, data: null };
  store.remove(KEY_SUBJECTS);
  store.remove(KEY_MARKS);
  setStep(1);
}

function render() {
  if (state.step === 1) renderSubjectPicker();
  else if (state.step === 2) renderMarksEntry();
  else renderResults();
}

// Jump straight to marks if we already have subjects saved from a previous visit.
if (state.subjects.length >= 4 && Object.keys(state.marks).length) state.step = 2;
setStep(state.step);
