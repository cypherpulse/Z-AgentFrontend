import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import * as api from './api';
import type { TradeParams, CreateCoinParams } from './api';

// ============================================
// QUERY KEYS
// ============================================

export const queryKeys = {
  health: ['health'],
  coin: (address: string) => ['coin', address],
  coinHolders: (address: string, params?: any) => ['coin', address, 'holders', params],
  coinSwaps: (address: string, params?: any) => ['coin', address, 'swaps', params],
  coinComments: (address: string, params?: any) => ['coin', address, 'comments', params],
  topGainers: (params?: any) => ['explore', 'top-gainers', params],
  topVolume: (params?: any) => ['explore', 'top-volume', params],
  mostValuable: (params?: any) => ['explore', 'most-valuable', params],
  newCoins: (params?: any) => ['explore', 'new', params],
  lastTraded: (params?: any) => ['explore', 'last-traded', params],
  lastTradedUnique: (params?: any) => ['explore', 'last-traded-unique', params],
  newCreators: (params?: any) => ['explore', 'new-creators', params],
  mostValuableCreators: (params?: any) => ['explore', 'most-valuable-creators', params],
  profile: (identifier: string) => ['profile', identifier],
  profileCoins: (identifier: string, params?: any) => ['profile', identifier, 'coins', params],
  profileBalances: (identifier: string, params?: any) => ['profile', identifier, 'balances', params],
  currentUser: ['auth', 'me'],
  supportedTokens: ['trade', 'supported-tokens'],
  scheduledCoins: (params?: any) => ['scheduler', 'scheduled-coins', params],
  scheduledCoin: (id: string) => ['scheduler', 'scheduled-coin', id],
};

// ============================================
// HEALTH CHECK
// ============================================

export const useHealthCheck = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: api.healthCheck,
    staleTime: 60000, // 1 minute
  });
};

// ============================================
// COIN QUERIES
// ============================================

export const useCoin = (address: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.coin(address),
    queryFn: () => api.getCoin(address),
    enabled: enabled && !!address,
    staleTime: 30000, // 30 seconds
  });
};

export const useCoinHolders = (
  address: string,
  params?: { chainId?: number; count?: number }
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.coinHolders(address, params),
    queryFn: ({ pageParam }) =>
      api.getCoinHolders(address, { ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    enabled: !!address,
    staleTime: 30000,
  });
};

export const useCoinSwaps = (
  address: string,
  params?: { chain?: number; first?: number }
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.coinSwaps(address, params),
    queryFn: ({ pageParam }) =>
      api.getCoinSwaps(address, { ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    enabled: !!address,
    staleTime: 10000, // 10 seconds for recent swaps
  });
};

export const useCoinComments = (
  address: string,
  params?: { chain?: number; count?: number }
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.coinComments(address, params),
    queryFn: ({ pageParam }) =>
      api.getCoinComments(address, { ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    enabled: !!address,
    staleTime: 20000,
  });
};

// ============================================
// EXPLORE QUERIES
// ============================================

export const useTopGainers = (params?: { count?: number }) => {
  return useInfiniteQuery({
    queryKey: queryKeys.topGainers(params),
    queryFn: ({ pageParam }) => api.getTopGainers({ ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    staleTime: 60000, // 1 minute
  });
};

export const useTopVolume = (params?: { count?: number }) => {
  return useInfiniteQuery({
    queryKey: queryKeys.topVolume(params),
    queryFn: ({ pageParam }) => api.getTopVolume({ ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    staleTime: 60000,
  });
};

export const useMostValuable = (params?: { count?: number }) => {
  return useInfiniteQuery({
    queryKey: queryKeys.mostValuable(params),
    queryFn: ({ pageParam }) => api.getMostValuable({ ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    staleTime: 60000,
  });
};

export const useNewCoins = (params?: { count?: number }) => {
  return useInfiniteQuery({
    queryKey: queryKeys.newCoins(params),
    queryFn: ({ pageParam }) => api.getNewCoins({ ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    staleTime: 30000,
  });
};

export const useLastTraded = (params?: { count?: number }) => {
  return useInfiniteQuery({
    queryKey: queryKeys.lastTraded(params),
    queryFn: ({ pageParam }) => api.getLastTraded({ ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    staleTime: 15000, // 15 seconds for recent activity
  });
};

export const useLastTradedUnique = (params?: { count?: number }) => {
  return useInfiniteQuery({
    queryKey: queryKeys.lastTradedUnique(params),
    queryFn: ({ pageParam }) => api.getLastTradedUnique({ ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    staleTime: 60000,
  });
};

export const useNewCreators = (params?: { count?: number }) => {
  return useInfiniteQuery({
    queryKey: queryKeys.newCreators(params),
    queryFn: ({ pageParam }) => api.getNewCreators({ ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    staleTime: 60000,
  });
};

export const useMostValuableCreators = (params?: { count?: number }) => {
  return useInfiniteQuery({
    queryKey: queryKeys.mostValuableCreators(params),
    queryFn: ({ pageParam }) => api.getMostValuableCreators({ ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    staleTime: 60000,
  });
};

// ============================================
// AUTHENTICATION
// ============================================

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: api.getCurrentUser,
    enabled: !!localStorage.getItem('auth_token'),
    staleTime: 300000, // 5 minutes
    retry: false,
  });
};

export const useRefreshProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.refreshProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
  });
};

// ============================================
// TRADE QUERIES & MUTATIONS
// ============================================

export const useSupportedTokens = () => {
  return useQuery({
    queryKey: queryKeys.supportedTokens,
    queryFn: api.getSupportedTokens,
    staleTime: 600000, // 10 minutes
  });
};

export const useTradeQuote = (params: TradeParams, enabled = true) => {
  return useQuery({
    queryKey: ['trade', 'quote', params],
    queryFn: () => api.getTradeQuote(params),
    enabled: enabled && !!params.amountIn && params.amountIn !== '0',
    staleTime: 10000, // 10 seconds
    refetchInterval: 15000, // Refetch every 15 seconds for live prices
  });
};

export const usePrepareTrade = () => {
  return useMutation({
    mutationFn: api.prepareTrade,
  });
};

export const useValidateTrade = () => {
  return useMutation({
    mutationFn: api.validateTrade,
  });
};

// ============================================
// CREATE COIN MUTATIONS
// ============================================

export const useUploadMetadata = () => {
  return useMutation({
    mutationFn: api.uploadMetadata,
  });
};

export const useValidateMetadata = () => {
  return useMutation({
    mutationFn: api.validateMetadata,
  });
};

export const usePrepareCreateCoin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.prepareCreateCoin,
    onSuccess: () => {
      // Invalidate explore queries to show new coin
      queryClient.invalidateQueries({ queryKey: ['explore'] });
    },
  });
};

export const usePrepareCreateCoinWithUri = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.prepareCreateCoinWithUri,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explore'] });
    },
  });
};

// ============================================
// UPDATE COIN MUTATIONS
// ============================================

export const useUpdateCoinUri = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateCoinUri,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coin(variables.coin) });
    },
  });
};

export const useUpdatePayoutRecipient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updatePayoutRecipient,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coin(variables.coin) });
    },
  });
};

// ============================================
// SCHEDULER QUERIES & MUTATIONS
// ============================================

export const useScheduledCoins = (params?: {
  status?: string;
  limit?: number;
  skip?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.scheduledCoins(params),
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token');

      // For now, we'll need to get wallet address from current user
      // This is a temporary solution - ideally the API should handle this
      const userResponse = await api.getCurrentUser();
      const walletAddress = userResponse.walletAddress;

      return api.getScheduledCoins({
        walletAddress,
        jwtToken: token
      });
    },
    enabled: !!localStorage.getItem('auth_token'),
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Auto-refetch every 30 seconds
  });
};

export const useScheduledCoin = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.scheduledCoin(id),
    queryFn: () => api.getScheduledCoin(id),
    enabled: enabled && !!id,
    staleTime: 15000,
    refetchInterval: 15000,
  });
};

export const useScheduleCoin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.scheduleCoin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduler', 'scheduled-coins'] });
    },
  });
};

export const useUpdateScheduledCoin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, scheduledFor }: { id: string; scheduledFor: string }) =>
      api.updateScheduledCoin(id, scheduledFor),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scheduledCoin(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['scheduler', 'scheduled-coins'] });
    },
  });
};

export const useCancelScheduledCoin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.cancelScheduledCoin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduler', 'scheduled-coins'] });
    },
  });
};

export const useExecuteScheduledCoin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.executeScheduledCoin,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scheduledCoin(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['scheduler', 'scheduled-coins'] });
      queryClient.invalidateQueries({ queryKey: ['explore'] });
    },
  });
};

// ============================================
// PROFILE HOOKS
// ============================================

export const useProfile = (identifier: string | undefined) => {
  return useQuery({
    queryKey: ['profile', identifier],
    queryFn: () => api.getProfile(identifier!),
    enabled: !!identifier,
    staleTime: 60000, // 1 minute
  });
};

export const useProfileCoins = (
  identifier: string | undefined,
  params?: { count?: number; chainIds?: string }
) => {
  return useInfiniteQuery({
    queryKey: ['profile', identifier, 'coins', params],
    queryFn: ({ pageParam }) =>
      api.getProfileCoins(identifier!, { ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    enabled: !!identifier,
    staleTime: 30000,
  });
};

export const useProfileBalances = (
  identifier: string | undefined,
  params?: { count?: number }
) => {
  return useInfiniteQuery({
    queryKey: ['profile', identifier, 'balances', params],
    queryFn: ({ pageParam }) =>
      api.getProfileBalances(identifier!, { ...params, after: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    enabled: !!identifier,
    staleTime: 30000,
  });
};

