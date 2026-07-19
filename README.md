# Oppy OS - Founder Decision Operating System

## Overview
Oppy OS is an evidence-first command center designed to help venture builders, solo founders, and product incubators validate or reject early-stage venture ideas systematically. By evaluating risk vectors (Killer Risk), calculating baseline potential feasibility indices (Idea Quick-Test Index), and dynamically shifting priority weights based on real customer evidence (interviews, pre-orders, pre-revenues), Oppy OS eliminates emotional confirmation bias before engineering effort begins.

---

## Requirements
- Node.js (version 18 or above recommended)
- npm or yarn package manager

---

## Installation
1. Clone the repository files to your local system workspace directory.
2. Install all development and production package dependencies:
   ```bash
   npm install
   ```

---

## Configuration
All application settings and API secrets are configured securely.
- **System-Level API Secrets**: Handled via `.env` environment configuration (e.g. `GEMINI_API_KEY`) and parsed securely on the server-side.
- **User-Level BYOK Credentials**: Users can configure custom Google Gemini, Groq, or OpenRouter keys in the page header settings dialog. Keys are stored strictly on the client-side in browser `LocalStorage`.

---

## Usage
To start the application locally:
```bash
npm run dev
```
Once booted, access the web interface in your browser at `http://localhost:3000`.

### Key Workflows
1. **Guided Onboarding**: First-time founders are welcomed with a 4-step interactive tour explaining Oppy's core design mechanics (Automated Scouts, OppyScore vs Match Score, and Sandbox Validation). This state is saved in LocalStorage and can be replayed from the settings.
2. **Submit Friction Signal**: Navigate to the **Discover Lab** tab. Paste an organic market bottleneck description or problem statement, choose a category, and click **Run Discovery**.
3. **Track Empirical Validation**: Open an opportunity and log customer interview results, landing page visits, pre-orders, and revenues. The prioritization scoring engine will dynamically shift weighting from heuristics to empirical evidence.
4. **Learn via the Help & Manual**: Access the **Help & Manual** tab from the main navigation (or mobile menu). It features a conceptual overview, a chapter-by-chapter detailed guide, and a categorized, responsive FAQ accordion.
5. **Mobile Workspace Optimization**: View, manage, and discover opportunities on mobile portrait screens using the collapsible navigation dropdown with live KPI trackers and quick actions.

---

## Testing
There are currently no automated unit test suites configured.
- Static syntax checking and TypeScript linting:
  ```bash
  npm run lint
  ```

---

## Build
To compile production-ready client and server assets:
```bash
npm run build
```
This script transpile React assets using Vite and bundles server.ts into `dist/server.cjs` using esbuild.

---

## Deployment
Launch the compiled production bundle locally or in containers:
```bash
npm run start
```
The application is pre-configured for container-based hosting environments (such as Google Cloud Run), binding to port `3000` and host `0.0.0.0` securely.

---

## Repository Structure
```text
/src
  ├── components/               # Interactive views (MorningCockpit, PipelineBoard, DiscoverLab, etc.)
  ├── data/                     # Seed portfolio initial opportunities files
  ├── services/                 # Clientside synchronization, calculation formulas, and generator logic
  ├── server/                   # Server-side prompts, LLM engines, SQLite database layer, and crawlers
  └── server.ts                 # Express backend middleware engine
```
- `/index.html` serves as the primary SPA layout entry point.
- `/package.json` manages dependencies, scripts, and build targets.
- `/oppy_lab.db` serves as the primary production-grade SQLite database (running in WAL mode).

