/**
 * Sidebar — V2 Complete with all 12 spaces.
 * Uses Lucide icons with Stark HUD aesthetic.
 */
import { motion } from 'framer-motion';
import { useAppStore, type Space } from '../stores/appStore';
import {
  Home, Folder, Box, Cpu, Activity, Settings, Bug, Hexagon,
  Monitor, ClipboardCheck, Shield, LogIn, Download, Puzzle
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const spaces: { id: Space; icon: any; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'workspace', icon: Folder, label: 'Projects' },
  { id: 'blocks', icon: Box, label: 'Blocks' },
  { id: 'devices', icon: Cpu, label: 'Devices' },
  { id: 'simulator', icon: Monitor, label: 'Simulator' },
  { id: 'verification', icon: ClipboardCheck, label: 'Verify' },
  { id: 'telemetry', icon: Activity, label: 'Telemetry' },
  { id: 'installer', icon: Download, label: 'Installer' },
  { id: 'extensions', icon: Puzzle, label: 'Extensions' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'debug', icon: Bug, label: 'Debug' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bottomSpaces: { id: Space; icon: any; label: string }[] = [
  { id: 'admin', icon: Shield, label: 'Admin' },
  { id: 'auth', icon: LogIn, label: 'Account' },
];

export default function Sidebar() {
  const activeSpace = useAppStore((s) => s.activeSpace);
  const setActiveSpace = useAppStore((s) => s.setActiveSpace);
  const theme = useAppStore((s) => s.theme);

  const renderNavButton = ({ id, icon: Icon, label }: { id: Space; icon: typeof Home; label: string }) => {
    const isActive = activeSpace === id;
    return (
      <motion.button
        key={id}
        onClick={() => setActiveSpace(id)}
        className="relative flex items-center justify-center w-10 h-10 rounded-[4px] transition-all duration-200 group"
        style={{
          background: isActive ? 'var(--accent-subtle)' : 'transparent',
          color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
          border: isActive ? '1px solid var(--accent)' : '1px solid transparent'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={label}
      >
        <Icon size={20} />
        {isActive && (
          <motion.div
            className="absolute left-[3px] w-[2px] h-6 rounded-none"
            style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }}
            layoutId="sidebar-indicator"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        {/* Tooltip */}
        <span className="absolute left-14 px-2 py-1 rounded-none border text-[10px] tracking-widest uppercase font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50"
          style={{ background: 'var(--bg-elevated)', color: 'var(--accent)', borderColor: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }}>
          {label}
        </span>
      </motion.button>
    );
  };

  return (
    <motion.aside
      className="flex flex-col items-center py-4 gap-1 border-r shrink-0"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
      initial={{ x: -64 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center w-10 h-10 mb-4 cursor-pointer"
        onClick={() => setActiveSpace('home')}
        title="Parakram Command Center"
      >
        <Hexagon size={28} style={{ color: 'var(--accent)' }} />
      </div>

      {/* Main nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {spaces.map(renderNavButton)}
      </nav>

      {/* Bottom nav (Admin + Account) */}
      <div className="flex flex-col gap-1 border-t pt-2" style={{ borderColor: 'var(--border)' }}>
        {bottomSpaces.map(renderNavButton)}
      </div>

      {/* Theme indicator */}
      <div className="mt-2">
        <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)' }} title={`Theme: ${theme}`} />
      </div>
    </motion.aside>
  );
}
