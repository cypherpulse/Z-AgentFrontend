# Coin Creation with Cloudinary Upload Setup

## ✅ Implementation Complete

Your coin creation page now supports:
- **Image uploads** (JPEG, PNG, GIF, WebP) - max 10MB
- **Video uploads** (MP4, WebM, OGG, MOV) - max 100MB
- **Direct URL input** (alternative to uploading)
- **Real-time preview** with progress indicator
- **Full integration** with your backend API for coin creation

---

## 🔑 Cloudinary Configuration Needed

### Step 1: Update your `.env` file

Replace the placeholder values in your `.env` file:

```properties
# ==============================================
# CLOUDINARY CONFIGURATION
# ==============================================
VITE_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_actual_upload_preset
```

### Step 2: Get Your Cloudinary Credentials

1. **Go to** [https://cloudinary.com/console](https://cloudinary.com/console)
2. **Sign in** or create a free account
3. **Copy your Cloud Name** from the dashboard
4. **Create an Upload Preset:**
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set **Signing Mode** to "Unsigned" (for frontend uploads)
   - Give it a name (e.g., `zora-coin-uploads`)
   - Configure allowed formats:
     - Images: jpg, png, gif, webp
     - Videos: mp4, webm, ogg, mov
   - Set max file size limits
   - Save the preset
5. **Copy the preset name** you just created

---

## 🎯 How It Works

### Frontend Flow (What We Built)

```
User selects file
    ↓
Upload to Cloudinary (with progress)
    ↓
Get secure URL from Cloudinary
    ↓
Add URL to form data
    ↓
Submit to backend
```

### Backend Integration (Your API Endpoints)

#### 1. **Upload Metadata to IPFS**
```http
POST /api/write/upload-metadata
Authorization: Bearer <JWT_TOKEN_FROM_LOCALSTORAGE>
Content-Type: application/json

{
  "name": "My Coin",
  "symbol": "MC",
  "description": "Amazing coin",
  "imageUri": "https://res.cloudinary.com/..."
}
```

#### 2. **Prepare Create Coin Transaction**
```http
POST /api/write/create-coin/prepare
Authorization: Bearer <JWT_TOKEN_FROM_LOCALSTORAGE>
Content-Type: application/json

{
  "name": "My Coin",
  "symbol": "MC",
  "description": "Amazing coin",
  "imageUri": "https://res.cloudinary.com/...",
  "currency": "ZORA",
  "startingMarketCap": "LOW",
  "chainId": 8453
}
```

#### 3. **Send Transaction via Wagmi**
Frontend receives `{ to, data, value }` and sends via wallet.

---

## 📁 Files Created/Modified

### New Files:
- ✅ `src/lib/cloudinary.ts` - Upload utility with progress tracking
- ✅ `COIN_CREATION_SETUP.md` - This documentation

### Modified Files:
- ✅ `src/pages/create.tsx` - Full coin creation with upload
- ✅ `.env` - Added Cloudinary configuration

---

## 🎨 Features Added

### 1. **File Upload Button**
- Click upload icon to select image/video
- Drag-and-drop support (native browser)
- File type validation
- File size validation

### 2. **Upload Progress**
- Real-time progress bar
- Percentage indicator
- Visual feedback during upload

### 3. **Media Preview**
- Instant preview before upload
- Video player with controls
- Image display with fallback

### 4. **Flexible Input**
- Upload files OR paste URLs
- Clear/remove uploaded media
- Real-time preview updates

### 5. **Smart Integration**
- Gets JWT token from localStorage (`authToken`)
- Handles authentication state
- Shows proper error messages
- Transaction tracking with wagmi

---

## 🔒 Authentication Flow

The implementation correctly uses **dynamic authentication**:

```typescript
// Token is NOT from .env - it's from user authentication
const token = localStorage.getItem('authToken');
```

This token is set when users:
1. Connect their wallet
2. Sign the SIWE message
3. Backend verifies and returns JWT
4. Token stored in localStorage as `authToken`

---

## 🚀 Testing Steps

### 1. **Set up Cloudinary**
- Add your cloud name and upload preset to `.env`
- Restart your dev server

### 2. **Test Upload**
- Go to `/create` page
- Click upload button
- Select an image or video
- Watch progress bar
- Verify preview shows

### 3. **Test Coin Creation**
- Fill in name and symbol
- Add description (optional)
- Upload or paste media URL
- Click "Create Coin"
- Approve transaction in wallet
- Wait for confirmation

---

## 📝 Usage Examples

### Upload Image
```typescript
const file = new File([...], 'coin.png', { type: 'image/png' });
const response = await uploadToCloudinary(file, (progress) => {
  console.log(`${progress.percentage}% uploaded`);
});
// response.secure_url = "https://res.cloudinary.com/..."
```

### Validate URL
```typescript
import { isValidMediaUrl } from '@/lib/cloudinary';

const valid = isValidMediaUrl('https://example.com/image.png');
```

---

## ⚠️ Important Notes

1. **Cloudinary Upload Presets MUST be "Unsigned"** for frontend uploads
2. **JWT token comes from localStorage**, not .env
3. **Token key is `authToken`** (not `auth_token`)
4. **Backend expects Bearer token** in Authorization header
5. **Chain ID is 8453** (Base Mainnet)
6. **Transaction value comes from backend** (don't hardcode)

---

## 🐛 Troubleshooting

### "Cloudinary configuration is missing"
- Check `.env` file has correct values
- Restart dev server after changing `.env`

### "Upload failed"
- Verify upload preset is "Unsigned"
- Check file size limits
- Verify file type is allowed

### "Please authenticate first"
- Connect wallet via WalletButton
- Sign the SIWE message
- Check localStorage has `authToken`

### "Failed to prepare transaction"
- Verify backend is running
- Check JWT token is valid
- Ensure wallet is on Base chain

---

## 📚 Additional Resources

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Unsigned Upload Presets](https://cloudinary.com/documentation/upload_images#unsigned_upload)
- [Wagmi Transaction Hooks](https://wagmi.sh/react/hooks/useSendTransaction)
- [SIWE Authentication](https://login.xyz/)

---

## 🎉 Ready to Use!

Your coin creation page is now fully functional with:
- ✅ Image/video uploads to Cloudinary
- ✅ Backend API integration
- ✅ Wallet transaction handling
- ✅ Authentication via JWT from localStorage
- ✅ Real-time progress tracking
- ✅ Professional UI/UX

Just add your Cloudinary credentials and you're good to go! 🚀
