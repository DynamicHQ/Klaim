'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSpinner, FaWallet, FaUpload, FaDownload, FaPaperPlane } from 'react-icons/fa';
import { useWallet } from '@/hooks/useWallet';
import { getUserIPs, listOnMarketplace, transferIPOwnership } from '@/utils/api';
import { transferIP } from '@/utils/wallet';
import AuthGate from '@/components/AuthGate';
import TokenFaucet from '@/components/TokenFaucet';

function Profile() {
  const router = useRouter();
  const { account: address, isConnected } = useWallet();
  
  const [myNFTs, setMyNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listingNFT, setListingNFT] = useState(null);
  const [listPrice, setListPrice] = useState('');
  const [transferNFT, setTransferNFT] = useState(null);
  const [transferAddress, setTransferAddress] = useState('');

  useEffect(() => {
    if (address) {
      fetchMyNFTs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

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

  const handleListNFT = async () => {
    if (!listingNFT || !listPrice) return;

    try {
      setLoading(true);
      await listOnMarketplace(listingNFT._id, parseFloat(listPrice));
      
      // Update the NFT status locally
      setMyNFTs(prev => prev.map(nft => 
        nft._id === listingNFT._id 
          ? { ...nft, isListed: true, price: parseFloat(listPrice) }
          : nft
      ));
      
      setListingNFT(null);
      setListPrice('');
      alert('NFT listed successfully!');
    } catch (error) {
      console.error('Error listing NFT:', error);
      alert('Failed to list NFT: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferNFT = async () => {
    if (!transferNFT || !transferAddress) return;

    try {
      setLoading(true);
      
      // Call the transfer function
      await transferIPOwnership(transferNFT._id, transferAddress);
      
      // Remove the NFT from the local list since it's been transferred
      setMyNFTs(prev => prev.filter(nft => nft._id !== transferNFT._id));
      
      setTransferNFT(null);
      setTransferAddress('');
      alert('NFT transferred successfully!');
    } catch (error) {
      console.error('Error transferring NFT:', error);
      alert('Failed to transfer NFT: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSuccess = (response) => {
    console.log('Tokens claimed successfully:', response);
    // Optionally refresh NFTs or show a success message
  };

  if (!address || !isConnected) {
    return (
      <div className="min-h-screen bg-base-200 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold mb-4">Wallet Not Connected</h2>
            <p className="text-base-content/70 mb-8">
              Please connect your wallet to view your profile and manage your IP assets.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => router.push('/')}
                className="btn btn-outline"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-base-200 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-base-content/70">
              Manage your IP assets and marketplace listings
            </p>
          </div>

          {/* Token Faucet Component */}
          {address && (
            <div className="mb-8">
              <TokenFaucet 
                walletAddress={address} 
                onClaimSuccess={handleClaimSuccess}
              />
            </div>
          )}

          {/* My NFTs Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h2 className="card-title text-2xl">
                  <FaWallet className="mr-2" />
                  My IP Assets
                </h2>
                <button 
                  onClick={() => router.push('/create')}
                  className="btn btn-primary"
                >
                  <FaUpload className="mr-2" />
                  Create New IP
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
                  <p>Loading your IP assets...</p>
                </div>
              ) : myNFTs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myNFTs.map((nft) => (
                    <div key={nft._id} className="card bg-base-200 shadow-md">
                      <figure className="relative h-48">
                        <Image
                          src={nft.image_url}
                          alt={nft.name}
                          fill
                          className="object-cover"
                        />
                        {nft.isListed && (
                          <div className="absolute top-2 right-2">
                            <div className="badge badge-success">Listed</div>
                          </div>
                        )}
                      </figure>
                      <div className="card-body p-4">
                        <h3 className="card-title text-lg">{nft.name}</h3>
                        <p className="text-sm text-base-content/70 line-clamp-2">
                          {nft.description}
                        </p>
                        {nft.isListed && (
                          <p className="text-primary font-bold">
                            Listed for: {nft.price} KIP
                          </p>
                        )}
                        <div className="card-actions justify-end mt-4">
                          {!nft.isListed && (
                            <>
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => setListingNFT(nft)}
                              >
                                List for Sale
                              </button>
                              <button 
                                className="btn btn-sm btn-outline"
                                onClick={() => setTransferNFT(nft)}
                              >
                                <FaPaperPlane className="mr-1" />
                                Transfer
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="text-2xl font-bold mb-2">No IP Assets Yet</h3>
                  <p className="text-base-content/70 mb-6">
                    Create your first IP asset to get started
                  </p>
                  <button 
                    onClick={() => router.push('/create')}
                    className="btn btn-primary"
                  >
                    <FaUpload className="mr-2" />
                    Create Your First IP
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* List NFT Modal */}
          {listingNFT && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">List NFT for Sale</h3>
                <div className="mb-4">
                  <p className="mb-2"><strong>NFT:</strong> {listingNFT.name}</p>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Price (KIP)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                      className="input input-bordered"
                      placeholder="Enter price in KIP"
                    />
                  </div>
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
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    onClick={handleListNFT}
                    disabled={!listPrice || loading}
                  >
                    List NFT
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transfer NFT Modal */}
          {transferNFT && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Transfer NFT</h3>
                <div className="mb-4">
                  <p className="mb-2"><strong>NFT:</strong> {transferNFT.name}</p>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Recipient Address</span>
                    </label>
                    <input
                      type="text"
                      value={transferAddress}
                      onChange={(e) => setTransferAddress(e.target.value)}
                      className="input input-bordered"
                      placeholder="0x..."
                    />
                  </div>
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
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    onClick={handleTransferNFT}
                    disabled={!transferAddress || loading}
                  >
                    Transfer NFT
                  </button>
                </div>
              </div>
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