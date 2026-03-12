/**
 * InstallerSpace — Toolchain & library auto-installer engine UI.
 * Manages PlatformIO, ESP-IDF, Arduino CLI, and library installations.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download, Package, Wrench, Check, Loader2,
  HardDrive
} from 'lucide-react';

interface Toolchain {
  id: string;
  name: string;
  description: string;
  version: string;
  installed: boolean;
  installing: boolean;
  size: string;
}

interface Library {
  id: string;
  name: string;
  author: string;
  version: string;
  description: string;
  installed: boolean;
  installing: boolean;
}

export default function InstallerSpace() {
  const [activeTab, setActiveTab] = useState<'toolchains' | 'libraries'>('toolchains');

  const [toolchains, setToolchains] = useState<Toolchain[]>([
    { id: 'pio', name: 'PlatformIO Core', description: 'Multi-platform build system for embedded development', version: '6.1.15', installed: true, installing: false, size: '280 MB' },
    { id: 'esp-idf', name: 'ESP-IDF', description: 'Espressif IoT Development Framework (official)', version: '5.2.1', installed: false, installing: false, size: '1.2 GB' },
    { id: 'arduino-cli', name: 'Arduino CLI', description: 'Arduino command-line interface for builds and uploads', version: '1.0.4', installed: false, installing: false, size: '45 MB' },
    { id: 'gcc-arm', name: 'ARM GCC Toolchain', description: 'GNU Arm Embedded Toolchain for Cortex-M/R processors', version: '13.2', installed: false, installing: false, size: '450 MB' },
    { id: 'openocd', name: 'OpenOCD', description: 'Open On-Chip Debugger for JTAG/SWD debugging', version: '0.12.0', installed: false, installing: false, size: '25 MB' },
    { id: 'stm32cube', name: 'STM32CubeMX', description: 'STMicroelectronics MCU configuration and code generator', version: '6.10', installed: false, installing: false, size: '800 MB' },
  ]);

  const [libraries, setLibraries] = useState<Library[]>([
    { id: 'wifi', name: 'WiFi', author: 'Arduino', version: '1.2.7', description: 'WiFi connectivity library', installed: true, installing: false },
    { id: 'wire', name: 'Wire (I2C)', author: 'Arduino', version: '2.0.0', description: 'I2C communication protocol', installed: true, installing: false },
    { id: 'spi', name: 'SPI', author: 'Arduino', version: '2.0.0', description: 'SPI communication protocol', installed: true, installing: false },
    { id: 'adafruit-bme280', name: 'Adafruit BME280', author: 'Adafruit', version: '2.2.4', description: 'BME280 temperature/humidity/pressure sensor driver', installed: false, installing: false },
    { id: 'pubsubclient', name: 'PubSubClient', author: 'Nick O\'Leary', version: '2.8', description: 'MQTT client for Arduino', installed: false, installing: false },
    { id: 'adafruit-neopixel', name: 'Adafruit NeoPixel', author: 'Adafruit', version: '1.12.3', description: 'WS2812B addressable LED driver', installed: false, installing: false },
    { id: 'arduinojson', name: 'ArduinoJSON', author: 'Benoit Blanchon', version: '7.1.0', description: 'JSON serialization/deserialization', installed: false, installing: false },
    { id: 'fastled', name: 'FastLED', author: 'Daniel Garcia', version: '3.7.0', description: 'High-performance LED animation library', installed: false, installing: false },
    { id: 'esp-async-webserver', name: 'ESPAsyncWebServer', author: 'Me-No-Dev', version: '1.2.7', description: 'Async HTTP/WebSocket server for ESP', installed: false, installing: false },
    { id: 'tft-espi', name: 'TFT_eSPI', author: 'Bodmer', version: '2.5.43', description: 'High-performance TFT LCD display library', installed: false, installing: false },
  ]);

  const [installProgress, setInstallProgress] = useState<Record<string, number>>({});

  const simulateInstall = (id: string, type: 'toolchain' | 'library') => {
    if (type === 'toolchain') {
      setToolchains(prev => prev.map(t => t.id === id ? { ...t, installing: true } : t));
    } else {
      setLibraries(prev => prev.map(l => l.id === id ? { ...l, installing: true } : l));
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (type === 'toolchain') {
          setToolchains(prev => prev.map(t => t.id === id ? { ...t, installing: false, installed: true } : t));
        } else {
          setLibraries(prev => prev.map(l => l.id === id ? { ...l, installing: false, installed: true } : l));
        }
      }
      setInstallProgress(prev => ({ ...prev, [id]: progress }));
    }, 300);
  };

  const installAllLibraries = () => {
    libraries.filter(l => !l.installed && !l.installing).forEach(l => {
      simulateInstall(l.id, 'library');
    });
  };

  const installedToolchains = toolchains.filter(t => t.installed).length;
  const installedLibraries = libraries.filter(l => l.installed).length;

  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold tracking-widest uppercase flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <Download size={20} style={{ color: 'var(--accent)' }} />
            UNIVERSAL INSTALLER
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
              {installedToolchains}/{toolchains.length} TOOLCHAINS · {installedLibraries}/{libraries.length} LIBRARIES
            </span>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex items-center gap-1 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          {([['toolchains', 'TOOLCHAINS', Wrench], ['libraries', 'LIBRARIES', Package]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-4 py-2.5 text-[9px] tracking-widest uppercase font-bold border-b-2 transition-all"
              style={{
                borderBottomColor: activeTab === id ? 'var(--accent)' : 'transparent',
                color: activeTab === id ? 'var(--accent)' : 'var(--text-muted)',
              }}>
              <Icon size={13} /> {label}
            </button>
          ))}
          {activeTab === 'libraries' && (
            <button onClick={installAllLibraries}
              className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-none border text-[8px] tracking-widest uppercase font-bold"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              <Download size={10} /> INSTALL ALL
            </button>
          )}
        </div>

        {/* Toolchains */}
        {activeTab === 'toolchains' && (
          <div className="flex flex-col gap-2">
            {toolchains.map(tc => (
              <motion.div key={tc.id}
                className="border rounded-none p-4 flex items-center gap-4 transition-all"
                style={{ borderColor: tc.installed ? 'var(--accent)' : 'var(--border)', background: 'var(--bg-secondary)' }}
                whileHover={{ x: 2 }}>
                <div className="w-10 h-10 flex items-center justify-center border rounded-none"
                  style={{ borderColor: tc.installed ? 'var(--accent)' : 'var(--border)', color: tc.installed ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {tc.installed ? <Check size={18} /> : <HardDrive size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>{tc.name}</span>
                    <span className="text-[7px] font-mono px-1.5 py-0.5 border rounded-none" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>v{tc.version}</span>
                    <span className="text-[7px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{tc.size}</span>
                  </div>
                  <p className="text-[8px] tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>{tc.description}</p>
                  {tc.installing && (
                    <div className="mt-2 h-1 rounded-none overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                      <motion.div className="h-full" style={{ background: 'var(--accent)', width: `${installProgress[tc.id] || 0}%` }}
                        animate={{ width: `${installProgress[tc.id] || 0}%` }} />
                    </div>
                  )}
                </div>
                {tc.installed ? (
                  <span className="text-[8px] tracking-widest uppercase font-bold flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                    <Check size={10} /> INSTALLED
                  </span>
                ) : tc.installing ? (
                  <span className="text-[8px] tracking-widest uppercase font-bold flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                    <Loader2 size={10} className="animate-spin" /> {(installProgress[tc.id] || 0).toFixed(0)}%
                  </span>
                ) : (
                  <motion.button onClick={() => simulateInstall(tc.id, 'toolchain')}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-none border text-[8px] tracking-widest uppercase font-bold"
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                    <Download size={10} /> INSTALL
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Libraries */}
        {activeTab === 'libraries' && (
          <div className="flex flex-col gap-1">
            {libraries.map(lib => (
              <motion.div key={lib.id}
                className="border rounded-none px-4 py-3 flex items-center gap-3 transition-all"
                style={{ borderColor: lib.installed ? 'var(--accent)' : 'var(--border)', background: 'var(--bg-secondary)' }}
                whileHover={{ x: 2 }}>
                <div className="w-7 h-7 flex items-center justify-center border rounded-none"
                  style={{ borderColor: lib.installed ? 'var(--accent)' : 'var(--border)', color: lib.installed ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {lib.installed ? <Check size={14} /> : <Package size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>{lib.name}</span>
                    <span className="text-[7px] font-mono" style={{ color: 'var(--text-muted)' }}>v{lib.version} · {lib.author}</span>
                  </div>
                  <p className="text-[7px] tracking-wider" style={{ color: 'var(--text-muted)' }}>{lib.description}</p>
                  {lib.installing && (
                    <div className="mt-1 h-0.5 rounded-none overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                      <motion.div className="h-full" style={{ background: 'var(--accent)', width: `${installProgress[lib.id] || 0}%` }}
                        animate={{ width: `${installProgress[lib.id] || 0}%` }} />
                    </div>
                  )}
                </div>
                {lib.installed ? (
                  <Check size={12} style={{ color: 'var(--accent)' }} />
                ) : lib.installing ? (
                  <Loader2 size={12} className="animate-spin" style={{ color: 'var(--accent)' }} />
                ) : (
                  <button onClick={() => simulateInstall(lib.id, 'library')}
                    className="text-[8px] tracking-widest uppercase font-bold hover:underline" style={{ color: 'var(--accent)' }}>
                    INSTALL
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
