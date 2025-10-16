// Web3 Authentication Types
export interface Web3AuthRequest {
  email: string;
  address: string;
  signature: string;
  message: string;
}

export interface Web3AuthResponse {
  userId: string;
  secret: string;
}

// Stacks Blockchain Types
export interface BlockchainSeed {
  blockHash: string;
  blockHeight: number;
  timestamp: number;
  txCount: number;
}

// NFT Asset Types
export interface AssetMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  onChainSeed: BlockchainSeed;
}

export interface GeneratedAsset {
  id: string;
  metadata: AssetMetadata;
  imageUrl: string;
  owner: string;
  mintedAt: number;
  tokenId?: number;
}

// User Types
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
      on?: (event: string, handler: (...args: any[]) => void) => void;
      removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

export {};
