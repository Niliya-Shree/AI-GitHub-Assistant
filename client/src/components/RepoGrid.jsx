import React, { useState } from 'react';
import { Search, ExternalLink, Star, GitFork, AlertCircle, Code, UserCheck, RefreshCw, FolderGit2 } from 'lucide-react';

export default function RepoGrid({ repos, loading, username, setUsername, onFetchRepos, onSelectRepoForIssues }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRepos = repos.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.language && r.language.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      {/* Top Bar / Search Controls */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Username input */}
        <form 
          onSubmit={(e) => { e.preventDefault(); onFetchRepos(username); }}
          style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: '1 1 300px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <input 
              type="text"
              className="input-field"
              placeholder="Fetch GitHub username repos (e.g. Niliya-Shree)..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', paddingLeft: '38px' }}
            />
            <UserCheck size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Fetching...' : 'Fetch'}
          </button>
        </form>

        {/* Local Search filter */}
        <div style={{ position: 'relative', flex: '1 1 250px' }}>
          <input 
            type="text"
            className="input-field"
            placeholder="Filter loaded repos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '38px' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        </div>

      </div>

      {/* Loading Skeleton / State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={36} style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading Repositories from GitHub API...</p>
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FolderGit2 size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <h3>No repositories found</h3>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>Try searching another username or adjusting your filter query.</p>
        </div>
      ) : (
        /* Repository Cards Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredRepos.map((repo) => (
            <div key={repo.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
              <div>
                {/* Header: Title & Language Badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', wordBreak: 'break-word' }}>
                    {repo.name}
                  </h3>
                  <span className="badge badge-indigo" style={{ flexShrink: 0 }}>
                    <Code size={12} /> {repo.language}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px', minHeight: '42px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {repo.description}
                </p>
              </div>

              {/* Footer Stats & Actions */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} color="var(--accent-amber)" /> {repo.stargazers_count}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GitFork size={14} color="var(--accent-cyan)" /> {repo.forks_count}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: repo.open_issues_count > 0 ? 'var(--accent-rose)' : 'inherit' }}>
                    <AlertCircle size={14} /> {repo.open_issues_count} Issues
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                    onClick={() => onSelectRepoForIssues(repo.owner, repo.name)}
                  >
                    <AlertCircle size={14} /> View Issues
                  </button>

                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ padding: '8px 12px' }}
                    title="View on GitHub"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
