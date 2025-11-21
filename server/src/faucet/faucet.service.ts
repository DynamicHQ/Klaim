import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { FaucetClaim, FaucetClaimDocument } from './schema/faucet-claim.schema';
import { Web3Service } from '../web3/web3.service';

@Injectable()
export class FaucetService {
  private readonly CLAIM_AMOUNT = '2000'; // 2000 KIP tokens

  constructor(
    @InjectModel(FaucetClaim.name) private faucetClaimModel: Model<FaucetClaimDocument>,
    private web3Service: Web3Service,
    private configService: ConfigService,
  ) {}

  /**
   * Check if a wallet address has already claimed tokens
   */
  async hasClaimedTokens(walletAddress: string): Promise<boolean> {
    try {
      const claim = await this.faucetClaimModel.findOne({ 
        walletAddress: walletAddress.toLowerCase() 
      }).exec();
      return !!claim;
    } catch (error) {
      throw new InternalServerErrorException('Failed to check claim eligibility');
    }
  }

  /**
   * Validate Ethereum address format
   */
  private isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Process token claim request
   */
  async claimTokens(walletAddress: string): Promise<any> {
    // Validate address format
    if (!this.isValidEthereumAddress(walletAddress)) {
      throw new BadRequestException('Invalid wallet address format');
    }

    // Normalize address to lowercase
    const normalizedAddress = walletAddress.toLowerCase();

    // Check if already claimed
    const hasClaimed = await this.hasClaimedTokens(normalizedAddress);
    if (hasClaimed) {
      throw new BadRequestException('Tokens already claimed for this address');
    }

    // Get deployer private key from environment
    const deployerPrivateKey = this.configService.get<string>('DEPLOYER_PRIVATE_KEY');
    if (!deployerPrivateKey) {
      throw new InternalServerErrorException('Deployer private key not configured');
    }

    try {
      // Mint tokens using Web3Service
      const receipt = await this.web3Service.mintIPToken(
        walletAddress,
        this.CLAIM_AMOUNT,
        deployerPrivateKey,
      );

      // Record the claim
      await this.recordClaim(normalizedAddress, receipt.hash);

      // Get updated balance
      const balance = await this.web3Service.getIPTBalance(walletAddress);

      return {
        success: true,
        transactionHash: receipt.hash,
        amount: this.CLAIM_AMOUNT,
        balance,
      };
    } catch (error) {
      // Handle blockchain errors
      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new InternalServerErrorException('Service temporarily unavailable - insufficient gas');
      }
      if (error.message?.includes('revert')) {
        throw new InternalServerErrorException('Failed to mint tokens - contract error');
      }
      throw new InternalServerErrorException(`Failed to process claim: ${error.message}`);
    }
  }

  /**
   * Record a successful claim in the database
   */
  async recordClaim(walletAddress: string, transactionHash: string): Promise<void> {
    try {
      const claim = new this.faucetClaimModel({
        walletAddress: walletAddress.toLowerCase(),
        claimedAt: new Date(),
        transactionHash,
        amount: this.CLAIM_AMOUNT,
      });
      await claim.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to record claim');
    }
  }

  /**
   * Get KIP token balance for a wallet address
   */
  async getTokenBalance(walletAddress: string): Promise<string> {
    // Validate address format
    if (!this.isValidEthereumAddress(walletAddress)) {
      throw new BadRequestException('Invalid wallet address format');
    }

    try {
      return await this.web3Service.getIPTBalance(walletAddress);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to query balance: ${error.message}`);
    }
  }
}
