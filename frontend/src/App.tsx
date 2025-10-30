import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, Layout, Space } from 'antd';
import { WalletProvider } from './contexts/WalletContext';
import { WalletConnection } from './components/WalletConnection';
import { VoteList } from './pages/VoteList';
import { CreateVote } from './pages/CreateVote';
import { VoteDetail } from './pages/VoteDetail';
import { VoteResults } from './pages/VoteResults';
import { MyVotes } from './pages/MyVotes';
import { Settings } from './pages/Settings';
import './App.css';

const { Header, Content } = Layout;

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Main application component
const AppContent: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: 0, color: '#2563EB' }}>
            FHEVote
          </h1>
          <span style={{ marginLeft: 16, color: '#666' }}>
            Privacy-Preserving Voting System
          </span>
        </div>
        
        <Space>
          <WalletConnection />
        </Space>
      </Header>

      <Content>
        <Routes>
          <Route path="/" element={<VoteList />} />
          <Route path="/votes" element={<VoteList />} />
          <Route path="/create" element={<CreateVote />} />
          <Route path="/vote/:id" element={<VoteDetail />} />
          <Route path="/results/:id" element={<VoteResults />} />
          <Route path="/my-votes" element={<MyVotes />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Content>
    </Layout>
  );
};

// Root component
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#2563EB',
            borderRadius: 8,
          },
        }}
      >
        <WalletProvider>
          <Router>
            <AppContent />
          </Router>
        </WalletProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
