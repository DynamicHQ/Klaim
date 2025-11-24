import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { Asset, AssetSchema } from './schema/asset.schema';
<<<<<<< HEAD
import { AuthModule } from 'src/auth/auth.module';
import { Web3Module } from 'src/web3/web3.module';
=======
import { AuthModule } from '../auth/auth.module';
>>>>>>> 0844788e83e739f1c56a49cfcf73347ed3ee11d4

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    AuthModule,
    Web3Module,
  ],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}