const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

/**
 * Uploads a file (e.g., an image) to IPFS via Pinata.
 * @param {File} file The file to upload.
 * @returns {Promise<string>} The IPFS URL of the uploaded file.
 * @throws {Error} If the upload fails.
 */
export const uploadToPinata = async (file) => {
  if (!PINATA_JWT) {
    throw new Error('Pinata JWT is not configured. Please check your .env.local file.');
  }

  const formData = new FormData();
  formData.append('file', file);

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
