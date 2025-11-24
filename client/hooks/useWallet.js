'use client';

import { useState, useEffect } from 'react';
import { syncWallet } from '@/utils/api';

/**
 * Custom hook for MetaMask wallet connection and management.
 * 
 * This hook provides comprehensive wallet connection functionality including
 * automatic connection detection, manual connection initiation, and real-time
 * account change monitoring. It handles MetaMask integration, error scenarios,
 * and maintains synchronization with the backend API. The hook automatically
 * detects existing connections on page load and provides seamless wallet
 * management throughout the user session with proper cleanup and event handling.
 * 
 * @returns {Object} Wallet state and connection functions
 */
export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  /**
   * Automatic wallet connection detection and initialization.
   * 
   * This function checks for existing MetaMask connections on component mount
   * and automatically establishes the connection state if a wallet is already
   * connected. It handles the initial synchronization with the backend API
   * and sets up the local storage for persistent connection state management.
   */
  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });

        if (accounts.length > 0) {
          const addr = accounts[0];
          setAccount(addr);
          setIsConnected(true);
          try {
            await syncWallet(addr);
            // store locally so other parts can read quickly
            if (typeof window !== 'undefined') localStorage.setItem('walletAddress', addr);
          } catch (err) {
            console.error('Failed to sync wallet on checkConnection:', err);
            setError(err.message || 'Failed to sync wallet');
          }
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    }
  };

  /**
   * Manual wallet connection initiation with comprehensive error handling.
   * 
   * This function handles user-initiated wallet connections through MetaMask,
   * including permission requests, account retrieval, and backend synchronization.
   * It provides detailed error handling for various failure scenarios including
   * missing MetaMask, user rejection, and network issues. The function ensures
   * proper state management and persistence of connection data.
   */
  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const addr = accounts[0];
        setAccount(addr);
        setIsConnected(true);
        try {
          await syncWallet(addr);
          if (typeof window !== 'undefined') localStorage.setItem('walletAddress', addr);
        } catch (err) {
          console.error('Failed to sync wallet after connect:', err);
          setError(err.message || 'Failed to sync wallet');
        }
      }
    } catch (err) {
      if (err.code === 4001) {
        setError('Please connect to MetaMask.');
      } else {
        setError('An error occurred while connecting to MetaMask.');
      }
      console.error('Error connecting wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  // Wallet disconnection with backend synchronization and state cleanup
  const disconnectWallet = async () => {
    // Inform backend that wallet is no longer connected by sending empty string
    try {
      await syncWallet('');
    } catch (err) {
      console.error('Failed to sync wallet on disconnect:', err);
    }

    setAccount(null);
    setIsConnected(false);
    setError(null);
    if (typeof window !== 'undefined') localStorage.removeItem('walletAddress');
  };

  // Real-time MetaMask event monitoring for account and network changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
          await disconnectWallet();
        } else {
          const addr = accounts[0];
          setAccount(addr);
          setIsConnected(true);
          try {
            await syncWallet(addr);
            if (typeof window !== 'undefined') localStorage.setItem('walletAddress', addr);
          } catch (err) {
            console.error('Failed to sync wallet on accountsChanged:', err);
            setError(err.message || 'Failed to sync wallet');
          }
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return {
    account,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet
  };
};