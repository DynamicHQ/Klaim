'use client';

import { ThemeProvider } from "next-themes";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { config } from "@/config/wagmi";
import { useState } from "react";
import ServerPing from "@/components/ServerPing";

/**
 * Application Providers Wrapper Component
 * 
 * This component orchestrates all necessary React context providers for the
 * application including Web3 connectivity, authentication, theme management,
 * balance coordination, and server health monitoring. It establishes the proper
 * provider hierarchy ensuring all child components have access to wallet
 * functionality, user authentication state, theme preferences, and global
 * balance refresh coordination throughout the application lifecycle.
 */
export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider 
          attribute="data-theme" 
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <BalanceProvider>
              <ServerPing />
              {children}
            </BalanceProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
