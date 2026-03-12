/**
 * SettingsSpace — LLM model management, API keys, account settings,
 * power profiler, memory analyzer, and system config.
 * Premium control panel for the entire Parakram OS.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Key, Cpu, User, CreditCard, Palette, Globe,
  Eye, EyeOff, Check, Save
} from 'lucide-react';

interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  apiKeyEnv: string;
  enabled: boolean;
  freeModels: string[];
}

interface Plan {
  id: string;
  name: string;
  price: number;
  features: Record<string, any>;
}

const API = 'http://localhost:8000/api';

const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'openrouter', name: 'OpenRouter',
    models: ['mistralai/mistral-7b-instruct:free', 'google/gemma-2-9b-it:free', 'meta-llama/llama-3.1-8b-instruct:free',
             'qwen/qwen-2.5-coder-32b-instruct:free', 'deepseek/deepseek-coder-33b-instruct', 'anthropic/claude-3.5-sonnet'],
    apiKeyEnv: 'OPENROUTER_API_KEY', enabled: true,
    freeModels: ['mistralai/mistral-7b-instruct:free', 'google/gemma-2-9b-it:free', 'meta-llama/llama-3.1-8b-instruct:free', 'qwen/qwen-2.5-coder-32b-instruct:free'],
  },
  {
    id: 'ollama', name: 'Ollama (Local)',
    models: ['parakram-coder:latest', 'codellama:7b', 'deepseek-coder:6.7b', 'qwen2.5-coder:7b', 'starcoder2:3b'],
    apiKeyEnv: '', enabled: true,
    freeModels: ['parakram-coder:latest', 'codellama:7b', 'deepseek-coder:6.7b', 'qwen2.5-coder:7b', 'starcoder2:3b'],
  },
  {
    id: 'gemini', name: 'Google Gemini',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    apiKeyEnv: 'GEMINI_API_KEY', enabled: false,
    freeModels: ['gemini-2.0-flash'],
  },
  {
    id: 'anthropic', name: 'Anthropic Claude',
    models: ['claude-3.5-sonnet', 'claude-3-haiku'],
    apiKeyEnv: 'ANTHROPIC_API_KEY', enabled: false,
    freeModels: [],
  },
  {
    id: 'openai', name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    apiKeyEnv: 'OPENAI_API_KEY', enabled: false,
    freeModels: [],
  },
  {
    id: 'groq', name: 'Groq (Fast)',
    models: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    apiKeyEnv: 'GROQ_API_KEY', enabled: false,
    freeModels: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768'],
  },
];

export default function SettingsSpace() {
  const [tab, setTab] = useState<'llm' | 'account' | 'billing' | 'appearance' | 'advanced'>('llm');
  const [providers, setProviders] = useState(LLM_PROVIDERS);
  const [activeModel, setActiveModel] = useState('qwen/qwen-2.5-coder-32b-instruct:free');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [plans, setPlans] = useState<Plan[]>([]);
  const [savedMsg, setSavedMsg] = useState('');
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#00ff88');

  useEffect(() => {
    fetch(`${API}/billing/plans`).then(r => r.json()).then(d => setPlans(d.plans || [])).catch(() => {});
  }, []);

  const saveSettings = () => {
    localStorage.setItem('parakram_active_model', activeModel);
    localStorage.setItem('parakram_api_keys', JSON.stringify(apiKeys));
    localStorage.setItem('parakram_theme', theme);
    localStorage.setItem('parakram_accent', accentColor);
    setSavedMsg('Settings saved!');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  const tabs = [
    { id: 'llm' as const, label: 'LLM MODELS', icon: Cpu },
    { id: 'account' as const, label: 'ACCOUNT', icon: User },
    { id: 'billing' as const, label: 'BILLING', icon: CreditCard },
    { id: 'appearance' as const, label: 'APPEARANCE', icon: Palette },
    { id: 'advanced' as const, label: 'ADVANCED', icon: Settings },
  ];

  return (
    <div className="flex-1 flex overflow-hidden animate-fade-in">
      {/* Left: Tab Navigation */}
      <div className="w-44 border-r flex flex-col shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-[8px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-muted)' }}>SETTINGS</h2>
        </div>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-2 px-3 py-2.5 text-[8px] tracking-widest uppercase font-bold transition-all text-left"
            style={{
              background: tab === id ? 'var(--accent-subtle)' : 'transparent',
              color: tab === id ? 'var(--accent)' : 'var(--text-muted)',
              borderLeft: tab === id ? '2px solid var(--accent)' : '2px solid transparent',
            }}>
            <Icon size={12} /> {label}
          </button>
        ))}

        {/* Save button */}
        <div className="mt-auto p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <motion.button onClick={saveSettings}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-1 px-3 py-2 text-[8px] tracking-widest uppercase font-bold rounded-none"
            style={{ background: 'var(--accent)', color: '#000' }}>
            <Save size={10} /> SAVE ALL
          </motion.button>
          {savedMsg && (
            <p className="text-center text-[7px] tracking-widest mt-1" style={{ color: '#22c55e' }}>
              <Check size={9} className="inline" /> {savedMsg}
            </p>
          )}
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* ── LLM Models ─────────────────────────────────── */}
        {tab === 'llm' && (
          <>
            <div>
              <h3 className="text-[9px] tracking-widest uppercase font-bold mb-1" style={{ color: 'var(--text-primary)' }}>ACTIVE MODEL</h3>
              <p className="text-[7px] tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Select the LLM used for firmware generation</p>
              <div className="bg-transparent border rounded-none px-3 py-2 text-[10px] font-mono font-bold" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                {activeModel}
              </div>
            </div>

            {providers.map(provider => (
              <div key={provider.id} className="border rounded-none p-4 space-y-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe size={13} style={{ color: provider.enabled ? 'var(--accent)' : 'var(--text-muted)' }} />
                    <h4 className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>{provider.name}</h4>
                    {provider.freeModels.length > 0 && (
                      <span className="text-[6px] tracking-widest uppercase px-1.5 py-0.5 rounded-none" style={{ background: '#22c55e20', color: '#22c55e' }}>
                        {provider.freeModels.length} FREE
                      </span>
                    )}
                  </div>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <span className="text-[7px] tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      {provider.enabled ? 'ON' : 'OFF'}
                    </span>
                    <div className="w-8 h-4 rounded-full relative cursor-pointer transition-all"
                      style={{ background: provider.enabled ? 'var(--accent)' : 'var(--border)' }}
                      onClick={() => {
                        setProviders(p => p.map(pr => pr.id === provider.id ? { ...pr, enabled: !pr.enabled } : pr));
                      }}>
                      <div className="w-3 h-3 rounded-full absolute top-0.5 transition-all"
                        style={{ background: '#000', left: provider.enabled ? '18px' : '2px' }} />
                    </div>
                  </label>
                </div>

                {/* API Key */}
                {provider.apiKeyEnv && (
                  <div className="flex items-center gap-2">
                    <Key size={10} style={{ color: 'var(--text-muted)' }} />
                    <input
                      type={showKeys[provider.id] ? 'text' : 'password'}
                      value={apiKeys[provider.id] || ''}
                      onChange={e => setApiKeys({ ...apiKeys, [provider.id]: e.target.value })}
                      placeholder={`${provider.apiKeyEnv}...`}
                      className="flex-1 bg-transparent border rounded-none px-2 py-1 text-[8px] font-mono outline-none"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                    <button onClick={() => setShowKeys({ ...showKeys, [provider.id]: !showKeys[provider.id] })}
                      className="p-1" style={{ color: 'var(--text-muted)' }}>
                      {showKeys[provider.id] ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                  </div>
                )}

                {/* Model list */}
                <div className="grid grid-cols-2 gap-1">
                  {provider.models.map(model => {
                    const isFree = provider.freeModels.includes(model);
                    const isActive = activeModel === model;
                    return (
                      <button key={model} onClick={() => setActiveModel(model)}
                        className="flex items-center gap-1.5 px-2 py-1.5 border rounded-none text-left text-[7px] font-mono transition-all"
                        style={{
                          borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                          background: isActive ? 'var(--accent-subtle)' : 'transparent',
                          color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                        }}>
                        {isActive && <Check size={8} />}
                        <span className="truncate">{model.split('/').pop()}</span>
                        {isFree && <span className="ml-auto text-[5px] tracking-widest" style={{ color: '#22c55e' }}>FREE</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Account ────────────────────────────────────── */}
        {tab === 'account' && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>ACCOUNT SETTINGS</h3>
            {[
              { label: 'Display Name', placeholder: 'Your name', type: 'text' },
              { label: 'Email', placeholder: 'you@example.com', type: 'email' },
              { label: 'Organization', placeholder: 'Your company (optional)', type: 'text' },
            ].map(field => (
              <div key={field.label}>
                <label className="text-[7px] tracking-widest uppercase font-bold block mb-1" style={{ color: 'var(--text-muted)' }}>{field.label}</label>
                <input type={field.type} placeholder={field.placeholder}
                  className="w-full bg-transparent border rounded-none px-3 py-2 text-[9px] tracking-wider outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
            ))}
            <div>
              <label className="text-[7px] tracking-widest uppercase font-bold block mb-1" style={{ color: 'var(--text-muted)' }}>CHANGE PASSWORD</label>
              <input type="password" placeholder="New password"
                className="w-full bg-transparent border rounded-none px-3 py-2 text-[9px] tracking-wider outline-none mb-1"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              <input type="password" placeholder="Confirm password"
                className="w-full bg-transparent border rounded-none px-3 py-2 text-[9px] tracking-wider outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>
        )}

        {/* ── Billing ────────────────────────────────────── */}
        {tab === 'billing' && (
          <div className="space-y-4">
            <h3 className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>SUBSCRIPTION PLANS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {plans.map(plan => (
                <div key={plan.id} className="border rounded-none p-4 space-y-3"
                  style={{
                    borderColor: plan.id === 'free' ? 'var(--accent)' : 'var(--border)',
                    background: plan.id === 'free' ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                  }}>
                  <div>
                    <h4 className="text-[10px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>{plan.name}</h4>
                    <p className="text-lg font-black" style={{ color: 'var(--accent)' }}>
                      {plan.price === 0 ? 'FREE' : plan.price === -1 ? 'CUSTOM' : `$${plan.price}/mo`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(plan.features || {}).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between text-[7px] tracking-wider">
                        <span style={{ color: 'var(--text-muted)' }}>{key.replace(/_/g, ' ')}</span>
                        <span style={{ color: val === true ? '#22c55e' : val === false ? '#ef4444' : 'var(--text-primary)' }}>
                          {val === true ? '✓' : val === false ? '✗' : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full px-3 py-1.5 text-[7px] tracking-widest uppercase font-bold border rounded-none"
                    style={{
                      borderColor: plan.id === 'free' ? 'var(--accent)' : 'var(--border)',
                      color: plan.id === 'free' ? 'var(--accent)' : 'var(--text-muted)',
                    }}>
                    {plan.id === 'free' ? 'CURRENT PLAN' : 'UPGRADE'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Appearance ─────────────────────────────────── */}
        {tab === 'appearance' && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>APPEARANCE</h3>
            <div>
              <label className="text-[7px] tracking-widest uppercase font-bold block mb-2" style={{ color: 'var(--text-muted)' }}>THEME</label>
              <div className="flex gap-2">
                {['dark', 'light', 'midnight', 'matrix'].map(t => (
                  <button key={t} onClick={() => setTheme(t)}
                    className="px-3 py-1.5 text-[7px] tracking-widest uppercase font-bold border rounded-none"
                    style={{
                      borderColor: theme === t ? 'var(--accent)' : 'var(--border)',
                      color: theme === t ? 'var(--accent)' : 'var(--text-muted)',
                      background: theme === t ? 'var(--accent-subtle)' : 'transparent',
                    }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[7px] tracking-widest uppercase font-bold block mb-2" style={{ color: 'var(--text-muted)' }}>ACCENT COLOR</label>
              <div className="flex gap-2">
                {['#00ff88', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'].map(c => (
                  <button key={c} onClick={() => setAccentColor(c)}
                    className="w-7 h-7 rounded-none border-2 transition-all"
                    style={{
                      background: c,
                      borderColor: accentColor === c ? '#fff' : 'transparent',
                      transform: accentColor === c ? 'scale(1.2)' : 'scale(1)',
                    }} />
                ))}
              </div>
            </div>
            <div>
              <label className="text-[7px] tracking-widest uppercase font-bold block mb-2" style={{ color: 'var(--text-muted)' }}>FONT SIZE</label>
              <input type="range" min="10" max="16" defaultValue="12" className="w-full" />
            </div>
          </div>
        )}

        {/* ── Advanced ───────────────────────────────────── */}
        {tab === 'advanced' && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>ADVANCED SETTINGS</h3>
            {[
              { label: 'PlatformIO Path', value: '~/.platformio', desc: 'PlatformIO installation directory' },
              { label: 'Projects Directory', value: './projects', desc: 'Default project storage' },
              { label: 'Ollama URL', value: 'http://localhost:11434', desc: 'Local Ollama server' },
              { label: 'Backend URL', value: 'http://localhost:8000', desc: 'API server address' },
              { label: 'Serial Baud Rate', value: '115200', desc: 'Default serial monitor speed' },
            ].map(setting => (
              <div key={setting.label}>
                <label className="text-[7px] tracking-widest uppercase font-bold block mb-0.5" style={{ color: 'var(--text-muted)' }}>{setting.label}</label>
                <p className="text-[6px] tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{setting.desc}</p>
                <input defaultValue={setting.value}
                  className="w-full bg-transparent border rounded-none px-3 py-1.5 text-[9px] font-mono outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
            ))}

            <div className="border-t pt-4 space-y-2" style={{ borderColor: 'var(--border)' }}>
              <h4 className="text-[7px] tracking-widest uppercase font-bold" style={{ color: '#ef4444' }}>DANGER ZONE</h4>
              <button className="px-3 py-1.5 text-[7px] tracking-widest uppercase font-bold border rounded-none"
                style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                CLEAR ALL DATA
              </button>
              <button className="px-3 py-1.5 text-[7px] tracking-widest uppercase font-bold border rounded-none ml-2"
                style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                RESET SETTINGS
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
