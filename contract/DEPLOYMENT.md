# Contract Deployment Guide

## Prerequisites

1. Install dependencies:
```bash
cd contract
npm install
```

2. Create `.env` file with your private key:
```bash
cp .env.example .env
# Edit .env and add your PRIVATE_KEY
```

## Story Protocol Testnet Addresses (Aeneid)

The IPCreator contract requires these Story Protocol addresses:

```javascript
IP_ASSET_REGISTRY = "0x77319B4031e6eF1250907aa00018B8B1c67a244b"
LICENSING_MODULE = "0x5a7D9Fa17DE09350F481A53B470D798c1c1aabae"
PIL_TEMPLATE = "0x58E2c909D557Cd23EF90D14f8fd21667A5Ae7a93"
ROYALTY_POLICY_LAP = "0x28b4F70ffE5ba7A26aEF979226f77Eb57fb9Fdb6"
MERC20 = "0x91f6F05B08c16769d3c85867548615d270C42fC7"
```

## Deployment Steps

### Option 1: Using the deploy script (needs update)

The `deploy.js` script needs to be updated to pass all 5 constructor parameters to IPCreator.

### Option 2: Manual deployment via Hardhat console

```bash
npx hardhat console --network story-aeneid
```

Then in the console:

```javascript
// Get deployer
const [deployer] = await ethers.getSigners();

// Story Protocol addresses
const IP_ASSET_REGISTRY = "0x77319B4031e6eF1250907aa00018B8B1c67a244b";
const LICENSING_MODULE = "0x5a7D9Fa17DE09350F481A53B470D798c1c1aabae";
const PIL_TEMPLATE = "0x58E2c909D557Cd23EF90D14f8fd21667A5Ae7a93";
const ROYALTY_POLICY_LAP = "0x28b4F70ffE5ba7A26aEF979226f77Eb57fb9Fdb6";
const MERC20 = "0x91f6F05B08c16769d3c85867548615d270C42fC7";

// Deploy IPToken
const IPToken = await ethers.getContractFactory("IPToken");
const ipToken = await IPToken.deploy();
await ipToken.waitForDeployment();
console.log("IPToken:", await ipToken.getAddress());

// Deploy IPCreator with all 5 parameters
const IPCreator = await ethers.getContractFactory("IPCreator");
const ipCreator = await IPCreator.deploy(
  IP_ASSET_REGISTRY,
  LICENSING_MODULE,
  PIL_TEMPLATE,
  ROYALTY_POLICY_LAP,
  MERC20
);
await ipCreator.waitForDeployment();
console.log("IPCreator:", await ipCreator.getAddress());

// Get NFT contract address
const nftContract = await ipCreator.getNFTContract();
console.log("NFT Contract:", nftContract);

// Deploy IPMarketplace
const IPMarketplace = await ethers.getContractFactory("IPMarketplace");
const ipMarketplace = await IPMarketplace.deploy(
  await ipToken.getAddress(),
  IP_ASSET_REGISTRY,
  nftContract
);
await ipMarketplace.waitForDeployment();
console.log("IPMarketplace:", await ipMarketplace.getAddress());
```

## After Deployment

Update environment variables in:

### Backend (`server/.env`):
```env
RPC_URL=https://aeneid.storyrpc.io/
IP_CREATOR_ADDRESS=<deployed_address>
IP_MARKETPLACE_ADDRESS=<deployed_address>
IP_TOKEN_ADDRESS=<deployed_address>
NFT_CONTRACT_ADDRESS=<nft_contract_address>
```

### Frontend (`client/.env.local`):
```env
NEXT_PUBLIC_RPC_URL=https://aeneid.storyrpc.io/
NEXT_PUBLIC_IP_CREATOR_ADDRESS=<deployed_address>
NEXT_PUBLIC_IP_MARKETPLACE_ADDRESS=<deployed_address>
NEXT_PUBLIC_IP_TOKEN_ADDRESS=<deployed_address>
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=<nft_contract_address>
```

## Contract Architecture

### IPCreator
- Creates NFTs and registers them as IP Assets on Story Protocol
- Automatically attaches "Commercial Use Only" licenses
- Manages its own SimpleNFT contract

### IPMarketplace
- Enables listing and purchasing of IP Assets
- Uses IP Tokens for payments
- Transfers NFT ownership (which transfers IP ownership)

### IPToken
- ERC20 token used for marketplace transactions
- Can be minted/distributed as needed

## Verification

After deployment, verify contracts on Storyscan:

```bash
npx hardhat verify --network story-aeneid <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```
