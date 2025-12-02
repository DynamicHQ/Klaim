'use client';

import { FaGithub, FaBook, FaCode, FaShieldAlt, FaCube, FaNetworkWired } from 'react-icons/fa';

/**
 * Technical Documentation Page Component
 * 
 * This component provides comprehensive technical documentation for the Klaim
 * platform including architecture overview, protocol explanations, API references,
 * and implementation guides. It features organized sections covering blockchain
 * integration, Story Protocol implementation, security measures, and development
 * resources with visual statistics and interactive navigation elements for
 * developers and technical users seeking detailed platform information.
 */
export default function Docs() {
  return (
    <div className="min-h-screen bg-base-200 pt-20 pb-8 md:pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            Technical Documentation
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-base-content/70 max-w-3xl mx-auto px-4">
            Comprehensive technical overview of Klaimit&apos;s architecture, protocols, and implementation
          </p>
        </div>

        {/* Quick Stats */}
        <div id="quick-stats" className="mt-2"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
          <div className="stat bg-base-100 shadow-lg rounded-box">
            <div className="stat-figure text-primary">
              <FaCube className="w-8 h-8" />
            </div>
            <div className="stat-title">Blockchain</div>
            <div className="stat-value text-2xl">Story Protocol</div>
            <div className="stat-desc">Testnet (Chain ID: 1513)</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-box">
            <div className="stat-figure text-secondary">
              <FaCode className="w-8 h-8" />
            </div>
            <div className="stat-title">Frontend</div>
            <div className="stat-value text-2xl">Next.js 15</div>
            <div className="stat-desc">React 19 + DaisyUI</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-box">
            <div className="stat-figure text-accent">
              <FaNetworkWired className="w-8 h-8" />
            </div>
            <div className="stat-title">Backend</div>
            <div className="stat-value text-2xl">NestJS</div>
            <div className="stat-desc">Node.js + MongoDB</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-box">
            <div className="stat-figure text-success">
              <FaShieldAlt className="w-8 h-8" />
            </div>
            <div className="stat-title">Design</div>
            <div className="stat-value text-2xl">Responsive</div>
            <div className="stat-desc">Mobile-First + Accessible</div>
          </div>
        </div>

        {/* Architecture Overview */}
        <div id="architecture" className="mt-2"></div>
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              <FaCube className="w-6 h-6" />
              Architecture Overview
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">System Design</h3>
                <p className="text-base-content/80">
                  Klaimit implements a three-tier architecture: frontend (Next.js), backend API (NestJS), 
                  and blockchain layer (Story Protocol). The system uses Web3 wallet signatures for 
                  authentication, JWT for session management, and IPFS/Pinata for decentralized storage.
                  The platform features a fully responsive design with mobile-first approach and comprehensive
                  accessibility features.
                </p>
              </div>
              <div className="divider"></div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Frontend Layer</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-base-content/70">
                    <li>Next.js 15 (App Router)</li>
                    <li>React 19 with Hooks</li>
                    <li>TailwindCSS + DaisyUI</li>
                    <li>ethers.js v6</li>
                    <li>Responsive Design</li>
                    <li>MetaMask Integration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Backend Layer</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-base-content/70">
                    <li>NestJS Framework</li>
                    <li>MongoDB + Mongoose</li>
                    <li>JWT Authentication</li>
                    <li>RESTful API</li>
                    <li>Pinata IPFS</li>
                    <li>Transaction Security</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Blockchain Layer</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-base-content/70">
                    <li>Story Protocol</li>
                    <li>ERC-721 NFTs</li>
                    <li>IP Rights Management</li>
                    <li>Smart Contracts</li>
                    <li>On-chain Licensing</li>
                    <li>KIP Token Faucet</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Flow */}
        <div id="authentication" className="mt-2"></div>
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body p-4 md:p-6">
            <h2 className="card-title text-xl md:text-2xl mb-4">
              <FaShieldAlt className="w-5 h-5 md:w-6 md:h-6" />
              Authentication & Security
            </h2>
            <div className="space-y-4">
              <p className="text-base-content/80">
                Implements Web3-native authentication using wallet signatures, nonce verification, and
                transaction security with mandatory message signing to prevent bot attacks.
              </p>
              <div className="mockup-code text-xs sm:text-sm">
                <pre data-prefix="1"><code>User connects MetaMask wallet</code></pre>
                <pre data-prefix="2"><code>Frontend requests nonce: GET /auth/nonce/:wallet</code></pre>
                <pre data-prefix="3"><code>Backend generates unique nonce, stores in DB</code></pre>
                <pre data-prefix="4"><code>User signs message: &quot;Welcome to Klaimit! Sign this nonce to login: {'{nonce}'}&quot;</code></pre>
                <pre data-prefix="5"><code>Frontend sends signature: POST /auth/login</code></pre>
                <pre data-prefix="6"><code>Backend verifies signature using ethers.verifyMessage()</code></pre>
                <pre data-prefix="7"><code>Backend generates JWT token with user ID and wallet</code></pre>
                <pre data-prefix="8"><code>Frontend stores JWT in localStorage</code></pre>
                <pre data-prefix="9"><code>All subsequent requests include: Authorization: Bearer {'{token}'}</code></pre>
                <pre data-prefix="10"><code>Transactions require additional signature verification</code></pre>
              </div>
              <div className="alert alert-info text-sm">
                <FaBook className="w-4 h-4 md:w-5 md:h-5" />
                <span>
                  <strong>Security:</strong> Nonce is rotated after each authentication. 
                  All transactions require message signing to prevent bot attacks. Balance verification
                  ensures sufficient KIP tokens before purchases.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Contracts */}
        <div id="smart-contracts" className="mt-2"></div>
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              <FaCode className="w-6 h-6" />
              Smart Contract Integration
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-2">IP Creator Contract</h3>
                  <p className="text-sm text-base-content/70 mb-3">
                    Handles NFT minting and IP registration on Story Protocol.
                  </p>
                  <div className="mockup-code text-xs">
                    <pre><code>function createIPFromFile(</code></pre>
                    <pre><code>  address recipient,</code></pre>
                    <pre><code>  string metadataURI,</code></pre>
                    <pre><code>  bytes32 metadataHash,</code></pre>
                    <pre><code>  string licenseURI</code></pre>
                    <pre><code>) returns (</code></pre>
                    <pre><code>  uint256 tokenId,</code></pre>
                    <pre><code>  address ipId,</code></pre>
                    <pre><code>  uint256 licenseTermsId</code></pre>
                    <pre><code>)</code></pre>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">IP Marketplace Contract</h3>
                  <p className="text-sm text-base-content/70 mb-3">
                    Manages listings, purchases, and transfers of IP assets.
                  </p>
                  <div className="mockup-code text-xs">
                    <pre><code>function listIP(</code></pre>
                    <pre><code>  address nftContract,</code></pre>
                    <pre><code>  uint256 tokenId,</code></pre>
                    <pre><code>  uint256 price</code></pre>
                    <pre><code>)</code></pre>
                    <pre><code></code></pre>
                    <pre><code>function purchaseIP(</code></pre>
                    <pre><code>  bytes32 listingId</code></pre>
                    <pre><code>)</code></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div id="api" className="mt-2"></div>
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body p-4 md:p-6">
            <h2 className="card-title text-xl md:text-2xl mb-4">
              <FaNetworkWired className="w-5 h-5 md:w-6 md:h-6" />
              API Endpoints
            </h2>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="table table-zebra table-xs sm:table-sm md:table-md">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                    <th>Auth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/auth/nonce/:wallet</code></td>
                    <td>Get authentication nonce</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/auth/login</code></td>
                    <td>Authenticate with signature</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/users/signup</code></td>
                    <td>Create new user account</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/users/:id</code></td>
                    <td>Get user profile</td>
                    <td>JWT</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/assets/nft</code></td>
                    <td>Create NFT asset</td>
                    <td>JWT</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/assets/ip</code></td>
                    <td>Register IP on Story Protocol</td>
                    <td>JWT</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/assets/marketplace</code></td>
                    <td>Get marketplace listings</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/assets/marketplace/list</code></td>
                    <td>List asset on marketplace</td>
                    <td>JWT</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/assets/marketplace/purchase</code></td>
                    <td>Purchase listed asset</td>
                    <td>JWT</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/assets/user/:wallet</code></td>
                    <td>Get user&apos;s assets</td>
                    <td>JWT</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Network Configuration */}
        <div id="network" className="mt-2"></div>
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body p-4 md:p-6">
            <h2 className="card-title text-xl md:text-2xl mb-4">
              <FaNetworkWired className="w-5 h-5 md:w-6 md:h-6" />
              Network Configuration
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">Story Protocol Testnet</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-base-content/70">Network Name:</span>
                    <span className="font-mono text-right">Story Protocol Testnet</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-base-content/70">Chain ID:</span>
                    <span className="font-mono">1513 (0x5E9)</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-base-content/70">RPC URL:</span>
                    <span className="font-mono text-xs break-all text-right">https://testnet.storyrpc.io</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-base-content/70">Currency:</span>
                    <span className="font-mono">IP</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-base-content/70">Explorer:</span>
                    <a 
                      href="https://testnet.storyscan.xyz" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link link-primary font-mono text-xs break-all text-right"
                    >
                      testnet.storyscan.xyz
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-3">Environment Variables</h3>
                <div className="mockup-code text-[10px] sm:text-xs">
                  <pre><code># Frontend (.env)</code></pre>
                  <pre><code>NEXT_PUBLIC_API_ENDPOINT=https://klaim.onrender.com</code></pre>
                  <pre><code>NEXT_PUBLIC_PINATA_JWT=your_jwt</code></pre>
                  <pre><code>NEXT_PUBLIC_IP_TOKEN_ADDRESS=0x...</code></pre>
                  <pre><code>NEXT_PUBLIC_IP_CREATOR_ADDRESS=0x...</code></pre>
                  <pre><code></code></pre>
                  <pre><code># Backend (.env)</code></pre>
                  <pre><code>RPC_URL=https://testnet.storyrpc.io</code></pre>
                  <pre><code>MONGODB_URI=mongodb://...</code></pre>
                  <pre><code>JWT_SECRET=your_secret_key</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Models */}
        <div id="data-models" className="mt-2"></div>
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              <FaCode className="w-6 h-6" />
              Data Models
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">User Schema</h3>
                <div className="mockup-code text-xs">
                  <pre><code>{`{`}</code></pre>
                  <pre><code>  wallet: String (unique, lowercase),</code></pre>
                  <pre><code>  nonce: String (unique),</code></pre>
                  <pre><code>  profileName: String,</code></pre>
                  <pre><code>  createdAt: Date,</code></pre>
                  <pre><code>  updatedAt: Date</code></pre>
                  <pre><code>{`}`}</code></pre>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2">Asset Schema</h3>
                <div className="mockup-code text-xs">
                  <pre><code>{`{`}</code></pre>
                  <pre><code>  tokenId: String,</code></pre>
                  <pre><code>  ipId: String,</code></pre>
                  <pre><code>  owner: String (wallet),</code></pre>
                  <pre><code>  metadataURI: String,</code></pre>
                  <pre><code>  licenseTermsId: String,</code></pre>
                  <pre><code>  listed: Boolean,</code></pre>
                  <pre><code>  price: Number</code></pre>
                  <pre><code>{`}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Setup */}
        <div id="dev-setup" className="mt-2"></div>
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              <FaGithub className="w-6 h-6" />
              Development Setup
            </h2>
            <div className="space-y-4">
              <div className="mockup-code">
                <pre data-prefix="$"><code>git clone https://github.com/your-repo/klaimit.git</code></pre>
                <pre data-prefix="$"><code>cd klaimit</code></pre>
                <pre data-prefix="$"><code></code></pre>
                <pre data-prefix="$"><code># Install dependencies</code></pre>
                <pre data-prefix="$"><code>cd server && npm install</code></pre>
                <pre data-prefix="$"><code>cd ../client && npm install</code></pre>
                <pre data-prefix="$"><code></code></pre>
                <pre data-prefix="$"><code># Setup environment</code></pre>
                <pre data-prefix="$"><code>cp server/.env.example server/.env</code></pre>
                <pre data-prefix="$"><code>cp client/.env.example client/.env.local</code></pre>
                <pre data-prefix="$"><code></code></pre>
                <pre data-prefix="$"><code># Start MongoDB</code></pre>
                <pre data-prefix="$"><code>mongod</code></pre>
                <pre data-prefix="$"><code></code></pre>
                <pre data-prefix="$"><code># Start backend (terminal 1)</code></pre>
                <pre data-prefix="$"><code>cd server && npm run start:dev</code></pre>
                <pre data-prefix="$"><code></code></pre>
                <pre data-prefix="$"><code># Start frontend (terminal 2)</code></pre>
                <pre data-prefix="$"><code>cd client && npm run dev</code></pre>
              </div>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div id="resources" className="mt-2"></div>
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body p-4 md:p-6">
            <h2 className="card-title text-xl md:text-2xl mb-4">Additional Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <a 
                href="https://docs.story.foundation/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-primary-content"
              >
                <FaBook className="w-4 h-4" />
                Story Protocol Docs
              </a>
              <a 
                href="https://testnet.storyscan.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-primary-content"
              >
                Block Explorer
              </a>
              <a 
                href="/faq" 
                className="btn btn-outline btn-primary-content"
              >
                FAQ for Beginners
              </a>
              <a 
                href="https://github.com/your-repo/klaimit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-primary-content"
              >
                <FaGithub className="w-4 h-4" />
                GitHub Repository
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
