import React, { useState } from 'react';
import { PlusCircle, Sparkles, Compass, CheckCircle2, ShieldAlert, ArrowRight, Layers, Cpu, Code2, BrainCircuit } from 'lucide-react';
import { Opportunity, Category } from '../types';

interface DiscoverLabProps {
  onDiscover: (rawSignal: string, category: Category) => Promise<Opportunity>;
  onSelectOpportunity: (opp: Opportunity) => void;
}

const STARTER_SIGNALS = [
  {
    cat: 'Industrial AI' as Category,
    title: 'PLC Alarm Flood Deduplicator',
    signal: 'SCADA alarm horns scream 1,500 nuisance warnings per shift during continuous line commissioning, training DCS operators to silence the speaker with electrical tape.'
  },
  {
    cat: 'Developer Productivity' as Category,
    title: 'NAND Flash Write Cycle Wear Profiler',
    signal: 'Frequent SPI flash SPI write loops brick remote IoT field stations after 18 months due to write endurance exhaustion, causing expensive RMA dispatches.'
  },
  {
    cat: 'Industrial AI' as Category,
    title: 'OT Legacy Modbus Port NIS2 Scanner',
    signal: 'Enterprise OT security suites cost $100k+, leaving 50-person machine shops running unpatched Windows XP HMIs exposed to regulatory NIS2 audit fines.'
  }
];

export const DiscoverLab: React.FC<DiscoverLabProps> = ({
  onDiscover,
  onSelectOpportunity
}) => {
  const [signal, setSignal] = useState('');
  const [category, setCategory] = useState<Category>('Industrial AI');
  const [discovering, setDiscovering] = useState(false);
  const [result, setResult] = useState<Opportunity | null>(null);
  const [error, setError] = useState('');

  const handleRunDiscover = async (rawToRun?: string, catToRun?: Category) => {
    const text = rawToRun || signal;
    const cat = catToRun || category;
    if (!text.trim()) return;

    setDiscovering(true);
    setError('');
    setResult(null);

    try {
      const opp = await onDiscover(text, cat);
      setResult(opp);
      setSignal('');
    } catch (err: any) {
      setError(err.message || 'Failed to auto-score opportunity');
    } finally {
      setDiscovering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 font-mono text-xs">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Oppy Venture Signal Ingest Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 tracking-tight">
          Transform Raw Friction into Scored Opportunities
        </h1>
        <p className="text-sm font-sans text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Not every idea is worth pursuing. Oppy discovers, evaluates via IQI + Killer Mode, and prepares real-world customer validation experiments automatically.
        </p>
      </div>

      {/* Signal Capture Input Card */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-mono text-neutral-900 font-bold tracking-tight flex items-center justify-between">
            <span>1. DESCRIBE THE RAW CUSTOMER FRICTION / PROBLEM</span>
            <span className="text-neutral-400 font-sans font-normal">Reality beats assumptions</span>
          </label>
          <textarea
            rows={5}
            placeholder="e.g., When a continuous bottling line stops at 3 AM, shift maintenance technicians waste 45 minutes flipping through greasy 800-page OEM binder repair manuals looking for electrical wiring schematics..."
            value={signal}
            onChange={e => setSignal(e.target.value)}
            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-200">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-neutral-500 font-semibold">2. TARGET CATEGORY:</span>
            <div className="flex space-x-2">
              {[
                { id: 'Industrial AI' as Category, icon: Cpu },
                { id: 'Developer Productivity' as Category, icon: Code2 }
              ].map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white font-bold shadow-sm'
                        : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => handleRunDiscover()}
            disabled={discovering || !signal.trim()}
            className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-black text-white font-sans font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 inline-flex items-center justify-center space-x-2"
          >
            <Compass className={`w-4 h-4 ${discovering ? 'animate-spin' : ''}`} />
            <span>{discovering ? 'Auto-Scoring Opportunity...' : 'Discover & Auto-Score v1'}</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-mono text-rose-700">
            {error}
          </div>
        )}
      </div>

      {/* Auto-Scored Result Card */}
      {result && (
        <div className="bg-white border-2 border-neutral-900 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div className="flex items-center space-x-2 text-xs font-mono text-neutral-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>OPPORTUNITY FOLDER PROVISIONED IN SANDBOX</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-neutral-900 text-white">
              ★ OppyScore: {result.scores.priority_score}
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200 uppercase font-semibold">
              {result.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900">{result.name}</h2>
            <p className="text-sm font-sans text-neutral-600 leading-relaxed">{result.tagline}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-neutral-500 font-bold uppercase">Customer Problem</span>
              <p className="text-neutral-800">{result.problem}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-neutral-500 font-bold uppercase">Proposed Intervention</span>
              <p className="text-neutral-800">{result.solution}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-neutral-500 font-bold uppercase">Target Buyer & Title</span>
              <p className="text-blue-600 font-bold">{result.target_user}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-neutral-500 font-bold uppercase">Pricing Model (TTFD)</span>
              <p className="text-emerald-600 font-bold">{result.monetization}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs font-mono text-neutral-600">
              <span>IQI: <strong className="text-neutral-900">{result.scores.iqi.total_iqi}</strong></span>
              <span>•</span>
              <span>Killer Mode: <strong className={result.scores.killer.overall_risk === 'High Risk' ? 'text-rose-600' : 'text-emerald-600'}>{result.scores.killer.overall_risk}</strong></span>
              <span>•</span>
              <span>MVP Speed: <strong className="text-blue-600">{result.scores.ttfd.rapid_mvp_days}d</strong></span>
            </div>

            <button
              onClick={() => onSelectOpportunity(result)}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-sans font-bold text-xs inline-flex items-center space-x-2 transition-all shadow-md active:scale-95"
            >
              <span>Inspect Opportunity Folder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Starter Signal Samples */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold text-center">
          Or Test With Industrial Venture Starter Signals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STARTER_SIGNALS.map((samp, i) => (
            <div
              key={i}
              onClick={() => handleRunDiscover(samp.signal, samp.cat)}
              className="bg-white border border-neutral-200 rounded-2xl p-4 hover:border-neutral-400 transition-all cursor-pointer flex flex-col justify-between text-xs font-mono shadow-sm"
            >
              <div className="space-y-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 uppercase border border-neutral-200">
                  {samp.cat}
                </span>
                <h4 className="font-display font-bold text-neutral-900 text-sm">{samp.title}</h4>
                <p className="text-neutral-600 font-sans line-clamp-3 text-[11px] leading-relaxed">{samp.signal}</p>
              </div>
              <div className="pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-900 font-semibold">
                <span>Run Ingest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
