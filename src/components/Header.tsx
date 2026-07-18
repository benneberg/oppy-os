import React from 'react';
import { Compass, Layers, Terminal, BarChart2, PlusCircle, RefreshCw, Zap, ShieldAlert, Workflow, Settings, Download, Award, Cpu } from 'lucide-react';
import { Opportunity } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  portfolio: Opportunity[];
  onReset: () => void;
  onOpenDiscover: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  portfolio,
  onReset,
  onOpenDiscover,
  onOpenSettings
}) => {
  const validatedCount = portfolio.filter(p => p.stage === 'validated' || p.stage === 'production').length;
  const activeCount = portfolio.filter(p => p.stage === 'active').length;
  const totalRevenue = portfolio.reduce((s, p) => s + (p.validation.revenue || 0), 0);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolio, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `oppy_portfolio_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const tabs = [
    { id: 'morning', label: 'Morning Cockpit', icon: Zap, badge: 'Daily' },
    { id: 'profile', label: 'My Profile', icon: Award },
    { id: 'workforce', label: 'AI Workforce', icon: Cpu },
    { id: 'pipeline', label: 'Opportunity Hub', icon: Layers, badge: `${portfolio.length}` },
    { id: 'discover', label: 'Discover Lab', icon: PlusCircle },
    { id: 'analytics', label: 'IQI Analytics', icon: BarChart2 },
    { id: 'cli', label: 'CLI Cockpit', icon: Terminal },
    { id: 'system', label: 'System Topology', icon: Workflow }
  ];

  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('morning')}>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shadow-md shadow-neutral-900/10 ring-1 ring-neutral-800">
                <Compass className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-display font-bold tracking-tight text-xl text-neutral-900">Oppy</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-neutral-100 text-neutral-800 rounded border border-neutral-300 uppercase tracking-wider">
                    v1.0 OS
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-500 hidden sm:block">
                  Discover. Evaluate. Validate. Build.
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-3 pl-6 border-l border-neutral-200 text-xs font-mono">
              <div className="flex items-center space-x-1 text-neutral-700 bg-neutral-100/80 px-2.5 py-1 rounded-md border border-neutral-200">
                <span className="text-neutral-400">ACTIVE:</span>
                <span className="font-semibold text-emerald-600">{activeCount}</span>
              </div>
              <div className="flex items-center space-x-1 text-neutral-700 bg-neutral-100/80 px-2.5 py-1 rounded-md border border-neutral-200">
                <span className="text-neutral-400">VALIDATED+:</span>
                <span className="font-semibold text-amber-600">{validatedCount}</span>
              </div>
              <div className="flex items-center space-x-1 text-neutral-700 bg-neutral-100/80 px-2.5 py-1 rounded-md border border-neutral-200">
                <span className="text-neutral-400">EVIDENCE REV:</span>
                <span className="font-semibold text-neutral-900">${totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-neutral-900 text-white border border-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white font-bold' : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="hidden sm:flex items-center space-x-2 pl-2">
            <button
              onClick={onOpenDiscover}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Venture</span>
            </button>
            <button
              onClick={onOpenSettings}
              title="LLM API Key Settings (BYOK)"
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportJSON}
              title="Export Portfolio (JSON)"
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onReset}
              title="Reset seed portfolio data"
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
