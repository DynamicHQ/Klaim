// Mock data and localStorage management - no backend needed

const STORAGE_KEYS = {
  WALLET: 'connected_wallet',
  MY_NFTS: 'my_nfts',
  MARKETPLACE: 'marketplace_items',
  ALL_NFTS: 'all_nfts'
};

// Initialize with 20 uniform sample marketplace items
const INITIAL_MARKETPLACE = [
  {
    id: '1',
    name: "Digital Art Collection #1",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art1/400/400",
    creator: "0x1234...5678",
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: "Digital Art Collection #2",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art2/400/400",
    creator: "0xabcd...efgh",
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: "Digital Art Collection #3",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art3/400/400",
    creator: "0x9876...5432",
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: "Digital Art Collection #4",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art4/400/400",
    creator: "0xfedc...ba98",
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: "Digital Art Collection #5",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art5/400/400",
    creator: "0x1111...2222",
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: "Digital Art Collection #6",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art6/400/400",
    creator: "0x3333...4444",
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    name: "Digital Art Collection #7",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art7/400/400",
    creator: "0x5555...6666",
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    name: "Digital Art Collection #8",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art8/400/400",
    creator: "0x7777...8888",
    createdAt: new Date().toISOString()
  },
  {
    id: '9',
    name: "Digital Art Collection #9",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art9/400/400",
    creator: "0x9999...aaaa",
    createdAt: new Date().toISOString()
  },
  {
    id: '10',
    name: "Digital Art Collection #10",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art10/400/400",
    creator: "0xbbbb...cccc",
    createdAt: new Date().toISOString()
  },
  {
    id: '11',
    name: "Digital Art Collection #11",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art11/400/400",
    creator: "0xdddd...eeee",
    createdAt: new Date().toISOString()
  },
  {
    id: '12',
    name: "Digital Art Collection #12",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art12/400/400",
    creator: "0xffff...0000",
    createdAt: new Date().toISOString()
  },
  {
    id: '13',
    name: "Digital Art Collection #13",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art13/400/400",
    creator: "0x1a2b...3c4d",
    createdAt: new Date().toISOString()
  },
  {
    id: '14',
    name: "Digital Art Collection #14",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art14/400/400",
    creator: "0x5e6f...7g8h",
    createdAt: new Date().toISOString()
  },
  {
    id: '15',
    name: "Digital Art Collection #15",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art15/400/400",
    creator: "0x9i0j...1k2l",
    createdAt: new Date().toISOString()
  },
  {
    id: '16',
    name: "Digital Art Collection #16",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art16/400/400",
    creator: "0x3m4n...5o6p",
    createdAt: new Date().toISOString()
  },
  {
    id: '17',
    name: "Digital Art Collection #17",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art17/400/400",
    creator: "0x7q8r...9s0t",
    createdAt: new Date().toISOString()
  },
  {
    id: '18',
    name: "Digital Art Collection #18",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art18/400/400",
    creator: "0x1u2v...3w4x",
    createdAt: new Date().toISOString()
  },
  {
    id: '19',
    name: "Digital Art Collection #19",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art19/400/400",
    creator: "0x5y6z...7a8b",
    createdAt: new Date().toISOString()
  },
  {
    id: '20',
    name: "Digital Art Collection #20",
    description: "A stunning digital artwork featuring abstract patterns and vibrant colors. Perfect for collectors.",
    price: 0.5,
    image_url: "https://picsum.photos/seed/art20/400/400",
    creator: "0x9c0d...1e2f",
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
  const mockWallet = '0x' + Math.random().toString(16).substring(2, 42);
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
