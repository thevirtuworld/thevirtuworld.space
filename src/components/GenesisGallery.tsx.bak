'use client';

import { useState, useEffect } from 'react';
import type { GeneratedAsset } from '@/types/web3';

// Mock data for demo - in production, fetch from database/blockchain
const mockAssets: GeneratedAsset[] = [
  {
    id: '1',
    metadata: {
      name: 'Fire Artifact #123456',
      description: 'A legendary artifact forged from the blockchain...',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjQ0NDQ7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY4ODQ0O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2dyYWQpIiAvPjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSI+RmlyZTwvdGV4dD48dGV4dCB4PSIyMDAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPkxlZ2VuZGFyeTwvdGV4dD48L3N2Zz4=',
      attributes: [
        { trait_type: 'Rarity', value: 'Legendary' },
        { trait_type: 'Element', value: 'Fire' },
      ],
      onChainSeed: {
        blockHash: '0x123abc...',
        blockHeight: 123456,
        timestamp: Date.now(),
        txCount: 42
      }
    },
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjQ0NDQ7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY4ODQ0O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2dyYWQpIiAvPjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSI+RmlyZTwvdGV4dD48dGV4dCB4PSIyMDAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPkxlZ2VuZGFyeTwvdGV4dD48L3N2Zz4=',
    owner: '0x1234...5678',
    mintedAt: Date.now(),
  }
];

export default function GenesisGallery() {
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<GeneratedAsset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      // In production, fetch from API/database
      // const response = await fetch('/api/assets');
      // const data = await response.json();
      
      // For now, use mock data
      setTimeout(() => {
        setAssets(mockAssets);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load assets:', error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">🏛️ Genesis Gallery</h2>
        <p className="text-gray-400">
          Explore unique assets forged from the Bitcoin blockchain
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-blue-500 transition-all group"
              >
                <div className="aspect-square bg-gray-800">
                  <img 
                    src={asset.imageUrl} 
                    alt={asset.metadata.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold truncate">{asset.metadata.name}</h3>
                  <p className="text-sm text-gray-500">
                    {asset.metadata.attributes.find(a => a.trait_type === 'Rarity')?.value}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Detail Modal */}
          {selectedAsset && (
            <div 
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedAsset(null)}
            >
              <div 
                className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold">{selectedAsset.metadata.name}</h3>
                    <button
                      onClick={() => setSelectedAsset(null)}
                      className="text-gray-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Image */}
                    <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                      <img 
                        src={selectedAsset.imageUrl} 
                        alt={selectedAsset.metadata.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Description</h4>
                        <p className="text-gray-300">{selectedAsset.metadata.description}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Attributes</h4>
                        <div className="space-y-2">
                          {selectedAsset.metadata.attributes.map((attr, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-500">{attr.trait_type}:</span>
                              <span className="font-mono text-gray-300">{attr.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Blockchain Seed</h4>
                        <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Block Height:</span>
                            <span className="text-gray-300">{selectedAsset.metadata.onChainSeed.blockHeight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Hash:</span>
                            <span className="text-gray-300 truncate ml-2">
                              {selectedAsset.metadata.onChainSeed.blockHash}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Transactions:</span>
                            <span className="text-gray-300">{selectedAsset.metadata.onChainSeed.txCount}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Owner</h4>
                        <p className="font-mono text-sm text-gray-300">{selectedAsset.owner}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {assets.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No assets forged yet. Be the first to create one!
            </div>
          )}
        </>
      )}
    </div>
  );
}
