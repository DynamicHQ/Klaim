'use client';

import { ThemeProvider } from "next-themes";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { config } from "@/config/wagmi";
import { useState } from "react";

/**
 * Application Providers Wrapper Component
 * 
 * This component orchestrates all necessary React context providers for the
 * application including Web3 connectivity, authentication, theme management,
 * and balance coordination. It establishes the proper provider hierarchy
 * ensuring all child components have access to wallet functionality, user
 * authentication state, theme preferences, and global balance refresh
 * coordination throughout the application lifecycle.
 */
export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="data-theme" defaultTheme="light">
          <AuthProvider>
            <BalanceProvider>
              {children}
            </BalanceProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
