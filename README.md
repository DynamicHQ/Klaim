# Story Protocol dApp Marketplace

A decentralized application built on Story Protocol that enables users to create, list, and trade intellectual property (IP) assets as NFTs.

## Features

- 🎨 **Create IP Assets**: Upload files to IPFS via Pinata and register them as NFTs with IP protection
- 🛒 **Marketplace**: Browse and purchase IP assets using KIP tokens
- 💼 **My IPs**: Manage your owned IP assets
- 🔗 **Blockchain Integration**: Built on Story Protocol for IP rights management
- 💰 **KIP Token Payments**: Purchase IPs using KIP (Klaim) tokens via MetaMask
- 💳 **Real-time Balance**: View your KIP token balance in the navigation bar
- 🛡️ **Transaction Security**: Message signing verification prevents bot attacks
- 🔐 **Anti-Bot Protection**: Secure marketplace transactions with wallet verification
- 📥 **Download**: Access your purchased files

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TailwindCSS + DaisyUI** - Styling
- **ethers.js** - Blockchain interaction
- **Pinata** - IPFS File storage

### Backend
- **NestJS** - Node.js framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **ethers.js** - Blockchain integration

### Smart Contracts
- **Solidity** - Contract language
- **Story Protocol** - IP rights management
- **OpenZeppelin** - Contract standards
- **KIP Token** - Custom ERC20 token for marketplace payments

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
│   │   ├── SecurityTooltip.js           # Security info tooltips
│   │   └── TransactionVerificationModal.js  # Transaction verification UI
│   ├── contexts/          # React contexts
│   │   └── BalanceContext.js            # Balance refresh coordination
│   ├── hooks/             # Custom hooks
│   │   ├── useWallet.js                 # Wallet connection
│   │   ├── useKIPBalance.js             # KIP token balance management
│   │   └── useTransactionSecurity.js    # Transaction verification
│   └── utils/             # Utilities
│       ├── contracts.js                 # Smart contract interactions
│       ├── transactionSecurity.js       # Message signing utilities
│       └── kipTokenValidator.js         # Token validation tools
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
4. Submit → File uploaded to Pinata (IPFS)
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
3. View details (name, description, creator, price in KIP)
4. Click "Buy Now" (with security shield icon)
5. **Security Verification**: Sign verification message in MetaMask
6. Approve KIP token transaction
7. Asset transferred to your collection
8. Balance automatically refreshes in navbar
9. Download file from "My IPs"

## Security Features

### 🛡️ Transaction Security
All marketplace transactions require wallet signature verification to prevent bot attacks:

- **Message Signing**: Users must sign a verification message before each transaction
- **Unique Nonces**: Each message contains a unique nonce to prevent replay attacks
- **Transaction Details**: Messages include specific transaction information (asset ID, price, action)
- **Time Validation**: Messages expire after 5 minutes for security
- **Bot Prevention**: Automated scripts cannot bypass signature requirements

### 💳 KIP Balance Display
- **Real-time Balance**: KIP token balance shown in navigation bar
- **Auto-refresh**: Balance updates automatically after transactions
- **Loading States**: Clear indicators during balance fetching
- **Error Handling**: Graceful fallbacks when balance cannot be retrieved
- **Responsive Design**: Optimized display for mobile and desktop

### 🔐 User Experience
- **Progress Tracking**: Step-by-step verification process visualization
- **Security Tooltips**: Helpful information about security features
- **Accessibility**: Full screen reader support and keyboard navigation
- **Clear Feedback**: Detailed success/error messages throughout the process

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

### IPToken.sol (KIP Token)
ERC20 token for marketplace payments with additional features.

```solidity
// Standard ERC20 + custom functions
function mint(address to, uint256 amount) // Owner only
function burn(uint256 amount) // Burn tokens
function name() returns "Klaim"
function symbol() returns "KIP"
```

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_here
NEXT_PUBLIC_RPC_URL=https://aeneid.storyrpc.io/
NEXT_PUBLIC_IP_CREATOR_ADDRESS=0x...
NEXT_PUBLIC_IP_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_IP_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
```

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/klaim
PORT=3001
RPC_URL=https://aeneid.storyrpc.io/
IP_CREATOR_ADDRESS=0x...
IP_MARKETPLACE_ADDRESS=0x...
IP_TOKEN_ADDRESS=0x...
NFT_CONTRACT_ADDRESS=0x...
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
- File upload to Pinata (IPFS)
- NFT/IP metadata creation
- Marketplace listing and browsing
- Purchase flow with KIP token payments
- My IPs management
- Wallet connection and authentication
- Download functionality
- **KIP token balance display in navbar**
- **Transaction security with message signing**
- **Anti-bot protection for marketplace**
- **Real-time balance refresh system**
- **Enhanced UX with loading states and accessibility**

### ⏳ In Progress
- Smart contract deployment to mainnet
- Advanced marketplace features
- Event monitoring and notifications
- Enhanced IP rights management

## Recent Updates

### 🆕 Latest Features (v2.0)

#### KIP Token Integration
- **Token Symbol**: KIP (Klaim)
- **Real-time Balance**: Display in navigation bar
- **Auto-refresh**: Balance updates after transactions
- **Complete ABI**: Full ERC20 + custom functions support

#### Enhanced Security
- **Message Signing**: Required for all marketplace transactions
- **Bot Prevention**: Signature verification prevents automated attacks
- **Unique Nonces**: Replay attack protection
- **Transaction Verification**: Step-by-step process with clear feedback

#### User Experience Improvements
- **Security Tooltips**: Helpful information about verification process
- **Progress Tracking**: Visual indicators during transaction verification
- **Responsive Design**: Optimized for mobile and desktop
- **Accessibility**: Screen reader support and keyboard navigation
- **Error Handling**: Graceful fallbacks and clear error messages

#### Technical Enhancements
- **Balance Context**: Global balance refresh coordination
- **Transaction Hooks**: Reusable security and balance management
- **Validation Tools**: Built-in testing and validation utilities
- **Performance**: Optimized with caching and debounced refreshes

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
- [Pinata](https://pinata.cloud/) - IPFS pinning service

---

Built with ❤️ using Story Protocol
