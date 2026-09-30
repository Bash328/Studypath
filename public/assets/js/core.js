// Shared helpers: tiny DOM builder, API client, analytics, and the source-link
// component that every requirement on this site has to carry.

import { t, applyStaticTranslations } from './strings.js';
import { track } from './analytics.js';

export { t, track };

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** el('div', {class:'card'}, 'text', el('p', {}, 'more')) */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

export const clear = (node) => { while (node.firstChild) node.removeChild(node.firstChild); return node; };

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export async function api(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: { 'content-type': 'application/json' },
    ...options,
    body: options && options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || t('common.error'));
  return data;
}

/** Render a loading state, then either the content or a readable error. */
export async function load(container, work) {
  clear(container).append(el('p', { class: 'loading' }, t('common.loading')));
  try {
    const content = await work();
    clear(container).append(content);
  } catch (err) {
    clear(container).append(
      el('div', { class: 'callout callout--warn' },
        el('p', {}, err.message || t('common.error')),
        el('button', { class: 'btn btn--ghost', onclick: () => load(container, work) }, t('common.retry')))
    );
  }
}

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

/**
 * The citation. This is the product's entire reason to exist, so it is a visible
 * line of text with a real link - never a tooltip, never an icon you have to find.
 */
export function sourceLine(url, extra) {
  let host = '';
  try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { host = url; }
  return el('p', { class: 'source' },
    el('span', { class: 'source__label' }, t('common.source')),
    el('span', {},
      el('a', {
        href: url, target: '_blank', rel: 'noopener',
        onclick: () => track('source_click', { url }),
      }, `${t('common.viewSource')} (${host})`),
      extra ? ` · ${extra}` : ''
    )
  );
}

export const flagBadges = (flags) =>
  !flags || !flags.length ? null :
    el('div', { class: 'badge-row' },
      flags.map((f) => el('span', {
        class: `badge badge--${f.tone === 'warn' ? 'warn' : 'info'}`,
        title: f.id === 'conflict' ? 'Two official sources give different numbers. We show both rather than pick one.' : '',
      }, f.label)));

/** Human-readable version of one programme's subject requirements. */
export function requirementText(req) {
  if (req.label) return req.label + (req.note ? ` — ${req.note}` : '');
  if (req.any_of) return req.any_of.map(requirementText).join(' OR ');
  if (req.all_of) return req.all_of.map(requirementText).join(' AND ');
  if (req.subject === 'English' && (req.hl_min_percent || req.hl_min_level)) {
    const hl = req.hl_min_percent != null ? `${req.hl_min_percent}%` : `level ${req.hl_min_level}`;
    const fal = req.fal_min_percent != null ? `${req.fal_min_percent}%` : `level ${req.fal_min_level}`;
    return `English: ${hl} if it is your Home Language, ${fal} if it is your First Additional Language`;
  }
  if (req.min_percent != null) return `${req.subject}: ${req.min_percent}%`;
  if (req.min_level != null) return `${req.subject}: level ${req.min_level} (${levelPercent(req.min_level)}% or more)`;
  return req.subject || '';
}

export const levelPercent = (level) => ({ 1: 0, 2: 30, 3: 40, 4: 50, 5: 60, 6: 70, 7: 80, 8: 90 })[level];

/** One programme, rendered the same way everywhere it appears. */
export function programCard(program, { showUniversity = true } = {}) {
  const bits = [];
  if (showUniversity && program.university) bits.push(program.university.shortName || program.university.name);
  if (program.faculty) bits.push(program.faculty);
  if (program.durationYears) bits.push(`${program.durationYears} years`);

  const score = program.minScore != null
    ? el('p', {},
        el('strong', {}, `${program.scoringSystemLabel}: ${program.minScore} ${program.scoringSystemUnit || ''}`.trim()),
        program.scoreType && program.scoreType !== 'minimum' ? ` (${program.scoreType.replace('_', ' ')})` : '')
    : el('p', { class: 'muted' }, 'No points cut-off published for this one — see the note below.');

  const reqs = (program.subjectRequirements || []).length
    ? el('ul', { class: 'req-list' },
        program.subjectRequirements.map((r) => el('li', {}, el('span', { class: 'mark' }, '•'), el('span', {}, requirementText(r)))))
    : null;

  return el('article', { class: 'card' },
    flagBadges(program.flags),
    el('h3', {}, program.name),
    el('p', { class: 'card__meta' }, bits.join(' · ')),
    score,
    reqs,
    program.notes ? el('p', { class: 'small muted' }, program.notes) : null,
    sourceLine(program.sourceUrl, program.intakeYear ? `${program.intakeYear} intake` : null)
  );
}

// ---------------------------------------------------------------------------
// Page boot
// ---------------------------------------------------------------------------

export function boot() {
  applyStaticTranslations();
  // Mark the current page in the nav without hardcoding it into every file.
  const here = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  $$('.nav a').forEach((a) => {
    const target = new URL(a.getAttribute('href'), location.origin).pathname.replace(/\/$/, '') || '/';
    if (target === here) a.setAttribute('aria-current', 'page');
  });
}

document.addEventListener('DOMContentLoaded', boot);
