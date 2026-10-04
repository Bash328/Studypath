import { sectionHead } from '../lib/components.mjs';
import { iconOrEmoji } from '../lib/icons.mjs';

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
    <div class="card"><h3>Email reminders</h3><p>If you sign up, we store the <strong>email address</strong> you give, the field of study you optionally type, and the fact that you agreed. We use it only to send you deadline reminders. You can stop any time – use the <a href="/ask">Ask us</a> page and tell us to remove your email.</p></div>
    <div class="card"><h3>Questions</h3><p>When you ask a question we store the text. Contact details are optional; if you add them, we use them only to reply to that question. Please don’t put an ID number or other private details in a question.</p></div>
    <div class="card"><h3>If you are under 18</h3><p>Please ask a parent or guardian before you give us your phone number or other contact details.</p></div>
  </div>

  ${sectionHead('📊', 'Counting visits')}
  <div class="card">
    <p>We use <strong>Cloudflare Web Analytics</strong> to count visits and see which pages learners use. It doesn’t use cookies or track you across other sites, so it runs for every visitor without asking.</p>
    <p>We also use Google Analytics to see which pages help learners – for example, how many people open a source link. It sets cookies, so we ask your permission first with a banner the first time you visit; everything on Studypath works the same if you say no, and you can change your mind any time by clearing your browser’s site data.</p>
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
    path: '/privacy',
    title: 'Privacy – what Studypath does and doesn’t collect',
    description: 'Studypath has no accounts and no ads, and the marks you enter stay on your device. Here is exactly what is collected if you sign up for reminders or ask a question.',
    body,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Privacy', path: '/privacy' }],
  }];
}

export function notFoundPage() {
  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <h1>We can’t find that page ${iconOrEmoji('🤔')}</h1>
    <p class="lead">It might have moved, or the link might be wrong. Here’s where most people are heading:</p>
    <div class="btn-row">
      <a class="btn btn--primary btn--big" href="/calculator">What do I qualify for?</a>
      <a class="btn btn--ghost btn--big" href="/careers">Browse careers</a>
      <a class="btn btn--ghost btn--big" href="/faq">FAQs</a>
    </div>
  </div>
</section>`;
  return [{ path: '/404', title: 'Page not found', description: 'That page could not be found.', body, noindex: true }];
}

/** Private page for reading the questions people send. Not linked anywhere, not in the sitemap; the data needs the ADMIN_KEY. */
export function adminQuestionsPage() {
  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <h1>Questions</h1>
    <p class="lead">Questions people have sent through the Ask page.</p>
  </div>
</section>
<section class="section wrap wrap--narrow">
  <div id="admin" aria-live="polite">
    <p class="muted">This page needs JavaScript switched on.</p>
  </div>
</section>`;
  return [{ path: '/admin', title: 'Questions inbox', description: 'Private page.', body, noindex: true, scripts: ['/assets/js/admin.js'] }];
}
