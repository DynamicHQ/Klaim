/*
 * Frontend API Utilities for Backend Communication
 * This module provides comprehensive API utilities for communicating with the
 * Klaim backend including authentication management, asset operations, marketplace
 * interactions, and user management. It implements JWT token handling, automatic
 * request authentication, error handling, and response parsing. The utilities
 * abstract complex API interactions into simple function calls while maintaining
 * proper error handling and authentication state management throughout the application.
 */

// Backend API endpoint configuration with environment variable support
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://klaim.onrender.com';

// JWT token storage and unauthorized callback management
let authToken = null;
let onUnauthorizedCallback = null;

// JWT token setter with localStorage persistence for authenticated requests
export function setAuthToken(token) {
  authToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

/*
 * Clear JWT token
 */
export function clearAuthToken() {
  authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

/*
 * Get current JWT token
 * @returns {string|null} JWT token or null
 */
export function getAuthToken() {
  if (authToken) {
    return authToken;
  }
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authToken = token;
      return token;
    }
  }
  
  return null;
}

/*
 * Set callback for unauthorized responses
 * @param {Function} callback - Function to call on 401 responses
 */
export function setOnUnauthorizedCallback(callback) {
  onUnauthorizedCallback = callback;
}

/*
 * Get headers with optional authorization
 * @returns {Object} Headers object
 */
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

async function postJSON(path, body) {
  const url = `${API_ENDPOINT}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
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
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders()
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
  const res = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
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

async function deleteJSON(path) {
  const url = `${API_ENDPOINT}${path}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getHeaders()
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

/*
 * Get nonce for wallet authentication
 * @param {string} walletAddress - Ethereum wallet address
 * @returns {Promise<{nonce: string}>} Nonce object
 */
export async function getNonce(walletAddress) {
  return getJSON(`/auth/nonce/${walletAddress}`);
}

/*
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

/*
 * Sign up a new user
 * @param {string} username - User's profile name
 * @param {string} walletAddress - Ethereum wallet address
 * @returns {Promise<Object>} User creation response
 */
export async function signupUser(username, walletAddress) {
  return postJSON('/users/signup', { username, walletAddress });
}

/*
 * A high-level function to create a complete asset.
 * It uploads the image, then creates the NFT and IP records on the backend.
 * @param {object} assetData - Contains title, description, and image file.
 * @param {string} assetData.title - The title of the asset.
 * @param {string} assetData.description - The description of the asset.
 * @param {File} assetData.image - The image file for the asset.
 * @param {string} walletAddress - The creator's wallet address.
 * @returns {Promise<object>} The final response from the createIp call.
 */
/**
 * Comprehensive asset creation with IPFS upload and blockchain integration.
 * 
 * This function orchestrates the complete asset creation process including
 * image upload to Pinata IPFS, metadata formatting, and backend API
 * communication for NFT minting and IP registration. It handles the complex
 * workflow of transforming user input into blockchain-ready assets while
 * providing proper error handling and progress tracking throughout the process.
 */
export async function createAsset(assetData, walletAddress) {
  // Step 1: Upload image to get the URL. We'll use the Pinata function directly.
  // Note: In a larger app, this uploader could also be part of the api utility.
  const { uploadToPinata } = await import('./pinata');
  const imageUrl = await uploadToPinata(assetData.image);

  // Step 2: Create the NFT metadata record.
  const nftInfo = {
    name: assetData.title,
    description: assetData.description,
    image_url: imageUrl,
  };
  const nftResponse = await createNFT(nftInfo, walletAddress);

  // Step 3: Create the IP metadata record, linking it to the NFT.
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

export async function createNFT(nft_info, walletAddress) { // Renamed from createNft for consistency
  const body = { nft_info };
  if (walletAddress) body.walletAddress = walletAddress;
  return postJSON('/assets/nft', body);
}

export async function createIP(ip_info, nftId) { // Renamed from createIp for consistency
  const body = { ip_info };
  if (nftId) body.nftId = nftId;
  return postJSON('/assets/ip', body);
}

/*
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

/*
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

/*
 * Marketplace purchase execution with ownership transfer.
 * This function handles the complete IP asset purchase process including
 * payment processing, ownership transfer, and marketplace state updates.
 * It communicates with the backend to execute the purchase transaction
 * and update all relevant records while providing comprehensive error
 * handling and transaction confirmation feedback.
 */
export async function purchaseIP(listingId, buyer) {
  return postJSON('/assets/marketplace/purchase', {
    listingId,
    buyer
  });
}

// Marketplace listings retrieval for browsing and search functionality
export async function getMarketplaceListings() {
  return getJSON('/assets/marketplace');
}

// User-owned IP assets retrieval for profile and management interfaces
export async function getUserIPs(walletAddress) {
  return getJSON(`/assets/user/${walletAddress}`);
}

/*
 * Get all assets in the system
 * @returns {Promise<Array>} Array of all assets
 */
export async function getAllAssets() {
  return getJSON('/assets');
}

/*
 * Get a specific asset by ID
 * @param {string} assetId - Asset ID to retrieve
 * @returns {Promise<Object>} Asset details
 */
export async function getAssetById(assetId) {
  return getJSON(`/assets/${assetId}`);
}

/*
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

export async function uploadToCloudinary(file) {
  // Upload file to Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}

export async function readFileAsDataURL(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
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
 * Ping a single route for quick testing
 * @param {string} route - Route to ping (e.g., '/assets', '/auth/nonce/test')
 * @returns {Promise<Object>} Single route ping result with success status, response time, and status code
 */
export async function pingSingleRoute(route) {
  const startTime = Date.now();
  console.log(`🏓 Pinging single route: ${API_ENDPOINT}${route}`);
  
  try {
    const response = await fetch(`${API_ENDPOINT}${route}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    const duration = Date.now() - startTime;
    const success = response.status < 500;
    
    console.log(`${success ? '✅' : '❌'} Route ${route} responded in ${duration}ms (${response.status})`);
    
    return {
      success,
      route,
      statusCode: response.status,
      responseTime: duration,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Route ${route} failed after ${duration}ms:`, error.message);
    
    return {
      success: false,
      route,
      error: error.message,
      responseTime: duration,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Comprehensive server health check that tests multiple critical backend routes
 * This is useful for services that sleep after inactivity (like Render free tier)
 * Tests critical routes: assets, auth, users, faucet, marketplace
 * @returns {Promise<Object>} Detailed server status with route-by-route results
 * @example
 * const result = await pingServer();
 * console.log(`Server status: ${result.status}`);
 * console.log(`Response time: ${result.responseTime}ms`);
 * console.log(`Routes tested: ${Object.keys(result.routes).length}`);
 */
export async function pingServer() {
  const startTime = Date.now();
  console.log(`🏓 Starting comprehensive server ping at ${API_ENDPOINT}...`);
  
  // Define critical routes to test
  const routes = [
    { path: '/assets', name: 'Assets API', critical: true },
    { path: '/auth/nonce/0x0000000000000000000000000000000000000000', name: 'Auth API', critical: true },
    { path: '/users/test', name: 'Users API', critical: false }, // This will 404 but shows server is up
    { path: '/faucet/balance/0x0000000000000000000000000000000000000000', name: 'Faucet API', critical: false },
    { path: '/assets/marketplace', name: 'Marketplace API', critical: false }
  ];

  const results = {
    success: false,
    status: 'testing',
    responseTime: 0,
    routes: {},
    errors: [],
    warnings: []
  };

  try {
    // Test each route
    for (const route of routes) {
      const routeStartTime = Date.now();
      console.log(`🔍 Testing ${route.name} at ${route.path}...`);
      
      try {
        const response = await fetch(`${API_ENDPOINT}${route.path}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(8000) // 8 second timeout per route
        });
        
        const routeDuration = Date.now() - routeStartTime;
        const routeResult = {
          success: response.status < 500,
          statusCode: response.status,
          responseTime: routeDuration,
          critical: route.critical
        };
        
        results.routes[route.name] = routeResult;
        
        if (routeResult.success) {
          console.log(`✅ ${route.name} responded in ${routeDuration}ms (${response.status})`);
        } else {
          console.warn(`⚠️ ${route.name} returned ${response.status} in ${routeDuration}ms`);
          if (route.critical) {
            results.errors.push(`Critical route ${route.name} failed with status ${response.status}`);
          } else {
            results.warnings.push(`Non-critical route ${route.name} returned ${response.status}`);
          }
        }
        
      } catch (routeError) {
        const routeDuration = Date.now() - routeStartTime;
        const routeResult = {
          success: false,
          error: routeError.message,
          responseTime: routeDuration,
          critical: route.critical
        };
        
        results.routes[route.name] = routeResult;
        console.error(`❌ ${route.name} failed after ${routeDuration}ms:`, routeError.message);
        
        if (route.critical) {
          results.errors.push(`Critical route ${route.name} failed: ${routeError.message}`);
        } else {
          results.warnings.push(`Non-critical route ${route.name} failed: ${routeError.message}`);
        }
      }
    }
    
    // Calculate overall results
    const totalDuration = Date.now() - startTime;
    results.responseTime = totalDuration;
    
    // Check if critical routes are working
    const criticalRoutes = routes.filter(r => r.critical);
    const criticalSuccess = criticalRoutes.every(route => 
      results.routes[route.name] && results.routes[route.name].success
    );
    
    if (criticalSuccess) {
      results.success = true;
      results.status = 'online';
      console.log(`✅ Server is fully online! All critical routes responding (${totalDuration}ms total)`);
      
      // Log summary
      const successCount = Object.values(results.routes).filter(r => r.success).length;
      const totalCount = routes.length;
      console.log(`📊 Route Summary: ${successCount}/${totalCount} routes responding`);
      
    } else {
      results.success = false;
      results.status = 'partial';
      console.warn(`⚠️ Server partially online - some critical routes failing (${totalDuration}ms total)`);
    }
    
  } catch (error) {
    const duration = Date.now() - startTime;
    results.responseTime = duration;
    results.success = false;
    results.status = 'offline';
    results.errors.push(`Overall ping failed: ${error.message}`);
    
    console.error(`❌ Server ping completely failed after ${duration}ms:`, error.message);
    
    // Check for specific error types
    if (error.name === 'AbortError') {
      console.warn('⏰ Server ping timed out - server may be sleeping');
      results.warnings.push('Server ping timed out - server may be starting up');
    } else if (error.message.includes('fetch')) {
      console.warn('🌐 Network error - check internet connection');
      results.warnings.push('Network error - check internet connection');
    }
  }
  
  return results;
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
  createNft: createNFT, // alias for backward compatibility if needed
  createIP,
  createIp: createIP, // alias for backward compatibility if needed
  updateBlockchainData,
  listOnMarketplace,
  purchaseIP,
  getMarketplaceListings,
  getUserIPs,
  getAllAssets,
  getAssetById,
  transferIPOwnership,
  // Faucet endpoints
  claimTokens,
  checkEligibility,
  getTokenBalance,
  // Server health
  pingServer,
  pingSingleRoute,
  // Utility
  uploadToCloudinary,
  readFileAsDataURL,
  // High-level functions
  createAsset
};
