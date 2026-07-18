schema:
 version: 1
 compatible_with:
   - CCC
 generated_by: Repository Bootstrap Prompt
 generated_at: 2026-07-18T09:43:35-07:00
 repository: Oppy OS

overview:
 value: "Oppy OS is an evidence-first command center written in TypeScript. It automates early-stage venture vetting using qualitative heuristics alongside real customer feedback."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - PURPOSE.md and REPO_STATUS.md files
 notes: ""

purpose:
 value: "To eliminate confirmation bias for solo founders and venture studios by forcing systematic evidence gathering and scoring."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - PURPOSE.md problem statement and value proposition
 notes: ""

scope:
 value: "Client-side React 19 single-page application dashboard backed by a local Node Express server that performs LLM proxying and reads/writes local data backups."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - server.ts API routes and Vite SPA configurations
 notes: ""

capabilities:
 value: "Calculates IQI score baseline, flags fatal risk vectors, auto-provisions outreach guidelines, records customer interviews, supports BYOK setup, and provides interactive analytics graphs."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - src/components/ directory and source implementations
 notes: ""

verified_features:
 value: "Venture directory, interactive metrics sliders, local database backup (oppy_lab_data.json), CLI terminal simulator, and interactive services topology view."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Verification of active UI components and REST endpoints in server.ts
 notes: ""

inferred_features:
 value: "Live hosting or automatic deployment of drafted landing pages; current execution generates and displays the markdown layout rather than serving live domains."
 evidence_state: INFERRED
 confidence: HIGH
 evidence:
   - PURPOSE.md verified vs inferred features section
 notes: ""

future_indicators:
 value: "Transition to PostgreSQL / Google Cloud SQL databases, Multi-founder collaborative workspace workspaces, and direct CRM integrations."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - TODO.md roadmap lists
 notes: ""

technology_stack:
 value: "TypeScript, React 19, Express v4, Vite v6, esbuild, Tailwind CSS v4, Lucide Icons, motion (animation library)."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - package.json dependency declarations
 notes: ""

repository_structure:
 value: "Structured with /src/components/ for UI views, /src/services/ for heuristic logic and local sync, /src/data/ for seed data, /src/server/ for Gemini operations, server.ts at root, and various metadata config files."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Absolute file tree inspection
 notes: ""

configuration:
 value: "Configured via package.json scripts, tsconfig.json, vite.config.ts, and local browser LocalStorage for BYOK client-side secrets."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Config file checks and LocalStorage settings observation
 notes: ""

build_process:
 value: "Running `npm run build` compiles frontend assets to the /dist folder using Vite and bundles server.ts into /dist/server.cjs using esbuild."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - package.json build script definition
 notes: ""

deployment:
 value: "Fully prepared for container-based environment hosting (such as Google Cloud Run) listening on port 3000."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - server.ts host binding to 0.0.0.0 and PORT 3000
 notes: ""

repository_boundaries:
 value: "Does not persist data to standard relational database systems natively; relies exclusively on local backup file system syncing (oppy_lab_data.json) or client state fallback."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - server.ts loadData/saveData file operations
 notes: ""

known_unknowns:
 value: "The behavior of custom Groq or OpenRouter third-party LLMs when configured under custom user-level header headers is inferred from API patterns but lacks embedded integration tests."
 evidence_state: INFERRED
 confidence: HIGH
 evidence:
   - TESTING_DELTA.md gap analysis
 notes: ""

confidence_summary:
 value: "Excellent, highly documented, and fully validated code coverage."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Successful build compiles and typescript linter checks pass cleanly
 notes: ""
