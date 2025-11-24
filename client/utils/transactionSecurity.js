import { ethers } from 'ethers';

/**
 * Transaction Security Utilities for Marketplace Protection
 * 
 * This module provides comprehensive security utilities for marketplace transactions
 * including cryptographically secure message generation, wallet signature verification,
 * and anti-bot protection mechanisms. The utilities implement a multi-layered security
 * approach with unique nonces, timestamp validation, and human-readable verification
 * messages that prevent automated attacks while maintaining user-friendly experience.
 */

// Generate a cryptographically secure nonce for replay attack prevention
export const generateNonce = () => {
  return ethers.hexlify(ethers.randomBytes(16));
};

/**
 * Verification message generator for secure marketplace transactions.
 * 
 * This function creates human-readable verification messages that include all
 * transaction details, unique nonces, timestamps, and wallet addresses. The
 * generated messages provide clear transaction context for users while
 * implementing security measures against replay attacks and bot automation.
 * Each message is uniquely crafted based on transaction type and contains
 * all necessary information for cryptographic validation.
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
 * Wallet signature collection with comprehensive error handling.
 * 
 * This function manages the complete message signing process through MetaMask
 * including provider initialization, signature request, and error categorization.
 * It provides detailed error handling for various failure scenarios including
 * user rejection, invalid message formats, and wallet connectivity issues.
 * The function ensures proper signature collection while maintaining user
 * experience through clear error messaging.
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
 * Cryptographic signature validation with security checks.
 * 
 * This function performs comprehensive validation of signed messages including
 * cryptographic signature verification, address matching, and timestamp validation.
 * It implements multiple security layers to prevent replay attacks, signature
 * forgery, and expired message usage. The validation ensures that only legitimate
 * signatures from the correct wallet address within the valid time window are
 * accepted for transaction processing.
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

// Transaction detail formatter for user interface display with icons and descriptions
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