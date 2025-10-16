'use client';

import dynamic from 'next/dynamic';
import { Box, Container, Typography, AppBar, Toolbar, Paper } from '@mui/material';
import WalletConnect from '@/components/WalletConnect';
import AssetForge from '@/components/AssetForge';
import GenesisGallery from '@/components/GenesisGallery';

// Force dynamic rendering to avoid SSR issues with Appwrite
export const dynamic = 'force-dynamic';

export default function GenesisPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(10, 22, 40, 0.8)', backdropFilter: 'blur(10px)', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              theVirtuworld
            </Typography>
            <Typography variant="caption" color="text.secondary">
              AI-Forged Worlds, Secured by Bitcoin
            </Typography>
          </Box>
          <WalletConnect />
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom
            sx={{
              background: 'linear-gradient(90deg, #4D7CFF 0%, #8A4DFF 50%, #FF4D94 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            Genesis Gallery
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Mint unique assets whose essence is tied to the live state of the Bitcoin blockchain via Stacks
          </Typography>
        </Box>
      </Container>

      {/* Forge Section */}
      <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.3)', py: 6 }}>
        <Container maxWidth="lg">
          <AssetForge />
        </Container>
      </Box>

      {/* Gallery Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GenesisGallery />
      </Container>

      {/* Footer */}
      <Paper 
        component="footer" 
        elevation={0} 
        sx={{ 
          borderTop: 1, 
          borderColor: 'divider', 
          py: 4, 
          mt: 8,
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Built on Stacks • Secured by Bitcoin • Powered by AI
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Each asset is a unique imprint of the blockchain state at the moment of creation
          </Typography>
        </Container>
      </Paper>
    </Box>
  );
}
