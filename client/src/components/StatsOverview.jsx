import React from 'react';
import { FolderGit2, Star, GitFork, AlertCircle, ShieldCheck } from 'lucide-react';

export default function StatsOverview({ repos, user }) {
  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
  const totalIssues = repos.reduce((acc, r) => acc + (r.open_issues_count || 0), 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '12px', borderRadius: '12px', color: 'var(--accent-primary)' }}>
          <FolderGit2 size={24} />
        </div>
        <div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{repos.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Repositories</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: '12px', color: 'var(--accent-amber)' }}>
          <Star size={24} />
        </div>
        <div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{totalStars}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Stars</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '12px', borderRadius: '12px', color: 'var(--accent-cyan)' }}>
          <GitFork size={24} />
        </div>
        <div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{totalForks}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Forks</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '12px', borderRadius: '12px', color: 'var(--accent-rose)' }}>
          <AlertCircle size={24} />
        </div>
        <div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{totalIssues}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Open Issues</div>
        </div>
      </div>

    </div>
  );
}
