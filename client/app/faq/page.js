'use client';

'use client';

/**
 * Frequently Asked Questions Page Component
 * 
 * This component provides an interactive FAQ interface with collapsible
 * question-answer sections organized by categories. It features smooth
 * accordion-style interactions, comprehensive coverage of platform features,
 * technical questions, and user guidance. The component implements proper
 * state management for expand/collapse functionality and provides clear
 * navigation through common user questions and platform explanations.
 */
export default function FAQ() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is Klaimit?",
          a: "Klaimit is a decentralized marketplace for intellectual property (IP) assets built on Story Protocol. It allows creators to register, protect, and monetize their digital content as NFTs with built-in IP rights management."
        },
        {
          q: "Do I need cryptocurrency to use Klaimit?",
          a: "Yes, you'll need testnet IP tokens to interact with the platform. These are free test tokens used for development and testing. See our Quick Testnet Guide to get started."
        },
        {
          q: "What is MetaMask and why do I need it?",
          a: "MetaMask is a cryptocurrency wallet that runs as a browser extension. It allows you to interact with blockchain applications like Klaimit. You need it to sign transactions, authenticate, and manage your digital assets."
        },
        {
          q: "How do I get started?",
          a: "1. Install MetaMask browser extension\n2. Get testnet IP tokens from the faucet\n3. Connect your wallet on Klaimit\n4. Sign up for an account\n5. Start creating or browsing IP assets!"
        }
      ]
    },
    {
      category: "Account & Wallet",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' in the navbar, connect your MetaMask wallet, enter a username, and sign the authentication message in your wallet. Your account is linked to your wallet address."
        },
        {
          q: "Why do I need to sign a message to login?",
          a: "Signing a message proves you own the wallet address without revealing your private key. It's a secure way to authenticate without traditional passwords."
        },
        {
          q: "Can I use the same wallet on multiple devices?",
          a: "Yes! Your account is tied to your wallet address, not your device. Just connect the same wallet on any device to access your account."
        },
        {
          q: "What if I lose access to my wallet?",
          a: "If you lose your wallet's seed phrase, you'll lose access to your account and assets. Always backup your seed phrase securely. Never share it with anyone."
        },
        {
          q: "Why does it say 'Wrong Network'?",
          a: "Klaimit uses Story Protocol Testnet. If you see this warning, click the 'Switch Network' button in the navbar to automatically switch to the correct network."
        }
      ]
    },
    {
      category: "Creating IP Assets",
      questions: [
        {
          q: "What types of files can I upload?",
          a: "You can upload images, documents, audio files, and videos. Files are stored on Cloudinary and linked to your NFT on the blockchain."
        },
        {
          q: "What happens when I create an IP asset?",
          a: "Your file is uploaded to secure storage, and an NFT is minted on Story Protocol with IP rights protection. You become the verified owner with full control over licensing and transfers."
        },
        {
          q: "How much does it cost to create an IP asset?",
          a: "On testnet, it's free! You only need testnet tokens for gas fees. On mainnet (when launched), you'll pay gas fees in the network's native token."
        },
        {
          q: "Can I edit my IP asset after creation?",
          a: "Once minted on the blockchain, the core asset data is immutable. However, you can update metadata like description or list it on the marketplace."
        }
      ]
    },
    {
      category: "Marketplace",
      questions: [
        {
          q: "How do I list my IP asset for sale?",
          a: "Go to 'My NFTs', select an asset, click 'List on Marketplace', set your price in IPT tokens, and confirm the transaction in your wallet."
        },
        {
          q: "How do I buy an IP asset?",
          a: "Browse the marketplace, click on an asset you want, review the details, click 'Purchase', and confirm the transaction. The asset will be transferred to your wallet."
        },
        {
          q: "What are IPT tokens?",
          a: "IPT (IP Token) is the native token used for transactions on Story Protocol. On testnet, you can get free IPT from faucets."
        },
        {
          q: "Can I cancel a listing?",
          a: "Yes, you can delist your asset at any time before it's sold. Go to the marketplace, find your listing, and click 'Remove Listing'."
        },
        {
          q: "What happens after I purchase an IP asset?",
          a: "The NFT is transferred to your wallet, and you become the new owner with all associated IP rights. You can view it in 'My NFTs' and download the original file."
        }
      ]
    },
    {
      category: "Testnet & Tokens",
      questions: [
        {
          q: "What is a testnet?",
          a: "A testnet is a test version of a blockchain where you can experiment without using real money. It's perfect for learning and testing features safely."
        },
        {
          q: "How do I get testnet tokens?",
          a: "Visit the Story Protocol faucet or Discord channel, enter your wallet address, and request tokens. They're free and used only for testing."
        },
        {
          q: "Why did my transaction fail?",
          a: "Common reasons:\n• Insufficient testnet tokens for gas fees\n• Wrong network selected\n• Transaction rejected in MetaMask\n• Network congestion\nCheck your wallet balance and network settings."
        },
        {
          q: "Can I convert testnet tokens to real money?",
          a: "No, testnet tokens have no real-world value. They're only for testing purposes and cannot be exchanged for real cryptocurrency."
        }
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          q: "MetaMask isn't connecting. What should I do?",
          a: "1. Refresh the page\n2. Make sure MetaMask is unlocked\n3. Check if MetaMask is installed and enabled\n4. Try disconnecting and reconnecting\n5. Clear browser cache if issues persist"
        },
        {
          q: "My transaction is stuck as 'Pending'. What now?",
          a: "Blockchain transactions can take time. Wait a few minutes. If it's stuck for over 10 minutes, you can try speeding it up or canceling it in MetaMask."
        },
        {
          q: "I can't see my NFT after purchase. Where is it?",
          a: "Check 'My NFTs' page. If it's not there:\n1. Refresh the page\n2. Verify the transaction completed on the block explorer\n3. Make sure you're connected with the correct wallet\n4. Wait a few minutes for blockchain confirmation"
        },
        {
          q: "The page is showing errors. What should I do?",
          a: "1. Check browser console for error messages\n2. Verify you're on the correct network\n3. Ensure you have sufficient testnet tokens\n4. Try refreshing the page\n5. Clear browser cache and cookies"
        },
        {
          q: "How do I switch between light and dark mode?",
          a: "Click the sun/moon icon in the navbar. Your preference is automatically saved and will persist across sessions."
        }
      ]
    },
    {
      category: "Security & Best Practices",
      questions: [
        {
          q: "Is my wallet safe?",
          a: "Your wallet is as safe as you keep it. Never share your seed phrase or private key. Always verify transaction details before signing. Only connect to trusted websites."
        },
        {
          q: "What should I never share?",
          a: "NEVER share:\n• Your seed phrase (12-24 words)\n• Your private key\n• Your password\nKlaimit will NEVER ask for these. Anyone asking is a scammer."
        },
        {
          q: "How can I verify I'm on the real Klaimit website?",
          a: "Check the URL carefully. Bookmark the official site. Be wary of links from emails or messages. Look for HTTPS and the correct domain name."
        },
        {
          q: "What if someone asks me to sign a suspicious transaction?",
          a: "Always read what you're signing. If something looks suspicious, reject it. Legitimate transactions will clearly state what they do. When in doubt, don't sign."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-base-200 pt-20 pb-8 md:pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-base-content/70">
            Everything you need to know to get started with Klaimit
          </p>
        </div>

        {/* Quick Links */}
        <div className="card bg-base-100 shadow-xl mb-6 md:mb-8">
          <div className="card-body p-4 md:p-6">
            <h2 className="card-title text-lg md:text-xl mb-3 md:mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              <a href="/docs" className="btn btn-outline btn-sm">
                📚 Technical Documentation
              </a>
              <a href="/signup" className="btn btn-outline btn-sm">
                🚀 Get Started
              </a>
              <a 
                href="https://docs.story.foundation/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                📖 Story Protocol Docs
              </a>
              <a 
                href="https://testnet.storyscan.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                🔍 Block Explorer
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">
              {category.category}
            </h2>
            <div className="space-y-2 md:space-y-3">
              {category.questions.map((faq, faqIndex) => (
                <div key={faqIndex} className="collapse collapse-arrow bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-300">
                  <input type="checkbox" className="peer" /> 
                  <div className="collapse-title font-semibold text-sm md:text-base lg:text-lg peer-checked:text-primary">
                    {faq.q}
                  </div>
                  <div className="collapse-content">
                    <p className="text-xs sm:text-sm md:text-base text-base-content/80 whitespace-pre-line pt-2">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Still Have Questions */}
        <div className="card bg-primary text-primary-content shadow-xl mt-8 md:mt-12">
          <div className="card-body text-center p-4 md:p-6">
            <h2 className="card-title justify-center text-xl md:text-2xl mb-2">
              Still Have Questions?
            </h2>
            <p className="mb-3 md:mb-4 text-sm md:text-base">
              Can&apos;t find what you&apos;re looking for? Check out our technical documentation or join our community.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 justify-center">
              <a href="/docs" className="btn btn-outline btn-primary-content">
                View Documentation
              </a>
              <a 
                href="https://discord.gg/storyprotocol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-primary-content"
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
