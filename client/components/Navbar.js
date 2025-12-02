'use client';

import { useState, useEffect } from 'react';
import Link from "next/link"
import Image from "next/image"
import { FaUser, FaStore, FaInfoCircle, FaQuestionCircle, FaSignOutAlt, FaWallet, FaSpinner, FaExclamationTriangle, FaServer } from "react-icons/fa";
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { useKIPBalance } from '@/hooks/useKIPBalance';
import { pingServer } from '@/utils/api';

/**
 * Navigation Bar Component with Dynamic CTA and Balance Display
 * 
 * This component provides the main navigation interface featuring dynamic
 * call-to-action buttons based on authentication and wallet connection status,
 * real-time KIP token balance display, theme switching functionality, and
 * responsive dropdown navigation. It implements a three-tier CTA system:
 * unauthenticated users see "Get Started", authenticated users without wallets
 * see "Connect Wallet", and fully connected users see balance display with
 * action buttons and comprehensive navigation options.
 */
export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { account: address, isConnected, connectWallet } = useWallet();
  const { formattedBalance, loading: balanceLoading, error: balanceError } = useKIPBalance(address);
  const [isPinging, setIsPinging] = useState(false);


  // User logout handler with authentication cleanup
  const handleDisconnect = () => {
    logout();
  };

  // Manual server ping handler for testing
  const handleServerPing = async () => {
    if (isPinging) return;
    
    setIsPinging(true);
    console.log('🔧 Manual server ping initiated from navbar...');
    
    try {
      const result = await pingServer();
      
      if (result.success) {
        console.log('✅ Manual ping successful:', result);
        alert(`✅ Server is online!\n\nRoutes tested: ${Object.keys(result.routes).length}\nResponse time: ${result.responseTime}ms\n\nCheck console for details.`);
      } else {
        console.warn('⚠️ Manual ping had issues:', result);
        alert(`⚠️ Server ping completed with issues.\n\nStatus: ${result.status}\nResponse time: ${result.responseTime}ms\nErrors: ${result.errors?.length || 0}\n\nCheck console for details.`);
      }
    } catch (error) {
      console.error('❌ Manual ping failed:', error);
      alert(`❌ Server ping failed: ${error.message}\n\nCheck console for details.`);
    } finally {
      setIsPinging(false);
    }
  };

  /**
   * Theme toggle handler with localStorage persistence.
   * 
   * This function manages theme switching between light and dark modes
   * with automatic persistence to localStorage and immediate DOM updates
   * for instant visual feedback. It ensures theme preferences are
   * maintained across browser sessions and page reloads.
   */
  
  return (
    <div className="navbar bg-base-100/95 shadow-sm fixed top-0 z-1000 h-14 sm:h-16 px-2 md:px-4">
      <div className="flex-1">
        <Link href="/" className="flex items-center">
            <Image src="/logo.png" height={20} width={120} alt="Logo" className="sm:hidden" />
            <Image src="/logo.png" height={24} width={150} alt="Logo" className="hidden sm:block" />
        </Link>
      </div>
      <div className="flex gap-1 sm:gap-2 md:gap-4">
        {!isAuthenticated ? (
          <Link 
            href="/login"
            className="hidden sm:flex px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 btn outline-main text-main btn-outline btn-xs sm:btn-sm md:btn-md rounded-md hover:bg-main hover:text-white text-xs sm:text-sm items-center gap-2"
          >
            <FaWallet className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Get Started</span>
          </Link>
        ) : !isConnected ? (
          <button 
            onClick={connectWallet}
            className="hidden sm:flex px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 btn bg-main text-white btn-xs sm:btn-sm md:btn-md rounded-md hover:bg-main/90 text-xs sm:text-sm items-center gap-2"
          >
            <FaWallet className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Connect Wallet</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 md:gap-2">
            {/* Action Buttons - only show on larger screens */}
            <div className="hidden lg:flex gap-2">
              <Link 
                href="/create"
                className="btn btn-primary btn-sm"
              >
                Create
              </Link>
              <Link 
                href="/marketplace"
                className="btn btn-outline btn-sm"
              >
                Marketplace
              </Link>
            </div>

            {/* KIP Balance Display */}
            <div 
              className="flex items-center gap-1 px-1.5 sm:px-2 md:px-3 py-1 md:py-2 bg-primary/10 rounded-lg"
              role="status"
              aria-label={balanceLoading ? 'Loading KIP balance' : `KIP balance: ${formattedBalance || '0'}`}
            >
              {balanceLoading ? (
                <FaSpinner 
                  className="animate-spin text-primary w-2.5 h-2.5 sm:w-3 sm:h-3" 
                  aria-hidden="true"
                />
              ) : balanceError ? (
                <FaExclamationTriangle 
                  className="text-warning w-2.5 h-2.5 sm:w-3 sm:h-3" 
                  title={balanceError}
                  aria-label={`Balance error: ${balanceError}`}
                />
              ) : (
                <span 
                  className="text-primary font-semibold text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
                  aria-label={`KIP token balance: ${formattedBalance || '0'}`}
                >
                  {formattedBalance || '0'} <span className="hidden xs:inline">KIP</span>
                </span>
              )}
            </div>
            
            {/* Wallet Address */}
            <div 
              className="badge badge-success px-1.5 sm:px-2 md:px-4 py-1.5 sm:py-2 md:py-3 text-[10px] sm:text-xs md:text-sm"
              role="status"
              aria-label={`Connected wallet address: ${address}`}
            >
              <span className="hidden sm:inline">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              <span className="sm:hidden">{address?.slice(0, 4)}...{address?.slice(-2)}</span>
            </div>
          </div>
        )}
        
        {/* theme is handled by user preferences and next-themes — removed manual toggle */}
    
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> 
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /> 
        </svg>
      </button>
      <ul
        tabIndex="-1"
        className="menu menu-md dropdown-content bg-base-100 rounded-box z-1000 mt-3 w-48 sm:w-52 p-2 shadow text-sm">
        {isAuthenticated && isConnected && (
          <>
            <li className="lg:hidden">
              <a href="/create">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create
                </div>
              </a>
            </li>
            <li className="lg:hidden">
              <a href="/marketplace">
                <div className="flex items-center gap-2">
                  <FaStore />
                  Marketplace
                </div>
              </a>
            </li>
            <div className="divider lg:hidden"></div>
          </>
        )}
        <li>
          <a href="/profile">
           <div className="flex items-center gap-2">
              <FaUser />
              Profile
            </div>
          </a>
        </li>
        <li>
          <a href="/marketplace">
            <div className="flex items-center gap-2">
              <FaStore />
              Marketplace
            </div>
          </a>
        </li>
        <li>
          <a href="/docs">
            <div className="flex items-center gap-2">
              <FaInfoCircle />
              Docs
            </div>
          </a>
        </li>
        <li>
          <a href="/FAQs">
            <div className="flex items-center gap-2">
              <FaQuestionCircle />
              FAQs
            </div>
          </a>
        </li>
        <div className="divider"></div>
        <li>
          <a onClick={handleServerPing} className={isPinging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}>
            <div className="flex items-center gap-2">
              {isPinging ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaServer />
              )}
              {isPinging ? 'Testing Server...' : 'Test Server'}
            </div>
          </a>
        </li>
        {isAuthenticated && (
          <li>
            <a onClick={handleDisconnect}>
              <div className="flex items-center gap-2">
                <FaSignOutAlt />
                {isConnected ? 'Disconnect' : 'Logout'}
              </div>
            </a>
          </li>
        )}
      </ul>
    </div>
  </div>
    </div>
  )
}
