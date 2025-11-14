import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) 
export class User extends Document  {
  // The unique identifier for authentication
  @Prop({ 
    required: true, 
    unique: true, 
    lowercase: true,
    index: true 
  })
  wallet: string;

  // The unique string required for the signature verification step
  @Prop({ required: true })
  nonce: string; 

  // Optional display name
  @Prop({ default: 'Klaimit User' })
  profileName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);