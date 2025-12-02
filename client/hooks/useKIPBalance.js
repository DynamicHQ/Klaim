'use client';

import { useState, useEffect, useCallback } from 'react';
import { getIPTBalance } from '@/utils/contracts';
import { useBalanceRefresh } from '@/contexts/BalanceContext';

/**
 * Custom hook for managing KIP token balance display and caching.
 * 
 * This hook provides real-time KIP token balance management with intelligent caching,
 * automatic refresh capabilities, and integration with the global balance refresh system.
 * It handles loading states, error scenarios, and provides formatted balance display
 * suitable for UI components. The hook implements a 30-second cache duration to
 * minimize unnecessary blockchain calls while ensuring users see up-to-date balances.
 * 
 * @param {string} address - The wallet address to fetch balance for
 * @returns {Object} Balance state including formatted balance, loading state, and refresh function
 */
export const useKIPBalance = (address) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const { registerRefreshCallback } = useBalanceRefresh();

  // Cache duration: 30 seconds
  const CACHE_DURATION = 30 * 1000;

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
    if (!address) {
      setBalance(null);
      setError(null);
      setLastUpdated(null);
      return;
    }

    // Check cache validity
    const now = Date.now();
    if (!forceRefresh && lastUpdated && (now - lastUpdated) < CACHE_DURATION) {
      return; // Use cached data
    }

    setLoading(true);
    setError(null);

    try {
      const balanceValue = await getIPTBalance(address);
      setBalance(balanceValue);
      setLastUpdated(now);
    } catch (err) {
      console.error('Failed to fetch KIP balance:', err);
      setError(err.message || 'Failed to fetch balance');
      // Don't clear balance on error to show last known value
    } finally {
      setLoading(false);
    }
  }, [address, lastUpdated]);

  // Debounced refresh to prevent excessive API calls during rapid updates
  const debouncedRefresh = useCallback(() => {
    const timeoutId = setTimeout(() => {
      fetchBalance(true);
    }, 1000); // 1 second delay

    return () => clearTimeout(timeoutId);
  }, [fetchBalance]);

  // Fetch balance when address changes
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Manual refresh function for immediate balance updates
  const refetch = useCallback(() => {
    return fetchBalance(true);
  }, [fetchBalance]);

  // Register for balance refresh events with debouncing
  useEffect(() => {
    if (address) {
      const unregister = registerRefreshCallback(() => {
        const cleanup = debouncedRefresh();
        return cleanup;
      });
      return unregister;
    }
  }, [address, registerRefreshCallback, debouncedRefresh]);

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
    lastUpdated
  };
};