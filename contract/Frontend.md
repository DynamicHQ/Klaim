# Frontend Integration Guide

## Core Functionality
The frontend handles user interactions, file uploads, and blockchain transactions.

## Key Contracts to Interact With
1. **IPCreator** - Auto-creates NFT + IP from uploaded files
2. **IPMarketplace** - Lists and purchases IP Assets
3. **SimpleNFT** - For direct NFT operations (if needed)

## Frontend Flow & Contract Calls

### 1. Upload & Create IP Asset with License
```javascript
// User uploads image/file
const uploadFile = async (file, licenseType) => {
  // 1. Upload file to IPFS (Frontend handles this)
  const fileHash = await uploadToIPFS(file);
  const metadataURI = `https://ipfs.io/ipfs/${fileHash}`;
  
  // 2. Create and upload license text to IPFS
  const licenseText = generateLicenseText(licenseType, commercialRevShare);
  const licenseHash = await uploadToIPFS(licenseText);
  const licenseURI = `https://ipfs.io/ipfs/${licenseHash}`;
  
  // 3. Create metadata hash (Frontend calculates)
  const metadataHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(JSON.stringify(metadata))
  );
  
  // 4. Call contract to create NFT + IP with viewable license
  const tx = await ipCreatorContract.createIPFromFile(
    userAddress,           // recipient - from wallet
    metadataURI,          // from IPFS upload
    metadataHash,         // calculated above
    commercialRevShare,   // user input (e.g., 20 for 20%)
    licenseURI            // license text URL - makes it viewable!
  );
  
  return tx.wait();
};

// Generate human-readable license text
const generateLicenseText = (type, revShare) => {
  return `
IP LICENSE AGREEMENT

This IP Asset is licensed under the following terms:

✅ Commercial Use: ${type.commercial ? 'ALLOWED' : 'NOT ALLOWED'}
✅ Derivatives: ${type.derivatives ? 'ALLOWED' : 'NOT ALLOWED'}
✅ Revenue Share: ${revShare}% of derivative revenue
✅ Attribution: Required

Full terms available at: https://docs.story.foundation/pil
Generated: ${new Date().toISOString()}
  `;
};
```

### 2. View IP Asset Licenses
```javascript
// Get license information for an IP Asset
const getLicenseInfo = async (ipId) => {
  // Get all licenses attached to IP
  const licenses = await licenseViewerContract.getIPLicenses(ipId);
  
  // Get human-readable license text
  const [licenseURI, summary] = await licenseViewerContract.getLicenseText(ipId, 0);
  
  // Get permissions summary
  const permissions = await licenseViewerContract.getLicensePermissions(ipId);
  
  return {
    licenses,           // Full license data
    licenseURI,        // URL to view full license text
    summary,           // Human-readable summary
    permissions        // What's allowed/not allowed
  };
};

// Display license in UI
const displayLicense = async (ipId) => {
  const licenseInfo = await getLicenseInfo(ipId);
  
  // Show license summary in UI
  document.getElementById('license-summary').innerHTML = licenseInfo.summary;
  
  // Add link to full license text
  document.getElementById('license-link').href = licenseInfo.licenseURI;
  
  // Show permissions
  document.getElementById('commercial-use').checked = licenseInfo.permissions.commercialUse;
  document.getElementById('derivatives').checked = licenseInfo.permissions.derivativesAllowed;
};
```

### 3. Browse & Purchase IP Assets
```javascript
// Get marketplace listings with license info (Frontend reads events)
const getListings = async () => {
  const filter = ipMarketplaceContract.filters.IPListed();
  const events = await ipMarketplaceContract.queryFilter(filter);
  
  // Add license information to each listing
  const listings = await Promise.all(events.map(async (event) => {
    const licenseInfo = await getLicenseInfo(event.args.ipId);
    
    return {
      listingId: event.args.listingId,
      seller: event.args.seller,
      ipId: event.args.ipId,
      price: event.args.price,
      licenseURI: licenseInfo.licenseURI,      // Link to view license
      licenseSummary: licenseInfo.summary,     // Show in marketplace
      permissions: licenseInfo.permissions     // What buyer gets
    };
  }));
  
  return listings;
};

// Purchase IP Asset
const purchaseIP = async (listingId, price) => {
  // 1. Approve IP token spending (Frontend handles)
  await ipTokenContract.approve(marketplaceAddress, price);
  
  // 2. Purchase the IP
  const tx = await ipMarketplaceContract.purchaseIP(listingId);
  return tx.wait();
};
```

### 4. User Wallet Integration
```javascript
// Connect wallet (Frontend handles)
const connectWallet = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  
  // Initialize contracts with signer
  ipCreatorContract = new ethers.Contract(IP_CREATOR_ADDRESS, abi, signer);
  ipMarketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, abi, signer);
  
  return { provider, signer, address };
};
```

## Data Sources for Frontend
- **User Input**: File upload, pricing, royalty percentages
- **Wallet**: User address, transaction signing
- **IPFS**: File storage, metadata URIs
- **Blockchain Events**: Marketplace listings, transaction history
- **Local Storage**: User preferences, cached data

## Frontend Responsibilities
1. File upload to IPFS
2. Metadata creation and hashing
3. Wallet connection and transaction signing
4. UI for browsing marketplace
5. Event listening for real-time updates
6. Error handling and user feedback