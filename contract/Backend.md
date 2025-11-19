# Backend Integration Guide

## Core Functionality
The backend handles metadata processing, event indexing, and API services.

## Key Responsibilities
1. **Event Indexing** - Monitor blockchain events and update database
2. **Metadata Management** - Process and validate IP metadata
3. **API Services** - Provide data to frontend
4. **File Processing** - Handle IPFS integration

## Backend Flow & Contract Integration

### 1. Event Monitoring & Indexing
```javascript
// Monitor IPCreator events
const monitorIPCreation = async () => {
  const filter = ipCreatorContract.filters.IPAssetCreated();
  
  ipCreatorContract.on(filter, async (ipId, tokenId, owner, event) => {
    // Store in database
    await db.ipAssets.create({
      ipId: ipId,
      tokenId: tokenId.toString(),
      owner: owner,
      createdAt: new Date(),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    });
  });
};

// Monitor marketplace events
const monitorMarketplace = async () => {
  // Listen for listings
  ipMarketplaceContract.on('IPListed', async (listingId, seller, ipId, price) => {
    await db.listings.create({
      listingId: listingId,
      seller: seller,
      ipId: ipId,
      price: price.toString(),
      active: true,
      listedAt: new Date()
    });
  });
  
  // Listen for sales
  ipMarketplaceContract.on('IPSold', async (listingId, buyer, seller, ipId, price) => {
    await db.listings.update(
      { active: false, soldAt: new Date(), buyer: buyer },
      { where: { listingId: listingId } }
    );
    
    await db.ipAssets.update(
      { owner: buyer },
      { where: { ipId: ipId } }
    );
  });
};
```

### 2. API Endpoints
```javascript
// Get marketplace listings
app.get('/api/listings', async (req, res) => {
  const listings = await db.listings.findAll({
    where: { active: true },
    include: [{ model: db.ipAssets }]
  });
  res.json(listings);
});

// Get user's IP assets
app.get('/api/user/:address/assets', async (req, res) => {
  const assets = await db.ipAssets.findAll({
    where: { owner: req.params.address }
  });
  res.json(assets);
});

// Get IP asset details
app.get('/api/asset/:ipId', async (req, res) => {
  const asset = await db.ipAssets.findOne({
    where: { ipId: req.params.ipId }
  });
  res.json(asset);
});
```

### 3. Metadata Processing
```javascript
// Process uploaded metadata
const processMetadata = async (file, userAddress) => {
  // 1. Upload to IPFS (Backend can handle this)
  const ipfsHash = await ipfs.add(file);
  const metadataURI = `https://ipfs.io/ipfs/${ipfsHash}`;
  
  // 2. Create metadata object
  const metadata = {
    name: file.name,
    description: file.description || '',
    image: metadataURI,
    creator: userAddress,
    createdAt: new Date().toISOString()
  };
  
  // 3. Calculate hash
  const metadataHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(JSON.stringify(metadata))
  );
  
  return { metadataURI, metadataHash, metadata };
};
```

### 4. Contract State Synchronization
```javascript
// Sync contract state with database
const syncContractState = async () => {
  // Get all IP assets from contract events
  const filter = ipCreatorContract.filters.IPAssetCreated();
  const events = await ipCreatorContract.queryFilter(filter, 0, 'latest');
  
  for (const event of events) {
    const exists = await db.ipAssets.findOne({
      where: { ipId: event.args.ipId }
    });
    
    if (!exists) {
      await db.ipAssets.create({
        ipId: event.args.ipId,
        tokenId: event.args.tokenId.toString(),
        owner: event.args.owner,
        blockNumber: event.blockNumber
      });
    }
  }
};
```

## Data Sources for Backend
- **Blockchain Events**: Contract events for state changes
- **IPFS**: Metadata and file storage
- **Database**: Indexed data for fast queries
- **External APIs**: Price feeds, metadata validation

## Backend Responsibilities
1. Event monitoring and indexing
2. Database management
3. IPFS file handling
4. API endpoint provision
5. Data validation and processing
6. Real-time updates via WebSocket/SSE