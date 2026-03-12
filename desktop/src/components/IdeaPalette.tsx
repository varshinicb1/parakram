/**
 * IdeaPalette — AI-powered project suggestions based on current hardware graph.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  components: string[];
}

const STARTER_IDEAS: Idea[] = [
  {
    id: '1', title: 'Add Deep Sleep Mode', difficulty: 'intermediate',
    description: 'Reduce power consumption by 99.5% with ESP32 deep sleep. Wake via timer or GPIO interrupt.',
    components: ['ESP32', 'RTC'],
  },
  {
    id: '2', title: 'OTA Firmware Updates', difficulty: 'intermediate',
    description: 'Enable wireless firmware updates via WiFi. No more USB cables for deployment.',
    components: ['ESP32', 'WiFi', 'HTTP Server'],
  },
  {
    id: '3', title: 'MQTT Telemetry Dashboard', difficulty: 'beginner',
    description: 'Stream sensor data to a cloud MQTT broker. Visualize in real-time with a web dashboard.',
    components: ['ESP32', 'WiFi', 'MQTT', 'Sensor'],
  },
  {
    id: '4', title: 'Multi-Sensor Fusion', difficulty: 'advanced',
    description: 'Combine IMU, barometer, and GPS using a Kalman filter for precise positioning.',
    components: ['MPU6050', 'BMP280', 'GPS Module'],
  },
  {
    id: '5', title: 'BLE Beacon Scanner', difficulty: 'beginner',
    description: 'Scan for nearby Bluetooth Low Energy beacons and log their RSSI signal strength.',
    components: ['ESP32', 'BLE'],
  },
  {
    id: '6', title: 'Watchdog Timer Recovery', difficulty: 'intermediate',
    description: 'Add hardware watchdog to automatically reset the MCU if firmware hangs.',
    components: ['ESP32', 'WDT'],
  },
  {
    id: '7', title: 'NeoPixel Status Ring', difficulty: 'beginner',
    description: 'Use addressable WS2812B LEDs to show system status, WiFi strength, and alerts.',
    components: ['ESP32', 'WS2812B', 'NeoPixel Library'],
  },
  {
    id: '8', title: 'Encrypted Communication', difficulty: 'advanced',
    description: 'Use TLS/SSL for all WiFi communications. Store certs in SPIFFS partition.',
    components: ['ESP32', 'WiFi', 'mbedTLS'],
  },
];

const DIFFICULTY_COLORS = {
  beginner: '#22c55e',
  intermediate: '#d97706',
  advanced: '#ef4444',
};

export default function IdeaPalette() {
  const [ideas] = useState<Idea[]>(STARTER_IDEAS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} style={{ color: '#d97706' }} />
          <h2 className="text-[11px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
            IDEA PALETTE
          </h2>
        </div>
        <button className="flex items-center gap-1 px-2 py-1 rounded-none border text-[8px] tracking-widest uppercase font-bold"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          <RefreshCw size={9} /> GENERATE MORE
        </button>
      </div>

      <p className="text-[8px] tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
        AI-POWERED SUGGESTIONS TO ENHANCE YOUR FIRMWARE PROJECT
      </p>

      {/* Ideas grid */}
      <div className="grid grid-cols-2 gap-2">
        {ideas.map((idea) => (
          <motion.button key={idea.id}
            onClick={() => setSelectedId(selectedId === idea.id ? null : idea.id)}
            whileHover={{ scale: 1.01 }}
            className="text-left border rounded-none p-3 transition-all"
            style={{
              borderColor: selectedId === idea.id ? 'var(--accent)' : 'var(--border)',
              background: selectedId === idea.id ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
            }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Sparkles size={10} style={{ color: DIFFICULTY_COLORS[idea.difficulty] }} />
                <span className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
                  {idea.title}
                </span>
              </div>
              <span className="px-1 py-0.5 text-[6px] tracking-widest uppercase font-bold rounded-none border shrink-0"
                style={{ color: DIFFICULTY_COLORS[idea.difficulty], borderColor: `${DIFFICULTY_COLORS[idea.difficulty]}40` }}>
                {idea.difficulty}
              </span>
            </div>
            <p className="mt-1.5 text-[8px] tracking-wider uppercase leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {idea.description}
            </p>
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {idea.components.map(c => (
                <span key={c} className="px-1.5 py-0.5 text-[6px] tracking-widest uppercase font-bold border rounded-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  {c}
                </span>
              ))}
            </div>
            {selectedId === idea.id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-2 flex items-center gap-1 text-[8px] tracking-widest uppercase font-bold"
                style={{ color: 'var(--accent)' }}>
                <ArrowRight size={9} /> ADD TO PROJECT
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
