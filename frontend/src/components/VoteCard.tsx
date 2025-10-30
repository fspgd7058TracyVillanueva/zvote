import React from 'react';
import { Card, Space, Typography, Button, Tag, Progress, Avatar } from 'antd';
import { 
  PieChartOutlined, 
  UserOutlined, 
  ClockCircleOutlined,
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Vote, VoteCardProps } from '../types';

const { Text, Title } = Typography;

export const VoteCard: React.FC<VoteCardProps> = ({
  vote,
  onVote,
  onViewResults,
  onEdit
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'ended': return 'orange';
      case 'tallied': return 'blue';
      default: return 'default';
    }
  };

  const getStatusText = (vote: Vote) => {
    const now = new Date();
    const startTime = new Date(vote.startTime);
    const endTime = new Date(vote.endTime);
    
    if (now < startTime) return 'Not Started';
    if (now > endTime) return vote.isTallied ? 'Tallied' : 'Ended';
    return 'Active';
  };

  const getProgress = (vote: Vote) => {
    const now = new Date();
    const startTime = new Date(vote.startTime);
    const endTime = new Date(vote.endTime);
    const total = endTime.getTime() - startTime.getTime();
    const elapsed = now.getTime() - startTime.getTime();
    
    if (now < startTime) return 0;
    if (now > endTime) return 100;
    return Math.min(100, (elapsed / total) * 100);
  };

  const handleVote = () => {
    onVote(vote.id);
  };

  const handleViewResults = () => {
    onViewResults(vote.id);
  };

  const handleEdit = () => {
    onEdit(vote.id);
  };

  const status = getStatusText(vote);
  const progress = getProgress(vote);

  return (
    <Card
      hoverable
      className={`vote-card ${vote.isActive ? 'active' : ''}`}
      style={{
        marginBottom: 16,
        borderLeft: vote.isActive ? '4px solid #52c41a' : '4px solid transparent',
        backgroundColor: vote.isActive ? '#f6ffed' : '#fff'
      }}
      actions={[
        vote.isActive && !vote.hasVoted ? (
          <Button
            key="vote"
            type="primary"
            icon={<PieChartOutlined />}
            onClick={handleVote}
          >
            Vote Now
          </Button>
        ) : null,
        <Button
          key="results"
          type="default"
          icon={<EyeOutlined />}
          onClick={handleViewResults}
        >
          View Results
        </Button>,
        <Button
          key="edit"
          type="text"
          icon={<EditOutlined />}
          onClick={handleEdit}
        >
          Edit
        </Button>
      ].filter(Boolean)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Avatar 
          icon={<PieChartOutlined />} 
          style={{ 
            backgroundColor: vote.isActive ? '#52c41a' : '#d9d9d9',
            flexShrink: 0
          }} 
        />
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: 8 
          }}>
            <Space>
              <Title level={5} style={{ margin: 0 }}>
                {vote.title}
              </Title>
              <Tag color={getStatusColor(status.toLowerCase())}>
                {status}
              </Tag>
              {vote.hasVoted && (
                <Tag color="blue" icon={<CheckCircleOutlined />}>
                  Voted
                </Tag>
              )}
            </Space>
            
            <Space>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <ClockCircleOutlined /> {formatTime(vote.startTime)}
              </Text>
            </Space>
          </div>
          
          <Text 
            type="secondary" 
            style={{ 
              fontSize: 14,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
              marginBottom: 12
            }}
          >
            {vote.description}
          </Text>

          <div style={{ marginBottom: 12 }}>
            <Text strong style={{ fontSize: 12, color: '#666' }}>
              Options: {vote.options.length} • Votes: {vote.totalVotes}
            </Text>
          </div>

          {vote.isActive && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 4
              }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Time Remaining
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {Math.round(progress)}%
                </Text>
              </div>
              <Progress 
                percent={progress} 
                size="small" 
                status={progress > 90 ? 'exception' : 'active'}
                showInfo={false}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
