'use client';
import { useState } from 'react';
import { FaUpload, FaSpinner, FaCheck, FaExclamationTriangle, FaWallet } from 'react-icons/fa';
import { storyProtocolService, validateMetadata, formatMetadataForStoryProtocol } from '@/utils/storyProtocol';
import { useWallet } from '@/hooks/useWallet';

export default function RegisterIP() {
  const { account, isConnected, isConnecting, error: walletError, connectWallet } = useWallet();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');
  const [transactionResult, setTransactionResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };



  const validateForm = () => {
    const metadata = formatMetadataForStoryProtocol(formData);
    const errors = validateMetadata(metadata);
    
    if (errors.length > 0) {
      setError(errors[0]);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setStatus('loading');
    
    try {
      // Check wallet connection
      if (!isConnected || !account) {
        setError('Please connect your wallet first');
        setStatus('error');
        return;
      }

      // Format metadata for Story Protocol
      const metadata = formatMetadataForStoryProtocol(formData);
      
      // Create NFT and register IP atomically
      const result = await storyProtocolService.createAndRegisterIP(metadata, account);
      
      setTransactionResult(result);
      setStatus('success');
      
    } catch (err) {
      setError(err.message || 'Failed to create NFT/IP');
      setStatus('error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: null
    });
    setImagePreview(null);
    setStatus('idle');
    setError('');
    setTransactionResult(null);
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Create NFT & Register IP</h1>
            <p className="text-base-content/70">
              Mint your NFT and register it as intellectual property in one atomic transaction
            </p>
          </div>

          {/* Wallet Connection */}
          {!isConnected && (
            <div className="card bg-base-100 shadow-xl mb-6">
              <div className="card-body text-center">
                <h2 className="card-title justify-center mb-4">
                  <FaWallet className="mr-2" />
                  Connect Your Wallet
                </h2>
                <p className="text-base-content/70 mb-4">
                  You need to connect your wallet to create NFTs and register IP
                </p>
                {walletError && (
                  <div className="alert alert-error mb-4">
                    <FaExclamationTriangle />
                    <span>{walletError}</span>
                  </div>
                )}
                <button
                  onClick={connectWallet}
                  className={`btn btn-primary ${isConnecting ? 'loading' : ''}`}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </div>
            </div>
          )}

          {isConnected && (
            <div className="alert alert-success mb-6">
              <FaCheck />
              <span>Wallet connected: {account?.slice(0, 6)}...{account?.slice(-4)}</span>
            </div>
          )}

          {status === 'success' && transactionResult ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-success text-6xl mb-4">
                  <FaCheck className="mx-auto" />
                </div>
                <h2 className="card-title justify-center text-2xl mb-4">
                  NFT/IP Created Successfully!
                </h2>
                <div className="space-y-2 text-left">
                  <p><strong>Transaction Hash:</strong> 
                    <a href={`https://etherscan.io/tx/${transactionResult.transactionHash}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="link link-primary ml-2">
                      {transactionResult.transactionHash}
                    </a>
                  </p>
                  <p><strong>NFT ID:</strong> {transactionResult.nftId}</p>
                  <p><strong>IP ID:</strong> {transactionResult.ipId}</p>
                </div>
                <div className="card-actions justify-center mt-6">
                  <button onClick={resetForm} className="btn btn-primary">
                    Create Another
                  </button>
                  <a href="/profile" className="btn btn-outline">
                    View Portfolio
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className={`card bg-base-100 shadow-xl ${!isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Title *</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter NFT title"
                      className="input input-bordered w-full"
                      disabled={status === 'loading'}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Description *</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your NFT and intellectual property"
                      className="textarea textarea-bordered h-24"
                      disabled={status === 'loading'}
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Image *</span>
                    </label>
                    <div className="flex flex-col items-center">
                      {imagePreview ? (
                        <div className="relative mb-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-48 h-48 object-cover rounded-lg border-2 border-base-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, image: null }));
                            }}
                            className="btn btn-sm btn-circle btn-error absolute -top-2 -right-2"
                            disabled={status === 'loading'}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="w-48 h-48 border-2 border-dashed border-base-300 rounded-lg flex items-center justify-center mb-4">
                          <div className="text-center">
                            <FaUpload className="mx-auto text-4xl text-base-content/50 mb-2" />
                            <p className="text-base-content/70">Upload Image</p>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input file-input-bordered w-full max-w-xs"
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="alert alert-error">
                      <FaExclamationTriangle />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="form-control">
                    <button
                      type="submit"
                      className={`btn btn-primary btn-lg w-full ${status === 'loading' ? 'loading' : ''}`}
                      disabled={status === 'loading' || !isConnected}
                    >
                      {status === 'loading' ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Creating NFT/IP...
                        </>
                      ) : (
                        'Create NFT & Register IP'
                      )}
                    </button>
                  </div>

                  {status === 'loading' && (
                    <div className="text-center">
                      <p className="text-base-content/70">
                        Please wait while we mint your NFT and register it as IP...
                      </p>
                      <progress className="progress progress-primary w-full mt-2"></progress>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
