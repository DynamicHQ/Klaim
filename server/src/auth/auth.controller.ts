import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Step 1: get nonce for wallet
  @Post('nonce')
  async getNonce(@Body() body: { walletAddress: string }) {
    return this.authService.requestNonce(body.walletAddress);
  }

  // Step 2: verify signature
  @Post('verify')
  async verify(@Body() body: { walletAddress: string; signature: string }) {
    return this.authService.verifySignature(body.walletAddress, body.signature);
  }
}
