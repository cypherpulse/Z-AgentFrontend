import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { sdk } from '@farcaster/miniapp-sdk';

interface AuthContextType {
  address: string | undefined;
  isConnected: boolean;
  miniAppUser: { fid: number } | null;
  isMiniApp: boolean;
  isBaseApp: boolean;
  miniAppConnected: boolean;
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
  const [isBaseApp, setIsBaseApp] = useState(false);
  const [miniAppConnected, setMiniAppConnected] = useState(false);

  useEffect(() => {
    const checkMiniApp = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) {
          setIsMiniApp(true);
          setMiniAppUser({ fid: context.user.fid });
          // Check if it's Base App
          if ((context.client as any)?.type === 'base') {
            setIsBaseApp(true);
          }
        }
      } catch (error) {
        // Not in mini app
      }
    };
    checkMiniApp();
  }, []);

  const tryInstantAuth = async () => {
    if (isMiniApp && !isBaseApp) {
      try {
        const { token } = await sdk.quickAuth.getToken();
        // For Farcaster, assume connected after auth
        console.log('Instant auth token:', token);
        setMiniAppConnected(true);
      } catch (error) {
        console.error('Instant auth failed:', error);
      }
    }
  };

  useEffect(() => {
    if (isMiniApp) {
      // Removed automatic tryInstantAuth() - now manual via connect button
    }
  }, [isMiniApp]);

  return (
    <AuthContext.Provider value={{ address, isConnected, miniAppUser, isMiniApp, isBaseApp, miniAppConnected, tryInstantAuth }}>
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
