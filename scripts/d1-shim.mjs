// A D1-compatible wrapper over Node's built-in SQLite, loaded with the real schema and
// the real generated seed. It lets the tests run the Worker's actual SQL - the part the
// stub in test-api.mjs never exercises - with no Cloudflare credentials.
//
// Requires Node 22.5+ (node:sqlite).

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

// Mirrors the provisioned D1 schema, plus the reminder_optins table and indexes we added.
const SCHEMA = `
CREATE TABLE universities (id TEXT PRIMARY KEY, name TEXT NOT NULL, short_name TEXT, website TEXT);
CREATE TABLE careers (id TEXT PRIMARY KEY, name TEXT NOT NULL, sector TEXT, description TEXT, typical_subjects TEXT);
CREATE TABLE programs (
  id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL REFERENCES universities(id),
  career_id TEXT REFERENCES careers(id),
  name TEXT NOT NULL, faculty TEXT, duration_years REAL, min_aps INTEGER,
  subject_requirements TEXT, notes TEXT, source_url TEXT NOT NULL,
  verified_at TEXT DEFAULT (datetime('now')),
  scoring_system TEXT, score_type TEXT, intake_year INTEGER, document_date TEXT
);
CREATE TABLE research_log (id TEXT PRIMARY KEY, university_id TEXT, faculty_or_program TEXT, status TEXT, notes TEXT, checked_at TEXT DEFAULT (datetime('now')));
CREATE TABLE bursaries (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, provider TEXT, field_of_study TEXT, deadline TEXT,
  amount_covers TEXT, eligibility TEXT, apply_url TEXT NOT NULL, source_url TEXT NOT NULL,
  active INTEGER DEFAULT 1, updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE questions (
  id TEXT PRIMARY KEY, question TEXT NOT NULL, contact TEXT, consent INTEGER NOT NULL DEFAULT 0,
  page TEXT, status TEXT NOT NULL DEFAULT 'new', answer TEXT,
  created_at TEXT DEFAULT (datetime('now')), answered_at TEXT
);
CREATE TABLE reminder_optins (
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, field_of_study TEXT,
  consent INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), last_sent_at TEXT
);
`;

export function createRealDb() {
  const db = new DatabaseSync(':memory:');
  db.exec(SCHEMA);
  db.exec(readFileSync(new URL('../db/seed.sql', import.meta.url), 'utf8'));

  return {
    raw: db,
    prepare(sql) {
      const stmt = db.prepare(sql);
      let binds = [];
      const self = {
        bind(...args) { binds = args; return self; },
        async all() { return { results: stmt.all(...binds).map((r) => ({ ...r })) }; },
        async first() { const r = stmt.get(...binds); return r ? { ...r } : null; },
        async run() { stmt.run(...binds); return { success: true }; },
      };
      return self;
    },
  };
}
