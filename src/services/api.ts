import { Opportunity, MorningDashboardAnswers, UserProfile } from '../types';
import { INITIAL_OPPORTUNITIES } from '../data/initialOpportunities';

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
