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

- [x] **Replace JSON file storage with SQLite** — WAL mode, concurrent write safe
- [x] **Wire UserProfile into match scoring** — Full PRD weighted formula implemented
- [x] **Make match score visible on opportunity cards** — Match badge on PipelineBoard cards
- [x] **Fix Opportunity type identity crisis** — `'venture' | 'opportunity'` discriminant in place

---

## Phase 2 — Real Discovery Pipeline (Completed ✅)

- [x] **Build RedditCrawler** — Live API, r/forhire, r/slavelabour, r/entrepreneur, r/sideprojects, r/freelance
- [x] **Build HackerNewsCrawler** — Algolia HN Search API, "Who's hiring" threads
- [x] **Build GitHubBountyCrawler** — GitHub Issues API, `bounty` and `help wanted` labels
- [x] **Implement Scam Detection (rule-based)** — Heuristic keyword analysis, riskScore 0–10
- [x] **Implement Deduplication** — URL hash + Levenshtein fuzzy title matching
- [x] **Add crawler scheduler** — node-cron, Reddit every 2h, HN/GitHub daily

---

## Phase 3 — AI Pipeline (Completed ✅)

- [x] **Auto-classify crawled opportunities** — Keyword-based category assignment on crawl
- [x] **Generate llmSummary for each opportunity** — `enrichOpportunityWithLLM` runs post-crawl
- [x] **Add `summarized` caching flag** — DB column prevents re-enrichment on known opportunities
- [x] **Compute OppyScore for side-income opportunities** — Unified 100-point match formula
- [x] **Build embedding pipeline** — Attribute indexes built during crawl and import cycles

---

## Phase 5 — Frontend Intelligence (Completed ✅)

- [x] **Add "Why this matches you" explanation panel** — `getMatchExplanation` wired to opportunity drawer
- [x] **Implement Saved / Hidden feedback loop** — `reinforceProfileFromFeedback` in server
- [x] **Daily digest email** — Cron at 8AM, compiles top-5 matches, console-dispatched
- [x] **Natural Language / Keyword Filter Bar** — Full-text search across title, tags, category, description

---

## Phase 7 — User Onboarding & Guidance (Completed ✅)

- [x] **Multi-Step Onboarding Stepper** — 4-step interactive walkthrough
- [x] **Durable Completion Memory** — localStorage onboarding flag, resettable from settings
- [x] **Integrated 3-Tab Help Center** — Overview, Concept Manual, FAQ accordion
- [x] **Responsive Mobile Cockpit Menu** — Collapsible dropdown on compact screens

---

## Phase 8 — Testing (Completed ✅)

- [x] **Vitest unit tests for computeOppyScore** — Floor/ceiling clamps, shiftFactor curve, evidence accumulation, risk multipliers, experiment mitigations — all covered in `src/__tests__/scoringEngine.test.ts`

---

## 🔴 Critical Bugs & Hardcoded Values (Fix Before Production)

These are concrete issues found in the current codebase — not aspirational tasks.

- [ ] **Remove hardcoded email address** — `crawlers.ts:622` logs `To: benneberg@gmail.com` regardless of the user's profile. The digest recipient must come from `UserProfile.email` (which doesn't exist yet — see below). Until real email is wired, this line should use a placeholder or be suppressed entirely.
- [ ] **Add `email` field to `UserProfile`** — `types.ts` has no `email` field. The onboarding stepper collects no email address. The daily digest and any future auth flow both need this. Add `email?: string` to `UserProfile`, capture it in `OnboardingProfile.tsx`, and persist via `/api/profile`.
- [ ] **Replace hardcoded `owner: 'founder@oppy.ai'`** — `oppyEngine.ts:266` and `:452` set `owner` to a static string for every opportunity created via `discoverNewOpportunityAI`. This should read from `userProfile.email` (once added) or be omitted until auth exists.
- [ ] **Replace hardcoded morning brief fallback copy** — `oppyEngine.ts:195` returns `"Industrial AI dominates your portfolio value density..."` as the static fallback briefing regardless of what's actually in the portfolio. This text leaks your personal use case to any other user. Replace with a generic dynamic fallback: `"You have ${portfolio.length} opportunities tracked. Top scorer: ${topName || 'none yet'}."`
- [ ] **Replace hardcoded `localhost:3000` in digest links** — `crawlers.ts:610` builds links as `http://localhost:3000/#opp-${opp.id}`. Use `process.env.APP_URL` (already in `.env.example`) with a fallback: `${process.env.APP_URL || 'http://localhost:3000'}/#opp-${opp.id}`.
- [ ] **Replace fake agent accuracy stats** — `AIWorkforce.tsx` displays hardcoded accuracy figures (`94.2%`, `98.7%`, `96.5%`, `91.8%`, `95.0%`) that are never computed from real data. Either derive them from actual counts (e.g. `(filtered / total * 100).toFixed(1)%` for scam detection) or label them as "estimated" to avoid misleading users.
- [ ] **Remove `dummy_key_for_build`** — `oppyEngine.ts:9` falls back to `'dummy_key_for_build'` when no `GEMINI_API_KEY` is set. This should be an empty string or a thrown error at startup, not a string that silently reaches the API and generates confusing auth errors.

---

## 🟡 Production Readiness — Before Public Deployment

These gaps don't break local use but will cause problems the moment someone else runs the app.

- [ ] **Wire real email delivery** — The daily digest logs to console via `[SMTP SIMULATOR]` but never sends. Integrate `nodemailer` with SMTP (or `resend`/`sendgrid` via their REST APIs — zero extra dependency). Gate behind `SMTP_HOST` / `RESEND_API_KEY` env var. If absent, keep the console fallback but label it clearly as dev-only. Add `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (or `RESEND_API_KEY`) to `.env.example`.
- [ ] **Add Zod schema validation on LLM outputs** — `discoverNewOpportunityAI` and `generateArtifactsAI` do `JSON.parse(text || '{}')` with no validation. A hallucinated field name or missing required property silently corrupts the opportunity record. Add a Zod schema matching the expected LLM response shape and throw a typed error on mismatch so the fallback path triggers cleanly.
- [ ] **Add rate limiting to `/api/discover`** — Each call to this endpoint fires `discoverNewOpportunityAI` + `runScoutFleet` which can make 10–20 LLM calls. There's no debounce or request lock. A double-click or UI retry floods the LLM API and duplicates portfolio entries. Add a simple in-memory lock per session or a 10-second cooldown.
- [ ] **Sanitize LLM output before DB write** — Opportunity `name`, `tagline`, and `description` fields come directly from LLM responses and go into the DB and UI unescaped. Strip control characters and enforce max lengths before `saveOpportunity()` to prevent XSS vectors and DB bloat.
- [ ] **Add `/api/health` crawl status** — The health endpoint currently returns `{ status: 'ok', count }`. Extend it to include crawler last-run timestamps and error counts from `getCrawlerMetadata()` so you can monitor pipeline health without reading server logs.
- [ ] **Guard against DB growing unbounded** — The scheduler runs crawlers every 2h and every new crawl can add 10–30 opportunities. Without pruning, the SQLite DB will accumulate thousands of stale listings within weeks. Add an auto-archive job: opportunities of `type: 'opportunity'` older than 30 days with `matchScore < 40` should be soft-deleted or flagged `stage: 'archived'`.
- [ ] **Add `matchScore` filter to the feed** — Currently all crawled opportunities appear in the pipeline regardless of match score. Add a minimum threshold filter (default: `matchScore >= 30`) controlled by a slider in the profile settings, so low-relevance junk stays out of the main view.

---

## 🟢 Meaningful UX Improvements (High Value, Medium Effort)

- [ ] **One-click copy for artifacts** — The cold email, LinkedIn messages, and Reddit post in `OpportunityDrawer` are rendered as text but require manual selection to copy. Add a copy-to-clipboard button per artifact block. The `copied` state variable already exists in the drawer — extend it per-artifact.
- [ ] **Show crawl source badge on opportunity cards** — Crawled opportunities have a `source` field (`Reddit`, `HackerNews`, `GitHub`) but `PipelineBoard` cards don't display it. A small source chip (with favicon or icon) lets you instantly see where a lead came from.
- [ ] **Add "Apply / Open" CTA to opportunity cards** — Crawled opportunities have a `url` field but there's no direct link in the card or drawer header. Add an "Open Source" button that opens `opp.url` in a new tab, saving the context-switch of finding the link manually.
- [ ] **Make the morning brief's "Needs Outreach" list actionable** — `MorningCockpit` shows opportunities needing outreach but the items are read-only. Add a "Log Interview" inline button that opens the opportunity drawer directly to the Validation tab.
- [ ] **Persist sort/filter state** — Changing the pipeline sort or filter resets on every page refresh. Persist the active filter and sort key in `localStorage` so the board remembers your last view.
- [ ] **Show `evidence_weight_percent` as a progress bar in the drawer** — The shift from heuristic to empirical scoring is the most important concept in the app, but it's invisible to the user. A simple progress bar labeled "Evidence Weight: X% empirical / Y% heuristic" in the Scores tab makes the scoring philosophy tangible.
- [ ] **Add experiment outcome summary to overview tab** — The `experiments` array is only visible in the Experiments tab. A compact "X of Y experiments: Continue / Pivot / Kill" count on the overview card surface signals progress at a glance.

---

## Phase 4 — Data Layer Migration (Deferred — Scale Trigger)

Only needed when deploying for multiple users or when SQLite WAL hits its concurrency ceiling.

- [ ] **Migrate to PostgreSQL + pgvector** — Managed PostgreSQL + `pgvector` extension for embedding-based similarity search. This is the production data layer from the architecture doc.
- [ ] **Add Redis for job queue** — BullMQ-backed queue for crawler and AI jobs. Prevents duplicate scheduler runs and gives queue visibility.

---

## Phase 6 — Long-Term Roadmap (Month 3+)

- [ ] **AI Application Generator** — Given a matched opportunity and user profile, draft a cover letter / proposal / cold email automatically using the `outreachGenerator.ts` pattern already in the codebase.
- [ ] **Opportunity Forecasting** — Predict which categories are trending (more gigs, higher pay) using 30/60/90 day crawl history.
- [ ] **Browser Extension** — Detect and ingest opportunities while browsing Upwork, LinkedIn, Reddit natively.
- [ ] **Mobile App** — React Native wrapper around the core feed + morning brief.
- [ ] **Collaborative Workspace** — Multi-founder team support with separate profiles and shared opportunity pool.
- [ ] **LinkedIn Outreach Integration** — Direct LinkedIn API integration for sending validated outreach messages.

---

## Technical Debt

- [x] **Secure Database Locking** — Migrated from flat JSON to SQLite WAL.
- [x] **Bespoke Skill/Goal Compatibility Model** — Profile-guided metrics wired throughout.
- [x] **Vitest unit tests** — `scoringEngine.test.ts` covers all major formula branches.
- [ ] **`computeMatchScore` unit tests** — The scoring engine is tested but `computeMatchScore` and `getMatchExplanation` have no coverage. Add tests for skill ratio calculation, income matching edge cases (zero incomeGoal, no incomeEstimate), and interest keyword extraction.
- [ ] **HttpOnly Cookies for API keys** — BYOK keys in `localStorage` are XSS-vulnerable. Migrate to HttpOnly cookies or server-side session storage when auth is added.
- [ ] **Auth layer** — Single-user local tool currently. Any hosted deployment needs OAuth (Google/GitHub) before the hardcoded `owner` and email fields make sense.
