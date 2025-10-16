'use client';

import { useState } from 'react';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { getLatestBlockData } from '@/services/blockchain';
import { generateAssetMetadata } from '@/services/assetGeneration';
import type { AssetMetadata } from '@/types/web3';

export default function AssetForge() {
  const { user, isAuthenticated } = useWeb3Auth();
  const [forging, setForging] = useState(false);
  const [asset, setAsset] = useState<AssetMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const forgeAsset = async () => {
    if (!isAuthenticated || !user) {
      setError('Please connect your wallet first');
      return;
    }

    setForging(true);
    setError(null);

    try {
      // Get latest blockchain data
      const blockData = await getLatestBlockData();
      
      // Get user's wallet address
      const userAddress = user.prefs?.walletEth || user.$id;

      // Generate asset metadata
      const metadata = await generateAssetMetadata({
        blockchainSeed: blockData,
        userAddress,
      });

      setAsset(metadata);

      // In production, this would also:
      // 1. Upload metadata to IPFS or Arweave
      // 2. Mint NFT on Stacks blockchain
      // 3. Save to database

    } catch (err: any) {
      setError(err.message || 'Failed to forge asset');
    } finally {
      setForging(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-4">⚒️ The Forge</h2>
        <p className="text-gray-400 mb-8">
          Create a unique asset bound to the current state of the Bitcoin network via Stacks
        </p>

        {!isAuthenticated ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Connect your wallet to start forging</p>
          </div>
        ) : (
          <>
            <button
              onClick={forgeAsset}
              disabled={forging}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold text-lg rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forging ? '🔥 Forging...' : '⚒️ Forge New Asset'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {asset && (
              <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">✨ Asset Forged!</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
                    <img 
                      src={asset.image} 
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Metadata */}
                  <div>
                    <h4 className="text-2xl font-bold mb-2">{asset.name}</h4>
                    <p className="text-gray-400 text-sm mb-4">{asset.description}</p>

                    <div className="space-y-2">
                      {asset.attributes.map((attr, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-500">{attr.trait_type}:</span>
                          <span className="font-mono text-gray-300">{attr.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h5 className="text-sm font-semibold mb-2">🔗 On-Chain Seed</h5>
                      <div className="space-y-1 text-xs font-mono text-gray-400">
                        <div>Block: {asset.onChainSeed.blockHeight}</div>
                        <div className="break-all">Hash: {asset.onChainSeed.blockHash.slice(0, 32)}...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
