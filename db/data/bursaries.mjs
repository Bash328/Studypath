// Bursaries and funding we have verified against the provider's own page.
//
// The rule is the same as for admission requirements: a bursary is listed only once we
// have its closing date and terms from an official source, and we link to that source.
// A list of unverified "opportunities" would do more harm than an empty one - bursary
// scams are common and students are exactly who they target.
//
// Researching bursaries is ONGOING. Right now there is one verified entry (NSFAS, from two
// government sources). Do not add a bursary here without a provider page for `source_url`.
//
// Fields match the D1 `bursaries` table.

export const bursaries = [
  {
    id: 'nsfas-2027',
    name: 'NSFAS funding for 2027',
    provider: 'National Student Financial Aid Scheme (NSFAS)',
    field_of_study: 'Any course at a public university or TVET college',
    deadline: '2026-11-18',
    amount_covers: null, // not confirmed from the sources we read, so not stated
    eligibility:
      'South African students planning to study at a public university or TVET college. NSFAS is a separate application from applying to a university. We have not verified the household-income thresholds, so we do not state one - check nsfas.org.za.',
    apply_url: 'https://www.nsfas.org.za',
    source_url: 'https://www.gov.za/news/speeches/minister-buti-manamela-launch-nsfas-2027-application-cycle-18-sep-2026',
    active: 1,
    // Not a D1 column - shown on the page:
    note: 'Applications opened 18 September 2026 and close 18 November 2026; funding outcomes are communicated in December. One other website gave 31 October - the Minister’s launch speech and the SAnews report both say 18 November.',
    verification: 'verified',
  },
];
