import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Klaim | Decentralized NFT Marketplace",
  description: "Create, trade, and manage NFTs on the blockchain",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Klaim | Decentralized NFT Marketplace</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="data-theme">
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}