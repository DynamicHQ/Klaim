// src/auth/dto/login.dto.ts 

import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  
  @IsString()
  @IsNotEmpty()
  // Pattern to validate a standard 0x Ethereum address format
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Wallet address must be a valid Ethereum address.' })
  wallet: string;

  @IsString()
  @IsNotEmpty()
  // The signature is a long hexadecimal string
  @Matches(/^0x[a-fA-F0-9]+$/, { message: 'Signature must be a valid hexadecimal string.' })
  signature: string;
}