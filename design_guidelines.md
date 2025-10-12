# Z-Agent Dashboard Design Guidelines

## Design Approach
**Hybrid Approach**: Base-inspired modern Web3 dashboard combining Material Design's data density principles with Apple HIG's clarity and custom glassmorphic elements for a premium crypto trading experience.

## Core Design Principles
- **Data-First Clarity**: Information hierarchy prioritizes real-time crypto data, price movements, and trading metrics
- **Glassmorphic Premium**: Subtle glass effects on cards, modals, and overlays create depth without distraction
- **Trust Through Consistency**: Stable, predictable layouts build confidence for financial operations
- **Responsive Data**: Charts, tables, and stats adapt seamlessly across all devices

## Color System

### Brand Colors (Already Defined)
**Primary (Green)**: 
- Light mode: 22 76% 49% (500 - core green)
- Dark mode: 34 89% 74% (300 - bright green for contrast)
- Used for: Success states, positive price changes, primary CTAs, active states

**Accent (Orange)**:
- Light mode: 25 95% 53% (500 - core orange) 
- Dark mode: 31 92% 73% (300 - warm orange)
- Used sparingly for: Alerts, important warnings, scheduled items, secondary CTAs

### Functional Colors
**Backgrounds**:
- Light: 0 0% 100% (white), 0 0% 98% (off-white)
- Dark: 222 47% 11% (deep navy-gray), 217 33% 17% (card backgrounds)

**Borders & Dividers**:
- Light: 214 32% 91% (subtle gray)
- Dark: 215 28% 17% (muted dark)

**Text**:
- Light mode primary: 222 47% 11%
- Light mode secondary: 215 16% 47%
- Dark mode primary: 210 40% 98%
- Dark mode secondary: 215 20% 65%

**Price Indicators**:
- Positive/Gains: Use primary green shades
- Negative/Losses: 0 84% 60% (red-500)
- Neutral: 43 74% 66% (amber-400)

## Typography

### Font Families
- **Primary**: 'Inter' (Google Fonts) - UI text, data, tables
- **Display**: 'Space Grotesk' (Google Fonts) - Headers, coin names, hero titles
- **Mono**: 'JetBrains Mono' - Wallet addresses, transaction hashes, code

### Type Scale
- **Hero/Display**: text-5xl md:text-6xl, font-bold (Space Grotesk)
- **Page Headers**: text-3xl md:text-4xl, font-semibold (Space Grotesk)
- **Section Headers**: text-xl md:text-2xl, font-semibold (Inter)
- **Card Titles**: text-lg font-medium (Inter)
- **Body**: text-base, font-normal (Inter)
- **Captions/Labels**: text-sm, font-medium (Inter)
- **Data/Stats**: text-sm md:text-base, font-mono (JetBrains Mono)

## Layout System

### Spacing Primitives
Primary spacing units: **2, 4, 6, 8, 12, 16** (Tailwind units)
- Component padding: p-4 to p-6
- Section spacing: py-12 md:py-16
- Card gaps: gap-4 to gap-6
- Container max-width: max-w-7xl

### Grid System
- **Dashboard layouts**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- **Explore cards**: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
- **Data tables**: Full-width responsive tables with horizontal scroll on mobile
- **Profile layouts**: 2-column (sidebar + main content) on desktop, stacked on mobile

## Component Library

### Navigation
- **Top Bar**: Sticky header with glassmorphic backdrop-blur-md bg-white/80 dark:bg-slate-900/80
- **Wallet Button**: Prominent top-right position with RainbowKit styling
- **Tab Navigation**: Underlined active state with primary color, smooth transitions

### Cards & Containers
- **Coin Cards**: Rounded-xl, glassmorphic with border border-gray-200/50 dark:border-gray-700/50
- **Stat Cards**: bg-gradient-to-br from-primary-500/10 to-transparent backdrop-blur-sm
- **Modals/Overlays**: backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 with shadow-2xl

### Data Display
- **Price Charts**: Recharts with primary/accent colors, gridlines at opacity-20, responsive height
- **Tables**: Striped rows, sticky headers, hover states with bg-gray-50 dark:bg-gray-800/50
- **Stats Metrics**: Large numbers (text-2xl md:text-3xl font-bold) with small labels below
- **Percentage Changes**: Color-coded (+green, -red) with arrow icons (↑↓)

### Forms & Inputs
- **Input Fields**: border-gray-300 dark:border-gray-600, focus:ring-2 focus:ring-primary-500
- **Buttons Primary**: bg-primary-500 text-white hover:bg-primary-600, rounded-lg px-6 py-3
- **Buttons Secondary**: border-2 border-primary-500 text-primary-500 hover:bg-primary-50
- **Buttons on Images**: backdrop-blur-md bg-white/20 border-2 border-white/50 text-white

### Trading Interface
- **Swap Panel**: Large central card with token selectors, swap direction arrow, quote display
- **Slippage Settings**: Inline toggle or modal with preset options (0.5%, 1%, 3%, custom)
- **Transaction Preview**: Detailed breakdown before confirmation with gas estimates

## Visual Effects

### Glassmorphism Implementation
- **Primary glass**: backdrop-blur-md bg-white/70 dark:bg-slate-900/70
- **Subtle glass**: backdrop-blur-sm bg-white/50 dark:bg-slate-800/50
- **Strong glass**: backdrop-blur-xl bg-white/90 dark:bg-slate-900/90
- **Borders**: Always include border with 20-50% opacity for definition

### Shadows & Depth
- **Cards**: shadow-sm hover:shadow-md transition-shadow
- **Modals**: shadow-2xl
- **Floating elements**: shadow-lg
- **Avoid**: Excessive shadows; maintain subtlety

### Animations (Minimal)
- **Transitions**: transition-all duration-200 ease-in-out
- **Hover states**: Scale(1.02) or brightness adjustments only
- **Loading states**: Skeleton screens with pulse animation
- **No**: Auto-playing animations, distracting movements

## Page-Specific Layouts

### Home/Landing
- **Hero**: Full-width with subtle gradient overlay, large heading, wallet connect CTA, live stats ticker below
- **Features Grid**: 3-column showcase of key features (Explore, Trade, Create, Schedule)
- **Live Activity Feed**: Real-time transaction stream in card format

### Explore Page
- **Filter Tabs**: Horizontal scroll on mobile, full tabs on desktop
- **Coin Grid**: 4-column responsive grid with infinite scroll
- **Quick Stats**: Top bar showing total coins, 24h volume, trending indicator

### Coin Detail
- **Header**: Coin name/symbol, price (large), 24h change, market cap
- **Chart Section**: Full-width price chart with timeframe selector (1H, 24H, 7D, 30D)
- **Two-Column Layout**: Left (stats, holders table), Right (swap widget, comments)

### Trading Interface
- **Centered Panel**: max-w-lg mx-auto, prominent swap direction, live quote updates
- **Token Selectors**: Dropdown with search, token logos, balances shown
- **Settings**: Expandable section below swap for slippage, deadline

### Profile Page
- **Header Card**: Avatar (large), display name, bio, social links, creator coin badge
- **Tabs**: Created Coins | Portfolio | Activity
- **Grid Display**: Consistent card styling for coins/tokens

## Images & Media

### Hero Section
Large background image showing abstract blockchain/Web3 visuals with dark overlay (opacity-60) for text readability. Consider: Digital networks, glowing nodes, futuristic finance imagery.

### Coin Cards
Each coin displays its metadata image (from IPFS) as card thumbnail, aspect-ratio-square, rounded-lg, with fallback gradient if missing.

### Profile Avatars
Circular avatars (w-12 h-12 for small, w-24 h-24 for profile headers) with ring-2 ring-primary-500 for verified/creator accounts.

### Empty States
Custom illustrations for: no coins found, no transactions, wallet not connected - use primary color palette, simple line art style.

## Accessibility & Dark Mode

### Dark Mode Strategy
- Toggle in header (moon/sun icon)
- Persist preference in localStorage
- Maintain contrast ratios: 4.5:1 minimum for text
- Adjust glassmorphism opacity for dark backgrounds

### Interactive States
- **Focus**: ring-2 ring-offset-2 ring-primary-500
- **Disabled**: opacity-50 cursor-not-allowed
- **Loading**: Skeleton screens with consistent shapes
- **Error**: border-red-500 with error message below in text-red-600