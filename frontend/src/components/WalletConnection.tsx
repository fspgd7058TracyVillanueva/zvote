import React from 'react';
import { Button, Space, Typography, message } from 'antd';
import { WalletOutlined, DisconnectOutlined } from '@ant-design/icons';
import { useWallet } from '../contexts/WalletContext';

const { Text } = Typography;

export const WalletConnection: React.FC = () => {
  const { 
    isConnected, 
    address, 
    balance, 
    connect, 
    disconnect, 
    isLoading, 
    error 
  } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
      message.success('Wallet connected successfully!');
    } catch (err) {
      message.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    message.info('Wallet disconnected');
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string) => {
    const num = parseFloat(bal);
    return num.toFixed(4);
  };

  if (isConnected && address) {
    return (
      <Space>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {balance && `${formatBalance(balance)} ETH`}
          </div>
          <Text code style={{ fontSize: '12px' }}>
            {formatAddress(address)}
          </Text>
        </div>
        <Button
          type="primary"
          danger
          size="small"
          icon={<DisconnectOutlined />}
          onClick={handleDisconnect}
        >
          Disconnect
        </Button>
      </Space>
    );
  }

  return (
    <Button
      type="primary"
      icon={<WalletOutlined />}
      loading={isLoading}
      onClick={handleConnect}
    >
      Connect Wallet
    </Button>
  );
};
