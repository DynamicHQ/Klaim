/**
 * Validation utilities for React Native mobile app
 * Ported from web client with React Native compatibility
 */

/**
 * Map form data to NFT info object
 * @param {Object} formData - Form data with title, description, and image
 * @returns {Object} NFT info object
 * @throws {Error} If required fields are missing
 */
function mapFormToNftInfo(formData) {
  if (!formData) throw new Error('formData is required');
  const name = (formData.title || formData.name || '').toString().trim();
  const description = (formData.description || '').toString().trim();

  let image_url = null;
  if (formData.image) {
    // Handle different image formats in React Native
    if (typeof formData.image === 'string') {
      image_url = formData.image;
    } else if (formData.image && typeof formData.image === 'object' && formData.image.uri) {
      image_url = formData.image.uri;
    } else if (formData.image && typeof formData.image === 'object' && formData.image.name) {
      image_url = formData.image.name;
    } else {
      image_url = null;
    }
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

/**
 * Build IP info object from NFT info
 * @param {Object} nftInfo - NFT info object
 * @param {string} walletAddress - Creator wallet address
 * @returns {Object} IP info object
 * @throws {Error} If required fields are missing
 */
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

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate Ethereum address format
 * @param {string} address - Ethereum address to validate
 * @returns {boolean} True if valid Ethereum address format
 */
function isValidEthereumAddress(address) {
  if (!address || typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate that a string is not empty
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length (default: 1)
 * @returns {boolean} True if string is not empty and meets minimum length
 */
function isNotEmpty(value, minLength = 1) {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length >= minLength;
}

/**
 * Validate that a number is positive
 * @param {number|string} value - Number to validate
 * @returns {boolean} True if number is positive
 */
function isPositiveNumber(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
}

/**
 * Validate price input
 * @param {string|number} price - Price to validate
 * @returns {Object} Validation result with isValid and error message
 */
function validatePrice(price) {
  if (!price && price !== 0) {
    return { isValid: false, error: 'Price is required' };
  }
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return { isValid: false, error: 'Price must be a valid number' };
  }
  
  if (numPrice <= 0) {
    return { isValid: false, error: 'Price must be greater than 0' };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validate asset creation form
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result with isValid and errors object
 */
function validateAssetForm(formData) {
  const errors = {};
  
  if (!isNotEmpty(formData.title, 3)) {
    errors.title = 'Title must be at least 3 characters';
  }
  
  if (!isNotEmpty(formData.description, 10)) {
    errors.description = 'Description must be at least 10 characters';
  }
  
  if (!formData.image) {
    errors.image = 'Image is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export {
  mapFormToNftInfo,
  buildIpInfoFromNft,
  isValidEmail,
  isValidEthereumAddress,
  isNotEmpty,
  isPositiveNumber,
  validatePrice,
  validateAssetForm
};

export default {
  mapFormToNftInfo,
  buildIpInfoFromNft,
  isValidEmail,
  isValidEthereumAddress,
  isNotEmpty,
  isPositiveNumber,
  validatePrice,
  validateAssetForm
};
