// Vote related types
export interface Vote {
  id: string;
  creator: string;
  title: string;
  description: string;
  options: string[];
  startTime: string;
  endTime: string;
  isActive: boolean;
  isTallied: boolean;
  totalVotes: number;
  hasVoted: boolean;
}

export interface VoteResult {
  voteId: string;
  totalVotes: number;
  optionCounts: number[];
  isTallied: boolean;
  tallyTime: string;
}

export interface EncryptedVote {
  voteId: string;
  voter: string;
  encryptedChoice: string;
  timestamp: string;
}

// Vote creation types
export interface CreateVoteForm {
  title: string;
  description: string;
  options: string[];
  duration: number; // in hours
}

export interface CastVoteForm {
  voteId: string;
  choice: number; // option index
  encryptedChoice: string;
}

// User related types
export interface User {
  address: string;
  isRegistered: boolean;
  totalVotes: number;
  totalCreated: number;
  joinDate: string;
  encryptionKey: string;
}

// Search and filter types
export interface VoteSearchParams {
  query?: string;
  creator?: string;
  status?: 'active' | 'ended' | 'tallied';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface VoteQueryParams {
  searchTerm?: string;
  creator?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

// Statistics types
export interface VoteStats {
  totalVotes: number;
  activeVotes: number;
  endedVotes: number;
  totalParticipants: number;
  averageParticipation: number;
}

// Notification types
export interface Notification {
  id: string;
  type: 'vote' | 'system' | 'security';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

// FHE related types
export interface FHEKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptionResult {
  encryptedData: string;
  keyId: string;
}

export interface DecryptionResult {
  decryptedData: string;
  success: boolean;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Vote status enums
export enum VoteStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  TALLIED = 'tallied',
  CANCELLED = 'cancelled'
}

export enum VoteType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  RANKED_CHOICE = 'ranked_choice'
}

// Wallet connection types
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
}

// Component props types
export interface VoteCardProps {
  vote: Vote;
  onVote: (voteId: string) => void;
  onViewResults: (voteId: string) => void;
  onEdit: (voteId: string) => void;
}

export interface CreateVoteProps {
  onSubmit: (form: CreateVoteForm) => void;
  onCancel: () => void;
}

// Error types
export interface VoteError {
  code: string;
  message: string;
  details?: any;
}

// Configuration types
export interface AppConfig {
  contractAddress: string;
  fheContractAddress: string;
  networkId: number;
  rpcUrl: string;
  apiBaseUrl: string;
}
