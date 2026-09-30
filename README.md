# Studypath

South African high-school career guidance. Pick a career interest → see which subjects you
need → work out your APS **the way each university actually calculates it** → see which real
universities and courses you qualify for, with a bursary finder, an NBT guide and study-abroad
information alongside.

The differentiator versus careerhelper.co.za: **every admission number is sourced and cited
from an official university page, never guessed.** If we can't cite it, we don't show it — we
say we don't know instead.

---

## The three rules this codebase enforces

These aren't style preferences. They're the product, and the code is built to make breaking
them hard.

**1. Every number cites an official source.**
`programs.source_url` is `NOT NULL`, and `scripts/gen-seed.mjs` refuses to build the seed if
any row is missing one, uses a non-`https` URL, or cites a host that isn't a university
domain. The citation renders as a visible link next to the number on every card — never a
tooltip.

**2. Scores are never comparable across universities.**
A "Wits APS of 42" is not a "UP APS of 35" and not a "UCT FPS of 500". There is no universal
score anywhere in this product. `src/scoring.js` holds one implementation per
`scoring_system`, each computing that university's own number from the same set of marks, and
results are always presented per university. `scripts/test-scoring.mjs` asserts that the same
marks produce five different numbers across the five computable systems.

**3. We never invent a figure we haven't verified.**
Five scoring systems are marked `computable: false` — UKZN, UWC, NWU, UFS and the Wits
Composite Index — because their formulas weren't confirmed from official pages. They return a
reason instead of a number. Conflicting sources are flagged and both figures shown; we never
silently pick a side.

---

## Stack

Matches the existing pattern in this account — no framework, one Worker.

| Part | What it is |
|---|---|
| Frontend | Static HTML/CSS/vanilla JS in `public/`. No framework, no build step for the app itself. |
| Data-driven pages | Generated as **real static HTML** at build time by `scripts/build-pages.mjs`, so they're indexable. |
| API | One Cloudflare Worker, `src/index.js`, serving `/api/*` from D1. Static assets are served by the same Worker. |
| Database | D1 `pathwise` (`2cfc439e-fa19-4213-bba2-88255be8202d`) — already provisioned, not recreated. |
| Auth / payments | None. Free product, no accounts, by design. |

```
public/              the site (hand-written pages + generated ones)
  assets/css/        one design system stylesheet
  assets/js/         core.js, calculator.js, bursaries.js, strings.js, analytics.js
  careers/*.html     generated, one per career
  universities/*.html generated, one per university
src/
  index.js           the Worker: routing + API handlers
  scoring.js         per-university scoring + requirement checking
  subjects.js        the NSC subject list
db/data/*.mjs        THE SOURCE OF TRUTH for the dataset (reviewable, commented)
scripts/
  gen-seed.mjs       db/data → db/seed.sql (with validation)
  gen-seed-compact.mjs  same data, note text de-duplicated, for constrained uploads
  build-pages.mjs    db/data → static HTML pages + sitemap.xml + robots.txt
  test-scoring.mjs   scoring engine checks against the real dataset
```

## Getting started

```bash
npm install
npm test          # scoring engine checks - no network needed
npm run build     # regenerate the static pages, sitemap and robots.txt
npm run dev       # wrangler dev (needs Cloudflare auth)
```

Deploying needs `wrangler login` or a `CLOUDFLARE_API_TOKEN`. Once authenticated:

```bash
npm run seed:generate && npm run seed:apply   # reload the dataset into D1
npm run deploy                                # build pages, then wrangler deploy
```

## Changing the data

Never edit `db/seed.sql` — it's generated. Edit the modules in `db/data/`, then:

```bash
npm run seed:generate && npm run seed:apply
npm run build     # the static pages read the same source, so they stay in step
```

`gen-seed.mjs` validates before it writes: unique ids, an official `https` `.ac.za` source on
every programme, a known `scoring_system` and `score_type`, and valid university/career
references. It fails the build rather than emitting an unciteable row.

### How a programme row is shaped

`subject_requirements` is a documented superset of the schema comment's
`[{subject, min_percent}]`, because real SA admission rules need more than that. See
`db/data/_helpers.mjs`:

```js
{ subject: 'Mathematics', min_percent: 70 }          // needs 70%
{ subject: 'Mathematics', min_level: 6 }             // needs NSC level 6 (70%+)
{ subject: 'English', hl_min_percent: 50, fal_min_percent: 60 }  // different HL/FAL bar
{ any_of: [ ... ] }                                  // "Maths L4 OR Maths Lit L6"
{ label: 'Portfolio', note: '…', not_computable: true }  // shown, never used for a verdict
```

### Caveat flags

Caveats are encoded as leading `[tokens]` on `notes`, which the API strips into a `flags`
array so the UI can badge them rather than bury them in prose:

`conflict` · `unverified` · `partially-verified` · `dated-document` · `selection` ·
`no-cutoff-published`

## Scoring systems

| System | Computable | How |
|---|---|---|
| `UCT_FPS600` | yes | English% + best 5 others excl. LO, out of 600 |
| `WITS_APS_incLO` | yes | Best 7 incl. LO on an 8-point scale; English & Maths +2 at level 5+; LO worth only 4/3/2/1 |
| `UP_APS_exLO` | yes | 6 best NSC levels, excl. LO |
| `UJ_APS_exLO` | yes | 6 best NSC levels, excl. LO |
| `SU_aggregate_pct` | yes | NSC average excl. LO, as a percentage (SU uses no APS at all) |
| `RU_pct_div10` | yes | Sum of 6 best percentages excl. LO, ÷ 10 |
| `UKZN_APS_exLO` | **no** | 8-point scale, but the %→level table isn't sourced yet |
| `UWC_weighted` | **no** | Weighted points table didn't render on the official page |
| `NWU_APS` / `UFS_AP` | **no** | Formulas not captured from official pages |
| `WITS_COMPOSITE_INDEX` | **no** | 75% school average + 25% NBT; Wits publishes no cut-off |

Stellenbosch also publishes two selection formulas (Engineering out of 800, Science
`[(Maths×2)+5 others]/7`) which are computed as extra context, clearly labelled as selection
scores rather than minimums.

## API

| Route | Purpose |
|---|---|
| `GET /api/meta` | Universities, sectors, counts, all scoring systems |
| `GET /api/subjects` | The NSC subject list for the calculator |
| `GET /api/careers` · `/api/careers/:id` | Career browse + detail with programmes |
| `GET /api/universities` · `/api/universities/:id` | University browse + detail with gaps |
| `GET /api/programs` · `/api/programs/:id` | Programme lookup, filterable |
| `POST /api/qualify` | **The calculator.** `{marks:{subjectId:percent}}` → a score per university and grouped results |
| `GET /api/bursaries` | Bursaries, soonest deadline first |
| `POST /api/reminders` | WhatsApp deadline reminder opt-in |
| `GET /api/research-log` · `/api/coverage` | What we don't know, published |

## SEO

- Career, university and listing pages are **generated as static HTML** — the numbers and
  source links are in the markup, not fetched by JS.
- Per-page `<title>`, meta description, canonical, Open Graph and Twitter tags.
- JSON-LD: `WebSite` + `SearchAction` and `Organization` on the home page, `FAQPage` on the
  calculator and NBT pages, `ItemList` of `Course` on career pages, `CollegeOrUniversity` on
  university pages, `BreadcrumbList` on generated pages.
- `sitemap.xml` (67 URLs) and `robots.txt` generated by the build; `/api/` disallowed.
- Semantic headings, skip link, `aria-current` nav, focus styles, reduced-motion support,
  dark mode, and a layout that works at 400px.

**Before launch:** set `SITE_ORIGIN` in `wrangler.toml` and rebuild — canonicals, Open Graph
URLs and the sitemap all read it. `SITE_ORIGIN=https://realdomain.co.za npm run build`.

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
choice bar. Events tracked: `calculator_run`, `source_click` (the trust metric — are students
actually checking our citations?), `bursary_apply_click`, `reminder_signup`.

## WhatsApp reminders

`POST /api/reminders` records consent and the number in `reminder_optins`. **Sending is not
implemented here on purpose** — the brief says to reuse the existing RingBack WhatsApp sending
pattern rather than build a second notification system. To finish it, point a scheduled job at
`reminder_optins` joined to `bursaries` on an upcoming `deadline`, and send through that
existing sender. `last_sent_at` is there to stop duplicates.

## Localisation

Not translated yet — that's a later phase, deliberately. But it won't be painful to add:
JS-generated text comes from `public/assets/js/strings.js` via `t('key')`, and static HTML
carries `data-i18n` attributes with real English inline (so search engines get real content).
Add a sibling dictionary and call `setLanguage()`.

## Known gaps

Published on `/data-sources.html` rather than hidden, and in `db/data/research-log.mjs` (39
entries). The ones worth acting on first:

1. **UKZN's %→level table** — the single highest-value gap. It blocks score calculation for a
   large university we otherwise have good data for.
2. **UCT Law, Science and Humanities FPS cut-offs** — the prospectus PDF was truncated at page
   54; needs a targeted re-read from page 59.
3. **Bursaries** — the table is empty. The finder, deadline sorting and WhatsApp opt-in are
   built and working, but no bursary has been verified against its provider's page yet.
4. **UJ** — every row came from indexed text rather than full pages; the 2027 prospectus PDF
   was blocked.
5. **16 universities** not researched at all, including UNISA.
6. **NBT logistics** (registration, fees, centres) — not sourced, so deliberately absent from
   the NBT page.
