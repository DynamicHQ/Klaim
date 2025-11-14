import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
PassportModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
