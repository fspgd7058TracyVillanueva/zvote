import React, { useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Space,
  Typography,
  Button,
  Input,
  Select,
  Pagination,
  Empty,
  Spin,
  Statistic,
  Tag,
  message
} from 'antd';
import {
  PlusOutlined,
  PieChartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { VoteCard } from '../components/VoteCard';
import { mockApi } from '../services/api';
import { Vote } from '../types';
import { useWallet } from '../contexts/WalletContext';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

export const VoteList: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Mock data for demonstration
  const { data: voteData, isLoading } = useQuery({
    queryKey: ['votes', searchTerm, filterStatus, currentPage],
    queryFn: () => mockApi.getVotes({ 
      query: searchTerm, 
      status: filterStatus === 'all' ? undefined : (filterStatus as 'active' | 'ended' | 'tallied'), 
      page: currentPage, 
      pageSize 
    }),
    enabled: isConnected,
  });

  const votes: Vote[] = (voteData?.data as Vote[]) || [];
  const totalVotes = voteData?.total || 0;

  // Calculate statistics
  const activeVotes = votes.filter(vote => vote.isActive).length;
  const endedVotes = votes.filter(vote => !vote.isActive && !vote.isTallied).length;
  const talliedVotes = votes.filter(vote => vote.isTallied).length;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateVote = () => {
    if (!isConnected) {
      message.warning('Please connect your wallet first');
      return;
    }
    navigate('/create');
  };

  const handleVote = (voteId: string) => {
    navigate(`/vote/${voteId}`);
  };

  const handleViewResults = (voteId: string) => {
    navigate(`/results/${voteId}`);
  };

  const handleEdit = (_voteId: string) => {
    // Only creator can edit
    message.info('Edit functionality coming soon');
  };

  if (!isConnected) {
    return (
      <Content style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <Empty
            image={<PieChartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
            description={
              <Space direction="vertical" size={16}>
                <Title level={4}>Connect Your Wallet</Title>
                <Text type="secondary">
                  Please connect your MetaMask wallet to participate in encrypted voting
                </Text>
                <Button type="primary" size="large">
                  Connect Wallet
                </Button>
              </Space>
            }
          />
        </Card>
      </Content>
    );
  }

  return (
    <Content style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* Header Section */}
        <Card
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 16,
            border: 'none',
            overflow: 'hidden',
          }}
        >
          <Row gutter={24} align="middle">
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={16}>
                <Title level={2} style={{ color: '#FFFFFF', margin: 0 }}>
                  FHEVote Platform
                </Title>
                <Text style={{ color: '#F3F4F6', fontSize: 16 }}>
                  Participate in privacy-preserving encrypted voting. All votes are protected by 
                  Fully Homomorphic Encryption technology, ensuring complete privacy.
                </Text>
                <Space size={12}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={handleCreateVote}
                    style={{
                      background: '#FFFFFF',
                      color: '#764ba2',
                      border: 'none',
                      height: 44,
                    }}
                  >
                    Create Vote
                  </Button>
                  <Button
                    size="large"
                    ghost
                    style={{
                      color: '#FFFFFF',
                      borderColor: '#FFFFFF',
                      height: 44,
                    }}
                    onClick={() => navigate('/my-votes')}
                  >
                    My Votes
                  </Button>
                </Space>
              </Space>
            </Col>
            <Col xs={24} lg={8}>
              <div style={{ textAlign: 'center' }}>
                <PieChartOutlined style={{ fontSize: 120, color: '#FFFFFF', opacity: 0.8 }} />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Statistics */}
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Votes"
                value={totalVotes}
                prefix={<PieChartOutlined />}
                valueStyle={{ color: '#2563EB' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active"
                value={activeVotes}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Ended"
                value={endedVotes}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tallied"
                value={talliedVotes}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Search and Filter */}
        <Card>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search votes..."
                allowClear
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={filterStatus}
                onChange={handleFilterChange}
                style={{ width: '100%' }}
                options={[
                  { value: 'all', label: 'All Votes' },
                  { value: 'active', label: 'Active' },
                  { value: 'ended', label: 'Ended' },
                  { value: 'tallied', label: 'Tallied' },
                ]}
              />
            </Col>
            <Col xs={24} sm={24} md={10}>
              <Space>
                <Text type="secondary">Privacy Protection:</Text>
                <Tag color="green">FHE Encryption</Tag>
                <Tag color="blue">Zero-Knowledge</Tag>
                <Tag color="purple">Homomorphic Tallying</Tag>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Vote List */}
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Title level={3} style={{ margin: 0 }}>
              Available Votes
            </Title>
            <Text type="secondary">
              {totalVotes} votes total
            </Text>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : votes && votes.length > 0 ? (
            <>
              <div className="vote-list">
                {votes.map((vote) => (
                  <VoteCard
                    key={vote.id}
                    vote={vote}
                    onVote={handleVote}
                    onViewResults={handleViewResults}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Pagination
                  current={currentPage}
                  total={totalVotes}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                />
              </div>
            </>
          ) : (
            <Card>
              <Empty
                description="No votes found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={handleCreateVote}>
                  Create First Vote
                </Button>
              </Empty>
            </Card>
          )}
        </div>
      </Space>
    </Content>
  );
};
