/**
 * HomeSpace — Welcome screen with project creation, recent projects, and example prompts.
 * First thing users see. Simple like ChatGPT.
 */
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../stores/appStore';
import {
  Sparkles, ArrowRight, Clock, Folder, Terminal, Cloud, Home, Radio,
  Lock, Bot, HardDrive, Hexagon
} from 'lucide-react';
import VoiceMicButton from '../components/VoiceMicButton';
import LLMSelector from '../components/LLMSelector';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EXAMPLES: { prompt: string; icon: any }[] = [
  { prompt: 'Build a weather station with BME280 and MQTT', icon: Cloud },
  { prompt: 'Create a smart home with motion sensor and relay', icon: Home },
  { prompt: 'Build a GPS tracker with LoRa communication', icon: Radio },
  { prompt: 'Design an RFID door lock with NeoPixel', icon: Lock },
  { prompt: 'Robot with motor control and obstacle avoidance', icon: Bot },
  { prompt: 'Data logger with SD card and deep sleep', icon: HardDrive },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomeSpace() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStage, setGenStage] = useState('');
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const addRecentProject = useAppStore((s) => s.addRecentProject);
  const recentProjects = useAppStore((s) => s.recentProjects);

  const handleGenerate = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setIsGenerating(true);
    const stages = ['Parsing request...', 'Resolving hardware...', 'Building firmware...', 'Compiling...', 'Done!'];
    for (const stage of stages) {
      setGenStage(stage);
      await new Promise((r) => setTimeout(r, 600));
    }

    const project = {
      id: `proj_${Date.now()}`,
      name: text.slice(0, 40),
      description: text,
      board: 'esp32dev',
      createdAt: new Date().toISOString(),
      blocks: [],
    };
    addRecentProject(project);
    setActiveProject(project);
    setIsGenerating(false);
  }, [setActiveProject, addRecentProject]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto px-6">
      <motion.div
        className="w-full max-w-2xl flex flex-col items-center gap-8 py-16"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Hero */}
        <motion.div variants={fadeUp} className="text-center">
          <h1 className="text-5xl font-extrabold tracking-widest mb-3 uppercase flex items-center justify-center gap-4"
            style={{ color: 'var(--text-primary)' }}>
            <Hexagon size={40} style={{ color: 'var(--accent)' }} /> 
            Parakram
          </h1>
          <p className="text-sm tracking-widest uppercase mt-4" style={{ color: 'var(--text-secondary)' }}>
            System Initialized • Awaiting Commands
          </p>
        </motion.div>

        {/* Prompt Input */}
        <motion.div variants={fadeUp} className="w-full">
          <div className="flex items-center gap-2 mb-2 justify-end">
            <LLMSelector />
          </div>
          <div className="glass relative flex items-center gap-3 px-5 py-4 rounded-none border-l-4"
            style={{ boxShadow: 'var(--shadow-glow)', borderLeftColor: 'var(--accent)' }}>
            <Sparkles size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate(prompt)}
              placeholder="Describe your device — text or voice..."
              className="flex-1 bg-transparent outline-none text-base"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}
              disabled={isGenerating}
            />
            <VoiceMicButton onTranscript={(text) => { setPrompt(text); handleGenerate(text); }} />
            <motion.button
              onClick={() => handleGenerate(prompt)}
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center gap-2 px-6 py-2 rounded-none text-xs tracking-widest uppercase font-bold text-black transition-all disabled:opacity-40"
              style={{ background: 'var(--accent)', boxShadow: '0 0 15px var(--accent-glow)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isGenerating ? genStage : <>Execute <ArrowRight size={14} /></>}
            </motion.button>
          </div>
          <p className="text-center mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            Press <kbd className="px-1 py-0.5 rounded text-[10px] font-mono" style={{ background: 'var(--bg-elevated)' }}>Ctrl+K</kbd> for command palette · Voice input powered by Sarvam AI
          </p>
        </motion.div>

        {/* Generation Progress */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full glass rounded-none border-l-4 px-5 py-4 mt-4"
              style={{ borderLeftColor: 'var(--info)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-t-transparent rounded-none animate-spin" style={{ borderColor: 'var(--info)', borderTopColor: 'transparent' }} />
                <span className="text-xs tracking-widest font-bold uppercase" style={{ color: 'var(--info)' }}>{genStage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <motion.div variants={fadeUp} className="w-full">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>
              <Clock size={14} /> Recent Initials
            </h3>
            <div className="flex flex-col gap-2">
              {recentProjects.slice(0, 5).map((p) => (
                <motion.button
                  key={p.id}
                  className="glass glass-hover flex items-center gap-3 px-4 py-3 rounded-none border-l-2 text-left transition-all w-full"
                  style={{ borderLeftColor: 'var(--border)' }}
                  onClick={() => setActiveProject(p)}
                  whileHover={{ x: 4 }}
                >
                  <Folder size={16} style={{ color: 'var(--accent)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold uppercase tracking-widest truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
                    <div className="text-[10px] tracking-widest uppercase truncate" style={{ color: 'var(--text-muted)' }}>{p.board}</div>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Example Prompts */}
        <motion.div variants={fadeUp} className="w-full">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3 mt-6" style={{ color: 'var(--text-secondary)' }}>
            <Terminal size={14} /> System Protocols
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {EXAMPLES.map(({ prompt: ex, icon }) => (
              <motion.button
                key={ex}
                onClick={() => { setPrompt(ex); handleGenerate(ex); }}
                className="glass glass-hover flex items-center gap-3 px-4 py-4 rounded-none border-l-2 text-left transition-all"
                style={{ borderLeftColor: 'var(--border)' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-none" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <icon.type size={16} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase leading-tight" style={{ color: 'var(--text-secondary)' }}>{ex}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
