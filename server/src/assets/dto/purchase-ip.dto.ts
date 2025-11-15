import { IsNotEmpty, IsString, IsEthereumAddress } from 'class-validator';

export class PurchaseIpDto {
  @IsString()
  @IsNotEmpty()
  listingId: string;

  @IsEthereumAddress()
  @IsNotEmpty()
  buyer: string;
}
