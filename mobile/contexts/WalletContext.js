import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';

const WalletContext = createContext();

// WalletConnect project ID - should be in .env
const PROJECT_ID = process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

// Story Protocol Testnet configuration
const STORY_TESTNET = {
  chainId: '0x5b9',
  chainName: 'Story Protocol Testnet',
  nativeCurrency: {
    name: 'IP',
    symbol: 'IP',
    decimals: 18,
  },
  rpcUrls: ['https://testnet.storyrpc.io'],
  blockExplorerUrls: ['https://testnet.storyscan.xyz'],
};

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);

  const { open, isOpen, provider: wcProvider } = useWalletConnectModal();

  // Load saved wallet address on mount
  useEffect(() => {
    loadSavedWallet();
  }, []);

  // Handle WalletConnect provider changes
  useEffect(() => {
    if (wcProvider) {
      handleProviderConnection(wcProvider);
    }
  }, [wcProvider]);

  const loadSavedWallet = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem('wallet_address');
      const savedChainId = await AsyncStorage.getItem('wallet_chainId');
      
      if (savedAddress) {
        setAddress(savedAddress);
        setIsConnected(true);
        if (savedChainId) {
          setChainId(savedChainId);
        }
      }
    } catch (error) {
      console.error('Error loading saved wallet:', error);
    }
  };

  const handleProviderConnection = async (wcProvider) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(wcProvider);
      setProvider(ethersProvider);

      // Get accounts
      const accounts = await wcProvider.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        const walletAddress = accounts[0];
        setAddress(walletAddress);
        setIsConnected(true);

        // Save to AsyncStorage
        await AsyncStorage.setItem('wallet_address', walletAddress);

        // Get chain ID
        const network = await ethersProvider.getNetwork();
        const currentChainId = '0x' + network.chainId.toString(16);
        setChainId(currentChainId);
        await AsyncStorage.setItem('wallet_chainId', currentChainId);
      }

      // Set up event listeners
      wcProvider.on('accountsChanged', handleAccountsChanged);
      wcProvider.on('chainChanged', handleChainChanged);
      wcProvider.on('disconnect', handleDisconnect);
    } catch (error) {
      console.error('Error handling provider connection:', error);
      setError(error.message);
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts && accounts.length > 0) {
      const newAddress = accounts[0];
      setAddress(newAddress);
      await AsyncStorage.setItem('wallet_address', newAddress);
    } else {
      await disconnect();
    }
  };

  const handleChainChanged = async (newChainId) => {
    setChainId(newChainId);
    await AsyncStorage.setItem('wallet_chainId', newChainId);
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Open WalletConnect modal
      await open();
      
      // The connection will be handled by the useEffect watching wcProvider
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError(error.message || 'Failed to connect wallet');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [open]);

  const disconnect = useCallback(async () => {
    try {
      // Disconnect WalletConnect session
      if (wcProvider && wcProvider.disconnect) {
        await wcProvider.disconnect();
      }

      // Clear state
      setAddress(null);
      setProvider(null);
      setIsConnected(false);
      setChainId(null);
      setError(null);

      // Clear AsyncStorage
      await AsyncStorage.removeItem('wallet_address');
      await AsyncStorage.removeItem('wallet_chainId');
    } catch (error) {
      console.error('Disconnect error:', error);
      throw error;
    }
  }, [wcProvider]);

  const getSigner = useCallback(async () => {
    if (!provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const signer = await provider.getSigner();
      return signer;
    } catch (error) {
      console.error('Error getting signer:', error);
      throw error;
    }
  }, [provider]);

  const switchToStoryTestnet = useCallback(async () => {
    if (!wcProvider) {
      throw new Error('Wallet not connected');
    }

    try {
      // Try to switch to Story Testnet
      await wcProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: STORY_TESTNET.chainId }],
      });
    } catch (switchError) {
      // If chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await wcProvider.request({
            method: 'wallet_addEthereumChain',
            params: [STORY_TESTNET],
          });
        } catch (addError) {
          console.error('Error adding Story Testnet:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to Story Testnet:', switchError);
        throw switchError;
      }
    }
  }, [wcProvider]);

  const isOnStoryTestnet = useCallback(() => {
    return chainId?.toLowerCase() === STORY_TESTNET.chainId.toLowerCase();
  }, [chainId]);

  const value = {
    address,
    provider,
    isConnected,
    isConnecting,
    chainId,
    error,
    connect,
    disconnect,
    getSigner,
    switchToStoryTestnet,
    isOnStoryTestnet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
      <WalletConnectModal
        projectId={PROJECT_ID}
        providerMetadata={{
          name: 'Klaim Mobile',
          description: 'IP Asset Marketplace',
          url: 'https://klaim.io',
          icons: ['https://klaim.io/icon.png'],
        }}
      />
    </WalletContext.Provider>
  );
}
