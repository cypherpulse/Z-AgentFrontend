import React, { createContext, useContext, ReactNode } from 'react';
import { useAccount } from 'wagmi';

interface AuthContextType {
  address: string | undefined;
  isConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { address, isConnected } = useAccount();

  return (
    <AuthContext.Provider value={{ address, isConnected }}>
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
