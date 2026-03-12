/**
 * WorkspaceSpace — Main workspace: PromptBar + Canvas + Inspector + AI Copilot + Terminal.
 * The heart of Parakram.
 */
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../stores/appStore';
import HardwareCanvas from '../canvas/HardwareCanvas';
import PromptBar from '../panels/PromptBar';
import InspectorPanel from '../panels/InspectorPanel';
import AICopilot from '../panels/AICopilot';
import { Sparkles, Terminal, Hexagon } from 'lucide-react';
import type { Node } from '@xyflow/react';

export default function WorkspaceSpace() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const showInspector = useAppStore((s) => s.showInspector);
  const setShowInspector = useAppStore((s) => s.setShowInspector);
  const showTerminal = useAppStore((s) => s.showTerminal);
  const setShowTerminal = useAppStore((s) => s.setShowTerminal);
  const activeProject = useAppStore((s) => s.activeProject);
  const [graphNodes, setGraphNodes] = useState<Node[]>([]);
  const [showCopilot, setShowCopilot] = useState(false);

  const handleNodeSelect = useCallback((node: Node | null) => {
    setSelectedNode(node);
    setShowInspector(!!node);
  }, [setShowInspector]);

  const handleGraphGenerated = useCallback((nodes: Node[]) => {
    setGraphNodes(nodes);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Prompt Bar */}
      <PromptBar onGraphGenerated={handleGraphGenerated} />

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <motion.div className="flex-1 relative" layout transition={{ duration: 0.3 }}>
          <HardwareCanvas onNodeSelect={handleNodeSelect} externalNodes={graphNodes} />

          {/* Project info overlay */}
          {activeProject && (
            <div className="absolute top-3 left-3 glass px-3 py-2 rounded-none border-l-2 flex items-center gap-2 z-10"
              style={{ borderLeftColor: 'var(--accent)' }}>
              <Hexagon size={18} style={{ color: 'var(--accent)' }} />
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
                  {activeProject.name}
                </div>
                <div className="text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                  {activeProject.board} • {activeProject.blocks.length || '—'} BLOCKS
                </div>
              </div>
            </div>
          )}

          {/* Floating action buttons */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
            <motion.button
              onClick={() => setShowCopilot(!showCopilot)}
              className="flex items-center gap-2 px-4 py-2 rounded-none text-[10px] tracking-widest font-bold uppercase shadow-lg transition-all"
              style={{
                background: showCopilot ? 'var(--accent)' : 'var(--bg-glass)',
                backdropFilter: 'blur(4px)',
                color: showCopilot ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: '1px solid var(--border)',
                boxShadow: showCopilot ? '0 0 15px var(--accent-glow)' : 'var(--shadow-md)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={14} /> AI Copilot
            </motion.button>
            <motion.button
              onClick={() => setShowTerminal(!showTerminal)}
              className="flex items-center gap-2 px-4 py-2 rounded-none text-[10px] tracking-widest font-bold uppercase shadow-lg transition-all"
              style={{
                background: showTerminal ? 'var(--accent)' : 'var(--bg-glass)',
                backdropFilter: 'blur(4px)',
                color: showTerminal ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: '1px solid var(--border)',
                boxShadow: showTerminal ? '0 0 15px var(--accent-glow)' : 'var(--shadow-md)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Terminal size={14} /> Terminal
            </motion.button>
          </div>
        </motion.div>

        {/* Inspector Panel */}
        <AnimatePresence>
          {showInspector && selectedNode && (
            <InspectorPanel node={selectedNode} onClose={() => { setShowInspector(false); setSelectedNode(null); }} />
          )}
        </AnimatePresence>

        {/* AI Copilot */}
        <AnimatePresence>
          {showCopilot && <AICopilot onClose={() => setShowCopilot(false)} />}
        </AnimatePresence>
      </div>

      {/* Bottom Terminal */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 200 }}
            exit={{ height: 0 }}
            className="border-t overflow-hidden"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b text-xs font-medium"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <span>Terminal</span>
              <button onClick={() => setShowTerminal(false)} className="hover:text-white">×</button>
            </div>
            <div className="p-4 font-mono text-xs overflow-auto" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              <p style={{ color: 'var(--success)' }}>parakram@desktop ~/project $</p>
              <p style={{ color: 'var(--text-muted)' }}>Type /build, /flash, /simulate, or any PlatformIO command</p>
              <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
                Keyboard shortcuts: <span style={{ color: 'var(--accent)' }}>Ctrl+K</span> Command Palette •
                <span style={{ color: 'var(--accent)' }}> Ctrl+B</span> Build •
                <span style={{ color: 'var(--accent)' }}> Ctrl+F</span> Flash
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
