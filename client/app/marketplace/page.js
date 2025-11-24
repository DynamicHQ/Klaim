'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSearch, FaSpinner, FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useWallet } from '@/hooks/useWallet';
import { getMarketplaceListings, purchaseIP } from '@/utils/api';
import { useTransactionSecurity } from '@/hooks/useTransactionSecurity';
import TransactionVerificationModal from '@/components/TransactionVerificationModal';
import SecurityTooltip from '@/components/SecurityTooltip';

/**
 * Secure Marketplace Component with Transaction Verification
 * 
 * This component provides a comprehensive marketplace interface for browsing and
 * purchasing IP assets with integrated security features. It implements mandatory
 * message signing for all purchase transactions to prevent bot attacks, real-time
 * search functionality, and detailed product viewing with modal interfaces. The
 * component features secure transaction processing with step-by-step verification,
 * comprehensive error handling, and automatic balance refresh upon successful purchases.
 */
export default function Marketplace() {
  const router = useRouter();
  const { account: address, isConnected } = useWallet();
  const { executeSecureTransaction, isVerifying, stepMessage, verificationStep, currentVerification } = useTransactionSecurity();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Marketplace listings fetcher with comprehensive error handling.
   * 
   * This function retrieves all available marketplace listings from the API
   * with proper loading state management and error handling. It provides
   * user feedback during the loading process and handles various failure
   * scenarios with appropriate error messages and retry capabilities.
   */
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const items = await getMarketplaceListings();
      setProducts(items);
      setFilteredProducts(items);
    } catch (err) {
      setError('Failed to fetch marketplace items. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Product selection handler for modal display
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  /**
   * Secure purchase handler with mandatory transaction verification.
   * 
   * This function implements the complete secure purchase workflow including
   * wallet connection validation, transaction security verification through
   * message signing, and the actual purchase execution. It integrates with
   * the transaction security system to prevent bot attacks while providing
   * comprehensive user feedback throughout the verification and purchase process.
   */
  const handleBuyNow = async (product) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const transactionOptions = {
        type: 'purchase',
        assetId: product._id,
        price: product.price,
        listingId: product.listingId
      };

      const result = await executeSecureTransaction(
        transactionOptions,
        async () => {
          return await purchaseIP(product.listingId, address);
        }
      );

      if (result.success) {
        alert('Purchase successful! Check "My IPs" to see your collection.');
        setSelectedProduct(null);
        router.push('/profile');
      }
    } catch (err) {
      console.error('Purchase failed:', err);
      alert(`Purchase failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
            <p className="text-lg">Loading marketplace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
        <div className="text-center text-error">
          <h2 className="text-2xl font-bold mb-4">An Error Occurred</h2>
          <p>{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary mt-4">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <title>Klaim | Marketplace</title>
      <div className="container mx-auto px-4 py-8">
        {/* Transaction Verification Status */}
        {stepMessage && (
          <div className={`alert mb-6 ${
            stepMessage.type === 'success' ? 'alert-success' : 
            stepMessage.type === 'error' ? 'alert-error' : 
            stepMessage.type === 'warning' ? 'alert-warning' : 'alert-info'
          }`}>
            <div className="flex items-center gap-2">
              {stepMessage.type === 'success' && <FaCheckCircle className="w-5 h-5" />}
              {stepMessage.type === 'error' && <FaExclamationTriangle className="w-5 h-5" />}
              {stepMessage.type === 'warning' && <FaShieldAlt className="w-5 h-5" />}
              {stepMessage.type === 'info' && <FaSpinner className="animate-spin w-5 h-5" />}
              <div>
                <h3 className="font-bold">{stepMessage.title}</h3>
                <p className="text-sm">{stepMessage.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">NFT Marketplace</h1>
          <p className="text-base-content/70">
            Discover and collect unique digital assets
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-base-content/70">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="break-inside-avoid mb-4">
                <div 
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleProductClick(product)}
                >
                  <figure className="relative overflow-hidden h-64">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="badge badge-primary badge-lg font-bold">
                        {product.price} KIP
                      </div>
                    </div>
                  </figure>
                  
                  <div className="card-body p-4">
                    <h3 className="card-title text-lg font-bold line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="card-actions justify-between items-center mt-4">
                      <div className="text-lg font-bold text-primary">
                        {product.price} KIP
                      </div>
                      <SecurityTooltip content="Secure purchase with wallet verification to prevent bot attacks">
                        <button 
                          className={`btn btn-primary btn-sm ${isVerifying ? 'loading' : ''}`}
                          disabled={isVerifying}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNow(product);
                          }}
                          aria-label={`Buy ${product.name} for ${product.price} KIP with secure verification`}
                        >
                          {isVerifying ? (
                            <>
                              <FaSpinner className="animate-spin w-3 h-3 mr-1" aria-hidden="true" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <FaShieldAlt className="w-3 h-3 mr-1" aria-hidden="true" />
                              Buy Now
                            </>
                          )}
                        </button>
                      </SecurityTooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No items found</h3>
            <p className="text-base-content/70">
              No items are currently listed on the marketplace
            </p>
          </div>
        )}

        {selectedProduct && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-2xl mb-4">{selectedProduct.name}</h3>
              <div className="relative w-full h-96 mb-4">
                <Image
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <p className="mb-4">{selectedProduct.description}</p>
              <p className="mb-2"><strong>Created by:</strong> {selectedProduct.creator}</p>
              <p className="mb-4"><strong>Price:</strong> {selectedProduct.price} KIP</p>
              
              <div className="modal-action">
                <button className="btn" onClick={() => setSelectedProduct(null)}>Close</button>
                <SecurityTooltip content="Secure purchase with wallet verification to prevent bot attacks">
                  <button 
                    className={`btn btn-primary ${isVerifying ? 'loading' : ''}`}
                    disabled={isVerifying}
                    onClick={() => handleBuyNow(selectedProduct)}
                  >
                    {isVerifying ? (
                      <>
                        <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <FaShieldAlt className="w-4 h-4 mr-2" />
                        Buy Now
                      </>
                    )}
                  </button>
                </SecurityTooltip>
              </div>
            </div>
            <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}></div>
          </div>
        )}

        {/* Transaction Verification Modal */}
        <TransactionVerificationModal
          isOpen={isVerifying}
          onClose={() => {}} // Will be handled by the modal itself when transaction completes
          stepMessage={stepMessage}
          verificationStep={verificationStep}
          currentVerification={currentVerification}
        />
      </div>
    </div>
  );
}