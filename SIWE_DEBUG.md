# SIWE Authentication Debugging Guide

## Current Issue: "Invalid signature" (401 error)

### What We Know
✅ Wallet connects successfully  
✅ Nonce is fetched from backend  
✅ SIWE message is displayed correctly  
✅ User signs the message successfully  
✅ Signature is generated: `0x82b0620a89b4dd770b...`  
❌ Backend rejects with: **401 - Invalid signature**

### SIWE Message Format (from logs)
```
z-agent.local wants you to sign in with your Ethereum account:
0xc5983e0b551a7c60d62177cccadf199b9eeac54b

Sign this message to authenticate with Z-Agent.

URI: http://localhost:3000
Version: 1
Chain ID: 8453
Nonce: ef1462788b5e48d562f4ec68fb29c582ad6c3dc63600a0a9a6af0753de9134e4
Issued At: 2025-10-12T15:15:54.349Z
Expiration Time: 2025-10-12T15:20:54.349Z
```

### Possible Causes & Fixes Applied

#### 1. ✅ Address Case Sensitivity
**Issue:** Backend might compare addresses in lowercase, but wallet returns checksummed address.

**Fix Applied:**
```typescript
// Normalize address to lowercase
const normalizedAddress = address.toLowerCase();

// Use normalized address for nonce fetch
await fetch(`${API_URL}/auth/nonce/${normalizedAddress}`);

// Use normalized address in verify request
body: JSON.stringify({
  walletAddress: normalizedAddress,
  signature,
  nonce,
})
```

#### 2. ✅ Account Parameter in Signing
**Issue:** Some wallets need explicit account parameter.

**Fix Applied:**
```typescript
signature = await signMessageAsync({ 
  message: siweMessage,
  account: address as `0x${string}`,
});
```

#### 3. ✅ Enhanced Logging
**Fix Applied:** Added detailed console logs to help debug:
```typescript
console.log('Normalized address:', normalizedAddress);
console.log('Message to sign:', siweMessage);
console.log('Signature:', signature);
console.log('Nonce used:', nonce);
console.log('Sending:', { walletAddress: normalizedAddress, signature, nonce });
```

### Things to Check on Backend

Since you're fixing the backend, here are things to verify:

#### 1. Address Normalization
```javascript
// Backend should normalize before comparison
const normalizedAddress = walletAddress.toLowerCase();
```

#### 2. SIWE Message Recreation
Backend must recreate the EXACT same message for verification:
```javascript
const message = `z-agent.local wants you to sign in with your Ethereum account:
${normalizedAddress}

Sign this message to authenticate with Z-Agent.

URI: http://localhost:3000
Version: 1
Chain ID: 8453
Nonce: ${nonce}
Issued At: ${issuedAt}
Expiration Time: ${expirationTime}`;
```

⚠️ **Critical:** Every character must match (newlines, spaces, exact text)

#### 3. Signature Verification
```javascript
// Backend should use ethers or viem to verify
import { verifyMessage } from 'viem';

const isValid = await verifyMessage({
  address: normalizedAddress,
  message: recreatedMessage,
  signature: signature,
});
```

#### 4. Nonce Validation
```javascript
// Check nonce exists and matches
const storedNonce = await getNonceFromDB(normalizedAddress);
if (storedNonce !== nonce) {
  throw new Error('Invalid nonce');
}

// Check nonce hasn't expired
if (new Date() > new Date(expirationTime)) {
  throw new Error('Nonce expired');
}

// Mark nonce as used (prevent replay attacks)
await markNonceAsUsed(normalizedAddress, nonce);
```

#### 5. Common Backend Issues

**Issue A: Message mismatch**
```javascript
// ❌ Wrong: Backend adds extra spaces or newlines
const message = `z-agent.local wants you to sign in...
  
Sign this message...`; // Extra spaces/newlines

// ✅ Correct: Exact match with what frontend signed
const message = `z-agent.local wants you to sign in...

Sign this message...`; // No extra whitespace
```

**Issue B: Address comparison**
```javascript
// ❌ Wrong: Case-sensitive comparison
if (walletAddress !== signedAddress) // 0xC598... !== 0xc598...

// ✅ Correct: Normalize both sides
if (walletAddress.toLowerCase() !== signedAddress.toLowerCase())
```

**Issue C: Signature format**
```javascript
// ❌ Wrong: Expecting signature without 0x prefix
if (signature.length !== 130) // Expects no 0x

// ✅ Correct: Handle both formats
const cleanSignature = signature.startsWith('0x') 
  ? signature.slice(2) 
  : signature;
```

**Issue D: Using wrong recovery method**
```javascript
// ❌ Wrong: Using personal_sign recovery
const recovered = ethers.utils.verifyMessage(message, signature);

// ✅ Correct: For SIWE, use proper recovery
import { verifyMessage } from 'viem';
const recovered = await verifyMessage({ address, message, signature });
```

### Testing Steps

1. **Clear browser storage**
   ```javascript
   localStorage.clear();
   ```

2. **Connect wallet fresh**
   - Disconnect if connected
   - Connect again

3. **Click "Sign In"**
   - Check console for normalized address
   - Verify nonce is fetched
   - Sign the message

4. **Check console logs**
   ```
   Normalized address: 0xc5983e0b551a7c60d62177cccadf199b9eeac54b
   Message to sign: [SIWE message]
   Signature: 0x82b0620a89b4dd770b...
   Nonce used: ef1462788b5e48d562f4ec68fb29c582ad6c3dc63600a0a9a6af0753de9134e4
   Sending: { walletAddress, signature, nonce }
   ```

5. **Check backend response**
   - Should return `200` with token
   - If `401`, check backend logs for reason

### Backend Debugging Checklist

When you're fixing the backend, add these logs:

```javascript
// In /auth/verify endpoint
console.log('Received verification request:');
console.log('- Wallet address:', req.body.walletAddress);
console.log('- Normalized:', req.body.walletAddress.toLowerCase());
console.log('- Signature length:', req.body.signature.length);
console.log('- Nonce:', req.body.nonce);

// When recreating message
console.log('Recreated message:', message);
console.log('Message length:', message.length);

// When verifying
console.log('Verification result:', isValid);
console.log('Recovered address:', recovered);
console.log('Expected address:', normalizedAddress);
```

### Expected Behavior After Fixes

1. User clicks "Sign In"
2. Frontend sends lowercase address to get nonce
3. Backend returns SIWE message + nonce
4. User signs SIWE message
5. Frontend sends: `{ walletAddress: lowercase, signature, nonce }`
6. Backend:
   - Recreates exact SIWE message
   - Verifies signature matches address
   - Returns JWT token
7. User is authenticated ✅

### If Still Failing

Try testing with curl to isolate frontend/backend:

```bash
# 1. Get nonce
curl http://localhost:3000/api/auth/nonce/0xc5983e0b551a7c60d62177cccadf199b9eeac54b

# 2. Sign message manually in MetaMask console
# 3. Send verification
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0xc5983e0b551a7c60d62177cccadf199b9eeac54b",
    "signature": "0x...",
    "nonce": "ef1462788..."
  }'
```

### Summary of Frontend Changes

✅ Normalize address to lowercase  
✅ Pass account parameter to signMessageAsync  
✅ Use normalized address in all API calls  
✅ Add detailed logging for debugging  
✅ Better error messages with status codes  

Now the frontend is sending the correct format. The "Invalid signature" error is likely due to one of these backend issues:
1. Message recreation doesn't match exactly
2. Address comparison is case-sensitive
3. Signature verification uses wrong method
4. Nonce has already been used/expired
