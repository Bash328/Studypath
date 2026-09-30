// Analytics and event tracking.
//
// CONFIGURE ME: fill in the ids below and tracking starts working. Nothing loads and
// nothing is sent until an id is set, so the site is safe to deploy as-is.
//
//   ga4MeasurementId          - Google Analytics 4, looks like "G-XXXXXXXXXX"
//   cloudflareWebAnalyticsToken - Cloudflare Web Analytics token (privacy-friendly,
//                                no cookies, no consent banner needed)
//
// We default to Cloudflare Web Analytics being enough on its own. GA4 is there if
// Riot wants funnels and audiences later.

export const ANALYTICS = {
  ga4MeasurementId: '',
  cloudflareWebAnalyticsToken: '',
  /** GA4 sets cookies, so it waits for consent. Cloudflare Web Analytics does not. */
  requireConsentForGa4: true,
};

const CONSENT_KEY = 'studypath.analytics-consent';

const readConsent = () => {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
};
const writeConsent = (value) => {
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* private browsing - fine */ }
};

let gaReady = false;

function loadScript(src, attrs = {}) {
  const s = document.createElement('script');
  s.src = src;
  s.defer = true;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  document.head.append(s);
  return s;
}

function startCloudflare() {
  if (!ANALYTICS.cloudflareWebAnalyticsToken) return;
  loadScript('https://static.cloudflareinsights.com/beacon.min.js', {
    'data-cf-beacon': JSON.stringify({ token: ANALYTICS.cloudflareWebAnalyticsToken }),
  });
}

function startGa4() {
  if (!ANALYTICS.ga4MeasurementId || gaReady) return;
  gaReady = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ANALYTICS.ga4MeasurementId, { anonymize_ip: true });
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.ga4MeasurementId}`);
}

/**
 * Record something a student did. The events worth watching for this product:
 *   calculator_run   - somebody actually got results
 *   source_click     - somebody checked our citation (this is the trust metric)
 *   career_view, university_view, program_view
 *   bursary_apply_click, reminder_signup
 */
export function track(event, params = {}) {
  if (gaReady && typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
  if (!ANALYTICS.ga4MeasurementId && !ANALYTICS.cloudflareWebAnalyticsToken) {
    // Nothing configured yet - make events visible while developing.
    console.debug('[track]', event, params);
  }
}

/** Show the consent bar only if something that actually needs consent is configured. */
function maybeAskConsent() {
  if (!ANALYTICS.ga4MeasurementId || !ANALYTICS.requireConsentForGa4) return;
  const existing = readConsent();
  if (existing === 'granted') return startGa4();
  if (existing === 'denied') return;

  const bar = document.createElement('div');
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Cookie choice');
  bar.style.cssText =
    'position:fixed;left:16px;right:16px;bottom:16px;z-index:60;max-width:640px;margin:auto;' +
    'background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;box-shadow:var(--shadow)';
  bar.innerHTML =
    '<p style="margin:0 0 10px">We would like to use analytics cookies to see which parts of Studypath help students. ' +
    'You can say no and everything still works.</p>' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
    '<button class="btn btn--primary" data-choice="granted">Allow</button>' +
    '<button class="btn btn--ghost" data-choice="denied">No thanks</button></div>';
  bar.addEventListener('click', (e) => {
    const choice = e.target.getAttribute && e.target.getAttribute('data-choice');
    if (!choice) return;
    writeConsent(choice);
    if (choice === 'granted') startGa4();
    bar.remove();
  });
  document.body.append(bar);
}

startCloudflare();
document.addEventListener('DOMContentLoaded', maybeAskConsent);
