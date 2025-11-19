'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaWallet, FaUser } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { isMetaMaskInstalled } from '@/utils/wallet';

export default function Signup() {
  const router = useRouter();
  const { wallet, connectWallet, signup } = useAuth();
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!wallet) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    setIsSigningUp(true);
    setError(null);
    
    try {
      await signup(username);
      router.push('/');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-2 gap-6">
        <div className="card bg-base-100 shadow-xl w-full max-w-md">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
            
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  <input 
                    type="text" 
                    placeholder="Enter username" 
                    className="input input-bordered w-full pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isSigningUp}
                  />
                </div>
              </div>

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
                type="submit"
                className={`btn btn-primary w-full ${isSigningUp ? 'loading' : ''}`}
                disabled={!wallet || !username.trim() || isSigningUp}
              >
                {isSigningUp ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-base-content/70">
                Already have an account?{' '}
                <a href="/login" className="link link-primary font-semibold">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}