import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Asset, AssetDocument } from './schema/asset.schema';
import { CreateNftDto } from './dto/create-nft.dto';
import { CreateIpDto } from './dto/create-ip.dto';
import { ListMarketplaceDto } from './dto/list-marketplace.dto';
import { PurchaseIpDto } from './dto/purchase-ip.dto';
import { Web3Service } from '../web3/web3.service';
import { AssetMetadata } from './interfaces/asset-metadata.interface';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
    private readonly web3Service: Web3Service,
    private readonly configService: ConfigService,
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
        assetId: saved._id.toString(),
        transactionHash: null, // Will be updated when blockchain tx completes
        message: 'NFT metadata created successfully',
      };
    } catch (error) {
      throw new BadRequestException('Could not create NFT metadata.', { cause: error });
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

        // Now that the asset is complete, create and upload the final metadata to IPFS.
        // This is an asynchronous operation, can be awaited or run in the background.
        this._uploadMetadataToIpfs(asset).catch(err => {
          console.error(`Failed to upload metadata for asset ${asset._id}:`, err);
        });
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
        assetId: asset._id.toString(),
        message: 'IP metadata created successfully',
      };
    } catch (error) {
      throw new BadRequestException('Could not create IP metadata.', { cause: error });
    }
  }

  /**
   * Constructs the specific metadata JSON for an asset and uploads it to IPFS via Pinata.
   * This is a private method triggered after an asset is fully formed.
   * @param {AssetDocument} asset The complete asset document from the database.
   * @private
   */
  private async _uploadMetadataToIpfs(asset: AssetDocument): Promise<void> {
    const pinataApiKey = this.configService.get<string>('PINATA_API_KEY');
    const pinataApiSecret = this.configService.get<string>('PINATA_API_SECRET');

    if (!pinataApiKey || !pinataApiSecret) {
      console.warn('Pinata API keys not found. Skipping metadata upload.');
      return;
    }

    // 1. Construct the final metadata JSON object from the asset data.
    const metadata: AssetMetadata = {
      nft_info: {
        name: asset.name,
        description: asset.description,
        image_url: asset.image_url,
      },
      ip_info: {
        title: asset.title,
        description: asset.description,
        creator: asset.creators, // The wallet address
        createdat: asset.createdat,
      },
    };

    // 2. Upload the JSON to Pinata.
    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataApiSecret,
      },
    });

    const ipfsHash = response.data.IpfsHash;
    const metadataURI = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    // 3. (Optional but recommended) Save the metadata URI back to the asset.
    asset.metadataURI = metadataURI;
    await asset.save();
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
    const asset = await this.assetModel.findById(listMarketplaceDto.assetId).exec();

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

    // TODO: Trigger on-chain listing
    // const minterPrivateKey = this.configService.get<string>('MINTER_PRIVATE_KEY');
    // await this.web3Service.listIPOnChain(asset.tokenId, asset.price, minterPrivateKey);
    // The listingId above will be replaced by the event listener when the on-chain event is caught.

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
      .find({ isListed: true }).exec();
  }

  // Get user's IPs
  async getUserIps(walletAddress: string): Promise<Asset[]> {
    return this.assetModel
      .find({ currentOwner: walletAddress }).exec();
  }

  // Get all assets
  async findAll(): Promise<Asset[]> {
    return this.assetModel.find().exec();
  }

  // Get asset by ID
  async findById(id: string): Promise<Asset> {
    const asset = await this.assetModel.findById(id).exec();
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    return asset;
  }

  // Find asset by metadataURI
  async findByMetadataURI(metadataURI: string): Promise<AssetDocument> {
    return this.assetModel.findOne({ metadataURI }).exec();
  }

  // Find asset by listingId
  async findByListingId(listingId: string): Promise<AssetDocument> {
    return this.assetModel.findOne({ listingId }).exec();
  }

  // Find asset by tokenId
  async findByTokenId(tokenId: number): Promise<AssetDocument> {
    return this.assetModel.findOne({ tokenId }).exec();
  }
}