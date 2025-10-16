# theVirtuworld - Genesis Gallery Setup Guide

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Appwrite account (cloud.appwrite.io)
- Stacks wallet (optional, for mainnet)

### 2. Environment Setup

1. Copy the environment variables:
```bash
cp env.sample .env.local
```

2. Configure your `.env.local` file:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your-project-id
NEXT_PUBLIC_FUNCTION_ID=your-web3-auth-function-id
APPWRITE_API_KEY=your-api-key

# Stacks Blockchain
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
```

### 3. Deploy Appwrite Function

1. Navigate to the function directory:
```bash
cd ignore1/function_appwrite_web3
```

2. Follow the deployment instructions in `USAGE_NEXT.md`

3. Deploy the function to Appwrite:
```bash
# Using Appwrite CLI
appwrite deploy function
```

4. Copy the Function ID and update your `.env.local`

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/genesis` to see the Genesis Gallery!

## 🏗️ Architecture

### Components

- **WalletConnect** - Web3 wallet authentication using MetaMask
- **AssetForge** - Mint new assets using blockchain data as seed
- **GenesisGallery** - Display and explore minted assets

### Services

- **blockchain.ts** - Fetches live data from Stacks network
- **assetGeneration.ts** - Generates unique assets from blockchain seeds
- **appwrite.ts** - Handles authentication and backend functions

### Flow

1. User connects wallet via MetaMask
2. Appwrite function validates signature and creates session
3. User clicks "Forge New Asset"
4. System fetches latest Stacks block data
5. AI generates unique asset using block hash as seed
6. Asset metadata is created with blockchain provenance
7. NFT is minted on Stacks (SIP-009 standard)
8. Asset appears in Genesis Gallery

## 🔐 Web3 Authentication

The authentication flow uses the Appwrite Web3 function:

1. User enters email
2. MetaMask prompts for wallet connection
3. User signs authentication message
4. Function validates signature
5. Appwrite session created
6. Wallet address stored in user preferences

## 🎨 Asset Generation

Each asset is unique and deterministic based on:

- **Block Hash** - Determines rarity and visual characteristics
- **Block Height** - Used for generation number
- **Transaction Count** - Influences power attributes
- **User Address** - Ensures uniqueness per user

### Rarity Distribution

- Legendary: 1%
- Epic: 4%
- Rare: 10%
- Uncommon: 25%
- Common: 60%

## 🔗 Blockchain Integration

### Stacks Network

The platform uses Stacks blockchain for:

1. **On-chain data as seeds** - Block hashes provide randomness
2. **NFT minting** - SIP-009 standard NFTs
3. **Bitcoin security** - Assets secured by Bitcoin

### API Endpoints Used

- `GET /extended/v1/block` - Latest blocks
- `GET /extended/v1/block/by_height/{height}` - Specific block
- `GET /v2/info` - Network information

## 📝 Next Steps

### Phase 1: Core Features (Current)
- ✅ Web3 authentication
- ✅ Blockchain data fetching
- ✅ Asset generation
- ✅ Genesis Gallery UI

### Phase 2: NFT Minting
- [ ] Deploy SIP-009 NFT contract
- [ ] Integrate Stacks wallet (Hiro/Xverse)
- [ ] Implement minting transaction
- [ ] Store metadata on-chain or IPFS

### Phase 3: AI Enhancement
- [ ] Integrate DALL-E or Stable Diffusion
- [ ] Generate unique images from blockchain seeds
- [ ] Create lore using GPT-4
- [ ] Dynamic trait generation

### Phase 4: Game Features
- [ ] Asset utility in game world
- [ ] Trading marketplace
- [ ] Crafting system
- [ ] Multiplayer integration

## 🛠️ Troubleshooting

### MetaMask Not Detected
- Install MetaMask extension
- Refresh the page
- Check browser compatibility

### Authentication Fails
- Verify Appwrite function is deployed
- Check function logs in Appwrite console
- Ensure FUNCTION_ID is correct in .env.local

### Blockchain Data Not Loading
- Check Stacks API status
- Verify network (testnet vs mainnet)
- Check API URL in environment variables

## 📚 Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Stacks Documentation](https://docs.stacks.co)
- [SIP-009 NFT Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md)
- [MetaMask Documentation](https://docs.metamask.io)

## 🎯 Hackathon Submission

This project demonstrates:

1. **AI-Generated Assets** - Unique content from blockchain data
2. **Bitcoin Security** - Assets tied to Bitcoin via Stacks
3. **Web3 Integration** - Wallet authentication and NFT minting
4. **Gaming Innovation** - Blockchain-native game economy

Built for the Stacks Hackathon Gaming Bounty 🏆
