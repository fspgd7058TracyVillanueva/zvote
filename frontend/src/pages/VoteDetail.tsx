import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Typography, Button, Space } from 'antd';

const { Title, Text } = Typography;

export const VoteDetail: React.FC = () => {
  const { id } = useParams();
  return (
    <div style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={3}>Vote Detail</Title>
        <Card>
          <Text>Vote ID: {id}</Text>
          <div style={{ marginTop: 16 }}>
            <Space>
              <Button type="primary"><Link to={`/results/${id}`}>View Results</Link></Button>
              <Button><Link to="/votes">Back</Link></Button>
            </Space>
          </div>
        </Card>
      </Space>
    </div>
  );
};


