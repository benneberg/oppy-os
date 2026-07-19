import { GoogleGenAI, Type } from '@google/genai';
import { Opportunity, Category, MorningDashboardAnswers, IQIScores, KillerModeScores, TTFDDetails, LLMConfig } from '../types';
import { computeOppyScore } from '../services/scoringEngine.ts';

let genAIClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!genAIClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required.');
    }
    genAIClient = new GoogleGenAI({ apiKey: key });
  }
  return genAIClient;
}

export async function callAIModel(
  config: LLMConfig | undefined,
  systemPrompt: string,
  userPrompt: string,
  jsonSchema?: any
): Promise<string> {
  const provider = config?.provider || 'gemini';
  const apiKey = config?.apiKey || (provider === 'gemini' ? process.env.GEMINI_API_KEY : provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENROUTER_API_KEY) || '';
  const model = config?.model || (provider === 'gemini' ? 'gemini-3.5-flash' : provider === 'groq' ? 'llama-3.3-70b-versatile' : 'meta-llama/llama-3.3-70b-instruct');

  if (!apiKey) {
    throw new Error(`API key for provider "${provider}" is not configured. Please supply your own key in the LLM settings!`);
  }

  if (provider === 'gemini') {
    const ai = new GoogleGenAI({ apiKey });
    const contents = systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt;
    const genConfig: any = {};
    if (jsonSchema) {
      genConfig.responseMimeType = 'application/json';
      genConfig.responseSchema = jsonSchema;
    }

    const res = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: genConfig
    });
    return res.text?.trim() || '';
  } else {
    const url = provider === 'groq' 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://openrouter.ai/api/v1/chat/completions';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://ai.studio/build';
      headers['X-Title'] = 'Oppy OS';
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userPrompt });

    const body: any = {
      model,
      messages
    };

    if (jsonSchema) {
      body.response_format = { type: 'json_object' };
      messages.push({ 
        role: 'system', 
        content: `You MUST return a JSON object that strictly conforms to this JSON Schema (make sure key properties match exactly):\n${JSON.stringify(jsonSchema, null, 2)}` 
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM API request failed [${response.status}]: ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }
}

export function calculatePriorityScore(iqi: number, evidence: number, ttfdBonus: number, riskPenalty: number): number {
  return Math.max(0, Math.round(iqi + evidence - riskPenalty));
}

export function getMorningAnswers(portfolio: Opportunity[]): MorningDashboardAnswers {
  const activeAndValidated = portfolio.filter(p => p.status === 'active' && p.stage !== 'archived');
  
  // 1. Highest Opportunity (Highest priority score)
  const sortedByPriority = [...activeAndValidated].sort((a, b) => b.scores.priority_score - a.scores.priority_score);
  const highest_opportunity = sortedByPriority[0] || null;

  // 2. Highest Risk (Killer mode High Risk or highest risk penalty)
  const sortedByRisk = [...activeAndValidated].sort((a, b) => b.scores.killer.risk_penalty - a.scores.killer.risk_penalty);
  const highest_risk = sortedByRisk[0] || null;

  // 3. Fastest Validation Candidate (Highest TTFD speed bonus + rapid mvp days <= 5)
  const sortedByFast = [...activeAndValidated].sort((a, b) => b.scores.ttfd.speed_bonus - a.scores.ttfd.speed_bonus);
  const fastest_validation = sortedByFast[0] || null;

  // 4. Needs Outreach Today (Active opportunities with < 5 interviews)
  const needs_outreach_today = activeAndValidated.filter(p => p.stage === 'active' && p.validation.interviews < 5).slice(0, 4);

  // 5. Stalled Projects (Explicitly flagged, or old updates, or zero validation progress/artifacts)
  const stalled_projects = portfolio
    .map(p => {
      const nowMs = Date.now();
      const updatedMs = p.updated ? new Date(p.updated).getTime() : new Date(p.created || nowMs).getTime();
      const createdMs = p.created ? new Date(p.created).getTime() : nowMs;
      const daysSinceUpdate = Math.floor((nowMs - updatedMs) / (1000 * 60 * 60 * 24));
      const daysSinceCreation = Math.floor((nowMs - createdMs) / (1000 * 60 * 60 * 24));
      
      const hasArtifacts = !!(p.artifacts && (
        p.artifacts.landing_page_md || 
        p.artifacts.interview_guide_md || 
        p.artifacts.validation_summary_md || 
        p.artifacts.cold_email ||
        p.artifacts.reddit_post ||
        p.artifacts.linkedin_outreach?.length
      ));

      const interviewsCount = p.validation?.interviews || 0;
      const landingVisits = p.validation?.landing_visits || 0;

      let isStalled = false;
      let reason = '';
      let action: 'Re-evaluate Hypothesis' | 'Attempt Outreach' | 'Archive' = 'Re-evaluate Hypothesis';

      if (p.status === 'stalled') {
        isStalled = true;
        reason = 'Explicitly marked as stalled.';
        action = 'Re-evaluate Hypothesis';
      } else if (p.status === 'killed' || p.stage === 'archived') {
        isStalled = false;
      } else if (daysSinceUpdate >= 7) {
        isStalled = true;
        reason = `No updates in opportunity.json for ${daysSinceUpdate} days.`;
        action = 'Archive';
      } else if (p.stage === 'active' && daysSinceCreation >= 3 && interviewsCount === 0) {
        isStalled = true;
        reason = `No progress through stages: 0 interviews logged after ${daysSinceCreation} days.`;
        action = 'Attempt Outreach';
      } else if (daysSinceCreation >= 4 && !hasArtifacts) {
        isStalled = true;
        reason = `No validation artifacts generated after ${daysSinceCreation} days.`;
        action = 'Re-evaluate Hypothesis';
      } else if (p.stage === 'sandbox' && daysSinceCreation >= 5 && landingVisits === 0) {
        isStalled = true;
        reason = `Sandbox project with no validation activity for ${daysSinceCreation} days.`;
        action = 'Attempt Outreach';
      }

      if (isStalled) {
        return {
          ...p,
          stalledReason: reason,
          stalledAction: action
        } as Opportunity;
      }
      return null;
    })
    .filter((p): p is Opportunity => p !== null)
    .slice(0, 3);

  // 6. New Customer Evidence leaders
  const new_evidence_leaders = [...activeAndValidated].sort((a, b) => b.validation.evidence_score - a.validation.evidence_score).slice(0, 3);

  // 7. Recent Revenue
  const recent_revenue = portfolio.reduce((sum, p) => sum + (p.validation.revenue || 0), 0);

  // Default heuristic briefing if AI call fails
  const topName = highest_opportunity ? highest_opportunity.name : 'none yet';
  const action = highest_opportunity ? `Focus your next 60 minutes on scheduling interviews for ${highest_opportunity.name}.` : 'Review sandbox opportunities.';

  return {
    highest_opportunity,
    highest_risk,
    fastest_validation,
    needs_outreach_today,
    stalled_projects,
    new_evidence_leaders,
    recent_revenue,
    daily_ai_briefing: `Oppy OS Intelligence Brief: You have ${portfolio.length} opportunities tracked. Top scorer: ${topName}. Evidence acquisition should remain your core priority today.`,
    recommended_next_action: action
  };
}

export async function generateMorningAIIntelligence(portfolio: Opportunity[], config?: LLMConfig): Promise<string> {
  const provider = config?.provider || 'gemini';
  const apiKey = config?.apiKey || (provider === 'gemini' ? process.env.GEMINI_API_KEY : provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENROUTER_API_KEY);

  if (!apiKey) {
    return `Oppy Morning Cockpit: You have ${portfolio.length} total opportunities tracked. Focus on downtime reduction and compliance automation. [Add your custom LLM API Key in settings to enable full daily live brief generation]`;
  }
  try {
    const top3 = [...portfolio].sort((a, b) => b.scores.priority_score - a.scores.priority_score).slice(0, 3).map(p => `${p.name} (Score: ${p.scores.priority_score}, Stage: ${p.stage})`).join(', ');
    const systemPrompt = `You are Oppy, the Founder Decision Operating System.`;
    const userPrompt = `Review this founder's top venture opportunities: [${top3}]. Write a crisp, 3-sentence executive morning venture briefing advising the founder on what to execute today based on fast rejection and evidence over opinions. Avoid fluff. Do not output markdown or prefix text, just write a single paragraph of plain text.`;
    
    return await callAIModel(config, systemPrompt, userPrompt);
  } catch (err) {
    console.error('Gemini morning intelligence error:', err);
    return `Oppy Intelligence: Prioritize customer validation interviews over coding today.`;
  }
}


export async function discoverNewOpportunityAI(rawSignal: string, category: Category, config?: LLMConfig, userEmail?: string): Promise<Opportunity> {
  const id = `opp_${Date.now().toString(36)}`;
  const now = new Date().toISOString();

  const provider = config?.provider || 'gemini';
  const apiKey = config?.apiKey || (provider === 'gemini' ? process.env.GEMINI_API_KEY : provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENROUTER_API_KEY);

  if (!apiKey) {
    // Fallback heuristic discovery
    const iqi: IQIScores = {
      pain_intensity: 8,
      willingness_to_pay: 8,
      validation_speed: 8,
      reachability: 8,
      switching_friction: 7,
      competition: 7,
      ttfd_score: 8,
      total_iqi: 78
    };
    const killer: KillerModeScores = {
      demand_risk: 'Low Risk',
      budget_risk: 'Low Risk',
      access_risk: 'Low Risk',
      competition_risk: 'Medium Risk',
      complexity_risk: 'Low Risk',
      ttfd_risk: 'Low Risk',
      overall_risk: 'Low Risk',
      risk_penalty: 5
    };
    const ttfd: TTFDDetails = {
      pay_this_month: true,
      rapid_mvp_days: 5,
      data_available: true,
      interviews_immediate: true,
      speed_bonus: 20
    };
    const fallbackOpp: Opportunity = {
      type: 'venture',
      id,
      name: rawSignal.slice(0, 40).replace(/[^a-zA-Z0-9 ]/g, '') || 'New Opportunity',
      tagline: `Structured venture opportunity derived from raw founder signal`,
      category,
      stage: 'sandbox',
      status: 'active',
      created: now,
      updated: now,
      owner: userEmail || 'founder@oppy.ai',
      description: rawSignal,
      problem: `Unstructured friction identified in ${category}.`,
      solution: `Automated intelligence layer built to streamline workflows.`,
      target_user: `Domain Operations Managers`,
      workaround: `Manual spreadsheets and fragmented communication.`,
      monetization: `$300/mo subscription.`,
      mvp: `File upload -> automated diagnostic report.`,
      scores: {
        iqi,
        killer,
        ttfd,
        priority_score: computeOppyScore(iqi, {
          interviews: 0,
          positive_interviews: 0,
          negative_interviews: 0,
          landing_visits: 0,
          signup_rate: 0,
          demo_requests: 0,
          preorders: 0,
          revenue: 0,
          evidence_score: 0
        }, killer).finalScore,
        oppy_score_v1: computeOppyScore(iqi, {
          interviews: 0,
          positive_interviews: 0,
          negative_interviews: 0,
          landing_visits: 0,
          signup_rate: 0,
          demo_requests: 0,
          preorders: 0,
          revenue: 0,
          evidence_score: 0
        }, killer).finalScore
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
        recommended_action: 'Investigate Fast',
        reason: 'New raw signal introduced to sandbox.'
      }
    };

    const finalOpp = await generateArtifactsAI(fallbackOpp, config);
    finalOpp.experiments.push({
      id: `exp_init_${id}`,
      hypothesis: `Target ${finalOpp.target_user} feels the pain of "${finalOpp.problem.substring(0, 80)}..." enough to book a 10-minute feedback call or register early access within 5 days.`,
      date: now.split('T')[0],
      experiment: `Automated Growth Outreach experiment: outbound LinkedIn peer messages and targeted cold emails using Growth Mining templates.`,
      result: 'Awaiting outreach conversion stats / booked interviews.',
      decision: 'Continue',
      next_action: 'Exhaust initial list of 20 target leads via LinkedIn & cold email.'
    });
    return finalOpp;
  }

  try {
    const prompt = `You are Oppy, the Founder Decision Operating System. Transform this raw founder signal or problem description into a highly structured Venture Opportunity in the category "${category}".
Raw Signal: "${rawSignal}"

Return JSON matching the exact structure requested. Be realistic, sharp, and business-focused (especially if Industrial AI or Developer Productivity).`;

    const jsonSchema = {
      type: "object",
      properties: {
        name: { type: "string", description: 'Approachable, distinctive product name (max 5 words)' },
        tagline: { type: "string", description: 'One sentence clear value proposition' },
        problem: { type: "string", description: 'Specific customer pain statement' },
        solution: { type: "string", description: 'Proposed lightweight software/AI intervention' },
        target_user: { type: "string", description: 'Specific economic buyer / user title' },
        workaround: { type: "string", description: 'How they solve or suffer through this today' },
        monetization: { type: "string", description: 'Concrete pricing model (e.g. $500/mo per plant)' },
        mvp: { type: "string", description: 'Ultra-fast 5-day MVP experiment definition' },
        pain_intensity: { type: "integer", description: '1-10' },
        willingness_to_pay: { type: "integer", description: '1-10' },
        validation_speed: { type: "integer", description: '1-10' },
        reachability: { type: "integer", description: '1-10' },
        switching_friction: { type: "integer", description: '1-10' },
        competition: { type: "integer", description: '1-10' },
        ttfd_score: { type: "integer", description: '1-10' },
        demand_risk: { type: "string", description: 'Low Risk, Medium Risk, or High Risk' },
        budget_risk: { type: "string", description: 'Low Risk, Medium Risk, or High Risk' },
        access_risk: { type: "string", description: 'Low Risk, Medium Risk, or High Risk' },
        competition_risk: { type: "string", description: 'Low Risk, Medium Risk, or High Risk' },
        complexity_risk: { type: "string", description: 'Low Risk, Medium Risk, or High Risk' },
        ttfd_risk: { type: "string", description: 'Low Risk, Medium Risk, or High Risk' },
        pay_this_month: { type: "boolean" },
        rapid_mvp_days: { type: "integer", description: 'Estimated days to build MVP' }
      },
      required: ['name', 'tagline', 'problem', 'solution', 'target_user', 'workaround', 'monetization', 'mvp', 'pain_intensity', 'willingness_to_pay', 'validation_speed', 'reachability', 'switching_friction', 'competition', 'ttfd_score', 'demand_risk', 'budget_risk', 'access_risk', 'competition_risk', 'complexity_risk', 'ttfd_risk', 'pay_this_month', 'rapid_mvp_days']
    };

    const text = await callAIModel(config, "You are Oppy, the Founder Decision Operating System.", prompt, jsonSchema);
    const parsed = JSON.parse(text || '{}');

    // Calculate IQI
    const p = Math.min(10, Math.max(1, parsed.pain_intensity || 7));
    const w = Math.min(10, Math.max(1, parsed.willingness_to_pay || 7));
    const vs = Math.min(10, Math.max(1, parsed.validation_speed || 7));
    const r = Math.min(10, Math.max(1, parsed.reachability || 7));
    const sf = Math.min(10, Math.max(1, parsed.switching_friction || 7));
    const c = Math.min(10, Math.max(1, parsed.competition || 7));
    const ts = Math.min(10, Math.max(1, parsed.ttfd_score || 7));

    // IQI formula weights: Pain 22%, WTP 18%, ValSpeed 12%, Reach 12%, Switch 12%, Comp 10%, TTFD 14%
    const weighted_iqi = Math.round((p * 2.2 + w * 1.8 + vs * 1.2 + r * 1.2 + sf * 1.2 + c * 1.0 + ts * 1.4) * 10);

    const parseRisk = (val: any): 'Low Risk' | 'Medium Risk' | 'High Risk' => {
      if (val === 'High Risk' || val === 'Medium Risk' || val === 'Low Risk') return val;
      return 'Low Risk';
    };

    const dRisk = parseRisk(parsed.demand_risk);
    const bRisk = parseRisk(parsed.budget_risk);
    const aRisk = parseRisk(parsed.access_risk);
    const cRisk = parseRisk(parsed.competition_risk);
    const cxRisk = parseRisk(parsed.complexity_risk);
    const tRisk = parseRisk(parsed.ttfd_risk);

    let riskCount = 0;
    [dRisk, bRisk, aRisk, cRisk, cxRisk, tRisk].forEach(rk => {
      if (rk === 'High Risk') riskCount += 8;
      if (rk === 'Medium Risk') riskCount += 3;
    });

    const overall_risk: 'Low Risk' | 'Medium Risk' | 'High Risk' = riskCount >= 16 ? 'High Risk' : (riskCount >= 8 ? 'Medium Risk' : 'Low Risk');

    const speed_bonus = (parsed.pay_this_month ? 12 : 0) + (parsed.rapid_mvp_days <= 5 ? 10 : 5);

    const iqiObj = {
      pain_intensity: p,
      willingness_to_pay: w,
      validation_speed: vs,
      reachability: r,
      switching_friction: sf,
      competition: c,
      ttfd_score: ts,
      total_iqi: weighted_iqi
    };

    const killerObj = {
      demand_risk: dRisk,
      budget_risk: bRisk,
      access_risk: aRisk,
      competition_risk: cRisk,
      complexity_risk: cxRisk,
      ttfd_risk: tRisk,
      overall_risk,
      risk_penalty: riskCount
    };

    const dummyValidation = {
      interviews: 0,
      positive_interviews: 0,
      negative_interviews: 0,
      landing_visits: 0,
      signup_rate: 0,
      demo_requests: 0,
      preorders: 0,
      revenue: 0,
      evidence_score: 0
    };

    const scoreObj = computeOppyScore(iqiObj, dummyValidation, killerObj);

    const initialOpp: Opportunity = {
      type: 'venture',
      id,
      name: parsed.name || 'New Opportunity',
      tagline: parsed.tagline || rawSignal,
      category,
      stage: 'sandbox',
      status: 'active',
      created: now,
      updated: now,
      owner: userEmail || 'founder@oppy.ai',
      description: rawSignal,
      problem: parsed.problem || rawSignal,
      solution: parsed.solution || 'Automated layout parser/workflow intervention',
      target_user: parsed.target_user || 'Target Operator',
      workaround: parsed.workaround || 'Manual process',
      monetization: parsed.monetization || '$250/month per user',
      mvp: parsed.mvp || 'Run simple landing page with validation form',
      scores: {
        iqi: iqiObj,
        killer: killerObj,
        ttfd: {
          pay_this_month: Boolean(parsed.pay_this_month),
          rapid_mvp_days: parsed.rapid_mvp_days || 7,
          data_available: true,
          interviews_immediate: true,
          speed_bonus
        },
        priority_score: scoreObj.finalScore,
        oppy_score_v1: scoreObj.finalScore
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
        recommended_action: 'Investigate Fast',
        reason: 'Auto-scored by Oppy IQI and Killer Mode.'
      }
    };

    const finalOpp = await generateArtifactsAI(initialOpp, config);

    if (!['Industrial AI', 'Developer Productivity', 'Strategic Insight'].includes(category)) {
      finalOpp.type = 'opportunity';
      finalOpp.source = 'Web Sourced';
      finalOpp.url = '';
      finalOpp.location = 'Remote';
      finalOpp.remote = true;
      finalOpp.incomeEstimate = {
        min: parsed.pay_this_month ? 1500 : 500,
        max: parsed.pay_this_month ? 5000 : 2000,
        currency: '€'
      };
      finalOpp.skills = ['Automation', 'AI', 'Programming'];
      finalOpp.riskScore = overall_risk === 'High Risk' ? 8 : overall_risk === 'Medium Risk' ? 4 : 2;
      finalOpp.trustScore = 90;
      finalOpp.estimatedHours = parsed.rapid_mvp_days || 10;
      finalOpp.competitionLevel = 'Medium';
      finalOpp.llmSummary = parsed.solution || '';
      finalOpp.matchScore = Math.min(100, Math.max(50, Math.round(95 - (riskCount * 1.5))));
    } else {
      finalOpp.type = 'venture';
    }

    finalOpp.experiments.push({
      id: `exp_init_${id}`,
      hypothesis: `Target ${finalOpp.target_user} feels the pain of "${finalOpp.problem.substring(0, 80)}..." enough to book a 10-minute feedback call or register early access within 5 days.`,
      date: now.split('T')[0],
      experiment: `Automated Growth Outreach experiment: outbound LinkedIn peer messages and targeted cold emails using Growth Mining templates.`,
      result: 'Awaiting outreach conversion stats / booked interviews.',
      decision: 'Continue',
      next_action: 'Exhaust initial list of 20 target leads via LinkedIn & cold email.'
    });

    return finalOpp;
  } catch (err) {
    console.error('Discover AI error:', err);
    throw new Error('Failed to discover opportunity via AI');
  }
}

export async function generateArtifactsAI(opp: Opportunity, config?: LLMConfig): Promise<Opportunity> {
  const provider = config?.provider || 'gemini';
  const apiKey = config?.apiKey || (provider === 'gemini' ? process.env.GEMINI_API_KEY : provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENROUTER_API_KEY);

  if (!apiKey) {
    opp.artifacts = {
      landing_page_md: `# Solve ${opp.problem}\n\n**${opp.name}** delivers ${opp.solution}.\n\n- Built for ${opp.target_user}\n- Replaces ${opp.workaround}\n- Pricing: ${opp.monetization}\n\n[Request Early Access Demo]`,
      interview_guide_md: `1. How do you solve ${opp.problem} today?\n2. What frustrates you most about ${opp.workaround}?\n3. What does this friction cost your team monthly?\n4. What happens if nothing changes over the next 12 months?\n5. Would your department approve ${opp.monetization} to eliminate this?`,
      validation_summary_md: `Hypothesis: ${opp.target_user} will pay ${opp.monetization} for ${opp.mvp}.\nRisk: ${opp.scores.killer.overall_risk}.`,
      linkedin_outreach: [
        `Hi [Name], saw you lead operations at [Company]. We're researching how teams handle ${opp.problem}. Are you open to a quick 10-min feedback chat? No sales pitch.`,
        `Hi [Name], quick question—how is your team handling ${opp.workaround} right now? Building a tool to automate this.`
      ],
      cold_email: `Subject: Quick question re: ${opp.problem}\n\nHi [Name],\n\nI noticed [Company] manages industrial operations. Most leaders we talk to mention ${opp.workaround} is a major bottleneck.\n\nWe're testing a lightweight intervention (${opp.name}) that ${opp.tagline}.\n\nDo you have 10 minutes next Tuesday for a feedback review? Happy to share our benchmarking data.\n\nBest,\nFounder @ Oppy`,
      reddit_post: `Title: How are you all handling ${opp.problem}?\n\nHey r/industrialengineering / r/automation,\n\nWorking on a prototype to eliminate ${opp.workaround}. Curious if anyone else deals with this daily or if you've built custom internal scripts. Any advice appreciated!`,
      search_queries: [`"head of automation" site:linkedin.com`, `"${opp.target_user}" "${opp.problem}"`, `reddit "${opp.workaround}" complaint`]
    };
    return opp;
  }

  try {
    const prompt = `You are Oppy, the Founder Decision Operating System. Generate validation and outreach artifacts for this venture opportunity:
Name: ${opp.name}
Tagline: ${opp.tagline}
Problem: ${opp.problem}
Solution: ${opp.solution}
Target Buyer: ${opp.target_user}
Workaround: ${opp.workaround}
Pricing: ${opp.monetization}
MVP: ${opp.mvp}

Return JSON containing high-converting landing page markdown, the canonical 8 interview questions tailored to this buyer, a crisp validation summary, 2 LinkedIn connection messages, 1 cold email, 1 Reddit community post, and 3 customer search queries.`;

    const jsonSchema = {
      type: "object",
      properties: {
        landing_page_md: { type: "string" },
        interview_guide_md: { type: "string" },
        validation_summary_md: { type: "string" },
        linkedin_outreach: { type: "array", items: { type: "string" } },
        cold_email: { type: "string" },
        reddit_post: { type: "string" },
        search_queries: { type: "array", items: { type: "string" } }
      },
      required: ['landing_page_md', 'interview_guide_md', 'validation_summary_md', 'linkedin_outreach', 'cold_email', 'reddit_post', 'search_queries']
    };

    const text = await callAIModel(config, "You are Oppy, the Founder Decision Operating System.", prompt, jsonSchema);
    const data = JSON.parse(text || '{}');
    opp.artifacts = {
      landing_page_md: data.landing_page_md || opp.artifacts?.landing_page_md,
      interview_guide_md: data.interview_guide_md || opp.artifacts?.interview_guide_md,
      validation_summary_md: data.validation_summary_md || opp.artifacts?.validation_summary_md,
      linkedin_outreach: data.linkedin_outreach || opp.artifacts?.linkedin_outreach,
      cold_email: data.cold_email || opp.artifacts?.cold_email,
      reddit_post: data.reddit_post || opp.artifacts?.reddit_post,
      search_queries: data.search_queries || opp.artifacts?.search_queries
    };
    return opp;
  } catch (err) {
    console.error('Artifact generation error:', err);
    return opp;
  }
}

export async function analyzeTranscriptAI(
  transcript: string,
  opportunityName: string,
  config?: LLMConfig
): Promise<{
  sentiment: 'Positive' | 'Negative';
  pain_level: number;
  wtp: number;
  summary: string;
  key_quote: string;
}> {
  const provider = config?.provider || 'gemini';
  const apiKey = config?.apiKey || (provider === 'gemini' ? process.env.GEMINI_API_KEY : provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENROUTER_API_KEY);

  if (!apiKey) {
    // Fallback heuristic analysis
    const hasNegativeWords = /expensive|hard|fail|no|not interested|dont buy/i.test(transcript);
    const hasPositiveWords = /love|awesome|buy|need|perfect|pay/i.test(transcript);
    return {
      sentiment: hasNegativeWords && !hasPositiveWords ? 'Negative' : 'Positive',
      pain_level: transcript.length > 150 ? 8 : 6,
      wtp: transcript.length > 200 ? 7 : 5,
      summary: `Automated summary: Customer discussed workflow bottlenecks around ${opportunityName}.`,
      key_quote: transcript.slice(0, 100) + "..."
    };
  }

  try {
    const prompt = `You are Oppy, the Founder Decision Operating System. Analyze this customer discovery interview transcript for the venture opportunity "${opportunityName}".
Transcript: "${transcript}"

Extract:
1. Sentiment: "Positive" (if they validated the pain/solution/willingness to pay) or "Negative" (rejection, no interest).
2. Pain Level (integer 1-10): How intense is their bottleneck?
3. Willingness to Pay (integer 1-10): How willing are they to pay or allocate budget?
4. Summary: Brief 1-sentence summary of the conversation.
5. Key Quote: Most insightful sentence from the transcript.`;

    const jsonSchema = {
      type: "object",
      properties: {
        sentiment: { type: "string", description: '"Positive" or "Negative"' },
        pain_level: { type: "integer", description: '1-10' },
        wtp: { type: "integer", description: '1-10' },
        summary: { type: "string" },
        key_quote: { type: "string" }
      },
      required: ['sentiment', 'pain_level', 'wtp', 'summary', 'key_quote']
    };

    const text = await callAIModel(config, "You are Oppy, the Founder Decision Operating System.", prompt, jsonSchema);
    const data = JSON.parse(text || '{}');
    return {
      sentiment: data.sentiment === 'Negative' ? 'Negative' : 'Positive',
      pain_level: Math.min(10, Math.max(1, data.pain_level || 5)),
      wtp: Math.min(10, Math.max(1, data.wtp || 5)),
      summary: data.summary || 'Completed discovery interview.',
      key_quote: data.key_quote || 'N/A'
    };
  } catch (err) {
    console.error('Transcript analysis error:', err);
    return {
      sentiment: 'Positive',
      pain_level: 7,
      wtp: 6,
      summary: 'Completed customer conversation.',
      key_quote: 'No quote extracted.'
    };
  }
}

export async function enrichOpportunityWithLLM(opp: Opportunity, config?: LLMConfig): Promise<Opportunity> {
  const provider = config?.provider || 'gemini';
  const apiKey = config?.apiKey || (provider === 'gemini' ? process.env.GEMINI_API_KEY : provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENROUTER_API_KEY);

  if (!apiKey) {
    // Fallback heuristic summary when no API key is present
    opp.llmSummary = `Sourced from ${opp.source || 'Web'}. Highly relevant gig involving skills: ${(opp.skills || []).join(', ')}. Est. pay: ${opp.incomeEstimate ? `$${opp.incomeEstimate.min}-${opp.incomeEstimate.max}` : 'contract/variable'}.`;
    opp.summarized = true;
    return opp;
  }

  try {
    const prompt = `You are Oppy, the Founder Decision Operating System. Enrich this crawled/sourced side-income opportunity with a professional assessment.
Name: ${opp.name}
Tagline: ${opp.tagline}
Source: ${opp.source}
Description: ${opp.description}

Analyze this gig and return a JSON object with:
1. llmSummary: A brief 2-sentence summary of the pros, cons, and direct validation strategy for this opportunity.
2. problem: A refined, clear statement of what the client actually needs.
3. solution: A refined statement of how a developer/consultant can solve it.
4. target_user: The actual economic buyer or manager title.
5. workaround: What they are likely doing today.
6. monetization: A professional monetization or bidding rate suggestion (e.g. $500 project, $75/hr).`;

    const jsonSchema = {
      type: "object",
      properties: {
        llmSummary: { type: "string" },
        problem: { type: "string" },
        solution: { type: "string" },
        target_user: { type: "string" },
        workaround: { type: "string" },
        monetization: { type: "string" }
      },
      required: ['llmSummary', 'problem', 'solution', 'target_user', 'workaround', 'monetization']
    };

    const text = await callAIModel(config, "You are Oppy, the Founder Decision Operating System.", prompt, jsonSchema);
    const data = JSON.parse(text || '{}');

    if (data.llmSummary) opp.llmSummary = data.llmSummary;
    if (data.problem) opp.problem = data.problem;
    if (data.solution) opp.solution = data.solution;
    if (data.target_user) opp.target_user = data.target_user;
    if (data.workaround) opp.workaround = data.workaround;
    if (data.monetization) opp.monetization = data.monetization;

    opp.summarized = true;
    return opp;
  } catch (err) {
    console.error(`Enrichment failed for ${opp.id}:`, err);
    opp.llmSummary = `Sourced from ${opp.source || 'Web'}. Needs assessment.`;
    opp.summarized = true;
    return opp;
  }
}
