'use client';

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { 
  generateVerificationMessage, 
  signVerificationMessage, 
  validateSignedMessage,
  formatTransactionDetails 
} from '@/utils/transactionSecurity';
import { useBalanceRefresh } from '@/contexts/BalanceContext';

/**
 * Custom hook for secure marketplace transaction processing with message signing.
 * 
 * This hook provides a comprehensive security layer for all marketplace transactions
 * by implementing mandatory message signing verification. It orchestrates the complete
 * security flow including message generation, user signature collection, cryptographic
 * validation, and transaction execution. The hook prevents bot attacks by requiring
 * human interaction for each transaction and provides detailed progress tracking
 * with user-friendly feedback throughout the verification process.
 * 
 * @returns {Object} Transaction security interface with execution function and state
 */
export const useTransactionSecurity = () => {
  const { address } = useAccount();
  const { triggerBalanceRefresh } = useBalanceRefresh();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [currentVerification, setCurrentVerification] = useState(null);

  /**
   * Core secure transaction execution function with multi-step verification.
   * 
   * This function implements the complete security workflow for marketplace transactions
   * including message generation with unique nonces, user signature collection through
   * MetaMask, cryptographic validation, and final transaction execution. It provides
   * comprehensive error handling, progress tracking, and automatic balance refresh
   * upon successful completion. The function ensures no transaction can proceed
   * without proper user verification, effectively preventing automated bot attacks.
   */
  const executeSecureTransaction = useCallback(async (transactionOptions, transactionFn) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsVerifying(true);
    setError(null);
    setCurrentVerification(null);

    try {
      // Step 1: Generate verification message
      const messageData = generateVerificationMessage(address, transactionOptions);
      setCurrentVerification({
        ...messageData,
        formatted: formatTransactionDetails(transactionOptions),
        step: 'generated'
      });

      // Step 2: Request user signature
      setCurrentVerification(prev => ({ ...prev, step: 'signing' }));
      const signedMessage = await signVerificationMessage(messageData);
      
      // Step 3: Validate signature
      setCurrentVerification(prev => ({ ...prev, step: 'validating' }));
      validateSignedMessage(signedMessage, address);
      
      setCurrentVerification(prev => ({ ...prev, step: 'executing' }));
      
      // Step 4: Execute the actual transaction
      const result = await transactionFn();
      
      // Step 5: Trigger balance refresh after successful transaction
      triggerBalanceRefresh();
      
      setCurrentVerification(prev => ({ ...prev, step: 'completed' }));
      
      return {
        success: true,
        result,
        verification: signedMessage
      };

    } catch (err) {
      console.error('Transaction security error:', err);
      setError(err.message || 'Transaction verification failed');
      setCurrentVerification(prev => prev ? { ...prev, step: 'failed', error: err.message } : null);
      throw err;
    } finally {
      setIsVerifying(false);
      // Clear verification state after a delay
      setTimeout(() => {
        setCurrentVerification(null);
        setError(null);
      }, 3000);
    }
  }, [address, triggerBalanceRefresh]);

  // Simple error clearing utility for resetting error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Dynamic message generator for verification step feedback.
   * 
   * This function provides contextual user feedback messages based on the current
   * verification step, helping users understand what's happening during the security
   * process. It generates appropriate titles, descriptions, and message types for
   * each step of the verification workflow, ensuring users receive clear guidance
   * throughout the transaction security process.
   */
  const getVerificationStepMessage = useCallback(() => {
    if (!currentVerification) return null;

    const { step, formatted } = currentVerification;
    
    switch (step) {
      case 'generated':
        return {
          title: 'Transaction Verification Required',
          message: `Please verify your intent to ${formatted.action.toLowerCase()} this asset.`,
          type: 'info'
        };
      case 'signing':
        return {
          title: 'Sign Verification Message',
          message: 'Please check your wallet and sign the verification message to continue.',
          type: 'warning'
        };
      case 'validating':
        return {
          title: 'Validating Signature',
          message: 'Verifying your signature...',
          type: 'info'
        };
      case 'executing':
        return {
          title: 'Executing Transaction',
          message: 'Processing your transaction on the blockchain...',
          type: 'info'
        };
      case 'completed':
        return {
          title: 'Transaction Successful',
          message: `${formatted.action} completed successfully!`,
          type: 'success'
        };
      case 'failed':
        return {
          title: 'Transaction Failed',
          message: currentVerification.error || 'Transaction verification failed',
          type: 'error'
        };
      default:
        return null;
    }
  }, [currentVerification]);

  return {
    executeSecureTransaction,
    isVerifying,
    error,
    clearError,
    currentVerification,
    verificationStep: currentVerification?.step || null,
    stepMessage: getVerificationStepMessage()
  };
};