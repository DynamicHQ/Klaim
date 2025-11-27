import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class ListMarketplaceDto {
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @IsString()
  @IsOptional()
  nftContract?: string;

  @IsNumber()
  @IsOptional()
  tokenId?: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  seller: string;
}
