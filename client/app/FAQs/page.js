'use client';

import { Inter, Oswald } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const faq = [
  {
    question: "What is Klaim?",
    answer: "Klaim is a decentralized marketplace for intellectual property assets, powered by Story Protocol for verified ownership and licensing."
  },
  {
    question: "How do I register my IP on Klaim?", 
    answer: "Connect your wallet, upload your creative asset, and our platform will register it on Story Protocol with verified ownership."
  },
  {
    question: "What types of IP can I trade?",
    answer: "You can trade digital art, music, videos, code, designs, and any creative work that can be tokenized as IP assets."
  },
  {
    question: "How does Story Protocol ensure authenticity?",
    answer: "Story Protocol provides on-chain registration and tracking, creating immutable records of ownership and licensing history."
  },
  {
    question: "What are IP tokens?",
    answer: "IP tokens are ERC-20 tokens that represent fractional ownership or licensing rights to intellectual property assets."
  },
  {
    question: "How do creators earn from their IP?",
    answer: "Creators earn through initial sales, ongoing royalties from trades, and licensing fees distributed automatically via smart contracts."
  },
  {
    question: "Can I license my IP to others?",
    answer: "Yes, Klaim supports various licensing models including exclusive, non-exclusive, and custom licensing terms."
  },
  {
    question: "Is my IP protected from unauthorized use?",
    answer: "Story Protocol registration provides legal proof of ownership and creation timestamp for IP protection."
  },
  {
    question: "What wallets are supported?",
    answer: "We support MetaMask, WalletConnect, and other Ethereum-compatible wallets for secure transactions."
  },
  {
    question: "Are there any fees?",
    answer: "Platform fees are minimal and transparently distributed between creators, the protocol, and platform maintenance."
  },
  {
    question: "Can I view my IP portfolio?",
    answer: "Yes, your dashboard shows all owned IP assets, licensing agreements, and earnings in real-time."
  },
  {
    question: "How do I track IP provenance?",
    answer: "Every IP asset has a complete on-chain history showing creation, ownership transfers, and licensing events."
  }
];

export default function FAQs() {
  return (
    <main className="bg-background min-h-screen pt-20 pb-8 md:pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${oswald.variable} text-primary-text font-bold mb-3 md:mb-4`}>
            Frequently Asked Questions
          </h1>
          <p className={`${inter.variable} text-secondary-text text-sm sm:text-base md:text-lg`}>
            Everything you need to know about Klaim and IP trading
          </p>
        </div>
        
        <div className="space-y-2 md:space-y-3">
          {faq.map((item, index) => (
            <div key={index} className="collapse collapse-arrow bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-300">
              <input type="checkbox" className="peer" /> 
              <div className={`collapse-title pl-10 font-semibold text-sm md:text-base lg:text-lg peer-checked:text-primary ${oswald.variable}`}>
                {item.question}
              </div>
              <div className="collapse-content">
                <p className={`${inter.variable} text-xs sm:text-sm md:text-base text-secondary-text leading-relaxed pt-2`}>
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 md:mt-12">
          <p className={`${inter.variable} text-secondary-text text-sm md:text-base mb-4`}>Still have questions?</p>
          <a href="/faq" className="btn bg-main text-white px-6 md:px-8 py-2 md:py-3 rounded-md hover:bg-main/90 transition-colors text-sm md:text-base">
            View Full FAQ
          </a>
        </div>
      </div>
    </main>
  );
}