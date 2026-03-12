/**
 * HomeSpace — Command center with project gallery, quick actions, AI planner,
 * system status, and recent activity. The first screen users see.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, Cpu, Terminal, Shield, Radio, Star,
  Activity, Layers, Lightbulb, Package
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';

interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  board: string;
  tags: string[];
  difficulty: string;
  estimated_cost: number;
  stars: number;
}

interface BoardInfo {
  board_id: string;
  mcu: string;
  platform: string;
  flash_kb: number;
  ram_kb: number;
  clock_mhz: number;
  wifi: boolean;
  ble: boolean;
}

const API = 'http://localhost:8000/api';

export default function HomeSpace() {
  const setSpace = useAppStore((s) => s.setActiveSpace);
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [planResult, setPlanResult] = useState<any>(null);

  useEffect(() => {
    fetch(`${API}/gallery/gallery/templates`).then(r => r.json()).then(d => setTemplates(d.templates || [])).catch(() => {});
    fetch(`${API}/hardware/boards`).then(r => r.json()).then(d => setBoards((d.boards || []).slice(0, 8))).catch(() => {});
  }, []);

  const generatePlan = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch(`${API}/analysis/planner/generate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      setPlanResult(data.plan || data);
    } catch { /* ignore */ }
    setGenerating(false);
  };

  const quickActions = [
    { icon: Rocket, label: 'NEW PROJECT', desc: 'Create firmware project', space: 'workspace' as const, color: '#22c55e' },
    { icon: Terminal, label: 'DEBUG', desc: 'Serial monitor & protocol', space: 'debug' as const, color: '#3b82f6' },
    { icon: Shield, label: 'MISRA CHECK', desc: 'Code compliance scan', space: 'workspace' as const, color: '#8b5cf6' },
    { icon: Cpu, label: 'SIMULATOR', desc: 'Virtual hardware lab', space: 'simulator' as const, color: '#f59e0b' },
    { icon: Radio, label: 'DEVICES', desc: 'Manage connected', space: 'devices' as const, color: '#ef4444' },
    { icon: Layers, label: 'EXTENSIONS', desc: 'VS Code-style plugins', space: 'extensions' as const, color: '#06b6d4' },
  ];

  const getDifficultyColor = (d: string) => {
    return d === 'beginner' ? '#22c55e' : d === 'medium' ? '#f59e0b' : d === 'advanced' ? '#ef4444' : '#8b5cf6';
  };

  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* Hero / AI Planner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="border rounded-none p-6 space-y-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Lightbulb size={16} color="#000" />
            </div>
            <div>
              <h1 className="text-sm tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>PARAKRAM</h1>
              <p className="text-[8px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>BY VIDYUTLABS — DESCRIBE YOUR HARDWARE PROJECT — AI PLANS EVERYTHING</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input value={prompt} onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generatePlan()}
              placeholder='e.g. "Build a weather station with ESP32, BME280, and MQTT publishing to cloud"'
              className="flex-1 bg-transparent border rounded-none px-3 py-2 text-[10px] tracking-wider font-mono outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <motion.button onClick={generatePlan} disabled={generating}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-[8px] tracking-widest uppercase font-bold rounded-none disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#000' }}>
              {generating ? 'PLANNING...' : 'GENERATE PLAN'}
            </motion.button>
          </div>

          {/* Plan result */}
          {planResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t pt-4 space-y-3" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--accent)' }}>
                📋 PROJECT PLAN: {planResult.project_name}
              </h3>
              {planResult.components && (
                <div>
                  <span className="text-[7px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>COMPONENTS ({planResult.components.length})</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1 mt-1">
                    {planResult.components.slice(0, 6).map((c: any, i: number) => (
                      <div key={i} className="flex items-center justify-between px-2 py-1 border rounded-none text-[8px]"
                        style={{ borderColor: 'var(--border)' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                        <span style={{ color: '#22c55e' }}>${c.estimated_cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {planResult.total_cost && (
                <div className="flex items-center gap-4 text-[8px] tracking-widest">
                  <span style={{ color: 'var(--text-muted)' }}>TOTAL BOM: <span style={{ color: '#22c55e' }}>${planResult.total_cost}</span></span>
                  {planResult.battery_life && <span style={{ color: 'var(--text-muted)' }}>BATTERY: <span style={{ color: '#f59e0b' }}>{planResult.battery_life}</span></span>}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-[8px] tracking-widest uppercase font-bold mb-3" style={{ color: 'var(--text-muted)' }}>QUICK ACTIONS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {quickActions.map(({ icon: Icon, label, desc, space, color }) => (
              <motion.button key={label} onClick={() => setSpace(space)}
                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                className="border rounded-none p-3 text-left transition-all group"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                <Icon size={16} style={{ color }} className="mb-2" />
                <p className="text-[8px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>{label}</p>
                <p className="text-[7px] tracking-wider" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Project Gallery */}
        {templates.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[8px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-muted)' }}>PROJECT TEMPLATES</h2>
              <span className="text-[7px] tracking-widest" style={{ color: 'var(--accent)' }}>{templates.length} TEMPLATES</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {templates.slice(0, 6).map((t) => (
                <motion.div key={t.id}
                  whileHover={{ scale: 1.01, y: -1 }}
                  className="border rounded-none p-3 space-y-2 cursor-pointer transition-all"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>{t.title}</h3>
                    <div className="flex items-center gap-1">
                      <Star size={9} style={{ color: '#f59e0b' }} />
                      <span className="text-[7px]" style={{ color: '#f59e0b' }}>{t.stars}</span>
                    </div>
                  </div>
                  <p className="text-[7px] tracking-wider" style={{ color: 'var(--text-secondary)' }}>{t.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[6px] tracking-widest uppercase px-1.5 py-0.5 rounded-none border"
                        style={{ borderColor: getDifficultyColor(t.difficulty), color: getDifficultyColor(t.difficulty) }}>
                        {t.difficulty}
                      </span>
                      <span className="text-[6px] tracking-widest uppercase px-1.5 py-0.5 rounded-none"
                        style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                        {t.board}
                      </span>
                    </div>
                    <span className="text-[7px] font-bold" style={{ color: '#22c55e' }}>${t.estimated_cost}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Supported Boards */}
        {boards.length > 0 && (
          <div>
            <h2 className="text-[8px] tracking-widest uppercase font-bold mb-3" style={{ color: 'var(--text-muted)' }}>SUPPORTED BOARDS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
              {boards.map((b) => (
                <div key={b.board_id} className="flex items-center gap-2 px-2.5 py-1.5 border rounded-none text-[8px]"
                  style={{ borderColor: 'var(--border)' }}>
                  <Cpu size={10} style={{ color: 'var(--accent)' }} />
                  <div className="min-w-0">
                    <p className="text-[8px] tracking-wider font-bold truncate" style={{ color: 'var(--text-primary)' }}>{b.mcu}</p>
                    <p className="text-[6px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                      {b.flash_kb}KB · {b.ram_kb}KB · {b.clock_mhz}MHz
                      {b.wifi && ' · WiFi'}
                      {b.ble && ' · BLE'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: 'API ENDPOINTS', value: '25', icon: Activity, color: '#22c55e' },
            { label: 'BOARD VARIANTS', value: '30+', icon: Cpu, color: '#3b82f6' },
            { label: 'EXTENSIONS', value: '8 BUILT-IN', icon: Package, color: '#8b5cf6' },
            { label: 'TEMPLATES', value: '10', icon: Layers, color: '#f59e0b' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="border rounded-none p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
              <Icon size={14} style={{ color }} className="mb-1.5" />
              <p className="text-sm font-black tracking-wider" style={{ color }}>{value}</p>
              <p className="text-[7px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
