import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ListMarketplaceDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  nftContract: string;

  @IsNumber()
  @IsNotEmpty()
  tokenId: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEthereumAddress()
  @IsNotEmpty()
  seller: string;
}
