// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers'; // The core library for crypto operations
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { LoginDto } from 'src/user/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, // Dependency on UserService
    private jwtService: JwtService,   // Dependency on NestJS JwtService
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { wallet, signature } = loginDto;
    const lowerCaseWallet = wallet.toLowerCase();
    
    const user = await this.userModel.findOne({ wallet: lowerCaseWallet }).exec();

    if (!user) {
      throw new UnauthorizedException('User not found. Please request a nonce first to register/login.');
    }

    const signedMessage = `Welcome to Klaimit! Sign this nonce to login: ${user.nonce}`;

    try {
        const recoveredAddress = ethers.verifyMessage(signedMessage, signature);
        
        if (recoveredAddress.toLowerCase() !== lowerCaseWallet) {
          throw new UnauthorizedException('Invalid signature or nonce mismatch.');
        }
        
        await this.userService.findOrCreateAndSetNonce(user.wallet); 


        const payload = { 
            id: user.id.toString(), 
            wallet: user.wallet      // Wallet address
        }; 
        
        return {
          access_token: this.jwtService.sign(payload),
        };
        
    } catch (error) {
        // Catch ethers.js errors (e.g., malformed signature) or the UnauthorizedException
        if (error instanceof UnauthorizedException) {
             throw error;
        }
        // Handle generic/cryptographic failures
        throw new UnauthorizedException('Authentication failed due to signature verification error.');
    }
  }

}