'use client';

import { createContext, useContext, useCallback } from 'react';

/**
 * Balance Refresh Context for Global Balance Coordination
 * 
 * This context provides a centralized system for coordinating KIP token balance
 * updates across the entire application. It implements a callback registration
 * system that allows multiple components to subscribe to balance refresh events
 * and automatically update their displayed balances when transactions occur.
 * The context prevents excessive API calls by coordinating refresh timing and
 * ensures consistent balance display across all UI components.
 */

const BalanceContext = createContext();

// Context hook with validation for proper provider usage
export const useBalanceRefresh = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalanceRefresh must be used within a BalanceProvider');
  }
  return context;
};

/**
 * Balance refresh coordination provider with callback management.
 * 
 * This provider manages a registry of refresh callbacks from various components
 * and provides a centralized trigger mechanism for coordinating balance updates.
 * It ensures that all subscribed components receive balance refresh notifications
 * simultaneously while handling callback registration and cleanup automatically.
 */
export const BalanceProvider = ({ children }) => {
  const refreshCallbacks = new Set();

  // Callback registration system with automatic cleanup function return
  const registerRefreshCallback = useCallback((callback) => {
    refreshCallbacks.add(callback);
    
    // Return unregister function
    return () => {
      refreshCallbacks.delete(callback);
    };
  }, []);

  // Global balance refresh trigger with error handling for all registered callbacks
  const triggerBalanceRefresh = useCallback(() => {
    refreshCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in balance refresh callback:', error);
      }
    });
  }, []);

  const value = {
    registerRefreshCallback,
    triggerBalanceRefresh
  };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
};