import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Typography, Button } from 'antd';

const { Title } = Typography;

export const VoteResults: React.FC = () => {
  const { id } = useParams();
  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <Title level={3}>Vote Results</Title>
      <Card>
        <p>Vote ID: {id}</p>
        <Button><Link to={`/vote/${id}`}>Back</Link></Button>
      </Card>
    </div>
  );
};


