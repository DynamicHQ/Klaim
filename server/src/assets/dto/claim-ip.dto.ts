import { IsNotEmpty, IsString } from 'class-validator';

export class ClaimIptDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}
