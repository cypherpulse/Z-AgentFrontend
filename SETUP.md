# Quick Start Guide - Authentication Setup

## 🚀 Setup Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Get WalletConnect Project ID

1. Visit: https://cloud.walletconnect.com
2. Sign up or sign in
3. Create a new project
4. Copy your Project ID

### 3. Create Environment File

Create a `.env` file in the root directory:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Replace `your_project_id_here` with your actual WalletConnect Project ID.

### 4. Start Development Server

```bash
pnpm dev
```

## ✅ What's Included

- ✅ RainbowKit wallet connection UI
- ✅ wagmi for blockchain interactions
- ✅ viem for Ethereum utilities
- ✅ SIWE (Sign-In with Ethereum) authentication
- ✅ JWT token management
- ✅ Auto-authentication on wallet connection
- ✅ Theme-aware wallet UI (light/dark mode)
- ✅ Protected API routes
- ✅ Error handling with toast notifications

## 🎯 How to Use

### Connect Wallet
1. Click "Connect Wallet" button in the navbar
2. Choose your wallet (MetaMask, WalletConnect, etc.)
3. Approve connection in your wallet

### Sign In
1. After connecting, you'll be prompted to sign a message
2. Approve the signature request (no gas fees!)
3. You're now authenticated! ✨

### Features Available
- Green dot indicator shows you're authenticated
- Account dropdown shows:
  - Your display name or address
  - Your balance
  - Copy address button
  - Sign out option
- Network indicator (Base chain)

## 📚 Developer Reference

### Check Authentication Status
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { isAuthenticated, user } = useAuth();
```

### Get Wallet Address
```typescript
import { useAccount } from 'wagmi';

const { address, isConnected } = useAccount();
```

### Protect Features
```typescript
const { isAuthenticated, authenticate } = useAuth();

if (!isAuthenticated) {
  await authenticate();
  return;
}

// Your protected code here
```

## 🔒 Security Notes

- JWT tokens are stored in localStorage
- Tokens are automatically added to all API requests
- 401 responses trigger auto-logout
- SIWE signing doesn't cost gas
- Nonce expires to prevent replay attacks

## 🐛 Troubleshooting

### "Wrong Network" button appears
- Click it to switch to Base network
- Or manually switch to Base in your wallet

### Authentication fails
- Check console for error messages
- Verify your WalletConnect Project ID
- Try disconnecting and reconnecting
- Clear localStorage and try again

### Wallet doesn't connect
- Make sure you have a wallet extension installed
- Try refreshing the page
- Check if you're on a supported browser

## 📖 Full Documentation

See `AUTH_FEATURE.md` for complete documentation including:
- Detailed authentication flow
- API endpoint specifications
- Component architecture
- Advanced usage examples
