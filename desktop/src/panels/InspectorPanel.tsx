/**
 * InspectorPanel — Block config panel that opens when a node is clicked.
 * Shows block details, configuration, and AI actions.
 */
import { motion } from 'framer-motion';
import { X, Settings2, Code2, Sparkles } from 'lucide-react';
import type { Node } from '@xyflow/react';

const CATEGORY_COLORS: Record<string, string> = {
  sensor: 'var(--sensor)',
  actuator: 'var(--actuator)',
  communication: 'var(--communication)',
  display: 'var(--display)',
  storage: 'var(--storage)',
  power: 'var(--power)',
  security: 'var(--security)',
  logic: 'var(--logic)',
  audio: 'var(--audio)',
  boards: 'var(--accent)',
};

interface Props {
  node: Node;
  onClose: () => void;
}

export default function InspectorPanel({ node, onClose }: Props) {
  const data = node.data as Record<string, unknown>;
  const name = (data.name as string) || 'Block';
  const category = (data.category as string) || 'logic';
  const blockId = (data.blockId as string) || '';
  const config = (data.config as Record<string, unknown>) || {};
  const color = CATEGORY_COLORS[category] || 'var(--accent)';

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="border-l overflow-hidden flex flex-col"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-none animate-pulse" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
          <h2 className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>{name}</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-none transition-colors hover:bg-white/5 border border-transparent hover:border-[var(--border)]"
          style={{ color: 'var(--text-muted)' }}>
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Category badge */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-none border text-[9px] font-bold uppercase tracking-widest"
            style={{ background: `${color}10`, color, borderColor: `${color}30` }}>
            {category}
          </span>
          {blockId && (
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              {blockId}
            </span>
          )}
        </div>

        {/* Configuration */}
        <div>
          <h3 className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-bold mb-3"
            style={{ color: 'var(--text-secondary)' }}>
            <Settings2 size={12} /> HARDWARE CONFIGURATION
          </h3>
          <div className="flex flex-col gap-2">
            {Object.entries(config).length > 0 ? (
              Object.entries(config).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between glass px-3 py-2 rounded-none border-l-2" style={{ borderLeftColor: 'var(--border)' }}>
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>{key}</span>
                  <input
                    type="text"
                    defaultValue={String(value)}
                    className="w-24 text-right bg-transparent outline-none text-[10px] font-mono px-2 py-1 rounded-none uppercase"
                    style={{
                      color: 'var(--text-primary)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                    }}
                  />
                </div>
              ))
            ) : (
              <p className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>NO CONFIGURATION REQUIRED</p>
            )}
          </div>
        </div>

        {/* AI Actions */}
        <div className="mt-4">
          <h3 className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-bold mb-3"
            style={{ color: 'var(--text-secondary)' }}>
            <Sparkles size={12} /> AI ASSISTANT PROTOCOLS
          </h3>
          <div className="flex flex-col gap-1.5">
            <button className="glass glass-hover flex items-center gap-3 px-3 py-2.5 rounded-none border-l-2 text-[10px] tracking-widest uppercase font-bold text-left transition-all"
              style={{ color: 'var(--text-primary)', borderLeftColor: 'transparent' }}>
              <Sparkles size={12} style={{ color: 'var(--accent)' }} />
              EXPLAIN COMPONENT
            </button>
            <button className="glass glass-hover flex items-center gap-3 px-3 py-2.5 rounded-none border-l-2 text-[10px] tracking-widest uppercase font-bold text-left transition-all"
              style={{ color: 'var(--text-primary)', borderLeftColor: 'transparent' }}>
              <Code2 size={12} style={{ color: 'var(--accent)' }} />
              VIEW SOURCE CODE
            </button>
            <button className="glass glass-hover flex items-center gap-3 px-3 py-2.5 rounded-none border-l-2 text-[10px] tracking-widest uppercase font-bold text-left transition-all"
              style={{ color: 'var(--text-primary)', borderLeftColor: 'transparent' }}>
              <Settings2 size={12} style={{ color: 'var(--accent)' }} />
              OPTIMIZE PARAMETERS
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
