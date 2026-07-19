import { Opportunity } from '../types';

const RAW_INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_local_chiro_ai',
    name: 'AI Booking Assistant & Automation for Local Chiropractors',
    tagline: 'Custom Voice & WhatsApp AI Agent to handle bookings and scheduling via make.com',
    category: 'AI Work',
    stage: 'active',
    status: 'active',
    created: '2026-07-01T10:00:00Z',
    updated: '2026-07-01T10:00:00Z',
    owner: 'lukas@oppy.io',
    description: 'Chiropractic and physiotherapy clinics lose numerous leads when prospects call or message outside opening hours. This AI assistant books them dynamically into their existing Jane app or Calendly slot.',
    problem: 'Clinics waste hours on manual scheduling callbacks; front desk staff are overloaded and miss after-hours booking requests.',
    solution: 'An automated WhatsApp and voice responder integrated with OpenAI and Jane App calendar using low-code make.com workflows.',
    target_user: 'Chiropractors, Physiotherapists, Osteopaths',
    workaround: 'Answering machines and manual call-back sheets.',
    monetization: '€1,500 setup fee + €250/month maintenance retainer.',
    mvp: 'A simple make.com scenario that replies to incoming WhatsApp messages with booking slots.',
    scores: {
      iqi: {
        pain_intensity: 9,
        willingness_to_pay: 8,
        validation_speed: 9,
        reachability: 9,
        switching_friction: 5,
        competition: 6,
        ttfd_score: 9,
        total_iqi: 82
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Medium Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 0
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 2,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 25
      },
      priority_score: 107
    },
    validation: {
      interviews: 0,
      positive_interviews: 0,
      negative_interviews: 0,
      landing_visits: 0,
      signup_rate: 0,
      demo_requests: 0,
      preorders: 0,
      revenue: 0,
      evidence_score: 0
    },
    experiments: [],
    artifacts: {
      landing_page_md: `# AI Front-Desk Booking Assistant\n\nNever lose a chiropractic client to after-hours voicemail again. Our AI automatically handles booking requests via WhatsApp 24/7.\n\n- **Jane App Integrated** out of the box.\n- **Saves 8 Hours / Week** of desk work.\n- **100% Secure & Compliant.**`,
      interview_guide_md: `1. How many booking inquiries do you get after 6 PM?\n2. What scheduling software do you use?\n3. How much time does your receptionist spend on callbacks?`
    },
    decision: {
      recommended_action: 'Build MVP',
      reason: 'Extremely high match for Lukas\' automation skill profile with rapid execution.'
    },
    // Side income properties
    source: 'Upwork Sourcing',
    url: 'https://www.upwork.com/jobs/ai-voice-booking-agent_123',
    location: 'Remote',
    remote: true,
    incomeEstimate: {
      min: 1500,
      max: 3500,
      currency: '€'
    },
    skills: ['Automation', 'AI', 'Programming'],
    riskScore: 2,
    trustScore: 92,
    estimatedHours: 8,
    competitionLevel: 'Low',
    applicationDeadline: '2026-08-15',
    llmSummary: 'High-margin client looking for quick Turnaround. Easy integration using make.com + Vapi.',
    matchScore: 96
  },
  {
    id: 'opp_linkedin_b2b',
    name: 'LinkedIn Content Authority Engine for B2B Founders',
    tagline: 'Custom Ghostwriting and Content System for Tech CEOs Sourced from r/Freelance',
    category: 'Freelance',
    stage: 'active',
    status: 'active',
    created: '2026-07-03T11:00:00Z',
    updated: '2026-07-03T11:00:00Z',
    owner: 'lukas@oppy.io',
    description: 'Founders have rich technical insights but struggle with drafting engaging, structured LinkedIn narratives that convert into B2B sales pipelines.',
    problem: 'CEOs spend 10 hours struggling with copywriting and posting consistency, losing inbound lead momentum.',
    solution: 'A 4-week structured sprint to interview the CEO, extract stories, and script 20 polished text posts.',
    target_user: 'B2B Founders & VC Partners',
    workaround: 'Generic agency services that lack deep tech understanding.',
    monetization: '€2,000 flat retainer per month.',
    mvp: 'A 3-post trial draft delivered within 48 hours.',
    scores: {
      iqi: {
        pain_intensity: 8,
        willingness_to_pay: 9,
        validation_speed: 10,
        reachability: 8,
        switching_friction: 3,
        competition: 8,
        ttfd_score: 9,
        total_iqi: 79
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'High Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Medium Risk',
        risk_penalty: 10
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 1,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 30
      },
      priority_score: 99
    },
    validation: {
      interviews: 0,
      positive_interviews: 0,
      negative_interviews: 0,
      landing_visits: 0,
      signup_rate: 0,
      demo_requests: 0,
      preorders: 0,
      revenue: 0,
      evidence_score: 0
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Build MVP',
      reason: 'Instant revenue, highly suited for copywriting and automation skillset.'
    },
    source: 'Reddit',
    url: 'https://reddit.com/r/freelance/comments/linkedin-copywriter',
    location: 'Remote',
    remote: true,
    incomeEstimate: {
      min: 2000,
      max: 4500,
      currency: '€'
    },
    skills: ['Writing', 'Marketing'],
    riskScore: 3,
    trustScore: 88,
    estimatedHours: 12,
    competitionLevel: 'Medium',
    applicationDeadline: '2026-08-10',
    llmSummary: 'Reddit client searching for a technical copywriter with developer background.',
    matchScore: 89
  },
  {
    id: 'opp_local_iot_consultant',
    name: 'Home Automation & IoT Consultant for Premium Villas',
    tagline: 'High-end smart home auditing, custom architecture, and setup for smart luxury living',
    category: 'Consulting',
    stage: 'sandbox',
    status: 'active',
    created: '2026-07-05T08:00:00Z',
    updated: '2026-07-05T08:00:00Z',
    owner: 'lukas@oppy.io',
    description: 'High-income homeowners buy expensive Sonos, Lutron, and Home Assistant equipment but suffer from flaky network protocols, un-unified apps, and terrible automation triggers.',
    problem: 'Commercial smart home installers charge €50k+ and lock customers in, while cheap electricians don\'t understand advanced network configuration.',
    solution: 'Independent consultant audits existing devices and programs Home Assistant/Node-Red blueprints for flawless, offline-first smart living.',
    target_user: 'Luxury Villa Owners & Real Estate Managers',
    workaround: 'electricians, uncoordinated app clutter, or dealing with broken automations.',
    monetization: '€150/hour or €2,500 flat project design fee.',
    mvp: 'A 2-hour premium home network & IoT audit with action report for €299.',
    scores: {
      iqi: {
        pain_intensity: 7,
        willingness_to_pay: 9,
        validation_speed: 6,
        reachability: 7,
        switching_friction: 6,
        competition: 5,
        ttfd_score: 6,
        total_iqi: 67
      },
      killer: {
        demand_risk: 'Medium Risk',
        budget_risk: 'Low Risk',
        access_risk: 'High Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'Medium Risk',
        ttfd_risk: 'Medium Risk',
        overall_risk: 'Medium Risk',
        risk_penalty: 15
      },
      ttfd: {
        pay_this_month: false,
        rapid_mvp_days: 5,
        data_available: false,
        interviews_immediate: false,
        speed_bonus: 5
      },
      priority_score: 57
    },
    validation: {
      interviews: 0,
      positive_interviews: 0,
      negative_interviews: 0,
      landing_visits: 0,
      signup_rate: 0,
      demo_requests: 0,
      preorders: 0,
      revenue: 0,
      evidence_score: 0
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Pause & Re-evaluate',
      reason: 'Physical access constraints require local marketing but yields very high hourly rates.'
    },
    source: 'Local Gigs',
    url: '',
    location: 'Munich, Germany',
    remote: false,
    incomeEstimate: {
      min: 1500,
      max: 6000,
      currency: '€'
    },
    skills: ['IoT', 'Electronics', 'Automation'],
    riskScore: 4,
    trustScore: 82,
    estimatedHours: 6,
    competitionLevel: 'Low',
    applicationDeadline: '',
    llmSummary: 'Premium local services targeting affluent homeowners with Home Assistant automation designs.',
    matchScore: 84
  },
  // --- INDUSTRIAL AI (13) ---
  {
    id: 'opp_plc_linter',
    name: 'AI PLC Code Reviewer & Standard Enforcer',
    tagline: 'GitHub-style linting + automated code review for IEC 61131-3 PLC code',
    category: 'Industrial AI',
    stage: 'active',
    status: 'active',
    created: '2026-06-10T09:00:00Z',
    updated: '2026-06-28T14:30:00Z',
    owner: 'benneberg@gmail.com',
    description: 'A GitHub-style linting + review system for PLC code (IEC 61131-3) that enforces plant safety standards and styling.',
    problem: 'PLC codebases across manufacturing plants are unstructured, unreviewed, un-versioned, and wildly inconsistent between engineers.',
    solution: 'Automated CI/CD inspection engine that parses ladder logic and structured text to flag dead logic, safety interlock bypasses, and style violations.',
    target_user: 'Automation Engineers & Plant Controls Managers',
    workaround: 'Manual peer review (rarely done) or waiting for commissioning FAT/SAT crashes.',
    monetization: '$250/mo per plant seat or $3,000/yr enterprise site license.',
    mvp: 'Upload PLC project export (.L5X or .ST) -> detect top 20 safety/style violations and generate audit PDF.',
    scores: {
      iqi: {
        pain_intensity: 9,
        willingness_to_pay: 8,
        validation_speed: 7,
        reachability: 8,
        switching_friction: 8,
        competition: 9,
        ttfd_score: 8,
        total_iqi: 83
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Medium Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'Medium Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 5
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 7,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 20
      },
      priority_score: 112 // 83 + 14 evidence + 20 ttfd - 5 risk
    },
    validation: {
      interviews: 6,
      positive_interviews: 5,
      negative_interviews: 1,
      landing_visits: 145,
      signup_rate: 18.5,
      demo_requests: 4,
      preorders: 1,
      revenue: 250,
      evidence_score: 14
    },
    experiments: [
      {
        id: 'exp_1',
        hypothesis: 'Controls engineers are terrified of unreviewed contractor PLC code changes.',
        date: '2026-06-15',
        experiment: 'Cold LinkedIn outreach to 10 Siemens/Rockwell lead automation engineers offering a free code audit.',
        result: '5 agreed immediately. Found 12 unmapped safety faults in 3 uploaded files.',
        decision: 'Continue',
        next_action: 'Build automated CI web hook prototype.'
      }
    ],
    artifacts: {
      landing_page_md: `# Stop Shipping Dangerous PLC Code\n\n**AI PLC Code Reviewer** automatically audits IEC 61131-3 code before it hits the shop floor.\n\n- **Detect Safety Interlock Bypasses** instantly.\n- **Enforce Plant Standards** across external contractors.\n- **Zero Commissioning Surprises.**\n\n[Upload PLC Export for Free Audit]`,
      interview_guide_md: `1. How do you review contractor PLC code changes today?\n2. What was the most expensive downtime caused by a software logic bug?\n3. How many hours are wasted during FAT debugging syntax and standards compliance?`,
      validation_summary_md: `Strong validated demand among tier-2 automotive and F&B manufacturers.`
    },
    decision: {
      recommended_action: 'Build MVP',
      reason: 'Pristine value proposition with high willingness to pay. No direct software-first competitors.'
    }
  },
  {
    id: 'opp_downtime_root',
    name: 'Downtime Root-Cause Analyzer (LOW RISK STAR)',
    tagline: 'Correlates PLC logs + CMMS tickets + sensor trends to pinpoint true production failure causes',
    category: 'Industrial AI',
    stage: 'validated',
    status: 'active',
    created: '2026-06-05T09:00:00Z',
    updated: '2026-06-28T16:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Correlates logs + tickets + sensors to identify true production failure causes across complex continuous manufacturing lines.',
    problem: 'Maintenance teams fix superficial symptoms during downtime events rather than systemic electrical or mechanical root causes.',
    solution: 'AI causality graph that ingests SCADA alarm floods and maintenance history to give operators the exact failed component within 60 seconds.',
    target_user: 'VP of Manufacturing & Plant Operations Directors',
    workaround: 'Root Cause Analysis (RCA) spreadsheets 48 hours after the line restarts.',
    monetization: '$1,500/mo per production line.',
    mvp: 'Manual CSV upload of SCADA alarms and shift logs -> automated timeline correlation report.',
    scores: {
      iqi: {
        pain_intensity: 10,
        willingness_to_pay: 10,
        validation_speed: 8,
        reachability: 9,
        switching_friction: 7,
        competition: 8,
        ttfd_score: 9,
        total_iqi: 92
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Medium Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 0
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 5,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 25
      },
      priority_score: 152 // 92 + 35 evidence + 25 ttfd - 0
    },
    validation: {
      interviews: 12,
      positive_interviews: 11,
      negative_interviews: 1,
      landing_visits: 310,
      signup_rate: 24.2,
      demo_requests: 9,
      preorders: 3,
      revenue: 4500,
      evidence_score: 35
    },
    experiments: [
      {
        id: 'exp_dt_1',
        hypothesis: 'Plant directors will pay $1k+ monthly if we can demonstrate even 15 minutes of prevented downtime.',
        date: '2026-06-12',
        experiment: 'Ran retrospective analysis on 3 months of bottling line historical logs.',
        result: 'Identified a recurring valve sticking issue that cost $42k in scrap. Director signed letter of intent.',
        decision: 'Continue',
        next_action: 'Integrate real-time OPC-UA connector.'
      }
    ],
    artifacts: {},
    decision: {
      recommended_action: 'Scale Production',
      reason: 'Strongest ROI clarity across the portfolio. $4.5k booked revenue.'
    }
  },
  {
    id: 'opp_doc_assistant',
    name: 'AI Documentation Assistant for Industrial Companies',
    tagline: 'Instant operational knowledge retrieval from fragmented plant manuals and schematics',
    category: 'Industrial AI',
    stage: 'active',
    status: 'active',
    created: '2026-06-12T09:00:00Z',
    updated: '2026-06-27T11:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'AI that answers operator questions from fragmented industrial documentation (PDFs, Excel, OEM binders).',
    problem: 'Critical equipment repair manuals are locked in greasy paper binders or scattered shared drives during emergency line stoppages.',
    solution: 'Domain-tuned RAG assistant accessible via rugged tablet that cites exact page numbers and electrical wiring diagrams.',
    target_user: 'Shift Maintenance Technicians & Reliability Engineers',
    workaround: 'Calling senior technician at 3 AM or digging through filing cabinets.',
    monetization: '$499/mo per facility.',
    mvp: 'Chat interface over 50 uploaded OEM PDF manuals.',
    scores: {
      iqi: {
        pain_intensity: 8,
        willingness_to_pay: 7,
        validation_speed: 9,
        reachability: 9,
        switching_friction: 8,
        competition: 5, // Crowded RAG space
        ttfd_score: 8,
        total_iqi: 76
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'High Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Medium Risk',
        risk_penalty: 15
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 3,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 22
      },
      priority_score: 93
    },
    validation: {
      interviews: 8,
      positive_interviews: 6,
      negative_interviews: 2,
      landing_visits: 190,
      signup_rate: 12.0,
      demo_requests: 3,
      preorders: 0,
      revenue: 0,
      evidence_score: 10
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Collect Evidence',
      reason: 'Crowded enterprise RAG space. Must differentiate on CAD diagram extraction.'
    }
  },
  {
    id: 'opp_legacy_plc_migrator',
    name: 'Legacy PLC Migration Assistant',
    tagline: 'Automated translation of obsolete PLC-5 and S5 code into modern TIA Portal / Studio 5000 projects',
    category: 'Industrial AI',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-20T09:00:00Z',
    updated: '2026-06-28T10:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Automated conversion of legacy PLC systems into modern control environments.',
    problem: 'Hundreds of thousands of factories run on 30-year-old obsolete PLC hardware with no backup spares.',
    solution: 'Deep domain compiler that converts old memory register maps and timers into modern tag-based architectures.',
    target_user: 'System Integrators & Automation Engineering Firms',
    workaround: 'Manual rewrites taking 4-8 months per production line.',
    monetization: '$5,000 per converted controller or project fee split.',
    mvp: 'Convert simple legacy subroutine -> modern equivalent + diff validation check.',
    scores: {
      iqi: {
        pain_intensity: 9,
        willingness_to_pay: 9,
        validation_speed: 6,
        reachability: 7,
        switching_friction: 6,
        competition: 8,
        ttfd_score: 7,
        total_iqi: 79
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Medium Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'High Risk',
        ttfd_risk: 'Medium Risk',
        overall_risk: 'Medium Risk',
        risk_penalty: 12
      },
      ttfd: {
        pay_this_month: false,
        rapid_mvp_days: 14,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 10
      },
      priority_score: 82
    },
    validation: {
      interviews: 4,
      positive_interviews: 4,
      negative_interviews: 0,
      landing_visits: 65,
      signup_rate: 15.0,
      demo_requests: 2,
      preorders: 0,
      revenue: 0,
      evidence_score: 5
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Investigate Fast',
      reason: 'Massive willingness to pay from system integrators. Verify compiler LLM reliability.'
    }
  },
  {
    id: 'opp_iot_fleet',
    name: 'IoT Fleet Diagnostics',
    tagline: 'Cross-device failure prediction layer for 100+ industrial IoT sensor deployments',
    category: 'Industrial AI',
    stage: 'active',
    status: 'active',
    created: '2026-06-18T09:00:00Z',
    updated: '2026-06-25T12:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Cross-device intelligence layer for large IoT deployments to predict cascade failures.',
    problem: 'Fleet device battery drainage and firmware crashes are only discovered after remote field stations go dark.',
    solution: 'Telemetry clustering model that connects to AWS IoT / Azure IoT Hub to rank at-risk edge devices.',
    target_user: 'VP of IoT Infrastructure & Field Operations Leads',
    workaround: 'Custom Grafana threshold alerts that trigger constantly.',
    monetization: '$1 per connected device per month.',
    mvp: 'Connect read-only API token to IoT hub -> rank top 10 at-risk devices.',
    scores: {
      iqi: {
        pain_intensity: 8,
        willingness_to_pay: 8,
        validation_speed: 7,
        reachability: 7,
        switching_friction: 8,
        competition: 7,
        ttfd_score: 7,
        total_iqi: 76
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Medium Risk',
        competition_risk: 'Medium Risk',
        complexity_risk: 'Medium Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 5
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 7,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 18
      },
      priority_score: 97
    },
    validation: {
      interviews: 5,
      positive_interviews: 4,
      negative_interviews: 1,
      landing_visits: 110,
      signup_rate: 10.5,
      demo_requests: 2,
      preorders: 0,
      revenue: 0,
      evidence_score: 8
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Collect Evidence',
      reason: 'High scalability once integrated.'
    }
  },
  {
    id: 'opp_plc_log_analyzer',
    name: 'PLC Log Analyzer',
    tagline: 'AI analysis and root-cause clustering for cryptic PLC event logs and alarm floods',
    category: 'Industrial AI',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-22T09:00:00Z',
    updated: '2026-06-28T08:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'AI analysis layer for PLC event logs and alarms to eliminate manual grepping.',
    problem: 'When a line trips, technicians stare at 40,000 hex codes and unintelligible timestamped alarm buffers.',
    solution: 'Natural language log parser that clusters repetitive cascade alarms into the single physical trigger.',
    target_user: 'Maintenance Controls Technicians',
    workaround: 'Scrolling notepad text exports for 3 hours.',
    monetization: '$99/mo per technician seat.',
    mvp: 'Upload raw log file (.TXT or .CSV) -> output top 3 failure clusters in plain English.',
    scores: {
      iqi: {
        pain_intensity: 9,
        willingness_to_pay: 7,
        validation_speed: 9,
        reachability: 9,
        switching_friction: 9,
        competition: 8,
        ttfd_score: 9,
        total_iqi: 83
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 0
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 2,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 24
      },
      priority_score: 112
    },
    validation: {
      interviews: 3,
      positive_interviews: 3,
      negative_interviews: 0,
      landing_visits: 45,
      signup_rate: 22.0,
      demo_requests: 1,
      preorders: 0,
      revenue: 0,
      evidence_score: 5
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Build MVP',
      reason: 'Ultra-low friction TTFD candidate. Engineers love simple drag-and-drop log parsers.'
    }
  },
  {
    id: 'opp_cmms_extractor',
    name: 'AI Requirements Extractor (Work Orders)',
    tagline: 'Transforms free-text maintenance work orders into structured reliability analytics',
    category: 'Industrial AI',
    stage: 'active',
    status: 'active',
    created: '2026-06-14T09:00:00Z',
    updated: '2026-06-26T14:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Transforms free-text maintenance work orders into structured MTBF and parts demand analytics.',
    problem: 'CMMS systems (SAP PM, Maximo) are filled with garbage technician notes ("fixed pump", "replaced belt").',
    solution: 'Batch NLP pipeline that extracts component taxonomy, failure modes, and true wrench time.',
    target_user: 'Reliability Engineers & Maintenance Planners',
    workaround: 'Hiring summer interns to read 10,000 work orders.',
    monetization: '$750/mo per plant.',
    mvp: 'Upload 1,000 exported work order CSV -> automated Pareto bad-actor equipment report.',
    scores: {
      iqi: {
        pain_intensity: 8,
        willingness_to_pay: 8,
        validation_speed: 8,
        reachability: 8,
        switching_friction: 7,
        competition: 8,
        ttfd_score: 8,
        total_iqi: 79
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Medium Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 2
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 4,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 21
      },
      priority_score: 106
    },
    validation: {
      interviews: 7,
      positive_interviews: 6,
      negative_interviews: 1,
      landing_visits: 130,
      signup_rate: 16.0,
      demo_requests: 3,
      preorders: 1,
      revenue: 0,
      evidence_score: 8
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Build MVP',
      reason: 'High value density. Unlocks trapped CMMS data.'
    }
  },
  {
    id: 'opp_energy_anomaly',
    name: 'Energy Consumption Anomaly Detector',
    tagline: 'Detects invisible bearing degradation and motor faults via sub-meter energy spikes',
    category: 'Industrial AI',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-24T09:00:00Z',
    updated: '2026-06-28T09:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Detects mechanical inefficiencies via energy usage patterns per machine.',
    problem: 'Electric motors draw 20% more current for weeks before catastrophic burnout occurs.',
    solution: 'AI current-signature analysis that flags early electrical winding breakdown.',
    target_user: 'Plant Energy Managers & Maintenance Engineers',
    workaround: 'Monthly utility bill shocks.',
    monetization: '$300/mo per machine feeder line.',
    mvp: 'Sub-meter CSV timestamp analysis -> anomaly alert generation.',
    scores: {
      iqi: {
        pain_intensity: 7,
        willingness_to_pay: 7,
        validation_speed: 7,
        reachability: 8,
        switching_friction: 8,
        competition: 7,
        ttfd_score: 7,
        total_iqi: 73
      },
      killer: {
        demand_risk: 'Medium Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Medium Risk',
        complexity_risk: 'Medium Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 5
      },
      ttfd: {
        pay_this_month: false,
        rapid_mvp_days: 7,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 15
      },
      priority_score: 85
    },
    validation: {
      interviews: 2,
      positive_interviews: 2,
      negative_interviews: 0,
      landing_visits: 30,
      signup_rate: 10.0,
      demo_requests: 0,
      preorders: 0,
      revenue: 0,
      evidence_score: 2
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Investigate Fast',
      reason: 'Sustainability + downtime prevention dual budget unlock.'
    }
  },
  {
    id: 'opp_alarm_aggregator',
    name: 'Predictive Maintenance Alert Aggregator',
    tagline: 'Intelligent deduplication and clustering of noisy CMMS / SCADA alarm floods',
    category: 'Industrial AI',
    stage: 'active',
    status: 'active',
    created: '2026-06-16T09:00:00Z',
    updated: '2026-06-27T16:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Intelligent filtering and clustering of industrial alarms to eliminate alert fatigue.',
    problem: 'Operators acknowledge 1,500 nuisance alarms per shift, training them to ignore real warnings.',
    solution: 'Alarm rationalization engine compliant with ISA-18.2 standards.',
    target_user: 'DCS Operators & Control Room Managers',
    workaround: 'Silencing the horn speaker with electrical tape.',
    monetization: '$600/mo per control room.',
    mvp: 'Ingest alarm log -> show 80% noise reduction potential.',
    scores: {
      iqi: {
        pain_intensity: 9,
        willingness_to_pay: 8,
        validation_speed: 8,
        reachability: 8,
        switching_friction: 8,
        competition: 7,
        ttfd_score: 8,
        total_iqi: 81
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 0
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 5,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 20
      },
      priority_score: 109
    },
    validation: {
      interviews: 5,
      positive_interviews: 5,
      negative_interviews: 0,
      landing_visits: 95,
      signup_rate: 18.0,
      demo_requests: 3,
      preorders: 0,
      revenue: 0,
      evidence_score: 8
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Build MVP',
      reason: 'Meets clear regulatory ISA-18.2 pain point.'
    }
  },
  {
    id: 'opp_ot_cyber',
    name: 'Industrial Cybersecurity Scanner (SMB OT)',
    tagline: 'Lightweight OT security assessment and NIS2 compliance mapper for small manufacturers',
    category: 'Industrial AI',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-25T09:00:00Z',
    updated: '2026-06-28T11:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Lightweight OT security assessment tool for small manufacturers to achieve NIS2 readiness.',
    problem: 'Enterprise OT security (Claroty, Nozomi) costs $100k+, leaving 50-person machine shops blind.',
    solution: 'Passive PCAP network analyzer that maps unpatched Windows XP HMIs and exposed Modbus ports.',
    target_user: 'SMB Industrial IT Managers & Plant Owners',
    workaround: 'Hoping hackers ignore them.',
    monetization: '$199/mo subscription.',
    mvp: 'Upload 10-minute network capture (.PCAP) -> automated NIS2 risk rating PDF.',
    scores: {
      iqi: {
        pain_intensity: 9,
        willingness_to_pay: 8,
        validation_speed: 9,
        reachability: 9,
        switching_friction: 9,
        competition: 8,
        ttfd_score: 9,
        total_iqi: 86
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Medium Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 2
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 3,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 24
      },
      priority_score: 112
    },
    validation: {
      interviews: 4,
      positive_interviews: 4,
      negative_interviews: 0,
      landing_visits: 80,
      signup_rate: 21.0,
      demo_requests: 2,
      preorders: 0,
      revenue: 0,
      evidence_score: 4
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Investigate Fast',
      reason: 'Massive NIS2 European compliance tailwind.'
    }
  },
  {
    id: 'opp_sensor_anomaly',
    name: 'Sensor Anomaly Detection Layer',
    tagline: 'Unsupervised machine learning anomaly detection for high-frequency industrial sensor streams',
    category: 'Industrial AI',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-21T09:00:00Z',
    updated: '2026-06-28T09:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Unsupervised anomaly detection for industrial sensor streams to catch subtle process drift.',
    problem: 'Hardcoded min/max alarm thresholds miss slow thermal degradation and pressure drift.',
    solution: 'Lightweight autoencoder running on edge gateway.',
    target_user: 'Chemical Process Engineers & Quality Leads',
    workaround: 'Manual statistical process control (SPC) charts.',
    monetization: '$150/mo per critical sensor loop.',
    mvp: 'CSV upload of single temperature stream -> pinpoint historical drift onset.',
    scores: {
      iqi: {
        pain_intensity: 7,
        willingness_to_pay: 7,
        validation_speed: 8,
        reachability: 8,
        switching_friction: 8,
        competition: 6,
        ttfd_score: 8,
        total_iqi: 74
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Medium Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 3
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 4,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 20
      },
      priority_score: 94
    },
    validation: {
      interviews: 2,
      positive_interviews: 2,
      negative_interviews: 0,
      landing_visits: 40,
      signup_rate: 12.5,
      demo_requests: 1,
      preorders: 0,
      revenue: 0,
      evidence_score: 3
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Investigate Fast',
      reason: 'Clean machine learning problem.'
    }
  },
  {
    id: 'opp_spare_parts',
    name: 'Spare Parts Demand Forecaster',
    tagline: 'Forecasts critical spare parts consumption based on actual machine runtime and wear curves',
    category: 'Industrial AI',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-26T09:00:00Z',
    updated: '2026-06-28T12:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Forecasts spare parts consumption based on runtime + failure history.',
    problem: 'Plants hoard $2M in dead spare parts inventory while still suffering 3-week lead times for broken seals.',
    solution: 'Predictive inventory optimization tied to real machine operating hours.',
    target_user: 'MRO Procurement Managers & Supply Chain Directors',
    workaround: 'Min/Max reorder points in ERP.',
    monetization: '$1,000/mo per plant warehouse.',
    mvp: 'Ingest parts issue log + machine run hours -> flag $100k overstocked items.',
    scores: {
      iqi: {
        pain_intensity: 8,
        willingness_to_pay: 9,
        validation_speed: 7,
        reachability: 8,
        switching_friction: 7,
        competition: 8,
        ttfd_score: 7,
        total_iqi: 78
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Medium Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'Medium Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 4
      },
      ttfd: {
        pay_this_month: false,
        rapid_mvp_days: 10,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 14
      },
      priority_score: 91
    },
    validation: {
      interviews: 3,
      positive_interviews: 3,
      negative_interviews: 0,
      landing_visits: 50,
      signup_rate: 14.0,
      demo_requests: 1,
      preorders: 0,
      revenue: 0,
      evidence_score: 3
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Investigate Fast',
      reason: 'Direct cash release proposition.'
    }
  },
  {
    id: 'opp_calibration_drift',
    name: 'Sensor Calibration Drift Predictor',
    tagline: 'Predicts instrumentation drift before batch quality tolerance failure occurs',
    category: 'Industrial AI',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-27T09:00:00Z',
    updated: '2026-06-28T13:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Predicts sensor calibration drift before tolerance failure occurs.',
    problem: 'Pharmaceutical and food plants calibrate pH and flow meters on arbitrary 6-month calendar schedules.',
    solution: 'Drift curve forecasting that reduces unnecessary calibration downtime by 50%.',
    target_user: 'QA/QC Directors & Instrumentation Techs',
    workaround: 'Calibrating everything constantly.',
    monetization: '$400/mo per compliance line.',
    mvp: 'Historical calibration certificate CSV upload -> drift probability model.',
    scores: {
      iqi: {
        pain_intensity: 8,
        willingness_to_pay: 8,
        validation_speed: 7,
        reachability: 8,
        switching_friction: 8,
        competition: 8,
        ttfd_score: 7,
        total_iqi: 78
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 0
      },
      ttfd: {
        pay_this_month: false,
        rapid_mvp_days: 6,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 16
      },
      priority_score: 97
    },
    validation: {
      interviews: 2,
      positive_interviews: 2,
      negative_interviews: 0,
      landing_visits: 35,
      signup_rate: 14.2,
      demo_requests: 1,
      preorders: 0,
      revenue: 0,
      evidence_score: 3
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Investigate Fast',
      reason: 'Strong regulatory compliance tie-in.'
    }
  },

  // --- DEVELOPER PRODUCTIVITY (10) ---
  {
    id: 'opp_api_deprecation',
    name: 'API Deprecation Impact Analyzer',
    tagline: 'Maps breaking API changes across microservice codebases and production logs',
    category: 'Developer Productivity',
    stage: 'active',
    status: 'active',
    created: '2026-06-11T09:00:00Z',
    updated: '2026-06-27T10:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Shows impact of external and internal API deprecations across repos and traffic logs.',
    problem: 'When Stripe or AWS updates an API version, engineering teams blind-guess which downstream services will crash.',
    solution: 'Code scanner + Datadog log correlation tool that lists exact line numbers calling deprecated endpoints.',
    target_user: 'Staff Engineers & Platform Tech Leads',
    workaround: 'Grepping strings across 40 GitHub repos.',
    monetization: '$150/mo per dev team.',
    mvp: 'Connect GitHub repo + OpenAPI spec -> deprecation vulnerability report.',
    scores: {
      iqi: {
        pain_intensity: 8,
        willingness_to_pay: 8,
        validation_speed: 9,
        reachability: 9,
        switching_friction: 8,
        competition: 7,
        ttfd_score: 8,
        total_iqi: 81
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Medium Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 2
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 4,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 22
      },
      priority_score: 109
    },
    validation: {
      interviews: 6,
      positive_interviews: 5,
      negative_interviews: 1,
      landing_visits: 180,
      signup_rate: 16.5,
      demo_requests: 4,
      preorders: 0,
      revenue: 0,
      evidence_score: 8
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Build MVP',
      reason: 'Extremely fast validation candidate with dev platform teams.'
    }
  },
  {
    id: 'opp_ai_changelog',
    name: 'AI Changelog Generator',
    tagline: 'Auto-generates crisp, customer-ready changelogs from messy Git commits and merged PRs',
    category: 'Developer Productivity',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-23T09:00:00Z',
    updated: '2026-06-28T09:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Auto-generates human-readable changelogs from commits and PRs.',
    problem: 'Developers write terrible commit messages ("fix bug", "wip") that product managers can never translate into release notes.',
    solution: 'GitHub action that summarizes diffs into marketing-grade release bullet points.',
    target_user: 'Product Managers & Tech Leads',
    workaround: 'Staring at merged PR list for 2 hours every Friday.',
    monetization: '$29/mo per repo.',
    mvp: 'Paste GitHub PR URL -> generate formatted Markdown changelog.',
    scores: {
      iqi: {
        pain_intensity: 6,
        willingness_to_pay: 5,
        validation_speed: 10,
        reachability: 10,
        switching_friction: 10,
        competition: 4, // Very crowded
        ttfd_score: 10,
        total_iqi: 74
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'High Risk', // Low WTP
        access_risk: 'Low Risk',
        competition_risk: 'High Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Medium Risk',
        risk_penalty: 15
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 1,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 25
      },
      priority_score: 87
    },
    validation: {
      interviews: 4,
      positive_interviews: 2,
      negative_interviews: 2,
      landing_visits: 120,
      signup_rate: 8.0,
      demo_requests: 1,
      preorders: 0,
      revenue: 0,
      evidence_score: 2
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Pause & Re-evaluate',
      reason: 'Low willingness to pay. Too many free open source scripts do this.'
    }
  },
  {
    id: 'opp_auto_doc_sync',
    name: 'Automated Documentation Generator',
    tagline: 'Keeps developer architecture docs and READMEs strictly in sync with code diffs',
    category: 'Developer Productivity',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-25T09:00:00Z',
    updated: '2026-06-28T09:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Keeps internal documentation in sync with code diffs automatically.',
    problem: 'Documentation begins decaying the exact second it is committed.',
    solution: 'Background watcher that opens automated PRs updating Markdown docs whenever exported interfaces change.',
    target_user: 'Engineering Managers',
    workaround: 'Nagging developers in Slack.',
    monetization: '$99/mo per organization.',
    mvp: 'Diff analyzer -> README update PR generator.',
    scores: {
      iqi: {
        pain_intensity: 7,
        willingness_to_pay: 7,
        validation_speed: 8,
        reachability: 9,
        switching_friction: 8,
        competition: 5,
        ttfd_score: 8,
        total_iqi: 75
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Medium Risk',
        complexity_risk: 'Medium Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 5
      },
      ttfd: {
        pay_this_month: false,
        rapid_mvp_days: 5,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 18
      },
      priority_score: 90
    },
    validation: {
      interviews: 3,
      positive_interviews: 2,
      negative_interviews: 1,
      landing_visits: 60,
      signup_rate: 11.0,
      demo_requests: 1,
      preorders: 0,
      revenue: 0,
      evidence_score: 3
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Investigate Fast',
      reason: 'Classic evergreen developer headache.'
    }
  },
  {
    id: 'opp_embedded_copilot',
    name: 'Embedded Systems Assistant',
    tagline: 'AI copilot specialized in C/C++ hardware register maps and RTOS debugging',
    category: 'Developer Productivity',
    stage: 'active',
    status: 'active',
    created: '2026-06-13T09:00:00Z',
    updated: '2026-06-28T12:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'AI copilot for low-level firmware development and hardware debugging.',
    problem: 'Standard Copilot/Cursor is trained on web JavaScript and hallucinates register bit shifts for STM32 and ESP32 microcontrollers.',
    solution: 'IDE extension loaded with ARM Cortex datasheets and Zephyr RTOS APIs.',
    target_user: 'Firmware & Embedded Engineers',
    workaround: 'Reading 1,200-page PDF microchip reference manuals.',
    monetization: '$35/mo per engineer seat.',
    mvp: 'VS Code plugin -> paste register datasheet table + C struct -> auto-generate bitwise driver macros.',
    scores: {
      iqi: {
        pain_intensity: 9,
        willingness_to_pay: 8,
        validation_speed: 8,
        reachability: 8,
        switching_friction: 8,
        competition: 8,
        ttfd_score: 8,
        total_iqi: 83
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 0
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 5,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 22
      },
      priority_score: 113
    },
    validation: {
      interviews: 8,
      positive_interviews: 8,
      negative_interviews: 0,
      landing_visits: 220,
      signup_rate: 22.5,
      demo_requests: 6,
      preorders: 2,
      revenue: 70,
      evidence_score: 16
    },
    experiments: [
      {
        id: 'exp_emb_1',
        hypothesis: 'Firmware devs hate writing boilerplate bitwise register manipulation.',
        date: '2026-06-18',
        experiment: 'Posted demo snippet in r/embedded.',
        result: '180 upvotes and 45 beta signups in 12 hours.',
        decision: 'Continue',
        next_action: 'Launch VS Code marketplace beta.'
      }
    ],
    artifacts: {},
    decision: {
      recommended_action: 'Build MVP',
      reason: 'Passionate niche underserved by mainstream generic coding LLMs.'
    }
  },
  {
    id: 'opp_mqtt_toolkit',
    name: 'MQTT Inspection & Debugging Tools',
    tagline: 'Wireshark + Postman specifically built for high-throughput MQTT broker packet inspection',
    category: 'Developer Productivity',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-19T09:00:00Z',
    updated: '2026-06-26T09:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Toolkit for MQTT broker traffic debugging, topic wildcard mapping, and packet simulation.',
    problem: 'IoT devs debugging MQTT QoS drops and retained message storms rely on crude terminal CLI clients.',
    solution: 'Desktop visual desktop inspector with payload proto decoding and topic tree visualizer.',
    target_user: 'IoT Backend Developers',
    workaround: 'mosquitto_sub CLI flags.',
    monetization: '$49 one-time license or $10/mo pro team sync.',
    mvp: 'Web WebSocket MQTT inspector -> live JSON schema validation.',
    scores: {
      iqi: {
        pain_intensity: 7,
        willingness_to_pay: 6,
        validation_speed: 9,
        reachability: 9,
        switching_friction: 9,
        competition: 6,
        ttfd_score: 9,
        total_iqi: 78
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Medium Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 2
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 3,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 23
      },
      priority_score: 104
    },
    validation: {
      interviews: 4,
      positive_interviews: 3,
      negative_interviews: 1,
      landing_visits: 90,
      signup_rate: 15.5,
      demo_requests: 1,
      preorders: 0,
      revenue: 0,
      evidence_score: 5
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Build MVP',
      reason: 'Quick weekend utility build with immediate developer adoption.'
    }
  },
  {
    id: 'opp_flash_wear',
    name: 'Embedded Flash Wear Analyzer',
    tagline: 'Predicts NAND / NOR flash memory degradation and write exhaustion in remote IoT edge hardware',
    category: 'Developer Productivity',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-26T09:00:00Z',
    updated: '2026-06-28T09:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Predicts NAND flash memory degradation in remote IoT edge hardware.',
    problem: 'Frequent logging to SPI flash bricks remote field devices after 18 months due to write cycle exhaustion.',
    solution: 'Static code analyzer that calculates daily write volume and estimates flash lifetime before manufacturing.',
    target_user: 'Embedded Hardware Architects',
    workaround: 'Guessing and RMA replacements.',
    monetization: '$500/yr per repo.',
    mvp: 'Upload firmware C source -> flag excessive file write loops.',
    scores: {
      iqi: {
        pain_intensity: 8,
        willingness_to_pay: 8,
        validation_speed: 7,
        reachability: 8,
        switching_friction: 8,
        competition: 9,
        ttfd_score: 7,
        total_iqi: 79
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 0
      },
      ttfd: {
        pay_this_month: false,
        rapid_mvp_days: 6,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 16
      },
      priority_score: 97
    },
    validation: {
      interviews: 3,
      positive_interviews: 3,
      negative_interviews: 0,
      landing_visits: 55,
      signup_rate: 18.0,
      demo_requests: 1,
      preorders: 0,
      revenue: 0,
      evidence_score: 4
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Investigate Fast',
      reason: 'Prevents catastrophic hardware RMA costs.'
    }
  },
  {
    id: 'opp_test_coverage',
    name: 'Embedded Test Coverage Visualizer',
    tagline: 'Generates ISO 26262 audit-ready MC/DC coverage certification reports for embedded firmware',
    category: 'Developer Productivity',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-24T09:00:00Z',
    updated: '2026-06-28T09:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Generates audit-ready coverage reports for safety-critical embedded systems (ISO 26262, DO-178C).',
    problem: 'Automotive and medical aerospace teams spend 30% of their engineering schedule generating manual compliance proof.',
    solution: 'CI artifact generator that parses gcov/lcov files into signed regulatory PDF binders.',
    target_user: 'Safety Certification Engineers',
    workaround: 'Manual Word doc screenshots.',
    monetization: '$2,000/mo per compliance project.',
    mvp: 'Upload lcov report -> automated traceability matrix PDF.',
    scores: {
      iqi: {
        pain_intensity: 9,
        willingness_to_pay: 10,
        validation_speed: 6,
        reachability: 7,
        switching_friction: 7,
        competition: 8,
        ttfd_score: 7,
        total_iqi: 81
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Medium Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'Medium Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 4
      },
      ttfd: {
        pay_this_month: false,
        rapid_mvp_days: 8,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 14
      },
      priority_score: 93
    },
    validation: {
      interviews: 3,
      positive_interviews: 3,
      negative_interviews: 0,
      landing_visits: 40,
      signup_rate: 15.0,
      demo_requests: 2,
      preorders: 0,
      revenue: 0,
      evidence_score: 4
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Investigate Fast',
      reason: 'Massive enterprise willingness to pay in automotive/medtech.'
    }
  },
  {
    id: 'opp_adr_generator',
    name: 'ADR Generator from Git History',
    tagline: 'Auto-creates Architecture Decision Records (ADRs) by analyzing commit messages and code refactors',
    category: 'Developer Productivity',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-27T09:00:00Z',
    updated: '2026-06-28T09:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Auto-creates Architecture Decision Records (ADRs) from git repo history.',
    problem: 'When senior architects leave a company, nobody knows why PostgreSQL was chosen over DynamoDB 4 years ago.',
    solution: 'LLM archaeology tool that scans commit histories for major refactors and drafts retroactive ADR markdown files.',
    target_user: 'VP of Engineering & Staff Architects',
    workaround: 'Asking people in Slack who have already quit.',
    monetization: '$199 one-time repo archaeology scan.',
    mvp: 'Analyze git log -> output 5 historical architectural milestones.',
    scores: {
      iqi: {
        pain_intensity: 7,
        willingness_to_pay: 7,
        validation_speed: 9,
        reachability: 9,
        switching_friction: 9,
        competition: 8,
        ttfd_score: 9,
        total_iqi: 80
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 0
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 2,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 24
      },
      priority_score: 106
    },
    validation: {
      interviews: 3,
      positive_interviews: 3,
      negative_interviews: 0,
      landing_visits: 70,
      signup_rate: 18.5,
      demo_requests: 1,
      preorders: 0,
      revenue: 0,
      evidence_score: 4
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Build MVP',
      reason: 'Delightful low-effort TTFD utility.'
    }
  },
  {
    id: 'opp_codebase_explorer',
    name: 'AI Codebase Explorer',
    tagline: 'Natural language onboarding and architectural interactive Q&A for monolithic 1M+ LOC repositories',
    category: 'Developer Productivity',
    stage: 'active',
    status: 'active',
    created: '2026-06-15T09:00:00Z',
    updated: '2026-06-27T15:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Natural language navigation of large codebases to accelerate developer onboarding.',
    problem: 'New engineers take 6 weeks to submit their first meaningful PR in multi-million line enterprise repos.',
    solution: 'Graph RAG copilot that answers "How does authentication flow from frontend to DB?" with live code citations.',
    target_user: 'Engineering Directors in 50+ dev organizations',
    workaround: 'Pair programming with expensive senior devs.',
    monetization: '$20/mo per developer.',
    mvp: 'Index repo -> interactive interactive graph explorer.',
    scores: {
      iqi: {
        pain_intensity: 8,
        willingness_to_pay: 7,
        validation_speed: 8,
        reachability: 9,
        switching_friction: 8,
        competition: 5, // Heavy competition from Cursor/Sourcegraph
        ttfd_score: 8,
        total_iqi: 76
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'High Risk',
        complexity_risk: 'Medium Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Medium Risk',
        risk_penalty: 15
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 5,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 20
      },
      priority_score: 88
    },
    validation: {
      interviews: 5,
      positive_interviews: 3,
      negative_interviews: 2,
      landing_visits: 140,
      signup_rate: 11.0,
      demo_requests: 2,
      preorders: 0,
      revenue: 0,
      evidence_score: 6
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Collect Evidence',
      reason: 'Crowded space (Cursor/Sourcegraph). Must focus on specific enterprise auth integrations.'
    }
  },
  {
    id: 'opp_arch_viz',
    name: 'Architecture Visualization Generator',
    tagline: 'Auto-generates clean Mermaid / C4 architecture diagrams dynamically from codebase dependencies',
    category: 'Developer Productivity',
    stage: 'sandbox',
    status: 'active',
    created: '2026-06-28T01:00:00Z',
    updated: '2026-06-28T14:00:00Z',
    owner: 'benneberg@gmail.com',
    description: 'Auto-generates live system C4 architecture diagrams from codebases.',
    problem: 'Lucidchart diagrams in Confluence are outdated 5 minutes after being created.',
    solution: 'CLI tool that inspects import trees and outputs auto-styled interactive Mermaid diagrams.',
    target_user: 'Software Architects & Tech Leads',
    workaround: 'Manually drawing boxes in Miro.',
    monetization: '$15/mo individual or $150/mo team workspace.',
    mvp: 'Upload package.json + tsconfig -> output interactive dependency diagram.',
    scores: {
      iqi: {
        pain_intensity: 7,
        willingness_to_pay: 7,
        validation_speed: 9,
        reachability: 9,
        switching_friction: 9,
        competition: 7,
        ttfd_score: 9,
        total_iqi: 79
      },
      killer: {
        demand_risk: 'Low Risk',
        budget_risk: 'Low Risk',
        access_risk: 'Low Risk',
        competition_risk: 'Low Risk',
        complexity_risk: 'Low Risk',
        ttfd_risk: 'Low Risk',
        overall_risk: 'Low Risk',
        risk_penalty: 0
      },
      ttfd: {
        pay_this_month: true,
        rapid_mvp_days: 2,
        data_available: true,
        interviews_immediate: true,
        speed_bonus: 24
      },
      priority_score: 106
    },
    validation: {
      interviews: 3,
      positive_interviews: 3,
      negative_interviews: 0,
      landing_visits: 85,
      signup_rate: 19.0,
      demo_requests: 2,
      preorders: 0,
      revenue: 0,
      evidence_score: 5
    },
    experiments: [],
    artifacts: {},
    decision: {
      recommended_action: 'Build MVP',
      reason: 'Immediate viral potential on developer Twitter / LinkedIn.'
    }
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = RAW_INITIAL_OPPORTUNITIES.map(opp => {
  const isOpp = !!(opp.incomeEstimate || opp.trustScore || opp.applicationDeadline || opp.source || opp.skills?.length);
  const cleanOpp = {
    ...opp,
    type: (opp.type || (isOpp ? 'opportunity' : 'venture')) as 'venture' | 'opportunity',
    validation: {
      interviews: 0,
      positive_interviews: 0,
      negative_interviews: 0,
      landing_visits: 0,
      signup_rate: 0.0,
      demo_requests: 0,
      preorders: 0,
      revenue: 0,
      evidence_score: 0
    },
    experiments: [],
    artifacts: {}
  };
  
  // OppyScore v1 formula: IQI + Evidence (0) - Risk + SpeedBonus
  const scoreObj = {
    iqi: opp.scores.iqi.total_iqi,
    risk: opp.scores.killer.risk_penalty,
    speed: opp.scores.ttfd.speed_bonus
  };
  const baseScore = scoreObj.iqi - scoreObj.risk + scoreObj.speed;
  
  cleanOpp.scores = {
    ...opp.scores,
    priority_score: baseScore,
    oppy_score_v1: baseScore,
    killer: {
      ...opp.scores.killer,
      risk_penalty: scoreObj.risk
    }
  };
  
  return cleanOpp;
});
