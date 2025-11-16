# Story Protocol dApp Marketplace

A decentralized application built on Story Protocol that enables users to create, list, and trade intellectual property (IP) assets as NFTs.

## Features

- 🎨 **Create IP Assets**: Upload files to Cloudinary and register them as NFTs with IP protection
- 🏪 **Marketplace**: Browse and purchase IP assets using IPT tokens
- 💼 **My IPs**: Manage your owned IP assets
- 🔗 **Blockchain Integration**: Built on Story Protocol for IP rights management
- 💰 **Token Payments**: Purchase IPs using IPT (IP Token) via MetaMask
- 📥 **Download**: Access your purchased files

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TailwindCSS + DaisyUI** - Styling
- **ethers.js** - Blockchain interaction
- **Cloudinary** - File storage

### Backend
- **NestJS** - Node.js framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **ethers.js** - Blockchain integration

### Smart Contracts
- **Solidity** - Contract language
- **Story Protocol** - IP rights management
- **OpenZeppelin** - Contract standards

## Quick Start

### 🚀 New to Testnet? Start Here!

**[QUICK_TESTNET_GUIDE.md](QUICK_TESTNET_GUIDE.md)** - Get testnet tokens in 5 minutes!

⚠️ **Important**: This application uses **Story Protocol Testnet**. You'll need testnet tokens to interact with the blockchain.

**Testnet Resources:**
- 🚀 [Quick Testnet Guide](QUICK_TESTNET_GUIDE.md) - Fast setup (5 min)
- 📖 [Detailed Testnet Setup](TESTNET_SETUP.md) - Complete guide with troubleshooting
- 🏃 [Quickstart Guide](QUICKSTART.md) - Application setup

### Setup Steps

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Setup environment
cp server/.env.example server/.env
cp client/.env.example client/.env.local

# Start MongoDB
mongod

# Start backend (terminal 1)
cd server && npm run start:dev

# Start frontend (terminal 2)
cd client && npm run dev
```

Visit http://localhost:3000

## Documentation

- 📖 [Quick Start Guide](QUICKSTART.md) - Get running in 5 minutes
- 🚀 [Deployment Guide](DEPLOYMENT_GUIDE.md) - Production deployment
- 🏗️ [Implementation Details](IMPLEMENTATION.md) - Architecture and API
- 📝 [Changes Summary](CHANGES_SUMMARY.md) - What was implemented
- 📋 [Contract Analysis](contract/ContractAnalysis.md) - Smart contract details

## Project Structure

```
.
├── client/                 # Next.js frontend
│   ├── app/               # Pages and routes
│   │   ├── create/        # Create IP page
│   │   ├── marketplace/   # Marketplace page
│   │   └── profile/       # My IPs page
│   ├── components/        # React components
│   ├── hooks/             # Custom hooks (useWallet)
│   └── utils/             # Utilities (API, contracts)
│
├── server/                # NestJS backend
│   └── src/
│       ├── assets/        # Assets module (NFT/IP/Marketplace)
│       ├── user/          # User module (wallet sync)
│       └── web3/          # Web3 integration
│
└── contract/              # Smart contracts
    ├── src/               # Solidity contracts
    │   ├── IPCreator.sol
    │   ├── IPMarketplace.sol
    │   └── IPToken.sol
    └── text-interfaces/   # Contract interfaces
```

## User Flow

### 1. Create IP Asset
1. Connect MetaMask wallet
2. Upload file (image/dataset)
3. Enter title and description
4. Submit → File uploaded to Cloudinary
5. NFT + IP metadata created
6. Asset appears in "My IPs"

### 2. List on Marketplace
1. Go to "My IPs"
2. Click "List" on an asset
3. Enter price in IPT tokens
4. Confirm listing
5. Asset appears in marketplace

### 3. Purchase IP
1. Browse marketplace
2. Click on an asset
3. View details (name, description, creator, price)
4. Click "Buy Now"
5. Approve MetaMask transaction
6. Asset transferred to your collection
7. Download file from "My IPs"

## API Endpoints

### Assets
- `POST /assets/nft` - Create NFT metadata
- `POST /assets/ip` - Create IP metadata
- `POST /assets/marketplace/list` - List on marketplace
- `POST /assets/marketplace/purchase` - Purchase IP
- `GET /assets/marketplace` - Get all listings
- `GET /assets/user/:wallet` - Get user's IPs

### Users
- `POST /users/sync-wallet` - Sync wallet connection
- `GET /users/:id` - Get user profile

## Smart Contracts

### IPCreator.sol
Creates NFT + IP Asset atomically with Story Protocol integration.

```solidity
function createIPFromFile(
    address recipient,
    string metadataURI,
    bytes32 metadataHash,
    string licenseURI
) returns (uint256 tokenId, address ipId, uint256 licenseTermsId)
```

### IPMarketplace.sol
Handles listing and purchasing of IP assets.

```solidity
function listIP(address nftContract, uint256 tokenId, uint256 price)
function purchaseIP(bytes32 listingId)
```

### IPToken.sol
ERC20 token for marketplace payments.

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
NEXT_PUBLIC_IP_CREATOR_ADDRESS=0x...
NEXT_PUBLIC_IP_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_IP_TOKEN_ADDRESS=0x...
```

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/klaim
PORT=3001
RPC_URL=https://testnet.storyrpc.io
IP_CREATOR_ADDRESS=0x...
IP_MARKETPLACE_ADDRESS=0x...
IP_TOKEN_ADDRESS=0x...
```

## Development

```bash
# Backend development
cd server
npm run start:dev

# Frontend development
cd client
npm run dev

# Run tests
npm test
```

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy

1. Deploy smart contracts to Story testnet
2. Update contract addresses in .env files
3. Deploy backend to Railway/Heroku
4. Deploy frontend to Vercel/Netlify
5. Configure MongoDB Atlas
6. Setup Cloudinary

## Current Status

### ✅ Implemented
- File upload to Cloudinary
- NFT/IP metadata creation
- Marketplace listing and browsing
- Purchase flow (database level)
- My IPs management
- Wallet connection
- Download functionality

### ⏳ In Progress
- Smart contract deployment
- Blockchain transaction integration
- MetaMask payment flow
- Event monitoring
- On-chain ownership transfer

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our server](#)
- 📚 Docs: [Documentation](#)

## Acknowledgments

- [Story Protocol](https://www.story.foundation/) - IP rights infrastructure
- [OpenZeppelin](https://openzeppelin.com/) - Smart contract standards
- [Cloudinary](https://cloudinary.com/) - Media management

---

Built with ❤️ using Story Protocol
