/**
 * App — Root layout with Sidebar + Content Area + Three.js Background.
 * Parakram: 13 spaces — firmware development platform by Vidyutlabs.
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
import ExtensionSpace from './spaces/ExtensionSpace';
import WorkspaceSpace from './spaces/WorkspaceSpace';
import DebugSpace from './spaces/DebugSpace';

export default function App() {
  const activeSpace = useAppStore((s) => s.activeSpace);

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <SceneBackground />
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeSpace === 'home' && <HomeSpace />}
        {activeSpace === 'workspace' && <WorkspaceSpace />}
        {activeSpace === 'blocks' && <BlocksSpace />}
        {activeSpace === 'devices' && <DevicesSpace />}
        {activeSpace === 'telemetry' && <TelemetrySpace />}
        {activeSpace === 'settings' && <SettingsSpace />}
        {activeSpace === 'debug' && <DebugSpace />}
        {activeSpace === 'simulator' && <SimulatorSpace />}
        {activeSpace === 'verification' && <VerificationSpace />}
        {activeSpace === 'admin' && <AdminSpace />}
        {activeSpace === 'auth' && <AuthSpace />}
        {activeSpace === 'installer' && <InstallerSpace />}
        {activeSpace === 'extensions' && <ExtensionSpace />}
      </main>
    </div>
  );
}
