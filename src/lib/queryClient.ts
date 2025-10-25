import { QueryClient } from "@tanstack/react-query";

// Create a query client with secure error handling
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute default
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        // Don't retry on client errors (4xx)
        if (error?.cause?.status >= 400 && error?.cause?.status < 500) {
          return false;
        }
        // Retry network errors up to 3 times
        if (error?.cause?.code === 'ERR_NETWORK' ||
            error?.cause?.code === 'ERR_CONNECTION_TIMED_OUT' ||
            error?.cause?.code === 'ERR_NETWORK_CHANGED') {
          return failureCount < 3;
        }
        // Retry server errors up to 2 times
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
