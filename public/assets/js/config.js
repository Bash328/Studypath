// Site configuration.
//
// The site is fully static: pages, the calculator and all the data work with no server.
// Only two features need a backend, because a static host cannot store anything:
//   - WhatsApp reminder sign-ups  (POST /api/reminders)
//   - "Ask us a question"         (POST /api/questions)
//
// They are served by the optional Cloudflare Worker in src/index.js. Set API_BASE to
// wherever that Worker lives:
//
//   ''                                  same origin as the site (Worker serves both)
//   'https://api.studypath.co.za'       a Worker on its own subdomain
//   'https://studypath.<you>.workers.dev'
//
// While API_BASE is '' AND the site is on a static host with no /api, the two forms show
// a friendly "not switched on yet" message instead of failing silently.

export const API_BASE = 'https://studypath.cwakiku.workers.dev';
