'use client';

import { useEffect, useState } from 'react';
import { pingServer } from '@/utils/api';

// Import integration test to make global functions available
if (typeof window !== 'undefined') {
  import('@/utils/integrationTest');
}

/**
 * Server Ping Component
 * 
 * This component pings the backend server once when the application starts
 * to wake it up if it's sleeping (common with free hosting services).
 * It provides visual feedback during the ping process and shows the result.
 */
export default function ServerPing() {
  const [pingStatus, setPingStatus] = useState('pinging');
  const [pingResult, setPingResult] = useState(null);

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        console.log('🚀 Starting server ping...');
        setPingStatus('pinging');
        
        const result = await pingServer();
        setPingResult(result);
        
        if (result.success) {
          console.log(`✅ Backend server is online (${result.responseTime}ms)`);
          setPingStatus('online');
          
          // Hide the status after 3 seconds if successful
          setTimeout(() => {
            setPingStatus('hidden');
          }, 3000);
        } else {
          console.warn('⚠️ Backend server ping failed:', result);
          setPingStatus('failed');
          
          // Keep failed status visible longer (10 seconds)
          setTimeout(() => {
            setPingStatus('hidden');
          }, 10000);
        }
      } catch (error) {
        console.error('❌ Failed to ping backend server:', error.message);
        setPingStatus('error');
        setPingResult({ error: error.message });
        
        // Keep error status visible longer (10 seconds)
        setTimeout(() => {
          setPingStatus('hidden');
        }, 10000);
      }
    };

    // Ping once on initial mount
    wakeUpServer();
  }, []);

  // Don't render anything if hidden or if ping was successful and timeout passed
  if (pingStatus === 'hidden') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {pingStatus === 'pinging' && (
        <div className="alert alert-info shadow-lg">
          <div className="flex items-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            <div>
              <h3 className="font-bold text-sm">Waking up server...</h3>
              <div className="text-xs">This may take a moment</div>
            </div>
          </div>
        </div>
      )}
      
      {pingStatus === 'online' && (
        <div className="alert alert-success shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="font-bold text-sm">Server online</h3>
              <div className="text-xs">
                Response time: {pingResult?.responseTime}ms
              </div>
            </div>
          </div>
        </div>
      )}
      
      {(pingStatus === 'failed' || pingStatus === 'error') && (
        <div className="alert alert-warning shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="font-bold text-sm">Server connection issue</h3>
              <div className="text-xs">
                {pingResult?.error || 'Server may be starting up'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
