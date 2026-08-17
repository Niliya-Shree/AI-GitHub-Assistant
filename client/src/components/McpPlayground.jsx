import React, { useState, useEffect } from 'react';
import { Terminal, Play, CheckCircle2, Code2, RefreshCw, Layers } from 'lucide-react';
import { fetchMcpTools, executeMcpTool } from '../api';

export default function McpPlayground() {
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [paramsInput, setParamsInput] = useState('{}');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const data = await fetchMcpTools();
      setTools(data.tools || []);
      if (data.tools && data.tools.length > 0) {
        selectTool(data.tools[0]);
      }
    } catch (err) {
      setError('Failed to fetch MCP tools list.');
    }
  };

  const selectTool = (t) => {
    setSelectedTool(t);
    setResult(null);
    setError('');

    // Default sample parameters based on tool
    if (t.name === 'hello') {
      setParamsInput(JSON.stringify({ name: 'GitHub Developer' }, null, 2));
    } else if (t.name === 'listRepos') {
      setParamsInput(JSON.stringify({ username: 'Niliya-Shree' }, null, 2));
    } else if (t.name === 'listIssues') {
      setParamsInput(JSON.stringify({ owner: 'Niliya-Shree', repo: 'blogger' }, null, 2));
    } else if (t.name === 'createIssue') {
      setParamsInput(JSON.stringify({ owner: 'Niliya-Shree', repo: 'blogger', title: 'Sample Issue from MCP Playground', body: 'Testing execution' }, null, 2));
    } else {
      setParamsInput('{}');
    }
  };

  const handleExecute = async () => {
    if (!selectedTool) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(paramsInput);
      } catch (e) {
        throw new Error('Invalid JSON input parameters format.');
      }

      const res = await executeMcpTool(selectedTool.name, parsedParams);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Execution error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))', padding: '12px', borderRadius: '12px', color: '#fff' }}>
          <Terminal size={26} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>MCP Tool Live Playground</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Directly test and execute Model Context Protocol (MCP) server tools over REST API.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        
        {/* Tools Sidebar Selector */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={16} /> Available Tools ({tools.length})
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tools.map(t => (
              <button
                key={t.name}
                onClick={() => selectTool(t)}
                className={`btn ${selectedTool?.name === t.name ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '12px 14px', fontSize: '0.9rem' }}
              >
                <Code2 size={16} />
                <div>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    {t.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Workspace: Params & Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tool Details & Input Editor */}
          {selectedTool && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {selectedTool.name}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {selectedTool.description}
                  </p>
                </div>

                <button className="btn btn-accent" onClick={handleExecute} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Executing...
                    </>
                  ) : (
                    <>
                      <Play size={16} /> Execute Tool
                    </>
                  )}
                </button>
              </div>

              {/* JSON Parameter Editor */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Input Arguments (JSON)</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Edit input parameters</span>
                </label>
                <textarea 
                  className="textarea-field"
                  rows={6}
                  value={paramsInput}
                  onChange={e => setParamsInput(e.target.value)}
                  style={{ fontFamily: 'var(--font-code)', fontSize: '0.9rem', color: '#67e8f9' }}
                />
              </div>
            </div>
          )}

          {/* Execution Error */}
          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '16px', borderRadius: '12px', color: '#fb7185' }}>
              ❌ {error}
            </div>
          )}

          {/* Result Inspector */}
          {result && (
            <div className="glass-card animate-fade-in" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)' }}>
                <CheckCircle2 size={18} /> Tool Execution Output
              </h4>

              <pre style={{ 
                background: '#090d16', 
                border: '1px solid var(--border-color)', 
                borderRadius: '10px', 
                padding: '16px', 
                overflowX: 'auto', 
                color: '#e2e8f0', 
                fontSize: '0.88rem',
                maxHeight: '350px'
              }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
