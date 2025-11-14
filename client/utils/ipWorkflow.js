import { ethers } from 'ethers';
import { uploadToIPFS } from './ipfs';

/**
 * Generate a human readable license text used by the frontend guide.
 * type: { commercial: boolean, derivatives: boolean }
 */
export function generateLicenseText(type, revShare = 0) {
  return `\nIP LICENSE AGREEMENT\n\nThis IP Asset is licensed under the following terms:\n\n✅ Commercial Use: ${type.commercial ? 'ALLOWED' : 'NOT ALLOWED'}\n✅ Derivatives: ${type.derivatives ? 'ALLOWED' : 'NOT ALLOWED'}\n✅ Revenue Share: ${revShare}% of derivative revenue\n✅ Attribution: Required\n\nFull terms available at: https://docs.story.foundation/pil\nGenerated: ${new Date().toISOString()}\n`;
}

/**
 * uploadFileWorkflow handles the frontend steps to create an NFT + IP on-chain:
 * 1) Upload file to IPFS
 * 2) Upload license text to IPFS
 * 3) Build metadata and compute metadataHash
 * 4) Call ipCreatorContract.createIPFromFile(...) with signer
 *
 * NOTE: This function expects the caller to provide a connected signer
 * and an ipCreatorContract instance (ethers.Contract connected with signer)
 */
export async function uploadFileAndCreateIP({
  file,
  licenseType = { commercial: true, derivatives: true },
  commercialRevShare = 0,
  metadata = {},
  signer,
  ipCreatorContract
}) {
  if (!signer) throw new Error('Signer is required');
  if (!ipCreatorContract) throw new Error('ipCreatorContract instance is required (connected to signer)');

  // 1. Upload file
  const fileResult = await uploadToIPFS(file, file.name || 'asset');
  const metadataURI = fileResult.url;

  // 2. Create and upload license text
  const licenseText = generateLicenseText(licenseType, commercialRevShare);
  const licenseResult = await uploadToIPFS(licenseText, 'license.txt');
  const licenseURI = licenseResult.url;

  // 3. Create metadata object (frontend-calculated)
  const combinedMetadata = {
    ...metadata,
    name: metadata.name || file.name || 'Untitled',
    description: metadata.description || '',
    image: metadataURI,
    license: licenseURI
  };

  const metadataString = JSON.stringify(combinedMetadata);
  const metadataHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(metadataString));

  // 4. Call contract to create NFT + IP with viewable license
  // Expected signature: createIPFromFile(recipient, metadataURI, metadataHash, commercialRevShare, licenseURI)
  const recipient = await signer.getAddress();

  const tx = await ipCreatorContract.createIPFromFile(
    recipient,
    metadataURI,
    metadataHash,
    commercialRevShare,
    licenseURI
  );

  const receipt = await tx.wait();

  return {
    receipt,
    metadata: combinedMetadata,
    metadataHash,
    metadataURI,
    licenseURI,
    fileCid: fileResult.cid,
    licenseCid: licenseResult.cid
  };
}

export default {
  generateLicenseText,
  uploadFileAndCreateIP
};
