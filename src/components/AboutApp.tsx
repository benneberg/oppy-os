import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Compass, HelpCircle, Info, Cpu, Layers, BarChart2, FlaskConical, AlertTriangle, ArrowRight, Zap, Target, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Discovery & Scouts' | 'Validation & Science';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'General',
    question: "What is Oppy OS and who is it built for?",
    answer: "Oppy OS is an automated micro-venture discovery and validation operating system designed specifically for solo developers, indie hackers, and micro-SaaS founders. Its goal is to save you from wasting weeks or months building features for products that nobody actually wants. Oppy focuses on 'evidence over opinions' to help you spot real demand first."
  },
  {
    category: 'General',
    question: "Where is my personal data and LLM API Key stored?",
    answer: "Oppy OS prioritizes absolute security and user privacy. Your user profile settings and venture portfolios are safely managed by a local SQLite database running in high-performance WAL mode on the local container. Your LLM API Keys (BYOK) are stored entirely inside your browser's local storage (LocalStorage) and are never saved on external servers; they are proxied directly with your requests."
  },
  {
    category: 'General',
    question: "Can I run this application offline?",
    answer: "Yes! Oppy OS is built as a self-contained web app. Core heuristic calculations, SQLite database operations, and manual pipeline tracking can run fully offline. Online connectivity is only required when background crawler agents run to scrape Reddit/HN/GitHub, or when querying your configured LLM API provider."
  },
  {
    category: 'Discovery & Scouts',
    question: "How do the automated background Scouts find opportunities?",
    answer: "Oppy runs background crawler cron schedulers that poll public community boards and developer hubs (including r/forhire, r/freelance, r/sideprojects, Hacker News threads, and GitHub Bounty labels). The raw listings are processed, merged to prevent duplicates via Levenshtein fuzzy string matches, heuristically checked for scams, and auto-classified using your selected LLM."
  },
  {
    category: 'Discovery & Scouts',
    question: "How does the built-in Scam & Trust Analysis operate?",
    answer: "Our rule-based heuristic scam analyzer scans incoming listings for highly correlated risk markers—such as demands for upfront payments, sketchy escrow requests, unrealistic budgets, or pushy 'Telegram-only' contact methods. Based on these signals, it assigns a 0-100% Trust score and flags suspicious items with visual risk alerts."
  },
  {
    category: 'Validation & Science',
    question: "What is the difference between OppyScore and Match Score?",
    answer: "OppyScore measures the objective intrinsic value of the opportunity itself (assessing customer urgency, target willingness-to-pay, and business margin potential). The Match Score measures the subjective compatibility of that opportunity with your active user profile (calculating 35% skill fit, 20% income alignment, 15% interests, 10% trust, 10% time availability, and 5% freshness). A great venture has a high score in both!"
  },
  {
    category: 'Validation & Science',
    question: "How do experiments decrease my Killer Mode risk rating?",
    answer: "Killer Mode risks are default threat factors (e.g., hyper-crowded channels, reliance on a single platform, complex high-touch sales). When you formulate validation hypotheses under the 'Experiments' tab and mark them as successful, our OppyScore algorithm rewards that empirical evidence by systematically scaling down those default risks, thus elevating the overall OppyScore!"
  },
  {
    category: 'Validation & Science',
    question: "How does the Voice Interview Transcriber work?",
    answer: "Inside any active opportunity's sandbox, you can record customer discovery conversations. Oppy captures live browser audio, streams it to the server, and uses our Gemini AI integration to transcribe the dialogue and automatically parse it into structured ICP evaluation metrics."
  }
];

interface AboutAppProps {
  onLaunchTour?: () => void;
}

export const AboutApp: React.FC<AboutAppProps> = ({ onLaunchTour }) => {
  const [subTab, setSubTab] = useState<'overview' | 'manual' | 'faq'>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqCategory, setFaqCategory] = useState<'All' | 'General' | 'Discovery & Scouts' | 'Validation & Science'>('All');

  const filteredFaqs = FAQ_DATA.filter(f => faqCategory === 'All' || f.category === faqCategory);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const overviewCards = [
    {
      title: "The Problem",
      desc: "Indie hackers spend 80% of their energy building software before confirming someone actually experiences the pain point or possesses a willingness-to-pay. This leads to high failure rates and wasted development cycles.",
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 border-rose-100"
    },
    {
      title: "The Solution",
      desc: "Oppy OS acts as an intelligence-first layer. It crawls public web nodes for organic customer complaints, matches them with your developer profile, and helps you run lean, empirical customer discovery experiments first.",
      icon: Target,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      title: "The Value",
      desc: "Move from speculative builder to structured scientist. Quantify problem urgencies, calculate pricing sustainability, and transition ventures into production solely when backed by rock-solid validation evidence.",
      icon: Zap,
      color: "text-violet-600 bg-violet-50 border-violet-100"
    }
  ];

  const coreConcepts = [
    {
      title: "1. Automated Scout Fleet",
      desc: "Dispatches background agents to continuously harvest organic side-gigs, bounties, and startup signals across Reddit, Hacker News, and GitHub, saving you hours of manual scrolling.",
      icon: Cpu
    },
    {
      title: "2. The OppyScore Algorithm",
      desc: "Runs heuristic statistical calculations to grade a lead's intrinsic opportunity potential. Evaluates problem pain points, competitive density, scale difficulty, and unit economics.",
      icon: BarChart2
    },
    {
      title: "3. Interactive Sandbox Lab",
      desc: "Equips you with real-time tooling including LTV/CAC calculators, audio research interview transcribers, outreach cover-letter drafts, and hypothesis track sheets.",
      icon: FlaskConical
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-5 gap-4">
        <div>
          <h1 className="font-display font-black text-3xl text-neutral-950 tracking-tight">App Information & Manual</h1>
          <p className="text-xs font-mono text-neutral-500 uppercase mt-1">Foundational Overview, Guides, and Frequently Asked Questions</p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 bg-neutral-100 rounded-xl border border-neutral-200 self-start md:self-auto">
          {(['overview', 'manual', 'faq'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all uppercase tracking-wider ${
                subTab === t
                  ? 'bg-white text-neutral-950 shadow-sm border-neutral-200 border'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {t === 'overview' && '1. Overview'}
              {t === 'manual' && '2. Detailed Manual'}
              {t === 'faq' && '3. FAQ Accordion'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: OVERVIEW */}
      {subTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Intro Hero Banner */}
          <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-850 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-lg border border-neutral-800">
            <div className="absolute right-0 top-0 p-8 opacity-10 pointer-events-none">
              <Compass className="w-56 h-56 text-white rotate-12" />
            </div>
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center space-x-2 bg-neutral-800 text-neutral-200 border border-neutral-700 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-neutral-400" />
                <span>The Founder Decision Framework</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight leading-tight">
                Stop Building Things Nobody Wants. Let Evidence Guide Your Development.
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Oppy OS solves the existential crisis of software builders: finding validated micro-needs. It serves as your personal mission command, monitoring global community listings to source organically validated side-income ventures.
              </p>
              {onLaunchTour && (
                <button
                  onClick={onLaunchTour}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-neutral-950 font-black text-xs shadow hover:bg-neutral-50 transition-all active:scale-95 cursor-pointer mt-2"
                >
                  <Compass className="w-4 h-4 text-neutral-950 animate-pulse" />
                  <span>Launch Guided Onboarding Tour</span>
                </button>
              )}
            </div>
          </div>

          {/* Three pillars list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {overviewCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div key={idx} className={`p-6 rounded-2xl border ${card.color} space-y-3`}>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-neutral-200">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-neutral-900 tracking-tight">{card.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans font-medium">{card.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Value block */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-6">
            <h3 className="font-display font-bold text-base text-neutral-950 tracking-tight flex items-center gap-2">
              <Compass className="w-4 h-4 text-neutral-700" />
              <span>How We Quantify the Venture Validation Loop</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
              {coreConcepts.map((concept, idx) => {
                const Icon = concept.icon;
                return (
                  <div key={idx} className="space-y-2 pt-4 md:pt-0 md:pl-6 first:pl-0 first:pt-0">
                    <div className="flex items-center gap-2 text-neutral-900">
                      <Icon className="w-4.5 h-4.5 text-neutral-500" />
                      <h4 className="font-sans font-bold text-xs">{concept.title}</h4>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed font-medium">{concept.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: DETAILED MANUAL */}
      {subTab === 'manual' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left manual contents index */}
            <div className="space-y-4 lg:col-span-1">
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4 sticky top-24">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 text-neutral-900">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-mono text-xs uppercase tracking-wider font-black">Manual Directory</span>
                </div>
                <nav className="space-y-1">
                  <a href="#section-1" className="block px-3 py-2 text-xs font-semibold rounded-lg text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-900 transition-all">
                    1. Onboarding & Profiler SETUP
                  </a>
                  <a href="#section-2" className="block px-3 py-2 text-xs font-semibold rounded-lg text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-900 transition-all">
                    2. Discovery & Background Scouts
                  </a>
                  <a href="#section-3" className="block px-3 py-2 text-xs font-semibold rounded-lg text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-900 transition-all">
                    3. Scoring Mechanics (Oppy vs Match)
                  </a>
                  <a href="#section-4" className="block px-3 py-2 text-xs font-semibold rounded-lg text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-900 transition-all">
                    4. Interview Analysis & Audio Capture
                  </a>
                  <a href="#section-5" className="block px-3 py-2 text-xs font-semibold rounded-lg text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-900 transition-all">
                    5. Sandbox Experiment Loops
                  </a>
                </nav>
                <div className="p-3 bg-neutral-900 text-white rounded-xl text-[11px] font-mono leading-relaxed space-y-1">
                  <span className="font-bold block text-amber-400">⚡ Developer Tip:</span>
                  <span>Update your profile interests frequently. Our NLP matching utilizes precise keyword correlations to score matches.</span>
                </div>
              </div>
            </div>

            {/* Right contents */}
            <div className="lg:col-span-2 space-y-12">
              {/* Section 1 */}
              <section id="section-1" className="space-y-4 scroll-mt-24">
                <div className="flex items-center space-x-2 text-neutral-500 font-mono text-[10px] uppercase font-bold tracking-widest">
                  <span>Chapter 01</span>
                  <span>/</span>
                  <span className="text-neutral-800">Profiling</span>
                </div>
                <h3 className="font-display font-black text-xl text-neutral-950 tracking-tight">1. Developer Profiler Configuration</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans font-medium">
                  When you first load Oppy OS, configure your <strong className="text-neutral-900">My Profile</strong> settings. The profile details your active skillset (e.g. React, APIs, Node), experience tier, weekly available time commitment, income targets, and startup budget constraints.
                </p>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 border-l-4 border-l-neutral-900 text-xs text-neutral-500 leading-relaxed font-sans font-medium">
                  <strong>Workflow Rule:</strong> Your parameters acts as a live mathematical constraint. If an opportunity demands 20 hours/week but your profile limit is set to 15, the scoring engine automatically penalizes the time-commitment parameter, lowering your overall Match Score.
                </div>
              </section>

              {/* Section 2 */}
              <section id="section-2" className="space-y-4 scroll-mt-24">
                <div className="flex items-center space-x-2 text-neutral-500 font-mono text-[10px] uppercase font-bold tracking-widest">
                  <span>Chapter 02</span>
                  <span>/</span>
                  <span className="text-neutral-800">Crawl discovery</span>
                </div>
                <h3 className="font-display font-black text-xl text-neutral-950 tracking-tight">2. Operating the Discover Scouts</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans font-medium">
                  Under the <strong className="text-neutral-900">Discover Lab</strong> and <strong className="text-neutral-900">AI Workforce</strong>, you will trigger automated crawlers. Scouts traverse public subreddits, API logs, and GitHub repository issue trackers looking for developer-related problems.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1 text-xs">
                    <span className="font-bold text-neutral-900 block font-mono text-[10px] uppercase text-purple-600">Levenshtein Deduplicator</span>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">Fuzzy string distance matching detects duplicate posts automatically, merging them into unified threads.</p>
                  </div>
                  <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1 text-xs">
                    <span className="font-bold text-neutral-900 block font-mono text-[10px] uppercase text-amber-600">Scam Detection</span>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">Searches for keywords indicative of cash-advanced schemes, Telegram-only contact, or unverified hiring agents.</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="section-3" className="space-y-4 scroll-mt-24">
                <div className="flex items-center space-x-2 text-neutral-500 font-mono text-[10px] uppercase font-bold tracking-widest">
                  <span>Chapter 03</span>
                  <span>/</span>
                  <span className="text-neutral-800">Scoring Engine</span>
                </div>
                <h3 className="font-display font-black text-xl text-neutral-950 tracking-tight">3. Understanding OppyScore & Compatibility</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans font-medium">
                  Every opportunity card shows two distinct progress circles representing the mathematical core of Oppy OS.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3 text-xs leading-relaxed">
                    <div className="bg-neutral-900 text-white font-mono font-bold w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5">O</div>
                    <div>
                      <strong className="text-neutral-900 block">OppyScore (Underlying Project Value)</strong>
                      <span className="text-neutral-500 text-[11px]">Aggregates problem urgency, target market size, unit economics (willingness-to-pay), and competitive ease. This indicates if the opportunity is inherently a healthy business candidate.</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 text-xs leading-relaxed">
                    <div className="bg-neutral-900 text-white font-mono font-bold w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5">M</div>
                    <div>
                      <strong className="text-neutral-900 block">Match Compatibility (Custom Alignment)</strong>
                      <span className="text-neutral-500 text-[11px]">Computes proximity to your active developer Profile. This score reflects how well a venture fits your exact skills, income goals, and available hours.</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="section-4" className="space-y-4 scroll-mt-24">
                <div className="flex items-center space-x-2 text-neutral-500 font-mono text-[10px] uppercase font-bold tracking-widest">
                  <span>Chapter 04</span>
                  <span>/</span>
                  <span className="text-neutral-800">Transcription</span>
                </div>
                <h3 className="font-display font-black text-xl text-neutral-950 tracking-tight">4. Transcribing & Evaluating Research Interviews</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans font-medium">
                  When you contact high-intent prospective buyers, you can capture conversations directly inside Oppy OS. Clicking the recording mic records system or browser microphone input, uploads the media segment, transcribes the voice loop, and extracts structured qualitative ratings dynamically.
                </p>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-neutral-700 block">Typical Workflow:</span>
                  <div className="flex items-center space-x-2 font-mono text-[11px] text-neutral-500">
                    <span>Initiate Interview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="text-neutral-800 font-bold">Record Voice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Run AI Evaluator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="text-emerald-600 font-bold">Update Evidence Tables</span>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="section-5" className="space-y-4 scroll-mt-24">
                <div className="flex items-center space-x-2 text-neutral-500 font-mono text-[10px] uppercase font-bold tracking-widest">
                  <span>Chapter 05</span>
                  <span>/</span>
                  <span className="text-neutral-800">Sandbox</span>
                </div>
                <h3 className="font-display font-black text-xl text-neutral-950 tracking-tight">5. De-risking via Sandboxed Hypotheses</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans font-medium">
                  We categorize structural venture threats under <strong className="text-rose-600 font-mono uppercase">Killer Mode</strong> risk metrics. Relying on a single App Store is 'Platform Lock-in Risk'. Relying on direct sales is 'Sales Complexity Risk'. 
                  Under the <strong className="text-neutral-900">Sandbox / Experiments</strong> tab, construct hypotheses to test these variables directly.
                </p>
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-start space-x-3 text-xs leading-relaxed font-sans font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-950">Empirical Risk Mitigation</span>
                    <p className="mt-0.5 text-emerald-700">Once an experiment hypothesis (e.g. 'Can generate lead flow organically via X') returns a 'SUCCESS' outcome, Oppy's backend database flags the experiment, de-risks that vector, and instantly boosts the overall opportunity evaluation metrics!</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: FAQ ACCORDION */}
      {subTab === 'faq' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* FAQ categories filters */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-neutral-200">
            {(['All', 'General', 'Discovery & Scouts', 'Validation & Science'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFaqCategory(cat);
                  setExpandedFaq(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  faqCategory === cat
                    ? 'bg-neutral-950 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion container */}
          <div className="space-y-3.5 max-w-3xl">
            {filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`bg-white rounded-xl border transition-all ${
                    isExpanded 
                      ? 'border-neutral-900 shadow-sm ring-1 ring-neutral-900/10' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-sans focus:outline-none"
                  >
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-neutral-100 text-neutral-500 uppercase tracking-tight">
                        {faq.category}
                      </span>
                      <h4 className="font-sans font-bold text-sm text-neutral-950 tracking-tight leading-normal">
                        {faq.question}
                      </h4>
                    </div>
                    <div className="shrink-0 w-6 h-6 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-600">
                      <span className="font-mono text-sm leading-none font-bold">
                        {isExpanded ? '−' : '+'}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-neutral-100"
                      >
                        <div className="px-5 py-4 text-xs text-neutral-600 leading-relaxed font-sans font-medium bg-neutral-50/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="p-8 text-center bg-neutral-50 border border-neutral-200 rounded-2xl text-neutral-500 font-mono text-xs">
                No questions found matching selected filter.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
