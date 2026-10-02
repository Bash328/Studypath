// All 26 public universities in South Africa.
//
// The count and membership come from Universities South Africa (USAf), which states its
// "membership comprises 26 public universities distributed across all 9 provinces"
// (research pack, 30 Sept 2026). Universities whose admission requirements we have
// captured have `hasRequirements` derived at build time from the programmes data - it is
// never set by hand - so the site can grow honestly: a university appears in the
// "what you qualify for" results only once it has sourced programmes, but it is listed
// here (with contacts and dates) from the start.
//
// Only id / name / short_name / website are stored in the `universities` table. The
// other fields (type, cao, ...) feed the generated pages.
//
// `type` is the traditional / comprehensive / university-of-technology label. Only the
// "of Technology" names are self-evident; the traditional-vs-comprehensive split is from
// general knowledge and is shown to students as UNVERIFIED until checked against DHET.
//
// `country_id` matches an id in db/data/countries.mjs. Every university here is South
// African, so it's the same value 26 times today - but it's what the /countries hub
// filters universities by, so a second country's universities slot in without a rewrite.

export const universities = [
  { id: 'uct',  name: 'University of Cape Town',         short_name: 'UCT',    website: 'https://www.uct.ac.za',  type: 'Traditional', country_id: 'south-africa' },
  { id: 'wits', name: 'University of the Witwatersrand', short_name: 'Wits',   website: 'https://www.wits.ac.za', type: 'Traditional', country_id: 'south-africa' },
  { id: 'su',   name: 'Stellenbosch University',         short_name: 'SU',     website: 'https://www.sun.ac.za',  type: 'Traditional', country_id: 'south-africa' },
  { id: 'up',   name: 'University of Pretoria',          short_name: 'UP',     website: 'https://www.up.ac.za',   type: 'Traditional', country_id: 'south-africa' },
  { id: 'ukzn', name: 'University of KwaZulu-Natal',     short_name: 'UKZN',   website: 'https://www.ukzn.ac.za', type: 'Traditional', cao: true, country_id: 'south-africa' },
  { id: 'uj',   name: 'University of Johannesburg',      short_name: 'UJ',     website: 'https://www.uj.ac.za',   type: 'Comprehensive', country_id: 'south-africa' },
  { id: 'uwc',  name: 'University of the Western Cape',  short_name: 'UWC',    website: 'https://www.uwc.ac.za',  type: 'Traditional', country_id: 'south-africa' },
  { id: 'ru',   name: 'Rhodes University',               short_name: 'Rhodes', website: 'https://www.ru.ac.za',   type: 'Traditional', country_id: 'south-africa' },
  { id: 'nwu',  name: 'North-West University',           short_name: 'NWU',    website: 'https://www.nwu.ac.za',  type: 'Traditional', country_id: 'south-africa' },
  { id: 'ufs',  name: 'University of the Free State',    short_name: 'UFS',    website: 'https://www.ufs.ac.za',  type: 'Traditional', country_id: 'south-africa' },

  // Not yet researched for requirements. Listed so students can still find their contacts
  // and closing dates; they join the calculator once their programmes are captured.
  { id: 'nmu',     name: 'Nelson Mandela University',                 short_name: 'NMU',     website: 'https://www.mandela.ac.za',  type: 'Comprehensive', country_id: 'south-africa' },
  { id: 'ul',      name: 'University of Limpopo',                     short_name: 'UL',      website: 'https://www.ul.ac.za',       type: 'Traditional', country_id: 'south-africa' },
  { id: 'univen',  name: 'University of Venda',                       short_name: 'Univen',  website: 'https://www.univen.ac.za',   type: 'Comprehensive', country_id: 'south-africa' },
  { id: 'wsu',     name: 'Walter Sisulu University',                  short_name: 'WSU',     website: 'https://www.wsu.ac.za',      type: 'Comprehensive', country_id: 'south-africa' },
  { id: 'ufh',     name: 'University of Fort Hare',                   short_name: 'UFH',     website: 'https://www.ufh.ac.za',      type: 'Traditional', country_id: 'south-africa' },
  { id: 'spu',     name: 'Sol Plaatje University',                    short_name: 'SPU',     website: 'https://www.spu.ac.za',      type: 'Traditional', country_id: 'south-africa' },
  { id: 'ump',     name: 'University of Mpumalanga',                  short_name: 'UMP',     website: 'https://www.ump.ac.za',      type: 'Traditional', country_id: 'south-africa' },
  { id: 'cut',     name: 'Central University of Technology',          short_name: 'CUT',     website: 'https://www.cut.ac.za',      type: 'University of Technology', country_id: 'south-africa' },
  { id: 'cput',    name: 'Cape Peninsula University of Technology',   short_name: 'CPUT',    website: 'https://www.cput.ac.za',     type: 'University of Technology', country_id: 'south-africa' },
  { id: 'dut',     name: 'Durban University of Technology',           short_name: 'DUT',     website: 'https://www.dut.ac.za',      type: 'University of Technology', cao: true, country_id: 'south-africa' },
  { id: 'tut',     name: 'Tshwane University of Technology',          short_name: 'TUT',     website: 'https://www.tut.ac.za',      type: 'University of Technology', country_id: 'south-africa' },
  { id: 'mut',     name: 'Mangosuthu University of Technology',       short_name: 'MUT',     website: 'https://www.mut.ac.za',      type: 'University of Technology', cao: true, country_id: 'south-africa' },
  { id: 'vut',     name: 'Vaal University of Technology',             short_name: 'VUT',     website: 'https://vut.ac.za',          type: 'University of Technology', country_id: 'south-africa' },
  { id: 'unizulu', name: 'University of Zululand',                    short_name: 'UniZulu', website: 'https://www.unizulu.ac.za',  type: 'Comprehensive', cao: true, country_id: 'south-africa' },
  { id: 'unisa',   name: 'University of South Africa',                short_name: 'UNISA',   website: 'https://www.unisa.ac.za',    type: 'Comprehensive (distance)', country_id: 'south-africa' },
  { id: 'smu',     name: 'Sefako Makgatho Health Sciences University', short_name: 'SMU',    website: 'https://www.smu.ac.za',      type: 'Traditional (health)', country_id: 'south-africa' },
];

// Sources for the statements above, so the site can cite them.
export const DIRECTORY_SOURCES = {
  count: {
    label: 'Universities South Africa (USAf) - 26 public universities',
    url: 'https://www.usaf.ac.za',
    status: 'reported',
    note: 'From the research pack, quoting USAf. The USAf page itself was not re-read by us.',
  },
  types: {
    label: 'Six of the 26 are universities of technology (CPUT, CUT, DUT, MUT, TUT, VUT) - DHET',
    url: 'https://www.dhet.gov.za',
    status: 'reported',
    note: 'The research pack cites a DHET framework document for the six. The traditional vs comprehensive split is general knowledge, NOT checked against DHET, and is labelled that way on the site.',
  },
  cao: {
    label: 'First-time applicants to UKZN, DUT, MUT and UniZulu apply through the Central Applications Office (CAO)',
    url: 'https://www.cao.ac.za',
    status: 'partly-verified',
    note: 'UKZN confirmed on its own how-to-apply page (CAO fee R250, phone +27 (0)31 268 4444). DUT, MUT and UniZulu are from the research pack.',
  },
};
