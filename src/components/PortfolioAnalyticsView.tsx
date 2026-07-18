import React from 'react';
import { BarChart2, TrendingUp, ShieldAlert, Clock, DollarSign, Layers, Award, CheckCircle2, PieChart, Activity } from 'lucide-react';
import { Opportunity, Category, Stage } from '../types';

interface PortfolioAnalyticsViewProps {
  portfolio: Opportunity[];
}

export const PortfolioAnalyticsView: React.FC<PortfolioAnalyticsViewProps> = ({
  portfolio
}) => {
  const total = portfolio.length || 1;
  const activeCount = portfolio.filter(p => p.stage === 'active').length;
  const validatedCount = portfolio.filter(p => p.stage === 'validated').length;
  const prodCount = portfolio.filter(p => p.stage === 'production').length;
  const archivedCount = portfolio.filter(p => p.stage === 'archived' || p.status === 'killed').length;

  const avgIqi = Math.round(portfolio.reduce((s, p) => s + p.scores.iqi.total_iqi, 0) / total);
  const avgPriority = Math.round(portfolio.reduce((s, p) => s + p.scores.priority_score, 0) / total);
  const totalRev = portfolio.reduce((s, p) => s + (p.validation.revenue || 0), 0);
  const totalInterviews = portfolio.reduce((s, p) => s + p.validation.interviews, 0);

  const lowRiskCount = portfolio.filter(p => p.scores.killer.overall_risk === 'Low Risk').length;
  const highRiskCount = portfolio.filter(p => p.scores.killer.overall_risk === 'High Risk').length;

  const validationRate = Math.round(((validatedCount + prodCount) / total) * 100);
  const archivedPercent = Math.round((archivedCount / total) * 100);

  const categories: Category[] = ['Industrial AI', 'Developer Productivity', 'Strategic Insight'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 tracking-tight flex items-center space-x-2">
            <Activity className="w-7 h-7 text-neutral-900" />
            <span>Portfolio Intelligence Analytics</span>
          </h1>
          <p className="text-xs font-sans text-neutral-500 mt-1">
            Canonical metrics across {portfolio.length} tracked founder venture opportunities.
          </p>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-800 font-bold">
          SINGLE SOURCE OF TRUTH
        </span>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <span className="text-xs font-mono text-neutral-500 font-semibold flex items-center space-x-1.5">
            <TrendingUp className="w-4 h-4 text-neutral-900" />
            <span>AVERAGE IQI SCORE</span>
          </span>
          <div className="text-3xl font-extrabold font-display text-neutral-900">{avgIqi}<span className="text-sm font-mono text-neutral-400">/100</span></div>
          <p className="text-[11px] font-sans text-neutral-500">Weighted opportunity quality</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <span className="text-xs font-mono text-neutral-500 font-semibold flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-neutral-900" />
            <span>AVERAGE OPPYSCORE</span>
          </span>
          <div className="text-3xl font-extrabold font-display text-neutral-900">{avgPriority}</div>
          <p className="text-[11px] font-sans text-neutral-500">Potential + Evid + TTFD - Risk</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <span className="text-xs font-mono text-neutral-500 font-semibold flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>VALIDATION RATE</span>
          </span>
          <div className="text-3xl font-extrabold font-display text-emerald-700">{validationRate}%</div>
          <p className="text-[11px] font-sans text-neutral-500">{validatedCount + prodCount} validated / live products</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <span className="text-xs font-mono text-neutral-500 font-semibold flex items-center space-x-1.5">
            <DollarSign className="w-4 h-4 text-neutral-900" />
            <span>TOTAL TTFD REVENUE</span>
          </span>
          <div className="text-3xl font-extrabold font-display text-neutral-900">${totalRev.toLocaleString()}</div>
          <p className="text-[11px] font-sans text-neutral-500">{totalInterviews} user interviews conducted</p>
        </div>
      </div>

      {/* Stage Breakdown & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Funnel */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 className="text-sm font-display font-bold text-neutral-900 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-neutral-900" />
            <span>Product Lifecycle Funnel</span>
          </h3>

          <div className="space-y-4 font-mono text-xs">
            {[
              { stage: 'Sandbox', count: portfolio.filter(p => p.stage === 'sandbox').length, color: 'bg-neutral-400' },
              { stage: 'Active Evaluation', count: activeCount, color: 'bg-blue-600' },
              { stage: 'Validated Demand', count: validatedCount, color: 'bg-amber-600' },
              { stage: 'Production Live', count: prodCount, color: 'bg-emerald-600' },
              { stage: 'Archived / Rejected', count: archivedCount, color: 'bg-neutral-600' }
            ].map(row => {
              const pct = Math.round((row.count / total) * 100);
              return (
                <div key={row.stage} className="space-y-1.5">
                  <div className="flex justify-between text-neutral-700 font-sans">
                    <span>{row.stage}</span>
                    <span className="font-mono font-bold">{row.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                    <div className={`h-full ${row.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 className="text-sm font-display font-bold text-neutral-900 uppercase tracking-wider flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-neutral-900" />
            <span>Category Density (Strategic Insights)</span>
          </h3>

          <div className="space-y-4 font-mono text-xs">
            {categories.map(cat => {
              const items = portfolio.filter(p => p.category === cat);
              const count = items.length;
              const pct = Math.round((count / total) * 100);
              const catRev = items.reduce((s, p) => s + (p.validation.revenue || 0), 0);
              
              return (
                <div key={cat} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-neutral-900 font-display text-sm">{cat}</div>
                    <div className="text-neutral-500 font-sans text-[11px]">{count} Opportunities ({pct}%)</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-emerald-700 font-bold">${catRev.toLocaleString()} Rev</div>
                    <div className="text-[10px] text-neutral-400">Avg IQI: {Math.round(items.reduce((s,p)=>s+p.scores.iqi.total_iqi,0)/(count||1))}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Killer Mode Risk Distribution Card */}
      <div className="bg-neutral-900 text-white border border-neutral-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-rose-300 font-semibold uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>Killer Mode Portfolio Risk Profile</span>
          </div>
          <h3 className="text-xl font-display font-bold text-white">Execution Risk Health Guard</h3>
          <p className="text-xs font-sans text-neutral-300 max-w-xl leading-relaxed">
            Fast rejection is progress. The system prevents builder traps by tracking execution barriers across Demand, Budget, Access, and Complexity.
          </p>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs text-center shrink-0">
          <div className="bg-neutral-800 p-3.5 rounded-xl border border-neutral-700">
            <div className="text-2xl font-bold text-emerald-300">{lowRiskCount}</div>
            <div className="text-[10px] text-neutral-400 mt-1 uppercase">Low Risk</div>
          </div>
          <div className="bg-neutral-800 p-3.5 rounded-xl border border-rose-500/50">
            <div className="text-2xl font-bold text-rose-300">{highRiskCount}</div>
            <div className="text-[10px] text-neutral-400 mt-1 uppercase">High Risk Traps</div>
          </div>
          <div className="bg-neutral-800 p-3.5 rounded-xl border border-neutral-700">
            <div className="text-2xl font-bold text-neutral-200">{archivedPercent}%</div>
            <div className="text-[10px] text-neutral-400 mt-1 uppercase">Archived Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
