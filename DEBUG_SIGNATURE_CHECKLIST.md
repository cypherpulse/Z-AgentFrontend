# 🔍 Signature Verification Debug Checklist

## Current Issue
Getting 401 "Invalid signature" error even after implementing origin fix.

## Enhanced Logging Added

The following detailed logs are now available in the console:

### Before Verify Request:
```
📊 Verify Request Details:
  URL: [backend URL]
  Chain ID: [chain id]
  Origin to use: [origin being sent]
  Origin from nonce: [origin from nonce response]
  Current origin: [window.location.origin]
  Wallet Address: [normalized address]
  Signature length: [length]
  Nonce length: [length]
  SIWE Message: [full message]
  
📤 Sending payload: [JSON payload]
```

### After Failed Verify:
```
❌ Verification failed with status: [status]
❌ Status Text: [status text]
❌ Error response: [error object]
❌ Error message: [specific message]
❌ Error details: [error details]
❌ Full error JSON: [complete JSON]
📤 Request sent to backend: [full request details]
🔍 Debugging Info: [environment details]
```

## Things to Check in Console Logs

### 1. ✅ Check Origins Match
- [ ] `Origin to use` matches `Origin from nonce`
- [ ] `Current origin` matches both above
- [ ] All three should be identical (e.g., `http://localhost:5173`)

### 2. ✅ Check Signature Format
- [ ] Signature starts with `0x`
- [ ] Signature length is between 130-132 characters
- [ ] Signature is a valid hex string

### 3. ✅ Check Nonce Format
- [ ] Nonce is at least 32 characters long
- [ ] Nonce is the same one received from backend
- [ ] Nonce hasn't expired (check timestamp)

### 4. ✅ Check Chain ID
- [ ] Chain ID is `8453` (Base Mainnet)
- [ ] Chain ID is sent as a number, not string
- [ ] Chain ID matches network user is on

### 5. ✅ Check SIWE Message Structure
The SIWE message should follow this exact format:
```
[domain] wants you to sign in with your Ethereum account:
[address]

[statement]

URI: [uri]
Version: 1
Chain ID: 8453
Nonce: [nonce]
Issued At: [timestamp]
```

Check for:
- [ ] Domain matches origin hostname
- [ ] Address is lowercase and matches wallet address
- [ ] Chain ID in message is 8453
- [ ] Nonce in message matches nonce in request
- [ ] No extra spaces or line breaks

### 6. ✅ Check Backend Response
Look at the error response:
- [ ] `errorData.message` - What does the backend say?
- [ ] `errorData.error` - Any additional error details?
- [ ] `errorData.details` - Any validation errors?

## Common Issues and Solutions

### Issue 1: Origin Mismatch
**Symptom:** Origins don't match in logs
**Solution:** 
- Backend must return `origin` in nonce response
- Frontend must use that exact origin in verify request
- Check for trailing slashes, http vs https

### Issue 2: Nonce Expired
**Symptom:** Error message says "Nonce expired" or "Nonce not found"
**Solution:**
- Don't wait too long between getting nonce and signing
- Nonces typically expire after 5-10 minutes
- Get a fresh nonce and try again

### Issue 3: Signature Malformed
**Symptom:** Error about signature format
**Solution:**
- Check signature includes `0x` prefix
- Verify signature is hex string
- Make sure no extra spaces or characters

### Issue 4: Chain ID Mismatch
**Symptom:** Error about chain ID
**Solution:**
- User must be on Base Mainnet (8453)
- Switch network in wallet
- Verify chainId is sent as number in request

### Issue 5: Address Case Mismatch
**Symptom:** Signature valid but still fails
**Solution:**
- Always use lowercase addresses
- Normalize address before sending
- Backend should also normalize

### Issue 6: Message Reconstruction Differs
**Symptom:** Everything looks correct but still fails
**Solution:**
- Compare SIWE message from nonce response
- Compare what backend reconstructs for verification
- Look for whitespace differences, extra newlines
- Domain/URI must be exactly the same

## Debugging Steps

### Step 1: Check Console Logs
1. Open browser DevTools Console
2. Clear console
3. Try to sign in
4. Look for all the logs mentioned above
5. Copy the full error details

### Step 2: Verify Request Payload
From the logs, check:
```json
{
  "walletAddress": "0x...",  // Should be lowercase
  "signature": "0x...",      // Should be 130-132 chars
  "nonce": "...",            // Should match nonce from first request
  "chainId": 8453,           // Should be number
  "origin": "http://..."     // Should match nonce origin
}
```

### Step 3: Compare SIWE Messages
From the logs:
1. Copy the SIWE message shown before signing
2. Ask backend dev to log the message it reconstructs
3. Do a character-by-character comparison
4. Look for differences in:
   - Line breaks (`\n`)
   - Spaces
   - Domain vs URI
   - Timestamp format

### Step 4: Check Backend Logs
Ask backend dev to check:
- [ ] What origin is received in verify request
- [ ] What origin was used for nonce generation
- [ ] What SIWE message is reconstructed
- [ ] What domain/URI is used for reconstruction
- [ ] Any validation errors before signature check

### Step 5: Test with cURL
Create a test with curl to isolate frontend:
```bash
# Get nonce
curl -X GET "https://z-agent.onrender.com/api/auth/nonce/0xYOUR_ADDRESS?chainId=8453" \
  -H "Origin: http://localhost:5173"

# Verify signature (with actual values from above)
curl -X POST "https://z-agent.onrender.com/api/auth/verify" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "walletAddress": "0xYOUR_ADDRESS",
    "signature": "0xYOUR_SIGNATURE",
    "nonce": "NONCE_FROM_ABOVE",
    "chainId": 8453,
    "origin": "http://localhost:5173"
  }'
```

## What to Share with Backend Team

If issue persists, share this info with backend team:

1. **Full console logs** showing:
   - Nonce response (including origin)
   - SIWE message signed
   - Verify request payload
   - Error response

2. **Request comparison**:
   - Origin in nonce request
   - Origin in nonce response
   - Origin in verify request (header)
   - Origin in verify request (body)

3. **SIWE message details**:
   - Full message text before signing
   - Any character encoding issues
   - Line break format

4. **Ask backend to log**:
   - Origin received in verify request
   - SIWE message reconstructed for verification
   - Domain and URI used
   - Any differences found

## Expected Flow

### ✅ Correct Flow:
1. Frontend: GET /nonce with `Origin: http://localhost:5173`
2. Backend: Generates SIWE message with domain `localhost`
3. Backend: Returns `{ nonce, message, origin: "http://localhost:5173" }`
4. Frontend: Signs the SIWE message
5. Frontend: POST /verify with `origin: "http://localhost:5173"` in body
6. Backend: Uses origin from body to reconstruct message
7. Backend: Message reconstruction matches original
8. Backend: Signature verification succeeds ✅
9. Frontend: Receives JWT token

### ❌ Incorrect Flow:
1. Frontend: GET /nonce (no origin)
2. Backend: Auto-detects origin from headers → `http://localhost:5173`
3. Backend: Returns `{ nonce, message }` (no origin)
4. Frontend: Signs the message
5. Frontend: POST /verify (no origin in body)
6. Backend: Auto-detects origin from headers → might be different!
7. Backend: Message reconstruction differs from original
8. Backend: Signature verification fails ❌

## Next Steps

1. ✅ Check all items in the checklist above
2. 📋 Copy relevant console logs
3. 📤 Share findings with backend team
4. 🔄 Coordinate fix if needed
5. ✅ Test again after backend update
