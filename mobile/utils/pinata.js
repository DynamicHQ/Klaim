/**
 * Mobile Pinata IPFS Upload Utility
 * 
 * This module provides IPFS file upload functionality via Pinata for React Native.
 * Adapted from the web client with mobile-specific handling for file uploads.
 */

const PINATA_JWT = process.env.EXPO_PUBLIC_PINATA_JWT;

/**
 * Uploads a file (e.g., an image) to IPFS via Pinata from React Native
 * @param {Object} file - File object with uri, name, and type properties
 * @param {string} file.uri - Local file URI (e.g., from image picker)
 * @param {string} file.name - File name
 * @param {string} file.type - MIME type
 * @returns {Promise<string>} The IPFS URL of the uploaded file
 * @throws {Error} If the upload fails
 */
export const uploadToPinata = async (file) => {
  if (!PINATA_JWT) {
    throw new Error('Pinata JWT is not configured. Please check your environment variables.');
  }

  // Create FormData for React Native
  const formData = new FormData();
  
  // React Native file upload format
  formData.append('file', {
    uri: file.uri,
    name: file.name || 'upload.jpg',
    type: file.type || 'image/jpeg'
  });

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.details || `HTTP error! status: ${response.status}`);
    }

    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw error;
  }
};

export default {
  uploadToPinata
};
