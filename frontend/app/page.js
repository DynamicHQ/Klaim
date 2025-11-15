'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaWallet, FaCheck, FaStore, FaPlus } from 'react-icons/fa';
import { connectWallet, getConnectedWallet, initializeStorage } from '@/utils/mockData';

export default function Home() {
  const router = useRouter();
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    initializeStorage();
    setWallet(getConnectedWallet());
  }, []);

  const handleConnectWallet = () => {
    const newWallet = connectWallet();
    setWallet(newWallet);
    alert('Wallet connected successfully!');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to <span className="text-primary">Klaim</span>
            </h1>
            <p className="text-lg mb-8 text-base-content/70">
              Create, trade, and manage NFTs on the blockchain. Join our community of creators and collectors today!
            </p>
            
            {wallet ? (
              <div className="flex flex-col gap-4">
                <div className="alert alert-success">
                  <FaCheck />
                  <span>Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
                </div>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => router.push('/create')} 
                    className="btn btn-primary btn-lg"
                  >
                    <FaPlus />
                    Create NFT
                  </button>
                  <button 
                    onClick={() => router.push('/marketplace')} 
                    className="btn btn-outline btn-lg"
                  >
                    <FaStore />
                    Marketplace
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-4">
                <button 
                  onClick={handleConnectWallet} 
                  className="btn btn-primary btn-lg"
                >
                  <FaWallet />
                  Connect Wallet
                </button>
                <button 
                  onClick={() => router.push('/marketplace')} 
                  className="btn btn-outline btn-lg"
                >
                  <FaStore />
                  Browse Marketplace
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Klaim?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="card-title justify-center">Easy Creation</h3>
                <p>Upload your art and create NFTs with just a few clicks</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="card-title justify-center">Secure Trading</h3>
                <p>Trade with confidence using blockchain technology</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="card-title justify-center">Global Community</h3>
                <p>Connect with creators and collectors worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}