import axios, { AxiosError, AxiosInstance } from 'axios';

// AI API Configuration from environment variables
export const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL;
const AI_API_TIMEOUT = parseInt(import.meta.env.VITE_AI_API_TIMEOUT || '30000', 10);

// Create axios instance for AI API
const aiApiClient: AxiosInstance = axios.create({
  baseURL: AI_BASE_URL,
  timeout: AI_API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token if available (optional for AI API)
aiApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
aiApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle AI API specific errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface AiApiResponse<T> {
  success?: boolean;
  data?: T;
  response?: string;
  message?: string;
  error?: string;
}

export interface AiConversationRequest {
  question: string;
  profile?: string;
  address?: string;
}

export interface AiConversationResponse {
  response: string;
  profileData?: any;
}

// ============================================
// AI CONVERSATION ENDPOINTS
// ============================================

/**
 * Ask general AI questions about crypto/blockchain
 */
export const askGeneralAi = async (question: string) => {
  const { data } = await aiApiClient.post<AiConversationResponse>(
    '/api/conversation/ask/open',
    { question }
  );
  return data;
};

/**
 * Ask AI questions about a specific profile
 */
export const askProfileAi = async (params: { question: string; profile: string }) => {
  const { data } = await aiApiClient.post<AiConversationResponse>(
    '/api/conversation/ask/profile',
    params
  );
  return data;
};

/**
 * Ask AI questions about a specific coin
 */
export const askCoinAi = async (params: { question: string; address: string }) => {
  const { data } = await aiApiClient.post<AiConversationResponse>(
    '/api/conversation/ask/coin',
    params
  );
  return data;
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format AI response text with basic markdown-like formatting
 * NOTE: Removed HTML conversion to allow ReactMarkdown to handle raw markdown
 */
export const formatAiResponse = (text: string): string => {
  // Return raw text - let ReactMarkdown handle markdown parsing
  return text;
};

export default aiApiClient;