import { QueryClient } from "@tanstack/react-query";

// Create a query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute default
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        // Don't retry on 401 (unauthorized) or 404 (not found)
        if (error?.response?.status === 401 || error?.response?.status === 404) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
      onError: (error: any) => {
        // Log error for mutations
        console.error('Mutation error:', error?.response?.data?.message || error?.message);
      },
    },
  },
});
