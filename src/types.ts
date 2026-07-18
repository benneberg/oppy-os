export type Stage = 'sandbox' | 'active' | 'validated' | 'production' | 'archived';
export type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';
export type Category = 
  | 'Industrial AI' 
  | 'Developer Productivity' 
  | 'Strategic Insight'
  | 'Employment'
  | 'Freelance'
  | 'Consulting'
  | 'AI Work'
  | 'Local Services'
  | 'Online Businesses'
  | 'Investments'
  | 'Passive Income'
  | 'Competitions'
  | 'Grants'
  | 'Bounties'
  | 'User Research';

export interface IQIScores {
  pain_intensity: number; // 1-10 (weight 22%)
  willingness_to_pay: number; // 1-10 (weight 18%)
  validation_speed: number; // 1-10 (weight 12%)
  reachability: number; // 1-10 (weight 12%)
  switching_friction: number; // 1-10 (weight 12%)
  competition: number; // 1-10 (weight 10%)
  ttfd_score: number; // 1-10 (weight 14%)
  total_iqi: number; // 0-100
}

export interface KillerModeScores {
  demand_risk: RiskLevel;
  budget_risk: RiskLevel;
  access_risk: RiskLevel;
  competition_risk: RiskLevel;
  complexity_risk: RiskLevel;
  ttfd_risk: RiskLevel;
  overall_risk: RiskLevel;
  risk_penalty: number; // numeric deduction for formula
}

export interface TTFDDetails {
  pay_this_month: boolean;
  rapid_mvp_days: number;
  data_available: boolean;
  interviews_immediate: boolean;
  speed_bonus: number; // 0-25
}

export interface ValidationMetrics {
  interviews: number;
  positive_interviews: number;
  negative_interviews: number;
  landing_visits: number;
  signup_rate: number; // percentage
  demo_requests: number;
  preorders: number;
  revenue: number; // in USD
  evidence_score: number; // calculated evidence weighting (0-50+)
  evidence_weight_percent?: number; // percentage weight of real world evidence vs heuristics
}

export interface Experiment {
  id: string;
  hypothesis: string;
  date: string;
  experiment: string;
  result: string;
  decision: 'Continue' | 'Pivot' | 'Pause' | 'Kill';
  next_action: string;
}

export interface GeneratedArtifacts {
  landing_page_md?: string;
  interview_guide_md?: string;
  validation_summary_md?: string;
  linkedin_outreach?: string[];
  cold_email?: string;
  reddit_post?: string;
  search_queries?: string[];
}

export interface OpportunityDecision {
  recommended_action: 'Investigate Fast' | 'Build MVP' | 'Collect Evidence' | 'Scale Production' | 'Kill Opportunity' | 'Pause & Re-evaluate';
  reason: string;
}

export interface Opportunity {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  stage: Stage;
  status: 'active' | 'stalled' | 'completed' | 'killed';
  created: string;
  updated: string;
  owner: string;
  description: string;
  problem: string;
  solution: string;
  target_user: string;
  workaround: string;
  monetization: string;
  mvp: string;
  scores: {
    iqi: IQIScores;
    killer: KillerModeScores;
    ttfd: TTFDDetails;
    priority_score: number; // Potential + Evidence + TTFD - Risk
    oppy_score_v1?: number; // Unification of IQI, Killer Mode, TTFD & empirical data
  };
  validation: ValidationMetrics;
  experiments: Experiment[];
  artifacts: GeneratedArtifacts;
  decision: OpportunityDecision;
  notes?: string;
  stalledReason?: string;
  stalledAction?: string;
  // Side income properties
  source?: string;
  url?: string;
  location?: string;
  remote?: boolean;
  incomeEstimate?: {
    min: number;
    max: number;
    currency: string;
  };
  skills?: string[];
  riskScore?: number;
  trustScore?: number;
  estimatedHours?: number;
  competitionLevel?: string;
  applicationDeadline?: string;
  llmSummary?: string;
  matchScore?: number;
}

export interface AIAgentStatus {
  id: string;
  name: string;
  role: string;
  status: 'ONLINE' | 'ACTIVE' | 'IDLE' | 'PROCESSING';
  lastAction: string;
  processedCount: number;
  accuracyRate: string;
}

export interface PortfolioAnalytics {
  total_opportunities: number;
  average_iqi: number;
  average_priority: number;
  by_stage: Record<Stage, number>;
  by_category: Record<Category, number>;
  total_revenue: number;
  total_interviews: number;
  validation_rate: number;
  active_count: number;
  archived_count: number;
}

export interface MorningDashboardAnswers {
  highest_opportunity: Opportunity | null;
  highest_risk: Opportunity | null;
  fastest_validation: Opportunity | null;
  needs_outreach_today: Opportunity[];
  stalled_projects: Opportunity[];
  new_evidence_leaders: Opportunity[];
  recent_revenue: number;
  daily_ai_briefing: string;
  recommended_next_action: string;
}

export interface LLMConfig {
  provider: string; // 'gemini' | 'groq' | 'openrouter'
  model: string;
  apiKey: string;
}

export interface UserProfile {
  skills: string[];
  experienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  preferredWork: ('Remote' | 'Local' | 'Hybrid')[];
  timeAvailable: number; // hours per week
  incomeGoal: number; // monthly target
  startupBudget: number; // max investment
  riskTolerance: 'Low' | 'Medium' | 'High';
  interests: string; // free text
  excludedCategories: string[]; // MLM, Crypto, etc.
}

