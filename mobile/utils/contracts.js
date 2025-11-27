import { ethers } from 'ethers';

/**
 * Smart Contract Integration Utilities for Klaim Mobile App
 * 
 * This module provides comprehensive smart contract interaction utilities adapted
 * for React Native. It handles all blockchain interactions for IP creation,
 * marketplace operations, and KIP token management with WalletConnect provider
 * integration instead of BrowserProvider.
 */

// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  IP_CREATOR: process.env.EXPO_PUBLIC_IP_CREATOR_ADDRESS || '',
  IP_MARKETPLACE: process.env.EXPO_PUBLIC_IP_MARKETPLACE_ADDRESS || '',
  IP_TOKEN: process.env.EXPO_PUBLIC_IP_TOKEN_ADDRESS || '',
  NFT_CONTRACT: process.env.EXPO_PUBLIC_NFT_CONTRACT_ADDRESS || '',
};

// Contract ABIs
export const IP_CREATOR_ABI = [
  'event IPAssetCreated(address indexed ipId, uint256 indexed tokenId, address indexed owner, string metadataURI, uint256 licenseTermsId)',
  'function createIPFromFile(address recipient, string metadataURI, bytes32 metadataHash, string licenseURI) returns (uint256 tokenId, address ipId, uint256 licenseTermsId)',
  'function getNFTContract() view returns (address)',
];

export const IP_MARKETPLACE_ABI = [
  'event IPListed(bytes32 indexed listingId, address indexed seller, address indexed ipId, uint256 price)',
  'event IPSold(bytes32 indexed listingId, address indexed buyer, address indexed seller, address indexed ipId, uint256 price)',
  'event ListingCancelled(bytes32 indexed listingId)',
  'function listIP(uint256 tokenId, uint256 price)',
  'function purchaseIP(bytes32 listingId)',
  'function cancelListing(bytes32 listingId)',
  'function listings(bytes32 listingId) view returns (address seller, uint256 tokenId, address ipId, uint256 price, bool active)',
];

export const IP_TOKEN_ABI = [
  // Standard ERC20 functions
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  
  // ERC20 metadata functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  
  // IPToken specific functions
  'function mint(address to, uint256 amount)',
  'function burn(uint256 amount)',
  'function owner() view returns (address)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event TokensMinted(address indexed to, uint256 amount)',
];

/**
 * Get provider from WalletConnect
 * This should be called with the provider from WalletContext
 * @param {Object} walletProvider - WalletConnect provider from context
 * @returns {ethers.Provider} Ethers provider instance
 */
export const getProvider = (walletProvider) => {
  if (!walletProvider) {
    throw new Error('Wallet not connected');
  }
  return new ethers.BrowserProvider(walletProvider);
};

/**
 * Get signer from WalletConnect provider
 * @param {Object} walletProvider - WalletConnect provider from context
 * @returns {Promise<ethers.Signer>} Ethers signer instance
 */
export const getSigner = async (walletProvider) => {
  const provider = getProvider(walletProvider);
  return await provider.getSigner();
};

/**
 * Get IP Creator contract instance
 * @param {Object} walletProvider - WalletConnect provider from context
 * @returns {Promise<ethers.Contract>} Contract instance
 */
export const getIPCreatorContract = async (walletProvider) => {
  if (!CONTRACT_ADDRESSES.IP_CREATOR) {
    throw new Error('IP Creator contract address not configured');
  }
  const signer = await getSigner(walletProvider);
  return new ethers.Contract(CONTRACT_ADDRESSES.IP_CREATOR, IP_CREATOR_ABI, signer);
};

/**
 * Get IP Marketplace contract instance
 * @param {Object} walletProvider - WalletConnect provider from context
 * @returns {Promise<ethers.Contract>} Contract instance
 */
export const getIPMarketplaceContract = async (walletProvider) => {
  if (!CONTRACT_ADDRESSES.IP_MARKETPLACE) {
    throw new Error('IP Marketplace contract address not configured');
  }
  const signer = await getSigner(walletProvider);
  return new ethers.Contract(CONTRACT_ADDRESSES.IP_MARKETPLACE, IP_MARKETPLACE_ABI, signer);
};

/**
 * Get KIP Token contract instance
 * @param {Object} walletProvider - WalletConnect provider from context
 * @returns {Promise<ethers.Contract>} Contract instance
 */
export const getIPTokenContract = async (walletProvider) => {
  if (!CONTRACT_ADDRESSES.IP_TOKEN) {
    throw new Error('IP Token contract address not configured');
  }
  const signer = await getSigner(walletProvider);
  return new ethers.Contract(CONTRACT_ADDRESSES.IP_TOKEN, IP_TOKEN_ABI, signer);
};

/**
 * Get read-only IP Token contract instance (no signer required)
 * @param {Object} walletProvider - WalletConnect provider from context
 * @returns {Promise<ethers.Contract>} Contract instance
 */
export const getIPTokenContractReadOnly = async (walletProvider) => {
  if (!CONTRACT_ADDRESSES.IP_TOKEN) {
    throw new Error('IP Token contract address not configured');
  }
  const provider = getProvider(walletProvider);
  return new ethers.Contract(CONTRACT_ADDRESSES.IP_TOKEN, IP_TOKEN_ABI, provider);
};

/**
 * Check if a contract is deployed at the given address
 * @param {Object} walletProvider - WalletConnect provider from context
 * @param {string} contractAddress - Contract address to check
 * @param {string} contractName - Name for logging purposes
 * @returns {Promise<boolean>} True if contract is deployed
 */
export const checkContractDeployment = async (walletProvider, contractAddress, contractName = 'Contract') => {
  try {
    if (!contractAddress) {
      console.warn(`${contractName} address not configured`);
      return false;
    }
    
    const provider = getProvider(walletProvider);
    const code = await provider.getCode(contractAddress);
    const isDeployed = code !== '0x';
    
    if (!isDeployed) {
      console.warn(`No contract deployed at ${contractName} address:`, contractAddress);
    }
    
    return isDeployed;
  } catch (error) {
    console.error(`Error checking ${contractName} deployment:`, error);
    return false;
  }
};

// Metadata hash calculation for IP asset verification
export const calculateMetadataHash = (metadata) => {
  const metadataString = JSON.stringify(metadata);
  return ethers.keccak256(ethers.toUtf8Bytes(metadataString));
};

// KIP token amount formatting utilities for blockchain transactions
export const formatIPTAmount = (amount) => {
  return ethers.parseEther(amount.toString());
};

// KIP token amount parsing for display purposes
export const parseIPTAmount = (amount) => {
  try {
    // Handle null, undefined, or zero values
    if (amount === null || amount === undefined || amount === 0 || amount === '0') {
      return '0';
    }
    
    // Convert to string if it's a number
    if (typeof amount === 'number') {
      amount = amount.toString();
    }
    
    return ethers.formatEther(amount);
  } catch (error) {
    console.error('Error parsing IPT amount:', error, 'Amount:', amount);
    return '0';
  }
};

/**
 * High-level IP asset creation with Story Protocol integration.
 * 
 * This function handles the complete IP asset creation process including metadata
 * hash calculation, blockchain transaction execution, and event parsing.
 * 
 * @param {Object} walletProvider - WalletConnect provider from context
 * @param {string} recipient - Recipient wallet address
 * @param {string} metadataURI - IPFS URI for metadata
 * @param {Object} metadata - Metadata object for hash calculation
 * @param {string} licenseURI - License URI (optional)
 * @returns {Promise<Object>} Transaction result with tokenId, ipId, etc.
 */
export const createIPOnChain = async (walletProvider, recipient, metadataURI, metadata, licenseURI) => {
  const contract = await getIPCreatorContract(walletProvider);
  const metadataHash = calculateMetadataHash(metadata);
  
  const tx = await contract.createIPFromFile(
    recipient,
    metadataURI,
    metadataHash,
    licenseURI || ''
  );
  
  const receipt = await tx.wait();
  
  // Parse events
  const event = receipt.logs.find(log => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed.name === 'IPAssetCreated';
    } catch {
      return false;
    }
  });
  
  if (event) {
    const parsed = contract.interface.parseLog(event);
    return {
      transactionHash: receipt.hash,
      tokenId: parsed.args.tokenId.toString(),
      ipId: parsed.args.ipId,
      licenseTermsId: parsed.args.licenseTermsId.toString(),
    };
  }
  
  return {
    transactionHash: receipt.hash,
  };
};

/**
 * Marketplace listing creation with event parsing.
 * 
 * @param {Object} walletProvider - WalletConnect provider from context
 * @param {number} tokenId - NFT token ID
 * @param {number} price - Listing price in KIP tokens
 * @returns {Promise<Object>} Transaction result with listingId
 */
export const listIPOnChain = async (walletProvider, tokenId, price) => {
  const contract = await getIPMarketplaceContract(walletProvider);
  const priceInWei = formatIPTAmount(price);
  
  const tx = await contract.listIP(tokenId, priceInWei);
  const receipt = await tx.wait();
  
  // Parse events to get listingId
  const event = receipt.logs.find(log => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed.name === 'IPListed';
    } catch {
      return false;
    }
  });
  
  let listingId = null;
  if (event) {
    const parsed = contract.interface.parseLog(event);
    listingId = parsed.args.listingId;
  }
  
  return {
    transactionHash: receipt.hash,
    listingId,
  };
};

/**
 * Cancel marketplace listing
 * @param {Object} walletProvider - WalletConnect provider from context
 * @param {string} listingId - Listing ID to cancel
 * @returns {Promise<Object>} Transaction result
 */
export const cancelListingOnChain = async (walletProvider, listingId) => {
  const contract = await getIPMarketplaceContract(walletProvider);
  const tx = await contract.cancelListing(listingId);
  const receipt = await tx.wait();
  
  return {
    transactionHash: receipt.hash,
  };
};

/**
 * Secure IP asset purchase with token approval and transfer.
 * 
 * This function handles the complete purchase workflow including KIP token
 * approval for the marketplace contract and the actual purchase transaction.
 * 
 * @param {Object} walletProvider - WalletConnect provider from context
 * @param {string} listingId - Listing ID to purchase
 * @param {number} price - Purchase price in KIP tokens
 * @returns {Promise<Object>} Transaction result
 */
export const purchaseIPOnChain = async (walletProvider, listingId, price) => {
  // First approve IPT tokens
  const tokenContract = await getIPTokenContract(walletProvider);
  const priceInWei = formatIPTAmount(price);
  
  const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.IP_MARKETPLACE, priceInWei);
  await approveTx.wait();
  
  // Then purchase
  const marketplaceContract = await getIPMarketplaceContract(walletProvider);
  const tx = await marketplaceContract.purchaseIP(listingId);
  const receipt = await tx.wait();
  
  return {
    transactionHash: receipt.hash,
  };
};

/**
 * Get KIP token balance for an address
 * @param {Object} walletProvider - WalletConnect provider from context
 * @param {string} address - Wallet address to check
 * @returns {Promise<string>} Formatted balance
 */
export const getIPTBalance = async (walletProvider, address) => {
  try {
    // Check if contract address is configured
    if (!CONTRACT_ADDRESSES.IP_TOKEN) {
      console.warn('IP Token contract address not configured');
      return '0';
    }
    
    // Validate the address format
    if (!address || !ethers.isAddress(address)) {
      console.warn('Invalid wallet address provided to getIPTBalance:', address);
      return '0';
    }
    
    const contract = await getIPTokenContractReadOnly(walletProvider);
    
    // Check if contract exists at the address by trying to get the code
    const provider = getProvider(walletProvider);
    const code = await provider.getCode(CONTRACT_ADDRESSES.IP_TOKEN);
    if (code === '0x') {
      console.warn('No contract deployed at IP Token address:', CONTRACT_ADDRESSES.IP_TOKEN);
      return '0';
    }
    
    const balance = await contract.balanceOf(address);
    
    // Ensure balance is a valid BigInt/BigNumber before parsing
    if (balance === null || balance === undefined) {
      return '0';
    }
    
    return parseIPTAmount(balance);
  } catch (error) {
    // Handle specific ethers errors
    if (error.code === 'BAD_DATA') {
      console.warn('Contract call returned empty data - contract may not be deployed or address is incorrect');
    } else if (error.code === 'NETWORK_ERROR') {
      console.warn('Network error when calling contract');
    } else {
      console.error('Error getting IPT balance:', error);
    }
    return '0';
  }
};

/**
 * Get complete KIP token information
 * @param {Object} walletProvider - WalletConnect provider from context
 * @returns {Promise<Object>} Token info with name, symbol, decimals, totalSupply
 */
export const getKIPTokenInfo = async (walletProvider) => {
  try {
    const contract = await getIPTokenContractReadOnly(walletProvider);
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply()
    ]);
    
    return {
      name: name || 'KIP',
      symbol: symbol || 'KIP',
      decimals: Number(decimals) || 18,
      totalSupply: parseIPTAmount(totalSupply)
    };
  } catch (error) {
    console.error('Error getting KIP token info:', error);
    return {
      name: 'KIP',
      symbol: 'KIP',
      decimals: 18,
      totalSupply: '0'
    };
  }
};

/**
 * Check KIP token allowance
 * @param {Object} walletProvider - WalletConnect provider from context
 * @param {string} owner - Owner address
 * @param {string} spender - Spender address
 * @returns {Promise<string>} Formatted allowance
 */
export const checkIPTAllowance = async (walletProvider, owner, spender) => {
  try {
    const contract = await getIPTokenContractReadOnly(walletProvider);
    const allowance = await contract.allowance(owner, spender);
    
    if (allowance === null || allowance === undefined) {
      return '0';
    }
    
    return parseIPTAmount(allowance);
  } catch (error) {
    console.error('Error checking IPT allowance:', error);
    return '0';
  }
};

/**
 * Get marketplace listing details
 * @param {Object} walletProvider - WalletConnect provider from context
 * @param {string} listingId - Listing ID
 * @returns {Promise<Object>} Listing details
 */
export const getListingDetails = async (walletProvider, listingId) => {
  try {
    const contract = await getIPMarketplaceContract(walletProvider);
    const listing = await contract.listings(listingId);
    
    return {
      seller: listing.seller || '',
      tokenId: listing.tokenId ? listing.tokenId.toString() : '0',
      ipId: listing.ipId || '',
      price: parseIPTAmount(listing.price),
      active: listing.active || false,
    };
  } catch (error) {
    console.error('Error getting listing details:', error);
    return {
      seller: '',
      tokenId: '0',
      ipId: '',
      price: '0',
      active: false,
    };
  }
};

export default {
  CONTRACT_ADDRESSES,
  getProvider,
  getSigner,
  getIPCreatorContract,
  getIPMarketplaceContract,
  getIPTokenContract,
  getIPTokenContractReadOnly,
  checkContractDeployment,
  calculateMetadataHash,
  formatIPTAmount,
  parseIPTAmount,
  createIPOnChain,
  listIPOnChain,
  cancelListingOnChain,
  purchaseIPOnChain,
  getIPTBalance,
  getKIPTokenInfo,
  checkIPTAllowance,
  getListingDetails,
};
