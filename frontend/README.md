# Klaim Frontend - Standalone NFT Marketplace

A complete NFT marketplace frontend with Cloudinary integration and server fallback.

## Features

✅ **Complete Mock Flow**
- Connect wallet (mock wallet generation)
- Create NFTs with Cloudinary upload
- Browse marketplace (mock data + server data)
- Purchase NFTs (localStorage + server sync)
- Manage "My NFTs" collection
- List NFTs on marketplace

✅ **Cloudinary Integration**
- Real image uploads to Cloudinary
- Fallback to base64 if Cloudinary not configured
- Automatic image optimization

✅ **Server Integration**
- Tries server API first, falls back to localStorage
- Seamless offline/online experience
- Real-time data sync when server available

## Quick Start

```bash
# Install dependencies
npm install

# Configure Cloudinary (optional)
cp .env.local.example .env.local
# Edit .env.local with your Cloudinary credentials

# Start development server
npm run dev
```

Visit http://localhost:3000

## Environment Variables

Create `.env.local`:

```env
# Backend API (optional - will fallback to localStorage)
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001

# Cloudinary (optional - will fallback to base64)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## User Flow

### 1. Homepage
- **Without wallet**: Shows "Connect Wallet" button
- **With wallet**: Shows "Create NFT" and "Marketplace" buttons
- Mock wallet generation (no MetaMask required)

### 2. Create NFT (`/create`)
- Upload image (Cloudinary or base64 fallback)
- Enter title and description
- Creates NFT and adds to "My NFTs"
- Shows success with image preview

### 3. Marketplace (`/marketplace`)
- Displays mock NFTs + server NFTs (if available)
- Search functionality
- Click NFT to view details
- "Buy Now" moves NFT to buyer's collection

### 4. My NFTs (`/profile`)
- Shows owned NFTs
- Download button (opens image)
- List button to add to marketplace
- Shows purchase history

### 5. Auth Pages
- `/signup` - Create account with wallet
- `/login` - Login with wallet
- Integrates with server user management

## Technical Details

### Data Storage
- **Primary**: localStorage (works offline)
- **Secondary**: Server API (when available)
- **Images**: Cloudinary (with base64 fallback)

### Mock Data
- 6 sample NFTs with Unsplash images
- Realistic marketplace simulation
- Persistent across browser sessions

### Server Integration
- Automatic fallback if server unavailable
- Syncs data when server comes online
- Handles user authentication

## File Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.js
│   │   └── signup/page.js
│   ├── create/page.js
│   ├── marketplace/page.js
│   ├── profile/page.js
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   └── Navbar.js
├── utils/
│   └── mockData.js
└── package.json
```

## Key Functions

### `utils/mockData.js`

```javascript
// Wallet management
connectWallet() // Generate mock wallet
getConnectedWallet() // Get current wallet
disconnectWallet() // Clear wallet

// NFT operations
createNFT(nftData) // Create NFT locally
createNFTOnServer(nftData) // Create with server fallback

// Marketplace
getMarketplaceItems() // Get local marketplace
getMarketplaceFromServer() // Get server + local data
purchaseNFT(nftId) // Buy NFT
listNFTOnMarketplace(nft, price) // List for sale

// Cloudinary
uploadToCloudinary(file) // Upload with fallback
```

## Cloudinary Setup

1. Create account at https://cloudinary.com
2. Get Cloud Name from dashboard
3. Create unsigned upload preset:
   - Settings → Upload → Upload presets
   - Add preset, set "Signing Mode" to "Unsigned"
4. Update `.env.local` with credentials

## Server Integration

The frontend automatically integrates with the NestJS backend:

- **NFT Creation**: `POST /assets/nft`
- **Marketplace**: `GET /assets/marketplace`
- **User Auth**: `POST /users/signup`, `POST /users/login`

If server is unavailable, everything works with localStorage.

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Testing the Flow

1. **Connect Wallet**: Click "Connect Wallet" on homepage
2. **Create NFT**: 
   - Go to "Create"
   - Upload image (will upload to Cloudinary if configured)
   - Fill title/description
   - Submit → NFT appears in "My NFTs"
3. **List on Marketplace**:
   - Go to "My NFTs"
   - Click "List" on an NFT
   - Set price → NFT appears in marketplace
4. **Purchase**:
   - Go to "Marketplace"
   - Click "Buy Now" on any NFT
   - NFT moves to your "My NFTs"
   - Removed from marketplace

## Production Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
npx vercel

# Set environment variables in Vercel dashboard
```

### Netlify
```bash
# Build and deploy
npm run build
# Upload dist folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Notes

- **No MetaMask Required**: Uses mock wallet for testing
- **Offline First**: Works without internet/server
- **Real Images**: Uploads to Cloudinary when configured
- **Responsive**: Works on mobile and desktop
- **Theme Support**: Light/dark mode toggle
- **Search**: Real-time marketplace search
- **Persistent**: Data saved in localStorage

## Troubleshooting

**Images not uploading to Cloudinary:**
- Check `.env.local` has correct credentials
- Verify upload preset is "unsigned"
- Check browser console for errors

**Server integration not working:**
- Verify `NEXT_PUBLIC_API_ENDPOINT` in `.env.local`
- Check server is running on correct port
- App will fallback to localStorage automatically

**Wallet not connecting:**
- Clear localStorage: `localStorage.clear()`
- Refresh page
- Check browser console for errors

This frontend provides a complete NFT marketplace experience with real Cloudinary uploads and seamless server integration!