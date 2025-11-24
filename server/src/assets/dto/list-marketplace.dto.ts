import { IsNotEmpty, IsString, IsNumber, IsEthereumAddress } from 'class-validator';

export class ListMarketplaceDto {
<<<<<<< HEAD
    assetId: string;
    
  @IsEthereumAddress()
=======
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @IsString()
>>>>>>> 0844788e83e739f1c56a49cfcf73347ed3ee11d4
  @IsNotEmpty()
  nftContract: string;

  @IsNumber()
  @IsNotEmpty()
  tokenId: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  seller: string;
}
