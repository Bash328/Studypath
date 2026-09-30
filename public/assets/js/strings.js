// All UI text that JavaScript generates lives here, not inline in the logic.
//
// Translating Studypath into other South African languages is a later phase (Riot was
// explicit about that), so we are NOT building an i18n library now. We are just making
// sure it will not be painful later:
//   - JS-generated text comes from this object, via t('key')
//   - static HTML text carries data-i18n="key" so a translation pass can swap it
//     while still shipping real English in the HTML for search engines
//
// To add a language later: add a sibling object, pick it from navigator.language or a
// ?lang= param, and merge over EN.

export const EN = {
  'common.loading': 'Loading…',
  'common.error': 'Something went wrong loading this. Try refreshing the page.',
  'common.retry': 'Try again',
  'common.source': 'Source:',
  'common.sourceExplain': 'Every requirement on this site links to the official university page or PDF that states it. If we cannot cite it, we do not show it.',
  'common.viewSource': 'View the official page',
  'common.noResults': 'Nothing matched that. Try a different search.',
  'common.moreComing': 'More universities are being added — we only publish a university once we have its requirements from official sources.',
  'common.programsAt': 'programmes at',
  'common.universities': 'universities',
  'common.search': 'Search',
  'common.all': 'All',
  'common.clear': 'Clear',

  'careers.title': 'Career explorer',
  'careers.searchPlaceholder': 'Search careers — try "nurse" or "engineer"',
  'careers.typicalSubjects': 'School subjects that usually help',
  'careers.subjectsCaveat': 'This is general guidance, not an admission requirement. The actual requirements are on each programme below, with its source.',
  'careers.noPrograms': 'We have not captured a verified programme for this career yet. It is queued for the next data pass.',
  'careers.programsHeading': 'Degrees that lead here',

  'unis.title': 'Universities',
  'unis.programCount': 'programmes captured',
  'unis.scoringHeading': 'How this university scores you',
  'unis.gapsHeading': 'What we could not verify',
  'unis.gapsIntro': 'We publish our gaps. These are the things we could not confirm from an official source for this university.',

  'calc.title': 'Subject & APS calculator',
  'calc.addSubject': 'Add a subject',
  'calc.remove': 'Remove',
  'calc.subject': 'Subject',
  'calc.mark': 'Mark (%)',
  'calc.calculate': 'See what I qualify for',
  'calc.recalculate': 'Update my results',
  'calc.needMore': 'Add at least 4 subjects with marks so we can work something out.',
  'calc.duplicate': 'You have added that subject twice — remove one of them.',
  'calc.workingOut': 'Working out your score at each university…',
  'calc.notComparable': 'These scores cannot be compared with each other',
  'calc.notComparableBody': 'A Wits APS of 42 is not the same thing as a UP APS of 35 or a UCT FPS of 500. Each university counts different subjects in a different way. We work out each one separately, from the same marks — so read each card on its own and never add them up or compare them.',
  'calc.qualifies': 'You meet the published requirements',
  'calc.close': 'You are close',
  'calc.notYet': 'Not yet',
  'calc.cannotTell': 'We cannot tell you yet',
  'calc.cannotTellWhy': 'These need something we cannot work out from marks alone — an NBT result, a portfolio, or a cut-off the university does not publish.',
  'calc.pointsShort': 'points short',
  'calc.percentShort': '% short',
  'calc.yourScore': 'Your score here',
  'calc.noScore': 'We do not calculate a score for this university',
  'calc.needs': 'Needs',
  'calc.savedLocally': 'Your marks are saved in this browser only. We do not send them anywhere or store them.',
  'calc.reset': 'Clear my marks',
  'calc.selectionNote': 'Extra selection scores this university publishes',

  'bursaries.title': 'Bursary finder',
  'bursaries.closingSoon': 'Closing soon',
  'bursaries.deadline': 'Closes',
  'bursaries.noDeadline': 'No closing date given',
  'bursaries.covers': 'Covers',
  'bursaries.eligibility': 'Who can apply',
  'bursaries.apply': 'Apply',
  'bursaries.empty': 'We have not published any bursaries yet. We only list a bursary once we have its closing date and terms from the provider’s own page — the same rule we use for admission requirements. The first batch is being researched now.',
  'bursaries.remindMe': 'Get a WhatsApp reminder before deadlines close',
  'bursaries.remindBody': 'Most bursary sites only email you. Give us your number and we will WhatsApp you before the deadlines that match what you want to study.',
  'bursaries.phone': 'Your WhatsApp number',
  'bursaries.field': 'What do you want to study? (optional)',
  'bursaries.consent': 'Yes, WhatsApp me about bursary deadlines. I can stop any time.',
  'bursaries.submit': 'Remind me',
  'bursaries.submitted': 'You are on the list. We will WhatsApp you before deadlines close.',

  'flags.conflict': 'Sources disagree',
  'flags.unverified': 'Not fully verified',
  'flags.partially-verified': 'Partly verified',
  'flags.dated-document': 'From an older document',
  'flags.selection': 'Selection programme',
  'flags.no-cutoff-published': 'No cut-off published',
};

let dict = EN;

export const t = (key, fallback) => dict[key] ?? fallback ?? key;

export function setLanguage(next) {
  dict = { ...EN, ...(next || {}) };
  applyStaticTranslations();
}

/** Swap any data-i18n text in the static HTML. A no-op while English is the only language. */
export function applyStaticTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.setAttribute('placeholder', dict[key]);
  });
}
