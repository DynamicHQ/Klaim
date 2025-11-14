import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Asset } from './schema/asset.schema';
import { CreateAssetDto } from './dto/create-asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<Asset>,
  ) {}

  // Create a new asset for a given creator
async create(createAssetDto: CreateAssetDto, creatorId: string): Promise<Asset> {
    const createdAsset = new this.assetModel({
      ...createAssetDto,
      creator: new Types.ObjectId(creatorId), 
    });

    try {
      // Attempt to save the document
      return await createdAsset.save(); 
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.imageHash) {
        throw new ConflictException(
          `Asset creation failed. The image hash "${createAssetDto.imageHash}" already exists.`,
        );
      }
      
      throw error;
    }
  }

  async findAll(): Promise<Asset[]> {
    return this.assetModel.find().populate('creator', 'wallet profileName').exec();
  }
}