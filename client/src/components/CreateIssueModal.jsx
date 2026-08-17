import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, ExternalLink, RefreshCw } from 'lucide-react';
import { createIssue } from '../api';

export default function CreateIssueModal({ isOpen, onClose, defaultOwner = '', defaultRepo = '', onIssueCreated }) {
  const [owner, setOwner] = useState(defaultOwner);
  const [repo, setRepo] = useState(defaultRepo);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { success: boolean, message: string, url?: string }

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!owner || !repo || !title) {
      setStatus({ success: false, message: 'Please fill in Owner, Repo, and Issue Title.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await createIssue(owner, repo, title, body);
      
      // Parse the output message text if available
      const contentText = res.result?.content?.[0]?.text || 'Issue created successfully!';
      const matchUrl = contentText.match(/https:\/\/github\.com\/[^\s)]+/);
      const url = matchUrl ? matchUrl[0] : null;

      setStatus({
        success: true,
        message: contentText,
        url: url,
      });

      if (onIssueCreated) {
        onIssueCreated({ owner, repo, title });
      }
    } catch (err) {
      setStatus({ success: false, message: err.message || 'Failed to create issue.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '540px', padding: '32px', position: 'relative' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '10px', borderRadius: '10px', color: 'var(--accent-primary)' }}>
            <PlusCircle size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Create New GitHub Issue</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Using backend MCP createIssue tool</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Repository Owner *</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Niliya-Shree"
                value={owner}
                onChange={e => setOwner(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Repository Name *</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. blogger"
                value={repo}
                onChange={e => setRepo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Issue Title *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Fix authentication token expiration bug"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Issue Description (Body)</label>
            <textarea 
              className="textarea-field" 
              rows={4}
              placeholder="Provide context, reproduction steps, or details..."
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>

          {/* Status Alert */}
          {status && (
            <div style={{ 
              background: status.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${status.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              padding: '14px',
              borderRadius: '10px',
              color: status.success ? '#34d399' : '#fb7185',
              marginBottom: '20px',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                {status.success ? <CheckCircle2 size={16} /> : <X size={16} />}
                {status.success ? 'Issue Created Successfully' : 'Error Creating Issue'}
              </div>
              <p style={{ marginTop: '4px', whiteSpace: 'pre-wrap' }}>{status.message}</p>
              {status.url && (
                <a href={status.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: '#67e8f9', fontWeight: 600 }}>
                  View Created Issue on GitHub <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Creating...
                </>
              ) : (
                'Submit Issue'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
