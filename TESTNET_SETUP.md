# Testnet Setup Guide

This guide will help you set up your wallet with testnet tokens for testing the Klaimit application.

## Prerequisites

1. **Install MetaMask**
   - Download from: https://metamask.io/download/
   - Available for Chrome, Firefox, Brave, and Edge browsers

## Network Configuration

The application uses **Story Protocol Testnet** by default. The wallet utility will automatically prompt you to add this network when you connect.

### Story Protocol Testnet Details

- **Network Name**: Story Protocol Testnet
- **Chain ID**: 1513 (0x5E9 in hex)
- **RPC URL**: https://testnet.storyrpc.io
- **Currency Symbol**: IP
- **Block Explorer**: https://testnet.storyscan.xyz

### Manual Network Addition

If you need to add the network manually:

1. Open MetaMask
2. Click on the network dropdown (top center)
3. Click "Add Network"
4. Click "Add a network manually"
5. Enter the details above
6. Click "Save"

## Getting Testnet Tokens

### Story Protocol Testnet IP Tokens

**Option 1: Story Protocol Faucet**
1. Visit the Story Protocol faucet (check official documentation for URL)
2. Connect your MetaMask wallet
3. Request testnet IP tokens
4. Wait for the transaction to complete

**Option 2: Discord Faucet**
1. Join the Story Protocol Discord server
2. Navigate to the faucet channel
3. Use the faucet bot command with your wallet address
4. Example: `!faucet 0xYourWalletAddress`

**Option 3: Community Resources**
- Check the Story Protocol documentation: https://docs.story.foundation/
- Ask in the Story Protocol community channels

### Alternative: Sepolia Testnet ETH

If Story Protocol testnet is unavailable, you can use Sepolia testnet:

**Sepolia Faucets:**
1. **Alchemy Sepolia Faucet**: https://sepoliafaucet.com/
2. **Infura Sepolia Faucet**: https://www.infura.io/faucet/sepolia
3. **QuickNode Sepolia Faucet**: https://faucet.quicknode.com/ethereum/sepolia

**Steps:**
1. Visit any of the faucets above
2. Enter your wallet address
3. Complete any verification (if required)
4. Receive testnet ETH

## Switching Networks in the App

The application will automatically detect your current network and prompt you to switch if needed.

### Programmatic Network Switching

The wallet utility includes functions to switch networks:

```javascript
import { switchToStoryTestnet, switchToSepolia } from '@/utils/wallet';

// Switch to Story Protocol Testnet
await switchToStoryTestnet();

// Switch to Sepolia Testnet
await switchToSepolia();
```

## Verifying Your Setup

1. **Check Network**: Ensure MetaMask shows "Story Protocol Testnet" in the network dropdown
2. **Check Balance**: Your wallet should show a balance of IP tokens
3. **Test Connection**: Try connecting your wallet in the app

## Troubleshooting

### MetaMask Not Detecting Network

If MetaMask doesn't automatically add the network:
1. Manually add the network using the details above
2. Refresh the page
3. Try connecting again

### No Testnet Tokens

If you can't get testnet tokens:
1. Check the Story Protocol Discord for faucet announcements
2. Ask in community channels for assistance
3. Try alternative faucets listed above

### Wrong Network

If you're on the wrong network:
1. Click the network dropdown in MetaMask
2. Select "Story Protocol Testnet"
3. Refresh the page

### Transaction Failures

If transactions fail:
1. Ensure you have enough testnet tokens for gas fees
2. Check that you're on the correct network
3. Try increasing the gas limit in MetaMask

## Network Switching in Code

The application includes network detection and switching functionality:

```javascript
import { 
  getChainId, 
  isOnCorrectNetwork, 
  getNetworkName,
  NETWORKS 
} from '@/utils/wallet';

// Get current network
const chainId = await getChainId();
const networkName = getNetworkName(chainId);
console.log(`Connected to: ${networkName}`);

// Check if on correct network
const isCorrect = await isOnCorrectNetwork(NETWORKS.STORY_TESTNET.chainId);
if (!isCorrect) {
  // Prompt user to switch
  await switchToStoryTestnet();
}
```

## Environment Variables

Make sure your `.env.local` file includes:

```env
# Backend API
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001

# Story Protocol Testnet (optional - defaults are set)
NEXT_PUBLIC_RPC_URL=https://testnet.storyrpc.io
NEXT_PUBLIC_CHAIN_ID=1513

# Contract Addresses (update after deployment)
NEXT_PUBLIC_IP_CREATOR_ADDRESS=
NEXT_PUBLIC_IP_MARKETPLACE_ADDRESS=
NEXT_PUBLIC_IP_TOKEN_ADDRESS=
```

## Testing Checklist

- [ ] MetaMask installed and set up
- [ ] Story Protocol Testnet added to MetaMask
- [ ] Testnet IP tokens in wallet
- [ ] Can connect wallet to application
- [ ] Can sign messages with wallet
- [ ] Can complete signup/login flow
- [ ] Transactions work on testnet

## Additional Resources

- **Story Protocol Documentation**: https://docs.story.foundation/
- **Story Protocol Discord**: Check official website for invite link
- **MetaMask Support**: https://support.metamask.io/
- **Testnet Block Explorer**: https://testnet.storyscan.xyz

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the application logs in browser console
3. Check MetaMask activity tab for transaction details
4. Ask in the Story Protocol community channels

## Security Notes

⚠️ **Important Security Reminders:**
- Never share your seed phrase or private keys
- Only use testnet tokens for testing
- Don't send real funds to testnet addresses
- Keep your MetaMask password secure
- Be cautious of phishing attempts

## Next Steps

Once you have testnet tokens:
1. Start the backend server: `cd server && npm run start:dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Navigate to `http://localhost:3000`
4. Click "Sign Up" or "Login"
5. Connect your wallet
6. Complete the authentication flow

Happy testing! 🚀
