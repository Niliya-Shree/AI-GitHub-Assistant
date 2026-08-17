import React from 'react';
import { Github, LayoutDashboard, AlertCircle, Terminal, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenCreateModal }) {
  return (
    <header style={{ borderBottom: '1px solid var(--border-color)', backdropFilter: 'blur(20px)', sticky: 'top', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Github size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              GitHub AI Assistant
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              MCP REST API Server Online
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn ${activeTab === 'repos' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('repos')}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <LayoutDashboard size={16} /> Repositories
          </button>
          
          <button 
            className={`btn ${activeTab === 'issues' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('issues')}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <AlertCircle size={16} /> Issues Manager
          </button>

          <button 
            className={`btn ${activeTab === 'playground' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('playground')}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Terminal size={16} /> MCP Playground
          </button>
        </nav>

        {/* Actions & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-accent" onClick={onOpenCreateModal}>
            <PlusCircle size={16} /> Create Issue
          </button>
          
          {user ? (
            <a href={user.html_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
              <img src={user.avatar_url} alt={user.login} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.login}</span>
            </a>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Connected to GitHub</div>
          )}
        </div>

      </div>
    </header>
  );
}
