/**
 * WorkspaceSpace — VS Code-style code editor with file tree, project creation,
 * MISRA compliance analysis, and intelligent code editing.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Folder, ChevronRight, ChevronDown, Save,
  AlertTriangle, CheckCircle, FileCode, FolderPlus, Shield
} from 'lucide-react';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  extension?: string;
  size?: number;
  children?: FileNode[];
}

interface Project {
  name: string;
  path: string;
  has_platformio: boolean;
  file_count: number;
}

interface MISRAViolation {
  rule: string;
  severity: string;
  line: number;
  message: string;
  suggestion: string;
}

const API = 'http://localhost:8000/api/workspace';
const ANALYSIS_API = 'http://localhost:8000/api/analysis';

export default function WorkspaceSpace() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [modified, setModified] = useState(false);
  const [violations, setViolations] = useState<MISRAViolation[]>([]);
  const [compliance, setCompliance] = useState<{ score: number; grade: string } | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/projects`).then(r => r.json()).then(d => setProjects(d.projects || [])).catch(() => {});
  }, []);

  const loadProject = async (name: string) => {
    setActiveProject(name);
    try {
      const res = await fetch(`${API}/files/${name}`);
      const data = await res.json();
      setFileTree(data.tree || []);
    } catch { /* ignore */ }
  };

  const openFile = async (path: string) => {
    if (!activeProject) return;
    try {
      const res = await fetch(`${API}/files/${activeProject}/read?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      setActiveFile(path);
      setFileContent(data.content || '');
      setModified(false);
      setViolations([]);
      setCompliance(null);
    } catch { /* ignore */ }
  };

  const saveFile = async () => {
    if (!activeProject || !activeFile) return;
    setSaving(true);
    try {
      await fetch(`${API}/files/${activeProject}/write`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: activeFile, content: fileContent }),
      });
      setModified(false);
    } catch { /* ignore */ }
    setSaving(false);
  };

  const runMISRA = async () => {
    if (!fileContent) return;
    try {
      const res = await fetch(`${ANALYSIS_API}/misra/check`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fileContent, filename: activeFile || 'main.cpp' }),
      });
      const data = await res.json();
      setViolations(data.violations || []);
      setCompliance(data.compliance || null);
    } catch { /* ignore */ }
  };

  const createProject = async (template: string) => {
    if (!newProjectName.trim()) return;
    try {
      await fetch(`${API}/projects/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim(), template }),
      });
      setShowNewProject(false);
      setNewProjectName('');
      const res = await fetch(`${API}/projects`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch { /* ignore */ }
  };

  const FileTreeNode = ({ node, depth = 0 }: { node: FileNode; depth?: number }) => {
    const [expanded, setExpanded] = useState(depth < 2);
    const isActive = activeFile === node.path;
    const Icon = node.type === 'directory' ? (expanded ? ChevronDown : ChevronRight) : FileCode;

    return (
      <div>
        <button
          onClick={() => node.type === 'directory' ? setExpanded(!expanded) : openFile(node.path)}
          className="w-full flex items-center gap-1.5 px-2 py-1 text-left text-[9px] tracking-wider font-mono transition-all hover:brightness-125"
          style={{
            paddingLeft: `${8 + depth * 14}px`,
            background: isActive ? 'var(--accent-subtle)' : 'transparent',
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
          }}>
          <Icon size={11} />
          <span className="truncate">{node.name}</span>
        </button>
        {expanded && node.children?.map(child => (
          <FileTreeNode key={child.path} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden animate-fade-in">
      {/* Left: Project Explorer */}
      <div className="w-56 border-r flex flex-col shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-muted)' }}>EXPLORER</span>
          <button onClick={() => setShowNewProject(!showNewProject)} className="p-1 transition-all hover:scale-110" style={{ color: 'var(--accent)' }}>
            <FolderPlus size={13} />
          </button>
        </div>

        {showNewProject && (
          <div className="p-2 border-b space-y-2" style={{ borderColor: 'var(--border)' }}>
            <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)}
              placeholder="Project name..." className="w-full bg-transparent border rounded-none px-2 py-1 text-[9px] font-mono outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <div className="grid grid-cols-2 gap-1">
              {['blank', 'blink', 'sensor', 'iot'].map(t => (
                <button key={t} onClick={() => createProject(t)}
                  className="text-[7px] tracking-widest uppercase font-bold px-2 py-1 border rounded-none transition-all hover:brightness-125"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>{t}</button>
              ))}
            </div>
          </div>
        )}

        {/* Projects list */}
        <div className="flex-1 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-[8px] tracking-widest" style={{ color: 'var(--text-muted)' }}>
              NO PROJECTS<br /><span className="text-[7px]">Create one with + above</span>
            </div>
          ) : (
            projects.map(p => (
              <div key={p.name}>
                <button onClick={() => loadProject(p.name)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[9px] tracking-wider font-bold transition-all hover:brightness-125"
                  style={{
                    background: activeProject === p.name ? 'var(--accent-subtle)' : 'transparent',
                    color: activeProject === p.name ? 'var(--accent)' : 'var(--text-primary)',
                  }}>
                  <Folder size={12} /> {p.name}
                  <span className="ml-auto text-[7px]" style={{ color: 'var(--text-muted)' }}>{p.file_count}f</span>
                </button>
                {activeProject === p.name && fileTree.map(node => (
                  <FileTreeNode key={node.path} node={node} />
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Center: Code Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeFile && (
          <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-2">
              <FileCode size={11} style={{ color: 'var(--accent)' }} />
              <span className="text-[9px] tracking-wider font-mono" style={{ color: 'var(--text-primary)' }}>
                {activeFile} {modified && <span style={{ color: '#f59e0b' }}>●</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button onClick={saveFile} disabled={saving || !modified}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-2 py-1 text-[7px] tracking-widest uppercase font-bold border rounded-none disabled:opacity-30"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                <Save size={10} /> {saving ? 'SAVING...' : 'SAVE'}
              </motion.button>
              <motion.button onClick={runMISRA}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-2 py-1 text-[7px] tracking-widest uppercase font-bold border rounded-none"
                style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>
                <Shield size={10} /> MISRA CHECK
              </motion.button>
            </div>
          </div>
        )}

        {activeFile ? (
          <textarea value={fileContent}
            onChange={e => { setFileContent(e.target.value); setModified(true); }}
            className="flex-1 resize-none p-4 font-mono text-[11px] leading-relaxed outline-none"
            style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            spellCheck={false}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col gap-3">
            <FileCode size={40} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
            <p className="text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>SELECT A FILE TO EDIT</p>
          </div>
        )}
      </div>

      {/* Right: MISRA Compliance Panel */}
      {violations.length > 0 && (
        <div className="w-72 border-l overflow-y-auto shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
          <div className="p-3 border-b space-y-2" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: 'var(--text-muted)' }}>MISRA COMPLIANCE</span>
              {compliance && (
                <span className="text-lg font-black"
                  style={{ color: compliance.score >= 75 ? '#22c55e' : compliance.score >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {compliance.grade}
                </span>
              )}
            </div>
            {compliance && (
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
                <div className="h-full rounded-full transition-all" style={{
                  width: `${compliance.score}%`,
                  background: compliance.score >= 75 ? '#22c55e' : compliance.score >= 50 ? '#f59e0b' : '#ef4444',
                }} />
              </div>
            )}
          </div>
          {violations.map((v, i) => (
            <div key={i} className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-1.5 mb-0.5">
                {v.severity === 'error' ? <AlertTriangle size={10} style={{ color: '#ef4444' }} /> :
                 v.severity === 'warning' ? <AlertTriangle size={10} style={{ color: '#f59e0b' }} /> :
                 <CheckCircle size={10} style={{ color: '#3b82f6' }} />}
                <span className="text-[7px] tracking-widest uppercase font-bold"
                  style={{ color: v.severity === 'error' ? '#ef4444' : v.severity === 'warning' ? '#f59e0b' : '#3b82f6' }}>
                  Rule {v.rule} · Line {v.line}
                </span>
              </div>
              <p className="text-[8px] tracking-wider" style={{ color: 'var(--text-primary)' }}>{v.message}</p>
              <p className="text-[7px] tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>💡 {v.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
