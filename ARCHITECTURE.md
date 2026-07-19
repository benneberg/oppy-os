schema:
 version: 1
 compatible_with:
   - CCC
 generated_by: Repository Bootstrap Prompt
 generated_at: 2026-07-18T09:43:35-07:00
 repository: Oppy OS

architecture_style:
 value: "Full-Stack Single-Container SPA + API Proxy. Built as an Express backend serving static React 19 single-page assets via custom Vite middleware in dev and static files in prod."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - server.ts setup
   - ARCHITECTURE.md original definitions
 notes: ""

major_components:
 value: "1. Express Web Server (server.ts)\n2. Client Single-Page Application (src/App.tsx & components/*)\n3. Heuristic Scoring Engine (src/services/scoringEngine.ts)\n4. AI Prompting & Operations Engine (src/server/oppyEngine.ts)\n5. SQLite Database Layer (src/server/db.ts & /oppy_lab.db)\n6. Automated Scout Fleet Crawler Engine (src/server/crawlers.ts)"
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - File structures and dependencies
 notes: ""

responsibilities:
 value: "Express Server handles REST routing and file synchronization. ScoringEngine calculates IQI / Killer Risk baseline and shifts weighting based on customer validation data. OppyEngine manages Google Gemini prompt building."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Code inspections of respective services
 notes: ""

dependency_flow:
 value: "React components trigger requests via src/services/api.ts -> server.ts endpoints -> processes using src/server/oppyEngine.ts -> makes third-party LLM calls using process environment keys or custom user header keys."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - API fetch structures in client files and Express middleware configuration
 notes: ""

data_flow:
 value: "Raw customer pain inputs ingested -> converted to structured opportunity JSON -> written to local server disk -> synchronized with client-side React state -> metrics updated and recalculated reactive to customer logging."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Data flow definitions in original ARCHITECTURE.md
 notes: ""

source_of_truth:
 value: "SQLite database (/oppy_lab.db) running in WAL mode is the primary local server database source of truth, managing concurrent reads and writes reliably. If empty, it auto-initializes from initial seeds."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - server.ts loadData and saveData definitions
 notes: ""

entry_points:
 value: "Backend entry point: server.ts (executed via tsx in dev, node in prod). Frontend entry point: index.html -> src/main.tsx (compiled by Vite)."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - package.json script configurations
 notes: ""

external_systems:
 value: "Inference APIs including Google Gemini API (server key), Groq Cloud API, or OpenRouter (supplied client-side via custom request headers)."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - src/server/oppyEngine.ts and client settings drawer configuration
 notes: ""

extension_points:
 value: "Custom LLM processing prompts can be added inside src/server/oppyEngine.ts. New venture stage-gate columns or metadata attributes can be added by editing src/types.ts."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Code modularity of ts files
 notes: ""

configuration:
 value: "Managed via .env environment file for system keys, tsconfig.json for compiler, vite.config.ts for build config, and LocalStorage for user-level API configs."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - REPO_STATUS.md security notes
 notes: ""

constraints:
 value: "Application runs inside a single sandbox container. Network access is restricted; all public browser traffic must map through Port 3000."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Infrastructure configurations and port rules
 notes: ""

architecture_risks:
 value: "SQLite works exceptionally well for single-node systems with concurrent background processing, but scaling to multi-container clusters will require a cloud-hosted database (PostgreSQL/Firestore)."
 evidence_state: INFERRED
 confidence: HIGH
 evidence:
   - Original ARCHITECTURE.md risks section
 notes: ""

improvement_opportunities:
 value: "1. Migrate to highly scalable cloud-hosted PostgreSQL with pgvector for advanced vector-similarity searching.\n2. Write automated Vitest suites for evaluating score calculators."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - TODO.md roadmap lists
 notes: ""

unknown_areas:
 value: "Actual latency and error handler behavior when scaling LLM requests under highly congested API limits remains unmeasured."
 evidence_state: INFERRED
 confidence: HIGH
 evidence:
   - ARCHITECTURE.md diagnostic sections
 notes: ""
