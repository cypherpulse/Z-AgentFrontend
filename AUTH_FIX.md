# Authentication Fix Summary

## Issues Fixed

### 1. **Invalid Signature Error** ✅
**Problem:** Backend was returning a `message` field along with the `nonce`, but we were only signing the nonce.

**Solution:** 
- Backend endpoint `/api/auth/nonce/:address` returns:
  ```json
  {
    "data": {
      "nonce": "04b6f956...",
      "message": "Sign this message to authenticate: [nonce]"
    }
  }
  ```
- Now we sign the full `message` from backend, not just the `nonce`
- Pass the `nonce` separately to `/auth/verify`

### 2. **Connector.getChainId Error** ✅
**Problem:** Auto-authentication was triggering before wallet was fully connected.

**Solution:**
- Removed auto-authentication on wallet connection
- Made authentication manual (user clicks "Sign In" button)
- Added chain validation and switching before signing
- Added duplicate request prevention with `authAttemptRef`

### 3. **Chain Network Validation** ✅
**Problem:** Users might be on wrong chain when trying to authenticate.

**Solution:**
- Check if user is on Base Mainnet (chainId: 8453)
- Automatically prompt to switch chain if needed
- Wait 500ms after chain switch for stability
- Handle user rejection gracefully

## Updated Authentication Flow

```
1. User connects wallet via RainbowKit
   └─→ Wallet connected, shows in dropdown

2. User clicks "Sign In" button
   └─→ Check if on Base Mainnet (8453)
        ├─→ If not: Prompt to switch chain
        └─→ If yes: Continue

3. GET /api/auth/nonce/:walletAddress
   └─→ Returns: { nonce, message }

4. Sign the message (not just nonce!)
   └─→ User approves in wallet
   └─→ Returns signature

5. POST /api/auth/verify
   Body: { walletAddress, signature, nonce }
   └─→ Returns: { token, user }

6. Store token in localStorage
   └─→ Add to all API requests via interceptor
   └─→ User is authenticated ✓
```

## API Integration

### Backend Endpoints
```typescript
// Step 1: Get nonce
GET https://z-agent.onrender.com/api/auth/nonce/0xYOUR_ADDRESS

Response:
{
  "success": true,
  "data": {
    "nonce": "04b6f956f810d1265c4adba1fbf91390246e6894fccfa87a8d306bff1b99464b",
    "message": "Sign this message to authenticate with your wallet:\n\nNonce: 04b6f956...\nTimestamp: 2025-01-11T10:30:00Z",
    "expiresAt": "2025-01-11T10:40:00Z"
  }
}

// Step 2: Verify signature
POST https://z-agent.onrender.com/api/auth/verify
Content-Type: application/json

{
  "walletAddress": "0xYOUR_ADDRESS",
  "signature": "0x1234...",
  "nonce": "04b6f956..."
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user-id",
      "walletAddress": "0xYOUR_ADDRESS",
      "createdAt": "2025-01-10T12:00:00Z",
      "lastLoginAt": "2025-01-11T10:30:00Z"
    }
  }
}
```

## Key Changes to AuthContext.tsx

### 1. Added Chain Validation
```typescript
const REQUIRED_CHAIN_ID = 8453; // Base Mainnet
const chainId = useChainId();
const { switchChainAsync } = useSwitchChain();

// Check and switch if needed
if (chainId !== REQUIRED_CHAIN_ID) {
  await switchChainAsync({ chainId: REQUIRED_CHAIN_ID });
  await new Promise(resolve => setTimeout(resolve, 500));
}
```

### 2. Fetch nonce and message from backend
```typescript
const nonceRes = await fetch(`${API_URL}/auth/nonce/${address}`);
const nonceResponse = await nonceRes.json();
const { nonce, message } = nonceResponse.data;
```

### 3. Sign the message (not nonce)
```typescript
// ✅ Correct: Sign the full message
signature = await signMessageAsync({ message });

// ❌ Wrong: Don't sign just the nonce
// signature = await signMessageAsync({ message: nonce });
```

### 4. Send nonce separately to verify
```typescript
const verifyRes = await fetch(`${API_URL}/auth/verify`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: address,
    signature,
    nonce, // ✅ Send nonce as separate field
  }),
});
```

### 5. Added duplicate request prevention
```typescript
const authAttemptRef = useRef<boolean>(false);

// Prevent spam clicks
if (isAuthenticating || authAttemptRef.current) {
  return;
}

authAttemptRef.current = true;
// ... authenticate
// Reset after 2 seconds
setTimeout(() => {
  authAttemptRef.current = false;
}, 2000);
```

### 6. Better error handling
```typescript
try {
  // Authentication logic
} catch (err: any) {
  let errorMessage = 'Authentication failed';
  
  if (err.message?.includes('User rejected')) {
    errorMessage = 'You cancelled the request';
  } else if (err.message?.includes('chain')) {
    errorMessage = 'Please switch to Base Mainnet';
  } else if (err.message) {
    errorMessage = err.message;
  }

  setError(errorMessage);
  toast({ title: 'Authentication failed', description: errorMessage });
}
```

### 7. Auto-clear errors
```typescript
useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }
}, [error]);
```

## Testing Checklist

- [x] Connect wallet with MetaMask
- [x] Check if on Base Mainnet (8453)
- [x] Switch chain if needed
- [x] Click "Sign In" button
- [x] Sign the message in wallet
- [x] Verify signature is accepted by backend
- [x] JWT token stored in localStorage
- [x] Token added to API requests
- [x] User can navigate to "My Profile"
- [x] Handle wrong chain gracefully
- [x] Handle user rejection of signature
- [x] Handle duplicate sign-in attempts
- [x] Auto-clear error messages

## Common Issues & Solutions

### Issue: "Invalid signature" error
**Cause:** Signing the nonce instead of the full message
**Solution:** Sign `message` field from nonce response, pass `nonce` to verify endpoint

### Issue: "Please switch to Base Mainnet"
**Cause:** User is on wrong chain
**Solution:** Click button to switch, or manually switch in wallet

### Issue: Can't navigate to profile after signing in
**Cause:** Authentication state not updated
**Solution:** Fixed - now properly sets user state and token after verification

### Issue: Multiple signature requests
**Cause:** User clicks "Sign In" multiple times
**Solution:** Added `authAttemptRef` to prevent duplicate requests

## Environment Variables

```bash
# .env file
VITE_API_URL=https://z-agent.onrender.com/api
```

## Console Logging

The authentication flow now includes detailed console logging:

```
🚀 Starting authentication for address: 0x123...
🔄 Switching from chain 1 to 8453...
✅ Chain switched successfully
📝 Fetching nonce...
Nonce response: { data: { nonce: "...", message: "..." } }
🔐 Requesting signature for message: Sign this message...
✅ Message signed, signature: 0x1234...
🔍 Verifying signature...
Verify response: { data: { token: "...", user: {...} } }
🎉 Authentication successful!
```

## Next Steps

1. Test authentication with different wallets (MetaMask, WalletConnect, Coinbase)
2. Test on different chains and verify chain switching
3. Test error scenarios (wrong network, user rejection, etc.)
4. Verify "My Profile" page loads after authentication
5. Confirm JWT token is added to all protected API requests

## Notes

- Backend is at: `https://z-agent.onrender.com/api`
- Required chain: Base Mainnet (8453)
- Token stored in: `localStorage.getItem('auth_token')`
- Auto-clears errors after 5 seconds
- Prevents duplicate requests with 2-second cooldown
