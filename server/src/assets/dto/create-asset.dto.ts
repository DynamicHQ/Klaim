import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageHash: string; 

  @IsString()
  @IsOptional()
  license: string;
}