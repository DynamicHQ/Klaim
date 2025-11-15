import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateIpDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  creators: string;

  @IsString()
  @IsNotEmpty()
  createdat: string;
}
