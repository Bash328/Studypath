// Countries Studypath covers. Today there is one - South Africa - but this file is what
// a second country plugs into: a university just needs country_id to match an id here
// (see db/data/universities.mjs), and the study-abroad page's country picker works
// without a rewrite.

export const countries = [
  {
    id: 'south-africa',
    name: 'South Africa',
    demonym: 'South African',
  },
];

export const countryById = Object.fromEntries(countries.map((c) => [c.id, c]));
