// Inline SVG icons (Lucide, ISC license - lucide.dev) read once at build time and embedded
// directly into the HTML, so a 24x24 line icon costs no extra request.
//
// Two sets live under public/assets/icons/:
//   line/   - the generic set, one per emoji we replace site-wide (stroke="currentColor",
//             so each icon just inherits whatever text colour its context already uses)
//   badges/ - the three Studypath-specific "how sure are we?" badges used by tag() in
//             html.mjs, recoloured the same way so they match the site's own
//             --good/--info/--warn palette instead of their shipped colours

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ICON_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../public/assets/icons');

const cache = new Map();
function loadSvg(subdir, name) {
  const key = `${subdir}/${name}`;
  if (cache.has(key)) return cache.get(key);
  const raw = readFileSync(join(ICON_DIR, subdir, `${name}.svg`), 'utf8');
  const svg = raw
    .replace(/<!--[\s\S]*?-->/, '')               // drop the license comment
    .replace(/\s+/g, ' ')                         // the source files spread attributes over lines - collapse to one
    .replace(/class="lucide[^"]*"/, '')           // drop Lucide's own debug class
    .replace(/(width|height)="24"/g, '')          // size via CSS (svg.icon), not fixed px
    .replace(/stroke="#[0-9a-fA-F]{3,6}"/, 'stroke="currentColor"') // badges: match this tag's own colour, not their shipped one
    .replace(/<svg\s/, '<svg class="icon" ')
    .replace(/\s+>/g, '>')
    .trim();
  cache.set(key, svg);
  return svg;
}

/** Emoji character -> icon file name, for the generic set (public/assets/icons/line/). */
const EMOJI_ICON = {
  '✓': 'verified', '🔒': 'privacy-lock', '⚠️': 'warning', '🎓': 'graduation',
  '🧮': 'calculator', '🏫': 'university', '📚': 'books', '📍': 'location-pin',
  '🧠': 'subjects-brain', '🎯': 'target-marks', '⏰': 'deadline-clock', '📅': 'calendar-dates',
  '🧰': 'toolbox-all', '🧭': 'careers-compass', '✍️': 'nbt-writing', '💰': 'money',
  '📞': 'phone-call', '❓': 'faq-help', '📖': 'glossary-book', '🤝': 'trust-handshake',
  '🔎': 'data-search', '🏠': 'home', '💬': 'ask-message', '🌍': 'study-abroad-globe',
  // --- second batch: sector icons, and everything page-specific below ---
  '🎨': 'careers-arts', '🏗️': 'careers-built-environment', '💻': 'careers-technology',
  '🍎': 'careers-education', '⚙️': 'careers-engineering', '⚕️': 'careers-health',
  '⚖️': 'careers-law', '🔬': 'careers-science', '💼': 'careers-business',
  '✅': 'requirements-captured', '🔜': 'coming-soon',
  '🧱': 'bare-minimum', '➗': 'maths-vs-mathlit', '🏛️': 'architecture-property',
  '🧪': 'physical-life-sciences', '🪤': 'pitfalls', '🗣️': 'who-to-ask',
  '🧾': 'application-cost', '✉️': 'email', '🕓': 'deadline-clock', '🔗': 'external-link',
  '💳': 'cost-to-apply', '📲': 'whatsapp-reminder', '🛡️': 'stay-safe',
  '📝': 'applying',
  '🤔': 'questions-to-ask', '📒': 'university-glance',
  '🛤️': 'route', '🔁': 'route-alt', '🗓️': 'timeline',
  '🏷️': 'data-label-tag', '📐': 'data-rules', '🗺️': 'data-coverage', '🛠️': 'report-issue',
  '📨': 'privacy-send', '📊': 'privacy-analytics', '🌐': 'privacy-other',
};

/**
 * Replace every emoji we have an icon for, but only where it is a whole element's entire
 * content (">🎓<") - i.e. a decorative icon slot, never a character inside a sentence. Run
 * once over a finished page's HTML so no page template has to call this itself.
 */
export function sweepEmojiIcons(html) {
  let out = html;
  for (const [emoji, name] of Object.entries(EMOJI_ICON)) {
    out = out.split(`>${emoji}<`).join(`>${loadSvg('line', name)}<`);
  }
  return out;
}

/**
 * For the handful of spots where an emoji sits inline before text ("🔒 Your marks are…",
 * a filter chip's "⏰ Closing dates") rather than alone in its own element - sweepEmojiIcons
 * only touches whole-element content, so those need this explicit call instead. Falls back
 * to the plain emoji, unchanged, when we don't have an icon for it.
 */
export function iconOrEmoji(emoji) {
  const name = EMOJI_ICON[emoji];
  return name ? loadSvg('line', name) : emoji;
}

/** The confidence badge for tag() in html.mjs, or null. Verified/reported/general are the
 * three custom badges; conflict reuses the generic "sources disagree" line icon - there's
 * no dedicated badge shape for it since sources disagreeing is rare enough not to need one. */
const BADGE = {
  verified: ['badges', 'badge-checked'], reported: ['badges', 'badge-partial-research'],
  general: ['badges', 'badge-unverified'], conflict: ['line', 'sources-disagree'],
};
export function badgeIcon(level) {
  const entry = BADGE[level];
  return entry ? loadSvg(...entry) : null;
}

/**
 * The calculator's own "good to go / more to it / nearly / can't tell" legend - a
 * deliberately different badge family from the verified/reported ones above, so the two
 * never look like the same system on a page that shows both (e.g. /faq). Keyed
 * explicitly rather than by character, since its "✓" would otherwise collide with the
 * generic verified.svg mapping above.
 */
const MATCH_BADGE = {
  good: 'match-good-to-go', more: 'match-more-to-it', nearly: 'match-nearly', unknown: 'match-cant-tell',
};
export function matchBadge(key) {
  const name = MATCH_BADGE[key];
  return name ? loadSvg('badges', name) : null;
}
