# Metadata Upload Authentication Fix

## ✅ Changes Applied

Fixed the coin creation flow to match the backend API update that removed JWT authentication from metadata upload.

---

## 🔄 What Changed

### Backend Changes (Already Done)
- ❌ Removed: JWT token requirement for `/api/write/upload-metadata`
- ✅ Added: `creator` parameter in request body (wallet address)

### Frontend Changes (Just Applied)

#### 1. **Removed JWT Token from Metadata Upload**

**BEFORE:**
```typescript
const metadataResponse = await fetch(`${API_BASE_URL}/api/write/upload-metadata`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, // ❌ REMOVED
  },
  body: JSON.stringify({
    name: formData.name,
    symbol: formData.symbol,
    description: formData.description,
    imageUri: formData.imageUri,
  }),
});
```

**AFTER:**
```typescript
const metadataResponse = await fetch(`${API_BASE_URL}/api/write/upload-metadata`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // ✅ No Authorization header!
  },
  body: JSON.stringify({
    creator: address, // ✅ Added wallet address
    name: formData.name,
    symbol: formData.symbol,
    description: formData.description,
    imageUri: formData.imageUri,
  }),
});
```

#### 2. **Added Wallet Address Import**
```typescript
import { useAccount } from "wagmi";

// In component:
const { address } = useAccount(); // Get wallet address
```

#### 3. **Updated Validation**
- Changed from checking `isAuthenticated` to checking `address` (wallet connection)
- Button now disabled if wallet not connected (not if not authenticated)

---

## 🎯 New Flow

### Step 1: Upload Metadata (No Auth Required)
```
User fills form
    ↓
Click "Create Coin"
    ↓
Check if wallet connected (not authenticated!)
    ↓
Upload metadata to IPFS
    ├─ Send wallet address as "creator"
    └─ No JWT token needed
```

### Step 2: Prepare Transaction (Still Requires Auth)
```
Metadata uploaded successfully
    ↓
Get JWT token from localStorage
    ↓
Prepare transaction
    ├─ Requires JWT token
    └─ Returns { to, data, value }
```

### Step 3: Send Transaction
```
Transaction prepared
    ↓
Send via wagmi
    ↓
User signs in wallet
    ↓
Wait for confirmation
```

---

## 🔍 Key Points

1. **Metadata Upload = No Auth**
   - Only needs wallet address (`creator`)
   - No JWT token required
   - Anyone can upload metadata

2. **Transaction Prepare = Requires Auth**
   - Still needs JWT token
   - Protected endpoint
   - Must be authenticated

3. **Wallet Connection ≠ Authentication**
   - Wallet connection: User connected wallet via RainbowKit
   - Authentication: User signed SIWE message and has JWT token
   - Metadata upload only needs wallet connection
   - Transaction prepare needs authentication

---

## 📝 Request Body Examples

### Upload Metadata Endpoint
```http
POST /api/write/upload-metadata
Content-Type: application/json

{
  "creator": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "name": "My Awesome Coin",
  "symbol": "MAC",
  "description": "A revolutionary coin",
  "imageUri": "https://res.cloudinary.com/..."
}
```

### Prepare Transaction Endpoint
```http
POST /api/write/create-coin/prepare
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "My Awesome Coin",
  "symbol": "MAC",
  "description": "A revolutionary coin",
  "imageUri": "https://res.cloudinary.com/...",
  "currency": "ZORA",
  "startingMarketCap": "LOW",
  "chainId": 8453
}
```

---

## ✅ Testing Checklist

- [ ] User can upload metadata without authentication
- [ ] Wallet address is sent as `creator` field
- [ ] Error message shows if wallet not connected
- [ ] Transaction prepare still requires auth
- [ ] Full flow works: Connect → Upload → Auth → Create
- [ ] Error handling works for each step

---

## 🐛 Error Messages

### "Please connect your wallet first"
- Wallet not connected
- User needs to click "Connect Wallet" button

### "Please authenticate first to prepare the transaction"
- Metadata uploaded successfully
- But JWT token not found in localStorage
- User needs to authenticate (sign SIWE message)

### "Failed to upload metadata"
- Network error
- Invalid data
- Backend validation failed

### "Failed to prepare transaction"
- Invalid JWT token
- Token expired
- Backend error

---

## 🚀 Benefits of This Change

1. **Simpler Flow**: Users don't need to auth before uploading metadata
2. **Better UX**: Can prepare metadata before authenticating
3. **More Secure**: Wallet address verified from request body
4. **Clearer Errors**: Better error messages for each step
5. **Flexible**: Can upload metadata, then authenticate later

---

## 📚 Related Files

- `src/pages/create.tsx` - Coin creation page (updated)
- `src/lib/cloudinary.ts` - Image/video upload utility
- `src/contexts/AuthContext.tsx` - Authentication context
- Backend: `/api/write/upload-metadata` - Metadata upload endpoint
- Backend: `/api/write/create-coin/prepare` - Transaction prepare endpoint

---

## ✨ Summary

The metadata upload no longer requires JWT authentication. Instead, it accepts the wallet address as the `creator` field in the request body. This simplifies the coin creation flow and provides better separation between metadata upload and transaction creation.

The transaction preparation still requires authentication for security, but users can now prepare their coin metadata without authenticating first.
