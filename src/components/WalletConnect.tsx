'use client';

import { useState } from 'react';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { Wallet, Logout } from '@mui/icons-material';

export default function WalletConnect() {
  const [email, setEmail] = useState('');
  const { user, loading, error, login, logout, isAuthenticated } = useWeb3Auth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (isAuthenticated && user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Connected
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            {user.prefs?.walletEth ? 
              `${user.prefs.walletEth.slice(0, 6)}...${user.prefs.walletEth.slice(-4)}` : 
              user.email
            }
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={logout}
        >
          Disconnect
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', position: 'relative' }}>
      <TextField
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        size="small"
        required
        sx={{ minWidth: 200 }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        startIcon={<Wallet />}
      >
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </Button>
      {error && (
        <Alert severity="error" sx={{ position: 'absolute', top: '100%', mt: 1, width: '100%' }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
