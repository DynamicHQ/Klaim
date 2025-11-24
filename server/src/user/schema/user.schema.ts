import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Asset } from '../../assets/schema/asset.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  walletAddress: string;

  @Prop()
  username?: string;

  @Prop()
  avatar?: string;

  @Prop({ type: Boolean, default: false })
  hasClaimedTokens: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }] })
  assets: Asset[];
}

export const UserSchema = SchemaFactory.createForClass(User);
