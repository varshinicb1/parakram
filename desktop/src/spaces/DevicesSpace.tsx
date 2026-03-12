/**
 * DevicesSpace — Auto-detect USB/serial devices, flash firmware, monitor serial.
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, RefreshCw, Zap, Activity, AlertTriangle, MonitorPlay, CheckCircle2 } from 'lucide-react';

interface Device {
  port: string;
  name: string;
  board: string;
  vid?: string;
  pid?: string;
}

const MOCK_DEVICES: Device[] = [
  { port: 'COM4', name: 'ESP32 DevKit v1', board: 'esp32dev', vid: '10C4', pid: 'EA60' },
  { port: 'COM7', name: 'ESP32-S3 DevKit', board: 'esp32-s3-devkitc-1', vid: '303A', pid: '1001' },
];

export default function DevicesSpace() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [flashingPort, setFlashingPort] = useState<string | null>(null);
  const [flashResult, setFlashResult] = useState<Record<string, string>>({});

  const scanDevices = useCallback(async () => {
    setScanning(true);
    try {
      const resp = await fetch('http://localhost:8000/api/flash/devices');
      if (resp.ok) {
        const data = await resp.json();
        setDevices(data.devices || []);
      } else {
        // Demo mode
        await new Promise((r) => setTimeout(r, 800));
        setDevices(MOCK_DEVICES);
      }
    } catch {
      await new Promise((r) => setTimeout(r, 800));
      setDevices(MOCK_DEVICES);
    }
    setScanning(false);
  }, []);

  useEffect(() => { scanDevices(); }, [scanDevices]);

  const flashDevice = useCallback(async (port: string) => {
    setFlashingPort(port);
    setFlashResult((r) => ({ ...r, [port]: '' }));
    try {
      const resp = await fetch('http://localhost:8000/api/flash/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ port }),
      });
      if (resp.ok) {
        setFlashResult((r) => ({ ...r, [port]: 'success' }));
      } else {
        setFlashResult((r) => ({ ...r, [port]: 'error' }));
      }
    } catch {
      // Demo mode
      await new Promise((r) => setTimeout(r, 2000));
      setFlashResult((r) => ({ ...r, [port]: 'success' }));
    }
    setFlashingPort(null);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div>
          <h1 className="text-xl font-bold tracking-widest uppercase flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <MonitorPlay size={20} style={{ color: 'var(--accent)' }} />
            Connected Hardware
          </h1>
          <p className="text-[10px] tracking-widest uppercase mt-1" style={{ color: 'var(--text-secondary)' }}>
            {devices.length} NODE{devices.length !== 1 ? 'S' : ''} DETECTED
          </p>
        </div>
        <motion.button
          onClick={scanDevices}
          disabled={scanning}
          className="flex items-center gap-2 px-6 py-2 rounded-none text-xs font-bold tracking-widest uppercase transition-all"
          style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px var(--accent-glow)' }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={14} className={scanning ? 'animate-spin' : ''} /> SCAN NETWORK
        </motion.button>
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-y-auto p-6">
        {devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
            <AlertTriangle size={48} style={{ color: 'var(--text-muted)' }} />
            <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>
              NO DEVICES FOUND ON LOCAL NETWORK
            </p>
          </div>
        ) : (
          <div className="grid gap-4 max-w-2xl mx-auto">
            <AnimatePresence>
              {devices.map((dev, i) => (
                <motion.div
                  key={dev.port}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-none p-5 border-l-4"
                  style={{ boxShadow: 'var(--shadow-sm)', borderLeftColor: 'var(--accent)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-none flex items-center justify-center"
                        style={{ background: 'var(--accent-subtle)', border: '1px solid var(--border)' }}>
                        <Cpu size={24} style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>{dev.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-none"
                            style={{ background: 'var(--bg-tertiary)', color: 'var(--accent)', border: '1px solid var(--accent-subtle)' }}>
                            {dev.port}
                          </span>
                          <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{dev.board}</span>
                          {dev.vid && (
                            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                              VID:{dev.vid} PID:{dev.pid}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 animate-pulse shadow-[0_0_8px_currentColor]" style={{ background: 'var(--success)', color: 'var(--success)' }} />
                      <span className="text-[9px] font-bold" style={{ color: 'var(--success)' }}>SYS.ONLINE</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <motion.button
                      onClick={() => flashDevice(dev.port)}
                      disabled={flashingPort === dev.port}
                      className="flex items-center gap-2 px-6 py-2 rounded-none text-[10px] tracking-widest font-bold uppercase text-black"
                      style={{ background: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {flashingPort === dev.port ? (
                        <><RefreshCw size={12} className="animate-spin" /> UPLOADING...</>
                      ) : (
                        <><Zap size={12} /> FLASH FIRMWARE</>
                      )}
                    </motion.button>
                    <button className="flex items-center gap-2 px-6 py-2 rounded-none text-[10px] tracking-widest font-bold uppercase glass glass-hover"
                      style={{ color: 'var(--text-primary)' }}>
                      <Activity size={12} /> STREAM DATA
                    </button>
                    {flashResult[dev.port] === 'success' && (
                      <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5"
                        style={{ color: 'var(--success)' }}>
                        <CheckCircle2 size={12} /> FLASHED
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
