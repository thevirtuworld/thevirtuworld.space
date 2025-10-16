'use client';

import { useState, useEffect } from 'react';
import type { GeneratedAsset } from '@/types/web3';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
} from '@mui/material';
import { Close, Museum } from '@mui/icons-material';

// Mock data for demo
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
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Museum fontSize="large" color="primary" />
        <Box>
          <Typography variant="h4" component="h2">
            Genesis Gallery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore unique assets forged from the Bitcoin blockchain
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {assets.map((asset) => (
              <Grid item xs={12} sm={6} md={4} key={asset.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={asset.imageUrl}
                    alt={asset.metadata.name}
                    sx={{ bgcolor: 'background.default' }}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap gutterBottom>
                      {asset.metadata.name}
                    </Typography>
                    <Chip
                      label={asset.metadata.attributes.find(a => a.trait_type === 'Rarity')?.value}
                      size="small"
                      color="primary"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {assets.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="text.secondary">
                No assets forged yet. Be the first to create one!
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedAsset && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">{selectedAsset.metadata.name}</Typography>
              <IconButton onClick={() => setSelectedAsset(null)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={selectedAsset.imageUrl}
                    alt={selectedAsset.metadata.name}
                    sx={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: 2,
                      bgcolor: 'background.default',
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body2">
                        {selectedAsset.metadata.description}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Attributes
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {selectedAsset.metadata.attributes.map((attr, i) => (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              {attr.trait_type}:
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {attr.value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Blockchain Seed
                      </Typography>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Block Height:
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                              {selectedAsset.metadata.onChainSeed.blockHeight}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Hash:
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontFamily: 'monospace',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '200px'
                              }}
                            >
                              {selectedAsset.metadata.onChainSeed.blockHash}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Transactions:
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                              {selectedAsset.metadata.onChainSeed.txCount}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Owner
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedAsset.owner}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
