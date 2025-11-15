// Frontend API helpers for backend endpoints
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3001';

async function postJSON(path, body) {
  const url = `${API_ENDPOINT}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
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
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    throw new Error(`Invalid JSON response from ${url}`);
  }

  if (!res.ok) {
    const message = (json && json.message) || res.statusText || 'API error';
    const err = new Error(message);
    err.status = res.status;
    err.response = json;
    throw err;
  }

  return json;
}

export async function syncWallet(walletAddress) {
  return postJSON('/users/sync-wallet', { walletAddress });
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
  syncWallet,
  createNFT,
  createIP,
  listOnMarketplace,
  purchaseIP,
  getMarketplaceListings,
  getUserIPs,
  uploadToCloudinary,
  readFileAsDataURL
};
