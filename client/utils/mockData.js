// Mock data and localStorage management - no backend needed

const STORAGE_KEYS = {
  WALLET: 'connected_wallet',
  MY_NFTS: 'my_nfts',
  MARKETPLACE: 'marketplace_items',
  ALL_NFTS: 'all_nfts'
};

// Initialize with some sample marketplace items
const INITIAL_MARKETPLACE = [
  {
    id: '1',
    name: "Digital Art Masterpiece",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors.",
    price: 0.5,
    image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop",
    creator: "0x1234...5678",
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: "Cyberpunk Portrait",
    description: "Futuristic portrait with neon lighting and cyberpunk aesthetics.",
    price: 1.2,
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=500&fit=crop",
    creator: "0xabcd...efgh",
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: "Abstract Geometry",
    description: "Mathematical beauty expressed through geometric forms and color theory.",
    price: 0.8,
    image_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=700&fit=crop",
    creator: "0x9876...5432",
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: "Nature's Symphony",
    description: "Digital interpretation of natural landscapes with ethereal lighting.",
    price: 2.1,
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=550&fit=crop",
    creator: "0xfedc...ba98",
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: "Urban Dreams",
    description: "City skylines reimagined through artistic vision.",
    price: 1.5,
    image_url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop",
    creator: "0x1111...2222",
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: "Cosmic Journey",
    description: "Space exploration themes with nebulas and stellar formations.",
    price: 3.0,
    image_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=650&fit=crop",
    creator: "0x3333...4444",
    createdAt: new Date().toISOString()
  }
];

// Initialize localStorage if empty
export const initializeStorage = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEYS.MARKETPLACE)) {
    localStorage.setItem(STORAGE_KEYS.MARKETPLACE, JSON.stringify(INITIAL_MARKETPLACE));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.MY_NFTS)) {
    localStorage.setItem(STORAGE_KEYS.MY_NFTS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ALL_NFTS)) {
    localStorage.setItem(STORAGE_KEYS.ALL_NFTS, JSON.stringify(INITIAL_MARKETPLACE));
  }
};

// Wallet functions
export const connectWallet = () => {
  const mockWallet = '0x' + Math.random().toString(16).substr(2, 40);
  localStorage.setItem(STORAGE_KEYS.WALLET, mockWallet);
  return mockWallet;
};

export const disconnectWallet = () => {
  localStorage.removeItem(STORAGE_KEYS.WALLET);
};

export const getConnectedWallet = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.WALLET);
};

// Marketplace functions
export const getMarketplaceItems = () => {
  if (typeof window === 'undefined') return [];
  const items = localStorage.getItem(STORAGE_KEYS.MARKETPLACE);
  return items ? JSON.parse(items) : [];
};

export const getMyNFTs = () => {
  if (typeof window === 'undefined') return [];
  const items = localStorage.getItem(STORAGE_KEYS.MY_NFTS);
  return items ? JSON.parse(items) : [];
};

export const purchaseNFT = (nftId) => {
  const marketplace = getMarketplaceItems();
  const myNFTs = getMyNFTs();
  
  const nftIndex = marketplace.findIndex(item => item.id === nftId);
  if (nftIndex === -1) return false;
  
  const purchasedNFT = marketplace[nftIndex];
  marketplace.splice(nftIndex, 1);
  myNFTs.push({
    ...purchasedNFT,
    purchasedAt: new Date().toISOString()
  });
  
  localStorage.setItem(STORAGE_KEYS.MARKETPLACE, JSON.stringify(marketplace));
  localStorage.setItem(STORAGE_KEYS.MY_NFTS, JSON.stringify(myNFTs));
  
  return true;
};

export const listNFTOnMarketplace = (nft, price) => {
  const marketplace = getMarketplaceItems();
  const myNFTs = getMyNFTs();
  
  const nftIndex = myNFTs.findIndex(item => item.id === nft.id);
  if (nftIndex === -1) return false;
  
  const nftToList = myNFTs[nftIndex];
  myNFTs.splice(nftIndex, 1);
  
  marketplace.push({
    ...nftToList,
    price: parseFloat(price),
    listedAt: new Date().toISOString()
  });
  
  localStorage.setItem(STORAGE_KEYS.MARKETPLACE, JSON.stringify(marketplace));
  localStorage.setItem(STORAGE_KEYS.MY_NFTS, JSON.stringify(myNFTs));
  
  return true;
};

export const createNFT = (nftData) => {
  const myNFTs = getMyNFTs();
  const allNFTs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_NFTS) || '[]');
  
  const newNFT = {
    id: Date.now().toString(),
    ...nftData,
    creator: getConnectedWallet(),
    createdAt: new Date().toISOString()
  };
  
  myNFTs.push(newNFT);
  allNFTs.push(newNFT);
  
  localStorage.setItem(STORAGE_KEYS.MY_NFTS, JSON.stringify(myNFTs));
  localStorage.setItem(STORAGE_KEYS.ALL_NFTS, JSON.stringify(allNFTs));
  
  return newNFT;
};

export const uploadImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
