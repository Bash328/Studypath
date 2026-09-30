import { esc, md, claims, claim, link, hostOf, tag, plural, checksBox } from '../lib/html.mjs';
import { GRADE10, requirementText } from '../lib/data.mjs';
import { sectionHead } from '../lib/components.mjs';

/** A table of degrees with what each asks for and where that came from. */
function reqTable(programs) {
  if (!programs.length) return '<p class="empty">None captured yet.</p>';
  return `<div class="table-scroll"><table class="data">
  <thead><tr><th scope="col">University</th><th scope="col">Degree</th><th scope="col">What it asks for</th><th scope="col">Source</th></tr></thead>
  <tbody>${programs.map((p) => `<tr>
    <th scope="row">${esc(p.university.shortName)}</th>
    <td>${esc(p.name)}</td>
    <td>${(p.subjectRequirements || []).filter((r) => !(r.label || r.not_computable)).map((r) => esc(requirementText(r))).join('; ') || '<span class="muted">see the source</span>'}</td>
    <td>${link(p.sourceUrl, hostOf(p.sourceUrl))}</td>
  </tr>`).join('')}</tbody></table></div>`;
}

export function grade10Page(data) {
  const { grade10: g10 } = data;
  const t = g10.mathsTotals;
  const pct = (n) => Math.round((n / t.total) * 100);

  const groups = Object.entries(g10.mathsByGroup).sort((a, b) => b[1].total - a[1].total);

  const fieldCards = GRADE10.maths.fields.map((f) => `
    <div class="card field-card">
      <h3><span aria-hidden="true">${f.emoji}</span> ${esc(f.field)}</h3>
      <p class="field-card__verdict">${esc(f.verdict)}</p>
      ${claims(f.paras)}
    </div>`).join('');

  const body = `
<section class="hero hero--slim">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">Grade 9 → Grade 10</p>
    <h1>Choosing your subjects</h1>
    <p class="lead">What you pick now decides which degrees are open to you in Grade 12. Ten minutes here can save you a lot of regret.</p>
  </div>
</section>

<section class="wrap wrap--narrow">
  ${claims(GRADE10.intro)}
  <p class="small muted">${tag('verified')} we read it on an official page · ${tag('reported')} from our research, source cited · ${tag('general')} advice or common knowledge – not from an official source.</p>
</section>

<section class="section wrap wrap--narrow" id="planner-section">
  ${sectionHead('🎯', 'Subject planner', 'Pick one to three careers you’re curious about. We’ll show which subjects the degrees we’ve captured actually ask for.')}
  <div class="card" id="planner" data-src="/data/programs.json" data-careers="/data/careers.json">
    <label for="planner-career" class="sr-only">Add a career</label>
    <div class="planner__add">
      <select id="planner-career"><option value="">Add a career…</option></select>
      <button class="btn btn--primary" type="button" id="planner-add">Add</button>
    </div>
    <div class="chip-row" id="planner-picked" aria-live="polite"></div>
    <div id="planner-out"><p class="muted">Pick a career above to start. (This works out its answer in your browser from the same sourced data as the rest of the site.)</p></div>
  </div>
</section>

<section class="section wrap wrap--narrow" id="floor">
  ${sectionHead('🧱', GRADE10.floor.title)}
  ${claims(GRADE10.floor.paras)}
</section>

<section class="section wrap" id="maths">
  ${sectionHead('➗', GRADE10.maths.title, GRADE10.maths.lead)}
  <div class="card card--accent">
    <h3>What our data says</h3>
    <p>Across the <strong>${t.total}</strong> degrees Studypath has captured:</p>
    <div class="meter" role="img" aria-label="${pct(t['needs-maths'])}% need Mathematics, ${pct(t['accepts-lit'])}% accept Mathematical Literacy, ${pct(t['none-captured'])}% have no Maths rule captured">
      <span class="meter__seg meter__seg--maths" style="width:${pct(t['needs-maths'])}%"></span>
      <span class="meter__seg meter__seg--lit" style="width:${pct(t['accepts-lit'])}%"></span>
      <span class="meter__seg meter__seg--none" style="width:${pct(t['none-captured'])}%"></span>
    </div>
    <ul class="meter__key">
      <li><span class="dot dot--maths"></span><strong>${t['needs-maths']}</strong> (${pct(t['needs-maths'])}%) need Mathematics</li>
      <li><span class="dot dot--lit"></span><strong>${t['accepts-lit']}</strong> (${pct(t['accepts-lit'])}%) accept Mathematical Literacy as an alternative</li>
      <li><span class="dot dot--none"></span><strong>${t['none-captured']}</strong> (${pct(t['none-captured'])}%) have no Maths rule in what we captured</li>
    </ul>
    <div class="table-scroll"><table class="data">
      <thead><tr><th scope="col">Area</th><th scope="col">Degrees</th><th scope="col">Need Maths</th><th scope="col">Accept Maths Lit</th></tr></thead>
      <tbody>${groups.map(([name, c]) => `<tr><th scope="row">${esc(name)}</th><td>${c.total}</td><td>${c['needs-maths']}</td><td>${c['accepts-lit']}</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="small muted">${tag('reported', 'Counted by Studypath')} These numbers are counted from the requirements we captured – each degree below links to its source. They cover only the ${data.stats.universitiesWithData} universities we have so far, so they show a pattern, not the whole country.</p>
  </div>

  <div class="grid grid--2">${fieldCards}</div>
  <div class="callout callout--good">${claim(GRADE10.maths.rule)}</div>

  <h3 class="uni-head">Degrees that accept Mathematical Literacy (from our data)</h3>
  <p class="small">Each of these lists Maths Literacy as an allowed alternative. Note the level or mark it asks for – it is often higher than for Mathematics.</p>
  ${reqTable(g10.acceptsLit)}
</section>

<section class="section wrap" id="sciences">
  ${sectionHead('🧪', GRADE10.sciences.title)}
  <div class="wrap--narrow" style="padding:0">${claims(GRADE10.sciences.paras)}</div>

  <h3 class="uni-head">Medicine (MBChB) at the universities we’ve captured</h3>
  ${reqTable(g10.medicine)}

  <details class="more-table">
    <summary>Show all ${g10.engineering.length} engineering degrees we’ve captured</summary>
    ${reqTable(g10.engineering)}
  </details>
</section>

<section class="section wrap wrap--narrow" id="pitfalls">
  ${sectionHead('🪤', GRADE10.pitfalls.title)}
  <div class="stack">
    ${GRADE10.pitfalls.items.map((i) => `<div class="card"><h3>${esc(i.title)}</h3>${claims(i.paras)}</div>`).join('')}
  </div>
</section>

<section class="section wrap wrap--narrow" id="ask">
  ${sectionHead('🗣️', GRADE10.official.title)}
  ${claims(GRADE10.official.paras)}
  ${checksBox(GRADE10.official.checks)}
  <div class="btn-row"><a class="btn btn--primary" href="/ask-a-university.html">Ask a university</a><a class="btn btn--ghost" href="/careers.html">Explore careers</a></div>
</section>`;

  return [{
    path: '/grade-10-subjects.html',
    title: 'Choosing your Grade 10 subjects – Mathematics or Maths Literacy, and what each degree needs',
    description: 'Picking subjects for Grade 10? See which degrees need Mathematics, which accept Maths Literacy, and what Physical Sciences and Life Sciences open up – counted from real university requirements, each with its source.',
    body,
    scripts: ['/assets/js/grade10.js'],
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Choosing your subjects', path: '/grade-10-subjects.html' }],
  }];
}
