// Story Protocol integration utilities
// This is a placeholder implementation - will need actual Story Protocol SDK integration

import { createNFT, createIP, readFileAsDataURL } from '@/utils/api';

export class StoryProtocolService {
  constructor() {
    // Initialize with Story Protocol configuration
    this.initialized = false;
  }

  async initialize() {
    // TODO: Initialize Story Protocol SDK
    // This would typically involve setting up the SDK with proper configuration
    this.initialized = true;
  }

  async createAndRegisterIP(metadata, creatorWallet) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Build nft_info: name, description, image_url
      let image_url = null;
      if (metadata.image) {
        // metadata.image may be a File or a data URL or a string URL
        if (typeof metadata.image === 'string') {
          image_url = metadata.image;
        } else if (metadata.image instanceof File) {
          // Convert to data URL and send as image_url (backend can decode or handle)
          image_url = await readFileAsDataURL(metadata.image);
        }
      }

      const nft_info = {
        name: metadata.name || metadata.title || '',
        description: metadata.description || '',
        image_url
      };

      // Send nft_info to backend
      const nftResp = await createNFT(nft_info, creatorWallet);

      // Build ip_info from NFT data and wallet state
      const ip_info = {
        title: nft_info.name,
        description: nft_info.description,
        creators: creatorWallet || '',
        createdat: new Date().toISOString()
      };

      const ipResp = await createIP(ip_info);

      // Combine and return responses
      return {
        transactionHash: nftResp.transactionHash || null,
        nftId: nftResp.nftId || nftResp.id || null,
        ipId: ipResp.ipId || ipResp.id || null,
        nftResponse: nftResp,
        ipResponse: ipResp
      };
    } catch (error) {
      console.error('Failed to create NFT/IP via backend:', error);
      throw new Error(error.message || 'Failed to create NFT/IP');
    }
  }

  async uploadToIPFS(metadata) {
    // TODO: Implement IPFS upload
    // This would typically use a service like Pinata, NFT.Storage, or IPFS directly
    
    // Mock IPFS hash for now
    return `ipfs://Qm${Math.random().toString(36).substr(2, 44)}`;
  }

  async getIPDetails(ipId) {
    // TODO: Implement IP details retrieval from Story Protocol
    return {
      id: ipId,
      owner: '0x...',
      metadataUri: 'ipfs://...',
      royalties: { percentage: 5, recipient: '0x...' },
      registrationDate: new Date()
    };
  }

  async getNFTDetails(nftId) {
    // TODO: Implement NFT details retrieval
    return {
      id: nftId,
      owner: '0x...',
      tokenUri: 'ipfs://...',
      mintDate: new Date()
    };
  }
}

// Validation utilities
export const validateMetadata = (metadata) => {
  const errors = [];

  if (!metadata.title || metadata.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!metadata.description || metadata.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!metadata.image) {
    errors.push('Image is required');
  }

  if (metadata.royaltyPercentage < 0 || metadata.royaltyPercentage > 100) {
    errors.push('Royalty percentage must be between 0 and 100');
  }

  if (metadata.royaltyRecipient && !/^0x[a-fA-F0-9]{40}$/.test(metadata.royaltyRecipient)) {
    errors.push('Invalid royalty recipient address');
  }

  return errors;
};

// Format metadata for Story Protocol
export const formatMetadataForStoryProtocol = (formData) => {
  return {
    name: formData.title,
    description: formData.description,
    image: formData.image,
    attributes: formData.attributes.filter(attr => 
      attr.trait_type.trim() && attr.value.trim()
    ),
    royalty: {
      percentage: formData.royaltyPercentage,
      recipient: formData.royaltyRecipient || null
    }
  };
};

// Create singleton instance
export const storyProtocolService = new StoryProtocolService();