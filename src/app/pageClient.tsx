"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Simulate loading for the interactive elements
const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">TheVirtuWorld</h1>
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="loading-bar h-full bg-gradient-to-r from-primary to-secondary"></div>
      </div>
      <p className="mt-4 text-sm text-gray-400">Loading Virtual Experience...</p>
    </div>
  </div>
);

const Navbar = () => (
  <nav className="fixed w-full top-0 z-40 backdrop-blur-md bg-background/70 border-b border-white/10">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary glow"></div>
          <span className="font-bold text-xl">TheVirtuWorld</span>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <Link href="#games" className="hover:text-primary transition-colors">Games</Link>
          <Link href="#creators" className="hover:text-primary transition-colors">Creators</Link>
          <Link href="#metaverse" className="hover:text-primary transition-colors">Metaverse</Link>
          <Link href="/genesis" className="hover:text-accent transition-colors">🏛️ Genesis</Link>
          <Link href="#web3" className="hover:text-primary transition-colors">Web3</Link>
        </div>
        
        <div className="flex space-x-4 items-center">
          <button className="hidden md:block px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-background transition-colors">
            Connect Wallet
          </button>
          {/* <a href="https://thevirtuworld.vercel.app/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary text-background rounded-full hover:bg-primary/80 transition-colors">
            Launch App
          </a> */}
        </div>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative min-h-screen pt-20 overflow-hidden grid-bg">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
      <div className="w-full h-full grid-bg"></div>
    </div>
    
    <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="block">The Ultimate</span>
            <span className="text-primary">Gaming Metaverse</span>
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Discover, play, create, and own in the world's largest Web3 gaming ecosystem. Real world simulation meets blockchain innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/genesis" className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full text-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 pulse text-center">
              ⚒️ Forge Assets
            </Link>
            {/* <a href="https://thevirtuworld.vercel.app/" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border border-primary/30 backdrop-blur-sm rounded-full text-lg font-semibold hover:border-primary transition-all text-center">
              Join Metaverse
            </a> */}
            <Link href="/play2d" className="px-8 py-4 border border-accent/30 backdrop-blur-sm rounded-full text-lg font-semibold hover:border-accent transition-all text-center">
              AI Simulation
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-gray-800"></div>
              ))}
            </div>
            <p className="text-gray-400">
              <span className="text-white font-semibold">10k+</span> players online
            </p>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative">
          <div className="relative w-full h-[500px] float">
            <div className="absolute w-full h-full rounded-2xl overflow-hidden border border-white/10 glow">
              {/* Hero image with gameplay.png as background */}
              <Image 
                src="/images/gameplay.png" 
                alt="TheVirtuWorld Gameplay" 
                layout="fill" 
                objectFit="cover" 
                className="w-full h-full"
              />
            </div>
            <div className="absolute -top-5 -right-5 w-24 h-24 bg-accent/20 backdrop-blur-md rounded-xl p-4 border border-accent/30 pulse">
              <div className="text-sm font-semibold">NFT</div>
              <div className="text-lg font-bold">Assets</div>
            </div>
            <div className="absolute bottom-10 -left-10 w-32 h-32 bg-purple/20 backdrop-blur-md rounded-xl p-4 border border-purple/30 pulse overflow-hidden">
              <Image 
                src="/images/gameplay.png" 
                alt="Web3 Powered" 
                layout="fill" 
                objectFit="cover" 
                className="absolute inset-0 opacity-50 z-0" 
              />
              <div className="relative z-10">
                <div className="text-sm font-semibold">Web3</div>
                <div className="text-lg font-bold">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-1 animate-bounce"></div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturedGames = () => (
  <section id="games" className="py-20 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold mb-2">Featured Games</h2>
      <p className="text-xl text-gray-400 mb-12">Experience the best of our virtual world</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="game-card bg-gray-900/50 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all group hover:transform hover:scale-[1.02]">
            <div className="h-48 w-full relative bg-gradient-to-br from-purple/20 to-cyan/20">
              {/* Add gameplay image to each game card */}
              <Image 
                src="/images/gameplay.png" 
                alt={`Virtual Game ${i} gameplay`} 
                layout="fill" 
                objectFit="cover" 
                className="w-full h-full"
              />
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                Web3
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Virtual Game {i}</h3>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-sm">4.{9-i}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">An immersive experience in the virtual world.</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                  <span className="ml-2 text-sm">Studio {i}</span>
                </div>
                <button className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20">
                  Play Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <button className="px-6 py-3 border border-white/10 rounded-full hover:border-primary/50 transition-all">
          View All Games
        </button>
      </div>
    </div>
  </section>
);

const Metaverse = () => (
  <section id="metaverse" className="py-20 relative overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <div className="grid-bg w-full h-full"></div>
    </div>
    
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-bold mb-6">The Real World Simulation</h2>
          <p className="text-xl mb-8 text-gray-300">
            Our metaverse provides the foundation for all games, simulating real world physics, economies, and social interactions. Build anything imaginable on our virtual world platform.
          </p>
          <ul className="space-y-4">
            {["Persistent World", "Real Physics", "Dynamic Economy", "Cross-Game Assets"].map((feature) => (
              <li key={feature} className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {/* <a href="https://thevirtuworld.vercel.app/" target="_blank" rel="noopener noreferrer" className="mt-8 px-6 py-3 bg-primary text-background rounded-full hover:bg-primary/80 transition-colors inline-block">
            Explore Metaverse
          </a> */}
        </div>
        
        <div className="lg:w-1/2 h-[400px] relative">
          <div className="absolute w-full h-full rounded-2xl overflow-hidden border border-white/10 glow">
            <div className="w-full h-full bg-gradient-to-br from-purple/20 to-cyan/20"></div>
          </div>
          <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-secondary/20 backdrop-blur-md rounded-xl p-4 border border-secondary/30 float">
            <div className="text-sm font-semibold">Infinite</div>
            <div className="text-lg font-bold">Possibilities</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CreatorSection = () => (
  <section id="creators" className="py-20 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold mb-2">Game Creators</h2>
      <p className="text-xl text-gray-400 mb-12">Build and monetize your own games in our ecosystem</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-gray-900/50 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 p-8">
          <h3 className="text-2xl font-bold mb-4">Developer Tools</h3>
          <p className="text-gray-300 mb-6">
            Access powerful tools to build, test, and deploy your games in our metaverse. No complex blockchain knowledge required.
          </p>
          <ul className="space-y-3 mb-8">
            {["SDK Access", "Asset Marketplace", "Testing Environment", "Revenue Sharing"].map((tool) => (
              <li key={tool} className="flex items-center text-gray-400">
                <span className="text-primary mr-2">→</span>
                <span>{tool}</span>
              </li>
            ))}
          </ul>
          <button className="px-6 py-3 border border-primary text-primary rounded-full hover:bg-primary hover:text-background transition-colors">
            Get Started
          </button>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 p-8">
          <h3 className="text-2xl font-bold mb-4">Creator Economy</h3>
          <p className="text-gray-300 mb-6">
            Earn from your creations with our blockchain-powered marketplace. Sell games, assets, and experiences.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {["NFT Integration", "Royalty System", "Cross-Game Assets", "Developer Analytics"].map((feature) => (
              <div key={feature} className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Feature</div>
                <div className="font-semibold">{feature}</div>
              </div>
            ))}
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-primary to-purple text-background rounded-full hover:opacity-90 transition-opacity">
            Join Creator Program
          </button>
        </div>
      </div>
    </div>
  </section>
);

const Web3Section = () => (
  <section id="web3" className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-gray-900/50">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold mb-2">Web3 Integration</h2>
      <p className="text-xl text-gray-400 mb-12">True ownership in the virtual world</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "Digital Ownership",
            description: "Own your game assets as NFTs that can be traded, sold or used across multiple games",
            icon: "🌐"
          },
          {
            title: "Blockchain Gaming",
            description: "Experience transparent gameplay with verifiable random outcomes and secure transactions",
            icon: "⛓️"
          },
          {
            title: "Play to Earn",
            description: "Earn rewards through gameplay that have real-world value on our marketplace",
            icon: "💰"
          }
        ].map((card) => (
          <div key={card.title} className="bg-gray-900/50 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 p-6 hover:border-primary/30 transition-all group">
            <div className="text-3xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
            <p className="text-gray-400">{card.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-16 bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
            <p className="text-gray-300 mb-6">
              Link your Web3 wallet to start collecting, trading, and earning in the TheVirtuWorld ecosystem.
            </p>
          </div>
          <div className="md:w-1/2 flex flex-wrap justify-center gap-4">
            {["MetaMask", "Coinbase", "WalletConnect", "Phantom"].map((wallet) => (
              <button key={wallet} className="px-6 py-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors">
                {wallet}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-white/10 py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <span className="font-bold text-xl">TheVirtuWorld</span>
          </div>
          <p className="text-gray-400">
            The ultimate gaming metaverse powered by Web3 technology.
          </p>
        </div>
        
        {["Platform", "Resources", "Company"].map((section) => (
          <div key={section}>
            <h3 className="font-bold mb-6">{section}</h3>
            <ul className="space-y-4">
              {["Games", "Creators", "Marketplace", "Support"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-500 text-sm">
          © 2023 TheVirtuWorld. All rights reserved.
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          {["Twitter", "Discord", "GitHub", "Medium"].map((social) => (
            <a key={social} href="#" className="text-gray-400 hover:text-primary transition-colors">
              {social}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default function PageClient() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="min-h-screen">
        <Navbar />
        <HeroSection />
        <FeaturedGames />
        <Metaverse />
        <CreatorSection />
        <Web3Section />
        <Footer />
      </div>
    </>
  );
}