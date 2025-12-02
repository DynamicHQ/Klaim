/**
 * Storage utilities for React Native mobile app
 * Provides AsyncStorage wrapper functions with error handling
 * and secure storage for sensitive data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Storage key prefixes for organization
const STORAGE_PREFIX = '@klaim:';
const SECURE_PREFIX = '@klaim_secure:';

/**
 * Get item from AsyncStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {Promise<*>} Stored value or default value
 */
export async function getItem(key, defaultValue = null) {
  try {
    const value = await AsyncStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (value === null) {
      return defaultValue;
    }
    
    // Try to parse as JSON, return raw string if parsing fails
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Set item in AsyncStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON stringified)
 * @returns {Promise<boolean>} Success status
 */
export async function setItem(key, value) {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, stringValue);
    return true;
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
    return false;
  }
}

/**
 * Remove item from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} Success status
 */
export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
    return false;
  }
}

/**
 * Clear all items from AsyncStorage with app prefix
 * @returns {Promise<boolean>} Success status
 */
export async function clearAll() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
    await AsyncStorage.multiRemove(appKeys);
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

/**
 * Get multiple items from AsyncStorage
 * @param {string[]} keys - Array of storage keys
 * @returns {Promise<Object>} Object with key-value pairs
 */
export async function getMultiple(keys) {
  try {
    const prefixedKeys = keys.map(key => `${STORAGE_PREFIX}${key}`);
    const values = await AsyncStorage.multiGet(prefixedKeys);
    
    const result = {};
    values.forEach(([key, value]) => {
      const originalKey = key.replace(STORAGE_PREFIX, '');
      if (value !== null) {
        try {
          result[originalKey] = JSON.parse(value);
        } catch {
          result[originalKey] = value;
        }
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error getting multiple items:', error);
    return {};
  }
}

/**
 * Set multiple items in AsyncStorage
 * @param {Object} items - Object with key-value pairs
 * @returns {Promise<boolean>} Success status
 */
export async function setMultiple(items) {
  try {
    const pairs = Object.entries(items).map(([key, value]) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      return [`${STORAGE_PREFIX}${key}`, stringValue];
    });
    
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error('Error setting multiple items:', error);
    return false;
  }
}

/**
 * Check if key exists in AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} True if key exists
 */
export async function hasItem(key) {
  try {
    const value = await AsyncStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return value !== null;
  } catch (error) {
    console.error(`Error checking item ${key}:`, error);
    return false;
  }
}

/**
 * Get all keys from AsyncStorage with app prefix
 * @returns {Promise<string[]>} Array of keys (without prefix)
 */
export async function getAllKeys() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.replace(STORAGE_PREFIX, ''));
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
}

// Secure Storage Functions (for sensitive data like auth tokens, private keys, etc.)

/**
 * Get item from secure storage
 * @param {string} key - Storage key
 * @returns {Promise<string|null>} Stored value or null
 */
export async function getSecureItem(key) {
  try {
    const value = await SecureStore.getItemAsync(`${SECURE_PREFIX}${key}`);
    return value;
  } catch (error) {
    console.error(`Error getting secure item ${key}:`, error);
    return null;
  }
}

/**
 * Set item in secure storage
 * @param {string} key - Storage key
 * @param {string} value - Value to store (must be string)
 * @returns {Promise<boolean>} Success status
 */
export async function setSecureItem(key, value) {
  try {
    await SecureStore.setItemAsync(`${SECURE_PREFIX}${key}`, value);
    return true;
  } catch (error) {
    console.error(`Error setting secure item ${key}:`, error);
    return false;
  }
}

/**
 * Remove item from secure storage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} Success status
 */
export async function removeSecureItem(key) {
  try {
    await SecureStore.deleteItemAsync(`${SECURE_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error(`Error removing secure item ${key}:`, error);
    return false;
  }
}

/**
 * Clear all secure storage items
 * Note: SecureStore doesn't have a clear all method, so this is a no-op
 * Individual items must be removed explicitly
 * @returns {Promise<boolean>} Success status
 */
export async function clearSecureStorage() {
  console.warn('Secure storage must be cleared item by item');
  return true;
}

// Cache-specific utilities with TTL support

/**
 * Set cached item with TTL (time to live)
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 * @returns {Promise<boolean>} Success status
 */
export async function setCachedItem(key, data, ttl = 300000) {
  const cacheData = {
    data,
    timestamp: Date.now(),
    ttl
  };
  return setItem(`cache:${key}`, cacheData);
}

/**
 * Get cached item if not expired
 * @param {string} key - Cache key
 * @returns {Promise<*>} Cached data or null if expired/not found
 */
export async function getCachedItem(key) {
  const cacheData = await getItem(`cache:${key}`);
  
  if (!cacheData || !cacheData.timestamp || !cacheData.ttl) {
    return null;
  }
  
  const age = Date.now() - cacheData.timestamp;
  if (age > cacheData.ttl) {
    // Cache expired, remove it
    await removeItem(`cache:${key}`);
    return null;
  }
  
  return cacheData.data;
}

/**
 * Remove cached item
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Success status
 */
export async function removeCachedItem(key) {
  return removeItem(`cache:${key}`);
}

/**
 * Clear all cached items
 * @returns {Promise<boolean>} Success status
 */
export async function clearCache() {
  try {
    const keys = await getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith('cache:'));
    
    await Promise.all(cacheKeys.map(key => removeItem(key)));
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
}

/**
 * Get cache statistics
 * @returns {Promise<Object>} Cache stats with count and total size estimate
 */
export async function getCacheStats() {
  try {
    const keys = await getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith('cache:'));
    
    return {
      count: cacheKeys.length,
      keys: cacheKeys.map(key => key.replace('cache:', ''))
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { count: 0, keys: [] };
  }
}

export default {
  // Basic storage
  getItem,
  setItem,
  removeItem,
  clearAll,
  getMultiple,
  setMultiple,
  hasItem,
  getAllKeys,
  // Secure storage
  getSecureItem,
  setSecureItem,
  removeSecureItem,
  clearSecureStorage,
  // Cache utilities
  setCachedItem,
  getCachedItem,
  removeCachedItem,
  clearCache,
  getCacheStats
};
