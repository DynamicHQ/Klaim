import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  // Step 1: Request a nonce for a wallet
  async requestNonce(walletAddress: string) {
    const user = await this.userService.Create(walletAddress);
    return { nonce: user.nonce };
  }


  // Step 2: Verify the signed message
  async verifySignature(walletAddress: string, signature: string) {
    const user = await this.userService.Create(walletAddress);
    const message = `Sign this message to log in: ${user.nonce}`;

    // Recover signer from the signature
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Update nonce so it can’t be reused
    await this.userService.updateNonce(walletAddress);

    // Create a JWT token for session
    const token = await this.jwtService.signAsync({ walletAddress });
    return { token };
  }
}
