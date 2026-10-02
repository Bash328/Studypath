import { esc, tag, link, hostOf } from '../lib/html.mjs';
import { ASK_TOPICS } from '../lib/data.mjs';
import { verificationTag, sectionHead } from '../lib/components.mjs';

export function askUniversityPage(data) {
  const { universities, contactsByUni } = data;
  const sorted = [...universities].sort((a, b) => (b.hasRequirements - a.hasRequirements) || a.name.localeCompare(b.name));

  const primary = (uid) => {
    const list = contactsByUni[uid] || [];
    return list.find((c) => c.kind === 'admissions') || list.find((c) => c.kind === 'call_centre') || list[0];
  };

  const rows = sorted.map((u) => {
    const c = primary(u.id);
    return `<tr>
      <th scope="row"><a href="/universities/${esc(u.id)}#contact">${esc(u.name)}</a>${u.cao ? ' <span class="badge badge--info">CAO</span>' : ''}</th>
      <td data-label="Email">${c && c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : '<span class="muted">not confirmed</span>'}</td>
      <td data-label="Phone">${c && c.phone ? esc(c.phone) : '<span class="muted">not confirmed</span>'}</td>
      <td data-label="How sure?">${c ? verificationTag(c.verification) : ''}</td>
    </tr>`;
  }).join('');

  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">Straight from the source</p>
    <h1>Ask a university directly</h1>
    <p class="lead">For anything about <strong>your</strong> marks, <strong>your</strong> application or <strong>your</strong> degree, the university is the only one who can say for sure. We’ll find the right contact and help you write the message.</p>
  </div>
</section>

<section class="wrap wrap--narrow">
  <div class="card ask-tool" id="ask-tool" data-src="/data/contacts.json">
    <noscript><p>The finder needs JavaScript – the full list of contacts is just below.</p></noscript>

    <h2 class="h3">1. What do you want to ask about?</h2>
    <div class="chip-row" id="topic-chips" role="group" aria-label="Topic">
      ${ASK_TOPICS.map((t, i) => `<button class="chip chip--topic" type="button" data-topic="${esc(t.id)}" aria-pressed="${i === 0 ? 'true' : 'false'}"><span aria-hidden="true">${t.emoji}</span> ${esc(t.label)}</button>`).join('')}
    </div>
    <p class="hint" id="topic-hint">${esc(ASK_TOPICS[0].hint)}</p>

    <h2 class="h3">2. Which university?</h2>
    <div class="field">
      <label class="sr-only" for="uni-select">University</label>
      <select id="uni-select">
        <option value="">Choose a university…</option>
        <optgroup label="Requirements on Studypath">
          ${sorted.filter((u) => u.hasRequirements).map((u) => `<option value="${esc(u.id)}">${esc(u.name)}</option>`).join('')}
        </optgroup>
        <optgroup label="Other universities">
          ${sorted.filter((u) => !u.hasRequirements).map((u) => `<option value="${esc(u.id)}">${esc(u.name)}</option>`).join('')}
        </optgroup>
      </select>
    </div>

    <div id="ask-results" aria-live="polite"></div>
  </div>

  <div class="callout">
    <h3>Before you send</h3>
    <ul class="tidy">
      <li>Put your <strong>question</strong> first and keep it short – call centres answer quickest when it’s one clear question.</li>
      <li>Never send your ID number or bank details by email or WhatsApp.</li>
      <li>Nobody legitimate asks you to pay to have your application looked at. If someone does, it’s a scam.</li>
    </ul>
  </div>
</section>

<section class="section wrap" id="all-contacts">
  ${sectionHead('📒', 'Every university at a glance', 'The main contact for each of the 26 public universities, with how sure we are of it.')}
  <p class="small muted">${tag('verified')} we read it on an official page · ${tag('reported')} from our research, not re-checked yet · ${tag('unverified')} we couldn’t confirm it.</p>
  <div class="table-scroll">
    <table class="data">
      <thead><tr><th scope="col">University</th><th scope="col">Email</th><th scope="col">Phone</th><th scope="col">How sure?</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <p class="small muted jargon-key">Contacts change. We re-check them every application cycle. <strong>CAO</strong> = first-time applications go through the Central Applications Office.</p>
</section>`;

  return [{
    path: '/ask-a-university',
    title: 'Ask a university directly – admissions contacts for all 26 public universities',
    description: 'Find the right admissions email or phone number at any of South Africa’s 26 public universities, with a ready-to-send message – and how sure we are of each contact.',
    body,
    scripts: ['/assets/js/askuni.js'],
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Ask a university', path: '/ask-a-university' }],
  }];
}
