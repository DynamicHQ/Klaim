import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AssetsModule } from './assets/assets.module';
import { Web3Module } from './web3/web3.module';


@Module({
  imports: [  
        ConfigModule.forRoot({
      isGlobal: true, 
    }),
      MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
      AuthModule,
      UserModule,
      AssetsModule,
      Web3Module,],
  controllers: [],
  providers: [],
})
export class AppModule {}
