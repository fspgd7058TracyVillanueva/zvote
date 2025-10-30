# FHEVote - Privacy-Preserving Voting System

## Project Overview
FHEVote is a revolutionary decentralized voting platform that leverages Fully Homomorphic Encryption (FHE) technology to ensure complete privacy and security in democratic processes. All votes remain encrypted during transmission, storage, and even during tallying operations, providing unprecedented privacy protection for voters.

## Key Features

### 🔐 Privacy & Security
- **End-to-End FHE Encryption**: All votes are encrypted using Fully Homomorphic Encryption
- **Zero-Knowledge Proofs**: Verify voting eligibility without revealing identity
- **Homomorphic Tallying**: Count votes without decrypting individual ballots
- **Decentralized Identity**: Voter identities managed on blockchain
- **MetaMask Integration**: Seamless wallet-based authentication

### 🗳️ Voting Features
- **Encrypted Ballots**: Cast votes that remain encrypted throughout the process
- **Privacy-Preserving Tallying**: Count votes without revealing individual choices
- **Real-time Results**: View encrypted vote counts and final results
- **Vote Verification**: Verify your vote was counted without revealing your choice
- **Multi-option Polls**: Support for various voting mechanisms (single choice, ranked choice, etc.)

### 🚀 Technical Features
- **FHE-Powered**: Built on Zama's fhEVM for homomorphic operations
- **Blockchain Storage**: Decentralized vote storage on Ethereum
- **No Traditional Database**: Relies on blockchain and IPFS for data persistence
- **Modern UI**: Built with React, TypeScript, and Ant Design
- **Responsive Design**: Optimized for all screen sizes

## Technology Stack

### Smart Contracts
- **Solidity ^0.8.24**: Smart contract development
- **OpenZeppelin**: Secure contract libraries
- **Zama fhEVM**: Fully Homomorphic Encryption
- **Hardhat**: Development and deployment framework

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Ant Design**: Professional UI components
- **Vite**: Fast build tool
- **Ethers.js**: Blockchain interaction
- **React Query**: State management

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **No Database**: Blockchain-only storage
- **FHE Integration**: Homomorphic encryption services

## Project Structure

```
FHEVote/
├── contracts/              # Smart contracts
│   ├── src/               # Contract source code
│   │   ├── FHEVote.sol    # Main voting contract
│   │   ├── FHEVoteBase.sol # FHE utilities
│   │   └── VoteFactory.sol # Vote creation factory
│   ├── scripts/           # Deployment scripts
│   ├── hardhat.config.js  # Hardhat configuration
│   └── package.json       # Contract dependencies
├── frontend/              # React frontend
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── contexts/      # React contexts
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/               # Node.js backend
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
└── docs/                  # Documentation
```

## Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Git
- Ethereum Sepolia testnet ETH

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd FHEVote
```

2. **Install dependencies**
```bash
# Install smart contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Configure environment variables**
```bash
# Copy example environment file
cp env.example .env

# Edit .env with your configuration
# Required: SEPOLIA_RPC_URL, PRIVATE_KEY, VITE_FHE_ORACLE_ADDRESS
```

4. **Deploy smart contracts**
```bash
cd contracts
npm run compile
npm run deploy:sepolia
```

5. **Start the development servers**
```bash
# Start backend (Terminal 1)
cd backend
npm start

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

6. **Open the application**
- Navigate to `http://localhost:3000`
- Connect your MetaMask wallet
- Start creating and participating in encrypted votes!

## Usage Guide

### Getting Started
1. **Connect Wallet**: Click "Connect Wallet" to link your MetaMask
2. **Create Vote**: Click "Create Vote" to start a new voting session
3. **Cast Encrypted Vote**: Your vote will be encrypted using FHE before submission
4. **View Results**: See encrypted vote counts and final results

### Key Features
- **Encrypted Storage**: All votes are stored encrypted on the blockchain
- **Privacy-Preserving Tallying**: Count votes without revealing individual choices
- **Secure Voting**: Only eligible voters can participate
- **Decentralized**: No central authority controls the voting process

## Network Support

### Testnet
- **Ethereum Sepolia**: Primary testnet for development and testing
- **FHE Oracle**: Zama's FHE Oracle for homomorphic operations

### Mainnet
- Coming soon with full production deployment

## Security Features

### Encryption
- **FHE Technology**: Fully Homomorphic Encryption for all operations
- **256-bit Keys**: Strong encryption key management
- **Zero-Knowledge**: Operations without data exposure

### Privacy
- **End-to-End**: Complete encryption from voter to final tally
- **Homomorphic Tallying**: Count votes without decryption
- **Decentralized**: No central data storage

## Development

### Smart Contracts
```bash
cd contracts
npm run compile      # Compile contracts
npm run test         # Run tests
npm run deploy:sepolia # Deploy to Sepolia
```

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
cd backend
npm start            # Start production server
npm run dev          # Start development server
```

## Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- **Documentation**: Check the docs/ folder
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join our community discussions

## Roadmap

### Phase 1 (Current)
- ✅ Basic FHE voting system
- ✅ MetaMask integration
- ✅ Encrypted vote storage
- ✅ Privacy-preserving tallying

### Phase 2 (Upcoming)
- 🔄 Advanced FHE operations
- 🔄 Mobile app
- 🔄 Multi-option voting
- 🔄 Vote delegation

### Phase 3 (Future)
- 📋 Mainnet deployment
- 📋 Enterprise features
- 📋 API integrations
- 📋 Advanced analytics

---

**Note**: This is a demonstration project. Please do not use real funds for testing in production environments.
