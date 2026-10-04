// Private inbox for the questions sent through /ask. The key is checked by the server on every
// request; it is only kept for this browser tab (sessionStorage), never in the page or the repo.

import { $, el, set, api } from './core.js';

const root = $('#admin');
const KEY = 'studypath.admin.key';
const getKey = () => { try { return sessionStorage.getItem(KEY) || ''; } catch { return ''; } };
const setKey = (v) => { try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY); } catch { /* fine */ } };
const auth = () => ({ authorization: `Bearer ${getKey()}` });

let questions = [];
let show = 'new';

function login(message) {
  const input = el('input', { type: 'password', id: 'admin-key', autocomplete: 'current-password', 'aria-label': 'Admin key' });
  const form = el('form', { class: 'card admin-login' },
    el('label', { for: 'admin-key' }, 'Admin key'), input,
    message ? el('p', { class: 'small', style: 'color:var(--bad)' }, message) : null,
    el('div', { class: 'btn-row' }, el('button', { class: 'btn btn--primary', type: 'submit' }, 'Open')));
  form.addEventListener('submit', (e) => { e.preventDefault(); setKey(input.value.trim()); load(); });
  set(root, form);
}

async function load() {
  try {
    ({ questions } = await api('/admin/questions', { headers: auth() }));
    render();
  } catch (err) {
    setKey('');
    login(err.message);
  }
}

async function mark(q, status, answer) {
  try {
    await api(`/admin/questions/${q.id}`, { method: 'POST', headers: auth(), body: { status, answer } });
    await load();
  } catch (err) {
    alert(err.message);
  }
}

function contactLink(c) {
  if (!c) return el('span', { class: 'muted' }, 'No contact left');
  if (c.includes('@')) return el('a', { href: `mailto:${c}` }, c);
  const digits = c.replace(/\D/g, '');
  return digits ? el('a', { href: `https://wa.me/${digits.startsWith('0') ? '27' + digits.slice(1) : digits}` }, c) : el('span', {}, c);
}

function card(q) {
  const note = el('textarea', { rows: '2', maxlength: '2000', placeholder: 'Optional note: what you answered, or where it went in the FAQ', 'aria-label': 'Note' });
  return el('div', { class: 'card' },
    el('p', {}, el('strong', {}, q.question)),
    el('p', { class: 'small muted' }, `${q.createdAt} UTC · from ${q.page || 'unknown page'} · `, contactLink(q.contact)),
    q.answer ? el('p', { class: 'small' }, `Note: ${q.answer}`) : null,
    q.status === 'new'
      ? el('div', {}, note, el('div', { class: 'btn-row' },
          el('button', { class: 'btn btn--primary', type: 'button', onclick: () => mark(q, 'answered', note.value.trim() || null) }, 'Mark answered'),
          el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => mark(q, 'ignored', note.value.trim() || null) }, 'Ignore')))
      : el('div', { class: 'btn-row' },
          el('span', { class: 'pill' }, q.status),
          el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => mark(q, 'new') }, 'Move back to new')));
}

function render() {
  const count = (s) => questions.filter((q) => q.status === s).length;
  const shown = questions.filter((q) => q.status === show);
  set(root,
    el('div', { class: 'chip-row' }, ['new', 'answered', 'ignored'].map((s) =>
      el('button', { class: 'chip', type: 'button', 'aria-pressed': String(show === s), onclick: () => { show = s; render(); } }, `${s[0].toUpperCase()}${s.slice(1)} (${count(s)})`))),
    el('div', { class: 'stack' }, shown.length ? shown.map(card) : el('p', { class: 'muted' }, `Nothing ${show} right now.`)),
    el('p', { class: 'admin-lock' }, el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => { setKey(''); login(); } }, 'Lock')));
}

getKey() ? load() : login();
