/**
 * ModelSettings — Full-page model management with API key entry and custom provider configuration.
 * Embedded in SettingsSpace.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Plus, Trash2, Save, Check, Globe, Cpu, Zap } from 'lucide-react';

interface CustomProvider {
  id: string;
  name: string;
  base_url: string;
  model: string;
  api_key: string;
  provider_name: string;
}

const PROVIDER_PRESETS = [
  { id: 'openrouter', name: 'OpenRouter', placeholder: 'sk-or-v1-...' },
  { id: 'openai', name: 'OpenAI', placeholder: 'sk-...' },
  { id: 'anthropic', name: 'Anthropic', placeholder: 'sk-ant-...' },
  { id: 'google', name: 'Google AI', placeholder: 'AIza...' },
  { id: 'groq', name: 'Groq', placeholder: 'gsk_...' },
  { id: 'together', name: 'Together AI', placeholder: 'tok_...' },
  { id: 'fireworks', name: 'Fireworks AI', placeholder: 'fw_...' },
  { id: 'deepseek', name: 'DeepSeek', placeholder: 'sk-...' },
  { id: 'mistral', name: 'Mistral AI', placeholder: '' },
];

export default function ModelSettings() {
  const [maskedKeys, setMaskedKeys] = useState<Record<string, string>>({});
  const [newKeyProvider, setNewKeyProvider] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [customProviders, setCustomProviders] = useState<CustomProvider[]>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customForm, setCustomForm] = useState({ id: '', name: '', base_url: '', model: '', api_key: '', provider_name: 'custom' });

  useEffect(() => {
    fetch('http://localhost:8000/api/llm/settings')
      .then(r => r.json())
      .then(data => {
        setMaskedKeys(data.api_keys || {});
        setCustomProviders(data.custom_providers || []);
      })
      .catch(() => {});
  }, []);

  const saveApiKey = async (provider: string, key: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/llm/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, api_key: key }),
      });
      if (res.ok) {
        setSaveStatus(`${provider} key saved`);
        setMaskedKeys(prev => ({ ...prev, [provider]: key.slice(0, 8) + '...' + key.slice(-4) }));
        setNewKeyValue('');
        setNewKeyProvider('');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (e) {
      console.error('Failed to save key:', e);
    }
  };

  const deleteApiKey = async (provider: string) => {
    try {
      await fetch(`http://localhost:8000/api/llm/api-key/${provider}`, { method: 'DELETE' });
      setMaskedKeys(prev => { const n = { ...prev }; delete n[provider]; return n; });
    } catch (e) {
      console.error('Failed to delete key:', e);
    }
  };

  const addCustomProvider = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/llm/custom-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customForm),
      });
      if (res.ok) {
        setCustomProviders(prev => [...prev.filter(p => p.id !== customForm.id), customForm as CustomProvider]);
        setShowAddCustom(false);
        setCustomForm({ id: '', name: '', base_url: '', model: '', api_key: '', provider_name: 'custom' });
      }
    } catch (e) {
      console.error('Failed to add provider:', e);
    }
  };

  const deleteCustomProvider = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/api/llm/custom-provider/${id}`, { method: 'DELETE' });
      setCustomProviders(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error('Failed to delete provider:', e);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Section: API Keys */}
      <div className="border rounded-none p-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Key size={14} style={{ color: 'var(--accent)' }} />
          <h3 className="text-[11px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
            API KEY MANAGEMENT
          </h3>
        </div>
        <p className="text-[8px] tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
          ADD YOUR OWN API KEYS TO UNLOCK PREMIUM MODELS. FREE MODELS WORK WITHOUT KEYS.
        </p>

        {/* Existing keys */}
        {Object.entries(maskedKeys).map(([provider, masked]) => masked && (
          <div key={provider} className="flex items-center gap-2 mb-2 px-3 py-2 border rounded-none"
            style={{ borderColor: 'var(--border)' }}>
            <Globe size={12} style={{ color: 'var(--accent)' }} />
            <span className="text-[9px] tracking-widest uppercase font-bold flex-1" style={{ color: 'var(--text-primary)' }}>
              {provider.toUpperCase()}
            </span>
            <span className="text-[8px] font-mono tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {masked}
            </span>
            <button onClick={() => deleteApiKey(provider)} className="p-1 hover:bg-red-500/20 rounded-none"
              style={{ color: '#ef4444' }}>
              <Trash2 size={10} />
            </button>
          </div>
        ))}

        {/* Add new key */}
        <div className="flex items-center gap-2 mt-2">
          <select value={newKeyProvider} onChange={(e) => setNewKeyProvider(e.target.value)}
            className="bg-transparent border rounded-none px-2 py-1.5 text-[9px] tracking-widest uppercase font-bold outline-none"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            <option value="">SELECT PROVIDER</option>
            {PROVIDER_PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input
            value={newKeyValue}
            onChange={(e) => setNewKeyValue(e.target.value)}
            placeholder={PROVIDER_PRESETS.find(p => p.id === newKeyProvider)?.placeholder || 'PASTE API KEY...'}
            className="flex-1 bg-transparent border rounded-none px-2 py-1.5 text-[9px] tracking-widest uppercase font-mono outline-none"
            type="password"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <motion.button onClick={() => { if (newKeyProvider && newKeyValue) saveApiKey(newKeyProvider, newKeyValue); }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-none border text-[9px] tracking-widest uppercase font-bold"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            <Save size={10} /> SAVE
          </motion.button>
        </div>

        {/* Save confirmation */}
        <AnimatePresence>
          {saveStatus && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-2 flex items-center gap-1 text-[8px] tracking-widest uppercase font-bold"
              style={{ color: '#22c55e' }}>
              <Check size={10} /> {saveStatus.toUpperCase()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section: Custom Providers */}
      <div className="border rounded-none p-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cpu size={14} style={{ color: '#8b5cf6' }} />
            <h3 className="text-[11px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
              CUSTOM PROVIDERS
            </h3>
          </div>
          <motion.button onClick={() => setShowAddCustom(!showAddCustom)}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-2 py-1 rounded-none border text-[8px] tracking-widest uppercase font-bold"
            style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>
            <Plus size={10} /> ADD PROVIDER
          </motion.button>
        </div>
        <p className="text-[8px] tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
          CONNECT ANY OPENAI-COMPATIBLE API ENDPOINT (LMSTUDIO, TEXT-GEN-WEBUI, VLLM, ETC.)
        </p>

        {/* Existing custom providers */}
        {customProviders.map(cp => (
          <div key={cp.id} className="flex items-center gap-2 mb-2 px-3 py-2 border rounded-none"
            style={{ borderColor: 'var(--border)' }}>
            <Zap size={12} style={{ color: '#ec4899' }} />
            <div className="flex-1">
              <div className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
                {cp.name}
              </div>
              <div className="text-[7px] font-mono tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {cp.base_url} · {cp.model}
              </div>
            </div>
            <button onClick={() => deleteCustomProvider(cp.id)} className="p-1 hover:bg-red-500/20 rounded-none"
              style={{ color: '#ef4444' }}>
              <Trash2 size={10} />
            </button>
          </div>
        ))}

        {/* Add custom provider form */}
        <AnimatePresence>
          {showAddCustom && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-3 border rounded-none p-3 flex flex-col gap-2" style={{ borderColor: '#8b5cf640' }}>
              <div className="grid grid-cols-2 gap-2">
                {['id', 'name', 'base_url', 'model'].map(field => (
                  <input key={field}
                    value={(customForm as Record<string, string>)[field] || ''}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={field === 'base_url' ? 'http://localhost:1234/v1' : field.toUpperCase().replace('_', ' ')}
                    className="bg-transparent border rounded-none px-2 py-1.5 text-[9px] tracking-widest uppercase font-mono outline-none"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                ))}
              </div>
              <input
                value={customForm.api_key}
                onChange={(e) => setCustomForm(prev => ({ ...prev, api_key: e.target.value }))}
                placeholder="API KEY (OPTIONAL)"
                type="password"
                className="bg-transparent border rounded-none px-2 py-1.5 text-[9px] tracking-widest uppercase font-mono outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <motion.button onClick={addCustomProvider}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-none border text-[9px] tracking-widest uppercase font-bold"
                style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>
                <Check size={10} /> SAVE PROVIDER
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
