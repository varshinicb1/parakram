/**
 * ExtensionSpace — VS Code-style extension management panel.
 * Browse installed extensions, marketplace, enable/disable, install.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Puzzle, Download, Check, X, Search, ToggleLeft, ToggleRight,
  Cpu, Thermometer, Radio, Wrench, Shield, Upload, Battery, Activity
} from 'lucide-react';

interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon: string;
  category: string;
  enabled: boolean;
  loaded: boolean;
  builtin: boolean;
  provides: string[];
  error?: string;
}

interface MarketplaceItem {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  downloads: number;
}

const ICON_MAP: Record<string, typeof Cpu> = {
  cpu: Cpu, thermometer: Thermometer, radio: Radio, wrench: Wrench,
  shield: Shield, upload: Upload, battery: Battery, activity: Activity,
  puzzle: Puzzle,
};

const CATEGORY_COLORS: Record<string, string> = {
  'board-support': '#3b82f6',
  sensor: '#22c55e',
  protocol: '#d97706',
  tool: '#8b5cf6',
  general: 'var(--accent)',
};

const API = 'http://localhost:8000/api/extensions';

export default function ExtensionSpace() {
  const [tab, setTab] = useState<'installed' | 'marketplace'>('installed');
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>([]);
  const [search, setSearch] = useState('');
  const [installing, setInstalling] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/list`).then(r => r.json()).then(d => setExtensions(d.extensions || [])).catch(() => {});
    fetch(`${API}/marketplace`).then(r => r.json()).then(d => setMarketplace(d.available || [])).catch(() => {});
  }, []);

  const toggleExtension = async (ext: Extension) => {
    try {
      await fetch(`${API}/${ext.id}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !ext.enabled }),
      });
      setExtensions(prev => prev.map(e => e.id === ext.id ? { ...e, enabled: !e.enabled } : e));
    } catch { /* ignore */ }
  };

  const installExtension = async (item: MarketplaceItem) => {
    setInstalling(item.id);
    try {
      await fetch(`${API}/install`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manifest: item }),
      });
      // Refresh
      const res = await fetch(`${API}/list`);
      const data = await res.json();
      setExtensions(data.extensions || []);
      setMarketplace(prev => prev.filter(m => m.id !== item.id));
    } catch { /* ignore */ }
    setInstalling(null);
  };

  const filteredExtensions = extensions.filter(e =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.category.includes(search.toLowerCase())
  );

  const filteredMarketplace = marketplace.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase())
  );

  const builtinCount = extensions.filter(e => e.builtin).length;
  const userCount = extensions.filter(e => !e.builtin).length;

  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold tracking-widest uppercase flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <Puzzle size={20} style={{ color: 'var(--accent)' }} />
            EXTENSIONS
          </h1>
          <div className="flex items-center gap-3 text-[8px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
            {builtinCount} BUILT-IN · {userCount} USER-INSTALLED
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH EXTENSIONS..."
            className="w-full bg-transparent border rounded-none pl-9 pr-3 py-2 text-[9px] tracking-widest uppercase font-mono outline-none"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Tab nav */}
        <div className="flex items-center gap-1 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          {([['installed', `INSTALLED (${extensions.length})`, Puzzle], ['marketplace', 'MARKETPLACE', Download]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2.5 text-[9px] tracking-widest uppercase font-bold border-b-2 transition-all"
              style={{
                borderBottomColor: tab === id ? 'var(--accent)' : 'transparent',
                color: tab === id ? 'var(--accent)' : 'var(--text-muted)',
              }}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Installed */}
        {tab === 'installed' && (
          <div className="grid grid-cols-1 gap-2">
            {filteredExtensions.map(ext => {
              const IconComp = ICON_MAP[ext.icon] || Puzzle;
              const catColor = CATEGORY_COLORS[ext.category] || 'var(--accent)';
              return (
                <motion.div key={ext.id}
                  className="border rounded-none p-4 flex items-center gap-4 transition-all"
                  style={{
                    borderColor: ext.enabled ? catColor : 'var(--border)',
                    background: 'var(--bg-secondary)',
                    opacity: ext.enabled ? 1 : 0.6,
                  }}
                  whileHover={{ x: 2 }}>
                  {/* Icon */}
                  <div className="w-10 h-10 flex items-center justify-center border rounded-none"
                    style={{ borderColor: catColor, color: catColor }}>
                    <IconComp size={18} />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
                        {ext.name}
                      </span>
                      <span className="text-[7px] font-mono px-1.5 py-0.5 border rounded-none"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                        v{ext.version}
                      </span>
                      {ext.builtin && (
                        <span className="text-[6px] tracking-widest uppercase font-bold px-1.5 py-0.5 rounded-none"
                          style={{ background: `${catColor}20`, color: catColor }}>
                          BUILT-IN
                        </span>
                      )}
                      <span className="text-[6px] tracking-widest uppercase font-bold px-1.5 py-0.5 rounded-none"
                        style={{ background: `${catColor}15`, color: catColor }}>
                        {ext.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[8px] tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {ext.description}
                    </p>
                    {ext.provides.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {ext.provides.slice(0, 4).map(p => (
                          <span key={p} className="text-[6px] font-mono px-1 py-0.5 border rounded-none"
                            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Toggle */}
                  <button onClick={() => toggleExtension(ext)} className="p-1 transition-all hover:scale-110"
                    style={{ color: ext.enabled ? catColor : 'var(--text-muted)' }}>
                    {ext.enabled ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Marketplace */}
        {tab === 'marketplace' && (
          <div className="grid grid-cols-1 gap-2">
            {filteredMarketplace.length === 0 ? (
              <div className="text-center py-12 text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                ALL AVAILABLE EXTENSIONS INSTALLED
              </div>
            ) : filteredMarketplace.map(item => (
              <motion.div key={item.id}
                className="border rounded-none p-4 flex items-center gap-4"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                whileHover={{ x: 2 }}>
                <div className="w-10 h-10 flex items-center justify-center border rounded-none"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                  <Puzzle size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                    <span className="text-[7px] font-mono" style={{ color: 'var(--text-muted)' }}>v{item.version} · {item.author}</span>
                  </div>
                  <p className="text-[8px] tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                  <span className="text-[7px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                    {item.downloads.toLocaleString()} downloads
                  </span>
                </div>
                <motion.button onClick={() => installExtension(item)}
                  disabled={installing === item.id}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-none border text-[8px] tracking-widest uppercase font-bold disabled:opacity-40"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                  {installing === item.id ? 'INSTALLING...' : <><Download size={10} /> INSTALL</>}
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
