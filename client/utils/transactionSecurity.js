import { ethers } from 'ethers';

/**
 * Generate a cryptographically secure nonce
 */
export const generateNonce = () => {
  return ethers.hexlify(ethers.randomBytes(16));
};

/**
 * Generate a verification message for marketplace transactions
 */
export const generateVerificationMessage = (address, transactionDetails) => {
  const { type, assetId, price, listingId } = transactionDetails;
  const timestamp = new Date().toISOString();
  const nonce = generateNonce();

  let actionDescription = '';
  let detailsSection = '';

  switch (type) {
    case 'purchase':
      actionDescription = 'Purchase IP Asset';
      detailsSection = `Asset ID: ${assetId}\nPrice: ${price} KIP`;
      break;
    case 'listing':
      actionDescription = 'List IP Asset';
      detailsSection = `Asset ID: ${assetId}\nListing Price: ${price} KIP`;
      break;
    case 'cancellation':
      actionDescription = 'Cancel IP Asset Listing';
      detailsSection = `Listing ID: ${listingId}`;
      break;
    default:
      throw new Error(`Unknown transaction type: ${type}`);
  }

  const message = `Klaim Marketplace Transaction Verification

Action: ${actionDescription}
${detailsSection}

Timestamp: ${timestamp}
Nonce: ${nonce}
Wallet: ${address}

By signing this message, you confirm your intent to perform this transaction.`;

  return {
    message,
    nonce,
    timestamp: Date.now(),
    type,
    details: transactionDetails
  };
};

/**
 * Sign a verification message using the user's wallet
 */
export const signVerificationMessage = async (messageData) => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const signature = await signer.signMessage(messageData.message);
    
    return {
      ...messageData,
      signature,
      signedAt: Date.now()
    };
  } catch (error) {
    if (error.code === 4001) {
      throw new Error('Transaction verification was cancelled by user');
    } else if (error.code === -32602) {
      throw new Error('Invalid verification message format');
    } else {
      throw new Error(`Failed to sign verification message: ${error.message}`);
    }
  }
};

/**
 * Validate a signed verification message
 */
export const validateSignedMessage = (signedMessageData, expectedAddress) => {
  try {
    const { message, signature } = signedMessageData;
    
    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
      throw new Error('Signature verification failed: address mismatch');
    }

    // Check if the message is not too old (5 minutes max)
    const messageAge = Date.now() - signedMessageData.timestamp;
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    if (messageAge > maxAge) {
      throw new Error('Verification message has expired');
    }

    return true;
  } catch (error) {
    throw new Error(`Message validation failed: ${error.message}`);
  }
};

/**
 * Format transaction details for display
 */
export const formatTransactionDetails = (transactionDetails) => {
  const { type, assetId, price, listingId } = transactionDetails;

  switch (type) {
    case 'purchase':
      return {
        action: 'Purchase',
        description: `Buy IP Asset #${assetId}`,
        amount: `${price} KIP`,
        icon: '🛒'
      };
    case 'listing':
      return {
        action: 'List',
        description: `List IP Asset #${assetId}`,
        amount: `${price} KIP`,
        icon: '📝'
      };
    case 'cancellation':
      return {
        action: 'Cancel',
        description: `Cancel Listing #${listingId}`,
        amount: null,
        icon: '❌'
      };
    default:
      return {
        action: 'Unknown',
        description: 'Unknown transaction',
        amount: null,
        icon: '❓'
      };
  }
};

export default {
  generateNonce,
  generateVerificationMessage,
  signVerificationMessage,
  validateSignedMessage,
  formatTransactionDetails
};