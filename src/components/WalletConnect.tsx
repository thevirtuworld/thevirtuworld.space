'use client';

import { useState } from 'react';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

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
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <div className="text-gray-300">Connected</div>
          <div className="font-mono text-xs text-gray-400">
            {user.prefs?.walletEth ? 
              `${user.prefs.walletEth.slice(0, 6)}...${user.prefs.walletEth.slice(-4)}` : 
              user.email
            }
          </div>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="flex items-center gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && (
        <div className="absolute top-full mt-2 text-red-400 text-sm">
          {error}
        </div>
      )}
    </form>
  );
}
