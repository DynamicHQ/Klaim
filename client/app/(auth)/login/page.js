'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaWallet } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { isMetaMaskInstalled } from '@/utils/wallet';

export default function Login() {
  const router = useRouter();
  const { wallet, connectWallet, login } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }
      
      await connectWallet();
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogin = async () => {
    if (!wallet) {
      setError('Please connect your wallet first');
      return;
    }
    
    setIsLoggingIn(true);
    setError(null);
    
    try {
      await login();
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide helpful error messages
      if (error.message.includes('not found') || error.message.includes('sign up')) {
        setError('Account not found. Please sign up first.');
      } else {
        setError(error.message || 'Failed to login');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-2 gap-6">
        <div className="card bg-base-100 shadow-xl w-full max-w-md">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
            
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {isLoggingIn && (
              <div className="alert alert-info mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Please check your wallet to sign the message...</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Wallet Connection</span>
                </label>
                {wallet ? (
                  <div className="alert alert-success">
                    <FaWallet />
                    <span>Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleConnectWallet}
                    type="button"
                    className={`btn btn-outline w-full ${isConnecting ? 'loading' : ''}`}
                    disabled={isConnecting}
                  >
                    {!isConnecting && <FaWallet className="w-4 h-4 mr-2" />}
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
              </div>

              <button 
                onClick={handleLogin}
                className={`btn btn-primary w-full ${isLoggingIn ? 'loading' : ''}`}
                disabled={!wallet || isLoggingIn}
              >
                {isLoggingIn ? 'Logging in...' : 'Login with Wallet'}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-base-content/70">
                Don&apos;t have an account?
                <a href="/signup" className="link link-primary font-semibold">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}