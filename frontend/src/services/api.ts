import axios from 'axios';
import { 
  Vote, 
  CreateVoteForm, 
  CastVoteForm, 
  VoteSearchParams, 
  PaginatedResponse,
  ApiResponse,
  VoteResult
} from '../types';

// Mock API base URL - in production this would be your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development
const mockVotes: Vote[] = [
  {
    id: '1',
    creator: '0x1234567890123456789012345678901234567890',
    title: 'Community Governance Proposal',
    description: 'Should we implement the new FHE voting mechanism for all future community decisions?',
    options: ['Yes', 'No', 'Abstain'],
    startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours from now
    isActive: true,
    isTallied: false,
    totalVotes: 15,
    hasVoted: false
  },
  {
    id: '2',
    creator: '0x2345678901234567890123456789012345678901',
    title: 'Project Funding Allocation',
    description: 'How should we allocate the Q4 budget for development priorities?',
    options: ['Frontend Development', 'Smart Contract Security', 'FHE Research', 'Marketing'],
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), // 12 hours from now
    isActive: true,
    isTallied: false,
    totalVotes: 8,
    hasVoted: true
  },
  {
    id: '3',
    creator: '0x3456789012345678901234567890123456789012',
    title: 'Token Distribution Model',
    description: 'Which token distribution model should we adopt for the FHEVote platform?',
    options: ['Linear Distribution', 'Quadratic Distribution', 'Merit-based Distribution'],
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isActive: false,
    isTallied: true,
    totalVotes: 42,
    hasVoted: false
  },
  {
    id: '4',
    creator: '0x4567890123456789012345678901234567890123',
    title: 'Platform Feature Priority',
    description: 'What should be our top priority for the next development sprint?',
    options: ['Mobile App', 'Advanced FHE Features', 'User Interface Improvements', 'API Integration'],
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isActive: false,
    isTallied: false,
    totalVotes: 28,
    hasVoted: true
  },
  {
    id: '5',
    creator: '0x5678901234567890123456789012345678901234',
    title: 'Security Audit Partner',
    description: 'Which security firm should we partner with for our smart contract audit?',
    options: ['ConsenSys Diligence', 'OpenZeppelin', 'Trail of Bits', 'Quantstamp'],
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isActive: false,
    isTallied: true,
    totalVotes: 35,
    hasVoted: false
  }
];

// Mock API functions
export const mockApi = {
  // Get votes with search and filter
  async getVotes(params: VoteSearchParams): Promise<PaginatedResponse<Vote>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredVotes = [...mockVotes];
    
    // Apply search filter
    if (params.query) {
      const searchLower = params.query.toLowerCase();
      filteredVotes = filteredVotes.filter(vote => 
        vote.title.toLowerCase().includes(searchLower) ||
        vote.description.toLowerCase().includes(searchLower) ||
        vote.creator.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (params.status === 'active') {
      filteredVotes = filteredVotes.filter(vote => vote.isActive);
    } else if (params.status === 'ended') {
      filteredVotes = filteredVotes.filter(vote => !vote.isActive && !vote.isTallied);
    } else if (params.status === 'tallied') {
      filteredVotes = filteredVotes.filter(vote => vote.isTallied);
    }
    
    // Apply pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedVotes = filteredVotes.slice(startIndex, endIndex);
    
    return {
      data: paginatedVotes,
      total: filteredVotes.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredVotes.length / pageSize)
    };
  },

  // Get single vote by ID
  async getVote(id: string): Promise<Vote> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const vote = mockVotes.find(v => v.id === id);
    if (!vote) {
      throw new Error('Vote not found');
    }
    
    return vote;
  },

  // Create new vote
  async createVote(voteData: CreateVoteForm): Promise<ApiResponse<Vote>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newVote: Vote = {
      id: Date.now().toString(),
      creator: 'current_user_address', // In real app, get from wallet context
      title: voteData.title,
      description: voteData.description,
      options: voteData.options,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + voteData.duration * 60 * 60 * 1000).toISOString(),
      isActive: true,
      isTallied: false,
      totalVotes: 0,
      hasVoted: false
    };
    
    mockVotes.unshift(newVote);
    
    return {
      data: newVote,
      success: true,
      message: 'Vote created successfully'
    };
  },

  // Cast vote
  async castVote(voteData: CastVoteForm): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const vote = mockVotes.find(v => v.id === voteData.voteId);
    if (vote) {
      vote.totalVotes++;
      vote.hasVoted = true;
    }
    
    return {
      data: undefined,
      success: true,
      message: 'Vote cast successfully'
    };
  },

  // Get vote results
  async getVoteResults(voteId: string): Promise<ApiResponse<VoteResult>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const vote = mockVotes.find(v => v.id === voteId);
    if (!vote) {
      throw new Error('Vote not found');
    }
    
    const result: VoteResult = {
      voteId: vote.id,
      totalVotes: vote.totalVotes,
      optionCounts: vote.options.map((_, index) => Math.floor(Math.random() * vote.totalVotes)),
      isTallied: vote.isTallied,
      tallyTime: vote.isTallied ? new Date().toISOString() : ''
    };
    
    return {
      data: result,
      success: true
    };
  },

  // Get user's votes
  async getUserVotes(userAddress: string): Promise<ApiResponse<Vote[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userVotes = mockVotes.filter(vote => vote.creator === userAddress);
    
    return {
      data: userVotes,
      success: true
    };
  },

  // Get user statistics
  async getUserStats(): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stats = {
      totalVotes: mockVotes.length,
      activeVotes: mockVotes.filter(v => v.isActive).length,
      endedVotes: mockVotes.filter(v => !v.isActive && !v.isTallied).length,
      talliedVotes: mockVotes.filter(v => v.isTallied).length,
      totalParticipants: 150 // Mock data
    };
    
    return {
      data: stats,
      success: true
    };
  }
};

// Real API functions (for production)
export const api = {
  // Get votes
  async getVotes(params: VoteSearchParams): Promise<PaginatedResponse<Vote>> {
    const response = await http.get('/votes', { params });
    return response.data;
  },

  // Get single vote
  async getVote(id: string): Promise<Vote> {
    const response = await http.get(`/votes/${id}`);
    return response.data;
  },

  // Create vote
  async createVote(voteData: CreateVoteForm): Promise<ApiResponse<Vote>> {
    const response = await http.post('/votes', voteData);
    return response.data;
  },

  // Cast vote
  async castVote(voteData: CastVoteForm): Promise<ApiResponse<void>> {
    const response = await http.post('/votes/cast', voteData);
    return response.data;
  },

  // Get vote results
  async getVoteResults(voteId: string): Promise<ApiResponse<VoteResult>> {
    const response = await http.get(`/votes/${voteId}/results`);
    return response.data;
  },

  // Get user votes
  async getUserVotes(userAddress: string): Promise<ApiResponse<Vote[]>> {
    const response = await http.get(`/users/${userAddress}/votes`);
    return response.data;
  },

  // Get user statistics
  async getUserStats(): Promise<ApiResponse<any>> {
    const response = await http.get('/users/stats');
    return response.data;
  }
};

// Use mock API in development, real API in production
const isDevelopment = import.meta.env.DEV || true; // Force mock for now
export default isDevelopment ? mockApi : api;
