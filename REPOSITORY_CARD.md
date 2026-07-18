schema:
 version: 1
 compatible_with:
   - CCC
 generated_by: Repository Bootstrap Prompt
 generated_at: 2026-07-18T09:43:35-07:00
 repository: Oppy OS

name:
 value: Oppy OS
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - PURPOSE.md and REPO_STATUS.md titles
   - package.json metadata
 notes: ""

short_description:
 value: "An evidence-driven, high-fidelity Founder Decision Operating System to validate and prioritize early-stage startup opportunities dynamically while eliminating bias."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - PURPOSE.md summary
   - REPO_STATUS.md one-line summary
 notes: ""

category:
 value: "Founder Utilities & Venture Validation Tools"
 evidence_state: INFERRED
 confidence: HIGH
 evidence:
   - Dynamic scoring indices (IQI, Killer Risk, TTFD)
   - Diagnostic buyer interview scripts and cold outreach script generation
 notes: ""

repository_type:
 value: WEB_APP
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Full stack Express server serving compiled SPA assets
 notes: ""

repository_status:
 value: ACTIVE
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Active development, completed lint checks, and active container URL serving
 notes: ""

complexity:
 value: MODERATE
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Integrated heuristics formulas (OppyScore v1) and dynamic weighting shifts
   - Concurrent LLM processing providers (Gemini, Groq, OpenRouter)
 notes: ""

primary_technologies:
 value: "TypeScript, React 19, Express v4, Vite v6, Tailwind CSS v4, Lucide React, esbuild"
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - package.json dependencies list
 notes: ""

problem_solved:
 value: "Eliminates emotional confirmation bias for early-stage founders by shifting prioritization weights from gut-feeling heuristics to objective empirical customer evidence."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - PURPOSE.md problem statement section
 notes: ""

target_audience:
 value: "Solo founders, indie hackers, venture builders, incubators, and product innovation labs."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - PURPOSE.md target audience breakdown
 notes: ""

primary_users:
 value: "Early-stage founders validating or rejecting product concepts."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - PURPOSE.md target audience description
 notes: ""

unique_characteristics:
 value: "Dynamic OppyScore recalculation shifting up to 85% of prioritization weight to empirical proof once interview logs, pre-orders, and pre-revenues are logged."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - ARCHITECTURE.md explanation of scoring engine shift
   - src/services/scoringEngine.ts implementation
 notes: ""

primary_entry_points:
 value: "server.ts (backend Express entry point) and src/main.tsx (frontend client bundle entry point)."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - package.json scripts configuration
   - index.html structure
 notes: ""

current_state:
 value: "Fully operational web-based prototype with local data backup persistence, dynamic metrics calculator, interactive slide controls, and CLI console simulator."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Complete frontend/backend implementation and local verification
 notes: ""

key_risks:
 value: "Dependency on third-party AI APIs (Google Gemini, Groq, OpenRouter) and local file database model which restricts concurrent multi-user workspace accounts."
 evidence_state: INFERRED
 confidence: HIGH
 evidence:
   - ARCHITECTURE.md risks section
   - TODO.md long-term roadmap
 notes: ""

overall_confidence:
 value: HIGH
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Full-scale repository analysis and file system observation
 notes: ""
