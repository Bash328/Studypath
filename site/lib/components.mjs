// Reusable pieces of page: a programme card, a contact card, a date row.

import { esc, md, link, hostOf, tag, prettyDate, LEVELS } from './html.mjs';
import { requirementText, VERIFICATION_LABELS } from './data.mjs';

const FLAG_TONE = { warn: 'warn', info: 'info' };

/** Map a contacts/dates `verification` value onto the shared trust levels. */
export const levelOf = (verification) => (verification === 'verified' ? 'verified' : verification === 'reported' ? 'reported' : 'unverified');

export const verificationTag = (verification) => tag(levelOf(verification), VERIFICATION_LABELS[verification] || undefined);

/** A heading with an emoji badge - gives every section a face. */
export const sectionHead = (emoji, title, sub) => `<div class="sec-head">
  ${emoji ? `<span class="sec-head__emoji" aria-hidden="true">${emoji}</span>` : ''}
  <div><h2>${esc(title)}</h2>${sub ? `<p class="sec-head__sub">${md(sub)}</p>` : ''}</div>
</div>`;

/**
 * One degree, with its numbers AND its source link in plain view. The source is a
 * visible line of text, never a tooltip: it is the reason this product exists.
 */
export function programCard(p, { showUniversity = true } = {}) {
  const meta = [
    showUniversity && p.university ? p.university.shortName || p.university.name : null,
    p.faculty,
    p.durationYears ? `${p.durationYears} years` : null,
  ].filter(Boolean).join(' · ');

  const badges = p.flags.map((f) => `<span class="badge badge--${FLAG_TONE[f.tone] || 'info'}">${esc(f.label)}</span>`).join('');

  const score = p.minScore != null
    ? `<p class="prog__score"><strong>${esc(p.scoringSystemLabel)}</strong> <span class="prog__num">${p.minScore}</span> <span class="muted">${esc(p.scoringSystemUnit || '')}</span>${
        p.scoreType && p.scoreType !== 'minimum' ? ` <span class="muted">(${esc(p.scoreType.replace('_', ' '))})</span>` : ''}</p>`
    : `<p class="prog__score muted">No points cut-off published for this one – see the note below.</p>`;

  const reqs = (p.subjectRequirements || []).length
    ? `<ul class="req-list">${p.subjectRequirements.map((r) => `<li><span class="mark" aria-hidden="true">•</span><span>${esc(requirementText(r))}</span></li>`).join('')}</ul>`
    : '';

  return `<article class="card prog" id="${esc(p.id)}">
  ${badges ? `<div class="badge-row">${badges}</div>` : ''}
  <h3>${esc(p.name)}</h3>
  <p class="card__meta">${esc(meta)}</p>
  ${score}
  ${reqs}
  ${p.notes ? `<p class="small muted">${esc(p.notes)}</p>` : ''}
  <p class="source"><span class="source__label">Source:</span> ${link(p.sourceUrl, `View the official page (${hostOf(p.sourceUrl)})`)}${p.intakeYear ? ` <span class="muted">· ${p.intakeYear} intake</span>` : ''}</p>
</article>`;
}

const tel = (phone) => {
  const first = String(phone).split(/\s+or\s+|\s*\/\s*/)[0];
  const digits = first.replace(/[^\d+]/g, '');
  return digits.length >= 7 ? `tel:${digits}` : null;
};

/** One way to reach a university, with how sure we are of it. */
export function contactCard(c) {
  const t = tel(c.phone || '');
  return `<div class="card contact">
  <div class="contact__top"><h3>${esc(c.label)}</h3>${verificationTag(c.verification)}</div>
  <ul class="contact__list">
    ${c.email ? `<li><span aria-hidden="true">✉️</span> <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>` : ''}
    ${c.phone ? `<li><span aria-hidden="true">📞</span> ${t ? `<a href="${esc(t)}">${esc(c.phone)}</a>` : esc(c.phone)}</li>` : ''}
    ${c.hours ? `<li><span aria-hidden="true">🕓</span> ${esc(c.hours)}</li>` : ''}
    ${c.url ? `<li><span aria-hidden="true">🔗</span> ${link(c.url, hostOf(c.url) + ' – the page')}</li>` : ''}
  </ul>
  ${c.note ? `<p class="small muted">${md(c.note)}</p>` : ''}
  <p class="source"><span class="source__label">Source:</span> ${link(c.source_url, hostOf(c.source_url))} <span class="muted">· checked ${prettyDate(c.checked)}</span></p>
</div>`;
}

const KIND_LABEL = { close: 'Applications', open: 'Applications open', nbt: 'NBT', funding: 'Funding', open_day: 'Open day' };
export const kindLabel = (k) => KIND_LABEL[k] || k;

/** A dated item. The `data-*` attributes let the browser add "closes in 12 days". */
export function dateRow(d, uniName) {
  const when = d.date ? (d.date_end ? `${prettyDate(d.date)} → ${prettyDate(d.date_end)}` : prettyDate(d.date)) : 'Date not confirmed';
  return `<li class="date" data-kind="${esc(d.kind)}" data-uni="${esc(d.university_id || '')}" data-date="${esc(d.date || '')}" data-end="${esc(d.date_end || '')}">
  <div class="date__when"><span class="date__day">${esc(when)}</span><span class="date__status" data-status></span></div>
  <div class="date__what">
    <p class="date__title"><span class="pill pill--${esc(d.kind)}">${esc(kindLabel(d.kind))}</span> ${uniName ? `<strong>${esc(uniName)}</strong> – ` : ''}${esc(d.title)}</p>
    ${d.applies_to ? `<p class="small">${esc(d.applies_to)}</p>` : ''}
    ${d.note ? `<p class="small muted">${esc(d.note)}</p>` : ''}
    <p class="small">${verificationTag(d.verification)} ${link(d.source_url, hostOf(d.source_url))}</p>
  </div>
</li>`;
}

export { LEVELS };
