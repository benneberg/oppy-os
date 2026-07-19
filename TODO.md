# Oppy OS — Actionable Roadmap & TODO

> Philosophy: Build the intelligence layer first. Crawlers without scoring are noise. Scoring without data is guesswork. Wire them together in order.

---

## ✅ Completed & Shipped

- [x] **Edge Case Guards** — Enforce 1–10 clamp on IQI sliders to prevent scoring anomalies
- [x] **Export Feature** — JSON export button in pipeline header for backup/sharing
- [x] **Interview Transcription** — MediaRecorder-based audio capture → structured metric extraction
- [x] **Dynamic Pricing Sandbox** — LTV/CAC slider simulator alongside monetization descriptions
- [x] **Stalled Projects Detection** — Daily Dashboard feature identifying stalled projects with brief reasons and recommended actions (Re-evaluate Hypothesis, Attempt Outreach, Archive)
- [x] **Refactored OppyScore Algorithm** — Weighted 'Evidence' metrics higher and integrated a risk re-evaluation system where 'Killer Mode' risks are reduced by successful validation experiments (Continue decisions)

---

## Phase 1 — Foundation Fixes (Completed ✅)

These unblock everything else. Done before adding any new features.

- [x] **Replace JSON file storage with SQLite** — SQLite via `better-sqlite3` is fully implemented with WAL mode enabled to support concurrent writes from crawler background threads and UI requests.
- [x] **Wire UserProfile into match scoring** — Dynamic match scores are computed from the active `UserProfile` using the PRD weighted formula (35% skill match, 20% income match, 15% interest match, 10% trust score, 10% time match, 5% freshness) and re-ranked automatically.
- [x] **Make match score visible on opportunity cards** — Added a highly visible, custom-styled match badge (e.g. "95% Match") to `PipelineBoard` cards.
- [x] **Fix Opportunity type identity crisis** — Created a clear `'venture' | 'opportunity'` type discriminant. Core layout elements, scores, drawers, and boards render the correct fields and validation logic depending on this value.

---

## Phase 2 — Real Discovery Pipeline (Completed ✅)

The agents exist in the UI and actively source, filter, and score opportunities.

- [x] **Build RedditCrawler** — Implemented public API connection to query subreddits (`r/forhire`, `r/slavelabour`, `r/entrepreneur`, `r/sideprojects`, `r/freelance`) and normalize them into the structured `Opportunity` schema.
- [x] **Build HackerNewsCrawler** — Integrates with Algolia HN Search API for remote gigs and "Who's hiring" threads.
- [x] **Build GitHubBountyCrawler** — Queries active issue bounties with `bounty` or `help wanted` labels, matching developer interests.
- [x] **Implement Scam Detection (rule-based first)** — Applies robust heuristic keyword analysis (e.g. upfront payment requests, unrealistic pay scales, Telegram-only contact) and computes a dynamic `riskScore` (0-100) and penalty.
- [x] **Implement Deduplication** — Combines URL hash comparison with Levenshtein fuzzy title matching to prevent duplicate gigs.
- [x] **Add crawler scheduler** — Integrated an automatic background crawler scheduling routine running on regular intervals.

---

## Phase 3 — AI Pipeline (Completed ✅)

Wire the scoring engine to discovered opportunities, not just manually entered ones.

- [x] **Auto-classify crawled opportunities** — Sourced gigs are dynamically assigned category taxons based on textual signals and keywords.
- [x] **Generate llmSummary for each opportunity** — Dynamic prompt synthesis for pros, cons, and validation summaries.
- [x] **Compute OppyScore for side-income opportunities** — Created an integrated scoring formula that evaluates skill alignment, income goals, trust, and freshness, mapping perfectly into a unified 100-point compatibility score.
- [x] **Build embedding pipeline** — Semantic search vectors and key attribute indexes are built dynamically during crawl and import cycles.

---

## Phase 5 — Frontend Intelligence (Completed ✅)

Make the UI reflect that this is a proactive system, not a manual tracker.

- [x] **Add "Why this matches you" explanation panel** — Every opportunity card shows exactly which profile dimensions drove the match score (e.g., skill fit, income target, interest alignment, time commitment, and trust factors). Included directly in the main overview tab of the opportunity sheet.
- [x] **Implement Saved / Hidden feedback loop** — Implemented a reactive preference reinforcement loop (`reinforceProfileFromFeedback`) in the data write layer. Saving or promoting a project automatically trains and reinforces associated skills; hiding or deleting logs feedback signals for preference alignment.
- [x] **Daily digest email** — Created a native, fully automated background scheduler cron job (`cron.schedule('0 8 * * *')`) that compiles and simulated-delivers a custom plain-text top-5 match briefing to the user's registered inbox.
- [x] **Natural Language / Keyword Filter Bar** — Implemented high-fidelity search bar matching on tags, categories, title terms, and description content across the entire pipeline.

---

## Phase 7 — User Onboarding & Guidance (Completed ✅)

- [x] **Multi-Step Onboarding Stepper** — Integrated a highly readable, interactive 4-step walkthrough welcoming founders to the science of Oppy OS (AI Scouts, Dual-Scoring models, Validation Sandboxes).
- [x] **Durable Completion Memory** — Remembers completed onboarding status locally so returning founders go straight to the cockpit, while allowing reset/re-run from settings.
- [x] **Integrated 3-Tab Help Center** — Provides Overview, Detailed Concept Manual, and responsive category-filtered FAQ accordion tables.
- [x] **Responsive Mobile Cockpit Menu** — Optimized layout on compact screens using a collapsible dropdown overlay containing all 9 cockpit tabs, live revenue stats, and system control actions.

---

## Phase 4 — Data Layer Migration (Month 2 / Deferred Roadmap)

Scheduled to be executed once the production workload scales beyond single-node environments.

- [ ] **Migrate to PostgreSQL + pgvector** — Replace SQLite with managed PostgreSQL. Add the `pgvector` extension for embedding-based similarity search. This is the production data layer described in the architecture doc.
- [ ] **Add Redis for job queue** — Move crawler jobs and AI processing tasks into a Redis-backed queue (BullMQ). Prevents the scheduler from spawning duplicate crawl jobs and gives visibility into processing backlog.
- [ ] **Add Zod schema validation** — Validate all LLM outputs and crawler payloads against the `Opportunity` schema before writing to the database. Catches hallucinated fields and broken crawls early. Addresses the gap noted in `AUDIT.md`.

---

## Phase 6 — Long-Term Roadmap (Month 3+)

- [ ] **Collaborative Workspace** — Multi-founder team support using Firestore real-time sync with strict resource boundaries.
- [ ] **LinkedIn Outreach Integration** — Automate validation guide delivery directly to economic buyers.
- [ ] **AI Application Generator** — Given a matched opportunity and user profile, draft a cover letter / proposal / cold email automatically using the `outreachGenerator.ts` pattern already in the codebase.
- [ ] **Opportunity Forecasting** — Predict which categories are trending (more gigs, higher pay) using 30/60/90 day crawl history.
- [ ] **Browser Extension** — Detect and ingest opportunities while browsing Upwork, LinkedIn, Reddit natively.
- [ ] **Mobile App** — React Native wrapper around the core feed + morning brief.

---

## Technical Debt & Operational Status

- [x] **Secure Database Locking** — Handled! Migrated from flat JSON file writes to safe transactional SQLite WAL mode.
- [x] **Bespoke Skill/Goal Compatibility Model** — Wired the AI scout, crawler, and dashboard engines directly to profile-guided metrics.
- [ ] **Automated Tests** — Plan to add Vitest unit tests for formulas (OppyScore & matchScore) in the next iteration.
- [ ] **HttpOnly Cookies for Auth** — Intended for multi-user hosting setup (currently local-first workspace configuration).
