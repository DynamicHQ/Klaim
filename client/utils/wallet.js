/*
 * Wallet utility for MetaMask integration
 * Handles wallet connection, message signing, and event listeners
 * Check if MetaMask is installed
 * @returns {boolean} True if MetaMask is installed
 */
export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Connect to MetaMask and get wallet address
 * @returns {Promise<string>} Connected wallet address
 * @throws {Error} If MetaMask is not installed or user rejects connection
 */
export async function connectMetaMask() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    return accounts[0];
  } catch (error) {
    // Handle specific MetaMask error codes
    if (error.code === 4001) {
      throw new Error('You rejected the wallet connection request.');
    } else if (error.code === -32002) {
      throw new Error('Please check your wallet for a pending connection request.');
    }
    throw error;
  }
}

/**
 * Sign a message with the connected wallet
 * @param {string} message - Message to sign
 * @returns {Promise<string>} Signature
 * @throws {Error} If signing fails or user rejects
 */
export async function signMessage(message) {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed.');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No wallet connected. Please connect your wallet first.');
    }

    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, accounts[0]],
    });

    return signature;
  } catch (error) {
    // Handle specific MetaMask error codes
    if (error.code === 4001) {
      throw new Error('You rejected the signature request.');
    } else if (error.code === -32602) {
      throw new Error('Invalid signature request parameters.');
    }
    throw error;
  }
}

/**
 * Get currently connected accounts
 * @returns {Promise<string[]>} Array of connected wallet addresses
 */
export async function getAccounts() {
  if (!isMetaMaskInstalled()) {
    return [];
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts || [];
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
}

/*
* Fetching registered IP on your wallet
* returns an object of Registered IP
*/

export function async getMyNFTs() {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts || [];
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
}

/*
 * Listen for account changes
 * @param {Function} callback - Callback function that receives array of accounts
 * @returns {Function} Cleanup function to remove listener
 */
export function onAccountsChanged(callback) {
  if (!isMetaMaskInstalled()) {
    console.warn('MetaMask is not installed');
    return () => {};
  }

  const handler = (accounts) => {
    callback(accounts);
  };

  window.ethereum.on('accountsChanged', handler);

  // Return cleanup function
  return () => {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('accountsChanged', handler);
    }
  };
}

/**
 * Listen for chain/network changes
 * @param {Function} callback - Callback function that receives chainId
 * @returns {Function} Cleanup function to remove listener
 */
export function onChainChanged(callback) {
  if (!isMetaMaskInstalled()) {
    console.warn('MetaMask is not installed');
    return () => {};
  }

  const handler = (chainId) => {
    callback(chainId);
  };

  window.ethereum.on('chainChanged', handler);

  // Return cleanup function
  return () => {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('chainChanged', handler);
    }
  };
}

/**
 * Get current chain ID
 * @returns {Promise<string>} Current chain ID in hex format
 */
export async function getChainId() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed.');
  }

  try {
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    return chainId;
  } catch (error) {
    console.error('Error getting chain ID:', error);
    throw error;
  }
}

// Network configurations
export const NETWORKS = {
  STORY_TESTNET: {
    chainId: '0x5E9', // 1513 in decimal
    chainName: 'Story Protocol Testnet',
    nativeCurrency: {
      name: 'IP',
      symbol: 'IP',
      decimals: 18,
    },
    rpcUrls: ['https://testnet.storyrpc.io'],
    blockExplorerUrls: ['https://testnet.storyscan.xyz'],
  },
  SEPOLIA: {
    chainId: '0xaa36a7', // 11155111 in decimal
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
};

/**
 * Switch to a specific network
 * @param {Object} network - Network configuration object
 * @returns {Promise<boolean>} True if switch was successful
 */
export async function switchNetwork(network) {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed.');
  }

  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }],
    });
    return true;
  } catch (error) {
    // If the network doesn't exist, add it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [network],
        });
        return true;
      } catch (addError) {
        console.error('Error adding network:', addError);
        throw new Error('Failed to add network to MetaMask');
      }
    } else if (error.code === 4001) {
      throw new Error('You rejected the network switch request.');
    }
    throw error;
  }
}

/**
 * Switch to Story Protocol Testnet
 * @returns {Promise<boolean>} True if switch was successful
 */
export async function switchToStoryTestnet() {
  return switchNetwork(NETWORKS.STORY_TESTNET);
}

/**
 * Switch to Sepolia Testnet
 * @returns {Promise<boolean>} True if switch was successful
 */
export async function switchToSepolia() {
  return switchNetwork(NETWORKS.SEPOLIA);
}

/**
 * Check if user is on the correct network
 * @param {string} expectedChainId - Expected chain ID in hex format
 * @returns {Promise<boolean>} True if on correct network
 */
export async function isOnCorrectNetwork(expectedChainId) {
  const currentChainId = await getChainId();
  return currentChainId.toLowerCase() === expectedChainId.toLowerCase();
}

/**
 * Get network name from chain ID
 * @param {string} chainId - Chain ID in hex format
 * @returns {string} Network name
 */
export function getNetworkName(chainId) {
  const chainIdLower = chainId.toLowerCase();
  
  if (chainIdLower === NETWORKS.STORY_TESTNET.chainId.toLowerCase()) {
    return 'Story Protocol Testnet';
  } else if (chainIdLower === NETWORKS.SEPOLIA.chainId.toLowerCase()) {
    return 'Sepolia Testnet';
  } else if (chainIdLower === '0x1') {
    return 'Ethereum Mainnet';
  } else if (chainIdLower === '0x89') {
    return 'Polygon Mainnet';
  }
  
  return `Unknown Network (${chainId})`;
}

export default {
  isMetaMaskInstalled,
  connectMetaMask,
  signMessage,
  getAccounts,
  onAccountsChanged,
  onChainChanged,
  getChainId,
  switchNetwork,
  switchToStoryTestnet,
  switchToSepolia,
  isOnCorrectNetwork,
  getNetworkName,
  NETWORKS,
};
