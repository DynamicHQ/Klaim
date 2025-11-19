# dApp Implementation Guide

## Overview
This is a decentralized application (dApp) built on Story Protocol that allows users to:
- Upload datasets/files to IPFS via Pinata
- Create NFTs and register them as IP Assets
- List IPs on a marketplace
- Purchase IPs with IPT tokens via MetaMask
- View and manage owned IPs

## Architecture

### Smart Contracts (Story Protocol)
- **IPCreator.sol**: Creates NFT + IP Asset atomically
- **IPMarketplace.sol**: Handles listing and purchasing of IPs
- **IPToken.sol**: ERC20 token for marketplace payments

### Backend (NestJS)
- **Assets Module**: Manages NFT/IP metadata and marketplace operations
- **User Module**: Handles wallet authentication
- **Web3 Module**: Blockchain integration (to be implemented)

### Frontend (Next.js)
- **Create Page**: Upload files and create IPs
- **Marketplace Page**: Browse and purchase listed IPs
- **Profile Page**: View owned IPs and list them for sale

## Data Flow

### 1. Creating an IP Asset

```
User uploads file → Cloudinary
                 ↓
Frontend gets image_url
                 ↓
POST /assets/nft with:
  - nft_info: { name, description, image_url }
  - walletAddress
                 ↓
Backend saves to MongoDB
                 ↓
POST /assets/ip with:
  - ip_info: { title, description, creators, createdat }
  - nftId (links to NFT)
                 ↓
Backend updates asset with IP info
                 ↓
Frontend shows success
```

### 2. Listing on Marketplace

```
User clicks "List" on owned IP
                 ↓
User enters price in IPT
                 ↓
POST /assets/marketplace/list with:
  - nftContract
  - tokenId
  - price
  - seller (wallet address)
                 ↓
Backend marks asset as listed
                 ↓
Asset appears in marketplace
```

### 3. Purchasing an IP

```
User clicks "Buy Now" on listing
                 ↓
MetaMask popup for IPT token approval
                 ↓
MetaMask popup for purchase transaction
                 ↓
POST /assets/marketplace/purchase with:
  - listingId
  - buyer (wallet address)
                 ↓
Backend transfers ownership
                 ↓
Asset appears in buyer's "My IPs"
                 ↓
Asset removed from marketplace
```

## API Endpoints

### Assets

#### Create NFT
```
POST /assets/nft
Body: {
  nft_info: {
    name: string,
    description: string,
    image_url: string
  },
  walletAddress: string
}
```

#### Create IP
```
POST /assets/ip
Body: {
  ip_info: {
    title: string,
    description: string,
    creators: string,
    createdat: string
  },
  nftId?: string
}
```

#### List on Marketplace
```
POST /assets/marketplace/list
Body: {
  nftContract: string,
  tokenId: number,
  price: number,
  seller: string
}
```

#### Purchase IP
```
POST /assets/marketplace/purchase
Body: {
  listingId: string,
  buyer: string
}
```

#### Get Marketplace Listings
```
GET /assets/marketplace
```

#### Get User's IPs
```
GET /assets/user/:walletAddress
```

## Database Schema

### Asset Model
```typescript
{
  // NFT Info
  name: string,
  description: string,
  image_url: string,
  
  // IP Info
  title: string,
  creator: ObjectId (ref: User),
  creators: string (wallet address),
  createdat: string,
  
  // Blockchain Data
  nftId: string,
  ipId: string,
  tokenId: number,
  transactionHash: string,
  
  // Marketplace Data
  isListed: boolean,
  listingId: string,
  price: number,
  currentOwner: string (wallet address),
  
  license: string,
  timestamps: true
}
```

## Setup Instructions

### Backend Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/klaim
PORT=3001
```

3. Start the server:
```bash
npm run start:dev
```

### Frontend Setup

1. Install dependencies:
```bash
cd client
npm install
```

2. Create `.env.local` file:
```
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

3. Start the development server:
```bash
npm run dev
```

### Cloudinary Setup

1. Create a Cloudinary account at https://cloudinary.com
2. Get your Cloud Name from the dashboard
3. Create an unsigned upload preset:
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set "Signing Mode" to "Unsigned"
   - Save and copy the preset name

## Contract Integration (To Be Implemented)

### IPCreator Contract
```solidity
function createIPFromFile(
  address recipient,
  string calldata metadataURI,
  bytes32 metadataHash,
  string calldata licenseURI
) external returns (uint256 tokenId, address ipId, uint256 licenseTermsId)
```

### IPMarketplace Contract
```solidity
function listIP(
  address nftContract,
  uint256 tokenId,
  uint256 price
) external

function purchaseIP(bytes32 listingId) external
```

### Integration Steps

1. Deploy contracts to Story testnet
2. Update backend with contract addresses
3. Implement Web3 service in backend:
   - Monitor contract events
   - Update database on blockchain events
   - Trigger contract calls from API endpoints
4. Update frontend to:
   - Call contract methods via ethers.js
   - Handle MetaMask transactions
   - Wait for transaction confirmations

## Features Implemented

✅ File upload to Cloudinary
✅ NFT metadata creation
✅ IP metadata creation
✅ Marketplace listing
✅ Marketplace browsing
✅ Purchase flow (backend)
✅ My IPs page
✅ Wallet connection
✅ Download files

## Features To Implement

⏳ Blockchain contract integration
⏳ MetaMask payment flow
⏳ Event monitoring from contracts
⏳ Transaction confirmation UI
⏳ Ownership transfer on-chain
⏳ IPT token approval flow
⏳ Real-time marketplace updates

## Testing

### Manual Testing Flow

1. **Create IP**:
   - Connect wallet
   - Upload an image
   - Fill in title and description
   - Submit form
   - Verify IP appears in "My IPs"

2. **List on Marketplace**:
   - Go to "My IPs"
   - Click "List" on an IP
   - Enter price
   - Confirm listing
   - Verify IP appears in marketplace

3. **Purchase IP**:
   - Go to marketplace
   - Click on a listed IP
   - Click "Buy Now"
   - Confirm purchase
   - Verify IP appears in buyer's "My IPs"
   - Verify IP removed from marketplace

## Notes

- Currently using MongoDB for all data storage
- Blockchain integration is prepared but not yet connected
- MetaMask integration is set up but payment flow needs contract calls
- File downloads open Cloudinary URLs in new tab
- Ownership transfer is handled in database, needs blockchain sync
