schema:
 version: 1
 compatible_with:
   - CCC
 generated_by: Repository Bootstrap Prompt
 generated_at: 2026-07-18T09:43:35-07:00
 repository: Oppy OS

repository_summary:
 value: "Oppy OS is a Founder Decision Operating System written in TS. It uses dynamic mathematical formulas (OppyScore) and AI prompts (Gemini API) to guide solo founders through early stage validation loops."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - PURPOSE.md
   - REPO_STATUS.md
 notes: ""

technology_summary:
 value: "Runs on React 19, Express 4, Vite 6, Tailwind CSS v4, Lucide-React, motion, and Google GenAI SDK. Compiled via Vite (client) and bundled CJS via esbuild (server)."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - package.json dependency mappings
 notes: ""

architecture_summary:
 value: "Full-stack single container layout. React frontend communicates with server.ts Express REST endpoints, which proxy LLM calls and syncs state to oppy_lab_data.json."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - ARCHITECTURE.md definitions
 notes: ""

coding_patterns:
 value: "1. Strict TypeScript interfaces for all payloads (src/types.ts)\n2. Functional React components with state management\n3. Single global css configuration utilizing Tailwind's modern @import structure\n4. Robust Express server-side error fallbacks to fallback heuristic models"
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Source code file analysis
 notes: ""

naming_patterns:
 value: "1. Components are named in PascalCase (e.g., MorningCockpit.tsx, DiscoverLab.tsx)\n2. Services and server logic are camelCase (e.g., scoringEngine.ts, oppyEngine.ts)\n3. Types and Interfaces are PascalCase (e.g., Opportunity, UserProfile)"
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Canonical folder checks
 notes: ""

important_conventions:
 value: "1. No raw HTML in markdown rendering.\n2. LocalStorage caches settings keys for user-level custom BYOK headers.\n3. Scoring weights dynamically shift from qualitative heuristics to empirical proof up to 85%."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Code logic in scoringEngine.ts and Header.tsx
 notes: ""

critical_files:
 value: "1. server.ts (Express engine)\n2. src/server/oppyEngine.ts (LLM proxy prompts)\n3. src/services/scoringEngine.ts (OppyScore logic)\n4. src/types.ts (domain schemas)\n5. src/App.tsx (Vite UI entry)"
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - File-to-file reference tracing
 notes: ""

primary_entry_points:
 value: "server.ts for Express backend, src/main.tsx for React bundle."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - package.json entries
 notes: ""

dangerous_areas:
 value: "Disk I/O operations inside server.ts (loadData/saveData) which might trigger lock errors or race conditions if concurrent connections edit the state file simultaneously."
 evidence_state: INFERRED
 confidence: HIGH
 evidence:
   - Analysis of filesystem file write loops in server.ts
 notes: ""

files_likely_to_change:
 value: "1. src/types.ts (adding metrics or properties)\n2. src/components/ (building new workspace features)\n3. src/server/oppyEngine.ts (refining prompt engineering structures)"
 evidence_state: INFERRED
 confidence: HIGH
 evidence:
   - TODO.md roadmap items
 notes: ""

generated_files:
 value: "1. oppy_lab_data.json (local state storage)\n2. dist/ (Vite client bundle output)\n3. dist/server.cjs (bundled Express server output)"
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - build script outputs and gitignore exclusions
 notes: ""

repository_gaps:
 value: "1. Absence of unit test suites (e.g. Jest / Vitest)\n2. Hardcoded fallback values in scoringEngine\n3. Missing automated CRM pipelines or outreach channels."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - TESTING_DELTA.md gap analysis
 notes: ""

known_unknowns:
 value: "The performance behavior of the custom BYOK client headers across diverse API limit quotas and OpenRouter network routes."
 evidence_state: INFERRED
 confidence: HIGH
 evidence:
   - AUDIT.md failure safety details
 notes: ""

overall_confidence:
 value: HIGH
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Complete file layout checks and server compilation testing
 notes: ""
