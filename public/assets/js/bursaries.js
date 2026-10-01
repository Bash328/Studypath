// Money page: live "closes in N days" badges on bursary cards, and the email
// reminder sign-up form. The bursary cards themselves are rendered server-side (see
// site/pages/money.mjs) so the page works even with JavaScript off.

import { $, $$, el, clear, api, track, daysUntil } from './core.js';

function paintCountdowns() {
  $$('.bursary').forEach((card) => {
    const badge = $('[data-countdown]', card);
    if (!badge) return;
    const deadline = card.dataset.deadline;
    const days = daysUntil(deadline);
    if (days == null) { badge.hidden = true; return; }
    badge.hidden = false;
    if (days < 0) { badge.textContent = 'Closed'; badge.className = 'pill pill--warn'; }
    else if (days === 0) { badge.textContent = 'Closes today'; badge.className = 'pill pill--warn'; }
    else if (days <= 14) { badge.textContent = `Closes in ${days} day${days === 1 ? '' : 's'}`; badge.className = 'pill pill--close'; }
    else { badge.textContent = `Closes in ${days} days`; badge.className = 'pill pill--good'; }
  });
}
paintCountdowns();

const form = $('#reminder-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = $('#reminder-status');
    clear(status);
    const email = $('#reminder-email').value.trim();
    const field = $('#reminder-field').value.trim();
    const consent = $('#reminder-consent').checked;

    if (!consent) {
      status.append(el('p', { class: 'small', style: 'color:var(--bad)' }, 'Please tick the box so we know it’s okay to email you.'));
      return;
    }
    const btn = $('button[type="submit"]', form);
    btn.disabled = true;
    try {
      const res = await api('/reminders', { method: 'POST', body: { email, field: field || null, consent } });
      track('reminder_signup', { field: field || 'any' });
      form.reset();
      status.append(el('div', { class: 'callout callout--good' }, el('p', {}, res.message || 'You are on the list.')));
    } catch (err) {
      status.append(el('p', { class: 'small', style: 'color:var(--bad)' }, err.message));
    } finally {
      btn.disabled = false;
    }
  });
}
