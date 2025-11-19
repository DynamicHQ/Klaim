const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // --- Story Protocol Testnet Addresses (from DEPLOYMENT_GUIDE.md) ---
  // Ensure these are correct for the Story Protocol testnet you are using.
  const IP_ASSET_REGISTRY_ADDRESS = "0x77319B4031e6eF1250907aa00018B8B1c67a244b";

  console.log("\n--- Deploying IPToken ---");
  const IPToken = await ethers.getContractFactory("IPToken");
  const ipToken = await IPToken.deploy();
  await ipToken.waitForDeployment();
  const ipTokenAddress = await ipToken.getAddress();
  console.log("IPToken deployed to:", ipTokenAddress);

  console.log("\n--- Deploying IPCreator ---");
  // IPCreator constructor: IPCreator(IIPAssetRegistry _ipAssetRegistry)
  const IPCreator = await ethers.getContractFactory("IPCreator");
  const ipCreator = await IPCreator.deploy(IP_ASSET_REGISTRY_ADDRESS);
  await ipCreator.waitForDeployment();
  const ipCreatorAddress = await ipCreator.getAddress();
  console.log("IPCreator deployed to:", ipCreatorAddress);

  // Get the NFT contract address from the deployed IPCreator
  // This is the ERC721 contract that IPCreator manages.
  const nftContractAddress = await ipCreator.getNFTContract();
  console.log("NFT Contract (managed by IPCreator) deployed to:", nftContractAddress);

  console.log("\n--- Deploying IPMarketplace ---");
  // IPMarketplace constructor: IPMarketplace(address _ipToken, address _ipAssetRegistry, address _nftContract)
  const IPMarketplace = await ethers.getContractFactory("IPMarketplace");
  const ipMarketplace = await IPMarketplace.deploy(
    ipTokenAddress,
    IP_ASSET_REGISTRY_ADDRESS,
    nftContractAddress
  );
  await ipMarketplace.waitForDeployment();
  const ipMarketplaceAddress = await ipMarketplace.getAddress();
  console.log("IPMarketplace deployed to:", ipMarketplaceAddress);

  console.log("\n--- All Deployed Contract Addresses ---");
  console.log(`IPToken Address: ${ipTokenAddress}`);
  console.log(`IPCreator Address: ${ipCreatorAddress}`);
  console.log(`NFT Contract Address (from IPCreator): ${nftContractAddress}`);
  console.log(`IPMarketplace Address: ${ipMarketplaceAddress}`);
  console.log(`IPAssetRegistry Address (used): ${IP_ASSET_REGISTRY_ADDRESS}`);

  console.log("\nRemember to update your backend and frontend .env files with these addresses!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });