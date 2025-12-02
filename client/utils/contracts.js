import { ethers } from 'ethers';

/**
 * Smart Contract Integration Utilities for Klaim Marketplace
 * 
 * This module provides comprehensive smart contract interaction utilities for the
 * Klaim marketplace including contract address management, ABI definitions, and
 * high-level transaction functions. It handles all blockchain interactions for
 * IP creation, marketplace operations, and KIP token management with proper error
 * handling and transaction parsing. The utilities abstract complex blockchain
 * operations into simple function calls while maintaining full transaction transparency.
 */

// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  IP_CREATOR: process.env.NEXT_PUBLIC_IP_CREATOR_ADDRESS || '',
  IP_MARKETPLACE: process.env.NEXT_PUBLIC_IP_MARKETPLACE_ADDRESS || '',
  IP_TOKEN: process.env.NEXT_PUBLIC_IP_TOKEN_ADDRESS || '',
  NFT_CONTRACT: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '',
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

// MetaMask provider initialization with error handling for missing wallet
export const getProvider = () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

// Wallet signer retrieval for transaction signing
export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

// IP Creator contract instance with configuration validation
export const getIPCreatorContract = async () => {
  if (!CONTRACT_ADDRESSES.IP_CREATOR) {
    throw new Error('IP Creator contract address not configured');
  }
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES.IP_CREATOR, IP_CREATOR_ABI, signer);
};

// IP Marketplace contract instance for trading operations
export const getIPMarketplaceContract = async () => {
  if (!CONTRACT_ADDRESSES.IP_MARKETPLACE) {
    throw new Error('IP Marketplace contract address not configured');
  }
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES.IP_MARKETPLACE, IP_MARKETPLACE_ABI, signer);
};

// KIP Token contract instance for balance and transfer operations
export const getIPTokenContract = async () => {
  if (!CONTRACT_ADDRESSES.IP_TOKEN) {
    throw new Error('IP Token contract address not configured');
  }
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES.IP_TOKEN, IP_TOKEN_ABI, signer);
};

// Contract deployment verification utility
export const checkContractDeployment = async (contractAddress, contractName = 'Contract') => {
  try {
    if (!contractAddress) {
      console.warn(`${contractName} address not configured`);
      return false;
    }
    
    const provider = getProvider();
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

// Comprehensive contract status checker
export const checkAllContractsStatus = async () => {
  try {
    const provider = getProvider();
    const network = await provider.getNetwork();
    
    console.log('Current network:', {
      name: network.name,
      chainId: network.chainId.toString()
    });
    
    const contractChecks = await Promise.all([
      checkContractDeployment(CONTRACT_ADDRESSES.IP_TOKEN, 'IP Token'),
      checkContractDeployment(CONTRACT_ADDRESSES.IP_CREATOR, 'IP Creator'),
      checkContractDeployment(CONTRACT_ADDRESSES.IP_MARKETPLACE, 'IP Marketplace'),
      checkContractDeployment(CONTRACT_ADDRESSES.NFT_CONTRACT, 'NFT Contract')
    ]);
    
    const status = {
      network: {
        name: network.name,
        chainId: network.chainId.toString()
      },
      contracts: {
        ipToken: contractChecks[0],
        ipCreator: contractChecks[1],
        ipMarketplace: contractChecks[2],
        nftContract: contractChecks[3]
      },
      addresses: CONTRACT_ADDRESSES
    };
    
    console.log('Contract deployment status:', status);
    return status;
  } catch (error) {
    console.error('Error checking contract status:', error);
    return {
      network: { name: 'unknown', chainId: 'unknown' },
      contracts: {
        ipToken: false,
        ipCreator: false,
        ipMarketplace: false,
        nftContract: false
      },
      addresses: CONTRACT_ADDRESSES,
      error: error.message
    };
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
 * hash calculation, blockchain transaction execution, and event parsing. It
 * interacts with the IPCreator contract to mint NFTs and register them as IP
 * assets on Story Protocol with proper licensing. The function provides
 * comprehensive error handling and returns detailed transaction information
 * including token IDs and IP asset addresses.
 */
export const createIPOnChain = async (recipient, metadataURI, metadata, licenseURI) => {
  const contract = await getIPCreatorContract();
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
 * This function handles IP asset listing on the marketplace including price
 * formatting, transaction execution, and listing ID extraction from events.
 * It provides a complete listing workflow with proper error handling and
 * returns the generated listing ID for tracking purposes.
 */
export const listIPOnChain = async (tokenId, price) => {
  const contract = await getIPMarketplaceContract();
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

// Marketplace listing cancellation with transaction hash return
export const cancelListingOnChain = async (listingId) => {
  const contract = await getIPMarketplaceContract();
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
 * It implements a two-step process to ensure proper token handling and
 * provides comprehensive error handling for both approval and purchase
 * operations with detailed transaction information.
 */
export const purchaseIPOnChain = async (listingId, price) => {
  // First approve IPT tokens
  const tokenContract = await getIPTokenContract();
  const priceInWei = formatIPTAmount(price);
  
  const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.IP_MARKETPLACE, priceInWei);
  await approveTx.wait();
  
  // Then purchase
  const marketplaceContract = await getIPMarketplaceContract();
  const tx = await marketplaceContract.purchaseIP(listingId);
  const receipt = await tx.wait();
  
  return {
    transactionHash: receipt.hash,
  };
};

// KIP token balance retrieval with automatic formatting for display
export const getIPTBalance = async (address) => {
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
    
    const contract = await getIPTokenContract();
    
    // Check if contract exists at the address by trying to get the code
    const provider = getProvider();
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
 * Complete KIP token information retrieval.
 * 
 * This function fetches comprehensive token metadata including name, symbol,
 * decimals, and total supply from the KIP token contract. It provides all
 * necessary token information for display and validation purposes with
 * proper formatting for user interfaces.
 */
export const getKIPTokenInfo = async () => {
  try {
    // Check if contract address is configured
    if (!CONTRACT_ADDRESSES.IP_TOKEN) {
      console.warn('IP Token contract address not configured');
      return {
        name: 'KIP',
        symbol: 'KIP',
        decimals: 18,
        totalSupply: '0'
      };
    }
    
    const contract = await getIPTokenContract();
    
    // Check if contract exists at the address
    const provider = getProvider();
    const code = await provider.getCode(CONTRACT_ADDRESSES.IP_TOKEN);
    if (code === '0x') {
      console.warn('No contract deployed at IP Token address:', CONTRACT_ADDRESSES.IP_TOKEN);
      return {
        name: 'KIP',
        symbol: 'KIP',
        decimals: 18,
        totalSupply: '0'
      };
    }
    
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
    if (error.code === 'BAD_DATA') {
      console.warn('Contract call returned empty data - contract may not be deployed correctly');
    } else {
      console.error('Error getting KIP token info:', error);
    }
    return {
      name: 'KIP',
      symbol: 'KIP',
      decimals: 18,
      totalSupply: '0'
    };
  }
};

// KIP token allowance checking for marketplace approvals
export const checkIPTAllowance = async (owner, spender) => {
  try {
    const contract = await getIPTokenContract();
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

// Marketplace listing details retrieval with formatted price information
export const getListingDetails = async (listingId) => {
  try {
    const contract = await getIPMarketplaceContract();
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
  checkContractDeployment,
  checkAllContractsStatus,
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
