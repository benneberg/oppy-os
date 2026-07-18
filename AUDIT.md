schema:
 version: 1
 compatible_with:
   - CCC
 generated_by: Repository Bootstrap Prompt
 generated_at: 2026-07-18T09:43:35-07:00
 repository: Oppy OS

missing_automated_unit_tests:
 value: "No automated testing framework is configured in package.json or present in source code directories."
 evidence_state: OBSERVED
 severity: MEDIUM
 evidence:
   - TESTING_DELTA.md gap analysis
   - package.json has no test dependencies or scripts
 impact: "Extreme edge case errors in scoringEngine formulas or state transitions might slip into production unnoticed during rapid iterations."
 recommendation: "Integrate Vitest or Jest, and write unit tests for src/services/scoringEngine.ts calculations."
 confidence: HIGH
 notes: ""

concurrency_and_file_system_locks:
 value: "Express server writes synchronously to /oppy_lab_data.json on every state update request."
 evidence_state: OBSERVED
 severity: MEDIUM
 evidence:
   - server.ts saveData() uses fs.writeFileSync
 impact: "Concurrent requests from multiple workspace users can trigger file-lock errors, write corruption, or race conditions leading to data loss."
 recommendation: "Migrate state data storage to an asynchronous atomic database system such as Google Firestore or Cloud SQL (PostgreSQL)."
 confidence: HIGH
 notes: ""

fallback_schema_validation_gaps:
 value: "Deterministic fallback generator does not validate JSON schema compliance before returning mock values to the client."
 evidence_state: INFERRED
 severity: LOW
 evidence:
   - src/server/oppyEngine.ts failsafe default objects mapping
 impact: "Changes in types.ts definitions might cause backend fallback outputs to fall out of synchronization, causing client-side UI render crashes."
 recommendation: "Implement Zod or custom schema checks on LLM and mock-fallback outputs before sending REST responses."
 confidence: HIGH
 notes: ""

local_storage_key_exposure:
 value: "User-defined API keys (BYOK credentials) are saved in browser LocalStorage."
 evidence_state: OBSERVED
 severity: INFO
 evidence:
   - src/components/LLMSettingsModal.tsx LocalStorage usage
 impact: "While secure from server-side exposure, keys are vulnerable to client-side XSS attacks if unauthorized third-party scripts are injected."
 recommendation: "Secure keys using HttpOnly cookies if migrated to an independent session manager."
 confidence: HIGH
 notes: ""
