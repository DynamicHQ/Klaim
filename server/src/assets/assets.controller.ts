import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { CreateIpDto } from './dto/create-ip.dto';
import { ListMarketplaceDto } from './dto/list-marketplace.dto';
import { ClaimIptDto } from './dto/claim-ip.dto';
import { PurchaseIpDto } from './dto/purchase-ip.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  // Create NFT
  @Post('nft')
  async createNft(@Body() body: { nft_info: CreateNftDto; walletAddress: string }) {
    // For now, create without auth - in production, use AuthGuard
    const creatorId = '000000000000000000000000'; // Placeholder
    return this.assetsService.createNft(body.nft_info, creatorId, body.walletAddress);
  }

  // Create IP
  @Post('ip')
  async createIp(@Body() body: { ip_info: CreateIpDto; nftId?: string }) {
    return this.assetsService.createIp(body.ip_info, body.nftId);
  }

  // Update blockchain data
  @Patch(':id/blockchain')
  async updateBlockchainData(
    @Param('id') id: string,
    @Body() data: { nftId?: string; ipId?: string; tokenId?: number; transactionHash?: string },
  ) {
    return this.assetsService.updateBlockchainData(id, data);
  }

  // List on marketplace
  @Post('marketplace/list')
  async listOnMarketplace(@Body() listMarketplaceDto: ListMarketplaceDto) {
    return this.assetsService.listOnMarketplace(listMarketplaceDto);
  }

  // Purchase from marketplace
  @Post('marketplace/purchase')
  async purchaseIp(@Body() purchaseIpDto: PurchaseIpDto) {
    return this.assetsService.purchaseIp(purchaseIpDto);
  }

  // Get marketplace listings
  @Get('marketplace')
  async getMarketplaceListings() {
    return this.assetsService.getMarketplaceListings();
  }

  // Get user's IPs
  @Get('user/:walletAddress')
  async getUserIps(@Param('walletAddress') walletAddress: string) {
    return this.assetsService.getUserIps(walletAddress);
  }

  // Get all assets
  @Get()
  async findAll() {
    return this.assetsService.findAll();
  }

  // Get asset by ID
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.assetsService.findById(id);
  }

  // Claim IPT tokens (faucet)
  @Post('faucet/claim-ipt')
  async claimIPToken(@Body() claimIptDto: ClaimIptDto) {
    return this.assetsService.claimIPToken(claimIptDto.walletAddress);
  }
}
