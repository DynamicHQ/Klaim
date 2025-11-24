import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FaucetService } from './faucet.service';
import { ClaimRequestDto } from './dto/claim-request.dto';

@Controller('faucet')
export class FaucetController {
  constructor(private readonly faucetService: FaucetService) {}

  @Post('claim')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 1, ttl: 60000 } }) // 1 request per minute per IP
  async claimTokens(@Body() claimRequestDto: ClaimRequestDto) {
    try {
      return await this.faucetService.claimTokens(claimRequestDto.walletAddress);
    } catch (error) {
      // Re-throw known exceptions
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      
      // Handle unexpected errors
      throw new InternalServerErrorException('An unexpected error occurred while processing your claim');
    }
  }

  @Get('eligibility/:address')
  async checkEligibility(@Param('address') address: string) {
    try {
      const hasClaimed = await this.faucetService.hasClaimedTokens(address);
      return {
        eligible: !hasClaimed,
        hasClaimed,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to check eligibility');
    }
  }

  @Get('balance/:address')
  async getBalance(@Param('address') address: string) {
    try {
      const balance = await this.faucetService.getTokenBalance(address);
      return {
        balance,
        address,
      };
    } catch (error) {
      // Handle specific error cases
      if (error.message?.includes('Invalid')) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed to query token balance');
    }
  }
}
