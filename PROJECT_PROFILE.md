---
metadata:
  analysis_date: "2026-07-26T11:28:00Z"
  analysis_version: "1.0.0"
  analyzed_by: "repository-aware project intelligence engine"
analysis_scope:
  files_inspected:
    - "package.json"
    - "metadata.json"
    - "PURPOSE.md"
    - "REPO_STATUS.md"
    - "server.ts"
    - "src/services/api.ts"
    - "src/server/oppyEngine.ts"
    - "src/server/crawlers.ts"
  directories_inspected:
    - "/"
    - "/src"
  limitations: "Analysis based on verified repository files and active workspace status."
repository_context:
  repository_name: "Oppy OS"
  repository_url: "UNKNOWN"
  primary_language: "TypeScript"
  frameworks:
    - "React"
    - "Express"
    - "Vite"
    - "Tailwind CSS"
  package_manager: "npm"
  build_system: "Vite / esbuild"
  deployment_target: "Cloud Run / Node.js container"
  detected_tools:
    - "Vitest"
    - "TypeScript"
    - "Better-SQLite3"
    - "Zod"
    - "Google GenAI SDK"
project_identity:
  project_name: "Oppy OS"
  suggested_names:
    - "Oppy OS"
    - "Venture OS"
    - "Founders Lab"
  short_description: "An evidence-driven Founder Decision Operating System to discover, evaluate, and validate early-stage venture products."
  one_sentence_pitch: "Oppy OS transforms qualitative founder ideas into structured, prioritizable venture concepts backed by real-world validation evidence."
  category: "Productivity & Decision Tool"
  project_type: "WEB_APP"
  domain: "Venture Validation / Product Management"
  technology_tags:
    - "TypeScript"
    - "React"
    - "Express"
    - "Vite"
    - "SQLite"
    - "Gemini API"
    - "Tailwind CSS"
    - "Zod"
  audience_tags:
    - "Founders"
    - "Indie Hackers"
    - "Product Managers"
    - "Venture Studios"
project_classification:
  value: "PRODUCT"
  evidence_state: "OBSERVED"
  confidence: "HIGH"
  evidence: "Defined in PURPOSE.md and REPO_STATUS.md as a complete full-stack decision OS application."
  notes: "Contains backend engine, SQLite persistence, LLM integrations, and frontend UI."
project_intent:
  intent_score: 0.95
  class: "PRODUCT"
project_purpose: "To eliminate confirmation bias in early-stage venture creation through objective quantitative scoring and evidence tracking."
project_state:
  current_focus: "Data integrity, Zod output validation, and privacy enforcement in crawler/LLM routines."
  active_work: "Maintaining robust full-stack opportunity scoring and LLM artifact generation."
  blocked_by: "None"
  next_milestone: "Enhanced analytics, live landing page staging, and expanded integration pipelines."
lifecycle: "SHIPABLE"
status: "ACTIVE"
recommendations:
  - "SAAS"
  - "OPEN_SOURCE"
scores:
  effort_required: "MEDIUM"
  technical_complexity: "MEDIUM"
  potential_value: "HIGH"
  opportunity_score: 88
  priority_score: 92
health:
  health_score: 95
  health_status: "HEALTHY"
ai_suitability:
  workflow: "ASSISTED"
  automation_potential: 85
project_memory:
  important_decisions:
    - "Use server-side Express with Vite middleware in development and esbuild CJS bundle in production."
    - "Store user profiles and opportunity states in SQLite (better-sqlite3) with fallback in-memory initial data."
    - "Enforce strict Zod schemas on LLM outputs (discoverNewOpportunityAI, generateArtifactsAI) before saving to DB."
    - "Keep user credentials and emails private; dynamically fetch from UserProfile rather than hardcoding."
  architectural_constraints:
    - "Single port 3000 ingress requirement."
    - "Server-side Gemini API key usage for security."
    - "Standardized Zod validation for server API payloads."
  known_limitations:
    - "Landing page generation currently produces Markdown artifacts rather than hosted live domains."
    - "OAuth connections to live CRMs rely on local SQLite state or user profile configuration."
  future_ideas:
    - "Direct deployment of generated Markdown landing pages to Vercel/Netlify."
    - "Automated scraping of deal sources or startup directories via headless crawlers."
  lessons_learned:
    - "Dynamic profile retrieval ensures user privacy across background crawlers and AI opportunity engines."
    - "Validating LLM response payloads with Zod prevents schema drift and database corruption."
technical_assessment:
  complexity: "MODERATE"
  maturity: "DEVELOPING"
  scalability_potential: "HIGH"
  security_sensitivity: "MEDIUM"
ai_context:
  preferred_workflow: "Iterative feature enhancement with full-stack TypeScript safety and automated verification."
  coding_preferences: "Strict TypeScript types, modular server/client separation, Tailwind CSS utility classes, Zod validations."
  architectural_rules:
    - "Keep API keys server-side only."
    - "Ensure all dev server setups bind to 0.0.0.0:3000."
    - "Maintain Zod validation on external/LLM boundaries."
  forbidden_actions:
    - "Never hardcode private user emails or secrets."
    - "Do not commit raw API keys to repository files."
risks:
  - severity: "LOW"
    category: "Dependency"
    description: "SQLite file concurrency under high multi-tenant loads; suitable for current standalone container deployments."
  - severity: "MEDIUM"
    category: "LLM API"
    description: "LLM rate limits or schema deviations when external API schemas evolve."
portfolio_position: "FLAGSHIP_PROJECT"
tags:
  - "venture-validation"
  - "product-management"
  - "ai-assisted"
  - "full-stack"
  - "typescript"
confidence_summary:
  overall_confidence: "HIGH"
  evidence_coverage: "COMPLETE"
  uncertainty_areas: "Remote git repository origin URL."
---

# Project Profile

## Quick Summary
| Field | Value |
|---|---|
| **Name** | Oppy OS |
| **Stage** | SHIPABLE |
| **Status** | ACTIVE |
| **Priority** | 92/100 |
| **Opportunity** | 88/100 |
| **Health** | 95 (HEALTHY) |
| **AI Suitability** | ASSISTED (85% Automation Potential) |

## Overview
Oppy OS is an evidence-driven Founder Decision Operating System built with React 19, TypeScript, Express, Vite, and SQLite. It provides founders, venture studios, and product leaders with a structured command center to discover, evaluate, score, and validate early-stage product concepts using systematic quantitative metrics (IQI index, Killer risk scores, and evidence weights).

## Purpose
- **Problem solved:** Eliminates founder confirmation bias and wasted development cycles on unvalidated ideas by requiring objective evidence accumulation (interviews, preorders, conversion stats).
- **Target users:** Solo founders, indie hackers, venture studio managers, and innovation lab leads.
- **Main use case:** Submitting qualitative raw signals or product ideas, auto-scoring them against risk indices, generating validation artifacts (landing pages, cold outreach, interview guides), and tracking real-world validation data.
- **Core value:** Dynamic, evidence-weighted opportunity scoring paired with automated AI artifact generation and risk quantification.

## Current State
- **Current lifecycle stage:** SHIPABLE
- **Current status:** ACTIVE - Full-stack web application with SQLite database persistence, express backend server, Zod validation, and Google Gemini SDK integration.
- **Missing requirements:** Automated deployment of generated landing page artifacts to public hosting platforms.

## Recommended Direction
- **Recommended next action:** Expand automated validation tracking and export options (e.g. exporting landing page markdown directly to web builders).
- **Why:** Amplifies the immediate utility of generated artifacts for founders taking products from evaluation to live testing.
- **Expected value:** Significantly reduces time to first dollar (TTFD) and accelerates real user feedback acquisition.

## Technical Assessment
- **Architecture observations:** Clean full-stack Node/Express + React architecture with Vite serving client middleware in dev and compiled CommonJS bundle via esbuild in production.
- **Complexity:** MODERATE (Well-structured TypeScript services, Zod validation engines, SQLite persistence, and GenAI SDK integration).
- **Scalability:** HIGH (Modular routes, client-side BYOK option, decoupled scoring engines).
- **Technical risks:** External LLM API dependencies and rate limiting.

## AI Development Strategy
- **How AI can assist development:** Generating unit test suites, expanding crawlers for new opportunity sources, and enriching prompt templates for specialized domain artifacts.
- **Recommended AI workflow:** Human-in-the-loop verification using Zod runtime validation to ensure LLM structural reliability before database commits.

## Risks
- **Technical risks:** Dynamic LLM response formatting fluctuations (mitigated by Zod schema validation).
- **Maintenance risks:** Keeping third-party API dependencies (Google GenAI, Express, Vite) up to date.
- **Adoption risks:** Requires user discipline to input genuine interview and preorder metrics rather than relying purely on initial LLM heuristics.
- **Dependency risks:** Heavy reliance on external AI provider models for discovery and artifact synthesis.

## Next Actions
1. Implement live staging export integrations for generated landing page Markdown.
2. Add automated test coverage for crawler engines and Zod validation edge cases.
3. Introduce multi-user role management for team/venture studio environments.

## Project Memory
This section stores persistent knowledge that should survive future AI sessions.

### Important Decisions
- **Server Architecture**: Custom Express backend handles API routes, SQLite storage via `better-sqlite3`, and Gemini AI calls securely off the browser.
- **Data Validation**: Strict Zod schemas (`discoverOpportunityAISchema`, `generatedArtifactsAISchema`, `opportunitySchema`) validate all LLM discovery and artifact generation outputs.
- **Privacy Enforcement**: Hardcoded personal credentials and emails are strictly prohibited; dynamic retrieval from `UserProfile` or empty fallback string is enforced across all services and crawlers.

### Architectural Constraints
- **Single Port Configuration**: Must run on port 3000 (`0.0.0.0`) behind reverse proxy.
- **API Secret Isolation**: Gemini API keys and sensitive server environment variables must strictly remain server-side.

### Known Limitations
- **Landing Page Staging**: Generates Markdown landing page copy rather than deploying live HTML/CSS pages to custom subdomains.

### Future Ideas
- Integrating webhooks to receive real-world telemetry from Typeform, Stripe, or Google Analytics directly into the opportunity evidence tracker.
