import axios, { AxiosError, AxiosInstance } from 'axios';

// API Configuration from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '8453', 10); // Base chain
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface CoinMetadata {
  name: string;
  description: string;
  image: string;
  creator: string;
}

export interface Coin {
  __typename?: string;
  id?: string;
  address: string;
  name: string;
  symbol: string;
  description?: string;
  tokenUri?: string;
  chainId?: number;
  totalSupply: string;
  totalVolume?: string;
  volume24h?: string;
  marketCap: string;
  marketCapDelta24h?: string;
  createdAt?: string;
  creatorAddress?: string;
  platformReferrerAddress?: string;
  payoutRecipientAddress?: string;
  uniqueHolders?: number; // Backend uses uniqueHolders, not holders
  holders?: number; // Keep for backward compatibility
  tokenPrice?: {
    priceInUsdc: string | null;
    currencyAddress: string;
    priceInPoolToken: string;
  };
  poolCurrencyToken?: {
    address: string;
    name: string;
    decimals: number;
  };
  creatorProfile?: {
    __typename: string;
    id: string;
    handle: string;
    avatar: {
      previewImage: {
        blurhash: string | null;
        medium: string;
        small: string;
      };
    } | null;
    socialAccounts?: {
      instagram: any | null;
      tiktok: any | null;
      twitter: any | null;
      farcaster: any | null;
    };
    creatorCoin?: {
      address: string;
    };
  };
  mediaContent?: {
    mimeType: string;
    originalUri: string;
    previewImage?: {
      small: string;
      medium: string;
      blurhash: string;
    };
  };
  uniswapV4PoolKey?: {
    token0Address: string;
    token1Address: string;
    fee: number;
    tickSpacing: number;
    hookAddress: string;
  };
  // Legacy fields for backward compatibility
  metadata?: CoinMetadata;
  price?: string;
  priceChange24h?: number;
  creator?: {
    address: string;
    profile: any;
  };
}

export interface Holder {
  balance: string;
  ownerAddress: string;
  ownerProfile: {
    __typename: 'GraphQLAccountProfile' | 'GraphQLWalletProfile';
    id: string;
    handle: string;
    avatar: {
      previewImage: {
        blurhash: string | null;
        medium: string;
        small: string;
      };
    } | null;
  };
}

export interface Swap {
  id: string;
  currencyAmountWithPrice: {
    priceUsdc: string;
    currencyAmount: {
      currencyAddress: string;
      amountDecimal: number;
    };
  };
  senderAddress: string;
  recipientAddress: string;
  transactionHash: string;
  coinAmount: string;
  blockTimestamp: string;
  activityType: 'BUY' | 'SELL';
  senderProfile: {
    __typename: 'GraphQLAccountProfile' | 'GraphQLWalletProfile';
    id: string;
    handle: string;
    avatar: {
      previewImage: {
        blurhash: string | null;
        medium: string;
        small: string;
      };
    } | null;
  };
  __typename: string;
}

export interface Comment {
  commentId: string;
  nonce: string;
  userAddress: string;
  txHash: string;
  comment: string;
  timestamp: number;
  userProfile: {
    id: string;
    handle: string;
    avatar: {
      previewImage: {
        blurhash: string | null;
        small: string;
        medium: string;
      };
    } | null;
  };
  replies: {
    count: number;
    edges: any[];
  };
}

export interface Profile {
  id: string;
  handle: string;
  displayName: string | null;
  bio: string | null;
  username: string;
  website: string | null;
  avatar: {
    previewImage: {
      blurhash: string | null;
      medium: string;
      small: string;
    };
    small: string;
    medium: string;
    blurhash: string | null;
  } | null;
  publicWallet: {
    walletAddress: string;
  };
  socialAccounts: {
    instagram: { username: string; displayName: string } | null;
    tiktok: { username: string; displayName: string } | null;
    twitter: { username: string; displayName: string; id: string | null } | null;
    farcaster: { username: string; displayName: string } | null;
  };
  linkedWallets: {
    edges: Array<{
      node: {
        walletType: string;
        walletAddress: string;
      };
    }>;
  };
  creatorCoin: {
    address: string;
    marketCap: string;
    marketCapDelta24h: string;
  } | null;
}

export interface User {
  id: string;
  walletAddress: string;
  nonce?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface ProfileCoin extends Omit<Coin, 'creatorProfile'> {
  creatorProfile: {
    __typename: string;
    id: string;
    handle: string;
    avatar: {
      previewImage: {
        blurhash: string | null;
        medium: string;
        small: string;
      };
    } | null;
    socialAccounts: {
      instagram: any;
      tiktok: any;
      twitter: any;
      farcaster: any;
    };
    creatorCoin: {
      address: string;
    } | null;
  };
}

export interface CoinBalance {
  balance: string;
  id: string;
  coin: ProfileCoin;
}

export interface Balance {
  coin: {
    address: string;
    name: string;
    symbol: string;
  };
  balance: string;
  value: string;
}

export interface TradeParams {
  sell: {
    type: 'eth' | 'erc20';
    address?: string;
  };
  buy: {
    type: 'eth' | 'erc20';
    address?: string;
  };
  amountIn: string;
  slippage?: number;
  recipient?: string;
  permitActiveSeconds?: number;
}

export interface TradeResponse {
  transaction: {
    to: string;
    data: string;
    value: string;
  };
  expectedOutput: string;
  minimumOutput: string;
  priceImpact: number;
  permitRequired?: boolean;
}

export interface CreateCoinParams {
  name: string;
  symbol: string;
  description: string;
  imageUri: string;
  currency: 'ZORA' | 'ETH' | 'CREATOR_COIN' | 'CREATOR_COIN_OR_ZORA';
  startingMarketCap: 'LOW' | 'HIGH';
  chainId?: number;
  platformReferrer?: string;
  additionalOwners?: string[];
  payoutRecipientOverride?: string;
}

export interface ScheduledCoin {
  id: string;
  scheduledFor: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  coinParams: CreateCoinParams & { metadataUri: string };
  createdAt: string;
  executedAt?: string;
  transactionHash?: string;
  coinAddress?: string;
  error?: string;
  retries: number;
  maxRetries: number;
}

// ============================================
// HEALTH CHECK
// ============================================

export const healthCheck = async () => {
  const { data } = await apiClient.get<ApiResponse<any>>('/health');
  return data;
};

// ============================================
// COIN QUERIES
// ============================================

export const getCoin = async (address: string, chain?: number) => {
  const { data } = await apiClient.get<ApiResponse<Coin>>(
    `/api/coins/${address}`,
    { params: { chain: chain || CHAIN_ID } }
  );
  return data.data;
};

export const getCoinHolders = async (
  address: string,
  params?: { chainId?: number; after?: string; count?: number }
) => {
  const { data } = await apiClient.get(
    `/api/coins/${address}/holders`, {
    params: { chainId: CHAIN_ID, count: 20, ...params },
  });
  return {
    holders: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

export const getCoinSwaps = async (
  address: string,
  params?: { chain?: number; after?: string; first?: number }
) => {
  const { data } = await apiClient.get(
    `/api/coins/${address}/swaps`, {
    params: { chain: CHAIN_ID, first: 20, ...params },
  });
  return {
    swaps: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

export const getCoinComments = async (
  address: string,
  params?: { chain?: number; after?: string; count?: number }
) => {
  const { data } = await apiClient.get(
    `/api/coins/${address}/comments`, {
    params: { chain: CHAIN_ID, count: 20, ...params },
  });
  return {
    comments: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

// ============================================
// EXPLORE ENDPOINTS
// ============================================

export const getTopGainers = async (params?: { after?: string; count?: number }) => {
  const { data } = await apiClient.get('/api/explore/top-gainers', {
    params: { count: 10, ...params },
  });
  // Backend returns { success, data: [...coins], pagination: { hasNextPage, endCursor } }
  return {
    coins: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

export const getTopVolume = async (params?: { after?: string; count?: number }) => {
  const { data } = await apiClient.get('/api/explore/top-volume', {
    params: { count: 10, ...params },
  });
  return {
    coins: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

export const getMostValuable = async (params?: { after?: string; count?: number }) => {
  const { data } = await apiClient.get('/api/explore/most-valuable', {
    params: { count: 10, ...params },
  });
  return {
    coins: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

export const getNewCoins = async (params?: { after?: string; count?: number }) => {
  const { data } = await apiClient.get('/api/explore/new', {
    params: { count: 10, ...params },
  });
  return {
    coins: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

export const getLastTraded = async (params?: { after?: string; count?: number }) => {
  const { data } = await apiClient.get('/api/explore/last-traded', {
    params: { count: 10, ...params },
  });
  return {
    coins: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

export const getLastTradedUnique = async (params?: { after?: string; count?: number }) => {
  const { data } = await apiClient.get('/api/explore/last-traded-unique', {
    params: { count: 10, ...params },
  });
  return {
    coins: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

export const getNewCreators = async (params?: { after?: string; count?: number }) => {
  const { data } = await apiClient.get('/api/explore/new-creators', {
    params: { count: 10, ...params },
  });
  return {
    coins: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

export const getMostValuableCreators = async (params?: { after?: string; count?: number }) => {
  const { data } = await apiClient.get('/api/explore/most-valuable-creators', {
    params: { count: 10, ...params },
  });
  return {
    coins: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

// ============================================
// AUTHENTICATION
// ============================================

export const getNonce = async (walletAddress: string) => {
  const { data } = await apiClient.get<
    ApiResponse<{ nonce: string; expiresAt: string }>
  >(`/api/auth/nonce/${walletAddress}`);
  return data.data;
};

export const verifySignature = async (params: {
  walletAddress: string;
  signature: string;
  nonce: string;
}) => {
  const { data } = await apiClient.post<
    ApiResponse<{ token: string; user: any }>
  >('/api/auth/verify', params);
  return data.data;
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get<ApiResponse<any>>('/api/auth/me');
  return data.data;
};

export const refreshProfile = async () => {
  const { data } = await apiClient.post<ApiResponse<any>>('/api/auth/refresh');
  return data.data;
};

// ============================================
// WRITE OPERATIONS - METADATA
// ============================================

export const uploadMetadata = async (params: {
  name: string;
  symbol: string;
  description: string;
  imageUri: string;
}) => {
  const { data } = await apiClient.post<
    ApiResponse<{ uri: string; metadata: any }>
  >('/api/write/upload-metadata', params);
  return data.data;
};

export const validateMetadata = async (params: { uri: string }) => {
  const { data } = await apiClient.post<ApiResponse<any>>(
    '/api/write/validate-metadata',
    params
  );
  return data.data;
};

// ============================================
// WRITE OPERATIONS - CREATE COIN
// ============================================

export const prepareCreateCoin = async (params: CreateCoinParams) => {
  const { data } = await apiClient.post<
    ApiResponse<{ metadataUri: string; transaction: any }>
  >('/api/write/create-coin/prepare', { ...params, chainId: CHAIN_ID });
  return data.data;
};

export const prepareCreateCoinWithUri = async (
  params: Omit<CreateCoinParams, 'description' | 'imageUri'> & { metadataUri: string }
) => {
  const { data } = await apiClient.post<ApiResponse<{ transaction: any }>>(
    '/api/write/create-coin/with-metadata-uri',
    { ...params, chainId: CHAIN_ID }
  );
  return data.data;
};

// ============================================
// TRADE ENDPOINTS
// ============================================

export const prepareTrade = async (params: TradeParams) => {
  const { data } = await apiClient.post<ApiResponse<TradeResponse>>(
    '/api/trade/prepare',
    params
  );
  return data.data;
};

export const getTradeQuote = async (params: TradeParams) => {
  const { data } = await apiClient.post<ApiResponse<TradeResponse>>(
    '/api/trade/quote',
    params
  );
  return data.data;
};

export const validateTrade = async (params: TradeParams) => {
  const { data } = await apiClient.post<ApiResponse<any>>(
    '/api/trade/validate',
    params
  );
  return data.data;
};

export const getSupportedTokens = async () => {
  const { data } = await apiClient.get<
    ApiResponse<{ tokens: Array<{ address: string; symbol: string; name: string; decimals: number }> }>
  >('/api/trade/supported-tokens');
  return data.data;
};

// ============================================
// UPDATE COIN
// ============================================

export const updateCoinUri = async (params: { coin: string; newURI: string }) => {
  const { data } = await apiClient.put<ApiResponse<{ transaction: any }>>(
    '/api/write/update-coin-uri',
    params
  );
  return data.data;
};

export const updatePayoutRecipient = async (params: {
  coin: string;
  newPayoutRecipient: string;
}) => {
  const { data } = await apiClient.put<ApiResponse<{ transaction: any }>>(
    '/api/write/update-payout-recipient',
    params
  );
  return data.data;
};

// ============================================
// SCHEDULER ENDPOINTS
// ============================================

export const scheduleCoin = async (payload: {
  walletAddress: string;
  scheduledFor: string;
  coinParams: {
    name: string;
    symbol: string;
    metadataUri: string;
    currency: string;
    chainId: number;
    startingMarketCap: string;
    additionalOwners: string[];
  };
  transaction: {
    to: string;
    data: string;
    value: string;
  };
  maxRetries?: number;
}) => {
  const { data } = await apiClient.post('/api/scheduler/schedule', payload);
  return data;
};

export const getScheduledCoins = async (params: {
  walletAddress: string; // Make walletAddress required
  jwtToken: string; // Make jwtToken required
}) => {
  const { data } = await apiClient.get<
    ApiResponse<{ scheduledCoins: ScheduledCoin[]; total: number; hasMore: boolean }>
  >(`/api/scheduler/scheduled-coins`, {
    params: { walletAddress: params.walletAddress }, // Only include walletAddress in query params
    headers: { Authorization: `Bearer ${params.jwtToken}` }, // Always include Authorization header
  });
  return data.data;
};

export const getScheduledCoin = async (id: string) => {
  const { data } = await apiClient.get<ApiResponse<ScheduledCoin>>(
    `/api/scheduler/scheduled-coins/${id}`
  );
  return data.data;
};

export const getScheduledCoinCalldata = async (id: string) => {
  const { data } = await apiClient.get<
    ApiResponse<{ to: string; data: string; value: string; chainId: number }>
  >(`/api/scheduler/scheduled-coins/${id}/calldata`);
  return data.data;
};

export const updateScheduledCoin = async (id: string, scheduledFor: string) => {
  const { data } = await apiClient.put<ApiResponse<ScheduledCoin>>(
    `/api/scheduler/scheduled-coins/${id}`,
    { scheduledFor }
  );
  return data.data;
};

export const cancelScheduledCoin = async (id: string) => {
  const { data } = await apiClient.delete<ApiResponse<any>>(
    `/api/scheduler/scheduled-coins/${id}`
  );
  return data.data;
};

export const executeScheduledCoin = async (params: {
  id: string;
  transactionHash: string;
  coinAddress: string;
}) => {
  const { data } = await apiClient.post<ApiResponse<ScheduledCoin>>(
    `/api/scheduler/scheduled-coins/${params.id}/execute`,
    {
      transactionHash: params.transactionHash,
      coinAddress: params.coinAddress,
    }
  );
  return data.data;
};

// ============================================
// PROFILE ENDPOINTS
// ============================================

/**
 * Get profile by wallet address or Zora handle
 * @param identifier - Wallet address (0x...) or Zora handle
 */
export const getProfile = async (identifier: string) => {
  const { data } = await apiClient.get<ApiResponse<Profile>>(
    `/api/profile/${identifier}`
  );
  return data.data;
};

/**
 * Get coins created by a profile
 * @param identifier - Wallet address or Zora handle
 * @param params - Query parameters (count, chainIds, after)
 */
export const getProfileCoins = async (
  identifier: string,
  params?: { count?: number; chainIds?: string; after?: string }
) => {
  const { data } = await apiClient.get(
    `/api/profile/${identifier}/coins`,
    { params: { count: 10, chainIds: CHAIN_ID.toString(), ...params } }
  );
  return {
    profile: data.data.profile,
    coins: data.data.coins || [],
    totalCount: data.data.totalCount,
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

/**
 * Get coin balances held by a profile
 * @param identifier - Wallet address or Zora handle
 * @param params - Query parameters (count, after)
 */
export const getProfileBalances = async (
  identifier: string,
  params?: { count?: number; after?: string }
) => {
  const { data } = await apiClient.get(
    `/api/profile/${identifier}/balances`,
    { params: { count: 20, ...params } }
  );
  return {
    balances: data.data || [],
    pageInfo: data.pagination || { hasNextPage: false, endCursor: '' },
  };
};

export default apiClient;