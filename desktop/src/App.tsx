/**
 * App — Root layout with Sidebar + Content Area + Three.js Background.
 * V2: All spaces wired — Home, Blocks, Devices, Telemetry, Settings,
 *     Simulator, Verification, Admin, Auth, Installer + 3D WebGL background.
 */
import { useAppStore } from './stores/appStore';
import Sidebar from './components/Sidebar';
import SceneBackground from './three/SceneBackground';
import HomeSpace from './spaces/HomeSpace';
import BlocksSpace from './spaces/BlocksSpace';
import DevicesSpace from './spaces/DevicesSpace';
import TelemetrySpace from './spaces/TelemetrySpace';
import SettingsSpace from './spaces/SettingsSpace';
import SimulatorSpace from './spaces/SimulatorSpace';
import VerificationSpace from './spaces/VerificationSpace';
import AdminSpace from './spaces/AdminSpace';
import AuthSpace from './spaces/AuthSpace';
import InstallerSpace from './spaces/InstallerSpace';

export default function App() {
  const activeSpace = useAppStore((s) => s.activeSpace);

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <SceneBackground />
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeSpace === 'home' && <HomeSpace />}
        {activeSpace === 'workspace' && <PlaceholderSpace title="WORKSPACE" subtitle="HARDWARE DESIGN CANVAS" />}
        {activeSpace === 'blocks' && <BlocksSpace />}
        {activeSpace === 'devices' && <DevicesSpace />}
        {activeSpace === 'telemetry' && <TelemetrySpace />}
        {activeSpace === 'settings' && <SettingsSpace />}
        {activeSpace === 'debug' && <PlaceholderSpace title="DEBUG TERMINAL" subtitle="SERIAL DEBUGGER & CODE REVIEW" />}
        {activeSpace === 'simulator' && <SimulatorSpace />}
        {activeSpace === 'verification' && <VerificationSpace />}
        {activeSpace === 'admin' && <AdminSpace />}
        {activeSpace === 'auth' && <AuthSpace />}
        {activeSpace === 'installer' && <InstallerSpace />}
      </main>
    </div>
  );
}

function PlaceholderSpace({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-4 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-widest uppercase flex items-center gap-4" style={{ color: 'var(--text-primary)' }}>
        <span className="w-4 h-4 rounded-none animate-pulse" style={{ background: 'var(--accent)' }} /> 
        {title}
      </h1>
      <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
    </div>
  );
}
