import { IsNotEmpty, IsString, IsNumber, IsEthereumAddress } from 'class-validator';

export class ListMarketplaceDto {j
    assetId: string;
    
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
