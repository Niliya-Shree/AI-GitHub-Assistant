import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import RepoGrid from './components/RepoGrid';
import IssueManager from './components/IssueManager';
import CreateIssueModal from './components/CreateIssueModal';
import McpPlayground from './components/McpPlayground';
import { fetchUserProfile, fetchRepos } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('repos'); // 'repos' | 'issues' | 'playground'
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [username, setUsername] = useState('Niliya-Shree');
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaults, setModalDefaults] = useState({ owner: '', repo: '' });

  useEffect(() => {
    loadUser();
    loadRepos(username);
  }, []);

  const loadUser = async () => {
    try {
      const u = await fetchUserProfile();
      setUser(u);
      if (u.login) {
        setUsername(u.login);
      }
    } catch (err) {
      console.warn('User profile fetch notice:', err.message);
    }
  };

  const loadRepos = async (userToFetch) => {
    setLoadingRepos(true);
    try {
      const data = await fetchRepos(userToFetch);
      setRepos(data.repos || []);
    } catch (err) {
      console.error('Error fetching repos:', err);
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleOpenCreateModal = (owner = '', repo = '') => {
    setModalDefaults({ 
      owner: owner || selectedRepo?.owner || user?.login || username || '', 
      repo: repo || selectedRepo?.name || '' 
    });
    setIsModalOpen(true);
  };

  const handleSelectRepoForIssues = (owner, repoName) => {
    setSelectedRepo({ owner, name: repoName });
    setActiveTab('issues');
  };

  const handleIssueCreated = () => {
    // Refresh repo metrics
    loadRepos(username);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onOpenCreateModal={() => handleOpenCreateModal()} 
      />

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>
        
        {/* Quick Metrics Bar */}
        <StatsOverview repos={repos} user={user} />

        {/* Tab Views */}
        {activeTab === 'repos' && (
          <RepoGrid 
            repos={repos}
            loading={loadingRepos}
            username={username}
            setUsername={setUsername}
            onFetchRepos={loadRepos}
            onSelectRepoForIssues={handleSelectRepoForIssues}
          />
        )}

        {activeTab === 'issues' && (
          <IssueManager 
            repos={repos}
            selectedRepo={selectedRepo}
            setSelectedRepo={setSelectedRepo}
            onOpenCreateModal={handleOpenCreateModal}
          />
        )}

        {activeTab === 'playground' && (
          <McpPlayground />
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
        <p>GitHub AI Assistant Fullstack Dashboard &bull; Powered by React, Vite, Express &amp; Model Context Protocol (MCP)</p>
      </footer>

      {/* Create Issue Modal */}
      <CreateIssueModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultOwner={modalDefaults.owner}
        defaultRepo={modalDefaults.repo}
        onIssueCreated={handleIssueCreated}
      />

    </div>
  );
}
