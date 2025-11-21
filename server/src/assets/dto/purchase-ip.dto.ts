import { IsNotEmpty, IsString } from 'class-validator';

export class PurchaseIpDto {
  @IsString()
  @IsNotEmpty()
  listingId: string;

  @IsString()
  @IsNotEmpty()
  buyer: string;
}
