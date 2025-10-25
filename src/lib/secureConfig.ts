// Secure environment configuration
// This ensures sensitive data is never exposed in the frontend

export const secureConfig = {
  // API URLs - safe to expose as they're public endpoints
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    aiBaseUrl: import.meta.env.VITE_AI_BASE_URL,
  },

  // Chain configuration - safe to expose
  blockchain: {
    chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '8453', 10),
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  },

  // Feature flags - safe to expose
  features: {
    enableDevTools: import.meta.env.DEV,
    enableErrorLogging: import.meta.env.DEV,
  },

  // Security settings
  security: {
    // Never expose sensitive keys or tokens
    authTokenKey: 'auth_token', // Local storage key only
    enableSecureHeaders: true,
  },
};

// Validate configuration in development
if (import.meta.env.DEV) {
  const requiredEnvVars = [
    'VITE_API_BASE_URL',
    'VITE_AI_BASE_URL',
    'VITE_CHAIN_ID',
  ];

  const missing = requiredEnvVars.filter(key => !import.meta.env[key]);
  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing);
  }
}

// Prevent accidental exposure of sensitive data
Object.freeze(secureConfig);
Object.freeze(secureConfig.api);
Object.freeze(secureConfig.blockchain);
Object.freeze(secureConfig.features);
Object.freeze(secureConfig.security);