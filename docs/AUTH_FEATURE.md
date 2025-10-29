# Authentication Feature Documentation

## Overview
This application implements a secure wallet-based authentication system using **RainbowKit**, **wagmi**, and **Sign-In with Ethereum (SIWE)** protocol.

## Technology Stack

### Core Libraries
- **RainbowKit v2.2.8**: Provides beautiful wallet connection UI
- **wagmi v2.18.0**: React hooks for Ethereum interactions
- **viem v2.38.0**: TypeScript interface for Ethereum utilities

### Blockchain Network
- **Base Chain (Chain ID: 8453)**: The application is configured for Base network only

## Authentication Flow

### 1. Wallet Connection
Users connect their wallet using RainbowKit's beautiful modal interface:
- MetaMask
- WalletConnect
- Coinbase Wallet
- And other supported wallets

### 2. SIWE Authentication Process

```
┌──────────────┐
│ User clicks  │
│ Connect      │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ RainbowKit Modal │
│ Opens            │
└──────┬───────────┘
       │
       ▼
┌─────────────────┐
│ Wallet Connected│
└──────┬──────────┘
       │
       ▼
┌──────────────────────────┐
│ User clicks "Sign In"    │
│ from wallet dropdown     │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ GET /api/auth/nonce      │
└──────┬───────────────────┘
       │
       ▼
┌─────────────────────────┐
│ User signs message in   │
│ wallet (no gas fees)    │
└──────┬──────────────────┘
       │
       ▼
┌──────────────────────────┐
│ POST /api/auth/verify    │
│ - walletAddress          │
│ - signature              │
│ - nonce                  │
└──────┬───────────────────┘
       │
       ▼
┌─────────────────────────┐
│ JWT token stored        │
│ User authenticated ✓    │
└─────────────────────────┘
```

## File Structure

### Configuration
- **`src/lib/wagmi.ts`**: Wagmi configuration for Base chain
  - WalletConnect project ID setup
  - Chain configuration
  - Default wallet connectors

### Context & Hooks
- **`src/contexts/AuthContext.tsx`**: Authentication state management
  - `useAuth()` hook for accessing auth state
  - Auto-authentication on wallet connection
  - JWT token management
  - User profile storage

### Components
- **`src/components/WalletButton.tsx`**: Enhanced wallet button
  - RainbowKit ConnectButton integration
  - Account dropdown menu
  - Sign In/Sign Out actions
  - Copy address functionality
  - Network indicator
  - Authentication status indicator (green dot)

### App Wrapper
- **`src/App.tsx`**: Provider hierarchy
  ```tsx
  QueryClientProvider
    └── WagmiProvider
         └── ThemeProvider
              └── RainbowKitProvider (theme-aware)
                   └── AuthProvider
                        └── Application
  ```

## API Endpoints

### 1. Get Nonce
```typescript
GET /api/auth/nonce/:walletAddress

Response:
{
  "success": true,
  "data": {
    "nonce": "random-string",
    "expiresAt": "2025-01-11T12:00:00Z"
  }
}
```

### 2. Verify Signature
```typescript
POST /api/auth/verify
Body: {
  "walletAddress": "0x...",
  "signature": "0x...",
  "nonce": "random-string"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "walletAddress": "0x...",
      "createdAt": "2025-01-10T12:00:00Z",
      "lastLoginAt": "2025-01-11T12:00:00Z"
    }
  }
}
```

### 3. Get Current User (Protected)
```typescript
GET /api/auth/me
Headers: {
  "Authorization": "Bearer jwt-token"
}

Response:
{
  "success": true,
  "data": {
    "id": "user-id",
    "walletAddress": "0x...",
    ...
  }
}
```

### 4. Refresh Token (Protected)
```typescript
POST /api/auth/refresh
Headers: {
  "Authorization": "Bearer jwt-token"
}

Response:
{
  "success": true,
  "data": {
    "token": "new-jwt-token",
    "user": { ... }
  }
}
```

## Features

### Wallet Button UI
The `WalletButton` component provides:

1. **Not Connected State**:
   - "Connect Wallet" button with wallet icon

2. **Connected State**:
   - Network badge (Base chain)
   - Account dropdown with:
     - Display name (ENS or truncated address)
     - Balance
     - Copy address (with copied feedback)
     - View account (opens RainbowKit modal)
     - Sign In button (if not authenticated)
     - Sign Out button (if authenticated)
     - Green dot indicator when authenticated

3. **Wrong Network State**:
   - "Wrong Network" button (red)
   - Clicking opens network switcher

### Authentication Context

The `useAuth()` hook provides:

```typescript
{
  user: User | null;              // Current authenticated user
  isAuthenticated: boolean;       // Authentication status
  isAuthenticating: boolean;      // Loading state during sign-in
  authenticate: () => Promise<void>; // Trigger SIWE flow (manual)
  logout: () => void;             // Clear session and disconnect
}
```

**Note:** Authentication is manual - users must click "Sign In" after connecting their wallet. This prevents unexpected signature requests.

### Security Features

1. **Manual Authentication**: Users must explicitly click "Sign In" - no automatic signature requests
2. **Auto-Logout on 401**: If server returns 401, user is auto-logged out
3. **JWT Token Storage**: Token stored in localStorage and added to all API requests
4. **No Gas Fees**: SIWE signing doesn't require blockchain transaction
5. **Nonce Expiration**: Server-side nonce expiration prevents replay attacks
6. **Message Signing**: Off-chain signature proves wallet ownership
7. **Error Handling**: Specific handling for user rejection, connector errors, and network issues

## Environment Setup

### Required Environment Variable

Create a `.env` file:

```bash
# Get your project ID from https://cloud.walletconnect.com
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Getting a WalletConnect Project ID

1. Go to https://cloud.walletconnect.com
2. Sign up/Sign in
3. Create a new project
4. Copy the Project ID
5. Add it to your `.env` file

## Theme Integration

RainbowKit automatically adapts to the application's theme:

```typescript
<RainbowKitProvider
  theme={theme === "dark" ? darkTheme() : lightTheme()}
  modalSize="compact"
>
```

## Usage Examples

### Check if User is Authenticated

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <div>Please connect and sign in</div>;
  }

  return <div>Welcome {user?.walletAddress}</div>;
}
```

### Get User's Wallet Address

```typescript
import { useAccount } from 'wagmi';

function MyComponent() {
  const { address, isConnected } = useAccount();

  return (
    <div>
      {isConnected ? `Connected: ${address}` : 'Not connected'}
    </div>
  );
}
```

### Require Authentication for a Feature

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

function CreateCoinButton() {
  const { isAuthenticated, authenticate, isAuthenticating } = useAuth();

  const handleCreate = async () => {
    if (!isAuthenticated) {
      await authenticate();
      return;
    }

    // Proceed with coin creation
    console.log('Creating coin...');
  };

  return (
    <Button onClick={handleCreate} disabled={isAuthenticating}>
      {isAuthenticating ? 'Signing...' : 'Create Coin'}
    </Button>
  );
}
```

## Error Handling

### User Rejects Signature
```typescript
// Shows toast: "Authentication cancelled - You rejected the signature request."
```

### Network Issues
```typescript
// Shows toast: "Authentication failed - [error message]"
```

### Token Expired
```typescript
// Auto-redirects to home page
// Clears localStorage
// User must re-authenticate
```

## Testing Checklist

- [ ] Connect wallet with MetaMask
- [ ] Connect wallet with WalletConnect
- [ ] Sign SIWE message
- [ ] Verify JWT token is stored
- [ ] Verify authenticated state
- [ ] Test copy address functionality
- [ ] Test sign out
- [ ] Test auto-authentication on reconnect
- [ ] Test wrong network detection
- [ ] Test user rejection of signature
- [ ] Test theme switching (light/dark)
- [ ] Verify protected API calls include token
- [ ] Test token expiration handling

## Future Enhancements

- [ ] Add session persistence across tabs
- [ ] Implement token refresh before expiration
- [ ] Add social account linking
- [ ] Show authentication history
- [ ] Add multi-wallet support (switch between wallets)
- [ ] Profile management UI
- [ ] Add email notifications for new logins
