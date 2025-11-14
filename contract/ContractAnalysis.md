# Contract Analysis & Integration Guide

## Essential Contracts for Your Marketplace

### 1. **IPCreator.sol** ⭐ CRITICAL
**Purpose**: Auto-creates NFT + IP Asset from uploaded files
**Frontend Integration**: 
- User uploads file → Frontend uploads to IPFS → Calls `createIPFromFile()`
- Handles batch uploads via `batchCreateIPs()`

**Data Sources**:
- `recipient`: From wallet connection
- `metadataURI`: From frontend IPFS upload
- `metadataHash`: Calculated by frontend
- `commercialRevShare`: User input (slider/dropdown)

**Missing/Improvements**:
- ✅ Complete - handles core functionality
- Consider adding file type validation
- Add pricing tiers for different license types

### 2. **IPMarketplace.sol** ⭐ CRITICAL  
**Purpose**: Lists and sells IP Assets using IP tokens
**Frontend Integration**:
- List IP: User selects owned NFT → Sets price → Calls `listIP()`
- Purchase: User browses listings → Approves tokens → Calls `purchaseIP()`

**Data Sources**:
- `nftContract`: From user's owned NFTs (frontend queries)
- `tokenId`: From user selection
- `price`: User input
- `listingId`: From marketplace events (backend indexes)

**Missing/Improvements**:
- ✅ Complete - handles ownership transfer correctly
- Consider adding auction functionality
- Add listing expiration dates

### 3. **SimpleNFT.sol** ⭐ REQUIRED
**Purpose**: Basic NFT contract for minting
**Integration**: Used by IPCreator internally
**Status**: ✅ Complete

## Secondary Contracts (Optional for MVP)

### 4. **LicenseTermsManager.sol** 
**Use Case**: Advanced license customization
**Priority**: Medium - Can use PIL defaults initially

### 5. **RoyaltyManager.sol**
**Use Case**: Revenue claiming from derivatives  
**Priority**: Low - Automatic in Story Protocol

### 6. **DerivativeManager.sol**
**Use Case**: Creating derivative works
**Priority**: Low - Not needed for basic marketplace

## Contract Deployment Order

1. **Deploy Story Protocol contracts** (already deployed on testnet)
2. **Deploy IPCreator** with Story Protocol addresses
3. **Deploy IPMarketplace** with IP token address
4. **Frontend connects to both contracts**

## Key Integration Points

### Frontend → Contracts
```javascript
// 1. Create IP from uploaded file
const createIP = async (file, price, royalty) => {
  const ipfsURI = await uploadToIPFS(file);
  const hash = calculateHash(metadata);
  
  return await ipCreator.createIPFromFile(
    userAddress,    // From wallet
    ipfsURI,        // From IPFS
    hash,           // Calculated
    royalty         // User input
  );
};

// 2. List IP for sale  
const listIP = async (nftContract, tokenId, price) => {
  return await marketplace.listIP(
    nftContract,    // From user's NFTs
    tokenId,        // From user selection  
    price           // User input
  );
};

// 3. Purchase IP
const purchaseIP = async (listingId, price) => {
  await ipToken.approve(marketplaceAddress, price);
  return await marketplace.purchaseIP(listingId);
};
```

### Backend → Blockchain
```javascript
// Monitor events for database updates
ipCreator.on('IPAssetCreated', (ipId, tokenId, owner) => {
  database.saveIPAsset({ ipId, tokenId, owner });
});

marketplace.on('IPListed', (listingId, seller, ipId, price) => {
  database.saveListing({ listingId, seller, ipId, price });
});
```

## Missing Components & Recommendations

### 1. **IP Token Contract** 🚨 MISSING
You need an ERC20 token for payments:
```solidity
// Simple ERC20 for marketplace payments
contract IPToken is ERC20 {
    constructor() ERC20("IP Token", "IPT") {
        _mint(msg.sender, 1000000 * 10**18); // Initial supply
    }
}
```

### 2. **Metadata Standards** 📋 NEEDED
Define JSON metadata structure:
```json
{
  "name": "My IP Asset",
  "description": "Description of the IP",
  "image": "ipfs://hash",
  "creator": "0x...",
  "createdAt": "2024-01-01T00:00:00Z",
  "fileType": "image/png",
  "license": "commercial-remix"
}
```

### 3. **Access Control** 🔒 CONSIDER
Add role-based permissions:
- Admin functions for emergency stops
- Marketplace fee collection
- Whitelist for approved creators

## Deployment Configuration

### Story Protocol Addresses (Aeneid Testnet)
```javascript
const STORY_ADDRESSES = {
  IP_ASSET_REGISTRY: "0x77319B4031e6eF1250907aa00018B8B1c67a244b",
  LICENSING_MODULE: "0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f", 
  PIL_TEMPLATE: "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316",
  ROYALTY_POLICY_LAP: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E",
  MERC20: "0xF2104833d386a2734a4eB3B8ad6FC6812F29E38E"
};
```

## Testing Checklist

- [ ] Deploy IPCreator with correct Story Protocol addresses
- [ ] Deploy IPMarketplace with IP token address  
- [ ] Test file upload → IP creation flow
- [ ] Test IP listing → purchase flow
- [ ] Verify IP ownership transfers correctly
- [ ] Test event monitoring for backend indexing

## Summary

**Core contracts needed**: IPCreator + IPMarketplace + IPToken
**Story Protocol integration**: ✅ Properly implemented
**Missing**: IP Token contract for payments
**Ready for**: MVP development with file upload → IP creation → marketplace sales