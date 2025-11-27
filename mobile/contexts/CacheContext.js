import { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CacheContext = createContext();

// Default TTL values (in milliseconds)
const DEFAULT_TTL = {
  SHORT: 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
  INFINITE: null, // Never expires
};

export function useCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}

export function CacheProvider({ children }) {
  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
    size: 0,
  });

  /**
   * Get cached data by key
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} - Cached data or null if not found/expired
   */
  const getCached = useCallback(async (key) => {
    try {
      const cacheKey = `cache_${key}`;
      const cached = await AsyncStorage.getItem(cacheKey);

      if (!cached) {
        setCacheStats((prev) => ({ ...prev, misses: prev.misses + 1 }));
        return null;
      }

      const { data, timestamp, expiresIn } = JSON.parse(cached);

      // Check if cache has expired
      if (expiresIn !== null && Date.now() - timestamp > expiresIn) {
        await AsyncStorage.removeItem(cacheKey);
        setCacheStats((prev) => ({ ...prev, misses: prev.misses + 1 }));
        return null;
      }

      setCacheStats((prev) => ({ ...prev, hits: prev.hits + 1 }));
      return data;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  }, []);

  /**
   * Set cache data with TTL
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number|null} expiresIn - TTL in milliseconds (null for infinite)
   * @returns {Promise<boolean>} - Success status
   */
  const setCache = useCallback(async (key, data, expiresIn = DEFAULT_TTL.MEDIUM) => {
    try {
      const cacheKey = `cache_${key}`;
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiresIn,
      };

      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Error setting cache:', error);
      return false;
    }
  }, []);

  /**
   * Remove cached data by key
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - Success status
   */
  const removeCache = useCallback(async (key) => {
    try {
      const cacheKey = `cache_${key}`;
      await AsyncStorage.removeItem(cacheKey);
      return true;
    } catch (error) {
      console.error('Error removing cache:', error);
      return false;
    }
  }, []);

  /**
   * Clear all cached data
   * @returns {Promise<boolean>} - Success status
   */
  const clearCache = useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
      setCacheStats({ hits: 0, misses: 0, size: 0 });
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }, []);

  /**
   * Clear expired cache entries
   * @returns {Promise<number>} - Number of entries cleared
   */
  const clearExpiredCache = useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith('cache_'));
      let clearedCount = 0;

      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          const { timestamp, expiresIn } = JSON.parse(cached);
          if (expiresIn !== null && Date.now() - timestamp > expiresIn) {
            await AsyncStorage.removeItem(key);
            clearedCount++;
          }
        }
      }

      return clearedCount;
    } catch (error) {
      console.error('Error clearing expired cache:', error);
      return 0;
    }
  }, []);

  /**
   * Get cache size and statistics
   * @returns {Promise<object>} - Cache statistics
   */
  const getCacheStats = useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith('cache_'));
      
      let totalSize = 0;
      let validEntries = 0;
      let expiredEntries = 0;

      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          totalSize += cached.length;
          const { timestamp, expiresIn } = JSON.parse(cached);
          
          if (expiresIn === null || Date.now() - timestamp <= expiresIn) {
            validEntries++;
          } else {
            expiredEntries++;
          }
        }
      }

      return {
        totalEntries: cacheKeys.length,
        validEntries,
        expiredEntries,
        totalSize,
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        hitRate: cacheStats.hits + cacheStats.misses > 0
          ? (cacheStats.hits / (cacheStats.hits + cacheStats.misses) * 100).toFixed(2)
          : 0,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return null;
    }
  }, [cacheStats]);

  /**
   * Check if cache key exists and is valid
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - True if exists and valid
   */
  const hasCache = useCallback(async (key) => {
    try {
      const cacheKey = `cache_${key}`;
      const cached = await AsyncStorage.getItem(cacheKey);

      if (!cached) {
        return false;
      }

      const { timestamp, expiresIn } = JSON.parse(cached);

      // Check if cache has expired
      if (expiresIn !== null && Date.now() - timestamp > expiresIn) {
        await AsyncStorage.removeItem(cacheKey);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking cache:', error);
      return false;
    }
  }, []);

  /**
   * Get or set cache (fetch if not cached)
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Function to fetch data if not cached
   * @param {number|null} expiresIn - TTL in milliseconds
   * @returns {Promise<any>} - Cached or fetched data
   */
  const getOrSet = useCallback(async (key, fetchFn, expiresIn = DEFAULT_TTL.MEDIUM) => {
    try {
      // Try to get from cache first
      const cached = await getCached(key);
      if (cached !== null) {
        return cached;
      }

      // Fetch fresh data
      const data = await fetchFn();

      // Cache the result
      await setCache(key, data, expiresIn);

      return data;
    } catch (error) {
      console.error('Error in getOrSet:', error);
      throw error;
    }
  }, [getCached, setCache]);

  /**
   * Invalidate cache by pattern
   * @param {string} pattern - Pattern to match cache keys (e.g., 'assets_*')
   * @returns {Promise<number>} - Number of entries invalidated
   */
  const invalidatePattern = useCallback(async (pattern) => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => {
        if (!key.startsWith('cache_')) return false;
        const cacheKey = key.replace('cache_', '');
        return cacheKey.includes(pattern.replace('*', ''));
      });

      await AsyncStorage.multiRemove(cacheKeys);
      return cacheKeys.length;
    } catch (error) {
      console.error('Error invalidating cache pattern:', error);
      return 0;
    }
  }, []);

  const value = {
    getCached,
    setCache,
    removeCache,
    clearCache,
    clearExpiredCache,
    getCacheStats,
    hasCache,
    getOrSet,
    invalidatePattern,
    TTL: DEFAULT_TTL,
  };

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>;
}
