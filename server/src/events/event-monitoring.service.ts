import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Web3Service } from '../web3/web3.service';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class EventMonitoringService implements OnModuleInit {
  private readonly logger = new Logger(EventMonitoringService.name);

  constructor(
    private readonly web3Service: Web3Service,
    private readonly assetsService: AssetsService,
  ) {}

  onModuleInit() {
    this.logger.log('Initializing event monitoring...');
    this.monitorAssetCreation();
    this.monitorMarketplace();
  }

  private monitorAssetCreation() {
    this.web3Service.monitorIPCreatorEvents(async (event) => {
      this.logger.log(`Received IPAssetCreated event for tokenId: ${event.tokenId}`);
      try {
        // Find the asset in the database using the metadataURI, which is unique.
        const asset = await this.assetsService.findByMetadataURI(event.metadataURI);
        if (asset) {
          const assetId = String(asset._id);
          await this.assetsService.updateBlockchainData(assetId, {
            ipId: event.ipId,
            tokenId: event.tokenId,
            transactionHash: event.transactionHash,
          });
          this.logger.log(`Asset ${assetId} synced with on-chain data.`);
        } else {
          this.logger.warn(`Could not find asset with metadataURI: ${event.metadataURI}`);
        }
      } catch (error) {
        this.logger.error('Error processing IPAssetCreated event:', error);
      }
    }).catch(error => this.logger.error('Failed to start IP Creator event monitoring.', error));
  }

  private monitorMarketplace() {
    this.web3Service.monitorMarketplaceEvents(
      // onListed callback
      async (event) => {
        this.logger.log(`Received IPListed event for listingId: ${event.listingId}`);
        try {
          // The `listOnMarketplace` service method is called first, which sets `isListed` to true.
          // Here, we find the asset that was just listed by its tokenId and update it with the real on-chain listingId.
          const asset = await this.assetsService.findByTokenId(event.tokenId);
          if (asset && asset.isListed) {
            asset.listingId = event.listingId; // Update with the real on-chain ID
            await asset.save();
            this.logger.log(`Asset ${asset._id} updated with on-chain listingId: ${event.listingId}`);
          } else {
            this.logger.warn(`Could not find a matching listed asset for tokenId: ${event.tokenId}`);
          }
        } catch (error) {
          this.logger.error('Error processing IPListed event:', error);
        }
      },
      // onSold callback
      async (event) => {
        this.logger.log(`Received IPSold event for listingId: ${event.listingId}`);
        try {
          const asset = await this.assetsService.findByListingId(event.listingId);
          if (asset) {
            await this.assetsService.purchaseIp({ listingId: event.listingId, buyer: event.buyer });
            this.logger.log(`Asset ownership for listing ${event.listingId} transferred to ${event.buyer}.`);
          }
        } catch (error) {
          this.logger.error('Error processing IPSold event:', error);
        }
      },
    ).catch(error => this.logger.error('Failed to start Marketplace event monitoring.', error));
  }
}