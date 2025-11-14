# Quick Start Guide

Get the dApp running in 5 minutes!

## Prerequisites
- Node.js 18+
- MongoDB running locally
- MetaMask installed

## 1. Install Dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

## 2. Setup Environment Files

### Backend (.env)
```bash
cd server
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/klaim
PORT=3001
RPC_URL=https://testnet.storyrpc.io
EOF
```

### Frontend (.env.local)
```bash
cd client
cat > .env.local << EOF
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=demo
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=demo_preset
EOF
```

## 3. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

## 4. Start Backend

```bash
cd server
npm run start:dev
```

Backend will run on http://localhost:3001

## 5. Start Frontend

```bash
cd client
npm run dev
```

Frontend will run on http://localhost:3000

## 6. Setup Cloudinary (Required for Image Upload)

1. Go to https://cloudinary.com and create free account
2. Get your Cloud Name from dashboard
3. Create unsigned upload preset:
   - Settings → Upload → Upload presets
   - Add upload preset
   - Set "Signing Mode" to "Unsigned"
   - Save
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_actual_preset_name
   ```

## 7. Test the App

1. Open http://localhost:3000
2. Click "Connect Wallet" and approve MetaMask
3. Go to "Create" page
4. Upload an image and create an IP
5. Go to "My IPs" to see your creation
6. Click "List" to add it to marketplace
7. Go to "Marketplace" to see all listings

## Current Status

✅ **Working:**
- File upload to Cloudinary
- NFT/IP metadata creation
- Marketplace listing
- Purchase flow (database level)
- My IPs page
- Wallet connection

⏳ **To Be Implemented:**
- Smart contract deployment
- Blockchain transaction integration
- MetaMask payment flow
- Real ownership transfer on-chain

## Next Steps

1. **Deploy Smart Contracts** (see DEPLOYMENT_GUIDE.md)
2. **Update contract addresses** in .env files
3. **Test blockchain integration**
4. **Deploy to production**

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3001
npx kill-port 3001
```

**MongoDB connection error:**
```bash
# Check MongoDB is running
mongosh

# Or update MONGODB_URI in .env
```

**MetaMask not connecting:**
- Ensure MetaMask is installed
- Check you're on the correct network
- Try refreshing the page

## Development Tips

- Backend API docs: http://localhost:3001/api (if Swagger enabled)
- MongoDB GUI: Use MongoDB Compass or Studio 3T
- Check browser console for frontend errors
- Check terminal for backend errors

## File Structure

```
project/
├── client/              # Next.js frontend
│   ├── app/            # Pages
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   └── utils/          # Utilities
├── server/             # NestJS backend
│   └── src/
│       ├── assets/     # Assets module
│       ├── user/       # User module
│       └── web3/       # Web3 integration
└── contract/           # Smart contracts
    └── src/            # Solidity files
```

## Support

- Check IMPLEMENTATION.md for detailed architecture
- Check DEPLOYMENT_GUIDE.md for production setup
- Review contract documentation in contract/ContractAnalysis.md
