import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../user/schema/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined!');
}
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret
    });
  }


// src/auth/jwt.strategy.ts

async validate(payload: any) {
  const { id } = payload;
  
  // 💡 ADD THIS LINE to see what ID the strategy is looking up
  console.log(`[JWT Strategy] Attempting to find user with ID: ${id}`); 
  
  const user = await this.userModel.findById(id);

  if (!user) {
    // This part is executing!
    throw new UnauthorizedException('Login first to access this endpoint.');
  }
return user;
  // ... (rest of the code)
}
}