import React, { useState, useEffect } from 'react';
import { Zap, ShieldAlert, Clock, Send, AlertOctagon, TrendingUp, DollarSign, ArrowRight, CheckCircle2, MessageSquare, ExternalLink, Sparkles, Activity, RefreshCw } from 'lucide-react';
import { MorningDashboardAnswers, Opportunity } from '../types';

interface MorningCockpitProps {
  morning: MorningDashboardAnswers;
  onSelectOpportunity: (opp: Opportunity) => void;
  onRefreshBrief: () => Promise<void>;
  onNavigateToTab: (tab: string) => void;
}

export const MorningCockpit: React.FC<MorningCockpitProps> = ({
  morning,
  onSelectOpportunity,
  onRefreshBrief,
  onNavigateToTab
}) => {
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [aiBrief, setAiBrief] = useState(morning.daily_ai_briefing);

  useEffect(() => {
    setAiBrief(morning.daily_ai_briefing);
  }, [morning.daily_ai_briefing]);

  const handleRefreshAI = async () => {
    setLoadingBrief(true);
    try {
      await onRefreshBrief();
    } finally {
      setLoadingBrief(false);
    }
  };

  const topOpp = morning.highest_opportunity;
  const topRisk = morning.highest_risk;
  const fastVal = morning.fastest_validation;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner Question */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-100 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex items-center space-x-2 text-neutral-800 text-xs font-mono tracking-wider uppercase font-semibold">
            <Sparkles className="w-4 h-4 text-neutral-900 animate-spin" />
            <span>Daily Founder Cockpit</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-neutral-900 tracking-tight leading-tight">
            “What should I build next, and why?”
          </h1>
          
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 sm:p-5 font-sans text-xs sm:text-sm text-neutral-700 leading-relaxed">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-200 text-neutral-500 text-[11px] font-mono">
              <span className="flex items-center space-x-1.5 text-neutral-900 font-semibold">
                <Activity className="w-3.5 h-3.5" />
                <span>OPPY VENTURE INTELLIGENCE</span>
              </span>
              <button 
                onClick={handleRefreshAI}
                disabled={loadingBrief}
                className="flex items-center space-x-1 text-neutral-600 hover:text-black font-semibold disabled:text-neutral-400 hover:underline cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loadingBrief ? 'animate-spin' : ''}`} />
                <span>{loadingBrief ? 'GENERATING...' : 'RE-GENERATE BRIEF'}</span>
              </button>
            </div>
            <p className="text-neutral-800 whitespace-pre-wrap">{aiBrief}</p>
          </div>


          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="bg-neutral-100 border border-neutral-200 text-neutral-800 px-4 py-2 rounded-xl flex items-center space-x-2 font-sans font-bold text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-neutral-900" />
              <span>Recommended Next Action:</span>
              <span className="text-neutral-900 font-normal">{morning.recommended_next_action}</span>
            </div>

            {topOpp && (
              <button
                onClick={() => onSelectOpportunity(topOpp)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <span>Execute on {topOpp.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3 Core Pillars: Opportunity, Risk, Validation Speed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Highest Opportunity */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-400 transition-all shadow-sm group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-800 font-semibold">
                <TrendingUp className="w-4 h-4 text-neutral-900" />
                <span>1. Highest Opportunity</span>
              </span>
              {topOpp && (
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-neutral-100 text-neutral-900 border border-neutral-200">
                  Score: {topOpp.scores.priority_score}
                </span>
              )}
            </div>

            {topOpp ? (
              <div className="space-y-2 cursor-pointer" onClick={() => onSelectOpportunity(topOpp)}>
                <h3 className="font-display font-bold text-lg text-neutral-900 group-hover:underline transition-colors">
                  {topOpp.name}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-sans">
                  {topOpp.tagline}
                </p>
                <div className="pt-2 flex items-center space-x-3 text-xs font-mono text-neutral-600">
                  <span>IQI: <strong className="text-neutral-900">{topOpp.scores.iqi.total_iqi}</strong></span>
                  <span>•</span>
                  <span>Evidence: <strong className="text-emerald-600">+{topOpp.validation.evidence_score}</strong></span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-400 font-mono">No active validated opportunity.</p>
            )}
          </div>

          <div className="pt-6 border-t border-neutral-100 mt-4 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">{topOpp?.category}</span>
            {topOpp && (
              <button
                onClick={() => onSelectOpportunity(topOpp)}
                className="text-xs font-semibold text-neutral-900 hover:underline inline-flex items-center space-x-1"
              >
                <span>Inspect Folder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Pillar 2: Highest Execution Risk */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between hover:border-rose-300 transition-all shadow-sm group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-rose-600 font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>2. Highest Killer Risk</span>
              </span>
              {topRisk && (
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {topRisk.scores.killer.overall_risk}
                </span>
              )}
            </div>

            {topRisk ? (
              <div className="space-y-2 cursor-pointer" onClick={() => onSelectOpportunity(topRisk)}>
                <h3 className="font-display font-bold text-lg text-neutral-900 group-hover:underline transition-colors">
                  {topRisk.name}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-sans">
                  {topRisk.problem}
                </p>
                <div className="pt-2 flex flex-wrap gap-1 text-[10px] font-mono">
                  {topRisk.scores.killer.competition_risk === 'High Risk' && (
                    <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">High Comp</span>
                  )}
                  {topRisk.scores.killer.complexity_risk === 'High Risk' && (
                    <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">High Complexity</span>
                  )}
                  {topRisk.scores.killer.budget_risk === 'High Risk' && (
                    <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">Low WTP</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-400 font-mono">No severe killer traps detected.</p>
            )}
          </div>

          <div className="pt-6 border-t border-neutral-100 mt-4 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">Builder Trap Guard</span>
            {topRisk && (
              <button
                onClick={() => onSelectOpportunity(topRisk)}
                className="text-xs font-semibold text-rose-600 hover:underline inline-flex items-center space-x-1"
              >
                <span>Review Killer Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Pillar 3: Fastest Validation Candidate */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-300 transition-all shadow-sm group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold">
                <Clock className="w-4 h-4" />
                <span>3. Fastest Validation (TTFD)</span>
              </span>
              {fastVal && (
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {fastVal.scores.ttfd.rapid_mvp_days}d MVP
                </span>
              )}
            </div>

            {fastVal ? (
              <div className="space-y-2 cursor-pointer" onClick={() => onSelectOpportunity(fastVal)}>
                <h3 className="font-display font-bold text-lg text-neutral-900 group-hover:underline transition-colors">
                  {fastVal.name}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-sans">
                  {fastVal.mvp}
                </p>
                <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono text-neutral-600">
                  <span className="text-blue-600 font-bold">✓ Pay this month</span>
                  <span>•</span>
                  <span>Bonus: +{fastVal.scores.ttfd.speed_bonus}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-400 font-mono">No fast validation candidates.</p>
            )}
          </div>

          <div className="pt-6 border-t border-neutral-100 mt-4 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">Time to First Dollar</span>
            {fastVal && (
              <button
                onClick={() => onSelectOpportunity(fastVal)}
                className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center space-x-1"
              >
                <span>Launch Landing Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Row: Needs Outreach Today & Stalled Projects & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Outreach Today */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 lg:col-span-2 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>4. Needs Customer Outreach Today</span>
            </div>
            <button
              onClick={() => onNavigateToTab('pipeline')}
              className="text-xs font-mono text-neutral-500 hover:text-neutral-900 inline-flex items-center space-x-1"
            >
              <span>View All Pipeline</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {morning.needs_outreach_today.length > 0 ? (
              morning.needs_outreach_today.map(opp => (
                <div
                  key={opp.id}
                  onClick={() => onSelectOpportunity(opp)}
                  className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 hover:border-neutral-400 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-neutral-600 border border-neutral-200 uppercase">
                        {opp.category}
                      </span>
                      <span className="text-xs font-mono text-neutral-900 font-bold">
                        {opp.validation.interviews}/10 Interviews
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-neutral-900">{opp.name}</h4>
                    <p className="text-xs text-neutral-600 line-clamp-1 mt-1 font-mono">
                      Target: {opp.target_user}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-emerald-700 font-semibold">
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Prepare LinkedIn / Email</span>
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 font-mono col-span-2 py-4 text-center">
                All active opportunities have sufficient initial outreach prepared.
              </p>
            )}
          </div>
        </div>

        {/* Stalled Projects & Revenue Metric Card */}
        <div className="space-y-6">
          {/* Revenue Tracker */}
          <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md border border-neutral-900">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-300 font-semibold mb-2">
              <span className="flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>7. RECENT VALIDATION REVENUE</span>
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white">TTFD SUCCESS</span>
            </div>
            <div className="text-3xl font-bold font-display tracking-tight text-white">
              ${morning.recent_revenue.toLocaleString()}
            </div>
            <p className="text-xs font-sans text-neutral-400 mt-1 leading-relaxed">
              Real cash collected across active pilot experiments. Evidence overrides heuristic score.
            </p>
          </div>

          {/* Stalled Projects */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-900 font-semibold pb-2 border-b border-neutral-200">
              <span className="flex items-center space-x-1.5">
                <AlertOctagon className="w-4 h-4 text-amber-600" />
                <span>5. Stalled / Low Energy</span>
              </span>
              <span className="text-neutral-500 font-normal">Fast Rejection</span>
            </div>

            <div className="space-y-3 pt-1">
              {morning.stalled_projects.length > 0 ? (
                morning.stalled_projects.map(p => {
                  let badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
                  if (p.stalledAction === 'Attempt Outreach') {
                    badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
                  } else if (p.stalledAction === 'Archive') {
                    badgeStyle = "bg-neutral-100 text-neutral-700 border-neutral-300";
                  }

                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectOpportunity(p)}
                      className="group p-3 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-amber-300 hover:bg-neutral-100/50 transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-neutral-900 font-semibold text-xs truncate group-hover:underline font-sans">{p.name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border uppercase font-bold shrink-0 ${badgeStyle}`}>
                          {p.stalledAction || 'Re-evaluate'}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500 font-sans leading-snug">
                        <strong className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Reason:</strong> {p.stalledReason || 'No update or activity recorded.'}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-neutral-400 font-mono text-center py-4">No stalled projects.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
