# Token Faucet Setup & Integration Guide

This guide explains how to set up and verify the token faucet integration between the client, backend, and smart contract.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (running locally or remote connection)
3. **Deployer Wallet** with:
   - Owner permissions on the IPToken contract
   - Sufficient gas (Story testnet tokens)

## Configuration

### 1. Server Configuration (`server/.env`)

```env
# Pinata Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret

# Blockchain Configuration
RPC_URL=https://testnet.storyrpc.io
IP_TOKEN_ADDRESS=0xa67f0544f0B098B022f507620bb75abAb625c045

# Deployer Configuration (REQUIRED for faucet)
DEPLOYER_PRIVATE_KEY=your_deployer_private_key_here

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/klaim

# JWT Configuration
JWT_SECRET=your_jwt_secret_here_change_in_production
```

**Important:** Replace `your_deployer_private_key_here` with the actual private key of the wallet that owns the IPToken contract.

### 2. Client Configuration (`client/.env`)

```env
# Pinata Configuration
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token

# Backend API Configuration
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001

# Blockchain Configuration
NEXT_PUBLIC_IP_TOKEN_ADDRESS=0xa67f0544f0B098B022f507620bb75abAb625c045
NEXT_PUBLIC_RPC_URL=https://testnet.storyrpc.io
```

## Installation

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

### 2. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
```

### 3. Start the Backend Server

```bash
cd server
pnpm start:dev
```

The server should start on `http://localhost:3001`

### 4. Start the Frontend Client

```bash
cd client
pnpm dev
```

The client should start on `http://localhost:3000`

## Integration Flow

### Complete User Flow

1. **User connects wallet** → Frontend detects wallet address
2. **Check eligibility** → Frontend calls `/faucet/eligibility/:address`
3. **Display TokenFaucet component** → If eligible, show claim button
4. **User clicks "Claim Tokens"** → Frontend calls `/faucet/claim`
5. **Backend validates** → Check if already claimed in database
6. **Mint tokens** → Backend calls contract's `mint()` function
7. **Record claim** → Save claim record to database
8. **Update UI** → Frontend updates balance and hides component

### API Endpoints

#### 1. Check Eligibility
```
GET /faucet/eligibility/:address
Response: { eligible: boolean, hasClaimed: boolean }
```

#### 2. Get Token Balance
```
GET /faucet/balance/:address
Response: { balance: string, address: string }
```

#### 3. Claim Tokens
```
POST /faucet/claim
Body: { walletAddress: string }
Response: { 
  success: boolean, 
  transactionHash: string, 
  amount: string, 
  balance: string 
}
```

## Testing the Integration

### Run Integration Tests

```bash
# From project root
node test-faucet-integration.js
```

This will test:
- ✅ Contract connection
- ✅ Backend health
- ✅ Eligibility endpoint
- ✅ Balance endpoint
- ✅ Client API functions
- ✅ Claim endpoint (if wallet hasn't claimed)

### Manual Testing

1. **Test Contract Connection:**
   ```bash
   cd server
   node test-balance.js
   ```

2. **Test Eligibility Check:**
   ```bash
   cd server
   node test-eligibility.js
   ```

3. **Test Frontend Component:**
   - Open `http://localhost:3000/profile`
   - Connect your wallet
   - TokenFaucet component should appear if eligible
   - Click "Claim 2000 KIP Tokens"
   - Verify transaction completes
   - Component should disappear after successful claim

## Troubleshooting

### Issue: "Deployer private key not configured"
**Solution:** Set `DEPLOYER_PRIVATE_KEY` in `server/.env`

### Issue: "Insufficient gas"
**Solution:** Fund the deployer wallet with Story testnet tokens

### Issue: "Contract call reverted"
**Solution:** Verify the deployer wallet is the owner of the IPToken contract

### Issue: "Tokens already claimed"
**Solution:** This is expected behavior. Each wallet can only claim once.

### Issue: "Failed to connect to MongoDB"
**Solution:** 
- Ensure MongoDB is running
- Check `MONGODB_URI` in `server/.env`
- Verify network connectivity

### Issue: "Network error"
**Solution:**
- Check RPC_URL is correct
- Verify Story testnet is accessible
- Check internet connection

## Component Integration

### TokenFaucet Component Usage

```jsx
import TokenFaucet from '@/components/TokenFaucet';

function ProfilePage() {
  const { walletAddress } = useWallet();
  
  const handleClaimSuccess = (response) => {
    console.log('Tokens claimed!', response);
    // Refresh user data, show notification, etc.
  };
  
  return (
    <div>
      <TokenFaucet 
        walletAddress={walletAddress}
        onClaimSuccess={handleClaimSuccess}
      />
    </div>
  );
}
```

### API Client Usage

```javascript
import { claimTokens, checkEligibility, getTokenBalance } from '@/utils/api';

// Check if user can claim
const { eligible, hasClaimed } = await checkEligibility(walletAddress);

// Get current balance
const { balance } = await getTokenBalance(walletAddress);

// Claim tokens
const result = await claimTokens(walletAddress);
console.log('Transaction:', result.transactionHash);
console.log('New balance:', result.balance);
```

## Security Considerations

1. **Private Key Storage:** Never commit the deployer private key to version control
2. **Rate Limiting:** The claim endpoint is rate-limited to 1 request per minute per IP
3. **Address Validation:** All wallet addresses are validated before processing
4. **Database Indexing:** Wallet addresses are indexed for fast duplicate checking
5. **Error Handling:** Sensitive error details are not exposed to clients

## Architecture Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │         │   Backend   │         │  Contract   │
│  (Next.js)  │────────▶│  (NestJS)   │────────▶│  (IPToken)  │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │                        │
      │                        │                        │
      ▼                        ▼                        ▼
 TokenFaucet              FaucetService            mint(address, amount)
 Component                     │                        │
      │                        │                        │
      │                   MongoDB                  Blockchain
      │                  (Claims DB)              (Story Testnet)
      │                        │                        │
      └────────────────────────┴────────────────────────┘
                    Integrated Flow
```

## Next Steps

1. ✅ Verify all environment variables are set
2. ✅ Run integration tests
3. ✅ Test with a real wallet on testnet
4. ✅ Monitor transaction logs
5. ✅ Set up error monitoring (optional)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs for detailed error messages
3. Verify all configuration values are correct
4. Test each component individually before testing the full flow
