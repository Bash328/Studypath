// Small HTML helpers shared by every page, including the markers that tell a student how
// much to trust each statement.
//
// Studypath's promise is "we never present a guess as a fact", so this file is where that
// promise becomes visible: every claim is rendered with a tag saying whether we checked it
// on an official page, took it from our research, or are only offering general knowledge -
// and anything not checked comes with places the student can check it themselves.

import { badgeIcon } from './icons.mjs';

export const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Tiny inline markdown: **bold** only, after escaping. Everything else is plain text. */
export const md = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

export const hostOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return String(url || ''); }
};

export const isExternal = (url) => /^https?:\/\//i.test(url || '');

/** A link. External links open in a new tab safely. */
export function link(url, label, cls = '') {
  if (!url) return esc(label);
  const ext = isExternal(url);
  return `<a${cls ? ` class="${cls}"` : ''} href="${esc(url)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(label)}${ext ? '<span class="sr-only"> (opens the official page)</span>' : ''}</a>`;
}

// ---------------------------------------------------------------------------
// How sure are we?
// ---------------------------------------------------------------------------

export const LEVELS = {
  verified: { icon: '✓', label: 'Checked on the official page', short: 'Checked', cls: 'verified' },
  reported: { icon: '◔', label: 'From our research – source cited, not re-checked yet', short: 'From our research', cls: 'reported' },
  general:  { icon: '!',      label: 'General knowledge – not from an official source', short: 'Not from an official source', cls: 'general' },
  unverified: { icon: '?',    label: 'Could not be confirmed', short: 'Could not be confirmed', cls: 'unverified' },
  conflict: { icon: '≠', label: 'Sources disagree', short: 'Sources disagree', cls: 'conflict' },
};

export const tag = (level, text) => {
  const l = LEVELS[level] || LEVELS.general;
  return `<span class="tag tag--${l.cls}"><span aria-hidden="true">${badgeIcon(level) || l.icon}</span> ${esc(text || l.short)}</span>`;
};

/** A list of source links, e.g. "Source: UCT guidelines, Wits entry requirements". */
export function sourceList(sources) {
  const list = (sources || []).filter(Boolean);
  if (!list.length) return '';
  return `<span class="srcs"><span class="srcs__label">${list.length > 1 ? 'Sources' : 'Source'}:</span> ${
    list.map((s) => (s.url ? link(s.url, s.label) : `<span>${esc(s.label)}</span>`)).join('<span aria-hidden="true"> · </span>')}</span>`;
}

/** "Where to check this yourself" - suggestions for the student, not claims. */
export function checksBox(checks) {
  const list = (checks || []).filter(Boolean);
  if (!list.length) return '';
  return `<details class="checks"><summary>Where to check this yourself</summary><ul>${
    list.map((c) => `<li>${c.url ? link(c.url, c.label) : esc(c.label)}</li>`).join('')}</ul></details>`;
}

/**
 * One paragraph of content with its trust marker. `p` = { level, text, sources }.
 * A paragraph with no source is NEVER shown as if it were sourced: if it claims to be
 * verified or reported but has no source, it is downgraded to "general".
 */
export function claim(p) {
  let level = p.level;
  const hasSource = (p.sources || []).length > 0;
  if ((level === 'verified' || level === 'reported') && !hasSource) level = 'general';
  const l = LEVELS[level] || LEVELS.general;
  return `<div class="claim claim--${l.cls}">
  <p>${md(p.text)}</p>
  <p class="claim__meta">${tag(level)}${hasSource ? ' ' + sourceList(p.sources) : ''}</p>
</div>`;
}

export const claims = (paras) => (paras || []).map(claim).join('\n');

/** The least-certain level among paragraphs - used for a one-glance badge on a whole answer. */
export function weakestLevel(paras) {
  const order = ['verified', 'reported', 'general', 'unverified'];
  let worst = 0;
  for (const p of paras || []) {
    let level = p.level;
    if ((level === 'verified' || level === 'reported') && !(p.sources || []).length) level = 'general';
    worst = Math.max(worst, order.indexOf(level));
  }
  return order[worst];
}

/** Jargon that explains itself: hover, tap or focus to see what it means. */
export const term = (word, meaning) =>
  `<span class="term" tabindex="0" role="note" data-def="${esc(meaning)}">${esc(word)}</span>`;

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "31 July 2026" from "2026-07-31", without time-zone surprises. */
export function prettyDate(iso) {
  if (!iso) return '';
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return String(iso);
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
