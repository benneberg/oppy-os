import React, { useState } from 'react';
import { 
  Cpu, 
  Workflow, 
  Bot, 
  Play, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  Terminal, 
  FileText, 
  Linkedin, 
  Mail, 
  Search, 
  CheckSquare
} from 'lucide-react';
import { Opportunity } from '../types';
import { INITIAL_AI_AGENTS } from '../services/agents';
import { computeOppyScore } from '../services/scoringEngine';

interface SystemArchitectureViewProps {
  portfolio: Opportunity[];
}

export const SystemArchitectureView: React.FC<SystemArchitectureViewProps> = ({ portfolio }) => {
  const [agents, setAgents] = useState(INITIAL_AI_AGENTS);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [auditLog, setAuditLog] = useState<string[]>([
    'System initialization successful.',
    'Ready for founder operational friction inputs.'
  ]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [testInput, setTestInput] = useState('Operators spend 6 hours/week manually matching invoice line-items with shipping logs in logistics warehouses.');
  const [testStep, setTestStep] = useState<'idle' | 'ingest' | 'score' | 'assets' | 'complete'>('idle');
  const [simulatedOpp, setSimulatedOpp] = useState<any | null>(null);

  const steps = [
    {
      id: 1,
      title: '1. Raw Signal Ingest',
      agent: 'Signal Ingest Agent',
      action: 'Strips founder bias and normalizes manual operational friction statements into economic bottlenecks.',
      metrics: 'Strips emotional statements like "everyone hates this" and extracts target user roles & manual workarounds.',
      output: 'Sandbox Opportunity (JSON Schema)'
    },
    {
      id: 2,
      title: '2. Heuristic Evaluation',
      agent: 'Scoring Engine Agent',
      action: 'Scans structural procurement risktables & calculates initial IQI Potential and Killer Mode Risk penalties.',
      metrics: 'Calculates Pain intensity, WTP baseline, TTFD access scores, and access compliance Risk Levels.',
      output: 'OppyScore Heuristic Baseline (Range 0-100)'
    },
    {
      id: 3,
      title: '3. Customer Discovery Protocol',
      agent: 'Customer Discovery Agent',
      action: 'Generates non-biased customer validation interview questions and conversion-optimized landing pages.',
      metrics: 'Synthesizes the Canonical 8 Diagnostic Questions targeting actual departmental spending history.',
      output: 'Validation Assets & Interview Script'
    },
    {
      id: 4,
      title: '4. Peer Outreach Mining',
      agent: 'Growth Mining Agent',
      action: 'Assembles target title search queries and designs warm LinkedIn peer and non-sales cold emails.',
      metrics: 'Focuses copy entirely on seeking operation feedback rather than pitching software (driving high TTFD).',
      output: 'Tailored Outreach Connection Templates'
    }
  ];

  // Run portfolio audit simulation
  const handleRunAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditLog(prev => [...prev, `[INIT] Dispatching all 4 autonomous AI Agents to audit portfolio...`]);
    
    setTimeout(() => {
      setAgents(prev => prev.map(a => {
        if (a.id === 'agent_ingest') {
          return { ...a, status: 'PROCESSING', lastAction: 'Scanning raw opportunity description sanitization grids...', processedCount: a.processedCount + 1 };
        }
        return a;
      }));
      setAuditLog(prev => [...prev, `[INGEST] Stripping descriptive founder bias from sandbox opportunities.`]);
    }, 1000);

    setTimeout(() => {
      setAgents(prev => prev.map(a => {
        if (a.id === 'agent_scorer') {
          return { ...a, status: 'PROCESSING', lastAction: 'Recalculating evidence weighting shift against recent customer logs...', processedCount: a.processedCount + 1 };
        }
        return a;
      }));
      setAuditLog(prev => [...prev, `[SCORER] Shifting OppyScore weights: Prioritizing real customer rejections and payments.`]);
    }, 2200);

    setTimeout(() => {
      setAgents(prev => prev.map(a => {
        if (a.id === 'agent_validation') {
          return { ...a, status: 'PROCESSING', lastAction: 'Auditing interview guides for compliance with the canonical 8 rules...', processedCount: a.processedCount + 1 };
        }
        return a;
      }));
      setAuditLog(prev => [...prev, `[VALIDATOR] Standardizing 8 diagnostic questions. Verifying budget owner triggers.`]);
    }, 3400);

    setTimeout(() => {
      setAgents(prev => prev.map(a => {
        if (a.id === 'agent_outreach') {
          return { ...a, status: 'PROCESSING', lastAction: 'Generating peer benchmarking templates for stalled assets...', processedCount: a.processedCount + 1 };
        }
        return a;
      }));
      setAuditLog(prev => [...prev, `[OUTREACH] Updating LinkedIn search queries to target active Operations Directors.`]);
    }, 4500);

    setTimeout(() => {
      setAgents(prev => prev.map(a => ({ ...a, status: 'ONLINE' })));
      setAuditLog(prev => [...prev, `[COMPLETE] Audit complete. All ${portfolio.length} opportunities validated and scoring calculations synced.`]);
      setIsAuditing(false);
    }, 5500);
  };

  // Run pipeline simulation step by step
  const handleSimulatePipeline = () => {
    if (testStep !== 'idle' && testStep !== 'complete') return;
    
    setTestStep('ingest');
    setSimulatedOpp(null);
    
    setTimeout(() => {
      setTestStep('score');
    }, 1500);

    setTimeout(() => {
      setTestStep('assets');
    }, 3000);

    setTimeout(() => {
      // Create a mocked simulated output
      const name = "Warehouse Invoice Line-Item Automator";
      const tagline = "Eliminate hours of logistics matches with direct layout parsing";
      const problem = "Warehouse operations managers waste 6 hours/week manually matching invoice line-items with physical shipping logs.";
      const solution = "Lightweight layout-aware parser that ingests physical sheets and reconciles inventory databases instantly.";
      const target_user = "Warehouse Operations Manager / Logistics Lead";
      const workaround = "Manual dual-screen Excel cross-referencing and phone log checks.";
      const monetization = "$400/month per warehouse site.";
      const mvp = "Direct PDF upload pipeline returning structured delta sheet in under 1 minute.";

      const dummyIqiObj = {
        pain_intensity: 9,
        willingness_to_pay: 8,
        validation_speed: 8,
        reachability: 7,
        switching_friction: 8,
        competition: 6,
        ttfd_score: 9,
        total_iqi: 83
      };

      const dummyKillerObj = {
        demand_risk: 'Low Risk' as const,
        budget_risk: 'Medium Risk' as const,
        access_risk: 'Low Risk' as const,
        competition_risk: 'Low Risk' as const,
        complexity_risk: 'Low Risk' as const,
        ttfd_risk: 'Low Risk' as const,
        overall_risk: 'Low Risk' as const,
        risk_penalty: 4
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

      const scoreResult = computeOppyScore(dummyIqiObj, dummyValidation, dummyKillerObj);

      setSimulatedOpp({
        name,
        tagline,
        problem,
        solution,
        target_user,
        workaround,
        monetization,
        mvp,
        scores: scoreResult,
        iqi: dummyIqiObj,
        killer: dummyKillerObj
      });
      setTestStep('complete');
    }, 4500);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="system-architecture-view">
      {/* Overview Card */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-800 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full border border-neutral-700 text-xs font-mono">
            <Workflow className="w-3.5 h-3.5 text-indigo-400" />
            <span>Oppy Venture Engine Topology</span>
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Auto-Venture Pipeline & Agent Monitor</h1>
          <p className="text-sm text-neutral-400 leading-relaxed font-sans">
            Explore Oppy’s four core pipeline stages. Watch how raw founder operational signals are received, stripped of cognitive biases, heuristically evaluated, and converted into highly tailored customer validation assets—orchestrated seamlessly by our autonomous AI Agent fleet.
          </p>
        </div>
      </div>

      {/* Grid: Pipeline Map & Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive Pipeline Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-neutral-900 tracking-tight">The Auto-Venture Pipeline Flow</h2>
                <p className="text-xs text-neutral-500 font-mono">Interactive pipeline steps from input to validation copy</p>
              </div>
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>

            <div className="space-y-4 relative">
              {/* Visual linking line */}
              <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-neutral-100 -z-10"></div>

              {steps.map((step, idx) => {
                const isActive = activeStep === step.id;
                return (
                  <div 
                    key={step.id}
                    onClick={() => setActiveStep(isActive ? null : step.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-neutral-50 border-neutral-900 shadow-sm ring-1 ring-neutral-900' 
                        : 'bg-white border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center border shrink-0 ${
                        isActive 
                          ? 'bg-neutral-900 text-white border-neutral-900' 
                          : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                      }`}>
                        {step.id}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-neutral-900">{step.title}</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed font-sans">{step.action}</p>
                        
                        {isActive && (
                          <div className="mt-3 pt-3 border-t border-neutral-200/60 space-y-2.5 animate-slide-up text-xs font-mono text-neutral-800">
                            <div>
                              <span className="text-neutral-400">Responsible Agent:</span>
                              <p className="text-neutral-900 font-sans mt-0.5 font-semibold text-xs flex items-center space-x-1.5">
                                <Bot className="w-3.5 h-3.5 text-indigo-500" />
                                <span>{step.agent}</span>
                              </p>
                            </div>
                            <div>
                              <span className="text-neutral-400">Diagnostic Rules & Filters:</span>
                              <p className="text-neutral-700 font-sans mt-0.5 leading-relaxed text-xs">{step.metrics}</p>
                            </div>
                            <div>
                              <span className="text-neutral-400">Pipeline Node Output:</span>
                              <p className="text-emerald-700 mt-0.5 text-xs font-bold flex items-center space-x-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{step.output}</span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Pipeline Debugger / Simulator */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-neutral-900 tracking-tight">Venture Pipeline Sandbox Simulator</h3>
                <p className="text-xs text-neutral-500 font-mono">Test how Oppy parses, evaluates and templates raw signal variables</p>
              </div>
              <Play className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 font-mono uppercase">Enter Raw Signal Input</label>
                <textarea 
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="w-full h-20 px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50"
                  placeholder="Paste raw complaints, notes, or ideas here..."
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSimulatePipeline}
                  disabled={testStep !== 'idle' && testStep !== 'complete'}
                  className="px-4 py-2 text-xs bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-200 rounded-xl font-medium transition-all flex items-center space-x-1.5 shadow-sm active:scale-95"
                >
                  <Cpu className="w-3.5 h-3.5 animate-spin" />
                  <span>{testStep === 'idle' || testStep === 'complete' ? 'Run Signal Pipeline Simulation' : 'Processing Node...'}</span>
                </button>
                {testStep !== 'idle' && testStep !== 'complete' && (
                  <span className="text-[11px] font-mono text-indigo-600 animate-pulse uppercase tracking-wider">
                    [Stage: {testStep.toUpperCase()}] Running heuristic matrices
                  </span>
                )}
              </div>

              {/* Simulation Result */}
              {testStep === 'complete' && simulatedOpp && (
                <div className="border border-neutral-200 bg-neutral-50/60 rounded-2xl p-4 space-y-4 animate-fade-in text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
                    <span className="text-neutral-500 font-bold">PIPELINE SIMULATED Venture:</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase rounded-full font-bold">Processed Sandbox</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-neutral-400">Extracted Product Name:</span>
                        <p className="text-neutral-900 font-sans font-bold text-xs">{simulatedOpp.name}</p>
                      </div>
                      <div>
                        <span className="text-neutral-400">Value Proposition:</span>
                        <p className="text-neutral-700 font-sans text-xs">{simulatedOpp.tagline}</p>
                      </div>
                      <div>
                        <span className="text-neutral-400">Target User/Buyer:</span>
                        <p className="text-neutral-700 font-sans text-xs">{simulatedOpp.target_user}</p>
                      </div>
                      <div>
                        <span className="text-neutral-400">Inefficient Workaround:</span>
                        <p className="text-neutral-700 font-sans text-xs">{simulatedOpp.workaround}</p>
                      </div>
                    </div>

                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-neutral-200/80 pt-2 md:pt-0 md:pl-4">
                      <div>
                        <span className="text-neutral-400">Calculated OppyScore v1:</span>
                        <div className="flex items-baseline space-x-1.5 mt-0.5">
                          <span className="text-lg font-bold text-neutral-900">{simulatedOpp.scores.finalScore}</span>
                          <span className="text-[10px] text-neutral-500">out of 100+</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 pt-1.5">
                        <div className="bg-neutral-100 p-1.5 rounded-lg text-center">
                          <span className="text-[9px] text-neutral-400 uppercase">Potential</span>
                          <p className="font-bold text-neutral-800 text-[11px] mt-0.5">+{simulatedOpp.scores.potential}</p>
                        </div>
                        <div className="bg-neutral-100 p-1.5 rounded-lg text-center">
                          <span className="text-[9px] text-neutral-400 uppercase">Evidence</span>
                          <p className="font-bold text-neutral-800 text-[11px] mt-0.5">+{simulatedOpp.scores.evidence}</p>
                        </div>
                        <div className="bg-rose-50 p-1.5 rounded-lg text-center border border-rose-100">
                          <span className="text-[9px] text-rose-400 uppercase">Risk</span>
                          <p className="font-bold text-rose-800 text-[11px] mt-0.5">-{simulatedOpp.scores.risk}</p>
                        </div>
                      </div>
                      <div className="pt-2 text-[10px] leading-relaxed text-indigo-700">
                        ⚡ Initial Evidence Shift: <span className="font-bold">{simulatedOpp.scores.evidenceWeightPercent}%</span>. Heuristic Potential dominates until customer interviews are completed.
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-200/80 space-y-3">
                    <span className="text-neutral-500 font-bold block">Generated Validation Assets preview:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] leading-relaxed">
                      <div className="p-2.5 bg-white rounded-lg border border-neutral-200 space-y-1">
                        <span className="text-indigo-600 font-bold flex items-center space-x-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Validation Landing Header</span>
                        </span>
                        <p className="text-neutral-800 italic font-sans">"Stop suffering through manual double-screen Excel sheets!Warehouse Invoice Line-Item Automator is built specifically for warehouse operations leads..."</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-neutral-200 space-y-1">
                        <span className="text-indigo-600 font-bold flex items-center space-x-1">
                          <Linkedin className="w-3.5 h-3.5" />
                          <span>LinkedIn Connection Template</span>
                        </span>
                        <p className="text-neutral-800 italic font-sans">"Hi [First Name], saw you lead warehouse operations. We're doing peer research on manual line-item mismatch. Open for a brief 10-min benchmarking review?"</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Agents Monitoring Console */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-neutral-900 tracking-tight">AI Agent Hub & Monitor</h2>
                <p className="text-xs text-neutral-500 font-mono">Active autonomous agent cluster status</p>
              </div>
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="space-y-4">
              {agents.map(agent => (
                <div key={agent.id} className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 font-mono text-[11px]">{agent.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      agent.status === 'PROCESSING' 
                        ? 'bg-amber-100 text-amber-800 animate-pulse' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      ● {agent.status}
                    </span>
                  </div>
                  <p className="text-neutral-500 font-sans leading-relaxed text-[11px]">{agent.role}</p>
                  
                  <div className="pt-2 border-t border-neutral-200/60 grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-400">
                    <div>
                      <span>PROCESSED NODES:</span>
                      <p className="font-semibold text-neutral-800">{agent.processedCount}</p>
                    </div>
                    <div>
                      <span>ACCURACY RATE:</span>
                      <p className="font-semibold text-emerald-600">{agent.accuracyRate}</p>
                    </div>
                  </div>

                  <div className="bg-white/80 p-2 rounded-lg border border-neutral-200 font-mono text-[10px] text-neutral-600">
                    <span className="text-[9px] text-indigo-500 font-bold block">LAST OPERATION:</span>
                    <span className="text-neutral-800 italic leading-normal">{agent.lastAction}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="w-full py-2.5 text-xs font-mono font-bold border border-neutral-900 rounded-xl hover:bg-neutral-50 active:scale-95 transition-all text-neutral-900 flex items-center justify-center space-x-1.5"
              >
                <Cpu className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin text-indigo-600' : 'text-neutral-500'}`} />
                <span>{isAuditing ? 'Running Active Agents Audit...' : 'DISPATCH ALL AGENTS TO AUDIT'}</span>
              </button>
            </div>
          </div>

          {/* AI Terminal Diagnostic Log */}
          <div className="bg-neutral-900 text-white rounded-3xl p-5 border border-neutral-800 shadow-sm space-y-4 font-mono text-[11px]">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-bold text-neutral-300">Live Agent Audit Feed</span>
              </div>
              <span className="text-[9px] text-neutral-500">Live Diagnostics</span>
            </div>

            <div className="h-44 overflow-y-auto space-y-1.5 pr-2 select-text scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
              {auditLog.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-neutral-500 mr-1.5">[{new Date().toLocaleTimeString()}]</span>
                  <span className={
                    log.startsWith('[INGEST]') ? 'text-indigo-300' :
                    log.startsWith('[SCORER]') ? 'text-amber-300' :
                    log.startsWith('[VALIDATOR]') ? 'text-teal-300' :
                    log.startsWith('[OUTREACH]') ? 'text-pink-300' :
                    log.startsWith('[COMPLETE]') ? 'text-emerald-300 font-bold' :
                    'text-neutral-300'
                  }>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
