import { 
  Controller, 
  Get, 
  Param, 
  Post, 
  Body, 
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service'; 
import { LoginDto } from '../user/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
      private userService: UserService,
      private authService: AuthService, 
  ) {}

  @Get('nonce/:wallet')
  async getNonce(@Param('wallet') wallet: string): Promise<{ nonce: string }> {
    if (!wallet || !wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new BadRequestException('Invalid Ethereum wallet address format.');
    }
    
    try {
        const nonce = await this.userService.findOrCreateAndSetNonce(wallet);
        return { nonce };
        
    } catch (error) {
        if (error instanceof BadRequestException) {
            throw error;
        }
        throw new ServiceUnavailableException('Failed to generate nonce. Please try again.');
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
        throw new InternalServerErrorException('Authentication process failed unexpectedly.');
    }
  }

}