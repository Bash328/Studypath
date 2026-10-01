# Studypath

South African high-school guidance for Grade 9–12 learners: choose your subjects → explore
careers → work out your APS **the way each university actually calculates it** → see which
real degrees you qualify for → find the right contact, the right deadline, and the right
bursary. Every claim is tagged with how sure we are of it, and every admission number cites
the official page it came from.

The differentiator versus careerhelper.co.za: **every admission number is sourced and cited
from an official university page, never guessed.** If we can't cite it, we don't show it as
fact — we say we don't know, and point the student at where to check for themselves.

---

## The rules this codebase enforces

These aren't style preferences. They're the product, and the code is built to make breaking
them hard.

**1. Every number cites an official source.**
`programs.source_url` is required, and `scripts/gen-seed.mjs` refuses to build the seed if any
programme row is missing one, uses a non-`https` URL, or cites a host that isn't an official
domain. The same rule applies to `db/data/bursaries.mjs`. The citation renders as a visible
line of text next to the number on every card — never a tooltip.

**2. Scores are never comparable across universities.**
A "Wits APS of 42" is not a "UP APS of 35" and not a "UCT FPS of 500". There is no universal
score anywhere in this product. `src/scoring.js` holds one implementation per
`scoring_system`, each computing that university's own number from the same set of marks, and
results are always presented per university. `scripts/test-scoring.mjs` asserts the same marks
produce different numbers across every computable system, reproduces several universities'
**own worked examples** (UCT's and UFS's published sample calculations), and checks every
system's published formula against `src/scoring-audit.js` — the record of what was actually
read on which official page, and when.

**3. We never invent a figure we haven't verified — and we say which level of "sure" we are.**
One scoring system (Wits's Health Sciences Composite Index) is `computable: false` because
Wits itself publishes no cut-off for it; it returns a reason instead of a number. Beyond
scores, every piece of guidance content (FAQ answers, Grade 10 subject advice, contacts,
dates) carries a trust level:

- **Checked** — read on the official page ourselves.
- **From our research** — a source is cited but we haven't personally re-read it (often
  because the site blocks automated fetches).
- **Not from an official source** — general advice or common knowledge, labelled as such,
  with suggestions for where the student can check it themselves.
- **Could not be confirmed** / **Sources disagree** — shown rather than silently resolved.

This is `site/lib/html.mjs`'s `claim()`/`tag()` machinery — see `/data-sources` and
`/faq` for what it looks like rendered.

---

## Stack

No framework. The site is **fully static** and works with zero backend; a small optional
Cloudflare Worker exists only for the two things a static host genuinely can't do.

| Part | What it is |
|---|---|
| The site | Static HTML/CSS/vanilla JS, generated into `public/` by `npm run build`. Works on any static host — GitHub Pages, Cloudflare Pages, a plain file server. |
| The calculator | Runs **entirely in the browser**, using the same scoring engine the (optional) API uses — see "The shared engine" below. A student's marks never have to leave their device. |
| The optional API | One small Cloudflare Worker (`src/index.js`) for two things only: email reminder sign-ups and "ask us a question" submissions. Everything else works with no API at all. |
| Database | D1 `pathwise` (id `2cfc439e-fa19-4213-bba2-88255be8202d`) — only used by the Worker, for `reminder_optins` and `questions`. The site's own data lives in `db/data/*.mjs` and does not need D1. |
| Auth / payments | None. Free product, no accounts, by design. |

```
db/data/*.mjs          THE SOURCE OF TRUTH: universities, careers, programmes, research log,
                        contacts, dates, FAQ, Grade 10 guidance, bursaries. Reviewable, commented.
site/
  lib/                  data.mjs (loads+derives from db/data), html.mjs (trust-tag rendering),
                        layout.mjs (page shell/nav), components.mjs (cards)
  pages/*.mjs           one module per page/page-family; each returns page descriptors
src/
  scoring.js            per-university scoring + requirement checking
  scoring-audit.js       what we checked each formula against, and what we couldn't confirm
  subjects.js            the NSC subject list
  qualify-core.js        pure "marks → results" logic - used by BOTH the browser and the Worker
  shape.js, index.js     the optional Worker: DB row shaping + the two POST routes
scripts/
  build-pages.mjs        db/data + site/ → public/*.html, public/data/*.json, sitemap, robots
  gen-seed.mjs            db/data → db/seed.sql, for the Worker's D1 (validates as it writes)
  test-scoring.mjs       scoring engine checks, incl. universities' own worked examples
  test-api.mjs, test-sql.mjs, d1-shim.mjs, dev-server.mjs   local test/preview tooling
public/
  assets/css/site.css     the one stylesheet (hand-written)
  assets/js/*.js          hand-written: app.js, calculator.js, careers.js, dates.js, faq.js,
                           grade10.js, askuni.js, ask.js, home.js, bursaries.js, analytics.js,
                           core.js (shared DOM/data helpers), config.js (API_BASE)
  assets/js/engine/       GENERATED - a copy of src/{subjects,scoring,scoring-audit,qualify-core}.js
                           so the calculator can run client-side with zero drift from the Worker
  *.html, data/*.json,
  careers/, universities/,
  sitemap.xml, robots.txt,
  CNAME, .nojekyll        ALL GENERATED by `npm run build` - not committed, see .gitignore
```

## Getting started

```bash
npm install       # only wrangler (devDependency); build/test need no packages at all
npm test          # scoring + API checks - no network, no Cloudflare account needed
npm run build     # generates public/ from db/data/ + site/
npm run preview   # serves public/ + the API locally at http://localhost:8788 (real SQLite, no Cloudflare account)
```

Everything under `npm test` and `npm run build` uses only Node's own built-ins (`node:fs`,
`node:sqlite`, …) — there's no third-party dependency on that path at all.

## Deploying

Two independent pieces. You can ship just the first and the whole site works; the second only
unlocks the email reminder and "ask a question" forms.

### 1. The site → GitHub Pages (automatic)

`.github/workflows/deploy.yml` builds and publishes `public/` on every push to `main`. **One-time
setup you need to do yourself:** in the repo's **Settings → Pages**, set **Source** to **GitHub
Actions**. After that, pushing to `main` is the whole deploy.

To build locally for another static host instead, run `SITE_ORIGIN=https://yourdomain npm run
build` and upload `public/`.

### 2. The optional API → Cloudflare Worker

Needed only for `/api/reminders` and `/api/questions`. Skip this entirely if you don't need
those two forms yet — the rest of the site (including the calculator) doesn't call it.

```bash
npm run deploy     # builds, then `wrangler deploy` (needs `wrangler login` or CLOUDFLARE_API_TOKEN)
```

Then point the site at it: edit `API_BASE` in `public/assets/js/config.js` (e.g.
`'https://studypath-api.<you>.workers.dev'`) and rebuild/redeploy the site. `wrangler.toml`'s
`SITE_ORIGIN` controls which origins the Worker's CORS headers allow to call it.

If you also want the Worker to serve the full site itself (site + API from one Cloudflare
deployment, as an alternative to GitHub Pages), `wrangler.toml` already has an `[assets]`
binding pointed at `public/` — `wrangler deploy` ships both together.

## Changing the data

Edit the modules in `db/data/` — never `db/seed.sql`, which is generated.

```bash
npm run build                                   # the static pages + JSON pick it up immediately
npm run seed:generate && npm run seed:apply      # only if you also use the Worker's D1 path
```

`gen-seed.mjs` validates before it writes: unique ids, an official `https` source on every
programme and bursary, a known `scoring_system`/`score_type`, and valid university/career
references. It fails rather than emitting an unciteable row. It's also **non-destructive**: it
`UPSERT`s by id, so rows added to D1 directly by a recurring research task survive a re-seed.

### How a programme row is shaped

`subject_requirements` is a documented superset of `[{subject, min_percent}]`, because real SA
admission rules need more than that. See `db/data/_helpers.mjs`:

```js
{ subject: 'Mathematics', min_percent: 70 }          // needs 70%
{ subject: 'Mathematics', min_level: 6 }             // needs NSC level 6 (70%+)
{ subject: 'English', hl_min_percent: 50, fal_min_percent: 60 }  // different HL/FAL bar
{ any_of: [ ... ] }                                  // "Maths L4 OR Maths Lit L6"
{ label: 'Portfolio', note: '…', not_computable: true }  // shown, never used for a verdict
```

An `any_of` only "uses up" whichever alternative actually matched the student's marks (not
every alternative named) — see the "UCT Health Sciences + both sciences" test in
`test-scoring.mjs` for why that distinction matters for degrees that also ask for "your next 3
best other subjects".

### Caveat flags on programmes

Encoded as leading `[tokens]` on `notes`; `src/shape.js` strips them into a `flags` array so
the UI badges them instead of burying them in prose:

`conflict` · `unverified` · `partially-verified` · `dated-document` · `selection` ·
`no-cutoff-published`

### The other datasets

| File | Powers |
|---|---|
| `db/data/contacts.mjs` | `/ask-a-university`, the contact card on each university page |
| `db/data/dates.mjs` | `/dates`, the "coming up" widget on the home page |
| `db/data/faq.mjs` | `/faq`, jargon cards on the home page, `/ask`'s suggestions |
| `db/data/grade10.mjs` | `/grade-10-subjects` — the hand-written guidance; the maths-vs-Maths-Lit tables on that page are *computed* from `db/data/programs-*.mjs`, not typed |
| `db/data/bursaries.mjs` | `/bursaries`. Only NSFAS is verified so far — see "Known gaps" |

Every row in these files carries a `verification`/`level` field (`verified` / `reported` /
`unverified` / `general`) and a `source_url` where applicable, rendered the same way the
programme data is.

## Scoring systems

| System | Computable | How | Audit status |
|---|---|---|---|
| `UCT_FPS600` | yes | English% + best 5 others (required subjects forced in) excl. LO, out of 600 | verified |
| `UCT_FPS800` | yes | English + Maths×2 + Physical Sciences×2 + best 3 others, out of 800 (UCT Science) | verified |
| `WITS_APS_incLO` | yes | Best 7 incl. LO on an 8-point scale; English & Maths +2 at level 5+; LO worth only 4/3/2/1 | verified |
| `UP_APS_exLO` | yes | 6 best NSC levels, excl. LO | verified |
| `UJ_APS_exLO` | yes | 6 best NSC levels (required subjects forced in), excl. LO | partial |
| `UKZN_APS_exLO` | yes | 6 best on an 8-point scale, excl. LO, out of 48 | verified |
| `SU_aggregate_pct` | yes | Average of 6 best subjects excl. LO, as a percentage (SU uses no APS) | partial |
| `RU_pct_div10` | yes | Sum of 6 best percentages excl. LO, ÷ 10 | verified |
| `UWC_weighted` | yes | Weighted points from UWC's own calculator code; English/Maths weighted highest, out of 65 | verified |
| `NWU_APS` | yes | 6 best on an 8-point scale, excl. LO, out of 48 | verified |
| `UFS_AP` | yes | 6 subjects (compulsory + best of rest) on an 8-point scale + 1 for LO, out of 49 | partial |
| `WITS_COMPOSITE_INDEX` | **no** | 75% school average + 25% NBT; Wits publishes no cut-off to check against | unverified |

"Partial" means the core rule is confirmed but a secondary detail isn't (e.g. UJ's rules were
only seen as excerpts because its site blocks automated fetches). Full detail — what was
checked, against which official page, and what's still open — is in `src/scoring-audit.js` and
rendered on `/data-sources#scoring`.

Stellenbosch also publishes two selection formulas (Engineering out of 800, Science
`[(Maths×2)+5 others]/7`) which are computed as extra context, clearly labelled as selection
scores rather than minimums.

## The shared engine

`src/qualify-core.js` (`qualifyAll(marks, programs)`) is the entire "marks in → results out"
logic, with **no I/O** — pure functions over the subjects/scoring modules. It runs two places:

1. **In the browser.** `scripts/build-pages.mjs` copies `src/{subjects,scoring,scoring-audit,
   qualify-core}.js` into `public/assets/js/engine/` on every build, and
   `public/assets/js/calculator.js` imports it directly. A learner's marks are computed on
   their own device and never transmitted anywhere.
2. **In the optional Worker**, at `POST /api/qualify`, for anyone who wants a server-computed
   result (e.g. a future native app) instead of or alongside the client-side one.

Because both call the identical module, the two can never disagree.

## The optional API

Only needed for the two write-only forms below; everything else (including `/api/qualify`, kept
for parity) has a client-side equivalent that needs no server at all.

| Route | Purpose |
|---|---|
| `POST /api/reminders` | Email deadline reminder opt-in (stores consent + address) |
| `POST /api/questions` | "Ask us a question" submissions, for building out the FAQ |
| `GET /api/meta`, `/api/careers`, `/api/universities`, `/api/programs`, `/api/qualify`, `/api/bursaries`, `/api/research-log`, `/api/coverage` | Read-only mirrors of the static data, kept for any future server-rendered or native client |

CORS is open to the origin(s) in `wrangler.toml`'s `SITE_ORIGIN`/`ALLOWED_ORIGINS`, so the
Worker can be deployed separately from the GitHub Pages site and still be called from it.

## SEO

- Every page is **generated as real static HTML** — the numbers, trust tags and source links
  are in the markup, not fetched by JS after load.
- Per-page `<title>`, meta description, canonical, Open Graph and Twitter tags (`site/lib/layout.mjs`).
- JSON-LD: `WebSite` + `SearchAction` + `Organization` on the home page, `FAQPage` on the FAQ,
  calculator and NBT pages, `ItemList` of `Course` on career pages, `CollegeOrUniversity` on
  university pages, `WebApplication` on the calculator, `BreadcrumbList` everywhere.
- `sitemap.xml` and `robots.txt` generated by the build (`/api/` disallowed).
- Semantic headings, skip link, `aria-current` nav, visible focus styles, reduced-motion
  support, light/dark mode, and a layout that works at 390px with a fixed mobile tab bar.

`SITE_ORIGIN` (default `https://studypath.co.za`) drives every canonical/OG/sitemap URL —
override at build time with `SITE_ORIGIN=https://other-domain npm run build`.

## Analytics

`public/assets/js/analytics.js` is configuration-driven and inert until you fill in an id:

```js
export const ANALYTICS = {
  ga4MeasurementId: '',              // "G-XXXXXXXXXX"
  cloudflareWebAnalyticsToken: '',   // cookieless, no consent banner needed
  requireConsentForGa4: true,
};
```

Cloudflare Web Analytics loads immediately (no cookies). GA4 waits for consent and shows a
choice bar, positioned above the mobile tab bar. Events tracked: `calculator_run`,
`source_click` (the trust metric — are students actually checking our citations?),
`bursary_apply_click`, `reminder_signup`, `question_submitted`, `ask_university`.

## Email reminders

`POST /api/reminders` records consent and the address in D1's `reminder_optins` table.
**Sending is not implemented here on purpose.** To finish it, point a scheduled job at
`reminder_optins` joined to upcoming bursary deadlines, and send through whatever transactional
email provider this account uses. `last_sent_at` is there to stop duplicates.

## Localisation

Not translated yet — that's a later phase, deliberately. All page text is generated from
`site/pages/*.mjs` + `db/data/*.mjs` as plain JS template strings (no separate i18n layer yet),
so adding a language means threading a `lang` parameter through `site/lib/layout.mjs` and the
page modules and sourcing translated copy — not a rewrite.

## Known gaps

Published on `/data-sources` rather than hidden, and in `db/data/research-log.mjs`. The
ones worth acting on first:

1. **Bursaries** — only NSFAS is verified. The finder, deadline countdown and email opt-in
   are built and working; more bursaries need a provider page to cite before they're added.
2. **16 universities** have no admission requirements captured yet (contacts and dates are
   there for all 26 already) — see `/universities`'s "Coming soon" section.
3. **UJ** — every programme row came from search-indexed text rather than the full official
   page, because UJ's site and prospectus PDF both block automated fetches.
4. **UCT Law, Science and Humanities numeric cut-offs** — the subject requirements are
   captured but the prospectus PDF was truncated before the numeric FPS figures for these
   three faculties.
5. **NBT logistics** (registration, fees, test centres) — not sourced from the NBT Project
   itself, so deliberately absent from `/nbt` beyond what each university states.
6. **NSFAS eligibility thresholds** — the 2027 cycle's dates are confirmed from two government
   sources, but household-income thresholds weren't, so `/bursaries` doesn't state one.
