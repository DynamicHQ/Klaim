'use client';

import { useState, useEffect } from 'react';
import { FaCoins, FaSpinner } from 'react-icons/fa';
import { claimTokens, checkEligibility, getTokenBalance } from '@/utils/api';

/**
 * TokenFaucet Component
 * Allows users to claim free KIP tokens once
 * 
 * @param {Object} props
 * @param {string} props.walletAddress - Connected wallet address
 * @param {Function} props.onClaimSuccess - Callback after successful claim
 */
export default function TokenFaucet({ walletAddress, onClaimSuccess }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  // Check eligibility and fetch balance on mount
  useEffect(() => {
    if (!walletAddress) {
      setCheckingEligibility(false);
      return;
    }

    const checkAndFetch = async () => {
      await checkUserEligibility();
      await fetchBalance();
    };
    
    checkAndFetch();
  }, [walletAddress]);

  /**
   * Check if user has already claimed tokens
   */
  const checkUserEligibility = async () => {
    try {
      setCheckingEligibility(true);
      const response = await checkEligibility(walletAddress);
      setHasClaimed(response.hasClaimed || false);
    } catch (err) {
      console.error('Error checking eligibility:', err);
      // If endpoint doesn't exist yet, assume eligible
      setHasClaimed(false);
    } finally {
      setCheckingEligibility(false);
    }
  };

  /**
   * Fetch current token balance
   */
  const fetchBalance = async () => {
    try {
      const response = await getTokenBalance(walletAddress);
      setBalance(response.balance || '0');
    } catch (err) {
      console.error('Error fetching balance:', err);
      // Set default balance if endpoint doesn't exist
      setBalance('0');
    }
  };

  /**
   * Handle claim button click
   */
  const handleClaim = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet to claim tokens');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await claimTokens(walletAddress);
      
      if (response.success) {
        // Update balance with new value
        setBalance(response.balance || '2000');
        setHasClaimed(true);
        
        // Call success callback if provided
        if (onClaimSuccess) {
          onClaimSuccess(response);
        }
      } else {
        setError(response.error || 'Failed to claim tokens');
      }
    } catch (err) {
      console.error('Error claiming tokens:', err);
      
      // Handle specific error cases
      if (err.status === 400) {
        setError(err.message || 'Tokens already claimed for this address');
        setHasClaimed(true);
      } else if (err.status === 500) {
        setError('Service temporarily unavailable. Please try again later.');
      } else if (err.message.includes('Network')) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Transaction failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render if user has already claimed
  if (hasClaimed) {
    return null;
  }

  // Don't render if still checking eligibility
  if (checkingEligibility) {
    return null;
  }

  // Don't render if no wallet connected
  if (!walletAddress) {
    return null;
  }

  const balanceNum = parseFloat(balance || '0');
  const showProminentCTA = balanceNum === 0;

  return (
    <div className={`card bg-gradient-to-br from-main/10 to-accent/10 shadow-lg ${showProminentCTA ? 'border-2 border-main' : ''}`}>
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-primary-text flex items-center gap-2">
            <FaCoins className="text-main" />
            KIP Token Faucet
          </h2>
          {balance !== null && (
            <div className="badge badge-lg bg-main/20 text-main border-main">
              {parseFloat(balance).toFixed(2)} KIP
            </div>
          )}
        </div>

        {showProminentCTA && (
          <div className="alert alert-info mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Get started with 2000 free KIP tokens!</span>
          </div>
        )}

        <p className="text-secondary-text mb-4">
          Claim your free KIP tokens to start trading in the marketplace. 
          Each wallet can claim once.
        </p>

        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="card-actions justify-end">
          <button
            onClick={handleClaim}
            disabled={loading}
            className={`btn ${showProminentCTA ? 'btn-lg' : ''} bg-main text-white hover:bg-main/90 ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <FaCoins />
                Claim 2000 KIP Tokens
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
