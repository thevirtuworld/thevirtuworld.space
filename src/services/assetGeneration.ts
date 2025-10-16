import type { BlockchainSeed, AssetMetadata } from '@/types/web3';
import { generateSeedFromBlockchain } from './blockchain';

interface GenerationParams {
  blockchainSeed: BlockchainSeed;
  userAddress: string;
}

/**
 * Generate unique asset attributes based on blockchain data
 */
export function generateAssetAttributes(params: GenerationParams) {
  const { blockchainSeed, userAddress } = params;
  const seed = generateSeedFromBlockchain(blockchainSeed);
  
  // Use blockchain data to create deterministic randomness
  const hashNum = parseInt(blockchainSeed.blockHash.slice(0, 8), 16);
  const heightMod = blockchainSeed.blockHeight % 1000;
  const addressNum = parseInt(userAddress.slice(2, 10), 16);

  // Generate attributes based on on-chain data
  const rarity = calculateRarity(hashNum);
  const power = (heightMod % 100) + 1;
  const element = getElement(hashNum % 5);
  const generation = Math.floor(blockchainSeed.blockHeight / 1000);

  return {
    seed,
    rarity,
    power,
    element,
    generation,
    bitcoinBlock: blockchainSeed.blockHeight,
    timestamp: blockchainSeed.timestamp,
  };
}

/**
 * Generate complete asset metadata
 */
export async function generateAssetMetadata(params: GenerationParams): Promise<AssetMetadata> {
  const attributes = generateAssetAttributes(params);
  const assetType = getAssetType(attributes.rarity);
  
  // Generate deterministic name
  const name = `${attributes.element} ${assetType} #${params.blockchainSeed.blockHeight}`;
  
  // Generate lore/description
  const description = generateLore(attributes, params.blockchainSeed);

  // In a real implementation, this would call an AI image generation API
  const imageUrl = await generateAssetImage(attributes, params.blockchainSeed);

  return {
    name,
    description,
    image: imageUrl,
    attributes: [
      { trait_type: 'Rarity', value: attributes.rarity },
      { trait_type: 'Power', value: attributes.power },
      { trait_type: 'Element', value: attributes.element },
      { trait_type: 'Generation', value: attributes.generation },
      { trait_type: 'Bitcoin Block', value: attributes.bitcoinBlock },
      { trait_type: 'Forged At', value: new Date(attributes.timestamp * 1000).toISOString() },
    ],
    onChainSeed: params.blockchainSeed,
  };
}

/**
 * Calculate rarity based on hash value
 */
function calculateRarity(hashNum: number): string {
  const mod = hashNum % 100;
  if (mod < 1) return 'Legendary';
  if (mod < 5) return 'Epic';
  if (mod < 15) return 'Rare';
  if (mod < 40) return 'Uncommon';
  return 'Common';
}

/**
 * Get element based on hash
 */
function getElement(mod: number): string {
  const elements = ['Fire', 'Water', 'Earth', 'Air', 'Ether'];
  return elements[mod];
}

/**
 * Get asset type based on rarity
 */
function getAssetType(rarity: string): string {
  const types: Record<string, string> = {
    'Legendary': 'Artifact',
    'Epic': 'Relic',
    'Rare': 'Weapon',
    'Uncommon': 'Tool',
    'Common': 'Item',
  };
  return types[rarity] || 'Item';
}

/**
 * Generate lore based on attributes
 */
function generateLore(attributes: any, blockData: BlockchainSeed): string {
  return `Forged in the fires of Bitcoin block ${blockData.blockHeight}, this ${attributes.element.toLowerCase()} ${getAssetType(attributes.rarity).toLowerCase()} emerged from the digital void. Its essence is bound to the immutable hash ${blockData.blockHash.slice(0, 12)}..., carrying the power of ${attributes.power} and the rarity of ${attributes.rarity}. Only ${blockData.txCount} transactions witnessed its creation in the eternal ledger.`;
}

/**
 * Generate or fetch asset image
 * In production, this would call an AI image generation API
 */
async function generateAssetImage(attributes: any, blockData: BlockchainSeed): Promise<string> {
  // For now, return a placeholder based on element and rarity
  // In production, integrate with:
  // - DALL-E, Stable Diffusion, or Midjourney API
  // - Use blockchain seed as part of the generation prompt
  
  const prompt = `A mystical ${attributes.rarity.toLowerCase()} ${attributes.element.toLowerCase()} artifact, digital art, blockchain aesthetic, glowing effects`;
  
  // Placeholder: Generate a deterministic gradient or pattern
  // In real implementation, call AI service here
  const imageData = generatePlaceholderImage(attributes, blockData);
  
  return imageData;
}

/**
 * Generate placeholder image data URL (for demo purposes)
 */
function generatePlaceholderImage(attributes: any, blockData: BlockchainSeed): string {
  // This creates a data URL with SVG for demo
  // In production, replace with actual AI-generated image
  const colors = {
    Fire: ['#ff4444', '#ff8844'],
    Water: ['#4444ff', '#44aaff'],
    Earth: ['#885522', '#aa8844'],
    Air: ['#cccccc', '#ffffff'],
    Ether: ['#8844ff', '#cc44ff'],
  };
  
  const [color1, color2] = colors[attributes.element as keyof typeof colors] || ['#888888', '#cccccc'];
  
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad)" />
      <text x="200" y="200" text-anchor="middle" fill="white" font-size="24" font-family="monospace">
        ${attributes.element}
      </text>
      <text x="200" y="230" text-anchor="middle" fill="white" font-size="16" font-family="monospace">
        ${attributes.rarity}
      </text>
      <text x="200" y="260" text-anchor="middle" fill="white" font-size="12" font-family="monospace" opacity="0.7">
        Block: ${blockData.blockHeight}
      </text>
    </svg>
  `;
  
  // Use btoa for browser environment
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
  
  // For server-side, return the SVG directly as data URI
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
