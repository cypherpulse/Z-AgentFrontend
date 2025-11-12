import axios, { AxiosError, AxiosInstance } from 'axios';
import { secureConfig } from './secureConfig';
import { secureLogger } from './secureLogger';

// Custom error interface to extend Error with cause property
interface ApiError extends Error {
  cause?: {
    status?: number;
    code?: string;
  };
}

// AI API Configuration from secure config
export const AI_BASE_URL = secureConfig.api.aiBaseUrl;
const AI_API_TIMEOUT = secureConfig.blockchain.timeout;

// Create axios instance for AI API with minimal headers
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
    // Secure error handling for AI API - never expose sensitive data
    const isDevelopment = import.meta.env.DEV;

    // Extract only safe error information
    const safeError = {
      status: error.response?.status,
      code: error.code,
      message: error.message,
      url: error.config?.url?.replace(/[?&].*/, ''), // Remove query params
    };

    // Only log in development and avoid sensitive AI responses
    if (isDevelopment && safeError.status !== 500) {
      secureLogger.apiError('AI request', safeError);
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Don't redirect to avoid exposing auth flow
    }

    // Return sanitized error for AI failures
    const sanitizedError: ApiError = new Error(
      safeError.status === 500
        ? 'AI service temporarily unavailable. Please try again.'
        : getUserFriendlyErrorMessage(safeError.status, safeError.code)
    ) as ApiError;

    sanitizedError.cause = {
      status: safeError.status,
      code: safeError.code,
    };

    return Promise.reject(sanitizedError);
  }
);

// Helper function for user-friendly error messages
function getUserFriendlyErrorMessage(status?: number, code?: string): string {
  switch (status) {
    case 400:
      return 'Invalid AI request.';
    case 401:
      return 'Authentication required for AI features.';
    case 403:
      return 'AI access denied.';
    case 429:
      return 'AI service rate limited. Please try again later.';
    case 500:
      return 'AI service temporarily unavailable.';
    default:
      break;
  }

  switch (code) {
    case 'ERR_NETWORK':
    case 'ERR_CONNECTION_TIMED_OUT':
    case 'ERR_NETWORK_CHANGED':
      return 'Connection issue with AI service.';
    default:
      return 'AI service error. Please try again.';
  }
}

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
// AGENT CONVERSATION ENDPOINTS
// ============================================

export interface AgentMessage {
  message: string;
  userId: string;
  timestamp?: string;
}

export interface AgentResponse {
  response: string;
  agent: string;
  timestamp: string;
  conversationId?: string;
}

export const sendAgentMessage = async (params: AgentMessage) => {
  const { data } = await aiApiClient.post<AiApiResponse<AgentResponse>>(
    '/api/conversation/conversational/converse',
    params
  );
  return data;
};

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
  // Format Ethereum addresses to be clickable and copyable
  // Match Ethereum addresses (0x followed by 40 hex characters)
  const addressRegex = /\b(0x[a-fA-F0-9]{40})\b/g;
  const formattedText = text.replace(addressRegex, '[$1]($1)');

  // Return formatted text - let ReactMarkdown handle markdown parsing
  return formattedText;
};

export default aiApiClient;