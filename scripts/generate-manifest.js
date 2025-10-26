import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load .env file
config({ path: path.join(process.cwd(), '.env') });

const manifest = {
  accountAssociation: {
    header: process.env.VITE_ACCOUNT_ASSOCIATION_HEADER || "",
    payload: process.env.VITE_ACCOUNT_ASSOCIATION_PAYLOAD || "",
    signature: process.env.VITE_ACCOUNT_ASSOCIATION_SIGNATURE || ""
  },
  baseBuilder: {
    ownerAddress: process.env.VITE_BASE_BUILDER_OWNER_ADDRESS || "0x"
  },
  miniapp: {
    version: "1",
    name: process.env.VITE_MINIAPP_NAME || "Zora Agent - AI-Powered Coins Explorer",
    homeUrl: process.env.VITE_MINIAPP_HOME_URL || "https://your-domain.com",
    iconUrl: process.env.VITE_MINIAPP_ICON_URL || "https://your-domain.com/icon.png",
    splashImageUrl: process.env.VITE_MINIAPP_SPLASH_IMAGE_URL || "https://your-domain.com/splash.png",
    splashBackgroundColor: '#FFFFFF',
    webhookUrl: process.env.VITE_MINIAPP_WEBHOOK_URL || "https://your-domain.com/api/webhook",
    subtitle: process.env.VITE_MINIAPP_SUBTITLE || "AI-Powered Zora Coin Explorer",
    description: process.env.VITE_MINIAPP_DESCRIPTION || "Full-featured Web3 dashboard for discovering, creating, trading, and scheduling Zora Coins on Base blockchain. Connect your wallet and explore the future of creator coins.",
    screenshotUrls: (process.env.VITE_MINIAPP_SCREENSHOT_URLS || "https://your-domain.com/screenshot1.png,https://your-domain.com/screenshot2.png,https://your-domain.com/screenshot3.png").split(','),
    primaryCategory: process.env.VITE_MINIAPP_PRIMARY_CATEGORY || "finance",
    tags: (process.env.VITE_MINIAPP_TAGS || "zora,coins,ai,web3,base").split(','),
    heroImageUrl: process.env.VITE_MINIAPP_HERO_IMAGE_URL || "https://your-domain.com/hero.png",
    tagline: process.env.VITE_MINIAPP_TAGLINE || "Explore Zora Coins with AI",
    ogTitle: process.env.VITE_MINIAPP_OG_TITLE || "Zora Agent - AI-Powered Coins Explorer",
    ogDescription: process.env.VITE_MINIAPP_OG_DESCRIPTION || "Discover and trade Zora coins with AI insights on Base.",
    ogImageUrl: process.env.VITE_MINIAPP_OG_IMAGE_URL || "https://your-domain.com/og.png",
    noindex: process.env.VITE_MINIAPP_NOINDEX === "true"
  }
};

const manifestPath = path.join(process.cwd(), 'public', '.well-known', 'farcaster.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('Manifest generated at', manifestPath);