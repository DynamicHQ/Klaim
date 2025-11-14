import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { Asset, AssetSchema } from './schema/asset.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    
    AuthModule 
  ],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}