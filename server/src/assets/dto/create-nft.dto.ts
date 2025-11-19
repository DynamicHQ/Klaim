import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNftDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;
}
