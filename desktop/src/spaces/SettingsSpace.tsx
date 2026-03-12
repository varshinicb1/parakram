/**
 * SettingsSpace — Configure theme, AI models, API keys, and system paths.
 * V2: Integrated ModelSettings for full LLM provider management.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, type Theme } from '../stores/appStore';
import { Paintbrush, FolderDot, Settings as SettingsIcon, Brain } from 'lucide-react';
import ModelSettings from '../components/ModelSettings';
import LLMSelector from '../components/LLMSelector';

const THEMES: { id: Theme; name: string; preview: string }[] = [
  { id: 'dark-lab', name: 'Dark Lab', preview: '#0a0a14' },
  { id: 'cyberpunk', name: 'Cyberpunk', preview: '#0d0221' },
  { id: 'midnight', name: 'Midnight', preview: '#020617' },
  { id: 'solarized', name: 'Solarized', preview: '#002b36' },
  { id: 'retro', name: 'Retro Terminal', preview: '#0c0c0c' },
  { id: 'glass', name: 'Glass UI', preview: '#1a1a2e' },
];

type SettingsTab = 'general' | 'models' | 'paths';

export default function SettingsSpace() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const tabs: { id: SettingsTab; label: string; icon: typeof Brain }[] = [
    { id: 'general', label: 'APPEARANCE', icon: Paintbrush },
    { id: 'models', label: 'AI MODELS & KEYS', icon: Brain },
    { id: 'paths', label: 'SYSTEM', icon: FolderDot },
  ];

  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold tracking-widest uppercase flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <SettingsIcon size={20} style={{ color: 'var(--accent)' }} />
            SYSTEM SETTINGS
          </h1>
          <LLMSelector />
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 text-[9px] tracking-widest uppercase font-bold transition-all border-b-2"
                style={{
                  borderBottomColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                }}>
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab: Appearance */}
        {activeTab === 'general' && (
          <section>
            <h2 className="flex items-center gap-2 text-sm font-semibold mb-4 tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}>
              <Paintbrush size={14} /> THEME SELECT
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map((t) => (
                <motion.button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className="rounded-none p-4 text-left transition-all border"
                  style={{
                    borderColor: theme === t.id ? 'var(--accent)' : 'var(--border)',
                    background: 'var(--bg-secondary)',
                    boxShadow: theme === t.id ? '0 0 12px var(--accent-glow)' : 'none',
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-none" style={{ background: t.preview, border: '1px solid var(--border)' }} />
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>{t.name}</span>
                  </div>
                  {theme === t.id && (
                    <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--accent)' }}>ACTIVE</span>
                  )}
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Tab: AI Models & Keys */}
        {activeTab === 'models' && <ModelSettings />}

        {/* Tab: System */}
        {activeTab === 'paths' && (
          <section>
            <h2 className="flex items-center gap-2 text-sm font-semibold mb-4 tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}>
              <FolderDot size={14} /> SYSTEM PATHS
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Projects Directory', value: '~/ParakramProjects' },
                { label: 'PlatformIO', value: '~/.platformio/penv/bin/pio' },
                { label: 'Backend API', value: 'http://localhost:8000' },
                { label: 'Ollama', value: 'http://localhost:11434' },
              ].map((item) => (
                <div key={item.label} className="border rounded-none p-4 flex items-center justify-between"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                  <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
