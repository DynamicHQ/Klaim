// Frontend API helpers for backend endpoints
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || '';

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

export async function syncWallet(walletAddress) {
  return postJSON('/users/sync-wallet', { walletAddress });
}

export async function createNFT(nft_info, walletAddress) {
  // backend expects { nft_info: { ... } } per spec; include wallet if provided
  const body = { nft_info };
  if (walletAddress) body.walletAddress = walletAddress;
  return postJSON('/nft/create', body);
}

export async function createIP(ip_info) {
  return postJSON('/ip/create', { ip_info });
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
  readFileAsDataURL
};
