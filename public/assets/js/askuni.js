// "Ask a university": pick a topic and a university, get the right contact and a
// ready-to-send message. Everything here reads /data/contacts.json, generated at
// build time from db/data/contacts.mjs - the same data the server-rendered table
// further down the page already shows, so this just makes it interactive.

import { $, $$, el, clear, set, getJson, track } from './core.js';

const TEMPLATES = {
  applying: (uni) => `Hi, I'm planning to apply to study at ${uni}. Could you please tell me how and when to apply, and what I'll need?`,
  requirements: (uni) => `Hi, I'm interested in [name of the degree] at ${uni}. Could you confirm the current admission requirements, please?`,
  nbt: (uni) => `Hi, could you tell me whether the NBT is required for [name of the degree] at ${uni}, and by when I'd need to write it?`,
  money: (uni) => `Hi, could you tell me about financial aid or bursaries available through ${uni}, and how to apply for them?`,
  'subject-advice': (uni) => `Hi, I'm in Grade 10/11 and would like advice on which school subjects to take if I want to study at ${uni}. Could you help?`,
  international: (uni) => `Hi, I'm an international student interested in applying to ${uni}. Could you tell me the process and requirements?`,
  health: (uni) => `Hi, I'm interested in [Medicine / Nursing / etc.] at ${uni}. Could you tell me the application process, requirements and closing date?`,
};

const tool = $('#ask-tool');
const chips = $$('#topic-chips .chip--topic');
const hint = $('#topic-hint');
const uniSelect = $('#uni-select');
const out = $('#ask-results');

let topics = [];
let topic = chips[0] ? chips[0].dataset.topic : 'applying';
let data = null;

chips.forEach((chip) => chip.addEventListener('click', () => {
  topic = chip.dataset.topic;
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
  const t = topics.find((x) => x.id === topic);
  if (t) hint.textContent = t.hint;
  render();
}));
uniSelect.addEventListener('change', render);

function tel(phone) {
  const first = String(phone).split(/\s+or\s+|\s*\/\s*/)[0];
  const digits = first.replace(/[^\d+]/g, '');
  return digits.length >= 7 ? `tel:${digits}` : null;
}

function contactBlock(c) {
  const t = c.phone ? tel(c.phone) : null;
  return el('div', { class: 'card contact' },
    el('div', { class: 'contact__top' }, el('h3', {}, c.label)),
    el('ul', { class: 'contact__list' },
      c.email ? el('li', {}, 'Email: ', el('a', { href: `mailto:${c.email}` }, c.email)) : null,
      c.phone ? el('li', {}, 'Phone: ', t ? el('a', { href: t }, c.phone) : c.phone) : null,
      c.url ? el('li', {}, 'Web: ', el('a', { href: c.url, target: '_blank', rel: 'noopener' }, 'The page')) : null),
    c.note ? el('p', { class: 'small muted' }, c.note) : null);
}

function render() {
  if (!data) return;
  const uniId = uniSelect.value;
  if (!uniId) { clear(out); return; }
  const uni = data.universities.find((u) => u.id === uniId);
  const contacts = data.contacts.filter((c) => c.university_id === uniId);
  if (!contacts.length) {
    set(out, el('div', { class: 'callout callout--warn' }, el('p', {}, `We don't have a confirmed contact for ${uni.name} yet. Try its website: `, el('a', { href: uni.website, target: '_blank', rel: 'noopener' }, uni.website))));
    return;
  }

  const onTopic = contacts.filter((c) => (c.topics || []).includes(topic));
  const best = onTopic[0] || contacts.find((c) => c.kind === 'admissions') || contacts.find((c) => c.kind === 'call_centre') || contacts[0];
  const rest = contacts.filter((c) => c !== best);

  const templateFn = TEMPLATES[topic] || TEMPLATES.applying;
  const message = templateFn(uni.name);

  track('ask_university', { university: uniId, topic });

  set(out, 
    el('h2', { class: 'h3' }, `3. Here's who to ask at ${uni.name}`),
    uni.cao ? el('div', { class: 'callout callout--warn' }, el('p', {}, el('strong', {}, 'First-time applicants apply through the CAO'), ', not directly to this university. See the Central Applications Office: ', el('a', { href: 'https://www.cao.ac.za', target: '_blank', rel: 'noopener' }, 'cao.ac.za'), '.')) : null,
    contactBlock(best),
    rest.length ? el('details', {}, el('summary', {}, `${rest.length} more contact${rest.length === 1 ? '' : 's'} at ${uni.short}`), el('div', { class: 'grid grid--2' }, rest.map(contactBlock))) : null,
    el('div', { class: 'card' },
      el('h3', {}, 'A message you could send'),
      el('p', { class: 'small muted' }, 'Fill in the [bracketed] part, then copy it into an email or WhatsApp.'),
      el('textarea', { id: 'msg-box', class: 'msg-box', rows: '4', readonly: true }, message),
      el('div', { class: 'btn-row' },
        el('button', { class: 'btn btn--ghost', type: 'button', onclick: copyMessage }, 'Copy message'),
        best.email ? el('a', { class: 'btn btn--primary', href: `mailto:${best.email}?subject=${encodeURIComponent('Question about applying to ' + uni.name)}&body=${encodeURIComponent(message)}` }, 'Open in email') : null)));
}

function copyMessage() {
  const box = $('#msg-box');
  box.select();
  navigator.clipboard?.writeText(box.value).catch(() => {});
  track('ask_university_copy', {});
}

(async function init() {
  try {
    data = await getJson(tool.dataset.src);
    topics = data.topics || [];
    if (topics[0]) hint.textContent = topics[0].hint;

    const params = new URLSearchParams(location.search);
    if (params.get('uni') && [...uniSelect.options].some((o) => o.value === params.get('uni'))) {
      uniSelect.value = params.get('uni');
    }
    render();
  } catch {
    set(out, el('p', { class: 'muted' }, 'Could not load the contact list – the table further down the page still has everything.'));
  }
})();
