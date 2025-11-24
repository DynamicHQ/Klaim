'use client';

import { useState, useEffect, useCallback } from 'react';
import { getIPTBalance } from '@/utils/contracts';
import { useBalanceRefresh } from '@/contexts/BalanceContext';

export const useKIPBalance = (address) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const { registerRefreshCallback } = useBalanceRefresh();

  // Cache duration: 30 seconds
  const CACHE_DURATION = 30 * 1000;

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

  // Debounced refresh to prevent excessive API calls
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

  // Manual refresh function
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

  // Format balance for display
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