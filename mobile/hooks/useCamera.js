import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { Alert, Platform } from 'react-native';

/**
 * Custom hook for camera and image picker functionality.
 * 
 * This hook provides comprehensive image capture and selection capabilities
 * including camera access, photo library selection, and permission management.
 * It handles permission requests gracefully and provides user-friendly error
 * messages for denied permissions.
 * 
 * @returns {Object} Camera functions and state
 */
export const useCamera = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Request camera permission
   * @returns {Promise<boolean>} True if permission granted
   */
  const requestCameraPermission = useCallback(async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in your device settings to take photos.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error requesting camera permission:', err);
      setError(err.message || 'Failed to request camera permission');
      return false;
    }
  }, []);

  /**
   * Request media library permission
   * @returns {Promise<boolean>} True if permission granted
   */
  const requestMediaLibraryPermission = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setMediaLibraryPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Media Library Permission Required',
          'Please enable photo library access in your device settings to select images.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error requesting media library permission:', err);
      setError(err.message || 'Failed to request media library permission');
      return false;
    }
  }, []);

  /**
   * Check camera permission status
   * @returns {Promise<boolean>} True if permission granted
   */
  const checkCameraPermission = useCallback(async () => {
    try {
      const { status } = await Camera.getCameraPermissionsAsync();
      const granted = status === 'granted';
      setCameraPermission(granted);
      return granted;
    } catch (err) {
      console.error('Error checking camera permission:', err);
      return false;
    }
  }, []);

  /**
   * Check media library permission status
   * @returns {Promise<boolean>} True if permission granted
   */
  const checkMediaLibraryPermission = useCallback(async () => {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      const granted = status === 'granted';
      setMediaLibraryPermission(granted);
      return granted;
    } catch (err) {
      console.error('Error checking media library permission:', err);
      return false;
    }
  }, []);

  /**
   * Pick an image from the device's photo library
   * @param {Object} options - ImagePicker options
   * @param {string} options.mediaTypes - Type of media to pick (default: 'Images')
   * @param {boolean} options.allowsEditing - Allow editing after selection (default: true)
   * @param {number} options.quality - Image quality 0-1 (default: 0.8)
   * @param {Array} options.aspect - Aspect ratio for editing [width, height] (default: [4, 3])
   * @returns {Promise<Object|null>} Image result or null if cancelled
   */
  const pickImage = useCallback(async (options = {}) => {
    const {
      mediaTypes = ImagePicker.MediaTypeOptions.Images,
      allowsEditing = true,
      quality = 0.8,
      aspect = [4, 3],
    } = options;

    setLoading(true);
    setError(null);

    try {
      // Check permission
      const hasPermission = await checkMediaLibraryPermission();
      if (!hasPermission) {
        const granted = await requestMediaLibraryPermission();
        if (!granted) {
          setLoading(false);
          return null;
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes,
        allowsEditing,
        aspect,
        quality,
      });

      if (result.canceled) {
        setLoading(false);
        return null;
      }

      setLoading(false);
      return result.assets[0]; // Return first selected image
    } catch (err) {
      console.error('Error picking image:', err);
      setError(err.message || 'Failed to pick image');
      setLoading(false);
      
      Alert.alert(
        'Error',
        'Failed to select image. Please try again.',
        [{ text: 'OK' }]
      );
      
      return null;
    }
  }, [checkMediaLibraryPermission, requestMediaLibraryPermission]);

  /**
   * Take a photo using the device camera
   * @param {Object} options - Camera options
   * @param {boolean} options.allowsEditing - Allow editing after capture (default: true)
   * @param {number} options.quality - Image quality 0-1 (default: 0.8)
   * @param {Array} options.aspect - Aspect ratio for editing [width, height] (default: [4, 3])
   * @returns {Promise<Object|null>} Image result or null if cancelled
   */
  const takePhoto = useCallback(async (options = {}) => {
    const {
      allowsEditing = true,
      quality = 0.8,
      aspect = [4, 3],
    } = options;

    setLoading(true);
    setError(null);

    try {
      // Check permission
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        const granted = await requestCameraPermission();
        if (!granted) {
          setLoading(false);
          return null;
        }
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing,
        aspect,
        quality,
      });

      if (result.canceled) {
        setLoading(false);
        return null;
      }

      setLoading(false);
      return result.assets[0]; // Return captured image
    } catch (err) {
      console.error('Error taking photo:', err);
      setError(err.message || 'Failed to take photo');
      setLoading(false);
      
      Alert.alert(
        'Error',
        'Failed to take photo. Please try again.',
        [{ text: 'OK' }]
      );
      
      return null;
    }
  }, [checkCameraPermission, requestCameraPermission]);

  /**
   * Show action sheet to choose between camera and photo library
   * @param {Object} options - Options for both camera and picker
   * @returns {Promise<Object|null>} Image result or null if cancelled
   */
  const selectImage = useCallback(async (options = {}) => {
    return new Promise((resolve) => {
      Alert.alert(
        'Select Image',
        'Choose an option to select an image',
        [
          {
            text: 'Take Photo',
            onPress: async () => {
              const result = await takePhoto(options);
              resolve(result);
            },
          },
          {
            text: 'Choose from Library',
            onPress: async () => {
              const result = await pickImage(options);
              resolve(result);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true, onDismiss: () => resolve(null) }
      );
    });
  }, [takePhoto, pickImage]);

  /**
   * Pick multiple images from the photo library
   * @param {Object} options - ImagePicker options
   * @param {number} options.selectionLimit - Maximum number of images (default: 5)
   * @param {number} options.quality - Image quality 0-1 (default: 0.8)
   * @returns {Promise<Array|null>} Array of image results or null if cancelled
   */
  const pickMultipleImages = useCallback(async (options = {}) => {
    const {
      selectionLimit = 5,
      quality = 0.8,
    } = options;

    setLoading(true);
    setError(null);

    try {
      // Check permission
      const hasPermission = await checkMediaLibraryPermission();
      if (!hasPermission) {
        const granted = await requestMediaLibraryPermission();
        if (!granted) {
          setLoading(false);
          return null;
        }
      }

      // Launch image picker with multiple selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit,
        quality,
      });

      if (result.canceled) {
        setLoading(false);
        return null;
      }

      setLoading(false);
      return result.assets; // Return all selected images
    } catch (err) {
      console.error('Error picking multiple images:', err);
      setError(err.message || 'Failed to pick images');
      setLoading(false);
      
      Alert.alert(
        'Error',
        'Failed to select images. Please try again.',
        [{ text: 'OK' }]
      );
      
      return null;
    }
  }, [checkMediaLibraryPermission, requestMediaLibraryPermission]);

  return {
    // State
    cameraPermission,
    mediaLibraryPermission,
    loading,
    error,
    
    // Permission functions
    requestCameraPermission,
    requestMediaLibraryPermission,
    checkCameraPermission,
    checkMediaLibraryPermission,
    
    // Image selection functions
    pickImage,
    takePhoto,
    selectImage,
    pickMultipleImages,
  };
};
