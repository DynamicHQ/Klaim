const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // --- Story Protocol Testnet Addresses (from DEPLOYMENT_GUIDE.md) ---
  const IP_ASSET_REGISTRY_ADDRESS = "0x77319B4031e6eF1250907aa00018B8B1c67a244b";
  const LICENSING_MODULE_ADDRESS = "0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f";
  const PIL_TEMPLATE_ADDRESS = "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316";
  const ROYALTY_POLICY_LAP_ADDRESS = "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E";
  const MERC20_ADDRESS = "0xF2104833d386a2734a4eB3B8ad6FC6812F29E38E";

  console.log("\n--- Deploying IPToken ---");
  const IPToken = await ethers.getContractFactory("IPToken");
  const tokenName = "Klaim";
  const tokenSymbol = "KIP";
  const initialSupply = ethers.parseUnits("10000", 18); // 10,000 tokens with 18 decimals
  const ipToken = await IPToken.deploy(tokenName, tokenSymbol, initialSupply, deployer.address);
  await ipToken.waitForDeployment();
  const ipTokenAddress = await ipToken.getAddress();
  console.log("IPToken deployed to:", ipTokenAddress);

  console.log("\n--- Deploying IPCreator ---");
  // IPCreator constructor requires 5 arguments from Story Protocol
  const IPCreator = await ethers.getContractFactory("IPCreator");
  const ipCreator = await IPCreator.deploy(
    IP_ASSET_REGISTRY_ADDRESS,
    LICENSING_MODULE_ADDRESS,
    PIL_TEMPLATE_ADDRESS,
    ROYALTY_POLICY_LAP_ADDRESS,
    MERC20_ADDRESS
  );
  await ipCreator.waitForDeployment();
  const ipCreatorAddress = await ipCreator.getAddress();
  console.log("IPCreator deployed to:", ipCreatorAddress);

  // Get the NFT contract address from the deployed IPCreator.
  // This is the ERC721 contract that IPCreator manages.
  const nftContractAddress = await ipCreator.getNFTContract();
  console.log("NFT Contract (managed by IPCreator) deployed to:", nftContractAddress);

  console.log("\n--- Deploying IPMarketplace ---");
  // IPMarketplace constructor requires 3 arguments: IPToken, IPAssetRegistry, and the NFT contract from IPCreator.
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
  console.log("\n--- Story Protocol Addresses Used ---");
  console.log(`IPAssetRegistry: ${IP_ASSET_REGISTRY_ADDRESS}`);
  console.log(`LicensingModule: ${LICENSING_MODULE_ADDRESS}`);
  console.log(`PILTemplate: ${PIL_TEMPLATE_ADDRESS}`);
  console.log(`RoyaltyPolicyLAP: ${ROYALTY_POLICY_LAP_ADDRESS}`);
  console.log(`MERC20: ${MERC20_ADDRESS}`);


  console.log("\nRemember to update your backend and frontend .env files with these addresses!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
