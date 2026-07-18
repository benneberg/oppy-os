schema:
 version: 1
 compatible_with:
   - CCC
 generated_by: Repository Bootstrap Prompt
 generated_at: 2026-07-18T09:43:35-07:00
 repository: Oppy OS

repository_type:
 value: WEB_APP
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - package.json shows dependencies on react, react-dom, express, and vite
   - index.html serves as front-end entry point
   - src/ directory contains components/ and services/ typical of a single-page React app with a backend server
 notes: "The system runs a Custom Express server serving a compiled React SPA bundle with Node/TS runtime."

repository_status:
 value: ACTIVE
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Recent active commits and implementation of multiple tabs (Morning Cockpit, Opportunity Hub, Discover Lab, Analytics, CLI, System Architecture, My Profile, AI Workforce)
   - Completed features and state management listed in PURPOSE.md and TODO.md
 notes: "Active development project with complete functional implementation."

complexity:
 value: MODERATE
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Custom Express server with Vite middleware in server.ts
   - Heuristics and empirical scoring engine in src/services/scoringEngine.ts
   - LLM integration and asset generators in src/server/oppyEngine.ts
   - Multiple interactive dashboard views and mock fallbacks
 notes: "Slightly complex due to scoring algorithms, AI integration layers, and rich visual telemetry dashboards."

primary_language:
 value: TypeScript
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - tsconfig.json configuration is present
   - Source files in src/ have .ts or .tsx extensions
   - server.ts is written in TypeScript and executed via tsx
 notes: "Strong typing exists across core domain models like Opportunity and UserProfile."

secondary_languages:
 value: HTML, CSS, JavaScript
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - index.html in project root
   - src/index.css imports Tailwind and custom font styles
   - package.json lists build tools like esbuild
 notes: "Uses Tailwind CSS utility classes and modern web standards."

primary_framework:
 value: React
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - package.json includes react and react-dom v19
   - App.tsx uses standard hooks like useState, useEffect, and custom modular sub-components
 notes: "Leverages React 19 and Vite for client-side routing and reactive UI updates."

build_system:
 value: Vite & esbuild
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - vite.config.ts in root directory
   - package.json build script compiles Vite assets and bundles server.ts with esbuild
 notes: "The build outputs are directed into /dist."

package_manager:
 value: npm
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - package.json in root directory
   - bun.lock file exists but npm is the canonical script executor
 notes: ""

test_framework:
 value: UNSET
 evidence_state: UNSET
 confidence: NONE
 evidence:
   - TESTING_DELTA.md specifies gaps where unit testing is currently not configured or implemented
   - No packages like jest, vitest, or playwrite listed in package.json devDependencies
 notes: "Currently uses manual verification and static analysis linting (tsc --noEmit)."

workspace_or_single_repository:
 value: SINGLE_REPOSITORY
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - A single package.json and tsconfig.json in the repository root directory
   - No sub-package configuration or lerna/turborepo configurations present
 notes: ""

repository_maturity:
 value: PROTOTYPE
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Local JSON-based backup system (oppy_lab_data.json)
   - TODO.md lists several upcoming features like direct CRM and collaborative workspaces
   - Absence of unit testing frameworks and full integration tests
 notes: "Fully functional high-fidelity prototype / early stage application."

overall_confidence:
 value: HIGH
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Complete scan of all package manifests, source code structures, and documentation guides
 notes: "Very high coverage of file properties."

evidence_summary:
 value: "Oppy OS is a well-structured, functional, single-repository TypeScript WEB_APP using React, Express, Vite, and Tailwind CSS. It is configured for quick prototyping with local JSON state preservation and modular AI processing."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - Canonical file structures in src/
   - REST API endpoints in server.ts
 notes: ""

unknown_areas:
 value: "Integration with external services like custom Slack/Discord alerts, automated CRM, or direct LinkedIn mining is described conceptually but remains unimplemented in current source files."
 evidence_state: OBSERVED
 confidence: HIGH
 evidence:
   - TODO.md roadmap lists direct integrations as long-term goals
 notes: ""
