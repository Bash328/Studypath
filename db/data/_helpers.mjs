// Shared builders for subject_requirements JSON.
//
// The schema comment says `[{subject, min_percent}]`. Real SA admission rules need
// a little more than that, so this is the (documented, superset) shape we store:
//
//   { subject, min_percent }              - needs at least N% in that subject
//   { subject, min_level }                - needs at least NSC achievement level N
//   { subject: 'English', hl_*, fal_* }   - different bar for Home Language vs First Additional
//   { any_of: [ ...items ] }              - "Maths level 4 OR Maths Lit level 6"
//   { label, note, not_computable: true } - portfolio, audition, interview, NBT, job shadowing
//
// Anything with not_computable:true is shown to the student but never used to decide
// whether they qualify - we don't pretend to know their portfolio score.

export const pct = (subject, min_percent) => ({ subject, min_percent });
export const lvl = (subject, min_level) => ({ subject, min_level });

/** English with separate Home Language / First Additional Language bars (percent). */
export const engPct = (hl, fal) => ({ subject: 'English', hl_min_percent: hl, fal_min_percent: fal });
/** English with separate HL / FAL bars (NSC levels). */
export const engLvl = (hl, fal) => ({ subject: 'English', hl_min_level: hl, fal_min_level: fal });

export const anyOf = (...items) => ({ any_of: items });
export const manual = (label, note) => ({ label, note, not_computable: true });

/**
 * Flags are encoded as leading [tokens] on the notes string. The API strips and
 * returns them separately so the UI can show a badge rather than burying the
 * caveat in body text. Known tokens:
 *   conflict            - two official sources disagree; we show both, we pick neither
 *   unverified          - figure not confirmed from an official source
 *   partially-verified  - captured from indexed text of an official page, not the full page
 *   dated-document      - the only official source found is labelled for an earlier intake
 *   selection           - published minimum is a floor; real cut-off is a selection process
 *   no-cutoff-published  - the university does not publish a numeric cut-off
 */
export const flag = (tokens, text) =>
  (Array.isArray(tokens) ? tokens : [tokens]).map((t) => `[${t}]`).join(' ') + ' ' + text;
