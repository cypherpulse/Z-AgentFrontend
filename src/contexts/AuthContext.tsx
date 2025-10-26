import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { sdk } from '@farcaster/miniapp-sdk';

interface AuthContextType {
  address: string | undefined;
  isConnected: boolean;
  miniAppUser: { fid: number } | null;
  isMiniApp: boolean;
  tryInstantAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { address, isConnected } = useAccount();
  const [miniAppUser, setMiniAppUser] = useState<{ fid: number } | null>(null);
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    const checkMiniApp = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) {
          setIsMiniApp(true);
          setMiniAppUser({ fid: context.user.fid });
        }
      } catch (error) {
        // Not in mini app
      }
    };
    checkMiniApp();
  }, []);

  const tryInstantAuth = async () => {
    if (isMiniApp) {
      try {
        const { token } = await sdk.quickAuth.getToken();
        // Use token to verify, but for now, assume success
        // In real app, send to backend
        console.log('Instant auth token:', token);
      } catch (error) {
        console.error('Instant auth failed:', error);
        // Fall back to wallet connect
      }
    }
  };

  useEffect(() => {
    if (isMiniApp) {
      tryInstantAuth();
    }
  }, [isMiniApp]);

  return (
    <AuthContext.Provider value={{ address, isConnected, miniAppUser, isMiniApp, tryInstantAuth }}>
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
