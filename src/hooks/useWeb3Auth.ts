'use client';

import { useState, useCallback, useEffect } from 'react';
import { account, functions } from '@/lib/appwrite';
import type { Web3AuthResponse } from '@/types/web3';

interface UseWeb3AuthReturn {
  user: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export function useWeb3Auth(): UseWeb3AuthReturn {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  const login = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!email || !email.includes('@')) {
        throw new Error('Valid email is required');
      }

      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask browser extension.');
      }

      // Connect wallet
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No wallet account selected');
      }

      const address = accounts[0];

      // Generate authentication message
      const timestamp = Date.now();
      const message = `auth-${timestamp}`;
      const fullMessage = `Sign this message to authenticate with theVirtuworld: ${message}`;

      // Request signature
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [fullMessage, address]
      });

      // Call Appwrite Function
      const execution = await functions.createExecution(
        process.env.NEXT_PUBLIC_FUNCTION_ID!,
        JSON.stringify({ email, address, signature, message }),
        false
      );

      const response: Web3AuthResponse = JSON.parse(execution.responseBody);

      if (execution.responseStatusCode !== 200) {
        throw new Error((response as any).error || 'Authentication failed');
      }

      // Create Appwrite session
      await account.createSession({
        userId: response.userId,
        secret: response.secret
      });

      // Get user data
      const userData = await account.get();
      setUser(userData);

    } catch (err: any) {
      const errorMessage = err.message || 'Authentication failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
}
