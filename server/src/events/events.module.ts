import { Module } from '@nestjs/common';
import { EventMonitoringService } from './event-monitoring.service';
import { Web3Module } from '../web3/web3.module';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [Web3Module, AssetsModule],
  providers: [EventMonitoringService],
})
export class EventsModule {}