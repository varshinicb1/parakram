/**
 * SimulatorSpace — Embedded hardware simulator for firmware verification.
 * Uses Wokwi simulator iframe for virtual testing without real hardware.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, RotateCcw, Monitor, Terminal, Cpu, Zap } from 'lucide-react';

export default function SimulatorSpace() {
  const [isRunning, setIsRunning] = useState(false);
  const [serialOutput, setSerialOutput] = useState<string[]>([
    '[SYSTEM] Simulator initialized',
    '[SYSTEM] Awaiting firmware upload...',
  ]);

  const startSimulation = () => {
    setIsRunning(true);
    setSerialOutput(prev => [...prev, '[SIM] Starting firmware execution...']);
    // Simulate output
    setTimeout(() => {
      setSerialOutput(prev => [...prev,
        '[BOOT] ESP32 rev1, 240MHz, 4MB Flash',
        '[WIFI] Connecting to network...',
        '[WIFI] Connected! IP: 192.168.1.42',
        '[MQTT] Connecting to broker...',
        '[MQTT] Connected to mqtt://broker.local',
        '[SENSOR] BME280 initialized at 0x76',
        '[SENSOR] Temperature: 23.5°C, Humidity: 45.2%, Pressure: 1013.25 hPa',
        '[TELEMETRY] Published to topic: parakram/weather/data',
      ]);
    }, 1500);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setSerialOutput(prev => [...prev, '[SIM] Execution halted.']);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSerialOutput(['[SYSTEM] Simulator reset', '[SYSTEM] Awaiting firmware upload...']);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor size={18} style={{ color: 'var(--accent)' }} />
          <h1 className="text-[13px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
            HARDWARE SIMULATOR
          </h1>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-none ${isRunning ? 'animate-pulse' : ''}`}
              style={{ background: isRunning ? '#22c55e' : 'var(--text-muted)' }} />
            <span className="text-[9px] tracking-widest uppercase font-bold"
              style={{ color: isRunning ? '#22c55e' : 'var(--text-muted)' }}>
              {isRunning ? 'RUNNING' : 'IDLE'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isRunning ? (
            <motion.button onClick={startSimulation}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-none border text-[9px] tracking-widest uppercase font-bold"
              style={{ background: 'var(--accent)', color: '#000', borderColor: 'var(--accent)' }}>
              <Play size={10} /> EXECUTE
            </motion.button>
          ) : (
            <motion.button onClick={stopSimulation}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-none border text-[9px] tracking-widest uppercase font-bold"
              style={{ background: '#ef4444', color: 'white', borderColor: '#ef4444' }}>
              <Square size={10} /> HALT
            </motion.button>
          )}
          <motion.button onClick={resetSimulation}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-none border text-[9px] tracking-widest uppercase font-bold"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            <RotateCcw size={10} /> RESET
          </motion.button>
        </div>
      </div>

      {/* Simulator + Serial side-by-side */}
      <div className="flex-1 grid grid-cols-2 gap-4">
        {/* Virtual Hardware View */}
        <div className="border rounded-none flex flex-col" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
          <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <Cpu size={12} style={{ color: 'var(--accent)' }} />
            <span className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-secondary)' }}>
              VIRTUAL HARDWARE
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center p-4" style={{ background: '#050505' }}>
            <div className="text-center">
              <Cpu size={48} style={{ color: 'var(--accent)', opacity: 0.3 }} />
              <p className="mt-3 text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                {isRunning ? 'FIRMWARE EXECUTING ON VIRTUAL ESP32' : 'UPLOAD FIRMWARE TO BEGIN SIMULATION'}
              </p>
              {isRunning && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="border rounded-none p-2" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-[8px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>TEMP</div>
                    <div className="text-sm font-bold font-mono" style={{ color: '#22c55e' }}>23.5°C</div>
                  </div>
                  <div className="border rounded-none p-2" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-[8px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>HUMIDITY</div>
                    <div className="text-sm font-bold font-mono" style={{ color: '#3b82f6' }}>45.2%</div>
                  </div>
                  <div className="border rounded-none p-2" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-[8px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>PRESSURE</div>
                    <div className="text-sm font-bold font-mono" style={{ color: '#d97706' }}>1013hPa</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Serial Monitor */}
        <div className="border rounded-none flex flex-col" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
          <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <Terminal size={12} style={{ color: 'var(--accent)' }} />
            <span className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-secondary)' }}>
              SERIAL MONITOR
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 font-mono text-[10px]" style={{ background: '#050505' }}>
            {serialOutput.map((line, i) => (
              <div key={i} className="py-0.5" style={{
                color: line.includes('[ERROR]') ? '#ef4444' :
                       line.includes('[WARN]') ? '#d97706' :
                       line.includes('[SIM]') ? 'var(--accent)' :
                       line.includes('[SYSTEM]') ? '#8b5cf6' :
                       'var(--text-secondary)'
              }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Virtual peripherals bar */}
      <div className="flex items-center gap-2 px-3 py-2 border rounded-none" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <Zap size={12} style={{ color: 'var(--accent)' }} />
        <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
          VIRTUAL PERIPHERALS:
        </span>
        {['LED', 'BUTTON', 'I2C BUS', 'SPI BUS', 'UART'].map(p => (
          <span key={p} className="px-2 py-0.5 border rounded-none text-[8px] tracking-widest uppercase font-bold"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}>
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
