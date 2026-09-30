import { $, el, clear, api, t, track, sourceLine, flagBadges } from './core.js';

const STORE = 'studypath.marks';

let SUBJECTS = [];
let rows = [];

// A sensible starting point: the three subjects every NSC student takes, plus room
// for the rest. Beginners should not face an empty form.
const STARTER = ['english-hl', 'mathematics', 'life-orientation', '', '', '', ''];

// ---------------------------------------------------------------------------
// The marks form
// ---------------------------------------------------------------------------

function subjectOptions(selectedId) {
  const groups = {};
  for (const s of SUBJECTS) (groups[s.group] ||= []).push(s);
  const chosen = new Set(rows.map((r) => r.subject).filter((id) => id && id !== selectedId));
  return [
    el('option', { value: '' }, 'Choose a subject…'),
    ...Object.entries(groups).map(([group, list]) =>
      el('optgroup', { label: group },
        list.map((s) => el('option', {
          value: s.id,
          selected: s.id === selectedId || null,
          disabled: chosen.has(s.id) || null,
        }, s.name)))),
  ];
}

function renderRows() {
  const body = $('#marks-body');
  clear(body);
  rows.forEach((row, index) => {
    const select = el('select', {
      'aria-label': `Subject ${index + 1}`,
      onchange: (e) => { row.subject = e.target.value; save(); renderRows(); },
    }, subjectOptions(row.subject));

    const mark = el('input', {
      type: 'number', min: '0', max: '100', inputmode: 'numeric',
      placeholder: '%', value: row.mark ?? '',
      'aria-label': `Mark for subject ${index + 1}`,
      oninput: (e) => { row.mark = e.target.value; save(); },
    });

    body.append(el('tr', {},
      el('td', {}, select),
      el('td', {}, mark),
      el('td', {},
        el('button', {
          class: 'chip', type: 'button', 'aria-label': `Remove subject ${index + 1}`,
          onclick: () => { rows.splice(index, 1); save(); renderRows(); },
        }, 'Remove'))));
  });
}

const save = () => {
  try { localStorage.setItem(STORE, JSON.stringify(rows)); } catch { /* private mode */ }
};

const restore = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (Array.isArray(saved) && saved.length) return saved;
  } catch { /* ignore */ }
  return STARTER.map((subject) => ({ subject, mark: '' }));
};

function collectMarks() {
  const marks = {};
  const problems = [];
  const seen = new Set();
  for (const row of rows) {
    if (!row.subject) continue;
    const value = Number(row.mark);
    const name = (SUBJECTS.find((s) => s.id === row.subject) || {}).name || row.subject;
    if (row.mark === '' || row.mark == null) { problems.push(`Add your mark for ${name}.`); continue; }
    if (!Number.isFinite(value) || value < 0 || value > 100) { problems.push(`${name} should be a percentage between 0 and 100.`); continue; }
    if (seen.has(row.subject)) { problems.push(`You have ${name} listed twice — remove one.`); continue; }
    seen.add(row.subject);
    marks[row.subject] = value;
  }
  return { marks, problems };
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

const REQ_MARK = { met: '✓', not_met: '✗', missing: '?', manual: '•' };

function requirementList(requirements) {
  if (!requirements.length) return null;
  return el('ul', { class: 'req-list' },
    requirements.map((r) => el('li', { class: r.status },
      el('span', { class: 'mark', 'aria-hidden': 'true' }, REQ_MARK[r.status] || '•'),
      el('span', {},
        el('span', {}, r.label),
        r.detail ? el('span', { class: 'detail' }, ` — ${r.detail}`) : null,
        r.status === 'not_met' && r.gap != null ? el('strong', {}, ` (${r.gap}% to go)`) : null))));
}

function resultCard(entry, score) {
  const { program } = entry;
  const head = [];
  if (program.faculty) head.push(program.faculty);
  if (program.durationYears) head.push(`${program.durationYears} years`);

  let verdictLine = null;
  if (entry.pointsStatus === 'met' && program.minScore != null) {
    verdictLine = el('p', { class: 'small' },
      el('span', { class: 'badge badge--good' }, 'Points: you have enough'),
      ` — needs ${program.minScore}, you have ${score && score.computable ? score.value : '?'}.`);
  } else if (entry.pointsStatus === 'not_met') {
    verdictLine = el('p', { class: 'small' },
      el('span', { class: 'badge badge--bad' }, `${entry.pointsGap} short`),
      ` — needs ${program.minScore}, you have ${score.value}.`);
  } else if (entry.pointsStatus === 'no_cutoff') {
    verdictLine = el('p', { class: 'small muted' }, 'This university does not publish a points cut-off for this programme.');
  } else {
    verdictLine = el('p', { class: 'small muted' }, 'We do not calculate a score for this university — see the note above.');
  }

  return el('article', { class: 'card' },
    flagBadges(program.flags),
    el('h4', { style: 'margin:0 0 .2rem;font-size:1.05rem' }, program.name),
    el('p', { class: 'card__meta' }, head.join(' · ')),
    verdictLine,
    requirementList(entry.requirements),
    program.notes ? el('p', { class: 'small muted', style: 'margin-top:.7rem' }, program.notes) : null,
    sourceLine(program.sourceUrl, program.intakeYear ? `${program.intakeYear} intake` : null));
}

function group(title, entries, scoreFor, { intro } = {}) {
  if (!entries.length) return null;
  return el('div', { class: 'result-group' },
    el('h4', {}, `${title} (${entries.length})`),
    intro ? el('p', { class: 'small muted' }, intro) : null,
    el('div', { class: 'grid grid--2' }, entries.map((e) => resultCard(e, scoreFor(e)))));
}

const scoreCardFor = (score) =>
  score && score.computable
    ? el('div', { class: 'card score-card' },
        el('p', { class: 'small muted', style: 'margin:0' }, `Your ${score.label}`),
        el('p', { class: 'score-card__value' }, String(score.value),
          el('span', { class: 'score-card__unit' }, ` ${score.unit || ''}`)),
        el('p', { class: 'small muted', style: 'margin:.5rem 0 0' }, score.explanation),
        score.working ? el('p', { class: 'small muted', style: 'margin:.3rem 0 0' }, `We counted: ${score.working}`) : null,
        score.sourceUrl ? sourceLine(score.sourceUrl) : null)
    : el('div', { class: 'card score-card score-card--unknown' },
        el('p', { class: 'small muted', style: 'margin:0' }, score ? score.label : 'Score'),
        el('p', { style: 'font-weight:700;margin:.3rem 0' }, 'We are not going to guess this one'),
        el('p', { class: 'small muted', style: 'margin:0' }, (score && (score.reason || score.explanation)) || ''));

function universityBlock(block) {
  const { university } = block;
  // Some universities score different faculties differently - Wits uses its APS for
  // most degrees but a Composite Index for Health Sciences - so show each one.
  const scoresById = Object.fromEntries((block.scores || []).map((s) => [s.id, s]));
  const scoreFor = (entry) => scoresById[entry.scoreId] || null;
  const scoreCard = (block.scores || []).map(scoreCardFor);

  const selection = block.selectionScores && block.selectionScores.length
    ? el('div', { class: 'card' },
        el('h4', { style: 'margin:0 0 .4rem;font-size:1rem' }, t('calc.selectionNote')),
        block.selectionScores.map((s) => el('p', { class: 'small', style: 'margin:0 0 .5rem' },
          el('strong', {}, `${s.label}: ${s.value} ${s.unit}`), el('br'), el('span', { class: 'muted' }, s.note))))
    : null;

  return el('section', { class: 'section', style: 'padding-block:1.5rem;border-top:1px solid var(--line)' },
    el('h3', { style: 'font-size:1.45rem' }, university.name),
    el('div', { class: 'grid grid--2' }, scoreCard, selection),
    group(t('calc.qualifies'), block.qualifies, scoreFor),
    group(t('calc.marksOk'), block.marksOk, scoreFor, { intro: t('calc.marksOkWhy') }),
    group(t('calc.close'), block.close, scoreFor, { intro: t('calc.closeWhy') }),
    group(t('calc.notYet'), block.notYet, scoreFor),
    group(t('calc.cannotTell'), block.cannotTell, scoreFor, { intro: t('calc.cannotTellWhy') }));
}

async function calculate() {
  const { marks, problems } = collectMarks();
  const errors = $('#calc-errors');
  clear(errors);

  if (problems.length) {
    errors.append(el('div', { class: 'callout callout--warn' },
      el('p', {}, 'Just fix these first:'),
      el('ul', {}, problems.map((p) => el('li', {}, p)))));
    errors.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }
  if (Object.keys(marks).length < 4) {
    errors.append(el('div', { class: 'callout callout--warn' }, el('p', {}, t('calc.needMore'))));
    return;
  }

  const out = $('#calc-results');
  clear(out).append(el('p', { class: 'loading' }, t('calc.workingOut')));

  try {
    const data = await api('/qualify', { method: 'POST', body: { marks } });
    track('calculator_run', { subjects: data.marksCounted, universities: data.universities.length });

    const sum = (key) => data.universities.reduce((n, u) => n + u[key].length, 0);
    const clean = sum('qualifies');
    const withMore = sum('marksOk');
    const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

    const headline = [];
    if (clean) headline.push(el('strong', {}, `You meet the published requirements for ${plural(clean, 'programme', 'programmes')}.`));
    if (withMore) {
      const what = clean ? `${withMore} more` : plural(withMore, 'programme', 'programmes');
      headline.push(el('span', {}, `${clean ? ' ' : ''}Your marks are enough for ${what}, but ${withMore === 1 ? 'it also needs' : 'each of those also needs'} something we can’t check from marks — like an NBT, a portfolio or an interview.`));
    }
    if (!clean && !withMore) headline.push(el('strong', {}, t('calc.nothingYet')));

    clear(out).append(
      el('div', { class: 'callout callout--warn' },
        el('h3', {}, t('calc.notComparable')),
        el('p', {}, t('calc.notComparableBody'))),
      el('p', { style: 'margin-top:1.5rem;font-size:1.1rem' }, ...headline),
      (clean || withMore) ? el('p', { class: 'small muted' }, t('calc.selectionReminder')) : null,
      ...data.universities.map(universityBlock));

    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    clear(out).append(el('div', { class: 'callout callout--warn' }, el('p', {}, err.message)));
  }
}

// ---------------------------------------------------------------------------

(async function init() {
  const { subjects } = await api('/subjects');
  SUBJECTS = subjects;
  rows = restore();
  renderRows();

  $('#add-subject').addEventListener('click', () => { rows.push({ subject: '', mark: '' }); save(); renderRows(); });
  $('#calc-form').addEventListener('submit', (e) => { e.preventDefault(); calculate(); });
  $('#reset-marks').addEventListener('click', () => {
    rows = STARTER.map((subject) => ({ subject, mark: '' }));
    save();
    renderRows();
    clear($('#calc-results'));
    clear($('#calc-errors'));
  });
})();
