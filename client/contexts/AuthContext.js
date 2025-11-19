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
    
    setIsLoading(false);
  }, []);

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

  const signup = async (username) => {
    if (!wallet) {
      throw new Error('Please connect your wallet first');
    }

    try {
      // Create user account
      const signupResponse = await apiSignupUser(username, wallet);
      
      if (!signupResponse.success) {
        throw new Error(signupResponse.message || 'Signup failed');
      }

      // Automatically login after successful signup
      await login();
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific error cases
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
      // Step 1: Get nonce from backend
      const { nonce } = await getNonce(wallet);
      
      // Step 2: Construct message to sign
      const message = `Welcome to Klaimit! Sign this nonce to login: ${nonce}`;
      
      // Step 3: Sign message with wallet
      const signature = await signMessage(message);
      
      // Step 4: Authenticate with signature
      const { access_token } = await authenticateWithSignature(wallet, signature);
      
      // Step 5: Store token and update state
      setAuthToken(access_token);
      setAuthTokenState(access_token);
      
      // Step 6: Create user object (we'll get full user data from backend in future)
      const userData = {
        wallet: wallet,
        profileName: 'Klaimit User' // Default name, can be updated later
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.message.includes('rejected')) {
        throw new Error('You rejected the signature request. Please try again.');
      } else if (error.status === 401) {
        throw new Error('Authentication failed. Please try again.');
      } else if (error.message.includes('not found')) {
        throw new Error('Account not found. Please sign up first.');
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
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}