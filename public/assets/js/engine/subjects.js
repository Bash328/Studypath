// The NSC subjects a student can enter marks for.
//
// `base` is the name used in programme subject_requirements, so 'English Home
// Language' and 'English First Additional Language' both match a requirement
// written against 'English' - while still letting us apply the different HL/FAL
// bar that most universities publish.

export const SUBJECTS = [
  // Languages - a student takes one Home Language and one First Additional Language.
  { id: 'english-hl', name: 'English Home Language', group: 'Languages', base: 'English', lang: 'home' },
  { id: 'english-fal', name: 'English First Additional Language', group: 'Languages', base: 'English', lang: 'fal' },
  { id: 'afrikaans-hl', name: 'Afrikaans Home Language', group: 'Languages', base: 'Afrikaans', lang: 'home' },
  { id: 'afrikaans-fal', name: 'Afrikaans First Additional Language', group: 'Languages', base: 'Afrikaans', lang: 'fal' },
  { id: 'isizulu', name: 'isiZulu', group: 'Languages', base: 'isiZulu', lang: 'home' },
  { id: 'isixhosa', name: 'isiXhosa', group: 'Languages', base: 'isiXhosa', lang: 'home' },
  { id: 'sepedi', name: 'Sepedi', group: 'Languages', base: 'Sepedi', lang: 'home' },
  { id: 'setswana', name: 'Setswana', group: 'Languages', base: 'Setswana', lang: 'home' },
  { id: 'sesotho', name: 'Sesotho', group: 'Languages', base: 'Sesotho', lang: 'home' },
  { id: 'xitsonga', name: 'Xitsonga', group: 'Languages', base: 'Xitsonga', lang: 'home' },
  { id: 'siswati', name: 'siSwati', group: 'Languages', base: 'siSwati', lang: 'home' },
  { id: 'tshivenda', name: 'Tshivenda', group: 'Languages', base: 'Tshivenda', lang: 'home' },
  { id: 'isindebele', name: 'isiNdebele', group: 'Languages', base: 'isiNdebele', lang: 'home' },

  // Mathematics - you take exactly one of these three.
  { id: 'mathematics', name: 'Mathematics', group: 'Mathematics', base: 'Mathematics' },
  { id: 'mathematical-literacy', name: 'Mathematical Literacy', group: 'Mathematics', base: 'Mathematical Literacy' },
  { id: 'technical-mathematics', name: 'Technical Mathematics', group: 'Mathematics', base: 'Technical Mathematics' },

  // Compulsory
  { id: 'life-orientation', name: 'Life Orientation', group: 'Compulsory', base: 'Life Orientation' },

  // Sciences
  { id: 'physical-sciences', name: 'Physical Sciences', group: 'Sciences', base: 'Physical Sciences' },
  { id: 'technical-sciences', name: 'Technical Sciences', group: 'Sciences', base: 'Technical Sciences' },
  { id: 'life-sciences', name: 'Life Sciences', group: 'Sciences', base: 'Life Sciences' },
  { id: 'agricultural-sciences', name: 'Agricultural Sciences', group: 'Sciences', base: 'Agricultural Sciences' },

  // Commerce
  { id: 'accounting', name: 'Accounting', group: 'Commerce', base: 'Accounting' },
  { id: 'business-studies', name: 'Business Studies', group: 'Commerce', base: 'Business Studies' },
  { id: 'economics', name: 'Economics', group: 'Commerce', base: 'Economics' },

  // Humanities & other
  { id: 'geography', name: 'Geography', group: 'Other subjects', base: 'Geography' },
  { id: 'history', name: 'History', group: 'Other subjects', base: 'History' },
  { id: 'information-technology', name: 'Information Technology', group: 'Other subjects', base: 'Information Technology' },
  { id: 'cat', name: 'Computer Applications Technology', group: 'Other subjects', base: 'Computer Applications Technology' },
  { id: 'egd', name: 'Engineering Graphics & Design', group: 'Other subjects', base: 'Engineering Graphics & Design' },
  { id: 'consumer-studies', name: 'Consumer Studies', group: 'Other subjects', base: 'Consumer Studies' },
  { id: 'tourism', name: 'Tourism', group: 'Other subjects', base: 'Tourism' },
  { id: 'visual-arts', name: 'Visual Arts', group: 'Other subjects', base: 'Visual Arts' },
  { id: 'dramatic-arts', name: 'Dramatic Arts', group: 'Other subjects', base: 'Dramatic Arts' },
  { id: 'music', name: 'Music', group: 'Other subjects', base: 'Music' },
  { id: 'design', name: 'Design', group: 'Other subjects', base: 'Design' },
];

export const SUBJECT_BY_ID = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));

export const isLifeOrientation = (s) => s.base === 'Life Orientation';

/**
 * Turn the raw {subjectId: percent} object a student submits into a validated list.
 * Unknown ids and out-of-range marks are dropped rather than silently miscounted.
 */
export function normaliseMarks(raw) {
  const marks = [];
  for (const [id, value] of Object.entries(raw || {})) {
    const subject = SUBJECT_BY_ID[id];
    const percent = Number(value);
    if (!subject) continue;
    if (!Number.isFinite(percent) || percent < 0 || percent > 100) continue;
    marks.push({ ...subject, percent });
  }
  return marks;
}
