import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;
  private ipCreatorContract: ethers.Contract;
  private ipMarketplaceContract: ethers.Contract;
  private ipTokenContract: ethers.Contract;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Initialize provider
    const rpcUrl = this.configService.get<string>('RPC_URL') || 'https://testnet.storyrpc.io';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Contract addresses (to be set in .env)
    const ipCreatorAddress = this.configService.get<string>('IP_CREATOR_ADDRESS');
    const ipMarketplaceAddress = this.configService.get<string>('IP_MARKETPLACE_ADDRESS');
    const ipTokenAddress = this.configService.get<string>('IP_TOKEN_ADDRESS');

    // Contract ABIs (simplified - add full ABIs when contracts are deployed)
    const ipCreatorABI = [
      'event IPAssetCreated(address indexed ipId, uint256 indexed tokenId, address indexed owner, string metadataURI, uint256 licenseTermsId)',
      'function createIPFromFile(address recipient, string metadataURI, bytes32 metadataHash, string licenseURI) returns (uint256 tokenId, address ipId, uint256 licenseTermsId)',
      'function getNFTContract() view returns (address)',
    ];

    const ipMarketplaceABI = [
      'event IPListed(bytes32 indexed listingId, address indexed seller, address indexed ipId, uint256 price)',
      'event IPSold(bytes32 indexed listingId, address indexed buyer, address indexed seller, address indexed ipId, uint256 price)',
      'function listIP(uint256 tokenId, uint256 price)',
      'function purchaseIP(bytes32 listingId)',
    ];

    const ipTokenABI = [
      'function approve(address spender, uint256 amount) returns (bool)',
      'function balanceOf(address account) view returns (uint256)',
      'function transfer(address to, uint256 amount) returns (bool)',
      'function mint(address to, uint256 amount)',
      'event TokensMinted(address indexed to, uint256 amount)',
    ];

    // Initialize contracts if addresses are provided
    if (ipCreatorAddress) {
      this.ipCreatorContract = new ethers.Contract(
        ipCreatorAddress,
        ipCreatorABI,
        this.provider,
      );
    }

    if (ipMarketplaceAddress) {
      this.ipMarketplaceContract = new ethers.Contract(
        ipMarketplaceAddress,
        ipMarketplaceABI,
        this.provider,
      );
    }

    if (ipTokenAddress) {
      this.ipTokenContract = new ethers.Contract(
        ipTokenAddress,
        ipTokenABI,
        this.provider,
      );
    }
  }

  // Create IP on blockchain
  async createIPOnChain(
    recipient: string,
    metadataURI: string,
    metadataHash: string,
    licenseURI: string,
    privateKey: string,
  ): Promise<any> {
    if (!this.ipCreatorContract) {
      throw new Error('IPCreator contract not initialized');
    }

    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contract = this.ipCreatorContract.connect(wallet);

    const tx = await contract['createIPFromFile(address,string,bytes32,string)'](
      recipient,
      metadataURI,
      metadataHash,
      licenseURI,
    );

    const receipt = await tx.wait();

    // Parse events to get tokenId and ipId
    const event = receipt.logs.find(
      (log) => log.topics[0] === ethers.id('IPAssetCreated(address,uint256,address,string,uint256)'),
    );

    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      tokenId: event ? ethers.toNumber(event.topics[2]) : null,
      ipId: event ? event.topics[1] : null,
    };
  }

  // List IP on marketplace
  async listIPOnChain(
    tokenId: number,
    price: number,
    privateKey: string,
  ): Promise<any> {
    if (!this.ipMarketplaceContract) {
      throw new Error('IPMarketplace contract not initialized');
    }

    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contract = this.ipMarketplaceContract.connect(wallet);

    const priceInWei = ethers.parseEther(price.toString());
    const tx = await contract['listIP'](tokenId, priceInWei);
    const receipt = await tx.wait();

    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  }

  // Purchase IP from marketplace
  async purchaseIPOnChain(
    listingId: string,
    privateKey: string,
  ): Promise<any> {
    if (!this.ipMarketplaceContract) {
      throw new Error('IPMarketplace contract not initialized');
    }

    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contract = this.ipMarketplaceContract.connect(wallet);

    const tx = await contract['purchaseIP'](listingId);
    const receipt = await tx.wait();

    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  }

  // Get IPT token balance
  async getIPTBalance(address: string): Promise<string> {
    if (!this.ipTokenContract) {
      throw new Error('IPToken contract not initialized');
    }

    // Validate address format
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid Ethereum address format');
    }

    try {
      const balance = await this.ipTokenContract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      // Handle specific error cases
      if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network error: Unable to connect to blockchain');
      } else if (error.code === 'CALL_EXCEPTION') {
        throw new Error('Contract call failed: Unable to query balance');
      } else if (error.code === 'TIMEOUT') {
        throw new Error('Request timeout: Blockchain query took too long');
      } else {
        // Generic error with original message
        throw new Error(`Failed to query token balance: ${error.message || 'Unknown error'}`);
      }
    }
  }

  // Monitor contract events
  async monitorIPCreatorEvents(callback: (event: any) => void) {
    if (!this.ipCreatorContract) {
      throw new Error('IPCreator contract not initialized');
    }

    this.ipCreatorContract.on('IPAssetCreated', (ipId, tokenId, owner, metadataURI, licenseTermsId, event) => {
      callback({
        ipId,
        tokenId: ethers.toNumber(tokenId),
        owner,
        metadataURI,
        licenseTermsId: ethers.toNumber(licenseTermsId),
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
      });
    });
  }

  async monitorMarketplaceEvents(
    onListed: (event: any) => void,
    onSold: (event: any) => void,
  ) {
    if (!this.ipMarketplaceContract) {
      throw new Error('IPMarketplace contract not initialized');
    }

    this.ipMarketplaceContract.on('IPListed', (listingId, seller, ipId, price, event) => {
      onListed({
        listingId,
        seller,
        ipId,
        price: ethers.formatEther(price),
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
      });
    });

    this.ipMarketplaceContract.on('IPSold', (listingId, buyer, seller, ipId, price, event) => {
      onSold({
        listingId,
        buyer,
        seller,
        ipId,
        price: ethers.formatEther(price),
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
      });
    });
  }

  // Calculate metadata hash
  calculateMetadataHash(metadata: any): string {
    const metadataString = JSON.stringify(metadata);
    return ethers.keccak256(ethers.toUtf8Bytes(metadataString));
  }

  // Get provider
  getProvider(): ethers.JsonRpcProvider {
    return this.provider;
  }

  /**
   * @notice Mints IP tokens to a specified address using the deployer's private key.
   * @param toAddress The address to mint tokens to.
   * @param amount The amount of tokens to mint (human-readable, e.g., "100").
   * @param privateKey The private key of the token owner/minter.
   * @returns Transaction receipt.
   */
  async mintIPToken(
    toAddress: string,
    amount: string, // amount in human-readable format, e.g., "100"
    privateKey: string,
  ): Promise<any> {
    if (!this.ipTokenContract) {
      throw new Error('IPToken contract not initialized');
    }

    // Validate address format
    if (!ethers.isAddress(toAddress)) {
      throw new Error('Invalid recipient address format');
    }

    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contract = this.ipTokenContract.connect(wallet);
      const amountInWei = ethers.parseEther(amount); // Assuming 18 decimals for IPToken
      const tx = await contract['mint'](toAddress, amountInWei);
      return await tx.wait();
    } catch (error) {
      // Handle specific error cases
      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient gas: Deployer wallet has insufficient funds for gas');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network error: Unable to connect to blockchain');
      } else if (error.code === 'CALL_EXCEPTION') {
        throw new Error('Transaction failed: Contract call reverted');
      } else if (error.code === 'TIMEOUT') {
        throw new Error('Transaction timeout: Blockchain transaction took too long');
      } else if (error.message && error.message.includes('Ownable: caller is not the owner')) {
        throw new Error('Authorization failed: Caller is not the token contract owner');
      } else {
        // Generic error with original message
        throw new Error(`Failed to mint tokens: ${error.message || 'Unknown error'}`);
      }
    }
  }
}
