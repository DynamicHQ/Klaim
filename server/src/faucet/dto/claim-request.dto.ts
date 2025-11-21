import { IsEthereumAddress, IsNotEmpty } from 'class-validator';

export class ClaimRequestDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  walletAddress: string;
}
