// Shared helpers for the page scripts: a tiny DOM builder, data loading, dates, storage,
// and the source-link component every requirement has to carry.

import { API_BASE } from './config.js';
import { track } from './analytics.js';

export { track };

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

/**
 * clear(node) and then append children, with the same rules el() uses: arrays are
 * flattened and null/false are skipped. Use this instead of clear(x).append(...) -
 * the native .append() does NOT flatten arrays (it stringifies them) or skip null
 * (it inserts the text "null"), which is an easy and silent mistake to make.
 */
export function set(node, ...children) {
  clear(node);
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const cache = new Map();

/** Load a static JSON file the build generated (programs, dates, contacts ...). */
export function getJson(path) {
  if (!cache.has(path)) {
    cache.set(path, fetch(path).then((r) => {
      if (!r.ok) throw new Error(`Could not load ${path}`);
      return r.json();
    }));
  }
  return cache.get(path);
}

/**
 * Call the optional API (reminders, questions). On a static host with no API the request
 * 404s or fails; we turn that into a message a teenager can understand.
 */
export async function api(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api${path}`, {
      method: options.method || 'GET',
      headers: { 'content-type': 'application/json', ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error('We could not reach our server. Check your connection and try again.');
  }
  const ctype = res.headers.get('content-type') || '';
  if (!ctype.includes('json')) {
    throw new Error('This feature is not switched on yet. Please try again later – nothing you typed was sent.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

// ---------------------------------------------------------------------------
// Dates (local midnight, so "closes in 3 days" is right for the learner)
// ---------------------------------------------------------------------------

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function prettyDate(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : '';
}

export function daysUntil(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const target = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// ---------------------------------------------------------------------------
// Storage that never throws (private browsing, blocked storage ...)
// ---------------------------------------------------------------------------

export const store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* fine */ } },
  remove(key) { try { localStorage.removeItem(key); } catch { /* fine */ } },
};

// ---------------------------------------------------------------------------
// Shared bits of UI
// ---------------------------------------------------------------------------

export function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return String(url || ''); }
}

/**
 * The citation. This is the product's entire reason to exist, so it is a visible
 * line of text with a real link - never a tooltip, never an icon you have to find.
 */
export function sourceLine(url, extra) {
  return el('p', { class: 'source' },
    el('span', { class: 'source__label' }, 'Source:'),
    el('a', { href: url, target: '_blank', rel: 'noopener', onclick: () => track('source_click', { url }) },
      `View the official page (${hostOf(url)})`),
    extra ? el('span', { class: 'muted' }, `· ${extra}`) : null);
}

export const TAGS = {
  verified: ['✓', 'Checked on the official page'],
  reported: ['◔', 'From our research'],
  general: ['!', 'Not from an official source'],
  unverified: ['?', 'Could not be confirmed'],
  conflict: ['≠', 'Sources disagree'],
};

export function tagEl(level, text) {
  const [icon, label] = TAGS[level] || TAGS.general;
  return el('span', { class: `tag tag--${level}` }, el('span', { 'aria-hidden': 'true' }, icon), ` ${text || label}`);
}

/** Wire a set of filter chips so exactly one is pressed. */
export function chipGroup(container, onChange) {
  $$('.chip', container).forEach((chip) => chip.addEventListener('click', () => {
    $$('.chip', container).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    onChange(chip);
  }));
}
