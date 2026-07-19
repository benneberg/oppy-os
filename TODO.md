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

## Phase 1 — Foundation Fixes (Next 72 Hours)

These unblock everything else. Do these before adding any new features.

- [ ] **Replace JSON file storage with SQLite** — `fs.writeFileSync` to a flat file will corrupt data under concurrent writes (crawler + UI hitting the server simultaneously). SQLite via `better-sqlite3` is a zero-infra swap that eliminates the race condition. PostgreSQL comes later.
- [ ] **Wire UserProfile into match scoring** — `matchScore` exists on `Opportunity` but isn't computed from the actual `UserProfile`. Implement the weighted formula from the PRD (35% skill match, 20% income match, 15% interest match, 10% trust score, 10% time match, 5% freshness) and re-rank the portfolio feed whenever the profile changes.
- [ ] **Make match score visible on opportunity cards** — Currently the `matchScore` field is invisible in the UI. Add a match badge to `PipelineBoard` cards so users see why something surfaced.
- [ ] **Fix Opportunity type identity crisis** — The `Opportunity` type is trying to be both a startup idea tracker (IQI, validation interviews, experiments) and a side-income card (trustScore, applicationDeadline, incomeEstimate). Add a `type` discriminant (`'venture' | 'opportunity'`) so components can render the right fields and validation logic without branching hacks.

---

## Phase 2 — Real Discovery Pipeline (Next 2 Weeks)

The agents exist in the UI but do nothing. This phase makes Scout real.

- [ ] **Build RedditCrawler** — Use the Reddit JSON API (no auth needed for public posts). Target subreddits: `r/forhire`, `r/slavelabour`, `r/entrepreneur`, `r/sideprojects`, `r/freelance`. Normalize results into the `Opportunity` schema.
- [ ] **Build HackerNewsCrawler** — Poll the Algolia HN Search API for "Who's hiring", "Freelancer? Seeking freelancer", and "Ask HN: Who wants to be hired" threads monthly. Free, no scraping.
- [ ] **Build GitHubBountyCrawler** — Query GitHub Issues API with labels `bounty`, `help wanted`, `up-for-grabs`. Filter by language tags matching user skills.
- [ ] **Implement Scam Detection (rule-based first)** — Before touching LLMs, apply fast heuristic rules: upfront payment keywords, unrealistic salary claims (>3× market rate), Telegram-only contact, missing company name, domain age < 30 days. Assign a `riskScore` from 0–10.
- [ ] **Implement Deduplication** — URL hash first (fastest), then title fuzzy match using Levenshtein distance, then flag for LLM comparison only when fuzzy score > 0.8. Prevents the same Upwork job appearing 3× from different crawlers.
- [ ] **Add crawler scheduler** — Simple `node-cron` job: high-priority sources every hour, medium every 6h, low daily. Store last-crawled timestamp per source in the database.

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
