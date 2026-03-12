/**
 * ResourcePalette — Quick-access palette for datasheets, pinout diagrams, and library docs.
 * Searchable, categorized by component type.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ExternalLink, Cpu, Thermometer, Gauge, Zap, Radio } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  category: string;
  type: 'datasheet' | 'pinout' | 'library' | 'guide';
  url: string;
  description: string;
}

const RESOURCES: Resource[] = [
  { id: 'esp32', name: 'ESP32 Technical Reference', category: 'MCU', type: 'datasheet', url: 'https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf', description: 'Complete ESP32 technical reference manual' },
  { id: 'esp32-pinout', name: 'ESP32 DevKit Pinout', category: 'MCU', type: 'pinout', url: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/hw-reference/esp32/get-started-devkitc.html', description: '30/38-pin DevKit pinout diagram' },
  { id: 'bme280', name: 'BME280 Datasheet', category: 'Sensor', type: 'datasheet', url: 'https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf', description: 'Temperature, humidity, pressure sensor' },
  { id: 'mpu6050', name: 'MPU6050 Datasheet', category: 'Sensor', type: 'datasheet', url: 'https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf', description: '6-axis accelerometer + gyroscope' },
  { id: 'ssd1306', name: 'SSD1306 OLED Datasheet', category: 'Display', type: 'datasheet', url: 'https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf', description: '128x64 OLED display controller' },
  { id: 'nrf24l01', name: 'nRF24L01 Datasheet', category: 'Communication', type: 'datasheet', url: 'https://www.sparkfun.com/datasheets/Components/SMD/nRF24L01Pluss_Preliminary_Product_Specification_v1_0.pdf', description: '2.4GHz wireless transceiver' },
  { id: 'pio-docs', name: 'PlatformIO Documentation', category: 'Tools', type: 'guide', url: 'https://docs.platformio.org/en/latest/', description: 'Build system & library management' },
  { id: 'arduino-ref', name: 'Arduino Language Reference', category: 'Tools', type: 'guide', url: 'https://www.arduino.cc/reference/en/', description: 'Core Arduino functions & syntax' },
  { id: 'adafruit-neopixel', name: 'Adafruit NeoPixel Library', category: 'Library', type: 'library', url: 'https://github.com/adafruit/Adafruit_NeoPixel', description: 'WS2812B addressable LED driver' },
  { id: 'pubsubclient', name: 'PubSubClient (MQTT)', category: 'Library', type: 'library', url: 'https://github.com/knolleary/pubsubclient', description: 'MQTT client for Arduino' },
];

const CATEGORY_ICONS: Record<string, typeof Cpu> = {
  MCU: Cpu,
  Sensor: Thermometer,
  Display: Gauge,
  Communication: Radio,
  Tools: Zap,
  Library: BookOpen,
};

export default function ResourcePalette() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', ...new Set(RESOURCES.map(r => r.category))];

  const filtered = RESOURCES.filter(r => {
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen size={16} style={{ color: 'var(--accent)' }} />
        <h2 className="text-[11px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
          RESOURCE PALETTE
        </h2>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH DATASHEETS, LIBRARIES..."
          className="w-full bg-transparent border rounded-none pl-7 pr-3 py-1.5 text-[9px] tracking-widest uppercase font-mono outline-none"
          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        />
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className="px-2 py-0.5 text-[7px] tracking-widest uppercase font-bold rounded-none border transition-all"
            style={{
              borderColor: selectedCategory === cat ? 'var(--accent)' : 'var(--border)',
              color: selectedCategory === cat ? 'var(--accent)' : 'var(--text-muted)',
              background: selectedCategory === cat ? 'var(--accent-subtle)' : 'transparent',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Resources list */}
      <div className="flex flex-col gap-1">
        {filtered.map((r) => {
          const Icon = CATEGORY_ICONS[r.category] || BookOpen;
          return (
            <motion.a key={r.id}
              href={r.url} target="_blank" rel="noopener noreferrer"
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 px-3 py-2 border rounded-none transition-all hover:bg-white/5"
              style={{ borderColor: 'var(--border)', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <Icon size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <div className="text-[9px] tracking-widest uppercase font-bold truncate">{r.name}</div>
                <div className="text-[7px] tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                  {r.type.toUpperCase()} · {r.description}
                </div>
              </div>
              <ExternalLink size={10} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
