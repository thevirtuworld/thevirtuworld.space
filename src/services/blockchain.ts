import type { BlockchainSeed } from '@/types/web3';

const STACKS_API_URL = process.env.NEXT_PUBLIC_STACKS_API_URL || 'https://api.testnet.hiro.so';

/**
 * Fetches the latest block data from Stacks blockchain
 */
export async function getLatestBlockData(): Promise<BlockchainSeed> {
  try {
    const response = await fetch(`${STACKS_API_URL}/extended/v1/block`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch block data');
    }

    const data = await response.json();
    const latestBlock = data.results[0];

    return {
      blockHash: latestBlock.hash,
      blockHeight: latestBlock.height,
      timestamp: latestBlock.burn_block_time,
      txCount: latestBlock.txs.length
    };
  } catch (error) {
    console.error('Error fetching Stacks block data:', error);
    throw new Error('Unable to connect to Stacks network');
  }
}

/**
 * Fetches specific block data by height
 */
export async function getBlockByHeight(height: number): Promise<BlockchainSeed> {
  try {
    const response = await fetch(`${STACKS_API_URL}/extended/v1/block/by_height/${height}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch block data');
    }

    const block = await response.json();

    return {
      blockHash: block.hash,
      blockHeight: block.height,
      timestamp: block.burn_block_time,
      txCount: block.txs?.length || 0
    };
  } catch (error) {
    console.error('Error fetching block by height:', error);
    throw error;
  }
}

/**
 * Generates a deterministic seed from blockchain data
 */
export function generateSeedFromBlockchain(blockData: BlockchainSeed): string {
  return `${blockData.blockHash}-${blockData.blockHeight}-${blockData.timestamp}`;
}

/**
 * Fetch network info
 */
export async function getStacksNetworkInfo() {
  try {
    const response = await fetch(`${STACKS_API_URL}/v2/info`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch network info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching network info:', error);
    throw error;
  }
}
