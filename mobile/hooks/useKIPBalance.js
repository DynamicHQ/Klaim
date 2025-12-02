import { useState, useEffect, useCallback } from 'react';
import { getIPTBalance } from '../utils/contracts';
import { useWallet } from '../contexts/WalletContext';
import { useCache } from '../contexts/CacheContext';

/**
 * Custom hook for managing KIP token balance display and caching (Mobile).
 * 
 * This hook provides real-time KIP token balance management with intelligent caching,
 * automatic refresh capabilities, and offline support through CacheContext.
 * Adapted from the web client to work with WalletConnect instead of Wagmi.
 * It handles loading states, error scenarios, and provides formatted balance display
 * suitable for UI components. The hook implements a 30-second cache duration to
 * minimize unnecessary blockchain calls while ensuring users see up-to-date balances.
 * 
 * @param {string} address - The wallet address to fetch balance for (optional, uses connected wallet if not provided)
 * @returns {Object} Balance state including formatted balance, loading state, and refresh function
 */
export const useKIPBalance = (address) => {
  const { address: connectedAddress, provider, isConnected } = useWallet();
  const { getCached, setCache, TTL } = useCache();
  
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Use provided address or connected wallet address
  const targetAddress = address || connectedAddress;

  // Cache duration: 30 seconds
  const CACHE_DURATION = 30 * 1000;
  const CACHE_KEY = `kip_balance_${targetAddress}`;

  /**
   * Core balance fetching function with caching and error handling.
   * 
   * This function manages the complete balance retrieval process including cache validation,
   * blockchain interaction, and state management. It implements intelligent caching to
   * reduce API calls while providing force refresh capabilities for immediate updates.
   * The function handles various error scenarios gracefully and maintains the last known
   * balance value during temporary failures to provide better user experience.
   */
  const fetchBalance = useCallback(async (forceRefresh = false) => {
    if (!targetAddress || !provider) {
      setBalance(null);
      setError(null);
      setLastUpdated(null);
      return;
    }

    // Check cache validity first (unless force refresh)
    if (!forceRefresh) {
      try {
        const cachedBalance = await getCached(CACHE_KEY);
        if (cachedBalance !== null) {
          setBalance(cachedBalance);
          setLastUpdated(Date.now());
          return; // Use cached data
        }
      } catch (cacheError) {
        console.warn('Cache read error:', cacheError);
        // Continue to fetch from blockchain
      }
    }

    setLoading(true);
    setError(null);

    try {
      const balanceValue = await getIPTBalance(provider, targetAddress);
      setBalance(balanceValue);
      setLastUpdated(Date.now());

      // Cache the balance
      await setCache(CACHE_KEY, balanceValue, CACHE_DURATION);
    } catch (err) {
      console.error('Failed to fetch KIP balance:', err);
      setError(err.message || 'Failed to fetch balance');
      // Don't clear balance on error to show last known value
    } finally {
      setLoading(false);
    }
  }, [targetAddress, provider, getCached, setCache, CACHE_KEY, CACHE_DURATION]);

  // Fetch balance when address or provider changes
  useEffect(() => {
    if (isConnected && targetAddress && provider) {
      fetchBalance();
    } else {
      setBalance(null);
      setError(null);
      setLastUpdated(null);
    }
  }, [targetAddress, provider, isConnected, fetchBalance]);

  // Manual refresh function for immediate balance updates
  const refetch = useCallback(() => {
    return fetchBalance(true);
  }, [fetchBalance]);

  /**
   * Balance formatting utility for user-friendly display.
   * 
   * This function converts raw balance values into human-readable formats with
   * appropriate decimal places and unit suffixes. It handles edge cases like
   * zero balances, very small amounts, and large numbers with K/M suffixes.
   * The formatting ensures consistent display across different UI components
   * while maintaining precision for meaningful amounts.
   */
  const formatBalance = useCallback((value) => {
    if (value === null || value === undefined) return null;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '0';
    
    // Format with appropriate decimal places
    if (numValue === 0) return '0';
    if (numValue < 0.001) return '<0.001';
    if (numValue < 1) return numValue.toFixed(3);
    if (numValue < 1000) return numValue.toFixed(2);
    if (numValue < 1000000) return (numValue / 1000).toFixed(1) + 'K';
    return (numValue / 1000000).toFixed(1) + 'M';
  }, []);

  return {
    balance,
    loading,
    error,
    refetch,
    formatBalance,
    formattedBalance: formatBalance(balance),
    lastUpdated,
    isConnected,
  };
};
