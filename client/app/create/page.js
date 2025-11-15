'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUpload, FaSpinner, FaCheck, FaWallet } from 'react-icons/fa';
import { createNFT, uploadImageToBase64, getConnectedWallet, initializeStorage } from '@/utils/mockData';

export default function CreateNFT() {
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [transactionResult, setTransactionResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    initializeStorage();
    setWallet(getConnectedWallet());
  }, []);

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
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
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
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.image) {
      setError('Image is required');
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
      if (!wallet) {
        setError('Please connect your wallet first');
        setStatus('error');
        setTimeout(() => router.push('/'), 2000);
        return;
      }

      const imageBase64 = await uploadImageToBase64(formData.image);
      
      const result = createNFT({
        name: formData.title,
        description: formData.description,
        image_url: imageBase64,
        price: 0
      });
      
      setTransactionResult({
        nftId: result.id,
        transactionHash: 'mock-tx-' + result.id
      });
      setStatus('success');
      
    } catch (err) {
      setError(err.message || 'Failed to create NFT');
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
            <h1 className="text-4xl font-bold mb-2">Create NFT</h1>
            <p className="text-base-content/70">
              Mint your NFT and add it to your collection
            </p>
          </div>

          {!wallet && (
            <div className="card bg-base-100 shadow-xl mb-6">
              <div className="card-body text-center">
                <h2 className="card-title justify-center mb-4">
                  <FaWallet className="mr-2" />
                  Connect Your Wallet
                </h2>
                <p className="text-base-content/70 mb-4">
                  You need to connect your wallet to create NFTs
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="btn btn-primary"
                >
                  Go to Home
                </button>
              </div>
            </div>
          )}

          {wallet && (
            <div className="alert alert-success mb-6">
              <FaCheck />
              <span>Wallet connected: {wallet?.slice(0, 6)}...{wallet?.slice(-4)}</span>
            </div>
          )}

          {status === 'success' && transactionResult ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-success text-6xl mb-4">
                  <FaCheck className="mx-auto" />
                </div>
                <h2 className="card-title justify-center text-2xl mb-4">
                  NFT Created Successfully!
                </h2>
                <div className="space-y-2 text-left">
                  <p><strong>NFT ID:</strong> {transactionResult.nftId}</p>
                  <p><strong>Transaction:</strong> {transactionResult.transactionHash}</p>
                </div>
                <div className="card-actions justify-center mt-6">
                  <button onClick={resetForm} className="btn btn-primary">
                    Create Another
                  </button>
                  <button onClick={() => router.push('/profile')} className="btn btn-outline">
                    View My NFTs
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`card bg-base-100 shadow-xl ${!wallet ? 'opacity-50 pointer-events-none' : ''}`}>
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
                      placeholder="Enter NFT title"
                      className="input input-bordered w-full"
                      disabled={status === 'loading'}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Description *</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your NFT"
                      className="textarea textarea-bordered h-24"
                      disabled={status === 'loading'}
                      required
                    />
                  </div>

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

                  {error && (
                    <div className="alert alert-error">
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="form-control">
                    <button
                      type="submit"
                      className={`btn btn-primary btn-lg w-full ${status === 'loading' ? 'loading' : ''}`}
                      disabled={status === 'loading' || !wallet}
                    >
                      {status === 'loading' ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Creating NFT...
                        </>
                      ) : (
                        'Create NFT'
                      )}
                    </button>
                  </div>

                  {status === 'loading' && (
                    <div className="text-center">
                      <p className="text-base-content/70">
                        Please wait while we create your NFT...
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
