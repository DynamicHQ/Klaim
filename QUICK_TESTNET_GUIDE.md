# Quick Testnet Guide 🚀

Get up and running with testnet tokens in 5 minutes!

## Step 1: Install MetaMask

1. Go to https://metamask.io/download/
2. Install the browser extension
3. Create a new wallet or import existing one
4. **Save your seed phrase securely!**

## Step 2: Add Story Protocol Testnet

The app will automatically prompt you to add the network when you connect your wallet, but you can also add it manually:

### Automatic (Recommended)
1. Go to the app
2. Click "Connect Wallet"
3. Approve the "Add Network" request in MetaMask
4. Done! ✅

### Manual
1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Enter these details:
   - **Network Name**: Story Protocol Testnet
   - **RPC URL**: https://testnet.storyrpc.io
   - **Chain ID**: 1513
   - **Currency Symbol**: IP
   - **Block Explorer**: https://testnet.storyscan.xyz
4. Click "Save"

## Step 3: Get Testnet Tokens

### Option A: Story Protocol Faucet
1. Visit the Story Protocol faucet (check Discord for link)
2. Enter your wallet address
3. Request tokens
4. Wait 1-2 minutes

### Option B: Discord Faucet
1. Join Story Protocol Discord
2. Go to faucet channel
3. Use command: `!faucet YOUR_WALLET_ADDRESS`
4. Receive tokens

### Option C: Sepolia Testnet (Alternative)
If Story Protocol testnet is unavailable:
1. Go to https://sepoliafaucet.com/
2. Enter your wallet address
3. Complete verification
4. Receive Sepolia ETH

## Step 4: Connect & Test

1. Start the app:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run start:dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. Open http://localhost:3000

3. Click "Sign Up" or "Login"

4. Click "Connect Wallet"

5. Approve connection in MetaMask

6. If prompted, approve network switch

7. Complete signup/login flow

8. You're ready! 🎉

## Troubleshooting

### "Wrong Network" Warning
- Click the "Switch Network" button in the navbar
- Or manually switch in MetaMask

### "Insufficient Funds"
- Get more testnet tokens from faucet
- Check you're on the correct network

### "MetaMask Not Detected"
- Refresh the page
- Make sure MetaMask is installed
- Try a different browser

### Transaction Fails
- Ensure you have testnet tokens
- Check network is correct
- Try increasing gas limit

## Visual Indicators

### ✅ Correct Network
Green badge in navbar: "Story Protocol Testnet"

### ⚠️ Wrong Network
Yellow badge with "Switch Network" button

### 🔗 Connected Wallet
Badge showing: "0x1234...5678"

## Need Help?

- 📖 Full guide: See `TESTNET_SETUP.md`
- 🧪 Testing guide: See `.kiro/specs/auth-sync/TESTING.md`
- 💬 Community: Join Story Protocol Discord
- 🐛 Issues: Check browser console for errors

## Security Reminders

- ⚠️ Never share your seed phrase
- ⚠️ Only use testnet tokens (no real value)
- ⚠️ Don't send real funds to testnet addresses
- ⚠️ Keep testnet and mainnet wallets separate

## What's Next?

Once you have testnet tokens and are connected:

1. ✅ Create your account (signup)
2. ✅ Test authentication (login/logout)
3. ✅ Create IP assets
4. ✅ List on marketplace
5. ✅ Purchase IP assets
6. ✅ Manage your NFTs

Happy testing! 🚀

---

**Quick Links:**
- Testnet Explorer: https://testnet.storyscan.xyz
- Story Protocol Docs: https://docs.story.foundation/
- MetaMask Support: https://support.metamask.io/
