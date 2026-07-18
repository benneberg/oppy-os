import { IQIScores, KillerModeScores, ValidationMetrics, Experiment } from '../types';

export interface ScoreBreakdown {
  potential: number;         // Derived from IQI (subjective ceiling, shrinks as real data takes over)
  evidence: number;          // Empirical evidence score
  risk: number;              // Risk penalty (from Killer Mode traps)
  finalScore: number;        // Potential + Evidence - Risk
  evidenceWeightPercent: number; // Percent weight of real world evidence vs heuristics
  riskPenalty: number;       // Raw risk sum before mitigation/magnification
}

/**
 * Calculates the refactored OppyScore v1: Potential (IQI) + Evidence - Risk (Killer Mode).
 * 
 * CORE PHILOSOPHY: PRIORITIZING EVIDENCE OVER ASSUMPTIONS
 * - At 0 interviews, the score is determined 100% by subjective IQI potential and Killer Mode risks.
 * - As real-world interviews are logged (up to 10+), the Potential (heuristic weight) is attenuated
 *   by up to 70% (minimum 30% baseline for structural attributes), forcing the score to be dominated 
 *   by empirical verification.
 * - Real pre-orders, demo requests, and cash revenue add direct evidence multipliers.
 * - Rejections and negative customer feedback count as heavy direct evidence penalties.
 * - Risk penalties from Killer Mode are mitigated if customer feedback is highly positive (>70% positive),
 *   and magnified if customer feedback is highly negative (>50% rejection rate).
 * - Killer Mode risks are dynamically re-evaluated and reduced by successful validation experiments (Continue decisions).
 */
export function computeOppyScore(
  iqi: IQIScores,
  validation: ValidationMetrics,
  killer: KillerModeScores,
  experiments?: Experiment[]
): ScoreBreakdown {
  // Guard and clamp inputs to prevent any scoring anomalies from manual editing or API noise
  const clampIqi = (val: number | undefined) => Math.max(1, Math.min(10, Math.round(val || 0)));
  const clampMetric = (val: number | undefined) => Math.max(0, Math.round(val || 0));

  const pain = clampIqi(iqi.pain_intensity);
  const wtp = clampIqi(iqi.willingness_to_pay);
  const valSpeed = clampIqi(iqi.validation_speed);
  const reach = clampIqi(iqi.reachability);
  const switching = clampIqi(iqi.switching_friction);
  const comp = clampIqi(iqi.competition);
  const ttfdScore = clampIqi(iqi.ttfd_score);

  // Recalculate total_iqi cleanly using clamped values
  const baseIqi = Math.round((
    pain * 2.2 +
    wtp * 1.8 +
    valSpeed * 1.2 +
    reach * 1.2 +
    switching * 1.2 +
    comp * 1.0 +
    ttfdScore * 1.4
  ) * 10);
  
  // Validation progress shifts the score's dependency from assumptions to facts.
  const interviewsCount = clampMetric(validation.interviews);
  const positiveInterviews = clampMetric(validation.positive_interviews);
  const negativeInterviews = clampMetric(validation.negative_interviews);
  const revenueVal = clampMetric(validation.revenue);
  const demoRequests = clampMetric(validation.demo_requests);
  const preordersVal = clampMetric(validation.preorders);
  const landingVisits = clampMetric(validation.landing_visits);
  
  // We reach 100% empirical shift at 10 customer interviews.
  const evidenceWeightPercent = Math.min(100, Math.round((interviewsCount / 10) * 100));
  const shiftFactor = evidenceWeightPercent / 100; // Range: 0.0 to 1.0
  
  // Potential scales down as validation proof accumulates.
  // E.g., if total_iqi is 80 and shiftFactor is 1.0 (10+ interviews),
  // potential becomes 80 * (1 - 0.7) = 24 points. 
  // The remaining points MUST be earned through real positive customer evidence.
  const potential = Math.round(baseIqi * (1.0 - shiftFactor * 0.7));

  // 2. Calculate Evidence (Empirical Proof)
  // Positive interviews, signups, demos, pre-orders, and revenue add points.
  // Negative interviews act as strong drag.
  const interviewPoints = interviewsCount * 3; // +3 per conversation
  const positivePoints = positiveInterviews * 12; // +12 per positive validation (higher weight)
  const negativePenalty = negativeInterviews * 12; // -12 per direct rejection
  
  const signupRate = validation.signup_rate || 0;
  const signupCount = Math.floor((signupRate * landingVisits) / 100);
  const baseSignupPoints = signupCount * 3; // +3 per landing signup (higher weight)
  
  // High weight to conversion rates (signup_rate):
  let conversionRateBonus = 0;
  if (signupRate > 0) {
    conversionRateBonus = Math.round(signupRate * 2.0); // +2 points per 1% signup rate
    if (signupRate >= 10) conversionRateBonus += 15; // +15 bonus for >= 10% conversion
    if (signupRate >= 20) conversionRateBonus += 30; // +30 bonus for >= 20% conversion (traction)
  }
  const signupPoints = Math.min(80, baseSignupPoints + conversionRateBonus); // higher cap (was 25)
  
  const demoPoints = demoRequests * 8; // +8 per request (was 5)
  const preorderPoints = preordersVal * 25; // +25 per preorder (was 15)
  
  // High weight to revenue: +15 points per $100 revenue (was 4), cap at 150 (was 50)
  const revenuePoints = Math.min(150, Math.floor(revenueVal / 100) * 15);

  const rawEvidence = interviewPoints + positivePoints + signupPoints + demoPoints + preorderPoints + revenuePoints - negativePenalty;
  
  // Evidence score is activated as customer interaction progresses
  const evidence = Math.max(0, Math.round(rawEvidence * (0.3 + shiftFactor * 0.7)));

  // 3. Analyze successful experiments to reduce specific or general Killer Mode risks
  let demandRiskReduction = 0;
  let budgetRiskReduction = 0;
  let accessRiskReduction = 0;
  let competitionRiskReduction = 0;
  let complexityRiskReduction = 0;
  let ttfdRiskReduction = 0;
  let generalRiskReduction = 0;

  if (experiments && experiments.length > 0) {
    experiments.forEach(exp => {
      // Only successful/positive validation experiments reduce risk
      if (exp.decision === 'Continue') {
        const textToSearch = `${exp.hypothesis} ${exp.experiment} ${exp.result}`.toLowerCase();
        
        if (textToSearch.includes('demand') || textToSearch.includes('pain') || textToSearch.includes('need') || textToSearch.includes('market')) {
          demandRiskReduction += 1;
        }
        if (textToSearch.includes('budget') || textToSearch.includes('pricing') || textToSearch.includes('paying') || textToSearch.includes('price') || textToSearch.includes('wtp')) {
          budgetRiskReduction += 1;
        }
        if (textToSearch.includes('access') || textToSearch.includes('outreach') || textToSearch.includes('channel') || textToSearch.includes('reach')) {
          accessRiskReduction += 1;
        }
        if (textToSearch.includes('competition') || textToSearch.includes('alternative') || textToSearch.includes('compete') || textToSearch.includes('competitor')) {
          competitionRiskReduction += 1;
        }
        if (textToSearch.includes('complexity') || textToSearch.includes('build') || textToSearch.includes('tech') || textToSearch.includes('feasible') || textToSearch.includes('integrat')) {
          complexityRiskReduction += 1;
        }
        if (textToSearch.includes('ttfd') || textToSearch.includes('speed') || textToSearch.includes('immediate') || textToSearch.includes('fast')) {
          ttfdRiskReduction += 1;
        }
        
        generalRiskReduction += 1;
      }
    });
  }

  // Calculate Risk (derived from Killer Mode)
  // High risk categories penalize the venture heavily.
  let baseRiskPenalty = 0;
  const risksWithMitigation = [
    { name: 'demand', risk: killer.demand_risk, reduction: demandRiskReduction },
    { name: 'budget', risk: killer.budget_risk, reduction: budgetRiskReduction },
    { name: 'access', risk: killer.access_risk, reduction: accessRiskReduction },
    { name: 'competition', risk: killer.competition_risk, reduction: competitionRiskReduction },
    { name: 'complexity', risk: killer.complexity_risk, reduction: complexityRiskReduction },
    { name: 'ttfd', risk: killer.ttfd_risk, reduction: ttfdRiskReduction },
  ];
  
  risksWithMitigation.forEach(item => {
    let points = 0;
    if (item.risk === 'High Risk') points = 12;
    else if (item.risk === 'Medium Risk') points = 4;

    // Reduce risk points based on successful matching experiments
    const reductionPoints = item.reduction * 4;
    const mitigatedPoints = Math.max(0, points - reductionPoints);
    baseRiskPenalty += mitigatedPoints;
  });

  // Apply overall general validation experiment discount to risk
  const generalMitigation = Math.min(10, generalRiskReduction * 2);
  baseRiskPenalty = Math.max(0, baseRiskPenalty - generalMitigation);

  // Risk mitigation / magnification based on empirical signals:
  let riskMultiplier = 1.0;
  if (interviewsCount >= 3) {
    const positiveRatio = (validation.positive_interviews || 0) / interviewsCount;
    const negativeRatio = (validation.negative_interviews || 0) / interviewsCount;
    
    if (negativeRatio > 0.5) {
      riskMultiplier = 1.5; // Highly negative customer signals amplify risk by 150%
    } else if (positiveRatio > 0.7) {
      riskMultiplier = 0.5; // Highly positive customer validation reduces subjective risk by 50%
    }
  }

  const risk = Math.max(0, Math.round(baseRiskPenalty * riskMultiplier));

  // OppyScore = Potential + Evidence - Risk
  const finalScore = Math.max(0, potential + evidence - risk);

  return {
    potential,
    evidence,
    risk,
    finalScore,
    evidenceWeightPercent,
    riskPenalty: baseRiskPenalty
  };
}
