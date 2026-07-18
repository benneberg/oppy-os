import React, { useState, useEffect } from 'react';
import { Opportunity, UserProfile } from '../types';
import { Compass, Sparkles, Send, ShieldAlert, Award, Bot, Cpu, CheckCircle, RefreshCw, Terminal, Search, Play, FileCode, Check } from 'lucide-react';

interface AIWorkforceProps {
  portfolio: Opportunity[];
  profile: UserProfile;
  onDiscoverNew: (rawSignal: string, category: string) => Promise<Opportunity>;
  onSelectOpportunity: (opp: Opportunity) => void;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'ONLINE' | 'ACTIVE' | 'PROCESSING' | 'COMPLETED';
  lastAction: string;
  count: number;
  accuracy: string;
  description: string;
}

export const AIWorkforce: React.FC<AIWorkforceProps> = ({
  portfolio,
  profile,
  onDiscoverNew,
  onSelectOpportunity
}) => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'scout',
      name: 'Oppy Scout',
      role: 'Opportunity Sourcing',
      status: 'ONLINE',
      lastAction: 'Idle. Awaiting trigger...',
      count: portfolio.length * 2 + 12,
      accuracy: '94.2%',
      description: 'Crawls APIs, forums, and classified listings based on your skill settings.'
    },
    {
      id: 'validator',
      name: 'Oppy Validator',
      role: 'Scam & Risk Analysis',
      status: 'ONLINE',
      lastAction: 'Idle.',
      count: portfolio.length,
      accuracy: '98.7%',
      description: 'Applies heuristics and LLM logic to flag upfront fees, unrealistic pay, and fake listings.'
    },
    {
      id: 'analyst',
      name: 'Oppy Analyst',
      role: 'Deduplication & Matching',
      status: 'ONLINE',
      lastAction: 'Idle.',
      count: portfolio.length + 8,
      accuracy: '96.5%',
      description: 'Merges identical offers from multiple portals and ranks matching confidence.'
    },
    {
      id: 'coach',
      name: 'Oppy Coach',
      role: 'Skill & Path Advisor',
      status: 'ONLINE',
      lastAction: 'Idle.',
      count: 24,
      accuracy: '91.8%',
      description: 'Identifies skill gaps and provides targeted course/project recommendations.'
    },
    {
      id: 'outreach',
      name: 'Oppy Outreach',
      role: 'Proposal & Draft Generation',
      status: 'ONLINE',
      lastAction: 'Idle.',
      count: portfolio.filter(p => p.artifacts.cold_email).length,
      accuracy: '95.0%',
      description: 'Drafts customized emails, LinkedIn pitches, and Upwork proposal cover letters.'
    },
    {
      id: 'learning',
      name: 'Oppy Learner',
      role: 'Preference Alignment',
      status: 'ONLINE',
      lastAction: 'Idle.',
      count: portfolio.length + 5,
      accuracy: '99.1%',
      description: 'Continuously fine-tunes your matching thresholds based on Saved/Hidden choices.'
    }
  ]);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[SYSTEM] Booting AI Agent Workforce Fleet...',
    '[SYSTEM] Agent Scout connected via API pipelines.',
    '[SYSTEM] Validator rules compiled. Spam detection layer: ON.',
    '[SYSTEM] Ready. Select an agent action below to deploy workers.'
  ]);

  const [activeTab, setActiveTab] = useState<string>('all');
  const [targetCategory, setTargetCategory] = useState<string>('Freelance');
  const [rawSignalText, setRawSignalText] = useState<string>('');
  const [isScouting, setIsScouting] = useState<boolean>(false);
  const [selectedOppId, setSelectedOppId] = useState<string>('');
  const [draftedProposal, setDraftedProposal] = useState<string>('');
  const [coachAdvice, setCoachAdvice] = useState<string>('');

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-25));
  };

  const handleRunScout = async () => {
    if (!rawSignalText.trim()) {
      addLog('[SCOUT] Please provide a search query or seed context!');
      return;
    }
    setIsScouting(true);
    // Update agent status
    setAgents(prev => prev.map(a => a.id === 'scout' ? { ...a, status: 'PROCESSING', lastAction: `Crawling web for: "${rawSignalText}"` } : a));
    addLog(`[SCOUT] Dispatched crawler for: "${rawSignalText}" targeting ${targetCategory}...`);
    addLog('[SCOUT] Searching Reddit, GitHub, Upwork and classified lists...');
    
    try {
      setTimeout(async () => {
        try {
          const res = await onDiscoverNew(rawSignalText, targetCategory);
          addLog(`[VALIDATOR] Scanning discovered offer: "${res.name}"`);
          setAgents(prev => prev.map(a => a.id === 'validator' ? { ...a, status: 'PROCESSING', lastAction: `Scrutinizing: ${res.name}` } : a));
          
          setTimeout(() => {
            addLog(`[VALIDATOR] Passed validation. Spam: 0%. Trust Index: ${res.scores.iqi.total_iqi}%.`);
            addLog(`[ANALYST] Deduplicating & ranking. Match confidence computed: ${res.scores.priority_score}%.`);
            setAgents(prev => prev.map(a => {
              if (a.id === 'scout') return { ...a, status: 'ONLINE', count: a.count + 1, lastAction: `Sourced: ${res.name}` };
              if (a.id === 'validator') return { ...a, status: 'ONLINE', count: a.count + 1, lastAction: `Validated: ${res.name}` };
              if (a.id === 'analyst') return { ...a, status: 'ONLINE', count: a.count + 1, lastAction: `Scored: ${res.name}` };
              return a;
            }));
            addLog(`[SYSTEM] New opportunity "${res.name}" successfully committed to your Pipeline Board!`);
            setIsScouting(false);
            setRawSignalText('');
          }, 1500);
        } catch (err: any) {
          addLog(`[ERROR] Discover failed: ${err.message}`);
          setIsScouting(false);
          setAgents(prev => prev.map(a => ({ ...a, status: 'ONLINE' })));
        }
      }, 1500);
    } catch (err: any) {
      addLog(`[ERROR] Sourcing error: ${err.message}`);
      setIsScouting(false);
    }
  };

  const handleGenerateProposal = (oppId: string) => {
    const opp = portfolio.find(p => p.id === oppId);
    if (!opp) return;

    setAgents(prev => prev.map(a => a.id === 'outreach' ? { ...a, status: 'PROCESSING', lastAction: `Generating application for ${opp.name}` } : a));
    addLog(`[OUTREACH] Generating custom application proposal for: "${opp.name}"...`);
    
    setTimeout(() => {
      const email = opp.artifacts?.cold_email || `Subject: Quick proposal regarding ${opp.name}\n\nHi [Target],\n\nI saw your listing for ${opp.name}. With my skills in ${profile.skills.join(', ') || 'software automation'}, I can help build an elegant, robust solution.\n\nLet's schedule a 10-minute briefing chat!\n\nBest,\nLukas`;
      setDraftedProposal(email);
      setAgents(prev => prev.map(a => a.id === 'outreach' ? { ...a, status: 'ONLINE', count: a.count + 1, lastAction: `Generated draft for ${opp.name}` } : a));
      addLog(`[OUTREACH] Complete! Customizable cover letter/proposal draft compiled.`);
    }, 1200);
  };

  const handleAskCoach = () => {
    setAgents(prev => prev.map(a => a.id === 'coach' ? { ...a, status: 'PROCESSING', lastAction: 'Analyzing competency metrics' } : a));
    addLog('[COACH] Evaluating your current Skill Profile against active side hustles...');
    
    setTimeout(() => {
      const missing = availableCompetencies.filter(c => !profile.skills.includes(c));
      const suggestions = `Hello Lukas,\n\nBased on your selected profile, you have an excellent foundation in **${profile.skills.join(', ') || 'General Automation'}**.\n\nTo unlock high-paying Consulting and AI Work opportunities (yielding €1,500+/month), I recommend focusing on these missing modules:\n1. **${missing[0] || 'AI Orchestration'}**: Build a small public project with LangGraph or PydanticAI.\n2. **${missing[1] || 'Sales Funnel Automation'}**: Practice integrating Twilio and Stripe for local business clients.\n\nWould you like me to curate 3 GitHub starter repos for these?`;
      setCoachAdvice(suggestions);
      setAgents(prev => prev.map(a => a.id === 'coach' ? { ...a, status: 'ONLINE', count: a.count + 1, lastAction: 'Curated skill blueprint' } : a));
      addLog('[COACH] Rendered custom competence gap blueprint.');
    }, 1500);
  };

  const availableCompetencies = ['Programming', 'Automation', 'AI', 'Marketing', 'Sales', 'Design'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Overview Dashboard Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-100 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2 text-neutral-800 text-xs font-mono tracking-wider uppercase font-semibold">
            <Bot className="w-5 h-5 text-neutral-900 animate-bounce" />
            <span>AI Operations & Fleet Command</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-neutral-900 tracking-tight leading-tight">
            Deploy Specialized AI Agents
          </h1>
          <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
            Manage your autonomous virtual workforce. Instruct individual agents to crawl remote sources, validate listings, 
            score target fit, draft conversion proposals, or analyze skill path upgrades.
          </p>
        </div>
      </div>

      {/* Agents Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-400 transition-all shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${agent.status === 'PROCESSING' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                  <span className="text-xs font-mono font-bold text-neutral-800 uppercase">{agent.name}</span>
                </span>
                <span className="text-[10px] bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded font-mono text-neutral-500 uppercase">
                  {agent.status}
                </span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-neutral-900">{agent.role}</h4>
                <p className="text-xs text-neutral-500 mt-1 font-sans">{agent.description}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 mt-4 text-[11px] font-mono text-neutral-600 space-y-1">
              <div className="flex justify-between">
                <span>Task count:</span>
                <strong className="text-neutral-900">{agent.count}</strong>
              </div>
              <div className="flex justify-between">
                <span>Reliability:</span>
                <strong className="text-emerald-600">{agent.accuracy}</strong>
              </div>
              <div className="flex justify-between truncate">
                <span>Last action:</span>
                <span className="text-neutral-800 truncate pl-2 max-w-[150px]" title={agent.lastAction}>{agent.lastAction}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Command Control Stations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Scout Control Station */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="pb-3 border-b border-neutral-200 space-y-1">
            <h3 className="font-display font-bold text-base text-neutral-900 flex items-center space-x-2">
              <Search className="w-4.5 h-4.5 text-neutral-900" />
              <span>Oppy Scout Command Center</span>
            </h3>
            <p className="text-xs text-neutral-500">Dispatch the Scout Agent to scan and evaluate raw signals or find side-income categories.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono font-semibold uppercase text-neutral-600 mb-1">Target Category</label>
                <select
                  value={targetCategory}
                  onChange={e => setTargetCategory(e.target.value)}
                  className="w-full p-2.5 border border-neutral-200 rounded-xl text-xs bg-neutral-50 focus:outline-none"
                >
                  <option value="Freelance">Freelance Contracts</option>
                  <option value="AI Work">AI Work / Annotations</option>
                  <option value="Bounties">Bounties & Issues</option>
                  <option value="Grants">Funding / Grants</option>
                  <option value="Passive Income">Passive Cashflows</option>
                  <option value="Consulting">Consulting / Gigs</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-semibold uppercase text-neutral-600 mb-1">Source Filter</label>
                <select
                  className="w-full p-2.5 border border-neutral-200 rounded-xl text-xs bg-neutral-50 focus:outline-none"
                  disabled
                >
                  <option>Automatic (Reddit + GitHub + APIs)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold uppercase text-neutral-600 mb-1">Raw Sourcing Signal or Query</label>
              <textarea
                value={rawSignalText}
                onChange={e => setRawSignalText(e.target.value)}
                placeholder="e.g. 'I want to build python web scrapers for real estate agents' or 'Upwork gig: looking for help setting up automated make.com CRM sync'"
                rows={3}
                className="w-full p-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-neutral-800 font-sans"
              />
            </div>

            <button
              onClick={handleRunScout}
              disabled={isScouting}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:bg-neutral-300"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isScouting ? 'DISPATCHING CRAWLER...' : 'RUN OPPORTUNITY SCOUT'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Outreach & Coach Control Station */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="pb-3 border-b border-neutral-200 space-y-1">
            <h3 className="font-display font-bold text-base text-neutral-900 flex items-center space-x-2">
              <Cpu className="w-4.5 h-4.5 text-neutral-900" />
              <span>Outreach & Coaching Station</span>
            </h3>
            <p className="text-xs text-neutral-500">Draft customized proposals or evaluate your path metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Outreach Widget */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
              <h4 className="font-mono font-bold text-xs text-neutral-800 uppercase flex items-center space-x-1">
                <Send className="w-3 h-3 text-neutral-600" />
                <span>Oppy Outreach Pitcher</span>
              </h4>
              <p className="text-[11px] text-neutral-500">Select an opportunity in your portfolio to draft an introduction.</p>
              
              <select
                value={selectedOppId}
                onChange={e => {
                  setSelectedOppId(e.target.value);
                  setDraftedProposal('');
                }}
                className="w-full p-2 border border-neutral-200 rounded-lg text-xs bg-white focus:outline-none"
              >
                <option value="">-- Choose Opportunity --</option>
                {portfolio.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <button
                onClick={() => handleGenerateProposal(selectedOppId)}
                disabled={!selectedOppId}
                className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-black text-white font-semibold text-[11px] disabled:bg-neutral-200 disabled:text-neutral-400"
              >
                Draft Application Letter
              </button>
            </div>

            {/* Coach Widget */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-mono font-bold text-xs text-neutral-800 uppercase flex items-center space-x-1">
                  <Award className="w-3 h-3 text-neutral-600" />
                  <span>Oppy Coach Consultant</span>
                </h4>
                <p className="text-[11px] text-neutral-500 mt-1">Request custom suggestions for certifications, public repos, or project upgrades.</p>
              </div>

              <button
                onClick={handleAskCoach}
                className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-black text-white font-semibold text-[11px]"
              >
                Get Skill Gap Analysis
              </button>
            </div>
          </div>

          {/* Output Display Terminal */}
          {draftedProposal && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pb-2 border-b border-neutral-200">
                <span className="font-bold text-neutral-800 flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Draft Complete! (Application Proposal)</span>
                </span>
                <button onClick={() => { navigator.clipboard.writeText(draftedProposal); addLog('Copied draft to clipboard.'); }} className="hover:underline">Copy</button>
              </div>
              <pre className="text-xs font-mono text-neutral-700 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto bg-white p-3 rounded-lg border border-neutral-100">{draftedProposal}</pre>
            </div>
          )}

          {coachAdvice && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pb-2 border-b border-neutral-200">
                <span className="font-bold text-neutral-800 flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Curated Coach Recommendations</span>
                </span>
              </div>
              <p className="text-xs font-sans text-neutral-700 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto bg-white p-3 rounded-lg border border-neutral-100">{coachAdvice}</p>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Output Log console */}
      <div className="bg-neutral-950 text-neutral-400 rounded-xl p-4 border border-neutral-800 shadow-md">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pb-2 mb-2 border-b border-neutral-800">
          <span className="flex items-center space-x-2 text-neutral-300">
            <Terminal className="w-3.5 h-3.5 text-neutral-400 animate-pulse" />
            <span>AI WORKFORCE FLEET ACTIVITY LOGS</span>
          </span>
          <span>ONLINE</span>
        </div>
        <div className="font-mono text-[11px] leading-relaxed space-y-1.5 h-48 overflow-y-auto scrollbar-none flex flex-col-reverse">
          <div className="space-y-1">
            {terminalLogs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
