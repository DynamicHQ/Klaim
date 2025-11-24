# Token Faucet Integration Checklist

Use this checklist to verify the client-backend-contract integration is working correctly.

## ✅ Pre-Flight Checks

### Environment Configuration

- [ ] `server/.env` file exists and contains:
  - [ ] `RPC_URL=https://testnet.storyrpc.io`
  - [ ] `IP_TOKEN_ADDRESS=0xa67f0544f0B098B022f507620bb75abAb625c045`
  - [ ] `DEPLOYER_PRIVATE_KEY=<your_private_key>`
  - [ ] `MONGODB_URI=<your_mongodb_connection>`
  - [ ] `JWT_SECRET=<your_jwt_secret>`

- [ ] `client/.env` file exists and contains:
  - [ ] `NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001`
  - [ ] `NEXT_PUBLIC_IP_TOKEN_ADDRESS=0xa67f0544f0B098B022f507620bb75abAb625c045`
  - [ ] `NEXT_PUBLIC_RPC_URL=https://testnet.storyrpc.io`

### Dependencies

- [ ] Server dependencies installed (`cd server && pnpm install`)
- [ ] Client dependencies installed (`cd client && pnpm install`)
- [ ] MongoDB is running and accessible

### Wallet Setup

- [ ] Deployer wallet has owner permissions on IPToken contract
- [ ] Deployer wallet has sufficient gas (Story testnet tokens)
- [ ] Test wallet address available for testing

## ✅ Backend Verification

### Server Startup

- [ ] Server starts without errors (`cd server && pnpm start:dev`)
- [ ] Server listens on port 3001
- [ ] Console shows: `🚀 Server running on http://localhost:3001`
- [ ] No TypeScript compilation errors
- [ ] MongoDB connection successful

### API Endpoints

Test each endpoint manually or using the integration test:

- [ ] `GET /` returns 200 (health check)
- [ ] `GET /faucet/eligibility/:address` returns eligibility status
- [ ] `GET /faucet/balance/:address` returns token balance
- [ ] `POST /faucet/claim` processes claim (or returns "already claimed")

### Contract Connection

- [ ] Web3Service initializes without errors
- [ ] IPToken contract address is valid
- [ ] Can query token balance from contract
- [ ] Can read token name, symbol, decimals

## ✅ Frontend Verification

### Client Startup

- [ ] Client starts without errors (`cd client && pnpm dev`)
- [ ] Client runs on port 3000
- [ ] No build errors or warnings
- [ ] Can access `http://localhost:3000`

### Component Integration

- [ ] TokenFaucet component exists at `client/components/TokenFaucet.js`
- [ ] Component is imported in profile page
- [ ] Component receives `walletAddress` prop
- [ ] Component has `onClaimSuccess` callback

### API Client

- [ ] `client/utils/api.js` exports faucet functions:
  - [ ] `claimTokens(walletAddress)`
  - [ ] `checkEligibility(walletAddress)`
  - [ ] `getTokenBalance(walletAddress)`
- [ ] API_ENDPOINT points to `http://localhost:3001`
- [ ] Fetch requests include proper headers

## ✅ Integration Testing

### Automated Tests

Run the integration test suite:

```bash
node test-faucet-integration.js
```

- [ ] Contract connection test passes
- [ ] Backend health test passes
- [ ] Eligibility endpoint test passes
- [ ] Balance endpoint test passes
- [ ] Client API functions test passes
- [ ] Claim endpoint test passes (or shows "already claimed")

### Manual Flow Testing

1. **Initial State**
   - [ ] Open `http://localhost:3000/profile`
   - [ ] Connect wallet (use MetaMask or similar)
   - [ ] TokenFaucet component appears (if eligible)

2. **Eligibility Check**
   - [ ] Component checks eligibility on mount
   - [ ] If already claimed, component doesn't render
   - [ ] If eligible, component shows claim button

3. **Balance Display**
   - [ ] Current KIP balance is displayed
   - [ ] If balance is 0, shows prominent CTA
   - [ ] Balance updates after claim

4. **Claim Process**
   - [ ] Click "Claim 2000 KIP Tokens" button
   - [ ] Button shows loading state
   - [ ] Button is disabled during transaction
   - [ ] No errors in browser console

5. **Success State**
   - [ ] Success message or notification appears
   - [ ] Balance updates to show new tokens
   - [ ] Component removes itself from view
   - [ ] Transaction hash is logged (check console)

6. **Error Handling**
   - [ ] Duplicate claim shows appropriate error
   - [ ] Network errors show user-friendly message
   - [ ] Invalid address shows validation error

## ✅ Database Verification

### MongoDB Collections

- [ ] `faucetclaims` collection exists
- [ ] Claim records are created after successful claims
- [ ] Each record contains:
  - [ ] `walletAddress` (lowercase)
  - [ ] `claimedAt` (timestamp)
  - [ ] `transactionHash`
  - [ ] `amount` ("2000")

### Data Integrity

- [ ] Wallet addresses are stored in lowercase
- [ ] Unique index on `walletAddress` prevents duplicates
- [ ] Transaction hashes are valid blockchain hashes

## ✅ Blockchain Verification

### Transaction Verification

After a successful claim:

- [ ] Transaction appears on Story testnet explorer
- [ ] Transaction status is "Success"
- [ ] Tokens are minted to correct address
- [ ] Amount minted is 2000 KIP (2000 * 10^18 wei)

### Contract State

- [ ] Token balance increases for recipient
- [ ] Total supply increases by claim amount
- [ ] Deployer wallet gas decreases (transaction cost)

## ✅ Security Checks

- [ ] Private keys are not committed to git
- [ ] `.env` files are in `.gitignore`
- [ ] Rate limiting is active (1 req/min per IP)
- [ ] Address validation prevents invalid inputs
- [ ] Error messages don't expose sensitive data

## ✅ Performance Checks

- [ ] Eligibility check completes in < 1 second
- [ ] Balance query completes in < 2 seconds
- [ ] Claim transaction completes in < 30 seconds
- [ ] UI remains responsive during operations
- [ ] No memory leaks in long-running sessions

## 🎯 Final Verification

All checks complete? Run this final test:

1. [ ] Start fresh with a new wallet address
2. [ ] Complete the entire claim flow
3. [ ] Verify tokens appear in wallet
4. [ ] Try to claim again (should fail)
5. [ ] Check database for claim record
6. [ ] Verify transaction on blockchain explorer

## 📝 Notes

**Common Issues:**
- If claim fails with "not the owner", verify deployer wallet owns the contract
- If MongoDB connection fails, check MONGODB_URI and ensure MongoDB is running
- If CORS errors occur, verify server CORS configuration in `main.ts`
- If balance shows 0 after claim, wait a few seconds and refresh

**Success Criteria:**
- ✅ All automated tests pass
- ✅ Manual claim flow works end-to-end
- ✅ Database records are created correctly
- ✅ Blockchain transactions are confirmed
- ✅ UI updates reflect actual state

---

**Status:** [ ] Ready for Production | [ ] Needs Fixes | [ ] In Progress

**Last Tested:** _________________

**Tested By:** _________________
