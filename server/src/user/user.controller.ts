import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUserProfile(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);

    if (!user) {
      return { message: 'User not found' };
    }

    return user; 
  }

  @Post('sync-wallet')
  async syncWallet(@Body() body: { walletAddress: string }) {
    return this.userService.syncWallet(body.walletAddress);
  }
}