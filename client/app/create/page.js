'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUpload, FaSpinner, FaCheck, FaWallet } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import { storyProtocolService, formatMetadataForStoryProtocol } from '@/utils/storyProtocol';
import AuthGate from '@/components/AuthGate';

function CreateNFT() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');
  const [transactionResult, setTransactionResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.image) {
      setError('Image is required');
      return false;
    }
    if (!isConnected) {
      setError('Please connect your wallet first.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setStatus('loading');

    try {
      // Format the form data for Story Protocol
      const metadata = formatMetadataForStoryProtocol(formData);
      
      // Call the single, high-level function to handle the entire process
      const finalResponse = await storyProtocolService.createAndRegisterIP(metadata, address);

      setTransactionResult({
        assetId: finalResponse.nftId || finalResponse.ipId,
        transactionHash: finalResponse.transactionHash || 'mock-tx-' + (finalResponse.nftId || finalResponse.ipId),
      });
      setStatus('success');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during creation.');
      setStatus('error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: null,
    });
    setImagePreview(null);
    setStatus('idle');
    setError('');
    setTransactionResult(null);
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-base-200 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Create IP</h1>
              <p className="text-base-content/70">
                Mint your Intellectual Property as an NFT and add it to your collection.
              </p>
            </div>

          {!isConnected && (
            <div className="card bg-base-100 shadow-xl mb-6">
              <div className="card-body text-center">
                <h2 className="card-title justify-center mb-4">
                  <FaWallet className="mr-2" />
                  Connect Your Wallet
                </h2>
                <p className="text-base-content/70 mb-4">
                  You need to connect your wallet to create an IP
                </p>
                {/* This button could trigger a wallet connection modal */}
                <p className="text-sm text-base-content/50">
                  Please use the wallet connector in the navigation bar.
                </p>
              </div>
            </div>
          )}

          {isConnected && (
            <div className="alert alert-success mb-6">
              <FaCheck />
              <span>Wallet connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
          )}

          {status === 'success' && transactionResult ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-success text-6xl mb-4">
                  <FaCheck className="mx-auto" />
                </div>
                <h2 className="card-title justify-center text-2xl mb-4">
                  IP Created Successfully!
                </h2>
                <div className="space-y-2 text-left">
                  <p><strong>Asset ID:</strong> {transactionResult.assetId}</p>
                  <p><strong>Transaction:</strong> {transactionResult.transactionHash}</p>
                </div>
                <div className="card-actions justify-center mt-6">
                  <button onClick={resetForm} className="btn btn-primary">
                    Create Another
                  </button>
                  <button onClick={() => router.push('/profile')} className="btn btn-outline">
                    View My IPs
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`card bg-base-100 shadow-xl ${!isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Title *</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter IP title"
                      className="input input-bordered w-full"
                      disabled={status === 'loading'}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Description</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your IP"
                      className="textarea textarea-bordered h-24"
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Image *</span>
                    </label>
                    <div className="flex flex-col items-center">
                      {imagePreview ? (
                        <div className="relative mb-4 w-48 h-48">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover rounded-lg border-2 border-base-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData((prev) => ({ ...prev, image: null }));
                              // Reset file input
                              const fileInput = document.querySelector('input[type="file"]');
                              if (fileInput) fileInput.value = '';
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
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-error">
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="form-control">
                    <button
                      type="submit"
                      className={`btn btn-primary btn-lg w-full ${status === 'loading' ? 'loading' : ''}`}
                      disabled={status === 'loading' || !isConnected}
                    >
                      {status === 'loading' ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Creating IP...
                        </>
                      ) : (
                        'Create IP'
                      )}
                    </button>
                  </div>

                  {status === 'loading' && (
                    <div className="text-center">
                      <p className="text-base-content/70">
                        Please wait while we create your IP... This may take a moment.
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
    </AuthGate>
  );
}

export default function CreateNFTPage() {
  return <CreateNFT />;
}
