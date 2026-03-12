/**
 * GitTimeline — Visual git history with commit messages, diffs, and rollback.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, GitCommit, Tag, Upload } from 'lucide-react';

interface Commit {
  hash: string;
  short_hash: string;
  message: string;
  date: string;
  author: string;
}

export default function GitTimeline() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [releaseVersion, setReleaseVersion] = useState('');

  useEffect(() => {
    // Demo data — in production, fetch from /api/git/history
    setCommits([
      { hash: 'abc1234', short_hash: 'abc1234', message: '[Parakram] Auto-commit firmware update', date: '2026-03-12 10:30:00', author: 'Parakram AI' },
      { hash: 'def5678', short_hash: 'def5678', message: '[Parakram] Added BME280 sensor module', date: '2026-03-12 10:15:00', author: 'Parakram AI' },
      { hash: 'ghi9012', short_hash: 'ghi9012', message: 'Initial commit — Parakram firmware project', date: '2026-03-12 10:00:00', author: 'Parakram AI' },
    ]);
  }, []);

  const createRelease = async () => {
    if (!releaseVersion) return;
    // POST /api/git/release
    setReleaseVersion('');
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch size={16} style={{ color: 'var(--accent)' }} />
          <h2 className="text-[11px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
            VERSION CONTROL
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={releaseVersion}
            onChange={(e) => setReleaseVersion(e.target.value)}
            placeholder="v1.0.0"
            className="w-20 bg-transparent border rounded-none px-2 py-1 text-[9px] tracking-widest uppercase font-mono outline-none"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <button onClick={createRelease}
            className="flex items-center gap-1 px-2 py-1 rounded-none border text-[8px] tracking-widest uppercase font-bold"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            <Tag size={10} /> RELEASE
          </button>
          <button className="flex items-center gap-1 px-2 py-1 rounded-none border text-[8px] tracking-widest uppercase font-bold"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            <Upload size={10} /> PUSH
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col">
        {commits.map((commit, i) => (
          <motion.div key={commit.hash}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 py-3 border-l-2 pl-4 relative"
            style={{ borderLeftColor: i === 0 ? 'var(--accent)' : 'var(--border)' }}>
            {/* Dot */}
            <div className="absolute -left-[5px] top-4 w-2 h-2 rounded-none"
              style={{ background: i === 0 ? 'var(--accent)' : 'var(--border)' }} />
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <GitCommit size={12} style={{ color: 'var(--accent)' }} />
                <span className="text-[10px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-primary)' }}>
                  {commit.message}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[8px] font-mono tracking-wider uppercase" style={{ color: 'var(--accent)' }}>
                  {commit.short_hash}
                </span>
                <span className="text-[8px] tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                  {commit.date}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
