/**
 * AuthSpace — Login, Signup, Password Reset UI.
 * JWT-based authentication integrated with backend /api/auth endpoints.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, KeyRound, Mail, Lock, Eye, EyeOff, ArrowRight, Check, AlertCircle, Hexagon } from 'lucide-react';

type AuthView = 'login' | 'signup' | 'reset';

const API_BASE = 'http://localhost:8000';

export default function AuthSpace() {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('All fields required'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('parakram_token', data.token);
        localStorage.setItem('parakram_user', JSON.stringify(data.user));
        setSuccess('Authentication successful. Welcome back.');
      } else {
        setError(data.detail || 'Invalid credentials');
      }
    } catch { setError('Connection failed — is backend running?'); }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) { setError('All fields required'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be 8+ characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('parakram_token', data.token);
        localStorage.setItem('parakram_user', JSON.stringify(data.user));
        setSuccess('Account created successfully.');
      } else {
        setError(data.detail || 'Signup failed');
      }
    } catch { setError('Connection failed'); }
    setLoading(false);
  };

  const handleReset = async () => {
    if (!email) { setError('Email required'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSuccess('Password reset link sent to your email.');
      } else {
        const data = await res.json();
        setError(data.detail || 'Reset failed');
      }
    } catch { setError('Connection failed'); }
    setLoading(false);
  };

  const switchView = (v: AuthView) => { setView(v); setError(''); setSuccess(''); };

  return (
    <div className="flex-1 flex items-center justify-center animate-fade-in">
      <motion.div
        className="w-full max-w-md border rounded-none p-8"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Hexagon size={32} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
          <h1 className="text-xl font-bold tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
            {view === 'login' ? 'AUTHENTICATE' : view === 'signup' ? 'CREATE ACCOUNT' : 'RESET ACCESS'}
          </h1>
          <p className="text-[9px] tracking-widest uppercase mt-1" style={{ color: 'var(--text-muted)' }}>
            {view === 'login' ? 'ENTER CREDENTIALS TO ACCESS COMMAND CENTER' :
             view === 'signup' ? 'REGISTER A NEW OPERATOR ACCOUNT' :
             'RECOVER YOUR ACCESS CREDENTIALS'}
          </p>
        </div>

        {/* View tabs */}
        <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          {([['login', 'LOGIN', LogIn], ['signup', 'REGISTER', UserPlus], ['reset', 'RESET', KeyRound]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => switchView(id)}
              className="flex items-center gap-1.5 px-3 py-2 text-[8px] tracking-widest uppercase font-bold border-b-2 transition-all"
              style={{
                borderBottomColor: view === id ? 'var(--accent)' : 'transparent',
                color: view === id ? 'var(--accent)' : 'var(--text-muted)',
              }}>
              <Icon size={11} /> {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          {/* Email */}
          <div className="relative">
            <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="OPERATOR EMAIL"
              className="w-full bg-transparent border rounded-none pl-9 pr-3 py-2.5 text-[10px] tracking-widest uppercase font-mono outline-none focus:border-[var(--accent)] transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Password */}
          {view !== 'reset' && (
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="ACCESS KEY"
                className="w-full bg-transparent border rounded-none pl-9 pr-9 py-2.5 text-[10px] tracking-widest uppercase font-mono outline-none focus:border-[var(--accent)] transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          )}

          {/* Confirm Password */}
          {view === 'signup' && (
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="CONFIRM ACCESS KEY"
                className="w-full bg-transparent border rounded-none pl-9 pr-3 py-2.5 text-[10px] tracking-widest uppercase font-mono outline-none focus:border-[var(--accent)] transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          )}

          {/* Error / Success */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-2 border rounded-none text-[8px] tracking-widest uppercase font-bold"
                style={{ borderColor: '#ef444440', color: '#ef4444', background: '#ef444410' }}>
                <AlertCircle size={11} /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-2 border rounded-none text-[8px] tracking-widest uppercase font-bold"
                style={{ borderColor: '#22c55e40', color: '#22c55e', background: '#22c55e10' }}>
                <Check size={11} /> {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            onClick={view === 'login' ? handleLogin : view === 'signup' ? handleSignup : handleReset}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 rounded-none text-[10px] tracking-widest uppercase font-bold text-black disabled:opacity-40 transition-all"
            style={{ background: 'var(--accent)', boxShadow: '0 0 15px var(--accent-glow)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'PROCESSING...' : (
              <>{view === 'login' ? 'AUTHENTICATE' : view === 'signup' ? 'CREATE ACCOUNT' : 'SEND RESET LINK'} <ArrowRight size={12} /></>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
