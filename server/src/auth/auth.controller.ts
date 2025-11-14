import { Controller, Get, Param, HttpException, HttpStatus, Post, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service'; 
import { LoginDto } from '../user/dto/login.dto';
import { get } from 'http';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
      private userService: UserService,
      private authService: AuthService, 
  ) {}

  @Get('nonce/:wallet')
  async getNonce(@Param('wallet') wallet: string): Promise<{ nonce: string }> {
    if (!wallet || !wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new HttpException('Invalid Ethereum wallet address format.', HttpStatus.BAD_REQUEST);
    }
    
    try {
        const nonce = await this.userService.findOrCreateAndSetNonce(wallet);
        return { nonce };
        
    } catch (error) {
        if (error instanceof HttpException) {
            throw error;
        }
        throw new HttpException('Failed to generate nonce. Please try again.', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }


  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    try {
        return await this.authService.login(loginDto);
    } catch (error) {
        if (error instanceof UnauthorizedException) {
            throw error;
        }
        throw new HttpException('Authentication process failed unexpectedly.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}