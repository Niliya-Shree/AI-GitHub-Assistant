// API Client helper for GitHub Dashboard

export async function fetchUserProfile() {
  const res = await fetch('/api/user');
  if (!res.ok) throw new Error(`User fetch error: ${res.statusText}`);
  return res.json();
}

export async function fetchRepos(username = '') {
  const url = username ? `/api/repos?username=${encodeURIComponent(username)}` : '/api/repos';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Repos fetch error: ${res.statusText}`);
  return res.json();
}

export async function fetchIssues(owner, repo, state = 'all') {
  const res = await fetch(`/api/issues?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&state=${state}`);
  if (!res.ok) throw new Error(`Issues fetch error: ${res.statusText}`);
  return res.json();
}

export async function createIssue(owner, repo, title, body) {
  const res = await fetch('/api/issues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, repo, title, body }),
  });
  if (!res.ok) throw new Error(`Create issue error: ${res.statusText}`);
  return res.json();
}

export async function fetchMcpTools() {
  const res = await fetch('/api/mcp/tools');
  if (!res.ok) throw new Error(`MCP tools fetch error: ${res.statusText}`);
  return res.json();
}

export async function executeMcpTool(toolName, params) {
  const res = await fetch('/api/mcp/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolName, params }),
  });
  if (!res.ok) throw new Error(`Tool execution error: ${res.statusText}`);
  return res.json();
}
