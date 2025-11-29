'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  connectMetaMask, 
  signMessage, 
  isMetaMaskInstalled,
  getChainId,
  getNetworkName,
  switchToStoryTestnet,
  NETWORKS
} from '@/utils/wallet';
import { 
  getNonce, 
  authenticateWithSignature, 
  signupUser as apiSignupUser,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  setOnUnauthorizedCallback
} from '@/utils/api';
import { setupAuthTest } from '@/utils/authValidation';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [authToken, setAuthTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = getAuthToken();
    
    if (savedToken) {
      setAuthTokenState(savedToken);
    }
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setWallet(userData.wallet);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    
    // Set up unauthorized callback
    setOnUnauthorizedCallback(() => {
      logout();
    });
    
    // Check if wallet is already connected
    checkWalletConnection();
    
    // Set up auth testing functions for debugging
    setupAuthTest();
    
    // Check if MetaMask is available and set up account change listener
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          console.log('Wallet disconnected');
          logout();
        } else if (wallet && accounts[0].toLowerCase() !== wallet.toLowerCase()) {
          // User switched to different account
          console.log('Wallet account changed');
          logout();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Cleanup listener on unmount
      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
    
    setIsLoading(false);
  }, [wallet]);

  const connectWallet = async () => {
    try {
      const walletAddress = await connectMetaMask();
      
      // Check if on correct network
      const chainId = await getChainId();
      const networkName = getNetworkName(chainId);
      
      // If not on Story Protocol Testnet, prompt to switch
      if (chainId.toLowerCase() !== NETWORKS.STORY_TESTNET.chainId.toLowerCase()) {
        console.log(`Currently on ${networkName}. Switching to Story Protocol Testnet...`);
        try {
          await switchToStoryTestnet();
        } catch (switchError) {
          console.warn('Failed to switch network:', switchError);
          // Continue anyway - user can switch manually
        }
      }
      
      setWallet(walletAddress);
      return walletAddress;
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  };

  // Check if wallet is already connected on page load
  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0 && !wallet) {
          setWallet(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const signup = async () => {
    if (!wallet) {
      throw new Error('Please connect your wallet first');
    }

    try {
      // Create user account with wallet address as username
      // Backend expects { username, walletAddress } format
      const signupResponse = await apiSignupUser(wallet, wallet);
      
      if (!signupResponse.success) {
        throw new Error(signupResponse.message || 'Signup failed');
      }

      // Automatically login after successful signup
      await login();
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific error cases
      if (error.message && error.message.includes('already exists')) {
        throw new Error('This wallet is already registered. Please login instead.');
      }
      
      if (error.status === 500 && error.message.includes('already exists')) {
        throw new Error('This wallet is already registered. Please login instead.');
      }
      
      throw error;
    }
  };

  const login = async () => {
    if (!wallet) {
      throw new Error('Please connect your wallet first');
    }

    try {
      // Step 1: Construct message to sign (must match backend exactly)
      // Backend expects: "Welcome to Klaimit! Sign this message to login."
      const message = `Welcome to Klaimit! Sign this message to login.`;
      
      // Step 2: Sign message with wallet
      const signature = await signMessage(message);
      
      // Step 3: Authenticate with signature using the correct endpoint
      const { access_token } = await authenticateWithSignature(wallet, signature);
      
      // Step 4: Store token and update state
      setAuthToken(access_token);
      setAuthTokenState(access_token);
      
      // Step 5: Create user object
      const userData = {
        wallet: wallet,
        profileName: 'Klaim User' // Default name, can be updated later
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.message && (error.message.includes('rejected') || error.message.includes('denied') || error.message.includes('User rejected'))) {
        throw new Error('You rejected the signature request. Please try again.');
      } else if (error.status === 401) {
        if (error.message && (error.message.includes('not found') || error.message.includes('register first'))) {
          throw new Error('Account not found. Please sign up first.');
        }
        throw new Error('Authentication failed. Invalid signature or account not found.');
      } else if (error.message && (error.message.includes('not found') || error.message.includes('register first'))) {
        throw new Error('Account not found. Please sign up first.');
      } else if (error.message && error.message.includes('Invalid signature')) {
        throw new Error('Authentication failed. Please try signing the message again.');
      }
      
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setWallet(null);
    setAuthTokenState(null);
    clearAuthToken();
    localStorage.removeItem('user');
    localStorage.removeItem('connected_wallet');
  };

  const value = {
    user,
    wallet,
    authToken,
    isLoading,
    isAuthenticated: !!user && !!authToken,
    connectWallet,
    signup,
    login,
    logout,
    checkWalletConnection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}