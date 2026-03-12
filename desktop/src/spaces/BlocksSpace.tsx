/**
 * BlocksSpace — Browse 69+ verified hardware blocks.
 * Searchable grid with category filters.
 */
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sun, Settings, Activity, Monitor, Database, Zap, Lock, Search, Component
} from 'lucide-react';

interface BlockEntry {
  id: string;
  name: string;
  category: string;
  description: string;
}

const BLOCKS: BlockEntry[] = [
  { id: 'bme280', name: 'BME280', category: 'sensor', description: 'Temp, Humidity, Pressure' },
  { id: 'dht22', name: 'DHT22', category: 'sensor', description: 'Temperature & Humidity' },
  { id: 'sht31', name: 'SHT31', category: 'sensor', description: 'High-precision Temp/Hum' },
  { id: 'mpu6050', name: 'MPU6050', category: 'sensor', description: '6-axis IMU' },
  { id: 'max30102', name: 'MAX30102', category: 'sensor', description: 'Heart Rate & SpO2' },
  { id: 'mlx90640', name: 'MLX90640', category: 'sensor', description: 'Thermal Camera 32x24' },
  { id: 'hx711', name: 'HX711', category: 'sensor', description: 'Load Cell Amplifier' },
  { id: 'gps_neo6m', name: 'GPS Neo-6M', category: 'sensor', description: 'GPS + NMEA Parser' },
  { id: 'pir_sensor', name: 'PIR Sensor', category: 'sensor', description: 'Motion Detection' },
  { id: 'ultrasonic_hcsr04', name: 'HC-SR04', category: 'sensor', description: 'Ultrasonic Distance' },
  { id: 'vl53l0x', name: 'VL53L0X', category: 'sensor', description: 'Laser ToF Distance' },
  { id: 'soil_moisture', name: 'Soil Moisture', category: 'sensor', description: 'Analog Soil Sensor' },
  { id: 'dc_motor_l298n', name: 'DC Motor L298N', category: 'actuator', description: 'Dual H-Bridge Motor' },
  { id: 'stepper_a4988', name: 'Stepper A4988', category: 'actuator', description: 'Stepper Driver' },
  { id: 'servo_motor', name: 'Servo Motor', category: 'actuator', description: 'PWM Servo 0-180°' },
  { id: 'relay_module', name: 'Relay Module', category: 'actuator', description: 'AC/DC Relay Switch' },
  { id: 'neopixel_strip', name: 'NeoPixel Strip', category: 'actuator', description: 'WS2812B RGB LEDs' },
  { id: 'led_output', name: 'LED Output', category: 'actuator', description: 'Digital LED Control' },
  { id: 'wifi_station', name: 'WiFi Station', category: 'communication', description: 'WiFi Client Mode' },
  { id: 'mqtt_client', name: 'MQTT Client', category: 'communication', description: 'Pub/Sub Messaging' },
  { id: 'ble_server', name: 'BLE Server', category: 'communication', description: 'Bluetooth LE GATT' },
  { id: 'lora_sx1276', name: 'LoRa SX1276', category: 'communication', description: 'Long Range Radio' },
  { id: 'esp_now_peer', name: 'ESP-NOW', category: 'communication', description: 'P2P Wi-Fi Protocol' },
  { id: 'http_client', name: 'HTTP Client', category: 'communication', description: 'REST API Calls' },
  { id: 'can_bus', name: 'CAN Bus', category: 'communication', description: 'CAN 2.0B Interface' },
  { id: 'i2c_oled', name: 'OLED SSD1306', category: 'display', description: '128x64 I2C Display' },
  { id: 'spi_display', name: 'SPI TFT', category: 'display', description: 'TFT Touch Display' },
  { id: 'epaper', name: 'E-Paper', category: 'display', description: 'E-Ink Display' },
  { id: 'deep_sleep', name: 'Deep Sleep', category: 'power', description: 'Ultra-low Power Mode' },
  { id: 'battery_monitor', name: 'Battery Monitor', category: 'power', description: 'ADC Voltage Monitor' },
  { id: 'ota_update', name: 'OTA Update', category: 'power', description: 'Over-the-Air Firmware' },
  { id: 'sd_card', name: 'SD Card', category: 'storage', description: 'SPI SD Card Logging' },
  { id: 'rfid_rc522', name: 'RFID RC522', category: 'security', description: 'RFID Card Reader' },
  { id: 'fingerprint', name: 'R307 Fingerprint', category: 'security', description: 'Fingerprint Sensor' },
];

const CATEGORIES = ['all', 'sensor', 'actuator', 'communication', 'display', 'power', 'storage', 'security'];
const CATEGORY_COLORS: Record<string, string> = {
  sensor: '#ef4444', actuator: '#f59e0b', communication: '#8b5cf6',
  display: '#06b6d4', power: '#eab308', storage: '#10b981', security: '#ec4899',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CATEGORY_ICONS: Record<string, any> = {
  sensor: Sun, actuator: Settings, communication: Activity,
  display: Monitor, power: Zap, storage: Database, security: Lock,
};

export default function BlocksSpace() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() =>
    BLOCKS.filter((b) => {
      const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'all' || b.category === activeCategory;
      return matchSearch && matchCat;
    }),
  [search, activeCategory]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>🧱 Block Library</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          {BLOCKS.length} verified blocks • Drag to canvas to use
        </p>

        {/* Search */}
        <div className="flex items-center gap-2 mt-3 p-2 rounded max-w-md"
             style={{ border: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks..." className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text-primary)' }} />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: activeCategory === cat ? (CATEGORY_COLORS[cat] || 'var(--accent)') + '20' : 'transparent',
                color: activeCategory === cat ? (CATEGORY_COLORS[cat] || 'var(--accent)') : 'var(--text-muted)',
                border: `1px solid ${activeCategory === cat ? (CATEGORY_COLORS[cat] || 'var(--accent)') + '40' : 'var(--border)'}`,
              }}>
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((block, i) => (
            <motion.div key={block.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="glass glass-hover p-4 cursor-grab active:cursor-grabbing transition-all rounded-[4px]"
              draggable
              onDragStart={(e) => {
                const de = e as unknown as React.DragEvent;
                de.dataTransfer?.setData('application/parakram-block', JSON.stringify(block));
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {(() => {
                  const Icon = CATEGORY_ICONS[block.category] || Component;
                  return <Icon size={16} strokeWidth={2.5} style={{ color: CATEGORY_COLORS[block.category] || 'var(--text-primary)' }} />;
                })()}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{block.name}</div>
                  <div className="text-[10px] font-medium uppercase" style={{ color: CATEGORY_COLORS[block.category] }}>
                    {block.category}
                  </div>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{block.description}</p>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No blocks match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
