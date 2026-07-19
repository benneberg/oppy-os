import React, { useState, useEffect } from 'react';
import { UserProfile, Category } from '../types';
import { Sparkles, Save, Check, ShieldAlert, Award, Globe, Clock, DollarSign, Brain, Heart, Ban } from 'lucide-react';

interface OnboardingProfileProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  matchedCount: number;
}

export const OnboardingProfile: React.FC<OnboardingProfileProps> = ({
  profile,
  onSaveProfile,
  matchedCount
}) => {
  const [email, setEmail] = useState<string>(profile.email || '');
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>(profile.experienceLevel || 'Intermediate');
  const [preferredWork, setPreferredWork] = useState<UserProfile['preferredWork']>(profile.preferredWork || ['Remote']);
  const [timeAvailable, setTimeAvailable] = useState<number>(profile.timeAvailable || 10);
  const [incomeGoal, setIncomeGoal] = useState<number>(profile.incomeGoal || 1000);
  const [startupBudget, setStartupBudget] = useState<number>(profile.startupBudget || 500);
  const [riskTolerance, setRiskTolerance] = useState<UserProfile['riskTolerance']>(profile.riskTolerance || 'Medium');
  const [interests, setInterests] = useState<string>(profile.interests || '');
  const [excludedCategories, setExcludedCategories] = useState<string[]>(profile.excludedCategories || []);
  const [isSaved, setIsSaved] = useState(false);

  const availableSkills = [
    'Programming', 'Marketing', 'Sales', 'Photography', 'Writing', 
    'Design', 'Accounting', 'Teaching', 'Construction', 'Automation', 
    'AI', 'IoT', 'Electronics', 'Languages'
  ];

  const commonExclusions = [
    'MLM', 'Crypto', 'Gambling', 'Adult', 'Sales', 'Door-to-door', 'Cold calling'
  ];

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const toggleWorkType = (type: 'Remote' | 'Local' | 'Hybrid') => {
    if (preferredWork.includes(type)) {
      if (preferredWork.length > 1) {
        setPreferredWork(preferredWork.filter(w => w !== type));
      }
    } else {
      setPreferredWork([...preferredWork, type]);
    }
  };

  const toggleExclusion = (exc: string) => {
    if (excludedCategories.includes(exc)) {
      setExcludedCategories(excludedCategories.filter(e => e !== exc));
    } else {
      setExcludedCategories([...excludedCategories, exc]);
    }
  };

  const handleSave = () => {
    const updated: UserProfile = {
      email,
      skills,
      experienceLevel,
      preferredWork,
      timeAvailable,
      incomeGoal,
      startupBudget,
      riskTolerance,
      interests,
      excludedCategories
    };
    onSaveProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Onboarding Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-100 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 text-neutral-800 text-xs font-mono tracking-wider uppercase font-semibold">
            <Sparkles className="w-4 h-4 text-neutral-950" />
            <span>Profile Configuration & Onboarding</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 tracking-tight leading-tight">
            Lukas' Side Income Operating Profile
          </h2>
          <p className="text-sm text-neutral-600 font-sans max-w-2xl">
            Configure your professional superpowers, budget limits, target metrics, and preferences. 
            Oppy's background Scout will filter scam patterns and match you only with high-fit opportunities.
          </p>
          
          <div className="pt-2 flex items-center space-x-3 text-xs font-mono text-neutral-600">
            <div className="bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
              Personalized Matches: <strong className="text-neutral-900">{matchedCount} found</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Hand: Core Superpowers & Skill Matrix */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="space-y-1 pb-3 border-b border-neutral-200">
            <h3 className="font-display font-bold text-base text-neutral-900 flex items-center space-x-2">
              <Brain className="w-4 h-4 text-neutral-800" />
              <span>Skill Matrix & Competency</span>
            </h3>
            <p className="text-xs text-neutral-500">Select all skills you currently possess or wish to monetize.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableSkills.map(skill => {
              const selected = skills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    selected
                      ? 'bg-neutral-900 border-neutral-900 text-white font-semibold'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold text-neutral-800 uppercase flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Experience Level</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Expert'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setExperienceLevel(level)}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all border ${
                      experienceLevel === level
                        ? 'bg-neutral-950 text-white border-neutral-950'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold text-neutral-800 uppercase flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Work Location Mode</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Remote', 'Local', 'Hybrid'] as const).map(mode => {
                  const active = preferredWork.includes(mode);
                  return (
                    <button
                      key={mode}
                      onClick={() => toggleWorkType(mode)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all border ${
                        active
                          ? 'bg-neutral-950 text-white border-neutral-950'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Hand: Targets, Constraints & Budget */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="space-y-1 pb-3 border-b border-neutral-200">
            <h3 className="font-display font-bold text-base text-neutral-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-neutral-800" />
              <span>Targets & Constraints</span>
            </h3>
            <p className="text-xs text-neutral-500">Define how much energy and budget you can allocate.</p>
          </div>

          <div className="space-y-5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-800 uppercase">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. founder@oppy.ai"
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-neutral-800 font-sans"
              />
            </div>

            {/* Time Available */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-neutral-800">
                <span className="font-semibold uppercase">Time Commitment</span>
                <span>{timeAvailable} hours / week</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={timeAvailable}
                onChange={e => setTimeAvailable(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
            </div>

            {/* Income Goal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-neutral-800">
                <span className="font-semibold uppercase">Monthly Income Target</span>
                <span className="font-bold">€{incomeGoal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="15000"
                step="100"
                value={incomeGoal}
                onChange={e => setIncomeGoal(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
            </div>

            {/* Startup Budget */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-neutral-800">
                <span className="font-semibold uppercase">Startup Budget / Investment</span>
                <span className="font-bold">€{startupBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="50"
                value={startupBudget}
                onChange={e => setStartupBudget(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
            </div>

            {/* Risk Tolerance */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold text-neutral-800 uppercase flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Risk Tolerance</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as const).map(tolerance => (
                  <button
                    key={tolerance}
                    onClick={() => setRiskTolerance(tolerance)}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all border ${
                      riskTolerance === tolerance
                        ? 'bg-neutral-950 text-white border-neutral-950'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {tolerance}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Excluded & Custom Interests Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Interests (Free Text) */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="space-y-1 pb-2 border-b border-neutral-200">
            <h3 className="font-display font-bold text-sm text-neutral-900 flex items-center space-x-2">
              <Heart className="w-4 h-4 text-neutral-800" />
              <span>Specific Interests</span>
            </h3>
            <p className="text-xs text-neutral-500">Provide free text tags or focus areas you love (e.g., bot development, tutoring).</p>
          </div>
          <textarea
            value={interests}
            onChange={e => setInterests(e.target.value)}
            rows={3}
            placeholder="e.g. AI-assisted coding, niche SaaS, hardware integrations, automation bots, copyediting..."
            className="w-full p-3 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-neutral-800 font-sans"
          />
        </div>

        {/* Exclusions */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="space-y-1 pb-2 border-b border-neutral-200">
            <h3 className="font-display font-bold text-sm text-neutral-900 flex items-center space-x-2">
              <Ban className="w-4 h-4 text-neutral-800" />
              <span>Excluded Categories (Blacklist)</span>
            </h3>
            <p className="text-xs text-neutral-500">Select any categories or themes you absolutely want to hide.</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {commonExclusions.map(exc => {
              const excluded = excludedCategories.includes(exc);
              return (
                <button
                  key={exc}
                  onClick={() => toggleExclusion(exc)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border flex items-center space-x-1 ${
                    excluded
                      ? 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span>{exc}</span>
                  {excluded && <Check className="w-3 h-3 text-rose-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="bg-neutral-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-neutral-800 shadow-md">
        <div className="text-center sm:text-left space-y-1">
          <p className="text-sm font-semibold text-white">Save Opportunity Profile</p>
          <p className="text-xs text-neutral-400">Updating your profile recalibrates matching confidence indices across all opportunities.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold hover:bg-neutral-100 transition-all active:scale-95"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">PROFILE ACTIVE!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>SAVE & APPLY MATCHES</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
