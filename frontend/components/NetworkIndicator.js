'use client';

import { useState, useEffect } from 'react';
import { 
  getChainId, 
  getNetworkName, 
  switchToStoryTestnet,
  NETWORKS,
  isMetaMaskInstalled,
  onChainChanged
} from '@/utils/wallet';

export default function NetworkIndicator() {
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      return;
    }

    const updateNetwork = async () => {
      try {
        const id = await getChainId();
        const name = getNetworkName(id);
        setChainId(id);
        setNetworkName(name);
        setIsCorrectNetwork(
          id.toLowerCase() === NETWORKS.STORY_TESTNET.chainId.toLowerCase()
        );
      } catch (error) {
        console.error('Error getting network:', error);
      }
    };

    updateNetwork();

    // Listen for network changes
    const cleanup = onChainChanged(() => {
      updateNetwork();
    });

    return cleanup;
  }, []);

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    try {
      await switchToStoryTestnet();
    } catch (error) {
      console.error('Error switching network:', error);
      alert(error.message || 'Failed to switch network');
    } finally {
      setIsSwitching(false);
    }
  };

  if (!chainId) {
    return null;
  }

  if (isCorrectNetwork) {
    return (
      <div className="badge badge-success gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {networkName}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="badge badge-warning gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        {networkName}
      </div>
      <button
        onClick={handleSwitchNetwork}
        className={`btn btn-sm btn-primary ${isSwitching ? 'loading' : ''}`}
        disabled={isSwitching}
      >
        {isSwitching ? 'Switching...' : 'Switch Network'}
      </button>
    </div>
  );
}
