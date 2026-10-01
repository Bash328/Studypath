import { esc, md, claim, claims, tag, link, hostOf, prettyDate, checksBox } from '../lib/html.mjs';
import { sectionHead, verificationTag } from '../lib/components.mjs';

export function moneyPage(data) {
  const { bursaries, faq, dates, fees, uniById } = data;
  const f = (id) => faq.find((x) => x.id === id);
  const nsfas = dates.find((d) => d.id === 'nsfas-2027');

  const feeRow = (row) => `
  <li class="date">
    <div class="date__when"><span class="date__day">${esc(uniById[row.university_id] ? uniById[row.university_id].short_name : row.university_id)}</span></div>
    <div class="date__what">
      <p class="date__title">${esc(row.fee)}</p>
      <p class="small">${verificationTag(row.verification)} ${link(row.source_url, hostOf(row.source_url))}</p>
    </div>
  </li>`;

  const card = (b) => `
  <article class="card bursary" data-deadline="${esc(b.deadline || '')}">
    <div class="badge-row">${verificationTag(b.verification || 'verified')}<span class="pill" data-countdown></span></div>
    <h3>${esc(b.name)}</h3>
    <p class="card__meta">${esc(b.provider)}</p>
    <p><strong>Closes:</strong> ${b.deadline ? esc(prettyDate(b.deadline)) : 'date not confirmed'}</p>
    <p><strong>For:</strong> ${esc(b.field_of_study)}</p>
    <p><strong>Who can apply:</strong> ${esc(b.eligibility)}</p>
    ${b.note ? `<p class="small muted">${esc(b.note)}</p>` : ''}
    <div class="btn-row"><a class="btn btn--primary" href="${esc(b.apply_url)}" target="_blank" rel="noopener">Apply</a></div>
    <p class="source"><span class="source__label">Source:</span> ${link(b.source_url, hostOf(b.source_url))}</p>
  </article>`;

  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">Paying for it</p>
    <h1>Costs & aid: application fees, NSFAS and bursaries</h1>
    <p class="lead">The biggest reason learners miss out on funding isn’t their marks – it’s a deadline that went past while they were busy. Here’s what we’ve verified.</p>
  </div>
</section>

<section class="section wrap wrap--narrow" id="fees">
  ${sectionHead('💳', 'What it costs just to apply', 'Separate from tuition – this is the once-off fee most universities charge to process your application. A handful charge nothing.')}
  ${fees.length ? `<ul class="dates dates--plain">${fees.slice().sort((a, b) => (uniById[a.university_id]?.short_name || '').localeCompare(uniById[b.university_id]?.short_name || '')).map(feeRow).join('')}</ul>` : ''}
  <p class="small muted">Only the universities we’ve confirmed a fee for are listed. No fee here yet usually just means we haven’t checked it – not that it’s free. The university’s own page (linked on its page here) always has the current amount.</p>
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('⏰', 'Open right now')}
  <div class="callout callout--warn"><p><strong>NSFAS closes on ${esc(prettyDate(nsfas.date_end))}.</strong> It is a <strong>separate</strong> application from applying to a university – doing one doesn’t do the other.</p></div>
  <div class="stack" id="bursary-list">${bursaries.map(card).join('')}</div>
  ${claims(f('nsfas').answer.slice(1))}
  ${checksBox(f('nsfas').checks)}
</section>

<section class="section wrap wrap--narrow" id="more">
  ${sectionHead('🔎', 'More bursaries?', 'We list a bursary only when we’ve read its closing date and terms on the provider’s own page. Researching them is ongoing, so the list is short on purpose.')}
  ${claim({ level: 'general', text: 'Many bursaries are offered by companies, professional bodies and the universities themselves, and most are aimed at particular fields of study. We haven’t verified any beyond NSFAS yet, so we don’t list them.' })}
  ${checksBox([
    { label: 'The financial aid office of the university you’re applying to – find it on our Ask a university page', url: '/ask-a-university.html' },
    { label: 'The provider’s own website (never a site that asks you to pay)', url: null },
    { label: 'Your school’s guidance teacher', url: null },
  ])}
  <div class="callout">
    <h3>🛡️ Stay safe</h3>
    <p>${tag('general', 'Advice, not from an official source')} Nobody legitimate charges you to apply for a bursary or to “secure” a place. If someone asks for money up front, it’s a scam.</p>
    ${claims(f('free').answer.slice(2))}
  </div>
</section>

<section class="section wrap wrap--narrow" id="reminders">
  ${sectionHead('📲', 'WhatsApp me before deadlines', 'Be honest – do you check that inbox? We’re setting up WhatsApp reminders for deadlines.')}
  <div class="card">
    <form id="reminder-form" novalidate>
      <div class="field">
        <label for="reminder-phone">Your WhatsApp number</label>
        <input type="tel" id="reminder-phone" name="phone" placeholder="082 123 4567" autocomplete="tel" inputmode="tel" required>
        <span class="hint">South African numbers. We only use it for deadline reminders.</span>
      </div>
      <div class="field">
        <label for="reminder-field">What do you want to study? (optional)</label>
        <input type="text" id="reminder-field" name="field" placeholder="Nursing, engineering, teaching…" autocomplete="off">
      </div>
      <label class="check"><input type="checkbox" id="reminder-consent"> <span>Yes, WhatsApp me about deadlines. I can stop any time. See the <a href="/privacy.html">privacy page</a>.</span></label>
      <div class="btn-row"><button type="submit" class="btn btn--primary btn--big">Sign me up</button></div>
      <div id="reminder-status" aria-live="polite"></div>
    </form>
  </div>
</section>`;

  return [{
    path: '/bursaries.html',
    title: 'Application fees, NSFAS and bursaries for South African students',
    description: `What it costs to apply to each university, plus NSFAS (closes ${prettyDate(nsfas.date_end)}) and verified bursaries – with WhatsApp deadline reminders.`,
    body,
    scripts: ['/assets/js/bursaries.js'],
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Costs & aid', path: '/bursaries.html' }],
  }];
}
