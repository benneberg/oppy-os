# Oppy OS — Actionable Roadmap & TODO

> Philosophy: Build the intelligence layer first. Crawlers without scoring are noise. Scoring without data is guesswork. Wire them together in order.

---

## ✅ Completed

- [x] **Edge Case Guards** — Enforce 1–10 clamp on IQI sliders to prevent scoring anomalies
- [x] **Export Feature** — JSON export button in pipeline header for backup/sharing
- [x] **Interview Transcription** — MediaRecorder-based audio capture → structured metric extraction
- [x] **Dynamic Pricing Sandbox** — LTV/CAC slider simulator alongside monetization descriptions
- [x] **Stalled Projects Detection** — Daily Dashboard feature identifying stalled projects with brief reasons and recommended actions (Re-evaluate Hypothesis, Attempt Outreach, Archive)
- [x] **Refactored OppyScore Algorithm** — Weighted 'Evidence' metrics higher and integrated a risk re-evaluation system where 'Killer Mode' risks are reduced by successful validation experiments (Continue decisions)

---

## Phase 1 — Foundation Fixes (Completed ✅)

- [x] **Replace JSON file storage with SQLite** — SQLite via `better-sqlite3` fully implemented with WAL mode enabled.
- [x] **Wire UserProfile into match scoring** — Dynamic match scores computed from UserProfile using the PRD weighted formula.
- [x] **Make match score visible on opportunity cards** — Match score badge added to PipelineBoard cards.
- [x] **Fix Opportunity type identity crisis** — Type discriminant (`'venture' | 'opportunity'`) added and integrated in board and drawer rendering.

---

## Phase 2 — Real Discovery Pipeline (Completed ✅)

- [x] **Build RedditCrawler** — Sourcing jobs dynamically from subreddits using public API.
- [x] **Build HackerNewsCrawler** — Sourcing remote freelance gigs from Algolia HN Search.
- [x] **Build GitHubBountyCrawler** — Sourcing open-source issue bounties.
- [x] **Implement Scam Detection (rule-based first)** — Scams filtered and penalized using heuristic keyword detection.
- [x] **Implement Deduplication** — Levenshtein fuzzy title deduplication.
- [x] **Add crawler scheduler** — Automated background updates handled by `node-cron`.

---

## Phase 3 — AI Pipeline (Weeks 3–4)

Wire the scoring engine to discovered opportunities, not just manually entered ones.

- [ ] **Auto-classify crawled opportunities** — Run a lightweight LLM call (use the smallest/cheapest model) to assign `category` from the taxonomy when the crawler can't determine it from metadata alone.
- [ ] **Generate llmSummary for each opportunity** — Produce the structured summary (pros, cons, estimated effort, probability of success) that the PRD describes. Cache aggressively — never re-summarize the same opportunity twice.
- [ ] **Compute OppyScore for side-income opportunities** — The existing `scoringEngine.ts` formula targets venture validation. Create a parallel `incomeScorer.ts` that uses the simpler weighted match formula (skill match × income match × trust score × freshness) for crawled gigs.
- [ ] **Build embedding pipeline** — Generate embeddings for opportunity descriptions using the LLM provider's embedding endpoint. Store in the database. This enables semantic search ("something I can do evenings for €500/month") without keyword matching.

---

## Phase 4 — Data Layer Migration (Month 2)

Only after the pipeline is proven working on SQLite.

- [ ] **Migrate to PostgreSQL + pgvector** — Replace SQLite with managed PostgreSQL. Add the `pgvector` extension for embedding-based similarity search. This is the production data layer described in the architecture doc.
- [ ] **Add Redis for job queue** — Move crawler jobs and AI processing tasks into a Redis-backed queue (BullMQ). Prevents the scheduler from spawning duplicate crawl jobs and gives visibility into processing backlog.
- [ ] **Add Zod schema validation** — Validate all LLM outputs and crawler payloads against the `Opportunity` schema before writing to the database. Catches hallucinated fields and broken crawls early. Addresses the gap noted in `AUDIT.md`.

---

## Phase 5 — Frontend Intelligence (Month 2–3)

Make the UI reflect that this is a proactive system, not a manual tracker.

- [ ] **Add "Why this matches you" explanation panel** — Every opportunity card should show which profile dimensions drove the match score (e.g. "Matched: Automation skill, Remote preference, under 15h/week"). This is the key differentiator from generic job boards.
- [ ] **Implement Saved / Hidden feedback loop** — Saving or hiding an opportunity should update the `UserProfile` weighting automatically. Saved = reinforce those attributes. Hidden = down-weight that category/skill combination.
- [ ] **Add semantic search bar** — Natural language search over opportunity embeddings. User types "something flexible that pays around €500/month in IoT" and gets ranked results without keyword matching.
- [ ] **Daily digest email** — Cron job that sends a summary of top 5 new matches. Plain text, minimal, link back to the app. The PRD morning brief vision lives here.

---

## Phase 6 — Long-Term (Month 3+)

- [ ] **Collaborative Workspace** — Multi-founder team support using Firestore real-time sync with strict resource boundaries.
- [ ] **LinkedIn Outreach Integration** — Automate validation guide delivery directly to economic buyers.
- [ ] **AI Application Generator** — Given a matched opportunity and user profile, draft a cover letter / proposal / cold email automatically using the `outreachGenerator.ts` pattern already in the codebase.
- [ ] **Opportunity Forecasting** — Predict which categories are trending (more gigs, higher pay) using 30/60/90 day crawl history.
- [ ] **Browser Extension** — Detect and ingest opportunities while browsing Upwork, LinkedIn, Reddit natively.
- [ ] **Mobile App** — React Native wrapper around the core feed + morning brief.

---

## Known Technical Debt (from AUDIT.md)

- [ ] **No automated tests** — Add Vitest unit tests for `scoringEngine.ts` and `incomeScorer.ts` (once built). These formulas are the core of the product; regressions are invisible without tests.
- [ ] **LocalStorage API key exposure** — BYOK keys stored in localStorage are vulnerable to XSS. Migrate to HttpOnly cookies when auth is added.
- [ ] **No auth layer** — Currently a single-user local tool. Any multi-user or hosted deployment needs OAuth (Google/GitHub) before launch.
