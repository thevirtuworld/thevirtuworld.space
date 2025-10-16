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
  const [mounted, setMounted] = useState(false);

  // Check if user is already authenticated (only in browser)
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const userData = await account.get();
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  const login = useCallback(async (email: string) => {
    if (typeof window === 'undefined') {
      throw new Error('Login is only available in browser environment');
    }

    setLoading(true);
    setError(null);

    try {
      if (!email || !email.includes('@')) {
        throw new Error('Valid email is required');
      }

      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask browser extension.');
      }

      // Check if Appwrite is configured
      const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
      const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
      const functionId = process.env.NEXT_PUBLIC_FUNCTION_ID;
      
      if (!endpoint || !project || !functionId) {
        throw new Error('Appwrite is not configured. Please set environment variables.');
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
        functionId,
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
    if (typeof window === 'undefined') return;
    
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Return safe defaults during SSR
  if (!mounted) {
    return {
      user: null,
      loading: false,
      error: null,
      login: async () => {},
      logout: async () => {},
      isAuthenticated: false
    };
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
}
