import { sectionHead } from '../lib/components.mjs';

export function privacyPage() {
  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">Plain language</p>
    <h1>Privacy</h1>
    <p class="lead">Short version: no accounts, no ads, and your marks stay on your device. Here is exactly what is and isn’t collected.</p>
  </div>
</section>

<section class="section wrap wrap--narrow">
  ${sectionHead('🔒', 'What stays on your device')}
  <div class="card">
    <p><strong>Your marks.</strong> The calculator works out your results inside your browser. The marks you type are saved on your own device (so you don’t have to type them again) and are <strong>not sent to us</strong>. You can clear them with the “Clear my marks” button or by clearing your browser’s site data.</p>
    <p><strong>Your grade.</strong> If you tap your grade on the home page, we remember it on your device only.</p>
  </div>

  ${sectionHead('📨', 'What you choose to send us')}
  <div class="stack">
    <div class="card"><h3>WhatsApp reminders</h3><p>If you sign up, we store the <strong>phone number</strong> you give, the field of study you optionally type, and the fact that you agreed. We use it only to send you deadline reminders. You can stop any time – use the <a href="/ask.html">Ask us</a> page and tell us to remove your number.</p></div>
    <div class="card"><h3>Questions</h3><p>When you ask a question we store the text. Contact details are optional; if you add them, we use them only to reply to that question. Please don’t put an ID number or other private details in a question.</p></div>
    <div class="card"><h3>If you are under 18</h3><p>Please ask a parent or guardian before you give us your phone number or other contact details.</p></div>
  </div>

  ${sectionHead('📊', 'Counting visits')}
  <div class="card">
    <p>We may use analytics to see which pages help learners – for example, how many people open a source link. Cloudflare Web Analytics doesn’t use cookies. If we ever turn on Google Analytics, we’ll ask your permission first, and everything works if you say no.</p>
  </div>

  ${sectionHead('🌐', 'Other things to know')}
  <div class="card">
    <ul class="tidy">
      <li>Our text uses <strong>Google Fonts</strong>, so your browser contacts Google when a page loads.</li>
      <li>Many links take you to a university’s or government’s website. Their privacy rules apply there, not ours.</li>
      <li>We have no accounts, no payments and no advertising.</li>
      <li>We try to collect only what we need.</li>
    </ul>
  </div>
</section>`;

  return [{
    path: '/privacy.html',
    title: 'Privacy – what Studypath does and doesn’t collect',
    description: 'Studypath has no accounts and no ads, and the marks you enter stay on your device. Here is exactly what is collected if you sign up for reminders or ask a question.',
    body,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Privacy', path: '/privacy.html' }],
  }];
}

export function notFoundPage() {
  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <h1>We can’t find that page 🤔</h1>
    <p class="lead">It might have moved, or the link might be wrong. Here’s where most people are heading:</p>
    <div class="btn-row">
      <a class="btn btn--primary btn--big" href="/calculator.html">What do I qualify for?</a>
      <a class="btn btn--ghost btn--big" href="/careers.html">Browse careers</a>
      <a class="btn btn--ghost btn--big" href="/faq.html">FAQ</a>
    </div>
  </div>
</section>`;
  return [{ path: '/404.html', title: 'Page not found', description: 'That page could not be found.', body, noindex: true }];
}
