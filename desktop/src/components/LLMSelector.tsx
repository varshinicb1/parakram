/**
 * LLMSelector — Visual model selector with free/paid model support.
 * Users can switch models, add API keys, and configure custom providers.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, Check, Zap, Globe, Cpu, Sparkles, Star, Lock } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  provider: string;
  category: string;
  context: number;
  free: boolean;
  active: boolean;
}

const CATEGORY_ICONS: Record<string, typeof Brain> = {
  coding: Zap,
  reasoning: Sparkles,
  general: Globe,
  local: Cpu,
  custom: Star,
};

const CATEGORY_COLORS: Record<string, string> = {
  coding: '#00d4ff',
  reasoning: '#d97706',
  general: '#22c55e',
  local: '#8b5cf6',
  custom: '#ec4899',
};

export default function LLMSelector() {
  const [models, setModels] = useState<Model[]>([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/llm/models')
      .then(r => r.json())
      .then(data => {
        setModels(data.models || []);
        setActiveId(data.active || '');
      })
      .catch(() => {});
  }, []);

  const switchModel = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/llm/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_id: id }),
      });
      if (res.ok) {
        setActiveId(id);
        setModels(prev => prev.map(m => ({ ...m, active: m.id === id })));
      }
    } catch (e) {
      console.error('Failed to switch model:', e);
    }
    setLoading(false);
    setIsOpen(false);
  };

  const activeModel = models.find(m => m.id === activeId);
  const activeCat = activeModel?.category || 'general';
  const activeColor = CATEGORY_COLORS[activeCat] || '#00d4ff';
  const ActiveIcon = CATEGORY_ICONS[activeCat] || Brain;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-none border text-[9px] tracking-widest uppercase font-bold transition-all"
        style={{
          background: 'var(--bg-tertiary)',
          borderColor: activeColor,
          color: activeColor,
          boxShadow: `0 0 8px ${activeColor}30`,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ActiveIcon size={12} />
        {activeModel?.name || 'SELECT MODEL'}
        {activeModel?.free && <span style={{ color: '#22c55e', fontSize: '7px' }}>FREE</span>}
        <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute top-full mt-1 right-0 w-80 border rounded-none overflow-hidden z-50"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <div className="p-2 border-b text-[8px] tracking-widest uppercase font-bold"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              INTELLIGENCE CORE — SELECT MODEL
            </div>

            {/* Group by category */}
            {['coding', 'reasoning', 'general', 'local', 'custom'].map(cat => {
              const catModels = models.filter(m => m.category === cat);
              if (catModels.length === 0) return null;
              const catColor = CATEGORY_COLORS[cat];

              return (
                <div key={cat}>
                  <div className="px-3 py-1 text-[7px] tracking-widest uppercase font-bold border-b"
                    style={{ color: catColor, borderColor: 'var(--border)', background: `${catColor}08` }}>
                    {cat.toUpperCase()} MODELS
                  </div>
                  {catModels.map((m) => {
                    const Icon = CATEGORY_ICONS[m.category] || Brain;
                    const color = CATEGORY_COLORS[m.category] || '#00d4ff';
                    return (
                      <button
                        key={m.id}
                        onClick={() => switchModel(m.id)}
                        disabled={loading}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left transition-all hover:bg-white/5 disabled:opacity-30 border-l-2"
                        style={{
                          borderLeftColor: m.active ? color : 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <Icon size={13} style={{ color }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] tracking-widest uppercase font-bold truncate">{m.name}</span>
                            {m.free ? (
                              <span className="px-1 py-0.5 text-[6px] tracking-widest uppercase font-bold rounded-none border"
                                style={{ color: '#22c55e', borderColor: '#22c55e40' }}>FREE</span>
                            ) : (
                              <Lock size={8} style={{ color: 'var(--text-muted)' }} />
                            )}
                          </div>
                          <div className="text-[7px] tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                            {m.provider} · {(m.context / 1000).toFixed(0)}K CTX
                          </div>
                        </div>
                        {m.active && <Check size={12} style={{ color }} />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
