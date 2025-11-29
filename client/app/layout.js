import { Jost } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import "./globals.css";

// Jost font family configuration for modern typography
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Application metadata for SEO and browser display
export const metadata = {
  title: "Klaim | Decentralized IP Store",
  description: "Decentralized marketplace for intellectual property assets powered by Story Protocol. Register, protect, and trade your creative works with verified ownership.",
};

/**
 * Root Layout Component for Application Structure
 * 
 * This component defines the fundamental HTML structure and layout for the
 * entire application including font configuration, global styling, provider
 * setup, and navigation integration. It ensures consistent layout structure
 * across all pages while providing the necessary context providers and
 * navigation components for a seamless user experience throughout the platform.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jost.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
