import { useState, useEffect, useCallback } from 'react';
import { getMarketplaceListings } from '../utils/api';
import { useCache } from '../contexts/CacheContext';

/**
 * Custom hook for managing marketplace asset data with pagination and caching.
 * 
 * This hook provides comprehensive marketplace data management including fetching,
 * pagination, refresh capabilities, and offline support through CacheContext.
 * It handles loading states, error scenarios, and implements intelligent caching
 * to provide a smooth user experience even with poor network connectivity.
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.pageSize - Number of items per page (default: 20)
 * @param {boolean} options.autoFetch - Whether to fetch on mount (default: true)
 * @returns {Object} Assets state and control functions
 */
export const useAssets = (options = {}) => {
  const { pageSize = 20, autoFetch = true } = options;
  const { getCached, setCache, TTL } = useCache();

  const [assets, setAssets] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const CACHE_KEY = 'marketplace_assets';
  const CACHE_DURATION = TTL.MEDIUM; // 5 minutes

  /**
   * Fetch assets from API or cache
   * @param {boolean} forceRefresh - Force fetch from API, bypassing cache
   * @returns {Promise<Array>} Array of assets
   */
  const fetchAssetsFromSource = useCallback(async (forceRefresh = false) => {
    // Try cache first unless force refresh
    if (!forceRefresh) {
      try {
        const cachedAssets = await getCached(CACHE_KEY);
        if (cachedAssets !== null && Array.isArray(cachedAssets)) {
          return cachedAssets;
        }
      } catch (cacheError) {
        console.warn('Cache read error:', cacheError);
        // Continue to fetch from API
      }
    }

    // Fetch from API
    const fetchedAssets = await getMarketplaceListings();
    
    // Cache the results
    await setCache(CACHE_KEY, fetchedAssets, CACHE_DURATION);
    
    return fetchedAssets;
  }, [getCached, setCache, CACHE_KEY, CACHE_DURATION]);

  /**
   * Fetch marketplace assets with pagination support
   * @param {boolean} forceRefresh - Force fetch from API, bypassing cache
   */
  const fetchAssets = useCallback(async (forceRefresh = false) => {
    if (loading && !forceRefresh) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedAssets = await fetchAssetsFromSource(forceRefresh);
      
      // Store all assets
      setAllAssets(fetchedAssets);
      
      // Set initial page of assets
      const initialAssets = fetchedAssets.slice(0, pageSize);
      setAssets(initialAssets);
      
      // Check if there are more assets
      setHasMore(fetchedAssets.length > pageSize);
      setPage(1);
    } catch (err) {
      console.error('Failed to fetch assets:', err);
      setError(err.message || 'Failed to fetch assets');
      
      // Try to load from cache on error
      try {
        const cachedAssets = await getCached(CACHE_KEY);
        if (cachedAssets !== null && Array.isArray(cachedAssets)) {
          setAllAssets(cachedAssets);
          const initialAssets = cachedAssets.slice(0, pageSize);
          setAssets(initialAssets);
          setHasMore(cachedAssets.length > pageSize);
          setPage(1);
        }
      } catch (cacheError) {
        console.warn('Failed to load from cache:', cacheError);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, fetchAssetsFromSource, getCached, pageSize, CACHE_KEY]);

  /**
   * Load more assets (pagination)
   * Loads the next page of assets from the already fetched data
   */
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * pageSize;
    
    const newAssets = allAssets.slice(startIndex, endIndex);
    setAssets(newAssets);
    setPage(nextPage);
    
    // Check if there are more assets to load
    setHasMore(endIndex < allAssets.length);
  }, [hasMore, loading, page, pageSize, allAssets]);

  /**
   * Refresh assets (pull-to-refresh)
   * Forces a fresh fetch from the API and clears cache
   */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      await fetchAssets(true); // Force refresh
    } catch (err) {
      console.error('Failed to refresh assets:', err);
      setError(err.message || 'Failed to refresh assets');
    } finally {
      setRefreshing(false);
    }
  }, [fetchAssets]);

  /**
   * Search/filter assets locally
   * @param {string} query - Search query
   * @returns {Array} Filtered assets
   */
  const searchAssets = useCallback((query) => {
    if (!query || query.trim() === '') {
      return allAssets;
    }

    const lowerQuery = query.toLowerCase();
    return allAssets.filter(asset => {
      const title = asset.title?.toLowerCase() || '';
      const description = asset.description?.toLowerCase() || '';
      const owner = asset.owner?.toLowerCase() || '';
      
      return title.includes(lowerQuery) || 
             description.includes(lowerQuery) || 
             owner.includes(lowerQuery);
    });
  }, [allAssets]);

  /**
   * Filter assets by criteria
   * @param {Function} filterFn - Filter function
   * @returns {Array} Filtered assets
   */
  const filterAssets = useCallback((filterFn) => {
    return allAssets.filter(filterFn);
  }, [allAssets]);

  /**
   * Sort assets
   * @param {Function} sortFn - Sort comparison function
   * @returns {Array} Sorted assets
   */
  const sortAssets = useCallback((sortFn) => {
    const sorted = [...allAssets].sort(sortFn);
    setAllAssets(sorted);
    
    // Update displayed assets
    const displayedAssets = sorted.slice(0, page * pageSize);
    setAssets(displayedAssets);
    
    return sorted;
  }, [allAssets, page, pageSize]);

  /**
   * Get asset by ID
   * @param {string} assetId - Asset ID
   * @returns {Object|null} Asset object or null
   */
  const getAssetById = useCallback((assetId) => {
    return allAssets.find(asset => asset.id === assetId || asset._id === assetId) || null;
  }, [allAssets]);

  /**
   * Reset pagination and filters
   */
  const reset = useCallback(() => {
    setPage(1);
    const initialAssets = allAssets.slice(0, pageSize);
    setAssets(initialAssets);
    setHasMore(allAssets.length > pageSize);
  }, [allAssets, pageSize]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchAssets();
    }
  }, [autoFetch]); // Only run on mount

  return {
    // Data
    assets,
    allAssets,
    
    // State
    loading,
    refreshing,
    error,
    hasMore,
    page,
    
    // Actions
    fetchAssets,
    loadMore,
    refresh,
    searchAssets,
    filterAssets,
    sortAssets,
    getAssetById,
    reset,
    
    // Metadata
    totalCount: allAssets.length,
    displayedCount: assets.length,
  };
};
