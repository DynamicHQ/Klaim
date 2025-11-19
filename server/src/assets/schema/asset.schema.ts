import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Asset extends Document {
  // NFT Info
  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  image_url: string;

  // IP Info
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId;

  @Prop({ required: true })
  creators: string; // Wallet address

  @Prop({ required: true })
  createdat: string;

  // Blockchain Data
  @Prop({ default: null })
  nftId: string;

  @Prop({ default: null })
  ipId: string;

  @Prop({ default: null })
  tokenId: number;

  @Prop({ default: null })
  transactionHash: string;

  // Marketplace Data
  @Prop({ default: false })
  isListed: boolean;

  @Prop({ default: null })
  listingId: string;

  @Prop({ default: null })
  price: number;

  @Prop({ default: null })
  currentOwner: string; // Wallet address

  @Prop({ default: 'Standard' })
  license: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);