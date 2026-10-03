// Money page: live "closes in N days" badges on bursary cards, the email reminder
// sign-up form, and the NSFAS eligibility checker. The bursary cards themselves are
// rendered server-side (see site/pages/money.mjs) so the page works even with
// JavaScript off.

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

// ---------------------------------------------------------------- NSFAS eligibility
const nsfasBtn = $('#nsfas-check-btn');
if (nsfasBtn) {
  nsfasBtn.addEventListener('click', () => {
    const result = $('#nsfas-result');
    clear(result);

    const citizen = $('#nsfas-citizen').checked;
    const sassa = $('#nsfas-sassa').checked;
    const disability = $('#nsfas-disability').checked;
    const incomeStr = $('#nsfas-income').value.trim();

    if (!citizen) {
      track('nsfas_check', { outcome: 'not_citizen' });
      result.append(el('div', { class: 'callout callout--warn' },
        el('p', {}, 'NSFAS funds South African citizens. If you’re a permanent resident, check directly with NSFAS – we could only confirm the citizenship rule, not whether permanent residents are covered.')));
      return;
    }
    if (sassa) {
      track('nsfas_check', { outcome: 'sassa_auto' });
      result.append(el('div', { class: 'callout callout--good' },
        el('p', {}, el('strong', {}, 'You meet the income test automatically.'), ' A household that already gets a SASSA Child Support, Foster Care or Care Dependency grant doesn’t need to show income separately.'),
        el('p', { class: 'small muted' }, 'This checks the income rule only – you still need to apply at nsfas.org.za and have a place or application at a public university or TVET college.')));
      return;
    }
    if (incomeStr === '') {
      result.append(el('p', { class: 'small', style: 'color:var(--bad)' }, 'Enter your household income, or tick the SASSA grant box above.'));
      return;
    }
    const income = Number(incomeStr);
    const threshold = disability ? 600000 : 350000;
    const qualifies = income <= threshold;
    track('nsfas_check', { outcome: qualifies ? 'qualifies' : 'over_threshold', disability });

    result.append(el('div', { class: `callout ${qualifies ? 'callout--good' : 'callout--warn'}` },
      el('p', {}, el('strong', {}, qualifies
        ? 'Based on what you entered, you meet NSFAS’s income test.'
        : `Based on what you entered, your household income is above NSFAS’s threshold (R${threshold.toLocaleString('en-ZA')}${disability ? ', the disability rate' : ''}).`)),
      el('p', { class: 'small muted' }, qualifies
        ? 'This checks the income rule only – you still need to apply at nsfas.org.za and have a place or application at a public university or TVET college.'
        : 'You may still have other funding options – check directly with nsfas.org.za and your university’s own financial aid office.')));
  });
}
