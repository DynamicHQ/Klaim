'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Inter, Oswald } from "next/font/google";
import { FaWallet, FaCheck } from 'react-icons/fa';
import { connectWallet, getConnectedWallet, initializeStorage } from '@/utils/mockData';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    initializeStorage();
    setWallet(getConnectedWallet());
  }, []);

  const handleConnectWallet = () => {
    const newWallet = connectWallet();
    setWallet(newWallet);
    alert('Wallet connected successfully!');
  };

  return (
    <main className="bg-background flex flex-col items-center justify-between">
      <div className="hero min-h-screen bg-main/5 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-x-auto">
          <img src="/offsetBlobs.svg" className="h-full w-full object-cover object-right" />
        </div>
        <div className="hero-content text-center">
          <div className="max-w-xl md:max-w-lg sm:max-w-md flex flex-col gap-6">
            <div>
              <h1 className={`text-6xl ${oswald.variable} text-primary-text font-bold break-keep`}>Discover. Collect. </h1>
              <h1 className={`text-6xl ${oswald.variable} text-primary-text font-bold`}><span className="text-main">Klaim</span> your IP</h1>
            </div>
            <p className={`${inter.variable} py-6 text-secondary-text text-lg`}>
              Explore the world of digital ownership with Klaim, the premier platform for creating, managing, and trading IPs. Join our community of creators and collectors today!
            </p>
            
            {wallet ? (
              <div className="flex flex-col gap-4">
                <div className="alert alert-success">
                  <FaCheck />
                  <span>Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
                </div>
                <div className="flex justify-center gap-4">
                  <button onClick={() => router.push('/create')} className="btn bg-main text-white rounded-md px-8 py-6 outline-none transition-transform duration-300 hover:-translate-y-1">Create NFT</button>
                  <button onClick={() => router.push('/marketplace')} className="btn outline-main btn-outline text-main rounded-md px-8 py-6 transition-transform duration-300 hover:-translate-y-1 hover:text-white hover:bg-main">Marketplace</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-4">
                <button onClick={handleConnectWallet} className="btn bg-main text-white rounded-md px-8 py-6 outline-none transition-transform duration-300 hover:-translate-y-1 flex items-center gap-2">
                  <FaWallet />
                  Connect Wallet
                </button>
                <a href="/docs" className="btn outline-main btn-outline text-main rounded-md px-8 py-6 transition-transform duration-300 hover:-translate-y-1 hover:text-white hover:bg-main">Learn More</a>
              </div>
            )}
          </div>
        </div>
      </div>
      <section className="w-full py-24 flex flex-col items-center gap-6">
        <h2 className={`text-5xl ${oswald.variable} text-primary-text font-bold`}>Why Choose <span className="text-main">Klaim?</span></h2>
        <h3 className={`text-xl ${oswald.variable} text-secondary-text font-bold`}>Have someone ever took credit for something you own?</h3>
        <h3 className={`text-lg ${oswald.variable} text-secondary-text font-bold`}>Not cool right?</h3>
        <p className="py-6 text-secondary-text text-lg max-w-216 mx-auto p-8">Klaimit is a website where you can upload your creative works, like art, photos, or 
          designs and keep full ownership of it. People can see your work, appreciate it, or buy the 
          right to use it but they can’t steal it. It’s safe and simple, all in few clicks.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl px-4">
          <div className="card bg-base-300 shadow-md p-6 rounded-lg">
            <h3 className={`text-2xl ${oswald.variable} font-semibold mb-4`}>User-Friendly Interface</h3>
            <p className={`${inter.variable} text-secondary-text`}>Easily navigate and manage your NFT collections with our intuitive platform.</p>
          </div>
          <div className="card bg-base-300 shadow-md p-6 rounded-lg">
            <h3 className={`text-2xl ${oswald.variable} font-semibold mb-4`}>Secure Transactions</h3>
            <p className={`${inter.variable} text-secondary-text`}>
              Experience peace of mind with our robust security measures for all your NFT dealings.
            </p>
          </div>
          <div className="card bg-base-300 shadow-md p-6 rounded-lg">
            <h3 className={`text-2xl ${oswald.variable} font-semibold mb-4`}>Vibrant Community</h3>
            <p className={`${inter.variable} text-secondary-text`}>Join a thriving community of creators and collectors passionate about digital ownership.</p>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="w-full py-12 px-4 bg-primary/5">
        <h2 className={`text-4xl ${oswald.variable} text-primary-text font-bold text-center mb-12`}>How It Works</h2>
        <h3 className={`text-lg ${oswald.variable} text-secondary-text font-300 text-center mb-12`}>Klaim makes ownership simple:</h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-100 md:after:content-[''] md:after:absolute md:after:top-10 md:after:left-[65%] md:after:w-[83%] md:after:h-0.5 md:after:bg-main md:after:opacity-30 md:after:z-10">
            <div className="w-20 h-20 bg-main/10 rounded-full flex items-center justify-center mb-4 relative z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className={`${oswald.variable} text-xl font-semibold mb-2 text-primary-text`}>Register Assets</h3>
            <p className={`${inter.variable} text-secondary-text text-sm`}>Upload your idea, share your art, photo, or concept.</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-100 md:after:content-[''] md:after:absolute md:after:top-10 md:after:left-[65%] md:after:w-[83%] md:after:h-0.5 md:after:bg-main md:after:opacity-30">
            <div className="w-20 h-20 bg-main/10 rounded-full flex items-center justify-center mb-4 relative z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className={`${oswald.variable} text-xl font-semibold mb-2 text-primary-text`}>Connect Securely</h3>
            <p className={`${inter.variable} text-secondary-text text-sm`}>We tag it as yours. Klaimit gives your upload a special digital ID that proves you’re the real owner.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-100 md:after:content-[''] md:after:absolute md:after:top-10 md:after:left-[65%] md:after:w-[83%] md:after:h-0.5 md:after:bg-main md:after:opacity-30 md:after:z-10">
            <div className="w-20 h-20 bg-main/10 rounded-full flex items-center justify-center mb-4 relative z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className={`${oswald.variable} text-xl font-semibold mb-2 text-primary-text`}>Trade or Keep</h3>
            <p className={`${inter.variable} text-secondary-text text-sm`}>You decide what to do. Keep it private, share it with the world, or trade it for tokens (like selling your idea, safely).</p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center relative ">
            <div className="w-20 h-20 bg-main/10 rounded-full flex items-center justify-center mb-4 relative z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className={`${oswald.variable} text-xl font-semibold mb-2 text-primary-text`}>Accessability</h3>
            <p className={`${inter.variable} text-secondary-text text-sm`}>Klaim allows you to keep track of your registered IP</p>
          </div>
        </div>
      </section>

      {/* Creator Spotlight Section */}
      <section className="w-full py-12 flex flex-col items-center gap-8 px-4">
        <h2 className={`text-4xl ${oswald.variable} text-primary-text font-bold text-center`}>Creator Spotlight</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Creator Card 1 */}
          <div className="card bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square overflow-hidden bg-gray-200">
              <img 
                src="https://picsum.photos/300/300?random=1" 
                alt="Creator 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <h3 className={`${oswald.variable} text-xl font-semibold text-primary-text`}>Sarah Creative</h3>
                <p className={`${inter.variable} text-sm text-accent`}>Digital Artist</p>
              </div>
              <p className={`${inter.variable} text-secondary-text text-sm`}>Award-winning digital creator with 50+ IP assets on the platform.</p>
              <div className="flex gap-2">
                <span className="badge badge-sm bg-main/10 text-main">3D Art</span>
                <span className="badge badge-sm bg-main/10 text-main">Animation</span>
              </div>
            </div>
          </div>

          {/* Creator Card 2 */}
          <div className="card bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square overflow-hidden bg-gray-200">
              <img 
                src="https://picsum.photos/300/300?random=2" 
                alt="Creator 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <h3 className={`${oswald.variable} text-xl font-semibold text-primary-text`}>Alex Studios</h3>
                <p className={`${inter.variable} text-sm text-accent`}>Game Developer</p>
              </div>
              <p className={`${inter.variable} text-secondary-text text-sm`}>Innovative game assets creator with a thriving community following.</p>
              <div className="flex gap-2">
                <span className="badge badge-sm bg-main/10 text-main">Game Assets</span>
                <span className="badge badge-sm bg-main/10 text-main">UI/UX</span>
              </div>
            </div>
          </div>

          {/* Creator Card 3 */}
          <div className="card bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square overflow-hidden bg-gray-200">
              <img 
                src="https://picsum.photos/300/300?random=3" 
                alt="Creator 3"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <h3 className={`${oswald.variable} text-xl font-semibold text-primary-text`}>Jordan Visuals</h3>
                <p className={`${inter.variable} text-sm text-accent`}>Multimedia Designer</p>
              </div>
              <p className={`${inter.variable} text-secondary-text text-sm`}>Cutting-edge multimedia creator specializing in interactive experiences.</p>
              <div className="flex gap-2">
                <span className="badge badge-sm bg-main/10 text-main">VFX</span>
                <span className="badge badge-sm bg-main/10 text-main">Interactive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Provenance & Trust Section */}
      <section className="w-full py-12 px-4 bg-primary/5">
        <h2 className={`text-4xl ${oswald.variable} text-primary-text font-bold text-center mb-12`}>Provenance & Trust</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Infographic */}
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-main/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`${oswald.variable} text-lg font-semibold text-primary-text mb-2`}>Story Protocol Registration</h3>
                  <p className={`${inter.variable} text-secondary-text`}>Every asset is registered on Story Protocol, ensuring verified ownership and authenticity.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-main/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`${oswald.variable} text-lg font-semibold text-primary-text mb-2`}>On-Chain Tracking</h3>
                  <p className={`${inter.variable} text-secondary-text`}>Ownership and licensing tracked on-chain with transparent, immutable records.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-main/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`${oswald.variable} text-lg font-semibold text-primary-text mb-2`}>Verified Authenticity</h3>
                  <p className={`${inter.variable} text-secondary-text`}>Build trust through transparent verification without complex technical jargon.</p>
                </div>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="flex items-center justify-center">
              <div className="w-full aspect-square bg-linear-to-br from-main/10 to-accent/10 rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className={`${oswald.variable} text-xl font-semibold text-primary-text`}>Trust Through Technology</p>
                  <p className={`${inter.variable} text-secondary-text text-sm mt-2`}>Story Protocol Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-primary-text text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <h3 className={`${oswald.variable} text-xl font-bold`}>Klaim</h3>
              <p className={`${inter.variable} text-sm text-white/80`}>The premier platform for creating, managing, and trading digital IP assets.</p>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-3">
              <h4 className={`${oswald.variable} font-semibold mb-2`}>Navigation</h4>
              <a href="#" className={`${inter.variable} text-sm text-white/80 hover:text-white transition-colors`}>About</a>
              <a href="#" className={`${inter.variable} text-sm text-white/80 hover:text-white transition-colors`}>Docs</a>
              <a href="#" className={`${inter.variable} text-sm text-white/80 hover:text-white transition-colors`}>FAQ</a>
              <a href="#" className={`${inter.variable} text-sm text-white/80 hover:text-white transition-colors`}>Contact</a>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-3">
              <h4 className={`${oswald.variable} font-semibold mb-2`}>Legal</h4>
              <a href="#" className={`${inter.variable} text-sm text-white/80 hover:text-white transition-colors`}>Terms of Service</a>
              <a href="#" className={`${inter.variable} text-sm text-white/80 hover:text-white transition-colors`}>Privacy Policy</a>
              <a href="#" className={`${inter.variable} text-sm text-white/80 hover:text-white transition-colors`}>Licensing Info</a>
            </div>

            {/* Social */}
            <div className="flex flex-col gap-3">
              <h4 className={`${oswald.variable} font-semibold mb-2`}>Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" title="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9 2 11-1.5a4.5 4.5 0 00-1-2" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" title="Discord">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.444.865-.607 1.252a18.27 18.27 0 00-5.487 0c-.163-.387-.399-.877-.61-1.252a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.027c.462-.637.873-1.31 1.226-2.01a.077.077 0 00-.042-.107 13.107 13.107 0 01-1.872-.892.077.077 0 00-.009-.128c.126-.094.252-.192.372-.291a.074.074 0 01.076-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.009c.12.099.246.197.373.291a.077.077 0 00-.007.128c-.6.364-1.229.683-1.873.893a.078.078 0 00-.041.107c.355.7.766 1.373 1.225 2.01a.077.077 0 00.084.028 19.963 19.963 0 006.002-3.03.077.077 0 00.032-.054c.5-4.718-.838-8.812-3.549-12.456a.061.061 0 00-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.969-2.419 2.157-2.419 1.194 0 2.169 1.095 2.157 2.419 0 1.334-.969 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.969-2.419 2.157-2.419 1.194 0 2.169 1.095 2.157 2.419 0 1.334-.963 2.419-2.157 2.419z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" title="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.756 0 8.331.012 7.052.07 2.695.272.273 2.69.07 7.052.012 8.331 0 8.756 0 12s.012 3.669.07 4.948c.202 4.358 2.62 6.78 6.98 6.98 1.281.058 1.707.07 4.948.07 3.241 0 3.668-.012 4.948-.07 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.071-1.707.071-4.948 0-3.241-.012-3.668-.071-4.948-.196-4.354-2.617-6.78-6.979-6.98C15.668.012 15.259 0 12 0z" />
                    <circle cx="12" cy="12" r="3.6" />
                    <circle cx="18.406" cy="5.594" r="0.6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 pt-8">
            <p className={`${inter.variable} text-sm text-white/60 text-center`}>© 2024 Klaim. All rights reserved. | Building the future of digital IP ownership.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}