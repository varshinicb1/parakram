/**
 * VerificationSpace — Hardware verification checklist.
 * Users tick features as ✅ working or ❌ broken, with AI improvement suggestions.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, ClipboardCheck, Send } from 'lucide-react';

interface FeatureCheck {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'pass' | 'fail';
  suggestion?: string;
  userNote?: string;
}

const INITIAL_FEATURES: FeatureCheck[] = [
  { id: 'wifi', name: 'WiFi Connection', description: 'Device connects to configured WiFi network', status: 'pending' },
  { id: 'mqtt', name: 'MQTT Communication', description: 'Device publishes telemetry to MQTT broker', status: 'pending' },
  { id: 'sensor_read', name: 'Sensor Reading', description: 'Primary sensor returns valid data', status: 'pending' },
  { id: 'display', name: 'Display Output', description: 'OLED/LCD shows correct information', status: 'pending' },
  { id: 'serial', name: 'Serial Debug', description: 'Debug messages appear on serial monitor', status: 'pending' },
  { id: 'power', name: 'Power Management', description: 'Deep sleep / wake cycles work correctly', status: 'pending' },
  { id: 'ota', name: 'OTA Updates', description: 'Over-the-air firmware update works', status: 'pending' },
  { id: 'error_handling', name: 'Error Recovery', description: 'Device recovers gracefully from errors', status: 'pending' },
];

export default function VerificationSpace() {
  const [features, setFeatures] = useState<FeatureCheck[]>(INITIAL_FEATURES);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});

  const toggleStatus = (id: string, status: 'pass' | 'fail') => {
    setFeatures(prev => prev.map(f => {
      if (f.id === id) {
        const newF = { ...f, status };
        if (status === 'fail') {
          // Generate AI suggestion
          newF.suggestion = generateSuggestion(f.name);
        }
        return newF;
      }
      return f;
    }));
  };

  const generateSuggestion = (featureName: string): string => {
    const suggestions: Record<string, string> = {
      'WiFi Connection': 'CHECK: 1) WiFi credentials in config 2) Signal strength 3) Add retry logic with exponential backoff 4) Log RSSI value',
      'MQTT Communication': 'CHECK: 1) Broker URL/port 2) Client ID uniqueness 3) QoS level 4) Add last-will-testament for disconnect detection',
      'Sensor Reading': 'CHECK: 1) I2C address match 2) Pull-up resistors 3) Initialization delay 4) Add CRC validation for sensor data',
      'Display Output': 'CHECK: 1) I2C bus conflict 2) Display reset pin 3) Font rendering buffer 4) Clear display before write',
      'Serial Debug': 'CHECK: 1) Baud rate mismatch 2) TX/RX pin assignment 3) Buffer overflow 4) Use Serial.flush()',
      'Power Management': 'CHECK: 1) Wake source config 2) RTC memory preservation 3) GPIO hold state 4) Add wake reason logging',
      'OTA Updates': 'CHECK: 1) Partition scheme (min 2 OTA) 2) Flash size 3) HTTPS certificate 4) Add progress callback',
      'Error Recovery': 'CHECK: 1) Watchdog timer config 2) Stack overflow detection 3) Exception handler 4) Add crash counter in NVS',
    };
    return suggestions[featureName] || 'ANALYZE SERIAL OUTPUT FOR ERROR CODES AND UPDATE FIRMWARE ACCORDINGLY';
  };

  const addNote = (id: string) => {
    const note = noteInput[id];
    if (!note) return;
    setFeatures(prev => prev.map(f =>
      f.id === id ? { ...f, userNote: note } : f
    ));
    setNoteInput(prev => ({ ...prev, [id]: '' }));
  };

  const passCount = features.filter(f => f.status === 'pass').length;
  const failCount = features.filter(f => f.status === 'fail').length;
  const totalCount = features.length;

  return (
    <div className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={18} style={{ color: 'var(--accent)' }} />
          <h1 className="text-[13px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
            VERIFICATION LAB
          </h1>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
            <span className="text-[10px] tracking-widest uppercase font-bold" style={{ color: '#22c55e' }}>
              {passCount} PASSED
            </span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle size={14} style={{ color: '#ef4444' }} />
            <span className="text-[10px] tracking-widest uppercase font-bold" style={{ color: '#ef4444' }}>
              {failCount} FAILED
            </span>
          </div>
          <div className="px-3 py-1 border rounded-none" style={{ borderColor: 'var(--accent)' }}>
            <span className="text-[10px] tracking-widest uppercase font-bold" style={{ color: 'var(--accent)' }}>
              {Math.round((passCount / totalCount) * 100)}% VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 rounded-none overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="h-full transition-all duration-500" style={{
          width: `${(passCount / totalCount) * 100}%`,
          background: 'var(--accent)',
          boxShadow: '0 0 10px var(--accent-glow)',
        }} />
      </div>

      {/* Feature checklist */}
      <div className="flex flex-col gap-2">
        {features.map((feature) => (
          <motion.div key={feature.id}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="border rounded-none p-4" style={{
              borderColor: feature.status === 'pass' ? '#22c55e30' :
                           feature.status === 'fail' ? '#ef444430' : 'var(--border)',
              background: 'var(--bg-secondary)',
              borderLeftWidth: '3px',
              borderLeftColor: feature.status === 'pass' ? '#22c55e' :
                              feature.status === 'fail' ? '#ef4444' : 'var(--border)',
            }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[11px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
                  {feature.name}
                </h3>
                <p className="text-[9px] tracking-wider uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {feature.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <motion.button onClick={() => toggleStatus(feature.id, 'pass')}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-none border transition-all"
                  style={{
                    borderColor: feature.status === 'pass' ? '#22c55e' : 'var(--border)',
                    background: feature.status === 'pass' ? '#22c55e20' : 'transparent',
                    color: feature.status === 'pass' ? '#22c55e' : 'var(--text-muted)',
                  }}>
                  <CheckCircle2 size={16} />
                </motion.button>
                <motion.button onClick={() => toggleStatus(feature.id, 'fail')}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-none border transition-all"
                  style={{
                    borderColor: feature.status === 'fail' ? '#ef4444' : 'var(--border)',
                    background: feature.status === 'fail' ? '#ef444420' : 'transparent',
                    color: feature.status === 'fail' ? '#ef4444' : 'var(--text-muted)',
                  }}>
                  <XCircle size={16} />
                </motion.button>
              </div>
            </div>

            {/* AI Suggestion for failed features */}
            {feature.status === 'fail' && feature.suggestion && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3 border rounded-none" style={{ borderColor: '#d9770630', background: '#d9770608' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb size={12} style={{ color: '#d97706' }} />
                  <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: '#d97706' }}>
                    AI IMPROVEMENT SUGGESTION
                  </span>
                </div>
                <p className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  {feature.suggestion}
                </p>
              </motion.div>
            )}

            {/* User note input for failed features */}
            {feature.status === 'fail' && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={noteInput[feature.id] || ''}
                  onChange={(e) => setNoteInput(prev => ({ ...prev, [feature.id]: e.target.value }))}
                  placeholder="ADD OBSERVATION NOTE..."
                  className="flex-1 bg-transparent border rounded-none px-2 py-1 text-[9px] tracking-widest uppercase font-mono outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
                <button onClick={() => addNote(feature.id)}
                  className="p-1 rounded-none border" style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}>
                  <Send size={10} />
                </button>
              </div>
            )}

            {feature.userNote && (
              <div className="mt-2 text-[8px] tracking-wider uppercase font-mono px-2 py-1 border-l-2"
                style={{ borderLeftColor: 'var(--accent)', color: 'var(--text-muted)' }}>
                NOTE: {feature.userNote}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
