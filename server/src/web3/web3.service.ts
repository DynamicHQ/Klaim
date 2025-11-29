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

  /**
   * Initialize provider with fallback RPC URLs
   */
  private async initializeProviderWithFallback(rpcUrls: string[]): Promise<ethers.JsonRpcProvider> {
    for (const rpcUrl of rpcUrls) {
      try {
        console.log(`🔗 Attempting to connect to RPC: ${rpcUrl}`);
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        
        // Test the connection by getting the network
        await provider.getNetwork();
        console.log(`✅ Successfully connected to RPC: ${rpcUrl}`);
        return provider;
      } catch (error) {
        console.warn(`⚠️ Failed to connect to RPC ${rpcUrl}:`, error.message);
        continue;
      }
    }
    
    // If all RPCs fail, use the first one as fallback
    console.error('❌ All RPC endpoints failed, using first URL as fallback');
    return new ethers.JsonRpcProvider(rpcUrls[0]);
  }

  async onModuleInit() {
    // Initialize provider with fallback RPC URLs
    const primaryRpcUrl = this.configService.get<string>('RPC_URL') || 'https://testnet.storyrpc.io';
    const fallbackRpcUrls = [
      'https://rpc.ankr.com/story_testnet',
      'https://story-testnet.rpc.thirdweb.com',
      'https://testnet.storyrpc.io',
      'https://story-testnet-rpc.itrocket.net'
    ];
    
    // Try to initialize provider with fallback mechanism
    this.provider = await this.initializeProviderWithFallback([primaryRpcUrl, ...fallbackRpcUrls]);

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

  // Get IPT token balance with retry logic
  async getIPTBalance(address: string): Promise<string> {
    if (!this.ipTokenContract) {
      throw new Error('IPToken contract not initialized');
    }

    // Validate address format
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid Ethereum address format');
    }

    return await this.retryWithFallback(async () => {
      const balance = await this.ipTokenContract.balanceOf(address);
      return ethers.formatEther(balance);
    }, `query balance for address ${address}`);
  }

  /**
   * Retry mechanism with fallback RPC providers
   */
  private async retryWithFallback<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = 3
  ): Promise<T> {
    const fallbackRpcUrls = [
      'https://rpc.ankr.com/story_testnet',
      'https://story-testnet.rpc.thirdweb.com',
      'https://testnet.storyrpc.io',
      'https://story-testnet-rpc.itrocket.net'
    ];

    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt + 1}/${maxRetries} to ${operationName}`);
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Attempt ${attempt + 1} failed for ${operationName}:`, error.message);

        // If this is an RPC error and we have more attempts, try switching provider
        if (attempt < maxRetries - 1 && this.isRpcError(error)) {
          try {
            console.log(`🔄 Switching to fallback RPC provider...`);
            const newProvider = await this.initializeProviderWithFallback(fallbackRpcUrls);
            
            // Reinitialize contracts with new provider
            await this.reinitializeContracts(newProvider);
            
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (switchError) {
            console.error('Failed to switch RPC provider:', switchError.message);
          }
        }
      }
    }

    // Handle specific error cases for the final error
    if (lastError.code === 'NETWORK_ERROR' || lastError.code === 'UNKNOWN_ERROR') {
      throw new Error('Network error: All RPC endpoints are experiencing issues. Please try again later.');
    } else if (lastError.code === 'CALL_EXCEPTION') {
      throw new Error('Contract call failed: Unable to query blockchain data');
    } else if (lastError.code === 'TIMEOUT') {
      throw new Error('Request timeout: Blockchain query took too long');
    } else if (lastError.message && lastError.message.includes('too many errors')) {
      throw new Error('RPC endpoint overloaded: Please try again in a few minutes');
    } else {
      // Generic error with original message
      throw new Error(`Failed to ${operationName}: ${lastError.message || 'Unknown blockchain error'}`);
    }
  }

  /**
   * Check if error is RPC-related
   */
  private isRpcError(error: any): boolean {
    return error.code === 'NETWORK_ERROR' || 
           error.code === 'UNKNOWN_ERROR' ||
           error.code === -32002 ||
           (error.message && error.message.includes('too many errors')) ||
           (error.message && error.message.includes('RPC endpoint'));
  }

  /**
   * Reinitialize contracts with new provider
   */
  private async reinitializeContracts(newProvider: ethers.JsonRpcProvider): Promise<void> {
    this.provider = newProvider;

    const ipCreatorAddress = this.configService.get<string>('IP_CREATOR_ADDRESS');
    const ipMarketplaceAddress = this.configService.get<string>('IP_MARKETPLACE_ADDRESS');
    const ipTokenAddress = this.configService.get<string>('IP_TOKEN_ADDRESS');

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

    if (ipCreatorAddress) {
      this.ipCreatorContract = new ethers.Contract(ipCreatorAddress, ipCreatorABI, this.provider);
    }

    if (ipMarketplaceAddress) {
      this.ipMarketplaceContract = new ethers.Contract(ipMarketplaceAddress, ipMarketplaceABI, this.provider);
    }

    if (ipTokenAddress) {
      this.ipTokenContract = new ethers.Contract(ipTokenAddress, ipTokenABI, this.provider);
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
   * Health check for RPC connectivity
   */
  async checkRpcHealth(): Promise<{ healthy: boolean; blockNumber?: number; error?: string }> {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      return { healthy: true, blockNumber };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
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

    return await this.retryWithFallback(async () => {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contract = this.ipTokenContract.connect(wallet);
      const amountInWei = ethers.parseEther(amount); // Assuming 18 decimals for IPToken
      const tx = await contract['mint'](toAddress, amountInWei);
      return await tx.wait();
    }, `mint ${amount} tokens to ${toAddress}`);
  }
}
