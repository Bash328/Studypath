import { $, el, clear, api, t, track, sourceLine } from './core.js';

const DAY = 86400000;

const daysUntil = (iso) => {
  const when = Date.parse(iso);
  if (Number.isNaN(when)) return null;
  return Math.ceil((when - Date.now()) / DAY);
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso
    : d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
};

function bursaryCard(b) {
  const days = b.deadline ? daysUntil(b.deadline) : null;
  const closingSoon = days != null && days >= 0 && days <= 30;
  const closed = days != null && days < 0;

  return el('article', { class: 'card' },
    el('div', { class: 'badge-row' },
      closed ? el('span', { class: 'badge badge--bad' }, 'Closed')
        : closingSoon ? el('span', { class: 'badge badge--warn' }, `Closes in ${days} ${days === 1 ? 'day' : 'days'}`)
        : null),
    el('h3', {}, b.name),
    b.provider ? el('p', { class: 'card__meta' }, b.provider) : null,
    el('p', {},
      el('strong', {}, `${t('bursaries.deadline')}: `),
      b.deadline ? formatDate(b.deadline) : t('bursaries.noDeadline')),
    b.field_of_study ? el('p', { class: 'small' }, el('strong', {}, 'For: '), b.field_of_study) : null,
    b.amount_covers ? el('p', { class: 'small' }, el('strong', {}, `${t('bursaries.covers')}: `), b.amount_covers) : null,
    b.eligibility ? el('p', { class: 'small' }, el('strong', {}, `${t('bursaries.eligibility')}: `), b.eligibility) : null,
    el('p', {},
      el('a', {
        class: 'btn btn--primary', href: b.apply_url, target: '_blank', rel: 'noopener',
        onclick: () => track('bursary_apply_click', { bursary: b.id }),
      }, t('bursaries.apply'))),
    sourceLine(b.source_url));
}

async function loadBursaries(field) {
  const list = $('#bursary-list');
  clear(list).append(el('p', { class: 'loading' }, t('common.loading')));
  try {
    const { bursaries } = await api(`/bursaries${field ? `?field=${encodeURIComponent(field)}` : ''}`);
    if (!bursaries.length) {
      clear(list).append(el('div', { class: 'empty' },
        el('p', {}, t('bursaries.empty')),
        el('p', { class: 'small' }, 'In the meantime, the reminder sign-up below still works — we’ll message you as soon as the first deadlines are loaded.')));
      return;
    }
    // Soonest deadline first; ones with no date at the end.
    bursaries.sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return Date.parse(a.deadline) - Date.parse(b.deadline);
    });
    clear(list).append(el('div', { class: 'grid grid--2' }, bursaries.map(bursaryCard)));
  } catch (err) {
    clear(list).append(el('div', { class: 'callout callout--warn' }, el('p', {}, err.message)));
  }
}

function initReminderForm() {
  const form = $('#reminder-form');
  const status = $('#reminder-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clear(status);
    const phone = $('#reminder-phone').value.trim();
    const fieldValue = $('#reminder-field').value.trim();
    const consent = $('#reminder-consent').checked;

    if (!consent) {
      status.append(el('p', { class: 'small', style: 'color:var(--bad)' }, 'Please tick the box so we know it’s okay to message you.'));
      return;
    }
    try {
      const res = await api('/reminders', { method: 'POST', body: { phone, field: fieldValue || null, consent } });
      track('reminder_signup', { field: fieldValue || 'any' });
      form.reset();
      status.append(el('div', { class: 'callout' }, el('p', {}, res.message || t('bursaries.submitted'))));
    } catch (err) {
      status.append(el('p', { class: 'small', style: 'color:var(--bad)' }, err.message));
    }
  });
}

(function init() {
  const field = $('#bursary-field');
  field.addEventListener('change', () => loadBursaries(field.value));
  loadBursaries('');
  initReminderForm();
})();
