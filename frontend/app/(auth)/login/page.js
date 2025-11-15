'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaWallet, FaUser } from 'react-icons/fa';
import { connectWallet, getConnectedWallet, initializeStorage } from '@/utils/mockData';

export default function Login() {
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    initializeStorage();
    setWallet(getConnectedWallet());
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const newWallet = connectWallet();
      setWallet(newWallet);
      
      // Simulate API call to login
      setTimeout(() => {
        alert('Login successful!');
        router.push('/');
      }, 1000);
    } catch (error) {
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }
    
    // Simulate login
    alert('Login successful!');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-2 gap-6">
        <div className="card bg-base-100 shadow-xl w-full max-w-md">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
            
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
                    <FaWallet className="w-4 h-4 mr-2" />
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
              </div>

              <button 
                type="submit"
                className="btn btn-primary w-full"
                disabled={!wallet || !username.trim()}
              >
                Login
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-base-content/70">
                Don't have an account?{' '}
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