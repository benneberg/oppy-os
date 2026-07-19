/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Opportunity, Stage, Category, MorningDashboardAnswers, UserProfile } from './types';
import { fetchPortfolio, saveOpportunity, deleteOpportunity, generateArtifacts, resetPortfolio, discoverOpportunity, generateMorningBrief, saveUserProfile } from './services/api';
import { Header } from './components/Header';
import { MorningCockpit } from './components/MorningCockpit';
import { PipelineBoard } from './components/PipelineBoard';
import { OpportunityDrawer } from './components/OpportunityDrawer';
import { DiscoverLab } from './components/DiscoverLab';
import { PortfolioAnalyticsView } from './components/PortfolioAnalyticsView';
import { CLICockpit } from './components/CLICockpit';
import { SystemArchitectureView } from './components/SystemArchitectureView';
import { LLMSettingsModal } from './components/LLMSettingsModal';
import { OnboardingProfile } from './components/OnboardingProfile';
import { AIWorkforce } from './components/AIWorkforce';
import { Compass, RefreshCw } from 'lucide-react';

export default function App() {
  const [portfolio, setPortfolio] = useState<Opportunity[]>([]);
  const [morning, setMorning] = useState<MorningDashboardAnswers | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    skills: ['Automation', 'AI', 'Programming'],
    experienceLevel: 'Expert',
    preferredWork: ['Remote'],
    timeAvailable: 15,
    incomeGoal: 2500,
    startupBudget: 100,
    riskTolerance: 'Low',
    interests: 'Automating local services and businesses, custom voice assistants, technical writing, API integrations',
    excludedCategories: ['MLM', 'Crypto', 'Gambling']
  });
  const [activeTab, setActiveTab] = useState<string>('morning');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPortfolio();
      setPortfolio(data.portfolio);
      setMorning(data.morning);
      if (data.userProfile) {
        setProfile(data.userProfile);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Oppy OS state');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    try {
      await saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
      // Refresh portfolio to update match scores dynamically
      const data = await fetchPortfolio();
      setPortfolio(data.portfolio);
    } catch (err: any) {
      alert(err.message || 'Failed to save profile');
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleReset = async () => {
    if (window.confirm('Reset Oppy OS seed data back to canonical factory state?')) {
      await resetPortfolio();
      await loadAllData();
      setSelectedOpp(null);
    }
  };

  const handleSaveOpp = async (updated: Opportunity) => {
    try {
      const saved = await saveOpportunity(updated);
      setPortfolio(prev => prev.map(p => p.id === saved.id ? saved : p));
      setSelectedOpp(saved);
      // Refresh morning metrics in background
      fetchPortfolio().then(d => setMorning(d.morning));
    } catch (err: any) {
      alert(err.message || 'Failed to save folder changes');
    }
  };

  const handleDeleteOpp = async (id: string) => {
    try {
      await deleteOpportunity(id);
      setPortfolio(prev => prev.filter(p => p.id !== id));
      setSelectedOpp(null);
      fetchPortfolio().then(d => setMorning(d.morning));
    } catch (err: any) {
      alert(err.message || 'Failed to delete folder');
    }
  };

  const handleGenerateArtifacts = async (id: string): Promise<Opportunity> => {
    const updated = await generateArtifacts(id);
    setPortfolio(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (selectedOpp && selectedOpp.id === updated.id) {
      setSelectedOpp(updated);
    }
    return updated;
  };

  const handlePromoteStage = async (opp: Opportunity, nextStage: Stage) => {
    const updated = { ...opp, stage: nextStage, updated: new Date().toISOString() };
    await handleSaveOpp(updated);
  };

  const handleDiscover = async (rawSignal: string, category: Category): Promise<Opportunity> => {
    const newOpp = await discoverOpportunity(rawSignal, category);
    setPortfolio(prev => [newOpp, ...prev]);
    fetchPortfolio().then(d => setMorning(d.morning));
    return newOpp;
  };

  const handleRefreshBrief = async () => {
    try {
      const d = await generateMorningBrief();
      setMorning(prev => prev ? { ...prev, daily_ai_briefing: d.brief } : null);
      // Also fetch latest portfolio state in case numbers changed
      const updatedData = await fetchPortfolio();
      setPortfolio(updatedData.portfolio);
    } catch (err: any) {
      alert(err.message || 'Failed to refresh morning brief');
    }
  };

  if (loading && portfolio.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center space-y-4 font-mono">
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-md shadow-neutral-900/10 animate-bounce">
          <Compass className="w-8 h-8 text-white animate-spin" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-display font-bold text-neutral-900 tracking-tight">Booting Oppy Venture OS...</h2>
          <p className="text-xs text-neutral-500 font-sans">Loading IQI engine & killer mode risk tables</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portfolio={portfolio}
        onReset={handleReset}
        onOpenDiscover={() => setActiveTab('discover')}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs font-mono text-rose-800">
            <span>⚠️ {error}</span>
            <button onClick={loadAllData} className="px-3 py-1 rounded bg-rose-600 text-white font-bold hover:bg-rose-700 inline-flex items-center space-x-1">
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {activeTab === 'morning' && morning && (
          <MorningCockpit
            morning={morning}
            onSelectOpportunity={setSelectedOpp}
            onRefreshBrief={handleRefreshBrief}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'profile' && (
          <OnboardingProfile
            profile={profile}
            onSaveProfile={handleSaveProfile}
            matchedCount={portfolio.filter(opp => {
              if (!opp.skills || opp.skills.length === 0) return false;
              const hasSharedSkill = opp.skills.some(s => profile.skills.includes(s));
              const isExcluded = profile.excludedCategories ? profile.excludedCategories.includes(opp.category) : false;
              return hasSharedSkill && !isExcluded;
            }).length}
          />
        )}

        {activeTab === 'workforce' && (
          <AIWorkforce
            portfolio={portfolio}
            profile={profile}
            onDiscoverNew={handleDiscover}
            onSelectOpportunity={setSelectedOpp}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineBoard
            portfolio={portfolio}
            onSelectOpportunity={setSelectedOpp}
            onPromoteStage={handlePromoteStage}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverLab
            onDiscover={handleDiscover}
            onSelectOpportunity={setSelectedOpp}
          />
        )}

        {activeTab === 'analytics' && (
          <PortfolioAnalyticsView
            portfolio={portfolio}
          />
        )}

        {activeTab === 'cli' && (
          <CLICockpit
            portfolio={portfolio}
            onSelectOpportunity={setSelectedOpp}
            onSaveOpportunity={handleSaveOpp}
          />
        )}

        {activeTab === 'system' && (
          <SystemArchitectureView
            portfolio={portfolio}
          />
        )}
      </main>

      <footer className="border-t border-neutral-200 bg-white py-6 text-center font-mono text-[11px] text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Oppy Operating System v1.0 • Evidence Over Opinions</span>
          <span className="text-neutral-700 font-sans font-medium">Founder Decision Cockpit</span>
        </div>
      </footer>

      {selectedOpp && (
        <OpportunityDrawer
          opportunity={selectedOpp}
          onClose={() => setSelectedOpp(null)}
          onSave={handleSaveOpp}
          onGenerateArtifacts={handleGenerateArtifacts}
          onDelete={handleDeleteOpp}
          userProfile={profile}
        />
      )}

      <LLMSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

