'use client';

import { createContext, useContext, useCallback } from 'react';

const BalanceContext = createContext();

export const useBalanceRefresh = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalanceRefresh must be used within a BalanceProvider');
  }
  return context;
};

export const BalanceProvider = ({ children }) => {
  const refreshCallbacks = new Set();

  const registerRefreshCallback = useCallback((callback) => {
    refreshCallbacks.add(callback);
    
    // Return unregister function
    return () => {
      refreshCallbacks.delete(callback);
    };
  }, []);

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