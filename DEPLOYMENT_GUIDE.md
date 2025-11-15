# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- MetaMask browser extension
- Cloudinary account
- Story Protocol testnet access

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

## Step 2: Setup Cloudinary

1. Create account at https://cloudinary.com
2. Go to Dashboard and copy your Cloud Name
3. Create an unsigned upload preset:
   - Settings → Upload → Upload presets
   - Click "Add upload preset"
   - Set "Signing Mode" to "Unsigned"
   - Save and copy the preset name

## Step 3: Setup MongoDB

```bash
# Start MongoDB (if not running)
mongod

# Or use MongoDB Atlas for cloud database
# Get connection string from MongoDB Atlas dashboard
```

## Step 4: Configure Backend

```bash
cd server

# Create .env file
cp .env.example .env

# Edit .env with your values:
# MONGODB_URI=mongodb://localhost:27017/klaim
# PORT=3001
# RPC_URL=https://testnet.storyrpc.io
```

## Step 5: Configure Frontend

```bash
cd client

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your values:
# NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
# NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Step 6: Deploy Smart Contracts

### Option A: Using Hardhat/Foundry

```bash
cd contract

# Install dependencies
npm install

# Deploy to Story testnet
npx hardhat run scripts/deploy.js --network story-testnet

# Copy deployed contract addresses
```

### Option B: Using Remix IDE

1. Go to https://remix.ethereum.org
2. Upload contract files from `contract/src/`
3. Compile contracts
4. Connect MetaMask to Story testnet
5. Deploy in this order:
   - IPToken.sol
   - IPCreator.sol (with Story Protocol addresses)
   - IPMarketplace.sol (with IPToken address)
6. Copy deployed addresses

### Story Protocol Testnet Addresses

```
IP_ASSET_REGISTRY: 0x77319B4031e6eF1250907aa00018B8B1c67a244b
LICENSING_MODULE: 0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f
PIL_TEMPLATE: 0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316
ROYALTY_POLICY_LAP: 0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E
MERC20: 0xF2104833d386a2734a4eB3B8ad6FC6812F29E38E
```

## Step 7: Update Configuration with Contract Addresses

### Backend (.env)
```
IP_CREATOR_ADDRESS=0x...
IP_MARKETPLACE_ADDRESS=0x...
IP_TOKEN_ADDRESS=0x...
```

### Frontend (.env.local)
```
NEXT_PUBLIC_IP_CREATOR_ADDRESS=0x...
NEXT_PUBLIC_IP_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_IP_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x... (from IPCreator.getNFTContract())
```

## Step 8: Start the Application

### Terminal 1 - Backend
```bash
cd server
npm run start:dev
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

## Step 9: Setup MetaMask

1. Add Story testnet to MetaMask:
   - Network Name: Story Testnet
   - RPC URL: https://testnet.storyrpc.io
   - Chain ID: 1513
   - Currency Symbol: IP
   - Block Explorer: https://testnet.storyscan.xyz

2. Get testnet tokens from faucet (if available)

3. Mint IPT tokens for testing:
   - Call `mint()` function on IPToken contract
   - Or use backend to distribute tokens

## Step 10: Test the Application

1. **Connect Wallet**
   - Open http://localhost:3000
   - Click "Connect Wallet"
   - Approve MetaMask connection

2. **Create IP**
   - Go to "Create" page
   - Upload an image
   - Fill in title and description
   - Submit and approve MetaMask transaction
   - Wait for confirmation

3. **List on Marketplace**
   - Go to "My IPs" (Profile)
   - Click "List" on an IP
   - Enter price in IPT
   - Approve MetaMask transaction

4. **Purchase IP**
   - Go to "Marketplace"
   - Click on a listed IP
   - Click "Buy Now"
   - Approve IPT token spending
   - Approve purchase transaction
   - Check "My IPs" for purchased item

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify .env file exists and has correct values
- Check port 3001 is not in use

### Frontend won't start
- Check .env.local file exists
- Verify API endpoint is correct
- Check port 3000 is not in use

### MetaMask transactions fail
- Ensure you're on Story testnet
- Check you have enough testnet tokens
- Verify contract addresses are correct
- Check gas limits

### Images won't upload
- Verify Cloudinary credentials
- Check upload preset is "unsigned"
- Ensure file size is under limit

### Marketplace not showing items
- Check backend is running
- Verify database connection
- Check browser console for errors

## Production Deployment

### Backend (Railway/Heroku/DigitalOcean)

1. Set environment variables
2. Deploy backend code
3. Ensure MongoDB is accessible
4. Update CORS settings for production domain

### Frontend (Vercel/Netlify)

1. Connect GitHub repository
2. Set environment variables
3. Deploy
4. Update API endpoint to production backend

### Database (MongoDB Atlas)

1. Create cluster
2. Whitelist IP addresses
3. Update connection string in backend

## Security Considerations

- Never commit private keys
- Use environment variables for sensitive data
- Enable CORS only for trusted domains
- Implement rate limiting on backend
- Add authentication for sensitive endpoints
- Validate all user inputs
- Use HTTPS in production

## Monitoring

- Monitor contract events for marketplace activity
- Track database size and performance
- Monitor API response times
- Set up error logging (Sentry, LogRocket)
- Monitor blockchain transaction status

## Maintenance

- Regular database backups
- Update dependencies regularly
- Monitor gas prices and optimize
- Review and update smart contracts as needed
- Keep Story Protocol SDK updated
