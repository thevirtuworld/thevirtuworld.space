import { Client, Account, Functions } from 'appwrite';

// Only initialize client in browser environment
const getClient = () => {
  if (typeof window === 'undefined') {
    // Return a minimal client for SSR that won't be used
    return new Client();
  }
  
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '';
  
  if (!endpoint || !project) {
    console.warn('Appwrite configuration missing. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT');
  }
  
  return new Client()
    .setEndpoint(endpoint)
    .setProject(project);
};

export const client = getClient();
export const account = new Account(client);
export const functions = new Functions(client);
