// src/auth/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

// Define the shape of the data encoded in the token payload
export interface JwtPayload {
  sub: string; // User ID from MongoDB
  wallet: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService, // Inject UserService
  ) {
    super({
      // Tell the strategy how to find the JWT in the request (usually the Authorization header)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      // Do NOT ignore expiration; NestJS handles this automatically.
      ignoreExpiration: false, 
      // The secret key must match the one used to SIGN the token in auth.module.ts
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // This method is called after the token is verified (i.e., not expired, correct signature)
  async validate(payload: JwtPayload) {
    // 1. Optional Security Check: Confirm the user still exists in the database
    // This prevents a user who was deleted from still using an active token.
    // We assume you have a findById or similar method in your UserService
    const user = await this.userService.findUserById(payload.sub); 

    if (!user) {
      throw new UnauthorizedException('User not found or deleted.');
    }
    
    // 2. Return the payload. This object is automatically attached to req.user in the controller.
    return { userId: payload.sub, wallet: payload.wallet };
  }
}