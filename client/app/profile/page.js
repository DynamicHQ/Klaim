'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import Image from 'next/image';
import { FaSpinner, FaWallet, FaUpload, FaDownload, FaPaperPlane } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import { getUserIPs, listOnMarketplace, transferIPOwnership } from '@/utils/api';
import { transferIP } from '@/utils/wallet';
import AuthGate from '@/components/AuthGate';
=======
import { FaSpinner, FaWallet, FaUpload, FaDownload } from 'react-icons/fa';
import { getMyNFTs, listNFTOnMarketplace, getConnectedWallet, initializeStorage } from '@/utils/mockData';
import TokenFaucet from '@/components/TokenFaucet';
import { useWallet } from '@/hooks/useWallet';
>>>>>>> 0844788e83e739f1c56a49cfcf73347ed3ee11d4

function Profile() {
  const router = useRouter();
<<<<<<< HEAD
  const { address, isConnected } = useAccount();
  
=======
  const { account: walletAddress, isConnected } = useWallet();
>>>>>>> 0844788e83e739f1c56a49cfcf73347ed3ee11d4
  const [myNFTs, setMyNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listingNFT, setListingNFT] = useState(null);
  const [listPrice, setListPrice] = useState('');
<<<<<<< HEAD
  const [transferNFT, setTransferNFT] = useState(null);
  const [transferAddress, setTransferAddress] = useState('');

  useEffect(() => {
    if (address) {
      fetchMyNFTs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
=======

  useEffect(() => {
    initializeStorage();
    if (walletAddress) {
      fetchMyNFTs();
    }
  }, [walletAddress]);
>>>>>>> 0844788e83e739f1c56a49cfcf73347ed3ee11d4

  const fetchMyNFTs = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const nfts = await getUserIPs(address);
      setMyNFTs(nfts);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleListOnMarketplace = (nft) => {
    setListingNFT(nft);
  };

  const confirmListing = async () => {
    if (!listPrice || parseFloat(listPrice) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      await listOnMarketplace(
        listingNFT.contractAddress || 'default-contract',
        listingNFT.tokenId || listingNFT._id,
        listPrice,
        address
      );
      alert('Successfully listed on marketplace!');
      setListingNFT(null);
      setListPrice('');
      fetchMyNFTs();
    } catch (error) {
      console.error('Listing error:', error);
      alert('Failed to list on marketplace: ' + error.message);
    }
  };

  const handleTransfer = (nft) => {
    setTransferNFT(nft);
  };

  const confirmTransfer = async () => {
    if (!transferAddress || !transferAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    try {
      // First, transfer on blockchain if contract address exists
      if (transferNFT.contractAddress && transferNFT.tokenId) {
        await transferIP(transferNFT.contractAddress, transferNFT.tokenId, transferAddress);
      }
      
      // Then update backend
      await transferIPOwnership(transferNFT._id, address, transferAddress);
      
      alert('Successfully transferred IP!');
      setTransferNFT(null);
      setTransferAddress('');
      fetchMyNFTs();
    } catch (error) {
      console.error('Transfer error:', error);
      alert('Failed to transfer IP: ' + error.message);
    }
  };

  const handleDownload = (nft) => {
    if (nft.image_url) {
      window.open(nft.image_url, '_blank');
    } else {
      alert('No file available for download');
    }
  };

<<<<<<< HEAD
  if (!isConnected) {
=======
  const handleClaimSuccess = (response) => {
    console.log('Tokens claimed successfully:', response);
    // Optionally refresh NFTs or show a success message
  };

  if (!walletAddress || !isConnected) {
>>>>>>> 0844788e83e739f1c56a49cfcf73347ed3ee11d4
    return (
      <div className="min-h-screen bg-base-200 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
            <div className="card-body text-center">
              <FaWallet className="text-6xl text-primary mx-auto mb-4" />
              <h2 className="card-title justify-center text-2xl mb-4">Connect Your Wallet</h2>
              <p className="text-base-content/70 mb-4">
                Connect your wallet to view your NFT collection
              </p>
              <button onClick={() => router.push('/')} className="btn btn-primary">
                Go to Home
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
            <p className="text-lg">Loading your NFTs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <AuthGate>
      <div className="min-h-screen bg-base-200 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">My NFTs</h1>
            <p className="text-base-content/70">
              Your NFT collection
            </p>
            <p className="text-sm text-base-content/50 mt-2">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
=======
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">My NFTs</h1>
          <p className="text-base-content/70">
            Your NFT collection
          </p>
          <p className="text-sm text-base-content/50 mt-2">
            Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </p>
        </div>
>>>>>>> 0844788e83e739f1c56a49cfcf73347ed3ee11d4

        {/* Token Faucet Component */}
        {walletAddress && (
          <div className="max-w-2xl mx-auto mb-8">
            <TokenFaucet 
              walletAddress={walletAddress} 
              onClaimSuccess={handleClaimSuccess}
            />
          </div>
        )}

        {myNFTs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myNFTs.map((nft) => (
              <div key={nft.id} className="card bg-base-100 shadow-xl">
                <figure className="relative h-48">
                  <Image
                    src={nft.image_url || 'https://via.placeholder.com/400x300/374151/9CA3AF?text=No+Image'}
                    alt={nft.name}
                    fill
                    className="object-cover"
                  />
                </figure>
                
                <div className="card-body p-4">
                  <h3 className="card-title text-lg line-clamp-1">
                    {nft.name}
                  </h3>
                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {nft.description}
                  </p>
                  
                  <div className="card-actions justify-end mt-4 flex-wrap gap-2">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleDownload(nft)}
                    >
                      <FaDownload className="mr-1" />
                      Download
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleTransfer(nft)}
                    >
                      <FaPaperPlane className="mr-1" />
                      Transfer
                    </button>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleListOnMarketplace(nft)}
                    >
                      <FaUpload className="mr-1" />
                      List
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-2">No NFTs Yet</h3>
            <p className="text-base-content/70 mb-4">
              Create your first NFT or purchase from the marketplace
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/create" className="btn btn-primary">
                Create NFT
              </a>
              <a href="/marketplace" className="btn btn-outline">
                Browse Marketplace
              </a>
            </div>
          </div>
        )}

        {listingNFT && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-xl mb-4">List on Marketplace</h3>
              <p className="mb-4">
                List <strong>{listingNFT.name}</strong> for sale
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
                  step="0.1"
                />
              </div>
              
              <div className="modal-action">
                <button 
                  className="btn"
                  onClick={() => {
                    setListingNFT(null);
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
                setListingNFT(null);
                setListPrice('');
              }}
            ></div>
          </div>
        )}

        {transferNFT && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-xl mb-4">Transfer IP</h3>
              <p className="mb-4">
                Transfer <strong>{transferNFT.name}</strong> to another wallet
              </p>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Recipient Wallet Address</span>
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  className="input input-bordered"
                />
                <label className="label">
                  <span className="label-text-alt text-warning">
                    ⚠️ This action cannot be undone. Double-check the address.
                  </span>
                </label>
              </div>
              
              <div className="modal-action">
                <button 
                  className="btn"
                  onClick={() => {
                    setTransferNFT(null);
                    setTransferAddress('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={confirmTransfer}
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
            <div 
              className="modal-backdrop"
              onClick={() => {
                setTransferNFT(null);
                setTransferAddress('');
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
    </AuthGate>
  );
}

export default function ProfilePage() {
  return <Profile />;
}
