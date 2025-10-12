import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useAccount, useSignMessage, useDisconnect, useSwitchChain, useChainId } from 'wagmi';
import { getCurrentUser, User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://z-agent.onrender.com'}/api`;
const REQUIRED_CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '8453', 10);
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  error: string | null;
  authenticate: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  
  // Prevent duplicate authentication attempts
  const authAttemptRef = useRef<boolean>(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      }
    };
    checkAuth();
  }, []);

  const authenticate = async () => {
    // Validation checks
    if (!address || !isConnected) {
      const errorMsg = 'Please connect your wallet first';
      setError(errorMsg);
      toast({
        title: 'Wallet not connected',
        description: errorMsg,
        variant: 'destructive',
      });
      return;
    }

    // Prevent duplicate attempts
    if (isAuthenticating || authAttemptRef.current) {
      console.log('⚠️ Authentication already in progress');
      return;
    }

    setIsAuthenticating(true);
    authAttemptRef.current = true;
    setError(null);

    try {
      console.log('🚀 Starting authentication for address:', address);
      
      // Normalize address to lowercase (some backends require this)
      const normalizedAddress = address.toLowerCase();
      console.log('Normalized address:', normalizedAddress);
      
      // Step 1: Check and switch chain if needed
      if (chainId !== REQUIRED_CHAIN_ID) {
        console.log(`🔄 Switching from chain ${chainId} to ${REQUIRED_CHAIN_ID}...`);
        try {
          await switchChainAsync({ chainId: REQUIRED_CHAIN_ID });
          console.log('✅ Chain switched successfully');
          // Wait a bit for chain to fully switch
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (switchError: any) {
          if (switchError.message?.includes('User rejected')) {
            throw new Error('Please switch to Base Mainnet in your wallet');
          }
          throw switchError;
        }
      }

      // Step 2: Get nonce from backend with chainId
      console.log('📝 Fetching nonce for chain:', REQUIRED_CHAIN_ID);
      const nonceRes = await fetch(
        `${API_URL}/auth/nonce/${normalizedAddress}?chainId=${REQUIRED_CHAIN_ID}`,
        {
          method: 'GET',
          headers: {
            'Origin': window.location.origin, // Explicitly send origin
          }
        }
      );

      if (!nonceRes.ok) {
        const errorData = await nonceRes.json();
        throw new Error(errorData.message || 'Failed to fetch nonce');
      }

      const nonceResponse = await nonceRes.json();
      console.log('Nonce response:', nonceResponse);
      
      // Backend returns SIWE message and nonce
      const { nonce, message: siweMessage, origin: nonceOrigin } = nonceResponse.data;
      
      console.log('📝 Nonce received:', nonce);
      console.log('🌐 Origin from nonce response:', nonceOrigin);
      console.log('📝 Message to sign:', siweMessage);
      
      // Use the origin from nonce response for consistency
      const originToUse = nonceOrigin || window.location.origin;
      console.log('🔗 Origin to use for verification:', originToUse);
      
      // Step 3: Sign the SIWE message from backend
      console.log('🔐 Requesting signature for SIWE message...');
      let signature: string;
      try {
        signature = await signMessageAsync({ 
          message: siweMessage,
          account: address as `0x${string}`,
        });
        console.log('✅ Message signed successfully');
        console.log('Signature:', signature);
        console.log('Nonce used:', nonce);
      } catch (signError: any) {
        if (signError.message?.includes('User rejected') || signError.message?.includes('rejected')) {
          throw new Error('You cancelled the signature request');
        }
        throw signError;
      }

      // Step 4: Verify signature with backend (include chainId and origin)
      console.log('🔍 Verifying signature with backend...');
      console.log('📊 Verify Request Details:');
      console.log('  URL:', `${API_URL}/auth/verify`);
      console.log('  Chain ID:', REQUIRED_CHAIN_ID);
      console.log('  Origin to use:', originToUse);
      console.log('  Origin from nonce:', nonceOrigin);
      console.log('  Current origin:', window.location.origin);
      console.log('  Wallet Address:', normalizedAddress);
      console.log('  Signature length:', signature.length);
      console.log('  Nonce length:', nonce.length);
      console.log('  SIWE Message:', siweMessage);
      
      const verifyPayload = {
        walletAddress: normalizedAddress, 
        signature, 
        nonce, 
        chainId: REQUIRED_CHAIN_ID,
        origin: originToUse
      };
      
      console.log('📤 Sending payload:', JSON.stringify(verifyPayload, null, 2));
      
      const verifyRes = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': originToUse, // Same origin as nonce request
        },
        body: JSON.stringify({
          walletAddress: normalizedAddress,
          signature,
          nonce,
          chainId: REQUIRED_CHAIN_ID, // ✅ Include chainId for verification
          origin: originToUse, // ✅ CRITICAL: Use origin from nonce response
        }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        console.error('❌ Verification failed with status:', verifyRes.status);
        console.error('❌ Status Text:', verifyRes.statusText);
        console.error('❌ Error response:', errorData);
        console.error('❌ Error message:', errorData.message);
        console.error('❌ Error details:', errorData.error);
        console.error('❌ Full error JSON:', JSON.stringify(errorData, null, 2));
        console.error('📤 Request sent to backend:', {
          url: `${API_URL}/auth/verify`,
          method: 'POST',
          walletAddress: normalizedAddress,
          signature,
          signatureLength: signature.length,
          signaturePreview: `${signature.slice(0, 20)}...${signature.slice(-20)}`,
          nonce,
          nonceLength: nonce.length,
          chainId: REQUIRED_CHAIN_ID,
          origin: originToUse,
          message: siweMessage,
        });
        console.error('🔍 Debugging Info:');
        console.error('  - Backend URL:', API_URL);
        console.error('  - Origin used:', originToUse);
        console.error('  - Origin from nonce:', nonceOrigin);
        console.error('  - Current location:', window.location.origin);
        console.error('  - Chain ID:', REQUIRED_CHAIN_ID);
        throw new Error(errorData.message || errorData.error || `Verification failed (${verifyRes.status})`);
      }

      const verifyResponse = await verifyRes.json();
      console.log('✅ Verify response:', verifyResponse);

      // Step 5: Save token and user data
      localStorage.setItem(AUTH_TOKEN_KEY, verifyResponse.data.token);
      setUser(verifyResponse.data.user);

      console.log('🎉 Authentication successful!');
      
      toast({
        title: 'Successfully authenticated!',
        description: `Welcome back, ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (err: any) {
      console.error('❌ Authentication failed:', err);
      
      // User-friendly error messages
      let errorMessage = 'Authentication failed';
      
      if (err.message?.includes('User rejected') || err.message?.includes('cancelled')) {
        errorMessage = 'You cancelled the request';
      } else if (err.message?.includes('chain') || err.message?.includes('Chain')) {
        errorMessage = 'Please switch to Base Mainnet';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast({
        title: 'Authentication failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsAuthenticating(false);
      // Allow retry after 2 seconds
      setTimeout(() => {
        authAttemptRef.current = false;
      }, 2000);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setError(null);
    authAttemptRef.current = false;
    disconnect();
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthenticating,
        error,
        authenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
