import { ethers } from 'ethers';

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

// Get provider and signer
export const getProvider = () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

// Contract instances
export const getIPCreatorContract = async () => {
  if (!CONTRACT_ADDRESSES.IP_CREATOR) {
    throw new Error('IP Creator contract address not configured');
  }
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES.IP_CREATOR, IP_CREATOR_ABI, signer);
};

export const getIPMarketplaceContract = async () => {
  if (!CONTRACT_ADDRESSES.IP_MARKETPLACE) {
    throw new Error('IP Marketplace contract address not configured');
  }
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES.IP_MARKETPLACE, IP_MARKETPLACE_ABI, signer);
};

export const getIPTokenContract = async () => {
  if (!CONTRACT_ADDRESSES.IP_TOKEN) {
    throw new Error('IP Token contract address not configured');
  }
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES.IP_TOKEN, IP_TOKEN_ABI, signer);
};

// Helper functions
export const calculateMetadataHash = (metadata) => {
  const metadataString = JSON.stringify(metadata);
  return ethers.keccak256(ethers.toUtf8Bytes(metadataString));
};

export const formatIPTAmount = (amount) => {
  return ethers.parseEther(amount.toString());
};

export const parseIPTAmount = (amount) => {
  return ethers.formatEther(amount);
};

// Contract interactions
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

export const cancelListingOnChain = async (listingId) => {
  const contract = await getIPMarketplaceContract();
  const tx = await contract.cancelListing(listingId);
  const receipt = await tx.wait();
  
  return {
    transactionHash: receipt.hash,
  };
};

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

export const getIPTBalance = async (address) => {
  const contract = await getIPTokenContract();
  const balance = await contract.balanceOf(address);
  return parseIPTAmount(balance);
};

export const getKIPTokenInfo = async () => {
  const contract = await getIPTokenContract();
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply()
  ]);
  
  return {
    name,
    symbol,
    decimals: Number(decimals),
    totalSupply: parseIPTAmount(totalSupply)
  };
};

export const checkIPTAllowance = async (owner, spender) => {
  const contract = await getIPTokenContract();
  const allowance = await contract.allowance(owner, spender);
  return parseIPTAmount(allowance);
};

export const getListingDetails = async (listingId) => {
  const contract = await getIPMarketplaceContract();
  const listing = await contract.listings(listingId);
  
  return {
    seller: listing.seller,
    tokenId: listing.tokenId.toString(),
    ipId: listing.ipId,
    price: parseIPTAmount(listing.price),
    active: listing.active,
  };
};

export default {
  CONTRACT_ADDRESSES,
  getProvider,
  getSigner,
  getIPCreatorContract,
  getIPMarketplaceContract,
  getIPTokenContract,
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
