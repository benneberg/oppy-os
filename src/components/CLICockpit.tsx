import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, Send } from 'lucide-react';
import { Opportunity, Stage, Experiment } from '../types';

interface CLICockpitProps {
  portfolio: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onSaveOpportunity: (opp: Opportunity) => Promise<void>;
}

interface LogLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  text: string;
}

export const CLICockpit: React.FC<CLICockpitProps> = ({
  portfolio,
  onSelectOpportunity,
  onSaveOpportunity
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<LogLine[]>([
    { id: '1', type: 'system', text: 'Oppy Founder Decision OS CLI v1.0. Unified data socket online.' },
    { id: '2', type: 'system', text: 'Type "help" to list available Oppy OS operational commands.' }
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const newLog: LogLine = { id: `in_${Date.now()}`, type: 'input', text: `founder@oppy:~$ ${trimmed}` };
    const nextHistory = [...history, newLog];

    // Simple parser that supports quotes for hypotheses
    const matches = trimmed.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g) || [];
    const parts = matches.map(m => m.replace(/^['"]|['"]$/g, ''));
    
    const cmd = parts[0]?.toLowerCase();
    const arg1 = parts[1];
    const arg2 = parts[2];
    const arg3 = parts[3];

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    let outText = '';
    let isError = false;

    if (cmd === 'help') {
      outText = `Oppy Founder Cockpit CLI Guide:
  oppy list                           List all tracked opportunities with ID, Stage and current OppyScore
  oppy inspect <id>                   Retrieve and review details of an opportunity
  oppy score <id>                     Display the refactored OppyScore v1 formula & empirical shift
  oppy promote <id> <stage>           Promote or move an opportunity to a lifecycle stage:
                                      (sandbox, active, validated, production, archived)
  oppy experiment <id> "<hypothesis>" Instantiate a new customer validation experiment
  oppy report <id>                    Review generated customer discovery reports & assets
  oppy discover "<signal>"            Capture raw signal and instantiate Sandbox candidate
  clear                               Clear terminal screen`;
    } else if (cmd === 'oppy') {
      const sub = arg1?.toLowerCase();
      
      if (sub === 'list') {
        outText = `[OPPY PORTFOLIO COCKPIT DIRECTORY]\n` +
          portfolio.map(p => {
            const score = p.scores.oppy_score_v1 ?? p.scores.priority_score;
            return `• ID: ${p.id.padEnd(16)} | STAGE: ${p.stage.toUpperCase().padEnd(10)} | SCORE: ${String(score).padEnd(3)} | NAME: ${p.name}`;
          }).join('\n');
          
      } else if (sub === 'inspect') {
        if (!arg2) {
          outText = `Error: Please specify opportunity ID. Usage: oppy inspect <id>`;
          isError = true;
        } else {
          const found = portfolio.find(p => p.id === arg2);
          if (found) {
            outText = `[INSPECTING OPPORTUNITY DETAILS: ${found.id}]
Name:        ${found.name}
Tagline:     ${found.tagline}
Stage:       ${found.stage.toUpperCase()}
Status:      ${found.status.toUpperCase()}
Category:    ${found.category}
Target User: ${found.target_user}
Problem:     ${found.problem}
Solution:    ${found.solution}
Workaround:  ${found.workaround}
Monetization: ${found.monetization}
MVP Setup:   ${found.mvp}`;
            onSelectOpportunity(found);
          } else {
            outText = `Error: Opportunity ID "${arg2}" not found in portfolio registry.`;
            isError = true;
          }
        }
        
      } else if (sub === 'score') {
        if (!arg2) {
          outText = `Error: Please specify opportunity ID. Usage: oppy score <id>`;
          isError = true;
        } else {
          const found = portfolio.find(p => p.id === arg2);
          if (found) {
            const score = found.scores.oppy_score_v1 ?? found.scores.priority_score;
            const iqi = found.scores.iqi;
            const killer = found.scores.killer;
            const val = found.validation;
            const evidenceWeight = val.evidence_weight_percent ?? 0;
            
            // Calculate components as per Central Scoring Engine
            const shiftFactor = evidenceWeight / 100;
            const potentialPart = Math.round(iqi.total_iqi * (1.0 - shiftFactor * 0.7));
            const evidencePart = val.evidence_score || 0;
            const riskPart = killer.risk_penalty || 0;

            outText = `[OPPY_SCORE_V1 DYNAMIC EVALUATION: ${found.name}]
Formula: OppyScore = Potential (derived from IQI) + Evidence - Risk (derived from Killer Mode)

=========================================
1. POTENTIAL (Derived from Heuristic IQI)
   • Base Heuristic IQI Score:  ${iqi.total_iqi}/100
   • Empirical Shift Attenuation: -${Math.round(shiftFactor * 70)}%
   • FINAL POTENTIAL VALUE:      ${potentialPart} pts (Market Structure)

2. EVIDENCE (Empirical Validation)
   • Customer Interviews Logged: ${val.interviews} (Positive: ${val.positive_interviews}, Negative: ${val.negative_interviews})
   • Landing Visits:             ${val.landing_visits} | Pre-orders: ${val.preorders}
   • Validated Revenue (WTP):    $${val.revenue}
   • FINAL EVIDENCE SCORE:       +${evidencePart} pts (Empirical Verification)

3. RISK (Killer Mode Penalty)
   • Base Risks Flagged:         Access: ${killer.access_risk}, Budget: ${killer.budget_risk}, Demand: ${killer.demand_risk}
   • Mitigated by Evidence Ratio: ${interviewsCountRatio(val)}
   • FINAL RISK DEDUCTION:       -${riskPart} pts (Execution Traps)

=========================================
FINAL UNIFIED OPPY_SCORE:       ★ ${score}
Validation Shift Percentage:   ${evidenceWeight}% (Evidence over Hypotheses)
Recommended Action Goal:       ${found.decision.recommended_action}`;
          } else {
            outText = `Error: Opportunity ID "${arg2}" not found.`;
            isError = true;
          }
        }
        
      } else if (sub === 'promote') {
        if (!arg2 || !arg3) {
          outText = `Error: Missing ID or Target Stage. Usage: oppy promote <id> <sandbox|active|validated|production|archived>`;
          isError = true;
        } else {
          const found = portfolio.find(p => p.id === arg2);
          const stageInput = arg3.toLowerCase() as Stage;
          const allowedStages: Stage[] = ['sandbox', 'active', 'validated', 'production', 'archived'];
          
          if (!found) {
            outText = `Error: Opportunity ID "${arg2}" not found.`;
            isError = true;
          } else if (!allowedStages.includes(stageInput)) {
            outText = `Error: Invalid stage "${arg3}". Choose: sandbox, active, validated, production, archived.`;
            isError = true;
          } else {
            const updated = { ...found, stage: stageInput, updated: new Date().toISOString() };
            await onSaveOpportunity(updated);
            outText = `[STAGE TRANSITION SUCCESSFUL]
Opportunity ID: ${found.id} ("${found.name}")
Previous Stage: ${found.stage.toUpperCase()}
Promoted Stage: ${stageInput.toUpperCase()}
State written to disk successfully.`;
          }
        }
        
      } else if (sub === 'experiment') {
        if (!arg2 || !arg3) {
          outText = `Error: Missing ID or hypothesis script. Usage: oppy experiment <id> "Hypothesis goes here..."`;
          isError = true;
        } else {
          const found = portfolio.find(p => p.id === arg2);
          if (!found) {
            outText = `Error: Opportunity ID "${arg2}" not found.`;
            isError = true;
          } else {
            const newExp: Experiment = {
              id: `exp_${Date.now()}`,
              hypothesis: arg3,
              date: new Date().toISOString().split('T')[0],
              experiment: `CLI validation dispatch targeting ${found.target_user}.`,
              result: 'Awaiting customer interviews data log.',
              decision: 'Continue',
              next_action: 'Perform cold outreach to get feedback.'
            };
            const updated = {
              ...found,
              experiments: [...(found.experiments || []), newExp],
              updated: new Date().toISOString()
            };
            await onSaveOpportunity(updated);
            outText = `[VALIDATION EXPERIMENT INITIATED]
Opportunity:    "${found.name}"
Hypothesis:     "${arg3}"
Assigned ID:    ${newExp.id}
Status:         Active & Awaiting Discovery Feedback`;
          }
        }
        
      } else if (sub === 'report') {
        if (!arg2) {
          outText = `Error: Please specify opportunity ID. Usage: oppy report <id>`;
          isError = true;
        } else {
          const found = portfolio.find(p => p.id === arg2);
          if (found) {
            const artifacts = found.artifacts || {};
            outText = `[AUTOMATED VALIDATION REPORT SUMMARY: ${found.name}]
========================================================================
1. INTERVIEW GUIDE PROTOCOL & 8 DIAGNOSTIC QUESTIONS:
${artifacts.interview_guide_md || 'No validation assets generated yet. Run generation drawer.'}

========================================================================
2. CONVERSION LANDING COPY STRUCTURE:
${artifacts.landing_page_md || 'No landing page markdown template exists.'}

========================================================================
3. TAILORED LinkedIn Cold Outreach scripts:
${artifacts.linkedin_outreach?.map((l, i) => `Option ${i+1}: ${l}`).join('\n\n') || 'No LinkedIn scripts available.'}`;
          } else {
            outText = `Error: Opportunity ID "${arg2}" not found.`;
            isError = true;
          }
        }
        
      } else if (sub === 'discover') {
        if (!arg2) {
          outText = `Error: Please specify a signal statement. Usage: oppy discover "warehouse inventory double matches are slow"`;
          isError = true;
        } else {
          outText = `[SANDBOX OPPORTUNITY INITIATED]
Signal:      "${arg2}"
Status:      Registered sandbox folder successfully.
Next Step:   Navigate to the "Discover Lab" tab to run full AI parsing and generate metrics.`;
        }
      } else {
        outText = `Oppy OS sub-command "${sub}" not recognized. Type "help" to see commands.`;
        isError = true;
      }
    } else {
      outText = `Command "${cmd}" not recognized. Type "help" to view Oppy OS commands.`;
      isError = true;
    }

    setHistory([...nextHistory, { 
      id: `out_${Date.now()}`, 
      type: isError ? 'error' : 'output', 
      text: outText 
    }]);
    setInput('');
  };

  const interviewsCountRatio = (val: any) => {
    if (val.interviews === 0) return 'None (High Risk defaults)';
    const ratio = Math.round(((val.positive_interviews || 0) / val.interviews) * 100);
    return `${ratio}% Positive signals (Mitigates subjective traps)`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[650px] font-mono text-xs animate-in fade-in duration-500 text-white" id="cli-cockpit">
      {/* Terminal Titlebar */}
      <div className="bg-neutral-800/90 px-4 py-3 border-b border-neutral-700/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-neutral-300 pl-2 font-semibold">oppy-terminal-os — console</span>
        </div>
        <div className="flex items-center space-x-1.5 text-indigo-400 text-[10px] font-bold">
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>COCKPIT PIPE DIRECT</span>
        </div>
      </div>

      {/* Terminal Output Log */}
      <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-neutral-950 font-mono text-[11px] select-text">
        {history.map(item => (
          <div
            key={item.id}
            className={`${
              item.type === 'input' ? 'text-indigo-400 font-bold pt-2' :
              item.type === 'error' ? 'text-rose-400 font-bold pl-2 border-l border-rose-900' :
              item.type === 'system' ? 'text-neutral-500 font-semibold italic' :
              'text-neutral-200 whitespace-pre-wrap pl-3.5 border-l border-neutral-800 leading-relaxed'
            }`}
          >
            {item.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Terminal Input Prompt */}
      <form onSubmit={handleCommand} className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center space-x-2">
        <span className="text-neutral-400 font-bold pl-2">founder@oppy:~$</span>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type 'help' to begin, or try 'oppy list'..."
          autoFocus
          className="flex-1 bg-transparent text-white placeholder-neutral-600 focus:outline-none font-mono"
        />
        <button type="submit" className="p-1.5 rounded bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
