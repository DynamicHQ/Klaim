import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 20000,
      },
      evmVersion: "cancun",
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  networks: {
    "story-aeneid": {
      url: "https://aeneid.storyrpc.io/",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: "./src", // Assuming contracts are in 'src'
    tests: "./test",
    cache: "./hardhat-cache",
    artifacts: "./artifacts",
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  mocha: {
    timeout: 40000,
  },
  etherscan: {
    apiKey: {
      "story-aeneid": process.env.STORYSCAN_API_KEY || "",  // your Blockscout API key for Aeneid
    },
    customChains: [
      {
        network: "story-aeneid",
        chainId: 1315,
        urls: {
          apiURL: "https://aeneid.storyscan.io/api/",
          browserURL: "https://aeneid.storyscan.io"
        }
      }
    ]
}
};
export default config;