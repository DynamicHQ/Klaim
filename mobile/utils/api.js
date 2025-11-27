/**
 * Mobile API Utilities for Backend Communication
 * 
 * This module provides comprehensive API utilities for communicating with the
 * Klaim backend from React Native. Adapted from the web client with mobile-specific
 * changes including AsyncStorage for token persistence and removal of window dependencies.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API endpoint configuration with environment variable support
const API_ENDPOINT = process.env.EXPO_PUBLIC_API_ENDPOINT || 'http://localhost:3001';

// JWT token storage and unauthorized callback management
let authToken = null;
let onUnauthorizedCallback = null;

/**
 * Set JWT token with AsyncStorage persistence for authenticated requests
 * @param {string} token - JWT token
 */
export async function setAuthToken(token) {
  authToken = token;
  try {
    await AsyncStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Failed to save auth token:', error);
  }
}

/**
 * Clear JWT token
 */
export async function clearAuthToken() {
  authToken = null;
  try {
    await AsyncStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Failed to clear auth token:', error);
  }
}

/**
 * Get current JWT token
 * @returns {Promise<string|null>} JWT token or null
 */
export async function getAuthToken() {
  if (authToken) {
    return authToken;
  }
  
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      authToken = token;
      return token;
    }
  } catch (error) {
    console.error('Failed to get auth token:', error);
  }
  
  return null;
}

/**
 * Set callback for unauthorized responses
 * @param {Function} callback - Function to call on 401 responses
 */
export function setOnUnauthorizedCallback(callback) {
  onUnauthorizedCallback = callback;
}

/**
 * Get headers with optional authorization
 * @returns {Promise<Object>} Headers object
 */
async function getHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const token = await getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

async function postJSON(path, body) {
  const url = `${API_ENDPOINT}${path}`;
  const headers = await getHeaders();
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    throw new Error(`Invalid JSON response from ${url}`);
  }

  if (!res.ok) {
    // Handle 401 Unauthorized
    if (res.status === 401 && onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    
    // Extract error message from various possible formats
    let message = 'API error';
    if (json) {
      // Handle array of messages (validation errors)
      if (Array.isArray(json.message)) {
        message = json.message.join(', ');
      } else {
        message = json.message || json.error || res.statusText;
      }
    } else {
      message = res.statusText;
    }
    
    const err = new Error(message);
    err.status = res.status;
    err.response = json;
    throw err;
  }

  return json;
}

async function getJSON(path) {
  const url = `${API_ENDPOINT}${path}`;
  const headers = await getHeaders();
  
  const res = await fetch(url, {
    method: 'GET',
    headers
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    throw new Error(`Invalid JSON response from ${url}`);
  }

  if (!res.ok) {
    // Handle 401 Unauthorized
    if (res.status === 401 && onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    
    // Extract error message from various possible formats
    let message = 'API error';
    if (json) {
      // Handle array of messages (validation errors)
      if (Array.isArray(json.message)) {
        message = json.message.join(', ');
      } else {
        message = json.message || json.error || res.statusText;
      }
    } else {
      message = res.statusText;
    }
    
    const err = new Error(message);
    err.status = res.status;
    err.response = json;
    throw err;
  }

  return json;
}

async function patchJSON(path, body) {
  const url = `${API_ENDPOINT}${path}`;
  const headers = await getHeaders();
  
  const res = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body)
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    throw new Error(`Invalid JSON response from ${url}`);
  }

  if (!res.ok) {
    // Handle 401 Unauthorized
    if (res.status === 401 && onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    
    // Extract error message from various possible formats
    let message = 'API error';
    if (json) {
      // Handle array of messages (validation errors)
      if (Array.isArray(json.message)) {
        message = json.message.join(', ');
      } else {
        message = json.message || json.error || res.statusText;
      }
    } else {
      message = res.statusText;
    }
    
    const err = new Error(message);
    err.status = res.status;
    err.response = json;
    throw err;
  }

  return json;
}

// Authentication endpoints

/**
 * Get nonce for wallet authentication
 * @param {string} walletAddress - Ethereum wallet address
 * @returns {Promise<{nonce: string}>} Nonce object
 */
export async function getNonce(walletAddress) {
  return getJSON(`/auth/nonce/${walletAddress}`);
}

/**
 * Authenticate with wallet signature
 * @param {string} walletAddress - Ethereum wallet address
 * @param {string} signature - Signed message signature
 * @returns {Promise<{access_token: string}>} JWT token object
 */
export async function authenticateWithSignature(walletAddress, signature) {
  return postJSON('/auth/login', {
    wallet: walletAddress,
    signature: signature
  });
}

/**
 * Sign up a new user
 * @param {string} username - User's profile name
 * @param {string} walletAddress - Ethereum wallet address
 * @returns {Promise<Object>} User creation response
 */
export async function signupUser(username, walletAddress) {
  return postJSON('/users/signup', { username, walletAddress });
}

/**
 * Comprehensive asset creation with IPFS upload and blockchain integration.
 * 
 * This function orchestrates the complete asset creation process including
 * image upload to IPFS, metadata formatting, and backend API communication
 * for NFT minting and IP registration.
 * 
 * @param {object} assetData - Contains title, description, and image file.
 * @param {string} assetData.title - The title of the asset.
 * @param {string} assetData.description - The description of the asset.
 * @param {object} assetData.image - The image file/URI for the asset.
 * @param {string} walletAddress - The creator's wallet address.
 * @returns {Promise<object>} The final response from the createIP call.
 */
export async function createAsset(assetData, walletAddress) {
  // Step 1: Upload image to get the URL
  const { uploadToPinata } = await import('./pinata');
  const imageUrl = await uploadToPinata(assetData.image);

  // Step 2: Create the NFT metadata record
  const nftInfo = {
    name: assetData.title,
    description: assetData.description,
    image_url: imageUrl,
  };
  const nftResponse = await createNFT(nftInfo, walletAddress);

  // Step 3: Create the IP metadata record, linking it to the NFT
  const ipInfo = {
    title: assetData.title,
    description: assetData.description,
    creators: walletAddress,
    createdat: new Date().toISOString(),
  };
  return createIP(ipInfo, nftResponse.assetId);
}

// Legacy endpoints (kept for backward compatibility)
export async function syncWallet(walletAddress) {
  return postJSON('/users/sync-wallet', { walletAddress });
}

export async function loginUser(username, walletAddress) {
  return postJSON('/users/login', { username, walletAddress });
}

export async function createNFT(nft_info, walletAddress) {
  const body = { nft_info };
  if (walletAddress) body.walletAddress = walletAddress;
  return postJSON('/assets/nft', body);
}

export async function createIP(ip_info, nftId) {
  const body = { ip_info };
  if (nftId) body.nftId = nftId;
  return postJSON('/assets/ip', body);
}

/**
 * Update blockchain data for an asset after blockchain transactions complete
 * @param {string} assetId - Asset ID to update
 * @param {Object} data - Blockchain data to update
 * @param {string} [data.nftId] - NFT contract ID
 * @param {string} [data.ipId] - IP asset ID from Story Protocol
 * @param {number} [data.tokenId] - Token ID from minting
 * @param {string} [data.transactionHash] - Transaction hash from blockchain
 * @returns {Promise<Object>} Updated asset object
 */
export async function updateBlockchainData(assetId, data) {
  return patchJSON(`/assets/${assetId}/blockchain`, data);
}

/**
 * List an asset on the marketplace
 * @param {string} assetId - Asset ID to list
 * @param {number} price - Listing price
 * @param {string} seller - Seller wallet address
 * @returns {Promise<Object>} Listing response with listingId
 */
export async function listOnMarketplace(assetId, price, seller) {
  return postJSON('/assets/marketplace/list', {
    assetId,
    price,
    seller
  });
}

/**
 * Marketplace purchase execution with ownership transfer.
 * 
 * This function handles the complete IP asset purchase process including
 * payment processing, ownership transfer, and marketplace state updates.
 */
export async function purchaseIP(listingId, buyer) {
  return postJSON('/assets/marketplace/purchase', {
    listingId,
    buyer
  });
}

/**
 * Marketplace listings retrieval for browsing and search functionality
 * @returns {Promise<Array>} Array of marketplace listings
 */
export async function getMarketplaceListings() {
  return getJSON('/assets/marketplace');
}

/**
 * User-owned IP assets retrieval for profile and management interfaces
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<Array>} Array of user's IP assets
 */
export async function getUserIPs(walletAddress) {
  return getJSON(`/assets/user/${walletAddress}`);
}

/**
 * Transfer IP ownership to another wallet
 * @param {string} assetId - Asset/IP ID to transfer
 * @param {string} fromAddress - Current owner wallet address
 * @param {string} toAddress - Recipient wallet address
 * @returns {Promise<Object>} Transfer response
 */
export async function transferIPOwnership(assetId, fromAddress, toAddress) {
  return postJSON('/assets/transfer', {
    assetId,
    fromAddress,
    toAddress
  });
}

// Faucet endpoints

/**
 * Claim KIP tokens from the faucet
 * @param {string} walletAddress - Ethereum wallet address
 * @returns {Promise<Object>} Claim response with transaction hash and balance
 */
export async function claimTokens(walletAddress) {
  return postJSON('/faucet/claim', { walletAddress });
}

/**
 * Check if a wallet address is eligible to claim tokens
 * @param {string} walletAddress - Ethereum wallet address
 * @returns {Promise<Object>} Eligibility status
 */
export async function checkEligibility(walletAddress) {
  return getJSON(`/faucet/eligibility/${walletAddress}`);
}

/**
 * Get KIP token balance for a wallet address
 * @param {string} walletAddress - Ethereum wallet address
 * @returns {Promise<Object>} Balance information
 */
export async function getTokenBalance(walletAddress) {
  return getJSON(`/faucet/balance/${walletAddress}`);
}

/**
 * Ping the backend server to wake it up
 * This is useful for services that sleep after inactivity (like Render free tier)
 * @returns {Promise<Object>} Server status
 */
export async function pingServer() {
  try {
    const response = await fetch(`${API_ENDPOINT}/assets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Add timeout to prevent hanging (10 seconds)
      signal: AbortSignal.timeout(10000)
    });
    
    // Any response (even 401 unauthorized) means the server is awake
    if (response.status < 500) {
      return { success: true, status: 'online' };
    }
    
    return { success: false, status: 'error', statusCode: response.status };
  } catch (error) {
    console.warn('Server ping failed:', error.message);
    return { success: false, status: 'offline', error: error.message };
  }
}

export default {
  // Auth management
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  setOnUnauthorizedCallback,
  // Auth endpoints
  getNonce,
  authenticateWithSignature,
  signupUser,
  // Legacy endpoints
  syncWallet,
  loginUser,
  // Asset endpoints
  createNFT,
  createIP,
  updateBlockchainData,
  listOnMarketplace,
  purchaseIP,
  getMarketplaceListings,
  getUserIPs,
  transferIPOwnership,
  // Faucet endpoints
  claimTokens,
  checkEligibility,
  getTokenBalance,
  // Server health
  pingServer,
  // High-level functions
  createAsset
};
