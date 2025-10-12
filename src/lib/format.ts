import { formatDistanceToNow, format } from 'date-fns';

// ============================================
// CONSTANTS
// ============================================

export const PROFILE_BANNER_URL = 'https://res.cloudinary.com/dg5rr4ntw/image/upload/c_scale,f_auto,q_auto:good,w_1200/v1760302732/header-background_vvtlar.jpg';
export const LOGO_URL = 'https://res.cloudinary.com/dg5rr4ntw/image/upload/c_scale,f_auto,q_auto:good,w_120/v1760304294/ChatGPT_Image_Oct_13_2025_12_23_36_AM_lplfpq.png';

// ============================================
// ADDRESS FORMATTING
// ============================================

export const truncateAddress = (address: string, start = 6, end = 4): string => {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

// Alias for truncateAddress
export const formatAddress = truncateAddress;

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// ============================================
// NUMBER FORMATTING
// ============================================

export const formatNumber = (value: number | string, decimals = 2): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(decimals)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(decimals)}K`;
  }
  return num.toFixed(decimals);
};

export const formatCurrency = (value: number | string, currency = '$'): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return `${currency}0`;
  return `${currency}${formatNumber(num, 2)}`;
};

/**
 * Format very small token prices with appropriate decimals
 * For prices < 0.01, show up to 6 significant figures
 */
export const formatTokenPrice = (price: string | number, currency = '$'): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num) || num === 0) return `${currency}0`;
  
  // For prices >= $0.01, use 4 decimals
  if (num >= 0.01) {
    return `${currency}${num.toFixed(4)}`;
  }
  
  // For very small prices, use scientific notation or show significant figures
  if (num < 0.000001) {
    return `${currency}${num.toExponential(2)}`;
  }
  
  // For small prices (0.000001 to 0.01), show 6 decimals
  return `${currency}${num.toFixed(6)}`;
};

export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

// ============================================
// WEI CONVERSION
// ============================================

/**
 * Safely converts a value that might be in wei or already formatted
 * Backend returns mixed formats - some values are already in ETH/USD
 */
export const safeParseNumber = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
};

export const weiToEth = (wei: string | bigint | number | null | undefined): string => {
  if (wei === null || wei === undefined || wei === '') return '0';
  
  // If it's already a small number (< 1000), it's likely already in ETH format
  const numValue = typeof wei === 'string' ? parseFloat(wei) : typeof wei === 'bigint' ? Number(wei) : wei;
  if (!isNaN(numValue) && numValue < 1000) {
    return numValue.toFixed(6);
  }
  
  // Otherwise, treat as wei and convert
  try {
    const weiValue = typeof wei === 'bigint' ? wei : BigInt(wei);
    const eth = Number(weiValue) / 1e18;
    return eth.toFixed(6);
  } catch {
    // If conversion fails, return the value as-is
    const fallbackNum = typeof wei === 'bigint' ? Number(wei) : safeParseNumber(wei);
    return fallbackNum.toFixed(6);
  }
};

export const ethToWei = (eth: string): string => {
  const weiValue = BigInt(Math.floor(parseFloat(eth) * 1e18));
  return weiValue.toString();
};

export const formatTokenAmount = (
  amount: string,
  decimals = 18,
  displayDecimals = 4
): string => {
  const value = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;

  const fractionalString = fractionalPart
    .toString()
    .padStart(decimals, '0')
    .slice(0, displayDecimals);

  return `${integerPart}.${fractionalString}`;
};

/**
 * Format holder balance from very long string to readable number
 * API returns balance as string like "000000000000000000000000000000000000000000000000000080387621439635601050844548"
 */
export const formatHolderBalance = (balance: string): string => {
  if (!balance || balance === '0') return '0';
  
  try {
    // Remove leading zeros
    const cleanBalance = balance.replace(/^0+/, '') || '0';
    
    // If it's a very large number string, convert to BigInt then to readable format
    if (cleanBalance.length > 18) {
      const balanceBigInt = BigInt(balance);
      const divisor = BigInt(10 ** 18); // Assuming 18 decimals
      const integerPart = balanceBigInt / divisor;
      const fractionalPart = balanceBigInt % divisor;
      
      // Format with appropriate decimals
      const fractionalString = fractionalPart.toString().padStart(18, '0').slice(0, 4);
      const formattedNumber = Number(`${integerPart}.${fractionalString}`);
      
      return formatNumber(formattedNumber, 2);
    }
    
    // For shorter numbers, just parse and format
    const num = parseFloat(cleanBalance);
    return formatNumber(num, 2);
  } catch {
    return '0';
  }
};

// ============================================
// DATE FORMATTING
// ============================================

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatTimeAgo = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isDateInFuture = (date: string | Date): boolean => {
  return new Date(date) > new Date();
};

export const getTimeUntil = (date: string | Date): string => {
  const target = new Date(date);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return 'Now';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// ============================================
// VALIDATION
// ============================================

export const validateAmount = (amount: string): boolean => {
  if (!amount || amount === '0') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateSlippage = (slippage: number): boolean => {
  return slippage >= 0 && slippage < 1;
};

// ============================================
// PRICE IMPACT
// ============================================

export const getPriceImpactColor = (impact: number): string => {
  if (impact < 1) return 'text-green-600';
  if (impact < 3) return 'text-yellow-600';
  if (impact < 5) return 'text-orange-600';
  return 'text-red-600';
};

export const getPriceImpactSeverity = (
  impact: number
): 'low' | 'medium' | 'high' | 'critical' => {
  if (impact < 1) return 'low';
  if (impact < 3) return 'medium';
  if (impact < 5) return 'high';
  return 'critical';
};

// ============================================
// STATUS HELPERS
// ============================================

export const getStatusColor = (
  status: string
): { bg: string; text: string; border: string } => {
  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    pending: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-200',
      border: 'border-yellow-300 dark:border-yellow-700',
    },
    processing: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-200',
      border: 'border-blue-300 dark:border-blue-700',
    },
    completed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-200',
      border: 'border-green-300 dark:border-green-700',
    },
    failed: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-200',
      border: 'border-red-300 dark:border-red-700',
    },
    cancelled: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-800 dark:text-gray-200',
      border: 'border-gray-300 dark:border-gray-600',
    },
  };

  return (
    statusColors[status.toLowerCase()] || statusColors.pending
  );
};

// ============================================
// COPY TO CLIPBOARD
// ============================================

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// ============================================
// IPFS HELPERS
// ============================================

export const getIpfsUrl = (uri: string, gateway = 'https://ipfs.io/ipfs/'): string => {
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', gateway);
  }
  return uri;
};

export const isIpfsUri = (uri: string): boolean => {
  return uri.startsWith('ipfs://');
};

// ============================================
// TRANSACTION HELPERS
// ============================================

export const getExplorerUrl = (
  hash: string,
  type: 'tx' | 'address' | 'token' = 'tx',
  chainId = 8453
): string => {
  const baseUrls: Record<number, string> = {
    8453: 'https://basescan.org', // Base
    1: 'https://etherscan.io', // Ethereum
  };

  const baseUrl = baseUrls[chainId] || baseUrls[8453];
  return `${baseUrl}/${type}/${hash}`;
};

export const openInExplorer = (
  hash: string,
  type: 'tx' | 'address' | 'token' = 'tx',
  chainId = 8453
): void => {
  window.open(getExplorerUrl(hash, type, chainId), '_blank', 'noopener,noreferrer');
};
