import React, { useState, useEffect } from 'react';
import { X, FileText, BarChart2, ShieldAlert, Clock, Send, FlaskConical, Save, RefreshCw, Copy, Check, DollarSign, MessageSquare, ArrowUpRight, Plus, Trash2, CheckCircle, AlertTriangle, Mic, Square, TrendingUp, Coins, Percent } from 'lucide-react';
import { Opportunity, Experiment, Stage } from '../types';
import { computeOppyScore } from '../services/scoringEngine';
import { transcribeAndAnalyzeInterview } from '../services/api';

interface OpportunityDrawerProps {
  opportunity: Opportunity;
  onClose: () => void;
  onSave: (updated: Opportunity) => Promise<void>;
  onGenerateArtifacts: (id: string) => Promise<Opportunity>;
  onDelete: (id: string) => Promise<void>;
}

export const OpportunityDrawer: React.FC<OpportunityDrawerProps> = ({
  opportunity: initialOpp,
  onClose,
  onSave,
  onGenerateArtifacts,
  onDelete
}) => {
  const [opp, setOpp] = useState<Opportunity>(JSON.parse(JSON.stringify(initialOpp)));
  const [activeTab, setActiveTab] = useState<'overview' | 'scores' | 'artifacts' | 'experiments' | 'json'>('overview');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic Pricing Sandbox State
  const [arpu, setArpu] = useState(150);
  const [churn, setChurn] = useState(5);
  const [cac, setCac] = useState(500);
  const [convRate, setConvRate] = useState(5);

  // Recording & Speech State
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recordingText, setRecordingText] = useState('');
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'analyzing' | 'done'>('idle');
  const [analysisResult, setAnalysisResult] = useState<{
    sentiment: 'Positive' | 'Negative';
    pain_level: number;
    wtp: number;
    summary: string;
    key_quote: string;
  } | null>(null);
  const [speechError, setSpeechError] = useState('');
  const [timerId, setTimerId] = useState<any>(null);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  useEffect(() => {
    if (opp.monetization) {
      const match = opp.monetization.match(/\$?(\d+)/);
      if (match && match[1]) {
        const val = parseInt(match[1]);
        if (val > 0 && val < 10000) {
          setArpu(val);
        }
      }
    }
  }, [opp.monetization]);

  const startRecordingSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not native in this browser iframe. Providing smart simulator input!");
      simulateRecording();
      return;
    }

    try {
      setSpeechError('');
      setRecordingStatus('recording');
      setIsRecording(true);
      setRecordingText('');
      setRecordDuration(0);
      setAnalysisResult(null);

      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setRecordingText(finalTranscript || interimTranscript || 'Listening...');
      };

      recog.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission blocked. Please check your browser permissions.');
        } else {
          setSpeechError(`Error: ${event.error}`);
        }
        stopRecordingSpeech(recog);
      };

      recog.onend = () => {
        setIsRecording(false);
      };

      recog.start();
      setRecognitionInstance(recog);

      const interval = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
      setTimerId(interval);
    } catch (e: any) {
      setSpeechError(`Failed to initialize: ${e.message}`);
      simulateRecording();
    }
  };

  const stopRecordingSpeech = (recogPassed?: any) => {
    const recog = recogPassed || recognitionInstance;
    if (recog) {
      try {
        recog.stop();
      } catch (e) {}
    }
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setIsRecording(false);
    if (recordingStatus === 'recording') {
      setRecordingStatus('done');
    }
  };

  const simulateRecording = () => {
    setRecordingStatus('recording');
    setIsRecording(true);
    setRecordDuration(0);
    setRecordingText('');
    setAnalysisResult(null);
    
    const interval = setInterval(() => {
      setRecordDuration(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setTimerId(null);
          setIsRecording(false);
          setRecordingStatus('done');
          setRecordingText('Yeah, we face this daily. Re-keying safety certs manually takes our technicians 3 hours per PLC module. We would absolutely pay $500/month to automate this because error rate is currently 4% and compliance audits fine us $12,000 when they catch typos.');
          return 4;
        }
        return prev + 1;
      });
    }, 1000);
    setTimerId(interval);
  };

  const handleAnalyzeTranscript = async () => {
    if (!recordingText) return;
    setRecordingStatus('analyzing');
    try {
      const result = await transcribeAndAnalyzeInterview(recordingText, opp.name);
      setAnalysisResult(result);
      setRecordingStatus('done');

      const currentInterviews = opp.validation.interviews || 0;
      const currentPositive = opp.validation.positive_interviews || 0;
      const currentNegative = opp.validation.negative_interviews || 0;

      const nextInterviews = currentInterviews + 1;
      const nextPositive = result.sentiment === 'Positive' ? currentPositive + 1 : currentPositive;
      const nextNegative = result.sentiment === 'Negative' ? currentNegative + 1 : currentNegative;

      const nextIqi = {
        ...opp.scores.iqi,
        pain_intensity: Math.max(opp.scores.iqi.pain_intensity, result.pain_level),
        willingness_to_pay: Math.max(opp.scores.iqi.willingness_to_pay, result.wtp)
      };

      const weighted = Math.round((
        nextIqi.pain_intensity * 2.2 +
        nextIqi.willingness_to_pay * 1.8 +
        nextIqi.validation_speed * 1.2 +
        nextIqi.reachability * 1.2 +
        nextIqi.switching_friction * 1.2 +
        nextIqi.competition * 1.0 +
        nextIqi.ttfd_score * 1.4
      ) * 10);
      nextIqi.total_iqi = weighted;

      const newExp: Experiment = {
        id: `exp_recorded_${Date.now()}`,
        hypothesis: `Extracted from Discovery Interview: ${result.summary}`,
        date: new Date().toISOString().slice(0, 10),
        experiment: `Mic transcription & extraction`,
        result: `Key Quote: "${result.key_quote}" | Sentiment: ${result.sentiment} | Extracted Pain: ${result.pain_level}/10, WTP: ${result.wtp}/10`,
        decision: result.sentiment === 'Positive' ? 'Continue' : 'Pivot',
        next_action: `Analyze feedback details and update target customer profile.`
      };

      const nextValidation = {
        ...opp.validation,
        interviews: nextInterviews,
        positive_interviews: nextPositive,
        negative_interviews: nextNegative
      };

      const nextExperiments = [newExp, ...opp.experiments];
      const scoreResult = computeOppyScore(nextIqi, nextValidation, opp.scores.killer, nextExperiments);
      nextValidation.evidence_score = scoreResult.evidence;
      nextValidation.evidence_weight_percent = scoreResult.evidenceWeightPercent;

      setOpp({
        ...opp,
        validation: nextValidation,
        experiments: nextExperiments,
        scores: {
          ...opp.scores,
          iqi: nextIqi,
          priority_score: scoreResult.finalScore,
          oppy_score_v1: scoreResult.finalScore,
          killer: {
            ...opp.scores.killer,
            risk_penalty: scoreResult.risk
          }
        }
      });
    } catch (e: any) {
      console.error(e);
      setRecordingStatus('done');
      setSpeechError(`Extraction failed: ${e.message}`);
    }
  };

  // New Experiment State
  const [newExpHyp, setNewExpHyp] = useState('');
  const [newExpAction, setNewExpAction] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(opp);
    } finally {
      setSaving(false);
    }
  };

  const handleRegenArtifacts = async () => {
    setGenerating(true);
    try {
      const res = await onGenerateArtifacts(opp.id);
      setOpp(res);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(opp, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateIqiScore = (field: keyof typeof opp.scores.iqi, val: number) => {
    const clampedVal = Math.max(1, Math.min(10, Math.round(val || 0)));
    const nextIqi = { ...opp.scores.iqi, [field]: clampedVal };
    // IQI formula weights: Pain 22%, WTP 18%, ValSpeed 12%, Reach 12%, Switch 12%, Comp 10%, TTFD 14%
    const weighted = Math.round((
      Math.max(1, Math.min(10, nextIqi.pain_intensity)) * 2.2 +
      Math.max(1, Math.min(10, nextIqi.willingness_to_pay)) * 1.8 +
      Math.max(1, Math.min(10, nextIqi.validation_speed)) * 1.2 +
      Math.max(1, Math.min(10, nextIqi.reachability)) * 1.2 +
      Math.max(1, Math.min(10, nextIqi.switching_friction)) * 1.2 +
      Math.max(1, Math.min(10, nextIqi.competition)) * 1.0 +
      Math.max(1, Math.min(10, nextIqi.ttfd_score)) * 1.4
    ) * 10);
    
    nextIqi.total_iqi = weighted;
    
    const scoreResult = computeOppyScore(nextIqi, opp.validation, opp.scores.killer, opp.experiments);

    setOpp({
      ...opp,
      validation: {
        ...opp.validation,
        evidence_score: scoreResult.evidence,
        evidence_weight_percent: scoreResult.evidenceWeightPercent
      },
      scores: {
        ...opp.scores,
        iqi: nextIqi,
        priority_score: scoreResult.finalScore,
        oppy_score_v1: scoreResult.finalScore,
        killer: {
          ...opp.scores.killer,
          risk_penalty: scoreResult.risk
        }
      }
    });
  };

  const updateValidation = (field: keyof typeof opp.validation, val: number) => {
    const clampedVal = Math.max(0, Math.round(val || 0));
    const nextVal = { ...opp.validation, [field]: clampedVal };
    
    const scoreResult = computeOppyScore(opp.scores.iqi, nextVal, opp.scores.killer, opp.experiments);
    nextVal.evidence_score = scoreResult.evidence;
    nextVal.evidence_weight_percent = scoreResult.evidenceWeightPercent;

    setOpp({
      ...opp,
      validation: nextVal,
      scores: {
        ...opp.scores,
        priority_score: scoreResult.finalScore,
        oppy_score_v1: scoreResult.finalScore,
        killer: {
          ...opp.scores.killer,
          risk_penalty: scoreResult.risk
        }
      }
    });
  };

  const handleAddExperiment = () => {
    if (!newExpHyp) return;
    const newExp: Experiment = {
      id: `exp_${Date.now()}`,
      hypothesis: newExpHyp,
      date: new Date().toISOString().slice(0, 10),
      experiment: newExpAction || 'Customer interview test',
      result: 'Pending execution',
      decision: 'Continue',
      next_action: 'Analyze interview notes'
    };
    const nextExperiments = [newExp, ...opp.experiments];
    const scoreResult = computeOppyScore(opp.scores.iqi, opp.validation, opp.scores.killer, nextExperiments);
    
    setOpp({ 
      ...opp, 
      experiments: nextExperiments,
      validation: {
        ...opp.validation,
        evidence_score: scoreResult.evidence,
        evidence_weight_percent: scoreResult.evidenceWeightPercent
      },
      scores: {
        ...opp.scores,
        priority_score: scoreResult.finalScore,
        oppy_score_v1: scoreResult.finalScore,
        killer: {
          ...opp.scores.killer,
          risk_penalty: scoreResult.risk
        }
      }
    });
    setNewExpHyp('');
    setNewExpAction('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white border-l border-neutral-200 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 text-neutral-900">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-neutral-900">
              <span className="px-2 py-0.5 rounded bg-neutral-200/60 border border-neutral-300 uppercase font-semibold text-neutral-800">
                {opp.category}
              </span>
              <span className="text-neutral-300">•</span>
              <span className="uppercase text-neutral-500">STAGE: <strong className="text-neutral-900">{opp.stage}</strong></span>
              <span className="text-neutral-300">•</span>
              <span className="text-neutral-900 font-bold bg-white px-2 py-0.5 rounded border border-neutral-200 shadow-sm">★ PRIORITY SCORE: {opp.scores.priority_score}</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 tracking-tight">{opp.name}</h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Folder'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-neutral-200 flex space-x-6 overflow-x-auto bg-white text-xs font-mono">
          {[
            { id: 'overview', label: '1. Opportunity Sheet', icon: FileText },
            { id: 'scores', label: '2. IQI & Killer Engine', icon: BarChart2 },
            { id: 'artifacts', label: '3. Validation & Outreach', icon: Send },
            { id: 'experiments', label: `4. Experiments (${opp.experiments.length})`, icon: FlaskConical },
            { id: 'json', label: '5. opportunity.json', icon: Copy }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 flex items-center space-x-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                  isActive ? 'border-neutral-900 text-neutral-900 font-bold' : 'border-transparent text-neutral-400 hover:text-neutral-700 font-medium'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-neutral-800">
          
          {/* TAB 1: OVERVIEW & EVIDENCE METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-neutral-500 tracking-tight">PROBLEM STATEMENT</label>
                  <textarea
                    rows={4}
                    value={opp.problem}
                    onChange={e => setOpp({ ...opp, problem: e.target.value })}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-sans text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-neutral-500 tracking-tight">PROPOSED SOLUTION</label>
                  <textarea
                    rows={4}
                    value={opp.solution}
                    onChange={e => setOpp({ ...opp, solution: e.target.value })}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-sans text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-neutral-500 tracking-tight">TARGET ECONOMIC BUYER</label>
                  <input
                    type="text"
                    value={opp.target_user}
                    onChange={e => setOpp({ ...opp, target_user: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-neutral-500 tracking-tight">EXISTING WORKAROUND</label>
                  <input
                    type="text"
                    value={opp.workaround}
                    onChange={e => setOpp({ ...opp, workaround: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-neutral-500 tracking-tight">MONETIZATION / PRICING</label>
                  <input
                    type="text"
                    value={opp.monetization}
                    onChange={e => setOpp({ ...opp, monetization: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-emerald-700 font-bold focus:outline-none focus:border-neutral-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <span className="text-xs font-display uppercase tracking-wider text-neutral-900 font-bold flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Real-World Customer Evidence (Overrides Heuristics)</span>
                  </span>
                  <span className="text-xs font-mono text-neutral-500">Evidence Weight: <strong className="text-neutral-900">+{opp.validation.evidence_score}</strong></span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div>
                    <label className="text-[11px] font-mono text-neutral-500">Total Interviews</label>
                    <input
                      type="number"
                      value={opp.validation.interviews}
                      onChange={e => updateValidation('interviews', parseInt(e.target.value) || 0)}
                      className="w-full mt-1 p-2 bg-white border border-neutral-200 rounded-lg text-sm font-mono text-neutral-900 font-bold shadow-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-emerald-700 font-semibold">Positive Feedback</label>
                    <input
                      type="number"
                      value={opp.validation.positive_interviews}
                      onChange={e => updateValidation('positive_interviews', parseInt(e.target.value) || 0)}
                      className="w-full mt-1 p-2 bg-white border border-emerald-300 rounded-lg text-sm font-mono text-emerald-800 font-bold shadow-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-rose-700 font-semibold">Negative Rejections</label>
                    <input
                      type="number"
                      value={opp.validation.negative_interviews}
                      onChange={e => updateValidation('negative_interviews', parseInt(e.target.value) || 0)}
                      className="w-full mt-1 p-2 bg-white border border-rose-300 rounded-lg text-sm font-mono text-rose-800 font-bold shadow-sm focus:outline-none focus:border-rose-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-neutral-900 font-semibold">Real Cash Revenue ($)</label>
                    <input
                      type="number"
                      value={opp.validation.revenue}
                      onChange={e => updateValidation('revenue', parseInt(e.target.value) || 0)}
                      className="w-full mt-1 p-2 bg-white border border-neutral-300 rounded-lg text-sm font-mono text-neutral-900 font-bold shadow-sm focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* Conditional Rendering: Side Income Specific Metadata OR SaaS Unit Economics Simulator */}
              {!['Industrial AI', 'Developer Productivity', 'Strategic Insight'].includes(opp.category) ? (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <span className="text-xs font-display uppercase tracking-wider text-neutral-900 font-bold flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-neutral-950 animate-pulse" />
                      <span>Side Income Sourcing Metadata</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">Matched via Scout Fleet</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono text-neutral-500">Min Income Estimate</label>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">€</span>
                            <input
                              type="number"
                              value={opp.incomeEstimate?.min || 0}
                              onChange={e => setOpp({
                                ...opp,
                                incomeEstimate: {
                                  min: Number(e.target.value) || 0,
                                  max: opp.incomeEstimate?.max || 0,
                                  currency: '€'
                                }
                              })}
                              className="w-full pl-7 p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-900 font-bold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-500">Max Income Estimate</label>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">€</span>
                            <input
                              type="number"
                              value={opp.incomeEstimate?.max || 0}
                              onChange={e => setOpp({
                                ...opp,
                                incomeEstimate: {
                                  min: opp.incomeEstimate?.min || 0,
                                  max: Number(e.target.value) || 0,
                                  currency: '€'
                                }
                              })}
                              className="w-full pl-7 p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-900 font-bold focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono text-neutral-500">Time Needed (hrs/wk)</label>
                          <input
                            type="number"
                            value={opp.estimatedHours || 0}
                            onChange={e => setOpp({ ...opp, estimatedHours: Number(e.target.value) || 0 })}
                            className="w-full mt-1 p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-900 font-bold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-500">Match compatibility %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={opp.matchScore || 0}
                            onChange={e => setOpp({ ...opp, matchScore: Number(e.target.value) || 0 })}
                            className="w-full mt-1 p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-900 font-bold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-neutral-500">Application/Listing Link</label>
                        <input
                          type="text"
                          value={opp.url || ''}
                          onChange={e => setOpp({ ...opp, url: e.target.value })}
                          placeholder="https://reddit.com/... or https://upwork.com/jobs/..."
                          className="w-full mt-1 p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-900 focus:outline-none"
                        />
                        {opp.url && (
                          <div className="pt-1.5">
                            <a
                              href={opp.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-mono text-neutral-950 hover:underline inline-flex items-center space-x-1 font-bold"
                            >
                              <span>Open Sourced Post</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-sm">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-neutral-400 block uppercase mb-1">Required Skills Matrix</label>
                        <div className="flex flex-wrap gap-1">
                          {(opp.skills || []).length > 0 ? (
                            opp.skills?.map(skill => (
                              <span key={skill} className="bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] font-mono px-2 py-0.5 rounded">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-neutral-400 font-sans italic">None configured</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-neutral-100">
                        <label className="text-[10px] font-mono font-bold text-neutral-400 block uppercase mb-1">Source / Portal</label>
                        <span className="text-sm font-mono font-bold text-neutral-800">{opp.source || 'Scouted (Internet)'}</span>
                      </div>

                      <div className="p-3 bg-neutral-50 rounded-lg">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">Estimated Hourly Rate</span>
                        <span className="text-base font-mono font-extrabold text-neutral-950">
                          {opp.incomeEstimate && opp.estimatedHours && opp.estimatedHours > 0
                            ? `€${Math.round((opp.incomeEstimate.min / 4) / opp.estimatedHours)} - €${Math.round((opp.incomeEstimate.max / 4) / opp.estimatedHours)}/hr`
                            : 'Varies'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <span className="text-xs font-display uppercase tracking-wider text-neutral-900 font-bold flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Dynamic Pricing Sandbox (LTV / CAC Simulator)</span>
                    </span>
                    <span className="text-xs font-mono text-neutral-500">Unit Economics Calculator</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-neutral-600">Monthly ARPU (Price)</span>
                          <span className="font-bold text-neutral-950">${arpu}/mo</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={5000}
                          step={10}
                          value={arpu}
                          onChange={e => setArpu(parseInt(e.target.value) || 10)}
                          className="w-full accent-neutral-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-neutral-600">Monthly Customer Churn</span>
                          <span className="font-bold text-neutral-950">{churn}%</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={25}
                          step={1}
                          value={churn}
                          onChange={e => setChurn(parseInt(e.target.value) || 1)}
                          className="w-full accent-neutral-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-neutral-600">Customer Acquisition Cost (CAC)</span>
                          <span className="font-bold text-neutral-950">${cac}</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={10000}
                          step={50}
                          value={cac}
                          onChange={e => setCac(parseInt(e.target.value) || 50)}
                          className="w-full accent-neutral-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-neutral-600">Pipeline Conversion Rate</span>
                          <span className="font-bold text-neutral-950">{convRate}%</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={30}
                          step={1}
                          value={convRate}
                          onChange={e => setConvRate(parseInt(e.target.value) || 1)}
                          className="w-full accent-neutral-900"
                        />
                      </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <span className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">LTV</span>
                          <span className="text-lg font-mono font-extrabold text-neutral-950">${Math.round(arpu / (churn / 100))}</span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <span className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">CAC Payback</span>
                          <span className="text-lg font-mono font-extrabold text-neutral-950">{arpu > 0 ? parseFloat((cac / arpu).toFixed(1)) : 0} mos</span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-lg col-span-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">LTV : CAC Ratio</span>
                            {(() => {
                              const ratio = cac > 0 ? parseFloat((Math.round(arpu / (churn / 100)) / cac).toFixed(1)) : 0;
                              if (ratio < 1.0) {
                                return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800">Unviable</span>;
                              } else if (ratio < 3.0) {
                                return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800">Marginal</span>;
                              } else if (ratio < 5.0) {
                                return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">Healthy</span>;
                              } else {
                                return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800">Outstanding</span>;
                              }
                            })()}
                          </div>
                          <span className="text-2xl font-mono font-extrabold text-neutral-950 mt-1 block">
                            {cac > 0 ? (Math.round(arpu / (churn / 100)) / cac).toFixed(1) : '∞'}x
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">
                        {(() => {
                          const ltv = Math.round(arpu / (churn / 100));
                          const ratio = cac > 0 ? ltv / cac : 999;
                          const leads = Math.round(100 / (convRate || 1));
                          if (ratio < 1.0) {
                            return `⚠️ LTV ($${ltv}) is lower than CAC ($${cac}). You lose money on every customer. Shift monetization model or target cheaper acquisition channels.`;
                          } else if (ratio < 3.0) {
                            return `ℹ️ LTV:CAC is marginal (${ratio.toFixed(1)}x). Standard SaaS benchmarks suggest > 3.0x to be sustainably profitable.`;
                          } else {
                            return `✅ Healthy LTV:CAC (${ratio.toFixed(1)}x). You require ~${leads} pipeline leads to close 1 paying economic buyer at ${convRate}% conversion.`;
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Interview Transcription (Voice Copilot) */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <span className="text-xs font-display uppercase tracking-wider text-neutral-900 font-bold flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-emerald-600" />
                    <span>Direct Interview Transcription & AI Extraction</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-bold">Real-time Voice Copilot</span>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={isRecording ? () => stopRecordingSpeech() : startRecordingSpeech}
                        className={`p-4 rounded-full transition-all active:scale-95 ${
                          isRecording 
                            ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' 
                            : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                        }`}
                        title={isRecording ? "Stop Recording" : "Record via Microphone"}
                      >
                        {isRecording ? <Square className="w-5 h-5 fill-white text-white" /> : <Mic className="w-5 h-5" />}
                      </button>
                      <div>
                        <h5 className="text-xs font-display font-bold text-neutral-900">
                          {isRecording ? 'Listening and Transcribing...' : 'Record Founder Call'}
                        </h5>
                        <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                          {isRecording ? `Recording: ${recordDuration}s` : 'Use Web Speech API with automatic local simulation fallback'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {recordingStatus === 'done' && recordingText && (
                        <button
                          type="button"
                          onClick={handleAnalyzeTranscript}
                          disabled={recordingStatus === 'analyzing'}
                          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
                        >
                          {recordingStatus === 'analyzing' ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Extracting Metrics...</span>
                            </>
                          ) : (
                            <>
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>Analyze & Extract Metrics</span>
                            </>
                          )}
                        </button>
                      )}
                      {recordingText && (
                        <button
                          type="button"
                          onClick={() => {
                            setRecordingText('');
                            setRecordingStatus('idle');
                            setAnalysisResult(null);
                          }}
                          className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-mono text-xs transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {speechError && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-mono text-amber-800 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{speechError}</span>
                    </div>
                  )}

                  {recordingText && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-neutral-500 block uppercase">LIVE TRANSCRIPT PREVIEW</label>
                      <textarea
                        rows={3}
                        value={recordingText}
                        onChange={e => {
                          setRecordingText(e.target.value);
                          if (recordingStatus === 'idle') setRecordingStatus('done');
                        }}
                        placeholder="Live transcript text will populate here. You can also paste transcript notes manually..."
                        className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-xs font-mono text-neutral-800 shadow-sm focus:outline-none focus:border-neutral-900 focus:bg-white"
                      />
                    </div>
                  )}

                  {analysisResult && (
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-3 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                        <span className="text-[11px] font-mono font-bold text-indigo-900 flex items-center space-x-1">
                          <span>🎯 COGNITIVE CO-PILOT ANALYSIS</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          analysisResult.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          Sentiment: {analysisResult.sentiment}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs font-mono text-neutral-800">
                        <div>
                          <span className="text-neutral-500 block">Extracted Pain Intensity</span>
                          <span className="text-sm font-bold text-neutral-900">{analysisResult.pain_level}/10</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Willingness to Pay (WTP)</span>
                          <span className="text-sm font-bold text-neutral-900">{analysisResult.wtp}/10</span>
                        </div>
                      </div>

                      <div className="text-xs space-y-1 leading-relaxed text-neutral-700">
                        <div>
                          <strong className="text-indigo-900 block font-display">Conversation Summary:</strong>
                          <p className="font-sans text-neutral-600 mt-0.5">{analysisResult.summary}</p>
                        </div>
                        <div className="pt-1.5">
                          <strong className="text-indigo-900 block font-display">Key Customer Quote:</strong>
                          <p className="font-sans italic text-neutral-600 bg-white border border-indigo-50 rounded p-2 mt-1">"{analysisResult.key_quote}"</p>
                        </div>
                      </div>

                      <p className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                        ✨ System Auto-Applied: Incrementing interviews, updating IQI pain & WTP scores, and appending experiment logs!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IQI & KILLER ENGINE BREAKDOWN */}
          {activeTab === 'scores' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Central Formula Banner */}
              <div className="bg-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                  REFAC-ENGINE: OPPYSCORE v1 FORMULA DETAILED
                </span>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2">
                  <h4 className="text-lg font-display font-bold">OppyScore = Potential (IQI) + Evidence - Risk (Killer Mode)</h4>
                  <span className="text-xs text-neutral-400 font-mono">Current: ★ {opp.scores.priority_score}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans pt-1">
                  Heuristic assumptions are systematically deprioritized as real-world evidence increases. Current Evidence Shift: <strong className="text-emerald-400">{opp.validation.evidence_weight_percent ?? 0}%</strong>. This dampens the base IQI weight up to 70% to guarantee real validation governs portfolio rank.
                </p>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-neutral-900">1. IQI Engine Calibration</h3>
                    <p className="text-xs font-sans text-neutral-500 mt-0.5">Pain (22%), WTP (18%), TTFD (14%), Reach (12%), ValSpeed (12%), Switch (12%), Comp (10%)</p>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-neutral-900 bg-white px-3 py-1 rounded-xl border border-neutral-200 shadow-sm">
                    {opp.scores.iqi.total_iqi}/100
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { key: 'pain_intensity', label: 'Pain Intensity (22% weight)', val: opp.scores.iqi.pain_intensity },
                    { key: 'willingness_to_pay', label: 'Willingness to Pay (18% weight)', val: opp.scores.iqi.willingness_to_pay },
                    { key: 'ttfd_score', label: 'Time To First Dollar Score (14%)', val: opp.scores.iqi.ttfd_score },
                    { key: 'validation_speed', label: 'Validation Speed (12%)', val: opp.scores.iqi.validation_speed },
                    { key: 'reachability', label: 'Buyer Reachability (12%)', val: opp.scores.iqi.reachability },
                    { key: 'switching_friction', label: 'Low Switching Friction (12%)', val: opp.scores.iqi.switching_friction },
                    { key: 'competition', label: 'Lack of Dominant Comp (10%)', val: opp.scores.iqi.competition }
                  ].map(item => (
                    <div key={item.key} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-700 font-sans font-medium">{item.label}</span>
                        <span className="font-bold text-neutral-900">{item.val}/10</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={item.val}
                        onChange={e => updateIqiScore(item.key as any, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Killer Mode Section */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                  <span className="text-xs font-display uppercase tracking-wider text-rose-900 font-bold flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>2. Killer Mode Trap Detection (Execution Risk)</span>
                  </span>
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-white text-rose-700 border border-rose-200 shadow-sm">
                    Overall Risk: {opp.scores.killer.overall_risk}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                  {Object.entries(opp.scores.killer).filter(([k]) => k.includes('_risk')).map(([key, val]) => (
                    <div key={key} className="bg-white p-3.5 rounded-xl border border-rose-100 flex flex-col justify-between shadow-sm">
                      <span className="text-neutral-500 uppercase text-[10px] font-bold">{key.replace('_risk', '')}</span>
                      <span className={`mt-1 font-bold text-sm ${val === 'High Risk' ? 'text-rose-700' : val === 'Medium Risk' ? 'text-amber-600' : 'text-emerald-700'}`}>
                        {val as string}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VALIDATION ARTIFACTS & OUTREACH */}
          {activeTab === 'artifacts' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-500">Generated artifacts inside <code className="bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200">/templates/</code></span>
                <button
                  onClick={handleRegenArtifacts}
                  disabled={generating}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-mono text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
                  <span>{generating ? 'Regenerating AI Artifacts...' : 'Regenerate Outreach AI'}</span>
                </button>
              </div>

              {/* Landing Page Preview */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-display font-bold text-neutral-900 uppercase tracking-wider">landing_page.md</h4>
                <pre className="p-4 bg-white rounded-xl text-xs font-mono text-neutral-800 whitespace-pre-wrap overflow-x-auto border border-neutral-200 shadow-sm leading-relaxed">
                  {opp.artifacts.landing_page_md || '# Landing Page Template\nClick regenerate to build canonical landing copy.'}
                </pre>
              </div>

              {/* 8 Interview Questions */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-display font-bold text-neutral-900 uppercase tracking-wider">interview.md (Canonical 8 Questions)</h4>
                <pre className="p-4 bg-white rounded-xl text-xs font-mono text-neutral-800 whitespace-pre-wrap overflow-x-auto border border-neutral-200 shadow-sm leading-relaxed">
                  {opp.artifacts.interview_guide_md || '1. How do you solve this today?\n2. What frustrates you most?\n3. What does this cost?\n4. What happens if nothing changes?'}
                </pre>
              </div>

              {/* LinkedIn & Outreach */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-display font-bold text-neutral-900 uppercase tracking-wider">outreach.md (LinkedIn & Cold Email)</h4>
                <div className="space-y-3">
                  {opp.artifacts.linkedin_outreach?.map((msg, i) => (
                    <div key={i} className="p-3.5 bg-white rounded-xl text-xs font-sans text-neutral-800 border border-neutral-200 flex justify-between items-center gap-4 shadow-sm">
                      <span className="leading-relaxed">{msg}</span>
                      <button onClick={() => navigator.clipboard.writeText(msg)} className="text-neutral-400 hover:text-neutral-900 shrink-0 p-1">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {opp.artifacts.cold_email && (
                    <pre className="p-4 bg-white rounded-xl text-xs font-mono text-neutral-800 whitespace-pre-wrap border border-neutral-200 shadow-sm leading-relaxed">
                      {opp.artifacts.cold_email}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIMENT TRACKING */}
          {activeTab === 'experiments' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Add New Experiment Form */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-display text-neutral-900 uppercase font-bold flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-neutral-900" />
                  <span>Log New Validation Experiment (experiments.md)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Hypothesis (e.g., Engineers hate manual PLC parsing)"
                    value={newExpHyp}
                    onChange={e => setNewExpHyp(e.target.value)}
                    className="p-3 bg-white border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Experiment (e.g., Interview 5 maintenance leads)"
                    value={newExpAction}
                    onChange={e => setNewExpAction(e.target.value)}
                    className="p-3 bg-white border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 shadow-sm"
                  />
                </div>
                <button
                  onClick={handleAddExperiment}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold font-sans text-xs transition-all shadow-sm active:scale-95"
                >
                  Record Experiment Log
                </button>
              </div>

              {/* Experiment Logs List */}
              <div className="space-y-4">
                {opp.experiments.length > 0 ? (
                  opp.experiments.map(exp => (
                    <div key={exp.id} className="bg-white border border-neutral-200 rounded-xl p-4 text-xs font-mono space-y-2 shadow-sm">
                      <div className="flex justify-between text-neutral-500 text-[10px]">
                        <span>DATE: {exp.date}</span>
                        <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold border border-neutral-200">
                          {exp.decision}
                        </span>
                      </div>
                      <p className="text-neutral-900 font-sans"><strong className="text-neutral-400 font-mono">Hypothesis:</strong> {exp.hypothesis}</p>
                      <p className="text-neutral-700 font-sans"><strong className="text-neutral-400 font-mono">Experiment:</strong> {exp.experiment}</p>
                      <p className="text-emerald-700 font-sans"><strong className="text-neutral-400 font-mono">Result:</strong> {exp.result}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-neutral-300">
                    <p className="text-xs text-neutral-400 font-mono">No experiments logged yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CANONICAL JSON */}
          {activeTab === 'json' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-neutral-500">Canonical <code>opportunity.json</code> representation</span>
                <button onClick={handleCopyJson} className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-mono text-neutral-800 border border-neutral-200 transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl text-xs font-mono text-neutral-100 overflow-x-auto max-h-[60vh] shadow-inner leading-normal">
                {JSON.stringify(opp, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-neutral-200 bg-white flex items-center justify-between">
          <button
            onClick={async () => {
              if (window.confirm(`Are you sure you want to delete ${opp.name}?`)) {
                await onDelete(opp.id);
                onClose();
              }
            }}
            className="text-xs font-mono text-rose-600 hover:text-rose-800 inline-flex items-center space-x-1 p-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Opportunity</span>
          </button>

          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-mono text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs font-sans transition-all active:scale-95 shadow-md disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
