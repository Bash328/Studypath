// The Grade 10 subject planner: pick a career or two, see what the actual captured
// degrees for them ask for. Runs on the same sourced data as the rest of the site.

import { $, el, set, getJson } from './core.js';

// Same Lucide "graduation-cap" icon the server inlines for the graduation cap elsewhere (site/lib/icons.mjs) -
// hardcoded here since this file is a plain static asset, not something the build step touches.
const GRADUATION_ICON = '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></svg>';

const box = $('#planner');
const select = $('#planner-career');
const addBtn = $('#planner-add');
const pickedRow = $('#planner-picked');
const out = $('#planner-out');

let careers = [];
let programs = [];
let picked = []; // [{id, name}]

/** Mirrors requirementText() on the server: a plain-language line for one requirement. */
function reqText(r) {
  if (r.label) return r.label + (r.note ? ` – ${r.note}` : '');
  if (r.any_of) return r.any_of.map(reqText).join(' OR ');
  if (r.all_of) return r.all_of.map(reqText).join(' AND ');
  if (r.subject === 'English' && (r.hl_min_percent != null || r.hl_min_level != null)) {
    const hl = r.hl_min_percent != null ? `${r.hl_min_percent}%` : `level ${r.hl_min_level}`;
    const fal = r.fal_min_percent != null ? `${r.fal_min_percent}%` : `level ${r.fal_min_level}`;
    return `English: ${hl} HL / ${fal} FAL`;
  }
  if (r.min_percent != null) return `${r.subject}: ${r.min_percent}%`;
  if (r.min_level != null) return `${r.subject}: level ${r.min_level}`;
  return r.subject || '';
}

/** Every subject a requirement names, including each side of an OR / AND. */
function subjectsIn(r, out = new Set()) {
  if (r.any_of) r.any_of.forEach((x) => subjectsIn(x, out));
  else if (r.all_of) r.all_of.forEach((x) => subjectsIn(x, out));
  else if (r.subject) out.add(r.subject);
  return out;
}

/** A dropdown of the subjects to ask for, ranked by how many of the career's programmes name them. */
function subjectsToAsk(list) {
  const count = {};
  for (const p of list) for (const sub of new Set([...(p.subjectRequirements || [])].flatMap((r) => [...subjectsIn(r)]))) count[sub] = (count[sub] || 0) + 1;
  const ranked = Object.entries(count).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const band = (n) => (n / list.length >= 0.75 ? 'Nearly all' : n / list.length >= 0.35 ? 'Many' : 'Some');
  return el('details', { class: 'subjects-ask' },
    el('summary', {}, 'Subjects to ask for'),
    ranked.length ? el('ul', { class: 'plain' }, ranked.map(([sub, n]) => el('li', {}, el('strong', {}, sub), ` – ${band(n)} of these programmes (${n} of ${list.length}) ask for it`))) : el('p', { class: 'small' }, 'The programmes we have captured for this career do not name specific school subjects beyond the general entry rules.'),
    el('p', { class: 'small muted' }, 'A guide from the programmes we have captured, not a promise. Subject choices at your school differ, so check with your teacher or school counsellor before you choose.'));
}

function careerBlock(career) {
  const list = programs.filter((p) => p.career && p.career.id === career.id);
  return el('div', { class: 'card plan-card' },
    el('h3', {},
      el('span', { 'aria-hidden': 'true', html: GRADUATION_ICON }),
      ` ${career.name}`,
      el('button', { class: 'chip', type: 'button', 'aria-label': `Remove ${career.name}`, onclick: () => { picked = picked.filter((p) => p.id !== career.id); render(); } }, 'Remove ×')),
    subjectsToAsk(list),
    list.length
      ? el('div', { class: 'table-scroll' }, el('table', { class: 'data' },
          el('thead', {}, el('tr', {}, el('th', { scope: 'col' }, 'University'), el('th', { scope: 'col' }, 'Programme'), el('th', { scope: 'col' }, 'Asks for'))),
          el('tbody', {}, list.map((p) => el('tr', {},
            el('th', { scope: 'row' }, p.university.name),
            el('td', {}, el('a', { href: `/careers/${career.id}#${p.id}` }, p.name)),
            el('td', {}, (p.subjectRequirements || []).map(reqText).join('; ') || '–'))))))
      : el('p', { class: 'muted' }, 'No degrees captured for this career yet.'),
    el('p', { class: 'small' }, el('a', { href: `/careers/${career.id}` }, `Full page for ${career.name} →`)));
}

function render() {
  set(pickedRow, picked.map((c) => el('span', { class: 'chip is-on' }, c.name)));
  if (!picked.length) {
    set(out, el('p', { class: 'muted' }, 'Pick a career above to start.'));
    return;
  }
  set(out, picked.map(careerBlock));
  select.value = '';
}

addBtn.addEventListener('click', () => {
  const id = select.value;
  if (!id || picked.some((p) => p.id === id)) return;
  const career = careers.find((c) => c.id === id);
  if (!career) return;
  if (picked.length >= 3) picked.shift();
  picked.push({ id: career.id, name: career.name });
  render();
});

(async function init() {
  try {
    [{ careers }, { programs }] = await Promise.all([getJson(box.dataset.careers), getJson(box.dataset.src)]);
    const sorted = [...careers].sort((a, b) => a.name.localeCompare(b.name));
    select.append(...sorted.map((c) => el('option', { value: c.id }, c.name)));
  } catch {
    set(out, el('p', { class: 'muted' }, 'Could not load the planner right now – browse ', el('a', { href: '/careers' }, 'careers'), ' directly instead.'));
  }
})();
