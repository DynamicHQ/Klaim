// Lightweight IPFS uploader using nft.storage HTTP API (no extra deps)
// Requires environment variable NEXT_PUBLIC_NFT_STORAGE_KEY set to an nft.storage API key.
// If not set, this will throw.

const NFT_STORAGE_ENDPOINT = 'https://api.nft.storage/upload';

export async function uploadToIPFS(data, filename = 'file') {
  const key = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_NFT_STORAGE_KEY is not set');

  const formData = new FormData();

  if (typeof data === 'string') {
    // wrap string in a Blob
    const blob = new Blob([data], { type: 'text/plain' });
    formData.append('file', blob, filename);
  } else if (data instanceof Blob || data instanceof File) {
    formData.append('file', data, data.name || filename);
  } else if (typeof data === 'object') {
    // assume JSON
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('file', blob, filename);
  } else {
    throw new Error('Unsupported data type for IPFS upload');
  }

  const res = await fetch(NFT_STORAGE_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`
    },
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IPFS upload failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const json = await res.json();
  // nft.storage returns value.cid
  const cid = json?.value?.cid;
  if (!cid) throw new Error('No CID returned from nft.storage');

  return {
    cid,
    url: `https://ipfs.io/ipfs/${cid}`,
    raw: json
  };
}

export default { uploadToIPFS };
