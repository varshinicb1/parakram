/**
 * AdminSpace — User management, subscription controls, platform analytics.
 * Requires admin role. Integrates with /api/admin endpoints.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Users, Activity, Search,
  UserCheck, UserX, BarChart3, TrendingUp, Clock, Database
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  subscription: 'free' | 'pro' | 'enterprise';
  created_at: string;
  last_login: string;
}

interface Analytics {
  total_users: number;
  active_today: number;
  builds_today: number;
  models_used: Record<string, number>;
}

const API_BASE = 'http://localhost:8000';

const ROLE_COLORS: Record<string, string> = {
  admin: '#ef4444',
  moderator: '#d97706',
  user: '#22c55e',
};

const SUB_COLORS: Record<string, string> = {
  enterprise: '#8b5cf6',
  pro: '#3b82f6',
  free: 'var(--text-muted)',
};

type AdminTab = 'users' | 'analytics';

export default function AdminSpace() {
  const [tab, setTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem('parakram_token') || '';

  useEffect(() => {
    loadUsers();
    loadAnalytics();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) { console.error('Failed to load users:', e); }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        setAnalytics(await res.json());
      }
    } catch (e) { console.error('Failed to load analytics:', e); }
  };

  const updateRole = async (userId: string, role: string) => {
    try {
      await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ role }),
      });
      loadUsers();
    } catch (e) { console.error('Failed to update role:', e); }
  };

  const updateSubscription = async (userId: string, subscription: string) => {
    try {
      await fetch(`${API_BASE}/api/admin/users/${userId}/subscription`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ subscription }),
      });
      loadUsers();
    } catch (e) { console.error('Failed to update subscription:', e); }
  };

  const filteredUsers = users.filter(u =>
    !search || u.email.toLowerCase().includes(search.toLowerCase()) || u.role.includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold tracking-widest uppercase flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <Shield size={20} style={{ color: '#ef4444' }} />
            ADMIN CONSOLE
          </h1>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 animate-pulse rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
            <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: '#ef4444' }}>ADMIN ACCESS</span>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex items-center gap-1 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          {([['users', 'USER MANAGEMENT', Users], ['analytics', 'PLATFORM ANALYTICS', BarChart3]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2.5 text-[9px] tracking-widest uppercase font-bold border-b-2 transition-all"
              style={{
                borderBottomColor: tab === id ? '#ef4444' : 'transparent',
                color: tab === id ? '#ef4444' : 'var(--text-muted)',
              }}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            {/* Search */}
            <div className="relative mb-4">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH USERS..."
                className="w-full bg-transparent border rounded-none pl-9 pr-3 py-2 text-[9px] tracking-widest uppercase font-mono outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Users table */}
            <div className="border rounded-none overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              {/* Header row */}
              <div className="grid grid-cols-5 gap-2 px-4 py-2 text-[7px] tracking-widest uppercase font-bold"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <span>EMAIL</span><span>ROLE</span><span>SUBSCRIPTION</span><span>JOINED</span><span>ACTIONS</span>
              </div>

              {/* User rows */}
              {filteredUsers.length === 0 ? (
                <div className="px-4 py-8 text-center text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                  {loading ? 'LOADING USERS...' : 'NO USERS FOUND — CONNECT TO BACKEND'}
                </div>
              ) : filteredUsers.map(user => (
                <motion.div key={user.id}
                  className="grid grid-cols-5 gap-2 px-4 py-3 items-center border-b hover:bg-white/3 transition-all"
                  style={{ borderColor: 'var(--border)' }}
                  whileHover={{ x: 2 }}>
                  {/* Email */}
                  <div className="text-[9px] font-mono tracking-wider truncate" style={{ color: 'var(--text-primary)' }}>
                    {user.email}
                  </div>
                  {/* Role */}
                  <select value={user.role} onChange={(e) => updateRole(user.id, e.target.value)}
                    className="bg-transparent border rounded-none px-1.5 py-1 text-[8px] tracking-widest uppercase font-bold outline-none cursor-pointer"
                    style={{ borderColor: `${ROLE_COLORS[user.role]}40`, color: ROLE_COLORS[user.role] }}>
                    <option value="user">USER</option>
                    <option value="moderator">MODERATOR</option>
                    <option value="admin">ADMIN</option>
                  </select>
                  {/* Subscription */}
                  <select value={user.subscription} onChange={(e) => updateSubscription(user.id, e.target.value)}
                    className="bg-transparent border rounded-none px-1.5 py-1 text-[8px] tracking-widest uppercase font-bold outline-none cursor-pointer"
                    style={{ borderColor: `${SUB_COLORS[user.subscription]}40`, color: SUB_COLORS[user.subscription] }}>
                    <option value="free">FREE</option>
                    <option value="pro">PRO</option>
                    <option value="enterprise">ENTERPRISE</option>
                  </select>
                  {/* Joined */}
                  <span className="text-[8px] font-mono tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-green-500/20 rounded-none" style={{ color: '#22c55e' }} title="Activate">
                      <UserCheck size={11} />
                    </button>
                    <button className="p-1 hover:bg-red-500/20 rounded-none" style={{ color: '#ef4444' }} title="Suspend">
                      <UserX size={11} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-2 text-[8px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              {filteredUsers.length} OPERATORS REGISTERED
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Stats cards */}
            {[
              { label: 'TOTAL USERS', value: analytics?.total_users ?? '—', icon: Users, color: '#3b82f6' },
              { label: 'ACTIVE TODAY', value: analytics?.active_today ?? '—', icon: TrendingUp, color: '#22c55e' },
              { label: 'BUILDS TODAY', value: analytics?.builds_today ?? '—', icon: Activity, color: '#d97706' },
              { label: 'UPTIME', value: '99.9%', icon: Clock, color: '#8b5cf6' },
            ].map(stat => (
              <motion.div key={stat.label}
                className="border rounded-none p-5 flex items-center gap-4"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                whileHover={{ y: -2 }}>
                <div className="w-10 h-10 flex items-center justify-center border rounded-none"
                  style={{ borderColor: `${stat.color}40`, color: stat.color }}>
                  <stat.icon size={18} />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-wider" style={{ color: 'var(--text-primary)' }}>
                    {stat.value}
                  </div>
                  <div className="text-[8px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Model usage chart */}
            <motion.div className="col-span-2 border rounded-none p-5"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Database size={14} style={{ color: 'var(--accent)' }} />
                <h3 className="text-[11px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
                  MODEL USAGE DISTRIBUTION
                </h3>
              </div>
              <div className="space-y-2">
                {Object.entries(analytics?.models_used || { 'DeepSeek V3': 45, 'Qwen3 Coder': 28, 'Gemini 2.5': 15, 'Ollama': 12 })
                  .map(([model, count]) => {
                    const total = Object.values(analytics?.models_used || { a: 45, b: 28, c: 15, d: 12 }).reduce((a, b) => Number(a) + Number(b), 0);
                    const pct = ((Number(count) / Number(total)) * 100).toFixed(0);
                    return (
                      <div key={model} className="flex items-center gap-3">
                        <span className="text-[9px] tracking-widest uppercase font-bold w-32 truncate" style={{ color: 'var(--text-primary)' }}>
                          {model}
                        </span>
                        <div className="flex-1 h-2 rounded-none overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                          <motion.div className="h-full rounded-none" style={{ background: 'var(--accent)', width: `${pct}%` }}
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                        </div>
                        <span className="text-[8px] font-mono w-8 text-right" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
