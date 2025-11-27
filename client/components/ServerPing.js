'use client';

import { useEffect } from 'react';
import { pingServer } from '@/utils/api';

/**
 * Server Ping Component
 * 
 * This component pings the backend server once when the application starts
 * to wake it up if it's sleeping (common with free hosting services).
 * It runs silently in the background without affecting the user experience.
 */
export default function ServerPing() {
  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        console.log('Pinging backend server...');
        const result = await pingServer();
        
        if (result.success) {
          console.log('✓ Backend server is online');
        } else {
          console.warn('⚠ Backend server ping failed:', result.status);
        }
      } catch (error) {
        console.warn('⚠ Failed to ping backend server:', error.message);
      }
    };

    // Ping once on initial mount
    wakeUpServer();
  }, []);

  // This component doesn't render anything
  return null;
}
