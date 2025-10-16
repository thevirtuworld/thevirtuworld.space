'use client';

import dynamic from 'next/dynamic';
import WalletConnect from '@/components/WalletConnect';
import AssetForge from '@/components/AssetForge';
import GenesisGallery from '@/components/GenesisGallery';

// Force dynamic rendering to avoid SSR issues with Appwrite
export const dynamic = 'force-dynamic';

export default function GenesisPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              theVirtuworld
            </h1>
            <p className="text-xs text-gray-500">AI-Forged Worlds, Secured by Bitcoin</p>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Genesis Gallery
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Mint unique assets whose essence is tied to the live state of the Bitcoin blockchain via Stacks
          </p>
        </div>
      </section>

      {/* Forge Section */}
      <section className="py-12 px-4 bg-gray-950">
        <AssetForge />
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4">
        <GenesisGallery />
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>Built on Stacks • Secured by Bitcoin • Powered by AI</p>
          <p className="mt-2">Each asset is a unique imprint of the blockchain state at the moment of creation</p>
        </div>
      </footer>
    </div>
  );
}
