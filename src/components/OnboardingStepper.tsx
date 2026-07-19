import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Cpu, BarChart2, FlaskConical, ChevronRight, ChevronLeft, X, CheckCircle, HelpCircle } from 'lucide-react';

interface OnboardingStepperProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: "Welcome to Oppy OS",
    subtitle: "Navigate the Micro-SaaS Niche Wilderness",
    explanation: "Welcome to Oppy OS, the premier evidence-driven operating system designed to help solo founders and indie hackers discover, evaluate, and validate profitable micro-ventures and software opportunities.",
    icon: Compass,
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-indigo-50 text-indigo-600",
    bullets: [
      {
        title: "Evidence Over Opinions",
        desc: "Filter out speculative hype with continuous real-world customer validation sandboxes."
      },
      {
        title: "Founder Centered",
        desc: "Automated analysis aligns opportunities directly with your expert skills, time, and budget."
      },
      {
        title: "Scout-Driven Discovery",
        desc: "Forget manual scraping. Background AI agents do the heavy lifting of hunting opportunities."
      }
    ],
    nextLabel: "Next: Meet your AI Scout Fleet"
  },
  {
    title: "The AI Scout Fleet",
    subtitle: "Automated Micro-Opportunity Harvesting",
    explanation: "Oppy deploys automated background crawler scouts that actively traverse the web to find fresh, high-signal business problems and software-centric developer opportunities.",
    icon: Cpu,
    color: "from-purple-500 to-pink-600",
    bgLight: "bg-purple-50 text-purple-600",
    bullets: [
      {
        title: "Ecosystem scrapers",
        desc: "Active scrapers fetch real-time gig listings from Subreddits, Hacker News, and Github Bounties."
      },
      {
        title: "Scam & Duplicate Filter",
        desc: "Smart heuristics analyze and penalize upfront-fee scams, Telegram-only schemes, and duplicates."
      },
      {
        title: "Automatic Taxonomy",
        desc: "Discovered leads are automatically classified into clean, developer-focused categories."
      }
    ],
    nextLabel: "Next: Learn the Scoring Science"
  },
  {
    title: "Scientific Fit & Scoring",
    subtitle: "Quantifying Market-Founder Alignment",
    explanation: "Say goodbye to random guesswork. Oppy evaluates and ranks every opportunity through dual scoring frameworks tailored for developer founders.",
    icon: BarChart2,
    color: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 text-amber-600",
    bullets: [
      {
        title: "OppyScore Algorithm",
        desc: "Measures underlying project quality (Urgency, ICP Willingness-to-pay, Margin potential)."
      },
      {
        title: "Dynamic Match Score",
        desc: "A custom weighted score showing how precisely a project matches your specific profile parameters."
      },
      {
        title: "Killer Mode Analysis",
        desc: "Automatically flags existential risks like channel reliance, hyper-crowded spaces, or high-touch sales."
      }
    ],
    nextLabel: "Next: Validate with Sandboxes"
  },
  {
    title: "Sandbox & Lean Validation",
    subtitle: "Evidence-Based Verification Lab",
    explanation: "Before writing a single line of production code, compile empirical proof that people actually want and will pay for what you're building.",
    icon: FlaskConical,
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 text-emerald-600",
    bullets: [
      {
        title: "Interview Transcriber",
        desc: "Capture developer/customer interviews. Convert audio logs into structured metrics and pain points."
      },
      {
        title: "Pricing Sandbox Simulator",
        desc: "Simulate unit economics (LTV, CAC, Monthly Goals) alongside monetization models."
      },
      {
        title: "Hypothesis Testing",
        desc: "Write structured validation experiments. Success and feedback automatically decrease 'Killer Mode' risk levels."
      }
    ],
    nextLabel: "Enter Cockpit & Get Started"
  }
];

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const stepInfo = STEPS[currentStep];
  const Icon = stepInfo.icon;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        id="onboarding-stepper-container"
        className="w-full max-w-2xl bg-white rounded-2xl border border-neutral-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-neutral-500" />
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 font-bold">
              Founder Onboarding Guide • Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          <button 
            onClick={handleSkip}
            className="text-xs font-mono text-neutral-400 hover:text-neutral-700 font-semibold flex items-center space-x-1"
          >
            <span>Skip Tour</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Step Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${stepInfo.bgLight} shadow-sm`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-display font-black text-2xl text-neutral-900 tracking-tight leading-tight">
                    {stepInfo.title}
                  </h2>
                  <p className="text-sm font-mono font-bold text-neutral-500 uppercase tracking-tight">
                    {stepInfo.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-neutral-700 text-sm leading-relaxed font-medium font-sans">
                {stepInfo.explanation}
              </p>

              {/* Bullet Points */}
              <div className="space-y-3.5 bg-neutral-50 rounded-xl p-4 border border-neutral-200/60">
                {stepInfo.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs">
                    <span className="text-neutral-900 font-mono mt-0.5 shrink-0 text-sm">◆</span>
                    <div className="space-y-0.5">
                      <span className="font-bold text-neutral-900 block">{b.title}</span>
                      <span className="text-neutral-500 leading-relaxed block">{b.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          {/* Progress Indicators */}
          <div className="flex items-center space-x-1.5">
            {STEPS.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  currentStep === idx 
                    ? 'w-6 bg-neutral-900' 
                    : 'w-2 bg-neutral-200 hover:bg-neutral-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 border border-neutral-200 rounded-lg flex items-center space-x-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 text-xs font-black text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center space-x-2 shadow-sm transition-all active:scale-95"
            >
              <span>{stepInfo.nextLabel}</span>
              {currentStep < STEPS.length - 1 ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
