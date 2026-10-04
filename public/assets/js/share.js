// "Share Studypath": a one-time nudge after someone has seen their results, plus the footer link.
// Nothing is sent anywhere - it only opens the phone's share sheet, or copies the link.

import { el, store, track } from './core.js';

const SEEN = 'studypath.share.seen';
const TEXT = 'Studypath shows which South African university programmes your marks can get you into, scored the way each university does it.';

let dialog;

function build() {
  const url = location.origin + '/';
  const status = el('p', { class: 'share__status', role: 'status' }, '');
  const close = () => dialog.close();
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); status.textContent = 'Link copied'; } catch { status.textContent = `Copy this link: ${url}`; }
  };
  dialog = el('dialog', { class: 'share', 'aria-labelledby': 'share-title' },
    el('h2', { id: 'share-title', tabindex: '-1', autofocus: '' }, 'Know someone who needs this?'),
    el('p', {}, 'Send Studypath to a friend or sibling in Grade 9 to 12, or a parent helping them choose. It is free and keeps no accounts.'),
    el('div', { class: 'share__actions' },
      navigator.share ? el('button', { class: 'btn btn--primary', type: 'button', onclick: () => { track('share_click', { how: 'native' }); navigator.share({ title: 'Studypath', text: TEXT, url }).catch(() => {}); } }, 'Share') : null,
      el('a', { class: navigator.share ? 'btn btn--ghost' : 'btn btn--primary', href: `https://wa.me/?text=${encodeURIComponent(`${TEXT} ${url}`)}`, target: '_blank', rel: 'noopener', onclick: () => track('share_click', { how: 'whatsapp' }) }, 'WhatsApp'),
      el('button', { class: 'btn btn--ghost', type: 'button', onclick: () => { track('share_click', { how: 'copy' }); copy(); } }, 'Copy link')),
    status,
    el('button', { class: 'btn btn--ghost share__close', type: 'button', onclick: close }, 'Not now'));
  dialog.addEventListener('close', () => { status.textContent = ''; });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  document.body.append(dialog);
}

export function openShare() {
  if (!dialog) build();
  if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
}

/** Shows the popup once per device, a moment after the results appear. */
export function maybePromptShare() {
  if (store.get(SEEN)) return;
  store.set(SEEN, true);
  setTimeout(openShare, 2500);
}
