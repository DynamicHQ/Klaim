'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

// Mock data for demonstration (replace with actual API call)
const mockProducts = [
    {
      id: 1,
      name: "Digital Art Masterpiece",
      description: "A stunning digital artwork featuring abstract patterns and vibrant colors that represent the fusion of technology and creativity.",
      price: 0.5,
      image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop"
    },
    {
      id: 2,
      name: "Cyberpunk Portrait",
      description: "Futuristic portrait with neon lighting and cyberpunk aesthetics.",
      price: 1.2,
      image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=500&fit=crop"
    },
    {
      id: 3,
      name: "Abstract Geometry",
      description: "Mathematical beauty expressed through geometric forms and color theory.",
      price: 0.8,
      image_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=700&fit=crop"
    },
    {
      id: 4,
      name: "Nature's Symphony",
      description: "Digital interpretation of natural landscapes with ethereal lighting.",
      price: 2.1,
      image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=550&fit=crop"
    },
    {
      id: 5,
      name: "Urban Dreams",
      description: "City skylines reimagined through artistic vision and digital manipulation.",
      price: 1.5,
      image_url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop"
    },
    {
      id: 6,
      name: "Cosmic Journey",
      description: "Space exploration themes with nebulas and stellar formations.",
      price: 3.0,
      image_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=650&fit=crop"
    }
  ];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Simulate API call
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // TODO: Replace with actual API call
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setError(null);
      } catch (err) {
        setError('Failed to load marketplace products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
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
      <div className="min-h-screen bg-base-200 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <FaExclamationTriangle className="text-4xl text-error mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Marketplace</h2>
            <p className="text-base-content/70 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">NFT Marketplace</h1>
          <p className="text-base-content/70">
            Discover and collect unique digital assets and intellectual property
          </p>
        </div>

        {/* Search and Filter Bar */}
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
          <button className="btn btn-outline">
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-base-content/70">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
          </p>
        </div>

        {/* Pinterest-style Grid */}
        {filteredProducts.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="break-inside-avoid mb-4">
                <div 
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Product Image */}
                  <figure className="relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x600/374151/9CA3AF?text=No+Image';
                      }}
                    />
                    {/* Price Badge */}
                    <div className="absolute top-2 right-2">
                      <div className="badge badge-primary badge-lg font-bold">
                        {product.price} ETH
                      </div>
                    </div>
                  </figure>
                  
                  {/* Card Body */}
                  <div className="card-body p-4">
                    <h3 className="card-title text-lg font-bold line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {/* Action Buttons */}
                    <div className="card-actions justify-between items-center mt-4">
                      <div className="text-lg font-bold text-primary">
                        {product.price} ETH
                      </div>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Buy clicked:', product);
                        }}
                      >
                        Buy Now
                      </button>
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
              Try adjusting your search terms or browse all items
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="btn btn-primary mt-4"
            >
              Show All Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
}