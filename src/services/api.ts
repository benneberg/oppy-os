import { z } from 'zod';
import { Opportunity, MorningDashboardAnswers, UserProfile } from '../types';
import { INITIAL_OPPORTUNITIES } from '../data/initialOpportunities';

export function sanitizeString(str: string, maxLength: number = 1000): string {
  if (!str) return '';
  const clean = str.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  const stripHtml = clean.replace(/<[^>]*>?/gm, '');
  return stripHtml.trim().slice(0, maxLength);
}

export const discoverOpportunityAISchema = z.object({
  name: z.string().max(100).transform(val => sanitizeString(val, 100)),
  tagline: z.string().max(250).transform(val => sanitizeString(val, 250)),
  problem: z.string().max(1000).transform(val => sanitizeString(val, 1000)),
  solution: z.string().max(1000).transform(val => sanitizeString(val, 1000)),
  target_user: z.string().max(150).transform(val => sanitizeString(val, 150)),
  workaround: z.string().max(500).transform(val => sanitizeString(val, 500)),
  monetization: z.string().max(200).transform(val => sanitizeString(val, 200)),
  mvp: z.string().max(500).transform(val => sanitizeString(val, 500)),
  pain_intensity: z.number().int().min(1).max(10),
  willingness_to_pay: z.number().int().min(1).max(10),
  validation_speed: z.number().int().min(1).max(10),
  reachability: z.number().int().min(1).max(10),
  switching_friction: z.number().int().min(1).max(10),
  competition: z.number().int().min(1).max(10),
  ttfd_score: z.number().int().min(1).max(10),
  demand_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
  budget_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
  access_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
  competition_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
  complexity_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
  ttfd_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
  pay_this_month: z.boolean(),
  rapid_mvp_days: z.number().int().min(1).max(365),
});

export const generatedArtifactsAISchema = z.object({
  landing_page_md: z.string().max(5000).transform(val => sanitizeString(val, 5000)).optional(),
  interview_guide_md: z.string().max(4000).transform(val => sanitizeString(val, 4000)).optional(),
  validation_summary_md: z.string().max(3000).transform(val => sanitizeString(val, 3000)).optional(),
  linkedin_outreach: z.array(z.string().max(1000).transform(val => sanitizeString(val, 1000))).optional(),
  cold_email: z.string().max(4000).transform(val => sanitizeString(val, 4000)).optional(),
  reddit_post: z.string().max(4000).transform(val => sanitizeString(val, 4000)).optional(),
  search_queries: z.array(z.string().max(500).transform(val => sanitizeString(val, 500))).optional(),
});

export const opportunitySchema = z.object({
  type: z.enum(['venture', 'opportunity']).optional(),
  id: z.string(),
  name: z.string().max(150),
  tagline: z.string().max(300),
  category: z.string(),
  stage: z.enum(['sandbox', 'active', 'validated', 'production', 'archived']),
  status: z.enum(['active', 'stalled', 'completed', 'killed']),
  created: z.string(),
  updated: z.string(),
  owner: z.string(),
  description: z.string(),
  problem: z.string(),
  solution: z.string(),
  target_user: z.string(),
  workaround: z.string(),
  monetization: z.string(),
  mvp: z.string(),
  scores: z.object({
    iqi: z.object({
      pain_intensity: z.number(),
      willingness_to_pay: z.number(),
      validation_speed: z.number(),
      reachability: z.number(),
      switching_friction: z.number(),
      competition: z.number(),
      ttfd_score: z.number(),
      total_iqi: z.number(),
    }),
    killer: z.object({
      demand_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
      budget_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
      access_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
      competition_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
      complexity_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
      ttfd_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
      overall_risk: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
      risk_penalty: z.number(),
    }),
    ttfd: z.object({
      pay_this_month: z.boolean(),
      rapid_mvp_days: z.number(),
      data_available: z.boolean(),
      interviews_immediate: z.boolean(),
      speed_bonus: z.number(),
    }),
    priority_score: z.number(),
    oppy_score_v1: z.number().optional(),
  }),
  validation: z.object({
    interviews: z.number(),
    positive_interviews: z.number(),
    negative_interviews: z.number(),
    landing_visits: z.number(),
    signup_rate: z.number(),
    demo_requests: z.number(),
    preorders: z.number(),
    revenue: z.number(),
    evidence_score: z.number(),
    evidence_weight_percent: z.number().optional(),
  }),
  experiments: z.array(z.any()).default([]),
  artifacts: generatedArtifactsAISchema.default({}),
  decision: z.object({
    recommended_action: z.enum(['Investigate Fast', 'Build MVP', 'Collect Evidence', 'Scale Production', 'Kill Opportunity', 'Pause & Re-evaluate']),
    reason: z.string(),
  }),
  notes: z.string().optional(),
  stalledReason: z.string().optional(),
  stalledAction: z.string().optional(),
  source: z.string().optional(),
  url: z.string().optional(),
  location: z.string().optional(),
  remote: z.boolean().optional(),
  incomeEstimate: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string()
  }).optional(),
  skills: z.array(z.string()).optional(),
  riskScore: z.number().optional(),
  trustScore: z.number().optional(),
  estimatedHours: z.number().optional(),
  competitionLevel: z.string().optional(),
  applicationDeadline: z.string().optional(),
  llmSummary: z.string().optional(),
  matchScore: z.number().optional(),
  summarized: z.boolean().optional(),
});

const BASE_URL = '/api';

function getBYOKHeaders(): Record<string, string> {
  const provider = localStorage.getItem('oppy_llm_provider') || 'gemini';
  const model = localStorage.getItem('oppy_llm_model') || '';
  const apiKey = localStorage.getItem('oppy_api_key') || '';
  
  const headers: Record<string, string> = {};
  if (provider && apiKey) {
    headers['X-LLM-Provider'] = provider;
    headers['X-LLM-Model'] = model;
    headers['X-LLM-API-Key'] = apiKey;
  }
  return headers;
}

export async function fetchPortfolio(): Promise<{ portfolio: Opportunity[]; morning: MorningDashboardAnswers; userProfile: UserProfile }> {
  try {
    const res = await fetch(`${BASE_URL}/portfolio`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.warn('Backend server unreachable, falling back to client mock seed:', err);
    // Fallback calculation for local client preview if server cold starts
    const portfolio = INITIAL_OPPORTUNITIES;
    const active = portfolio.filter(p => p.status === 'active' && p.stage !== 'archived');
    const sortedByPriority = [...active].sort((a, b) => b.scores.priority_score - a.scores.priority_score);
    return {
      portfolio,
      morning: {
        highest_opportunity: sortedByPriority[0] || null,
        highest_risk: active.find(p => p.scores.killer.overall_risk === 'High Risk') || active[1] || null,
        fastest_validation: [...active].sort((a, b) => b.scores.ttfd.speed_bonus - a.scores.ttfd.speed_bonus)[0] || null,
        needs_outreach_today: active.filter(p => p.validation.interviews < 5).slice(0, 4),
        stalled_projects: portfolio.filter(p => p.stage === 'sandbox').slice(0, 3),
        new_evidence_leaders: [...active].sort((a, b) => b.validation.evidence_score - a.validation.evidence_score).slice(0, 3),
        recent_revenue: 4750,
        daily_ai_briefing: 'Oppy Cockpit: Industrial AI dominates value density. Pinpoint Downtime Root-Cause Analyzer as your top ROI execution priority.',
        recommended_next_action: 'Focus your next 60 minutes on scheduling customer interviews for Downtime Root-Cause Analyzer.'
      },
      userProfile: {
        skills: ['Automation', 'AI', 'Programming'],
        experienceLevel: 'Expert',
        preferredWork: ['Remote'],
        timeAvailable: 15,
        incomeGoal: 2500,
        startupBudget: 100,
        riskTolerance: 'Low',
        interests: 'Automating local services and businesses, custom voice assistants, technical writing, API integrations',
        excludedCategories: ['MLM', 'Crypto', 'Gambling']
      }
    };
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Failed to save user profile');
}

export async function discoverOpportunity(rawSignal: string, category: string): Promise<Opportunity> {
  const byok = getBYOKHeaders();
  const res = await fetch(`${BASE_URL}/discover`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...byok
    },
    body: JSON.stringify({ rawSignal, category })
  });
  if (!res.ok) throw new Error('Failed to discover opportunity');
  return await res.json();
}

export async function saveOpportunity(opportunity: Opportunity): Promise<Opportunity> {
  const res = await fetch(`${BASE_URL}/opportunities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opportunity)
  });
  if (!res.ok) throw new Error('Failed to save opportunity');
  return await res.json();
}

export async function deleteOpportunity(id: string): Promise<void> {
  await fetch(`${BASE_URL}/opportunities/${id}`, { method: 'DELETE' });
}

export async function generateArtifacts(id: string): Promise<Opportunity> {
  const byok = getBYOKHeaders();
  const res = await fetch(`${BASE_URL}/artifacts/${id}`, { 
    method: 'POST',
    headers: {
      ...byok
    }
  });
  if (!res.ok) throw new Error('Failed to generate artifacts');
  return await res.json();
}

export async function generateMorningBrief(): Promise<{ brief: string }> {
  const byok = getBYOKHeaders();
  const res = await fetch(`${BASE_URL}/morning-brief`, {
    method: 'POST',
    headers: {
      ...byok
    }
  });
  if (!res.ok) throw new Error('Failed to generate morning brief');
  return await res.json();
}

export async function resetPortfolio(): Promise<void> {
  await fetch(`${BASE_URL}/reset`, { method: 'POST' });
}

export async function transcribeAndAnalyzeInterview(transcript: string, opportunityName: string): Promise<{
  sentiment: 'Positive' | 'Negative';
  pain_level: number;
  wtp: number;
  summary: string;
  key_quote: string;
}> {
  const byok = getBYOKHeaders();
  const res = await fetch(`${BASE_URL}/transcribe-interview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...byok
    },
    body: JSON.stringify({ transcript, opportunityName })
  });
  if (!res.ok) throw new Error('Failed to analyze interview transcript');
  return await res.json();
}
