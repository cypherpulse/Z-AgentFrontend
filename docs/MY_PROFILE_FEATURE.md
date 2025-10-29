# My Profile Page - User Documentation

## Overview
The **My Profile** page (`/my-profile`) is a personalized dashboard for authenticated users to view their Zora profile, portfolio, and created coins.

## Features

### 🔐 Authentication Required
- Page is only accessible after connecting wallet and signing in
- Automatically fetches profile data using the connected wallet address
- Shows appropriate messages for different states

### 📊 Three Possible States

#### 1. Not Authenticated
**What Users See:**
- Friendly message explaining authentication is needed
- Call-to-action button to go home and connect wallet
- Clean, centered card layout

**User Journey:**
```
User visits /my-profile 
  → Not connected 
  → Shows "Connect Your Wallet" message
  → User clicks "Go to Home"
  → Connects wallet in navbar
  → Signs authentication message
  → Can now access My Profile
```

#### 2. No Zora Profile Found
**What Users See:**
- Clear message: "No Zora Profile Found"
- Their wallet address displayed
- Explanation of what a Zora profile is and how to get one
- Helpful links to:
  - Explore coins
  - Creator coins page
  - Zora platform

**When This Happens:**
- User's wallet address doesn't have an associated Zora creator profile
- The API returns no profile data for their address
- They haven't created any coins or set up a Zora profile yet

**Example Message:**
```
Your connected wallet doesn't have a Zora creator profile. 
A Zora profile is created when you:
• Launch your first creator coin on Zora
• Set up your profile on the Zora platform
• Engage with the Zora creator economy
```

#### 3. Profile Exists (Success State)
**What Users See:**
- Full profile dashboard with avatar, name, bio
- Social links (website, Twitter, Farcaster)
- Wallet address with copy button
- Three stat cards:
  - **Portfolio Market Cap**: Total market cap of all coins held
  - **Coins Created**: Number of creator tokens launched
  - **Creator Coin Value**: Their personal creator coin's market cap
- Two tabs:
  - **Portfolio**: Coins they hold (with balances)
  - **Created**: Coins they've launched
- Linked wallets section (if any)
- "My Profile" badge to indicate it's their own profile

## Navigation

### How to Access
1. **From Wallet Button Dropdown:**
   - Connect and sign in with wallet
   - Click on your wallet address in navbar
   - Click "My Profile" menu item (User icon)

2. **Direct URL:**
   - Navigate to `/my-profile`
   - Will redirect or show auth prompt if not signed in

### Navigation Elements
- **Back Button**: Returns to home page
- **Coin Cards**: Click to view detailed coin page
- **Social Links**: Open in new tabs
- **Copy Address**: Copies wallet address to clipboard

## UI Components

### Profile Header
```tsx
- Avatar (large, 24x24)
- Display name or handle
- "My Profile" badge (with sparkles icon)
- Username (@handle)
- Bio text
- Social media buttons (Website, Twitter, Farcaster)
- Wallet address badge with copy button
```

### Stats Cards
```tsx
Card 1: Portfolio Market Cap
  - Icon: Wallet
  - Value: $X.XXM
  - Subtitle: X coins held

Card 2: Coins Created
  - Icon: Coins
  - Value: XX
  - Subtitle: Creator tokens launched

Card 3: Creator Coin Value
  - Icon: TrendingUp
  - Value: $X.XXM or "N/A"
  - Subtitle: Market cap or "No creator coin"
```

### Tabs

#### Portfolio Tab
- Shows coins the user holds
- Displays as grid of CoinCard components
- Each card shows:
  - Coin name and symbol
  - Current price
  - Price change (24h) with color coding
  - Market cap
  - Number of holders
- "Load More" button for pagination
- Empty state: "No Coins Yet" with CTA to explore

#### Created Tab
- Shows coins the user created
- Same card layout as Portfolio
- "Load More" button for pagination
- Empty state: "No Coins Created Yet" with CTA to create

### Linked Wallets Section
- Only shows if user has linked wallets
- Lists all connected wallet addresses
- Shows wallet type (e.g., MetaMask, WalletConnect)
- Copy button for each address
- Hover effects on cards

## Technical Details

### API Endpoints Used
1. **Profile Data**: `getProfile(address)`
2. **Created Coins**: `getProfileCoins(address, { count: 12 })`
3. **Portfolio**: `getProfileBalances(address, { count: 12 })`

### Hooks Used
```typescript
- useAccount() // Get connected wallet address
- useAuth() // Check authentication status
- useProfile() // Fetch profile data
- useProfileCoins() // Fetch created coins with pagination
- useProfileBalances() // Fetch portfolio with pagination
- useLocation() // Navigation
```

### State Management
- Authentication state from `AuthContext`
- Profile data from TanStack Query
- Local state for:
  - Active tab (portfolio/created)
  - Copied address feedback

### Loading States
- Skeleton screens while fetching data
- Separate loading for profile, coins, and balances
- "Loading..." text on pagination buttons

### Error Handling
- Gracefully handles missing profile data
- Shows helpful messages instead of errors
- Redirects or prompts for authentication
- Profile error triggers "No Zora Profile" state

## User Experience

### Copy Address Feedback
- Click copy button
- Icon changes to checkmark
- Turns green
- Reverts after 2 seconds

### Infinite Scroll
- Initial load: 12 items
- "Load More" button at bottom
- Fetches next page when clicked
- Button disabled while loading
- Shows "Loading..." text

### Empty States
- **No Portfolio Coins**: 
  - Shows wallet icon
  - "No Coins Yet" message
  - "Explore Coins" CTA button
  
- **No Created Coins**:
  - Shows coins icon
  - "No Coins Created Yet" message
  - "Create Coin" CTA button

## Differences from Public Profile Page

| Feature | My Profile (`/my-profile`) | Public Profile (`/profile/:id`) |
|---------|---------------------------|--------------------------------|
| Access | Requires authentication | Public access |
| Data Source | Connected wallet address | URL parameter (any identifier) |
| Badge | "My Profile" badge shown | No special badge |
| Purpose | User's own dashboard | View other creators |
| URL | Fixed `/my-profile` | Dynamic `/profile/:identifier` |

## Example Usage

### Authenticated User with Profile
```
1. User connects wallet (0x123...abc)
2. Signs authentication message
3. Clicks "My Profile" from dropdown
4. Sees their profile:
   - Avatar and display name
   - Stats: $2.5M portfolio, 3 coins created
   - Portfolio tab: 15 coins held
   - Created tab: 3 coins launched
```

### Authenticated User without Zora Profile
```
1. User connects wallet (0x999...xyz)
2. Signs authentication message
3. Clicks "My Profile" from dropdown
4. Sees "No Zora Profile Found" message
5. Can explore other coins or visit Zora platform
```

### Unauthenticated User
```
1. User navigates to /my-profile
2. Sees "Connect Your Wallet" message
3. Clicks "Go to Home"
4. Connects wallet and signs in
5. Returns to /my-profile (or clicks My Profile again)
```

## Future Enhancements
- [ ] Edit profile functionality
- [ ] Profile settings page
- [ ] Transaction history
- [ ] Notification preferences
- [ ] Activity feed
- [ ] Analytics dashboard
- [ ] Export portfolio data
- [ ] Custom profile themes
