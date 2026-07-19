import React, { useState } from 'react';
import { Layers, ArrowRight, ShieldAlert, Clock, CheckCircle2, DollarSign, MessageSquare, Filter, Search, ChevronRight, Archive, Sparkles } from 'lucide-react';
import { Opportunity, Stage, Category } from '../types';

interface PipelineBoardProps {
  portfolio: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onPromoteStage: (opp: Opportunity, nextStage: Stage) => void;
}

const STAGES: { id: Stage; label: string; color: string; desc: string }[] = [
  { id: 'sandbox', label: 'Sandbox', color: 'slate', desc: 'Raw concepts & problem statements' },
  { id: 'active', label: 'Active Evaluation', color: 'blue', desc: 'Auto-scored, ranking & outreach active' },
  { id: 'validated', label: 'Validated Demand', color: 'amber', desc: '10+ interviews, MVP defined, pricing discussed' },
  { id: 'production', label: 'Production Live', color: 'emerald', desc: 'Paying customers, ongoing dev, real revenue' },
  { id: 'archived', label: 'Archived / Killed', color: 'zinc', desc: 'Fast rejection, superseded or retired' }
];

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  portfolio,
  onSelectOpportunity,
  onPromoteStage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const uniqueCategories = Array.from(new Set(portfolio.map(p => p.category)));
  const allCategories = ['All', ...uniqueCategories];

  const filteredPortfolio = portfolio.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          p.target_user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getNextStage = (current: Stage): Stage | null => {
    if (current === 'sandbox') return 'active';
    if (current === 'active') return 'validated';
    if (current === 'validated') return 'production';
    if (current === 'production') return 'archived';
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Filter Bar */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none max-w-[70%]">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
          <span className="text-xs font-mono text-neutral-500 font-semibold mr-2">CATEGORY:</span>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white font-bold shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start pb-8">
        {STAGES.map(col => {
          const items = filteredPortfolio.filter(p => p.stage === col.id);
          const isArchived = col.id === 'archived';

          return (
            <div
              key={col.id}
              className={`border rounded-2xl p-3.5 flex flex-col min-h-[500px] ${
                col.id === 'active' ? 'border-blue-200 bg-blue-50/50' :
                col.id === 'validated' ? 'border-amber-200 bg-amber-50/50' :
                col.id === 'production' ? 'border-emerald-200 bg-emerald-50/50' :
                'border-neutral-200 bg-neutral-50'
              }`}
            >
              {/* Column Header */}
              <div className="pb-3 mb-3 border-b border-neutral-200 px-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-neutral-900 tracking-tight flex items-center space-x-1.5">
                    <span>{col.label}</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-neutral-700 border border-neutral-200 shadow-sm">
                    {items.length}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-neutral-500 mt-1 line-clamp-1">{col.desc}</p>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[75vh] pr-1">
                {items.length > 0 ? (
                  items.map(opp => {
                    const nextStage = getNextStage(opp.stage);
                    const isHighRisk = opp.scores.killer.overall_risk === 'High Risk';
                    const isLowRisk = opp.scores.killer.overall_risk === 'Low Risk';

                    return (
                      <div
                        key={opp.id}
                        onClick={() => onSelectOpportunity(opp)}
                        className={`bg-white border rounded-xl p-4 space-y-3 transition-all cursor-pointer hover:translate-y-[-2px] shadow-sm ${
                          opp.status === 'killed' ? 'opacity-60 border-rose-200 bg-neutral-50' :
                          isHighRisk ? 'border-rose-300 hover:border-rose-400 bg-rose-50/20' :
                          isLowRisk && opp.stage === 'active' ? 'border-amber-300 shadow-amber-500/5' :
                          'border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 uppercase truncate max-w-[100px]">
                              {opp.category}
                            </span>
                            {opp.matchScore !== undefined && (
                              <span className="px-1.5 py-0.5 rounded font-bold bg-violet-50 text-violet-700 border border-violet-200 shrink-0">
                                {opp.matchScore}% Match
                              </span>
                            )}
                          </div>
                          <span className="px-2 py-0.5 rounded font-bold bg-neutral-900 text-white shrink-0">
                            ★ {opp.scores.priority_score}
                          </span>
                        </div>

                        {/* Title & Tagline */}
                        <div>
                          <h4 className="font-display font-bold text-sm text-neutral-900 line-clamp-2 leading-snug">
                            {opp.name}
                          </h4>
                          <p className="text-[11px] font-sans text-neutral-600 line-clamp-2 mt-1 leading-normal">
                            {opp.problem}
                          </p>
                        </div>

                        {/* Metrics Row */}
                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-600">
                          {opp.type === 'opportunity' ? (
                            <>
                              <span className="flex items-center space-x-0.5 text-neutral-800 font-semibold" title="Income Estimate">
                                <DollarSign className="w-3 h-3 text-neutral-400" />
                                <span>
                                  {opp.incomeEstimate 
                                    ? `${opp.incomeEstimate.currency}${opp.incomeEstimate.min}-${opp.incomeEstimate.max}`
                                    : 'Commission'
                                  }
                                </span>
                              </span>
                              {opp.estimatedHours && (
                                <span className="flex items-center space-x-1" title="Time Commitment">
                                  <Clock className="w-3 h-3 text-neutral-400" />
                                  <span>{opp.estimatedHours}h/wk</span>
                                </span>
                              )}
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200 uppercase">
                                Gig
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="flex items-center space-x-1" title="Customer Interviews">
                                <MessageSquare className="w-3 h-3 text-neutral-400" />
                                <span>{opp.validation.interviews} Int</span>
                              </span>
                              <span className="flex items-center space-x-0.5 text-emerald-700 font-semibold" title="Booked Revenue">
                                <DollarSign className="w-3 h-3" />
                                <span>{opp.validation.revenue}</span>
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                                isHighRisk ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                isLowRisk ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                'bg-neutral-100 text-neutral-600'
                              }`}>
                                {opp.scores.killer.overall_risk.replace(' Risk', '')}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Promote Button */}
                        {nextStage && !isArchived && (
                          <div className="pt-1 flex justify-end" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => onPromoteStage(opp, nextStage)}
                              className="w-full py-1.5 px-2.5 rounded-lg bg-neutral-900 hover:bg-black text-white font-mono text-[10px] font-bold border border-transparent transition-all flex items-center justify-center space-x-1 shadow-sm group/btn"
                            >
                              <span>Promote to {nextStage}</span>
                              <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 px-4 text-center border border-dashed border-neutral-300 bg-white/50 rounded-xl">
                    <p className="text-xs font-mono text-neutral-400">Empty column</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
