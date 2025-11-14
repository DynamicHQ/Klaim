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
    <main className="bg-background min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-5xl ${oswald.variable} text-primary-text font-bold mb-4`}>Frequently Asked Questions</h1>
          <p className={`${inter.variable} text-secondary-text text-lg`}>Everything you need to know about Klaim and IP trading</p>
        </div>
        
        <div className="space-y-6">
          {faq.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className={`${oswald.variable} text-xl font-semibold text-primary-text mb-3`}>{item.question}</h3>
              <p className={`${inter.variable} text-secondary-text leading-relaxed`}>{item.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className={`${inter.variable} text-secondary-text mb-4`}>Still have questions?</p>
          <a href="#" className="btn bg-main text-white px-8 py-3 rounded-md hover:bg-main/90 transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}