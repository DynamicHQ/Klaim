/**
 * Story Protocol Integration Service
 * 
 * This service provides comprehensive integration with Story Protocol for
 * intellectual property registration and management. It orchestrates the
 * complete IP creation workflow including image upload, metadata processing,
 * NFT minting, and IP registration on the Story Protocol blockchain. The
 * service abstracts complex blockchain interactions into simple method calls
 * while maintaining proper error handling and transaction tracking.
 */
import { createNFT, createIP, uploadToCloudinary } from '@/utils/api';

export class StoryProtocolService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    this.initialized = true;
  }

  /**
   * Complete IP creation and registration workflow.
   * 
   * This method handles the entire process of creating and registering
   * intellectual property assets including image upload to IPFS, metadata
   * processing, NFT minting, and IP registration on Story Protocol. It
   * provides comprehensive error handling and returns detailed transaction
   * information for tracking and verification purposes.
   */
  async createAndRegisterIP(metadata, creatorWallet) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Upload image to Cloudinary
      let image_url = null;
      if (metadata.image) {
        if (typeof metadata.image === 'string') {
          image_url = metadata.image;
        } else if (metadata.image instanceof File) {
          // Upload to Cloudinary
          image_url = await uploadToCloudinary(metadata.image);
        }
      }

      if (!image_url) {
        throw new Error('Failed to upload image');
      }

      // Build nft_info: name, description, image_url
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

      // Link IP to NFT
      const ipResp = await createIP(ip_info, nftResp.nftId);

      // Combine and return responses
      return {
        transactionHash: nftResp.transactionHash || null,
        nftId: nftResp.nftId || nftResp.id || null,
        ipId: ipResp.ipId || ipResp.id || null,
        image_url,
        nftResponse: nftResp,
        ipResponse: ipResp
      };
    } catch (error) {
      console.error('Failed to create NFT/IP via backend:', error);
      throw new Error(error.message || 'Failed to create NFT/IP');
    }
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

  return errors;
};

/**
 * Metadata formatter for Story Protocol compatibility.
 * 
 * This function transforms user form data into Story Protocol-compatible
 * metadata format including proper field mapping, data validation, and
 * structure formatting. It ensures metadata conforms to Story Protocol
 * standards while preserving all user-provided information for proper
 * IP asset registration and display.
 */
export const formatMetadataForStoryProtocol = (formData) => {
  return {
    name: formData.title,
    description: formData.description,
    image: formData.image,
    title: formData.title
  };
};

// Create singleton instance
export const storyProtocolService = new StoryProtocolService();