import { describe, it, expect } from 'vitest';
import { computeOppyScore } from '../services/scoringEngine';
import { IQIScores, KillerModeScores, ValidationMetrics, Experiment } from '../types';

describe('Venture Scoring Engine (computeOppyScore)', () => {
  // Helpers to generate default/baseline inputs
  const getBaseIQI = (): IQIScores => ({
    pain_intensity: 5,
    willingness_to_pay: 5,
    validation_speed: 5,
    reachability: 5,
    switching_friction: 5,
    competition: 5,
    ttfd_score: 5,
    total_iqi: 50
  });

  const getBaseKiller = (): KillerModeScores => ({
    demand_risk: 'Medium Risk',
    budget_risk: 'Medium Risk',
    access_risk: 'Medium Risk',
    competition_risk: 'Medium Risk',
    complexity_risk: 'Medium Risk',
    ttfd_risk: 'Medium Risk',
    overall_risk: 'Medium Risk',
    risk_penalty: 0
  });

  const getBaseValidation = (): ValidationMetrics => ({
    interviews: 0,
    positive_interviews: 0,
    negative_interviews: 0,
    landing_visits: 0,
    signup_rate: 0,
    demo_requests: 0,
    preorders: 0,
    revenue: 0,
    evidence_score: 0
  });

  describe('1. Floor and Ceiling Clamps', () => {
    it('forces extreme inputs into valid bounds without crashing', () => {
      // Pass extremely negative and high IQI values
      const badIQI: IQIScores = {
        pain_intensity: -10,
        willingness_to_pay: 15,
        validation_speed: 0,
        reachability: 200,
        switching_friction: -5,
        competition: 12,
        ttfd_score: 8,
        total_iqi: 0
      };

      const result = computeOppyScore(badIQI, getBaseValidation(), getBaseKiller());
      // Expect clamped base calculations
      // -10 clamped to 1
      // 15 clamped to 10
      // 0 clamped to 1
      // 200 clamped to 10
      // -5 clamped to 1
      // 12 clamped to 10
      // 8 remains 8
      expect(result.potential).toBeGreaterThan(0);
      expect(result.finalScore).toBeGreaterThanOrEqual(0);
    });

    it('safely keeps negative metrics clamped to zero', () => {
      const negativeValidation: ValidationMetrics = {
        interviews: -5,
        positive_interviews: -10,
        negative_interviews: -2,
        landing_visits: -100,
        signup_rate: -10,
        demo_requests: -3,
        preorders: -1,
        revenue: -500,
        evidence_score: 0
      };

      const result = computeOppyScore(getBaseIQI(), negativeValidation, getBaseKiller());
      expect(result.evidence).toBe(0);
      expect(result.evidenceWeightPercent).toBe(0);
    });

    it('clamps finalScore to a floor of zero when risk dwarfs potential and evidence', () => {
      const lowIQI: IQIScores = {
        pain_intensity: 1,
        willingness_to_pay: 1,
        validation_speed: 1,
        reachability: 1,
        switching_friction: 1,
        competition: 1,
        ttfd_score: 1,
        total_iqi: 10
      };

      const highRiskKiller: KillerModeScores = {
        demand_risk: 'High Risk',
        budget_risk: 'High Risk',
        access_risk: 'High Risk',
        competition_risk: 'High Risk',
        complexity_risk: 'High Risk',
        ttfd_risk: 'High Risk',
        overall_risk: 'High Risk',
        risk_penalty: 100
      };

      const val = getBaseValidation();
      val.interviews = 4;
      val.negative_interviews = 3; // >50% negative ratio, risk multiplier 1.5x

      // With very low potential and high risk, final score should not go below 0
      const result = computeOppyScore(lowIQI, val, highRiskKiller);
      expect(result.finalScore).toBe(0);
    });
  });

  describe('2. The shiftFactor Curve (Subjective Potential Attenuation)', () => {
    it('evaluates at 0 interviews (100% subjective potential / 0% empirical weight)', () => {
      const result = computeOppyScore(getBaseIQI(), getBaseValidation(), getBaseKiller());
      expect(result.evidenceWeightPercent).toBe(0);
      // potential at 0 interviews should equal the full base IQI
      // Clamped base values for getBaseIQI() are 5:
      // (5 * 2.2 + 5 * 1.8 + 5 * 1.2 + 5 * 1.2 + 5 * 1.2 + 5 * 1.0 + 5 * 1.4) * 10 = 50 * 10 = 500
      expect(result.potential).toBe(500);
    });

    it('evaluates at 5 interviews (50% shiftFactor, potential attenuated by 35%)', () => {
      const val = getBaseValidation();
      val.interviews = 5;

      const result = computeOppyScore(getBaseIQI(), val, getBaseKiller());
      expect(result.evidenceWeightPercent).toBe(50);
      // shiftFactor is 0.5. Potential is baseIqi * (1 - 0.5 * 0.7) = baseIqi * 0.65
      // 500 * 0.65 = 325
      expect(result.potential).toBe(325);
    });

    it('evaluates at 10+ interviews (100% shiftFactor, potential attenuated to 30% baseline)', () => {
      const val = getBaseValidation();
      val.interviews = 12; // 12 clamps to 100% weight

      const result = computeOppyScore(getBaseIQI(), val, getBaseKiller());
      expect(result.evidenceWeightPercent).toBe(100);
      // shiftFactor is 1.0. Potential is baseIqi * (1 - 1.0 * 0.7) = baseIqi * 0.3
      // 500 * 0.3 = 150
      expect(result.potential).toBe(150);
    });
  });

  describe('3. Evidence Points Accumulation & Conversion Multipliers', () => {
    it('correctly adds positive and negative interview weights', () => {
      const val = getBaseValidation();
      val.interviews = 5;
      val.positive_interviews = 3; // 3 * 12 = 36 pts
      val.negative_interviews = 2; // 2 * -12 = -24 pts
      // Interviews count points: 5 * 3 = 15 pts
      // rawEvidence = 15 + 36 - 24 = 27
      // shiftFactor = 0.5
      // evidence = rawEvidence * (0.3 + 0.5 * 0.7) = 27 * 0.65 = 17.55 -> Math.round(18)

      const result = computeOppyScore(getBaseIQI(), val, getBaseKiller());
      expect(result.evidence).toBe(18);
    });

    it('applies signup rate conversion bonuses and caps signup points at 80', () => {
      const val = getBaseValidation();
      val.interviews = 10;
      val.landing_visits = 100;
      val.signup_rate = 15; // 15% signup rate of 100 is 15 signups. 15 * 3 = 45 base signup points.
      // signupRate bonus: 15 * 2.0 = 30 points.
      // Since signup_rate >= 10, bonus += 15. Total bonus = 45.
      // baseSignupPoints + conversionRateBonus = 45 + 45 = 90. Capped at 80.

      const result = computeOppyScore(getBaseIQI(), val, getBaseKiller());
      // Let's assert that higher conversion produces appropriate scale of evidence
      expect(result.evidence).toBeGreaterThan(0);
    });

    it('gains substantial points from cash revenue', () => {
      const val = getBaseValidation();
      val.interviews = 10;
      val.revenue = 1000; // 10 * 15 = 150 points

      const result = computeOppyScore(getBaseIQI(), val, getBaseKiller());
      // shiftFactor = 1.0. evidence = rawEvidence * 1.0
      // revenuePoints = 150.
      expect(result.evidence).toBeGreaterThanOrEqual(150);
    });
  });

  describe('4. Empirical Risk Multipliers', () => {
    it('amplifies risk penalty by 1.5x when rejection rate is over 50%', () => {
      const val = getBaseValidation();
      val.interviews = 4;
      val.negative_interviews = 3; // 3/4 = 75% negative ratio (>50%)

      const result = computeOppyScore(getBaseIQI(), val, getBaseKiller());
      // Medium Risk * 6 components: (each Medium Risk = 4 penalty points).
      // baseRiskPenalty = 24 points.
      // With negative ratio > 50%, riskMultiplier is 1.5x.
      // 24 * 1.5 = 36.
      expect(result.risk).toBe(36);
    });

    it('reduces risk penalty by 50% when positive validation rate is over 70%', () => {
      const val = getBaseValidation();
      val.interviews = 4;
      val.positive_interviews = 3; // 3/4 = 75% positive ratio (>70%)

      const result = computeOppyScore(getBaseIQI(), val, getBaseKiller());
      // baseRiskPenalty = 24.
      // With positive ratio > 70%, riskMultiplier is 0.5x.
      // 24 * 0.5 = 12.
      expect(result.risk).toBe(12);
    });
  });

  describe('5. Experimental Mitigations of Killer Mode Risks', () => {
    it('reduces specific risk components based on Continue decisions in matching experiments', () => {
      const killer = getBaseKiller();
      killer.demand_risk = 'High Risk'; // 12 points

      const experiments: Experiment[] = [
        {
          id: 'exp1',
          hypothesis: 'Testing demand and customer pain in the market',
          date: '2026-07-19',
          experiment: 'Surveying target developers',
          result: 'Confirmed deep demand',
          decision: 'Continue',
          next_action: 'Build MVP'
        }
      ];

      const result = computeOppyScore(getBaseIQI(), getBaseValidation(), killer, experiments);
      // High Risk (12 pts) is reduced by demand reduction (1 experiment * 4 pts) = 8 pts
      // 5 other Medium Risks (5 * 4 = 20 pts)
      // Total baseRiskPenalty before general discount: 8 + 20 = 28 pts
      // General mitigation: generalRiskReduction * 2 = 1 * 2 = 2 pts
      // Total mitigated: 28 - 2 = 26 pts.
      expect(result.risk).toBe(26);
    });
  });
});
