import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AssetsModule } from './assets/assets.module';
<<<<<<< HEAD
=======
import { Web3Module } from './web3/web3.module';
import { FaucetModule } from './faucet/faucet.module';
>>>>>>> 0844788e83e739f1c56a49cfcf73347ed3ee11d4


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
<<<<<<< HEAD
      AuthModule,
      UserModule,
      AssetsModule,],
=======
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds
      limit: 10, // 10 requests per minute (default for non-throttled endpoints)
    }]),
    AuthModule,
    UserModule,
    AssetsModule,
    Web3Module,
    FaucetModule,
  ],
>>>>>>> 0844788e83e739f1c56a49cfcf73347ed3ee11d4
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
