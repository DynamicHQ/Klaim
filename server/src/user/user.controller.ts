// src/user/user.controller.ts (Example)
import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUserProfile(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);

    if (!user) {
      // Handle case where user ID is not found
      return { message: 'User not found' };
    }

    // Return the user data (wallet, profileName, etc.)
    return user; 
  }
}