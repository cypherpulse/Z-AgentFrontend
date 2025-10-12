# 🔍 Debugging 401 Invalid Signature Error

## Current Status

Getting **401 Unauthorized** error with message "Invalid signature" even after implementing the origin fix.

## Enhanced Logging Added

The frontend now logs:
- ✅ Origin from nonce response
- ✅ Origin being used for verification
- ✅ Full signature and nonce values
- ✅ Full error response from backend
- ✅ Complete SIWE message that was signed

## Things to Check

### 1. **Verify Backend is Using the Origin from Request Body**

Check backend logs to ensure it's using the origin from the request body, not detecting from headers:

```typescript
// Backend should log:
logger.info(
  { domain, uri, providedOrigin: origin, detectedOrigin: requestOrigin },
  'Using origin for signature verification'
);
```

**What to look for:**
- `providedOrigin` should match `detectedOrigin`
- Both should be the same value from nonce and verify requests

### 2. **Check SIWE Message Format**

The SIWE message should be identical between nonce generation and verification.

**Frontend logs to check:**
```
📝 Message to sign: [SIWE message here]
```

**Backend should reconstruct the EXACT same message when verifying.**

Common mismatches:
- ❌ Different domain (localhost vs 127.0.0.1)
- ❌ Different port
- ❌ Different protocol (http vs https)
- ❌ Different URI format
- ❌ Different chainId

### 3. **Verify Signature Format**

Check console logs for:
```
Signature: 0x... (should be 132 characters total, including 0x)
```

### 4. **Check Address Normalization**

Both frontend and backend should normalize addresses the same way:
- Frontend: `address.toLowerCase()`
- Backend: Should also lowercase the address

### 5. **Verify ChainId Consistency**

The chainId should be the same in:
- Nonce request: `?chainId=8453`
- SIWE message: `Chain ID: 8453`
- Verify request body: `{ chainId: 8453 }`

## Common Issues & Solutions

### Issue 1: Origin Mismatch

**Symptom:** Backend reconstructs SIWE message with different origin

**Solution:**
- Frontend sends `origin: window.location.origin` in verify body
- Backend uses this exact origin instead of detecting from headers
- Backend should return origin in nonce response for verification

**Check:**
```javascript
// Console should show:
🌐 Origin from nonce response: http://localhost:5173
🔗 Origin to use for verification: http://localhost:5173
```

### Issue 2: Nonce Already Used

**Symptom:** 401 error saying nonce is invalid or already used

**Solution:**
- Backend should mark nonce as used only AFTER successful verification
- Each sign-in attempt should get a fresh nonce
- Don't retry with the same nonce

**Check:**
- Try signing in fresh after refreshing the page
- Each attempt should show a different nonce value

### Issue 3: Time Sync Issues

**Symptom:** Signature fails due to timestamp mismatch

**Solution:**
- Ensure server and client times are synchronized
- SIWE messages have timestamp fields that must match

### Issue 4: Wrong SIWE Message Format

**Symptom:** Message format doesn't match between nonce and verify

**Check backend constructs message like this:**
```typescript
const message = new SiweMessage({
  domain,
  address: walletAddress,
  statement: 'Sign in with Ethereum to the app.',
  uri,
  version: '1',
  chainId,
  nonce,
  issuedAt: new Date().toISOString(),
});
```

## Debugging Steps

### Step 1: Check Full Error Response

With the enhanced logging, check the console for:
```
Full error object: { ... }
```

This will show the exact error message from the backend.

### Step 2: Compare Nonce and Verify Origins

Console should show:
```
🌐 Origin from nonce response: [value]
🔗 Origin to use for verification: [value]
```

**These MUST be identical!**

### Step 3: Verify Request Payload

Console shows complete request:
```
Request was: {
  walletAddress: "0x...",
  signature: "0x...",
  nonce: "...",
  chainId: 8453,
  origin: "http://localhost:5173",
  siweMessage: "..."
}
```

### Step 4: Backend Log Analysis

Ask backend team to log:

```typescript
// In verify endpoint
console.log('=== VERIFY REQUEST ===');
console.log('Received:', {
  walletAddress,
  signature: signature.slice(0, 10) + '...',
  nonce: nonce.slice(0, 10) + '...',
  chainId,
  origin,
});

console.log('=== RECONSTRUCTING MESSAGE ===');
console.log('Using domain:', domain);
console.log('Using uri:', uri);
console.log('Using chainId:', chainId);
console.log('Reconstructed message:', message.prepareMessage());

console.log('=== VERIFYING ===');
try {
  const result = await message.verify({ signature });
  console.log('✅ Verification SUCCESS');
} catch (error) {
  console.log('❌ Verification FAILED:', error);
}
```

## Expected Console Output (Success Case)

```
🚀 Starting authentication for address: 0x123...
Normalized address: 0x123...
📝 Fetching nonce for chain: 8453
Nonce response: { success: true, data: { nonce: "...", message: "...", origin: "http://localhost:5173" } }
📝 Nonce received: abc123...
🌐 Origin from nonce response: http://localhost:5173
📝 Message to sign: localhost:5173 wants you to sign in...
🔗 Origin to use for verification: http://localhost:5173
🔐 Requesting signature for SIWE message...
✅ Message signed successfully
Signature: 0x...
Nonce used: abc123...
🔍 Verifying signature with backend...
Chain ID: 8453
Origin: http://localhost:5173
Sending: { walletAddress: "0x123...", signature: "0x...", nonce: "...", chainId: 8453, origin: "http://localhost:5173" }
✅ Verify response: { success: true, data: { token: "...", user: {...} } }
🎉 Authentication successful!
```

## Next Steps

1. **Run the app and try to sign in**
2. **Copy the full console output** (especially the error object)
3. **Check backend logs** for verification details
4. **Compare the SIWE messages** - they should be identical
5. **Verify the origin values** match exactly

## Quick Test

Try this in the browser console after clicking "Sign In":

```javascript
// Check what origin is being sent
console.log('window.location.origin:', window.location.origin);

// After signing, check localStorage
console.log('Auth token:', localStorage.getItem('auth_token'));
```

## Backend Verification Checklist

Ask backend team to confirm:

- [ ] Backend accepts `origin` field in verify request body
- [ ] Backend returns `origin` in nonce response
- [ ] Backend uses the same origin for both nonce and verify
- [ ] Backend validation schema allows optional `origin` field
- [ ] Backend logs show the origin being used
- [ ] SIWE message reconstruction uses the provided origin
- [ ] Address is normalized to lowercase on backend
- [ ] ChainId is correctly parsed and used

## If Still Failing

If the error persists:

1. **Test with a fresh nonce** - refresh page and try again
2. **Try a different wallet** - rule out wallet-specific issues
3. **Check browser console for ALL errors** - might be network issues
4. **Verify API endpoint is correct** - check `VITE_API_BASE_URL`
5. **Test in incognito mode** - rule out extension conflicts
6. **Check CORS settings** - backend should allow your origin

## Contact Backend Team

Share these details:
- Frontend origin: `[your origin]`
- ChainId: `8453`
- Error message: `[full error response]`
- Nonce used: `[first 10 chars]`
- Signature: `[first 10 chars]`
- Console logs from frontend
