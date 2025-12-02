'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUpload, FaSpinner, FaCheck, FaWallet } from 'react-icons/fa';
import { useWallet } from '@/hooks/useWallet';
import { storyProtocolService, formatMetadataForStoryProtocol } from '@/utils/storyProtocol';
import AuthGate from '@/components/AuthGate';

/**
 * IP Asset Creation Page Component
 * 
 * This component provides a comprehensive interface for creating intellectual property
 * assets as NFTs with Story Protocol integration. It handles the complete creation
 * workflow including file upload validation, metadata collection, IPFS storage via
 * Pinata, and blockchain registration. The component implements proper form validation,
 * error handling, and user feedback throughout the creation process while ensuring
 * wallet connectivity and authentication requirements are met.
 */
function CreateNFT() {
  const router = useRouter();
  const { account: address, isConnected } = useWallet();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [transactionResult, setTransactionResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form input handler for text fields with state updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Image file handler with validation and preview generation.
   * 
   * This function manages image file selection including file type validation,
   * size checking, and preview generation for user feedback. It implements
   * comprehensive validation to ensure only valid image files under the size
   * limit are accepted while providing clear error messages for invalid files.
   */
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

  // Form validation with comprehensive checks for required fields and wallet connection
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

  /**
   * Form submission handler with complete IP creation workflow.
   * 
   * This function orchestrates the entire IP asset creation process including
   * form validation, metadata formatting for Story Protocol, blockchain
   * transaction execution, and user feedback management. It handles the
   * complex integration between IPFS storage, NFT minting, and IP registration
   * while providing comprehensive error handling and progress tracking.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setStatus('loading');

    try {
      const metadata = formatMetadataForStoryProtocol(formData);
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

  // Form reset utility for clearing all form data and returning to initial state
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
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Create IP</h1>
              <p className="text-sm md:text-base text-base-content/70">
                Mint your Intellectual Property as an NFT and add it to your collection.
              </p>
            </div>

            {!isConnected && (
              <div className="card bg-base-100 shadow-xl mb-4 md:mb-6">
                <div className="card-body text-center p-4 md:p-6">
                  <h2 className="card-title justify-center mb-3 md:mb-4 text-lg md:text-xl">
                    <FaWallet className="mr-2" />
                    Connect Your Wallet
                  </h2>
                  <p className="text-sm md:text-base text-base-content/70 mb-3 md:mb-4">
                    You need to connect your wallet to create an IP
                  </p>
                  <p className="text-xs md:text-sm text-base-content/50">
                    Please use the wallet connector in the navigation bar.
                  </p>
                </div>
              </div>
            )}

            {isConnected && (
              <div className="alert alert-success mb-4 md:mb-6 text-sm md:text-base">
                <FaCheck className="flex-shrink-0" />
                <span className="truncate">Wallet connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
              </div>
            )}

            {status === 'success' && transactionResult ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center p-4 md:p-6">
                  <div className="text-success text-4xl md:text-6xl mb-3 md:mb-4">
                    <FaCheck className="mx-auto" />
                  </div>
                  <h2 className="card-title justify-center text-xl md:text-2xl mb-3 md:mb-4">
                    IP Created Successfully!
                  </h2>
                  <div className="space-y-2 text-left text-sm md:text-base">
                    <p className="break-all"><strong>Asset ID:</strong> {transactionResult.assetId}</p>
                    <p className="break-all"><strong>Transaction:</strong> {transactionResult.transactionHash}</p>
                  </div>
                  <div className="card-actions justify-center mt-4 md:mt-6 flex-col sm:flex-row gap-2 w-full">
                    <button onClick={resetForm} className="btn btn-primary btn-sm md:btn-md w-full sm:w-auto">
                      Create Another
                    </button>
                    <button onClick={() => router.push('/profile')} className="btn btn-outline btn-sm md:btn-md w-full sm:w-auto">
                      View My IPs
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`card bg-base-100 shadow-xl ${!isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="card-body p-4 md:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
                        <span className="label-text font-semibold text-sm md:text-base">Image *</span>
                      </label>
                      <div className="flex flex-col items-center">
                        {imagePreview ? (
                          <div className="relative mb-3 md:mb-4 w-40 h-40 sm:w-48 sm:h-48">
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
                                const fileInput = document.querySelector('input[type="file"]');
                                if (fileInput) fileInput.value = '';
                              }}
                              className="btn btn-xs sm:btn-sm btn-circle btn-error absolute -top-2 -right-2"
                              disabled={status === 'loading'}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="w-40 h-40 sm:w-48 sm:h-48 border-2 border-dashed border-base-300 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                            <div className="text-center">
                              <FaUpload className="mx-auto text-3xl md:text-4xl text-base-content/50 mb-2" />
                              <p className="text-sm md:text-base text-base-content/70">Upload Image</p>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="file-input file-input-bordered file-input-sm md:file-input-md w-full max-w-xs text-sm"
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
                        className={`btn btn-primary btn-md md:btn-lg w-full ${status === 'loading' ? 'loading' : ''}`}
                        disabled={status === 'loading' || !isConnected}
                      >
                        {status === 'loading' ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            <span className="text-sm md:text-base">Creating IP...</span>
                          </>
                        ) : (
                          <span className="text-sm md:text-base">Create IP</span>
                        )}
                      </button>
                    </div>

                    {status === 'loading' && (
                      <div className="text-center">
                        <p className="text-xs md:text-sm text-base-content/70">
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