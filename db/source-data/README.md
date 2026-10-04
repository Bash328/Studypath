# Source data store (structure only - empty on purpose)

Purpose: one searchable, plain-text copy of everything we read from official documents and pages,
whether the site uses it or not, so updates and double checks can be done from this folder instead of
reopening PDFs and web pages.

Status: scaffold only. Nothing has been added yet. See research-log.mjs, id
`todo-source-data-store`, for the plan.

## Layout

    db/source-data/
      README.md            this file
      records/<uni>.jsonl  one JSON object per line, one file per university (or topic, e.g. bursaries)

## Record format (one per line)

    {
      "id": "uct-2027-pros-p27-bcom-fps",       unique, stable
      "university_id": "uct",                    or null for national/topic records
      "kind": "requirement | date | fee | contact | note | other",
      "topic": "BCom / BBusSc entry bands",      what it is about, in plain words
      "text": "Band A FPS 435, Mathematics 60%, English HL 50% / FAL 60%",   verbatim or close paraphrase
      "source_url": "https://...",               official page or document
      "source_ref": "2027 Undergraduate Prospectus, p27",
      "document_date": "2026-04-01",             date printed on the document, if any
      "checked": "2026-10-04",                   when we last read it
      "used_by": ["uct-bcom-general"],           programme/date ids that use it; empty means captured but not used yet
      "status": "used | unused | superseded"
    }

## Rules

- Text only. No binary files, no pasted page images.
- Never guess: if a figure could not be read, store it with `"status": "unreadable"` and say why in `text`.
- When a document is replaced by a newer edition, mark the old records `superseded`, do not delete them.
