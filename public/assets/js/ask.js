// "Ask us a question": live suggestions from the FAQ while typing, then submit to the
// optional API. If the API isn't switched on, api() throws a friendly message instead
// of failing silently - see core.js.

import { $, el, clear, set, getJson, api, track } from './core.js';

const form = $('#ask-form');
const qField = $('#q');
const count = $('#q-count');
const suggestBox = $('#suggest');
const suggestList = $('#suggest-list');

const updateCount = () => { count.textContent = String(qField.value.length); };
updateCount();
qField.addEventListener('input', updateCount);

let faqData = null;
let timer = null;
qField.addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(suggest, 250);
});

async function suggest() {
  const q = qField.value.trim().toLowerCase();
  if (q.length < 6) { suggestBox.hidden = true; return; }
  try {
    if (!faqData) faqData = (await getJson('/data/faq.json')).faq;
  } catch {
    return; // suggestions are a nicety, not essential
  }
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  const hits = faqData
    .map((f) => ({ f, score: words.filter((w) => (f.question + ' ' + f.text).toLowerCase().includes(w)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!hits.length) { suggestBox.hidden = true; return; }
  set(suggestList, hits.map((h) => el('li', {}, el('a', { href: `/faq.html#${h.f.id}` }, h.f.question))));
  suggestBox.hidden = false;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = $('#ask-status');
  clear(status);

  const question = qField.value.trim();
  if (question.length < 10) {
    status.append(el('p', { class: 'small', style: 'color:var(--bad)' }, 'Tell us a little more – at least 10 characters.'));
    return;
  }
  const contact = $('#contact').value.trim();
  const consent = $('#consent').checked;
  if (contact && !consent) {
    status.append(el('p', { class: 'small', style: 'color:var(--bad)' }, 'Tick the box so we know it’s okay to use your contact details.'));
    return;
  }

  const btn = $('button[type="submit"]', form);
  btn.disabled = true;
  try {
    const res = await api('/questions', {
      method: 'POST',
      body: { question, contact: contact || null, consent, website: $('#website').value, page: location.pathname },
    });
    track('question_submitted', {});
    form.reset();
    updateCount();
    suggestBox.hidden = true;
    status.append(el('div', { class: 'callout callout--good' }, el('p', {}, res.message || 'Thanks – your question is in.')));
  } catch (err) {
    status.append(el('p', { class: 'small', style: 'color:var(--bad)' }, err.message));
  } finally {
    btn.disabled = false;
  }
});
