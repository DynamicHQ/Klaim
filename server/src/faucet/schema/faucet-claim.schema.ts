import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FaucetClaimDocument = FaucetClaim & Document;

@Schema({ timestamps: true })
export class FaucetClaim {
  @Prop({ required: true, unique: true, index: true })
  walletAddress: string;

  @Prop({ required: true })
  claimedAt: Date;

  @Prop({ required: true })
  transactionHash: string;

  @Prop({ required: true })
  amount: string;
}

export const FaucetClaimSchema = SchemaFactory.createForClass(FaucetClaim);
