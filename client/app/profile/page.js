'use client';

import { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationTriangle, FaWallet, FaUpload, FaDownload } from 'react-icons/fa';
import { getUserIPs, listOnMarketplace } from '@/utils/api';
import { useWallet } from '@/hooks/useWallet';

export default function Profile() {
  const { account, isConnected, connectWallet } = useWallet();
  const [myIPs, setMyIPs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listingIP, setListingIP] = useState(null);
  const [listPrice, setListPrice] = useState('');

  useEffect(() => {
    if (isConnected && account) {
      fetchMyIPs();
    }
  }, [isConnected, account]);

  const fetchMyIPs = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const ips = await getUserIPs(account);
      setMyIPs(ips);
      setError(null);
    } catch (err) {
      setError('Failed to load your IPs');
      console.error('Error fetching IPs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleListOnMarketplace = async (ip) => {
    setListingIP(ip);
  };

  const confirmListing = async () => {
    if (!listPrice || parseFloat(listPrice) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      await listOnMarketplace(
        listingIP.nftContract || '0x0000000000000000000000000000000000000000',
        listingIP.tokenId || 0,
        parseFloat(listPrice),
        account
      );
      
      alert('Successfully listed on marketplace!');
      setListingIP(null);
      setListPrice('');
      fetchMyIPs();
    } catch (err) {
      console.error('Listing failed:', err);
      alert(err.message || 'Failed to list on marketplace');
    }
  };

  const handleDownload = (ip) => {
    if (ip.image_url) {
      window.open(ip.image_url, '_blank');
    } else {
      alert('No file available for download');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-base-200 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
            <div className="card-body text-center">
              <FaWallet className="text-6xl text-primary mx-auto mb-4" />
              <h2 className="card-title justify-center text-2xl mb-4">Connect Your Wallet</h2>
              <p className="text-base-content/70 mb-4">
                Connect your wallet to view your IP collection
              </p>
              <button onClick={connectWallet} className="btn btn-primary">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
            <p className="text-lg">Loading your IPs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">My IPs</h1>
          <p className="text-base-content/70">
            Your intellectual property collection
          </p>
          <p className="text-sm text-base-content/50 mt-2">
            Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-6 max-w-2xl mx-auto">
            <FaExclamationTriangle />
            <span>{error}</span>
            <button onClick={fetchMyIPs} className="btn btn-sm">Retry</button>
          </div>
        )}

        {myIPs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myIPs.map((ip) => (
              <div key={ip._id} className="card bg-base-100 shadow-xl">
                <figure className="relative">
                  <img
                    src={ip.image_url || 'https://via.placeholder.com/400x300/374151/9CA3AF?text=No+Image'}
                    alt={ip.name || ip.title}
                    className="w-full h-48 object-cover"
                  />
                  {ip.isListed && (
                    <div className="absolute top-2 right-2">
                      <div className="badge badge-success">Listed</div>
                    </div>
                  )}
                </figure>
                
                <div className="card-body p-4">
                  <h3 className="card-title text-lg line-clamp-1">
                    {ip.name || ip.title}
                  </h3>
                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {ip.description}
                  </p>
                  
                  {ip.isListed && (
                    <p className="text-primary font-bold">
                      Listed for {ip.price} IPT
                    </p>
                  )}
                  
                  <div className="card-actions justify-end mt-4">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleDownload(ip)}
                    >
                      <FaDownload className="mr-1" />
                      Download
                    </button>
                    {!ip.isListed && (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleListOnMarketplace(ip)}
                      >
                        <FaUpload className="mr-1" />
                        List
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-2">No IPs Yet</h3>
            <p className="text-base-content/70 mb-4">
              Create your first IP or purchase from the marketplace
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/create" className="btn btn-primary">
                Create IP
              </a>
              <a href="/marketplace" className="btn btn-outline">
                Browse Marketplace
              </a>
            </div>
          </div>
        )}

        {/* Listing Modal */}
        {listingIP && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-xl mb-4">List on Marketplace</h3>
              <p className="mb-4">
                List <strong>{listingIP.name || listingIP.title}</strong> for sale
              </p>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Price (IPT)</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter price in IPT tokens"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  className="input input-bordered"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="modal-action">
                <button 
                  className="btn"
                  onClick={() => {
                    setListingIP(null);
                    setListPrice('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={confirmListing}
                >
                  Confirm Listing
                </button>
              </div>
            </div>
            <div 
              className="modal-backdrop"
              onClick={() => {
                setListingIP(null);
                setListPrice('');
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
