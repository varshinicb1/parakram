/**
 * TelemetrySpace — Live charts from connected devices or MQTT.
 * Shows temperature, humidity, pressure in real-time with Recharts.
 */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { HiArrowPath, HiArrowDownTray } from 'react-icons/hi2';
import { Thermometer, Droplets, Gauge, Activity } from 'lucide-react';

interface DataPoint {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

function generateMockData(count: number): DataPoint[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const t = new Date(now - (count - i) * 5000);
    return {
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      temperature: 22 + Math.sin(i * 0.3) * 4 + Math.random() * 1.5,
      humidity: 55 + Math.cos(i * 0.2) * 10 + Math.random() * 3,
      pressure: 1013 + Math.sin(i * 0.15) * 5 + Math.random() * 2,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CHART_CONFIGS: { key: string; label: string; unit: string; color: string; icon: any }[] = [
  { key: 'temperature', label: 'Temperature', unit: '°C', color: '#ff2a6d', icon: Thermometer },
  { key: 'humidity', label: 'Humidity', unit: '%', color: '#05d9e8', icon: Droplets },
  { key: 'pressure', label: 'Pressure', unit: 'hPa', color: '#33ff33', icon: Gauge },
];

export default function TelemetrySpace() {
  const [data, setData] = useState<DataPoint[]>(() => generateMockData(30));
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const lastTemp = last?.temperature ?? 24;
        const lastHum = last?.humidity ?? 55;
        const lastPres = last?.pressure ?? 1013;
        const point: DataPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          temperature: lastTemp + (Math.random() - 0.5) * 1.5,
          humidity: Math.max(20, Math.min(90, lastHum + (Math.random() - 0.5) * 3)),
          pressure: lastPres + (Math.random() - 0.5) * 1,
        };
        return [...prev.slice(-59), point];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  const exportCSV = useCallback(() => {
    const headers = 'Time,Temperature,Humidity,Pressure\n';
    const rows = data.map((d) => `${d.time},${d.temperature.toFixed(1)},${d.humidity.toFixed(1)},${d.pressure.toFixed(1)}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'telemetry.csv'; a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const latest = data[data.length - 1];

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div>
          <h1 className="text-xl font-bold tracking-widest uppercase flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <Activity size={20} style={{ color: 'var(--accent)' }} /> 
            Telemetry Stream
          </h1>
          <p className="text-[10px] mt-1 tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>
            {isLive ? 'SYS.ONLINE' : 'SYS.PAUSED'} • {data.length} SEQ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium glass glass-hover"
            style={{ color: isLive ? 'var(--success)' : 'var(--text-secondary)' }}
            whileHover={{ scale: 1.05 }}>
            <HiArrowPath size={12} className={isLive ? 'animate-spin' : ''} />
            {isLive ? 'Live' : 'Paused'}
          </motion.button>
          <motion.button onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium glass glass-hover"
            style={{ color: 'var(--text-primary)' }}
            whileHover={{ scale: 1.05 }}>
            <HiArrowDownTray size={12} /> Export CSV
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 px-6 py-4">
        {CHART_CONFIGS.map((cfg) => (
          <div key={cfg.key} className="glass rounded-xl px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest uppercase flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <cfg.icon size={14} style={{ color: cfg.color }} /> {cfg.label}
              </span>
              <div className="w-1.5 h-1.5 bg-current animate-pulse shadow-[0_0_10px_currentColor]" style={{ color: cfg.color }} />
            </div>
            <div className="text-2xl font-bold mt-1" style={{ color: cfg.color }}>
              {latest ? (latest[cfg.key as keyof DataPoint] as number).toFixed(1) : '—'}
              <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>{cfg.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 grid gap-4">
        {CHART_CONFIGS.map((cfg) => (
          <div key={cfg.key} className="glass rounded-xl p-4" style={{ minHeight: 160 }}>
            <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              {cfg.label} ({cfg.unit})
            </h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`grad_${cfg.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={cfg.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={40}
                  domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                />
                <Area type="monotone" dataKey={cfg.key} stroke={cfg.color} strokeWidth={2}
                  fill={`url(#grad_${cfg.key})`} dot={false} animationDuration={300} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
