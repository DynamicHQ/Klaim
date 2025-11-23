// Frontend API helpers for backend endpoints
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3001';

// JWT token storage
let authToken = null;
let onUnauthorizedCallback = null;

/**
 * Set JWT token for authenticated requests
 * @param {string} token - JWT token
 */
export function setAuthToken(token) {
  authToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

/**
 * Clear JWT token
 */
export function clearAuthToken() {
  authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

/**
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

/**
 * Set callback for unauthorized responses
 * @param {Function} callback - Function to call on 401 responses
 */
export function setOnUnauthorizedCallback(callback) {
  onUnauthorizedCallback = callback;
}

/**
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
    
    const message = (json && json.message) || res.statusText || 'API error';
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
    
    const message = (json && json.message) || res.statusText || 'API error';
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
 * A high-level function to create a complete asset.
 * It uploads the image, then creates the NFT and IP records on the backend.
 * @param {object} assetData - Contains title, description, and image file.
 * @param {string} assetData.title - The title of the asset.
 * @param {string} assetData.description - The description of the asset.
 * @param {File} assetData.image - The image file for the asset.
 * @param {string} walletAddress - The creator's wallet address.
 * @returns {Promise<object>} The final response from the createIp call.
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

export async function listOnMarketplace(nftContract, tokenId, price, seller) {
  return postJSON('/assets/marketplace/list', {
    nftContract,
    tokenId,
    price,
    seller
  });
}

export async function purchaseIP(listingId, buyer) {
  return postJSON('/assets/marketplace/purchase', {
    listingId,
    buyer
  });
}

export async function getMarketplaceListings() {
  return getJSON('/assets/marketplace');
}

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
  listOnMarketplace,
  purchaseIP,
  getMarketplaceListings,
  getUserIPs,
  transferIPOwnership,
  // Utility
  uploadToCloudinary,
  readFileAsDataURL,
  // High-level functions
  createAsset
};
