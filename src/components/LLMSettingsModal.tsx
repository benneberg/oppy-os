import React, { useState, useEffect } from 'react';
import { X, Shield, Key, Sparkles, CheckCircle } from 'lucide-react';

interface LLMSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Native high-quality inference with native structured JSON schema support.',
    defaultModel: 'gemini-3.5-flash',
    models: [
      { id: 'gemini-3.5-flash', label: 'gemini-3.5-flash (Recommended)' },
      { id: 'gemini-2.5-pro', label: 'gemini-2.5-pro (Deep Reasoning)' },
      { id: 'gemini-1.5-flash', label: 'gemini-1.5-flash (Legacy Fast)' }
    ]
  },
  {
    id: 'groq',
    name: 'Groq Cloud',
    description: 'Incredibly fast LLaMA & Mixtral models powered by Groq LPUs.',
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'llama-3.3-70b-versatile (Highly Capable)' },
      { id: 'llama3-8b-8192', label: 'llama3-8b-8192 (Instant Response)' },
      { id: 'mixtral-8x7b-32768', label: 'mixtral-8x7b-32768 (MoE Architecture)' }
    ]
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Access any open source or proprietary model via a single standard API key.',
    defaultModel: 'meta-llama/llama-3.3-70b-instruct',
    models: [
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'LLaMA 3.3 70B Instruct (Best OS)' },
      { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (State-of-the-Art)' },
      { id: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro (via OpenRouter)' },
      { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash (via OpenRouter)' }
    ]
  }
];

export const LLMSettingsModal: React.FC<LLMSettingsModalProps> = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState('gemini-3.5-flash');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProvider = localStorage.getItem('oppy_llm_provider') || 'gemini';
    const savedModel = localStorage.getItem('oppy_llm_model') || 'gemini-3.5-flash';
    const savedKey = localStorage.getItem('oppy_api_key') || '';

    setProvider(savedProvider);
    setModel(savedModel);
    setApiKey(savedKey);
  }, [isOpen]);

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    const selected = PROVIDERS.find(p => p.id === newProvider);
    if (selected) {
      setModel(selected.defaultModel);
    }
  };

  const handleSave = () => {
    localStorage.setItem('oppy_llm_provider', provider);
    localStorage.setItem('oppy_llm_model', model);
    localStorage.setItem('oppy_api_key', apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  const currentProviderDetails = PROVIDERS.find(p => p.id === provider);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="llm-settings-panel" 
        className="w-full max-w-lg bg-white rounded-2xl border border-neutral-200 shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-neutral-900">BYOK LLM Configuration</h3>
              <p className="text-[11px] font-mono text-neutral-500">Bring Your Own Key</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start space-x-3 text-xs leading-relaxed text-neutral-700">
            <Shield className="w-5 h-5 text-neutral-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-neutral-900">Zero Server Storage Policy</span>
              <p>Your API credentials are stored locally in your browser (LocalStorage). They are sent with every discovery request in the headers to authenticate directly with the chosen provider. No intermediary database retains your keys.</p>
            </div>
          </div>

          {/* Provider Selection */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
              1. Select AI Provider
            </label>
            <div className="grid grid-cols-1 gap-3">
              {PROVIDERS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleProviderChange(p.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between ${
                    provider === p.id 
                      ? 'border-neutral-900 bg-neutral-50 shadow-sm ring-1 ring-neutral-900/10' 
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <span className="font-sans font-bold text-sm text-neutral-900 block">{p.name}</span>
                    <span className="font-sans text-xs text-neutral-500 block leading-normal">{p.description}</span>
                  </div>
                  {provider === p.id && (
                    <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
              2. Select Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white text-sm font-sans"
            >
              {currentProviderDetails?.models.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                3. Input Provider API Key
              </label>
              <button 
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-xs font-mono text-neutral-600 hover:underline"
              >
                {showKey ? 'Hide Key' : 'Show Key'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${currentProviderDetails?.name || 'LLM'} API Key`}
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white font-mono text-sm"
              />
              <Key className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-150 rounded-lg border border-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center space-x-2 transition-all active:scale-95 disabled:bg-neutral-400"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Configuration Saved!</span>
              </>
            ) : (
              <span>Save Configuration</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
