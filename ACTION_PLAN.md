schema:
 version: 1
 compatible_with:
   - CCC
 generated_by: Repository Bootstrap Prompt
 generated_at: 2026-07-18T09:43:35-07:00
 repository: Oppy OS

immediate:
  - title: "Enforce Input Sliders Boundaries"
    description: "Validate slider inputs between 1 and 10 to protect manual metrics edits from breaking prioritization calculations."
    priority: "HIGH"
    expected_benefit: "Ensures scoring formula integrity under all user inputs."
    difficulty: "EASY"
    evidence:
      - TODO.md immediate priority list
    confidence: "HIGH"

high_priority:
  - title: "Setup Vitest Unit Testing Framework"
    description: "Install vitest package and write comprehensive test suites for computeOppyScore heuristic operations."
    priority: "HIGH"
    expected_benefit: "Protects mathematical formulas and scoring algorithms from regression errors."
    difficulty: "MEDIUM"
    evidence:
      - TESTING_DELTA.md testing suite roadmap
    confidence: "HIGH"

medium_priority:
  - title: "Integrate Real-Time Audio Discovery"
    description: "Enable browser-native MediaRecorder recording within DiscoverLab to capture, transcribe, and parse qualitative founder meetings instantly."
    priority: "MEDIUM"
    expected_benefit: "Greatly accelerates validation speed from direct customer interviews."
    difficulty: "MEDIUM"
    evidence:
      - TODO.md medium term list
    confidence: "HIGH"

low_priority:
  - title: "Dynamic Pricing Simulator"
    description: "Build an interactive workspace sandbox supporting custom slider modeling for LTV/CAC estimations next to monetization profiles."
    priority: "LOW"
    expected_benefit: "Enriches the monetization validation capabilities for new ideas."
    difficulty: "EASY"
    evidence:
      - TODO.md medium term list
    confidence: "HIGH"

quick_wins:
  - title: "JSON Export backup Button"
    description: "Add a button to export all portfolios and user profile states into a single downloadable JSON backup file."
    priority: "HIGH"
    expected_benefit: "Empowers solo founders to backup and share their validation directories instantly."
    difficulty: "EASY"
    evidence:
      - TODO.md immediate priority list
    confidence: "HIGH"

long_term:
  - title: "Migrate State to Google Cloud Firestore or PostgreSQL"
    description: "Replace local oppy_lab_data.json backup write loops with an asynchronous Cloud Database platform supporting multi-founder collaborative workspaces."
    priority: "LOW"
    expected_benefit: "Enables multiple team members to manage ventures concurrently with strict auth isolation and zero data race risks."
    difficulty: "HARD"
    evidence:
      - TODO.md long term list
      - ARCHITECTURE.md risks section
    confidence: "HIGH"
