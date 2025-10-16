'use client';

import { useState } from 'react';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { getLatestBlockData } from '@/services/blockchain';
import { generateAssetMetadata } from '@/services/assetGeneration';
import type { AssetMetadata } from '@/types/web3';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Alert,
  Grid,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { Construction, LocalFireDepartment } from '@mui/icons-material';

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
      const blockData = await getLatestBlockData();
      const userAddress = user.prefs?.walletEth || user.$id;

      const metadata = await generateAssetMetadata({
        blockchainSeed: blockData,
        userAddress,
      });

      setAsset(metadata);
    } catch (err: any) {
      setError(err.message || 'Failed to forge asset');
    } finally {
      setForging(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Card elevation={0} sx={{ bgcolor: 'background.paper' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Construction fontSize="large" color="primary" />
            <Typography variant="h4" component="h2">
              The Forge
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Create a unique asset bound to the current state of the Bitcoin network via Stacks
          </Typography>

          {!isAuthenticated ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                Connect your wallet to start forging
              </Typography>
            </Box>
          ) : (
            <Box>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={forgeAsset}
                disabled={forging}
                startIcon={forging ? <CircularProgress size={20} /> : <LocalFireDepartment />}
                sx={{
                  py: 2,
                  background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FF5722 0%, #FF9800 100%)',
                  },
                }}
              >
                {forging ? 'Forging...' : 'Forge New Asset'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {asset && (
                <Card sx={{ mt: 4, bgcolor: 'background.default' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      ✨ Asset Forged!
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box
                          component="img"
                          src={asset.image}
                          alt={asset.name}
                          sx={{
                            width: '100%',
                            aspectRatio: '1',
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>
                          {asset.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {asset.description}
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                          {asset.attributes.map((attr, i) => (
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

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" gutterBottom>
                          🔗 On-Chain Seed
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            Block: {asset.onChainSeed.blockHeight}
                          </Typography>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            Hash: {asset.onChainSeed.blockHash.slice(0, 32)}...
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
