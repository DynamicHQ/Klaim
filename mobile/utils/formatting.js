/**
 * Formatting utilities for React Native mobile app
 * Provides display formatting functions for addresses, numbers, dates, etc.
 */

/**
 * Format Ethereum address for display (shortened)
 * @param {string} address - Full Ethereum address
 * @param {number} startChars - Number of characters to show at start (default: 6)
 * @param {number} endChars - Number of characters to show at end (default: 4)
 * @returns {string} Formatted address (e.g., "0x1234...5678")
 */
export function formatAddress(address, startChars = 6, endChars = 4) {
  if (!address || typeof address !== 'string') return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format number with commas for thousands
 * @param {number|string} value - Number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number (e.g., "1,234.56")
 */
export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined) return '0';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format KIP token amount for display
 * @param {number|string} amount - Token amount
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted amount with KIP suffix (e.g., "123.45 KIP")
 */
export function formatKIPAmount(amount, decimals = 2) {
  const formatted = formatNumber(amount, decimals);
  return `${formatted} KIP`;
}

/**
 * Format large numbers with K, M, B suffixes
 * @param {number|string} value - Number to format
 * @returns {string} Formatted number (e.g., "1.2K", "3.4M")
 */
export function formatCompactNumber(value) {
  if (value === null || value === undefined) return '0';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toFixed(0);
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDay < 30) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  } else {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Whether to include time (default: false)
 * @returns {string} Formatted date string
 */
export function formatDate(date, includeTime = false) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Format transaction hash for display (shortened)
 * @param {string} hash - Transaction hash
 * @param {number} startChars - Number of characters to show at start (default: 8)
 * @param {number} endChars - Number of characters to show at end (default: 6)
 * @returns {string} Formatted hash
 */
export function formatTxHash(hash, startChars = 8, endChars = 6) {
  return formatAddress(hash, startChars, endChars);
}

/**
 * Format file size in bytes to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format percentage
 * @param {number} value - Value to format as percentage (0-1 or 0-100)
 * @param {boolean} isDecimal - Whether value is decimal (0-1) or percentage (0-100)
 * @returns {string} Formatted percentage (e.g., "75%")
 */
export function formatPercentage(value, isDecimal = true) {
  if (value === null || value === undefined) return '0%';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0%';
  
  const percentage = isDecimal ? num * 100 : num;
  return `${percentage.toFixed(1)}%`;
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Capitalize first letter of string
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export function capitalizeFirst(text) {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format price with currency symbol
 * @param {number|string} price - Price to format
 * @param {string} currency - Currency symbol (default: 'KIP')
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted price
 */
export function formatPrice(price, currency = 'KIP', decimals = 2) {
  const formatted = formatNumber(price, decimals);
  return `${formatted} ${currency}`;
}

export default {
  formatAddress,
  formatNumber,
  formatKIPAmount,
  formatCompactNumber,
  formatRelativeTime,
  formatDate,
  formatTxHash,
  formatFileSize,
  formatPercentage,
  truncateText,
  capitalizeFirst,
  formatPrice
};
