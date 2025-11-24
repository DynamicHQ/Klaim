import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FaucetController } from './faucet.controller';
import { FaucetService } from './faucet.service';
import { FaucetClaim, FaucetClaimSchema } from './schema/faucet-claim.schema';
import { Web3Module } from '../web3/web3.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FaucetClaim.name, schema: FaucetClaimSchema },
    ]),
    Web3Module,
  ],
  controllers: [FaucetController],
  providers: [FaucetService],
  exports: [FaucetService],
})
export class FaucetModule {}
