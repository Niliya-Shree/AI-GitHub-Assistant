import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, MessageSquare, ExternalLink, PlusCircle, Search, RefreshCw, User } from 'lucide-react';
import { fetchIssues } from '../api';

export default function IssueManager({ repos, selectedRepo, setSelectedRepo, onOpenCreateModal }) {
  const [owner, setOwner] = useState(selectedRepo?.owner || repos[0]?.owner || '');
  const [repo, setRepo] = useState(selectedRepo?.name || repos[0]?.name || '');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterState, setFilterState] = useState('all'); // 'all', 'open', 'closed'
  const [error, setError] = useState('');

  const loadIssues = async (o = owner, r = repo) => {
    if (!o || !r) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchIssues(o, r, 'all');
      setIssues(data.issues || []);
    } catch (err) {
      setError(err.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRepo) {
      setOwner(selectedRepo.owner);
      setRepo(selectedRepo.name);
      loadIssues(selectedRepo.owner, selectedRepo.name);
    } else if (repos.length > 0 && (!owner || !repo)) {
      const firstOwner = repos[0].owner;
      const firstRepo = repos[0].name;
      setOwner(firstOwner);
      setRepo(firstRepo);
      loadIssues(firstOwner, firstRepo);
    }
  }, [selectedRepo, repos]);

  const filteredIssues = issues.filter(i => {
    if (filterState === 'open') return i.state === 'open';
    if (filterState === 'closed') return i.state === 'closed';
    return true;
  });

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (!value) return;
    const [o, r] = value.split('/');
    setOwner(o);
    setRepo(r);
    setSelectedRepo({ owner: o, name: r });
    loadIssues(o, r);
  };

  return (
    <div className="animate-fade-in">
      
      {/* Top Filter Bar */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Repository Selector */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: '1 1 320px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                Select Repository
              </label>
              {repos.length > 0 ? (
                <select 
                  className="select-field" 
                  value={`${owner}/${repo}`} 
                  onChange={handleSelectChange}
                  style={{ width: '100%' }}
                >
                  {repos.map(r => (
                    <option key={r.id} value={`${r.owner}/${r.name}`}>
                      {r.owner} / {r.name} ({r.open_issues_count} open issues)
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Owner" 
                    value={owner} 
                    onChange={e => setOwner(e.target.value)} 
                    style={{ width: '120px' }} 
                  />
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Repo" 
                    value={repo} 
                    onChange={e => setRepo(e.target.value)} 
                    style={{ flex: 1 }} 
                  />
                  <button className="btn btn-secondary" onClick={() => loadIssues(owner, repo)}>Fetch</button>
                </div>
              )}
            </div>

            <button 
              className="btn btn-secondary" 
              onClick={() => loadIssues(owner, repo)} 
              disabled={loading}
              style={{ marginTop: '20px' }}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Issue State Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-input)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '20px' }}>
            <button 
              className={`btn ${filterState === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterState('all')}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              All ({issues.length})
            </button>
            <button 
              className={`btn ${filterState === 'open' ? 'btn-accent' : 'btn-secondary'}`}
              onClick={() => setFilterState('open')}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              Open ({issues.filter(i => i.state === 'open').length})
            </button>
            <button 
              className={`btn ${filterState === 'closed' ? 'btn-secondary' : 'btn-secondary'}`}
              onClick={() => setFilterState('closed')}
              style={{ padding: '6px 14px', fontSize: '0.8rem', background: filterState === 'closed' ? '#334155' : 'transparent' }}
            >
              Closed ({issues.filter(i => i.state === 'closed').length})
            </button>
          </div>

          {/* Create Issue Action */}
          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={() => onOpenCreateModal(owner, repo)}>
              <PlusCircle size={16} /> New Issue
            </button>
          </div>

        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '16px', borderRadius: '12px', color: '#fb7185', marginBottom: '24px' }}>
          ❌ {error}
        </div>
      )}

      {/* Issues List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={36} style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading issues for {owner}/{repo}...</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CheckCircle2 size={48} style={{ margin: '0 auto 16px', opacity: 0.4, color: 'var(--accent-emerald)' }} />
          <h3>No {filterState !== 'all' ? filterState : ''} issues found for {owner}/{repo}</h3>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>You can create a new issue for this repository using the button above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredIssues.map(issue => (
            <div key={issue.id} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              
              {/* Issue Status Icon */}
              <div style={{ marginTop: '2px' }}>
                {issue.state === 'open' ? (
                  <AlertCircle size={20} color="var(--accent-emerald)" />
                ) : (
                  <CheckCircle2 size={20} color="#a855f7" />
                )}
              </div>

              {/* Main Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {issue.title}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    #{issue.number}
                  </span>
                  <span className={`badge ${issue.state === 'open' ? 'badge-emerald' : 'badge-indigo'}`}>
                    {issue.state}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {issue.body || 'No description provided.'}
                </p>

                {/* Metadata Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  {issue.user && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img src={issue.user.avatar_url} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                      {issue.user.login}
                    </span>
                  )}
                  <span>Opened on {new Date(issue.created_at).toLocaleDateString()}</span>
                  {issue.comments > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MessageSquare size={14} /> {issue.comments} comments
                    </span>
                  )}
                </div>
              </div>

              {/* Direct GitHub Link */}
              <a 
                href={issue.html_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
                style={{ padding: '8px 12px' }}
                title="View on GitHub"
              >
                <ExternalLink size={16} />
              </a>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
