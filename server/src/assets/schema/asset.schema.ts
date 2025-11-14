import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Asset extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, unique: true })
  imageHash: string; 

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId; 

  @Prop({ default: 'Standard' }) 
  license: string; 

  @Prop({ default: null })
  storyProtocolId: string; 
}

export const AssetSchema = SchemaFactory.createForClass(Asset);