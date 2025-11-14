import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Asset } from './schema/asset.schema';
import { CreateNftDto } from './dto/create-nft.dto';
import { CreateIpDto } from './dto/create-ip.dto';
import { ListMarketplaceDto } from './dto/list-marketplace.dto';
import { PurchaseIpDto } from './dto/purchase-ip.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<Asset>,
  ) {}

  // Create NFT with metadata
  async createNft(createNftDto: CreateNftDto, creatorId: string, walletAddress: string): Promise<any> {
    const asset = new this.assetModel({
      name: createNftDto.name,
      description: createNftDto.description,
      image_url: createNftDto.image_url,
      title: createNftDto.name, // Use name as title initially
      creator: new Types.ObjectId(creatorId),
      creators: walletAddress,
      createdat: new Date().toISOString(),
      currentOwner: walletAddress,
    });

    try {
      const saved = await asset.save();
      return {
        success: true,
        nftId: saved._id.toString(),
        transactionHash: null, // Will be updated when blockchain tx completes
        message: 'NFT metadata created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // Create IP metadata
  async createIp(createIpDto: CreateIpDto, nftId?: string): Promise<any> {
    try {
      let asset;
      
      if (nftId) {
        // Update existing asset with IP info
        asset = await this.assetModel.findById(nftId);
        if (!asset) {
          throw new NotFoundException('NFT not found');
        }
        
        asset.title = createIpDto.title;
        asset.description = createIpDto.description || asset.description;
        asset.creators = createIpDto.creators;
        asset.createdat = createIpDto.createdat;
        
        await asset.save();
      } else {
        // Create new asset with IP info only
        asset = new this.assetModel({
          title: createIpDto.title,
          description: createIpDto.description,
          creators: createIpDto.creators,
          createdat: createIpDto.createdat,
          name: createIpDto.title,
          image_url: '',
          currentOwner: createIpDto.creators,
        });
        
        await asset.save();
      }

      return {
        success: true,
        ipId: asset._id.toString(),
        message: 'IP metadata created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // Update asset with blockchain data
  async updateBlockchainData(
    assetId: string,
    data: { nftId?: string; ipId?: string; tokenId?: number; transactionHash?: string },
  ): Promise<Asset> {
    const asset = await this.assetModel.findById(assetId);
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (data.nftId) asset.nftId = data.nftId;
    if (data.ipId) asset.ipId = data.ipId;
    if (data.tokenId !== undefined) asset.tokenId = data.tokenId;
    if (data.transactionHash) asset.transactionHash = data.transactionHash;

    return asset.save();
  }

  // List IP on marketplace
  async listOnMarketplace(listMarketplaceDto: ListMarketplaceDto): Promise<any> {
    // Find asset by tokenId or ipId
    const asset = await this.assetModel.findOne({
      $or: [
        { tokenId: listMarketplaceDto.tokenId },
        { currentOwner: listMarketplaceDto.seller },
      ],
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (asset.currentOwner !== listMarketplaceDto.seller) {
      throw new ConflictException('You do not own this asset');
    }

    // Generate listing ID (will be replaced with actual blockchain listing ID)
    const listingId = `listing_${Date.now()}_${asset._id}`;

    asset.isListed = true;
    asset.listingId = listingId;
    asset.price = listMarketplaceDto.price;

    await asset.save();

    return {
      success: true,
      listingId,
      message: 'Asset listed on marketplace',
    };
  }

  // Purchase IP from marketplace
  async purchaseIp(purchaseIpDto: PurchaseIpDto): Promise<any> {
    const asset = await this.assetModel.findOne({ listingId: purchaseIpDto.listingId });

    if (!asset) {
      throw new NotFoundException('Listing not found');
    }

    if (!asset.isListed) {
      throw new ConflictException('Asset is not listed for sale');
    }

    // Transfer ownership
    asset.currentOwner = purchaseIpDto.buyer;
    asset.isListed = false;
    asset.listingId = null;
    asset.price = null;

    await asset.save();

    return {
      success: true,
      message: 'Asset purchased successfully',
      asset,
    };
  }

  // Get all marketplace listings
  async getMarketplaceListings(): Promise<Asset[]> {
    return this.assetModel
      .find({ isListed: true })
      .populate('creator', 'wallet profileName')
      .exec();
  }

  // Get user's IPs
  async getUserIps(walletAddress: string): Promise<Asset[]> {
    return this.assetModel
      .find({ currentOwner: walletAddress })
      .populate('creator', 'wallet profileName')
      .exec();
  }

  // Get all assets
  async findAll(): Promise<Asset[]> {
    return this.assetModel.find().populate('creator', 'wallet profileName').exec();
  }

  // Get asset by ID
  async findById(id: string): Promise<Asset> {
    const asset = await this.assetModel.findById(id).populate('creator', 'wallet profileName').exec();
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    return asset;
  }
}