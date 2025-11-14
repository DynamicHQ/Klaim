// Minimal validation and mapping utilities used by the frontend flows.
// Exported as CommonJS for easy test execution in Node.

function mapFormToNftInfo(formData) {
  if (!formData) throw new Error('formData is required');
  const name = (formData.title || formData.name || '').toString().trim();
  const description = (formData.description || '').toString().trim();

  let image_url = null;
  if (formData.image) {
    // if image is a File-like object with a .name or a string URL
    if (typeof formData.image === 'string') image_url = formData.image;
    else if (formData.image && typeof formData.image === 'object' && formData.image.uri) image_url = formData.image.uri;
    else if (formData.image && typeof formData.image === 'object' && formData.image.name) image_url = formData.image.name; // fallback
    else image_url = null;
  }

  if (!name) throw new Error('NFT name is required');
  if (!description) throw new Error('NFT description is required');
  if (!image_url) throw new Error('NFT image is required');

  return {
    name,
    description,
    image_url
  };
}

function buildIpInfoFromNft(nftInfo, walletAddress) {
  if (!nftInfo || typeof nftInfo !== 'object') throw new Error('nftInfo is required');
  if (!nftInfo.name || !nftInfo.description) throw new Error('nftInfo must contain name and description');

  return {
    title: nftInfo.name,
    description: nftInfo.description,
    creators: walletAddress || '',
    createdat: new Date().toISOString()
  };
}

module.exports = {
  mapFormToNftInfo,
  buildIpInfoFromNft
};
