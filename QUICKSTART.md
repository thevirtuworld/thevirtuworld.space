# 🚀 Quick Start Guide - theVirtuworld Genesis

## ⚡ 5-Minute Setup

### Prerequisites
- ✅ Node.js 18+ installed
- ✅ MetaMask browser extension
- ✅ Appwrite account (sign up at cloud.appwrite.io)

### Step 1: Clone & Install (2 min)

```bash
cd thevirtuworld.space
npm install
```

### Step 2: Configure Appwrite (2 min)

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a new project: "theVirtuworld"
3. Copy your **Project ID**

### Step 3: Deploy Auth Function (1 min)

```bash
cd ignore1/function_appwrite_web3

# Follow the deployment guide
# See USAGE_NEXT.md for detailed instructions

# Quick deploy (if you have Appwrite CLI):
appwrite deploy function
```

Copy the **Function ID** after deployment.

### Step 4: Environment Setup (30 sec)

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your-project-id-here
NEXT_PUBLIC_FUNCTION_ID=your-function-id-here

NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
```

Replace `your-project-id-here` and `your-function-id-here` with your actual IDs.

### Step 5: Run! (30 sec)

```bash
npm run dev
```

Visit **http://localhost:3000/genesis** 🎉

## 🎮 Try It Out!

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Enter your email
   - Approve MetaMask connection
   - Sign the authentication message

2. **Forge an Asset**
   - Click "⚒️ Forge New Asset"
   - Wait for blockchain data fetch
   - See your unique asset generated
   - Attributes are based on real Stacks block data!

3. **Explore Gallery**
   - View all forged assets
   - Click any asset for details
   - See blockchain provenance

## 🎯 What Makes It Special?

Each asset is **unique** because:
- Uses live Bitcoin/Stacks blockchain data as seed
- Block hash determines rarity and attributes
- Every asset is an immutable snapshot of the blockchain state
- Verifiable uniqueness and provenance

## 📖 Full Documentation

- **Setup Guide**: `GENESIS_SETUP.md`
- **Appwrite Guide**: `APPWRITE_SETUP.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`
- **PRD**: `prd.md`

## 🐛 Troubleshooting

### "MetaMask not detected"
→ Install MetaMask extension and refresh page

### "Authentication failed"
→ Check that Function ID is correct in `.env.local`

### "Failed to fetch block data"
→ Check internet connection and Stacks API availability

### Build errors
→ Ensure all dependencies installed: `npm install`

## 🎉 Next Steps

1. ✅ Get authentication working
2. 🔜 Deploy SIP-009 NFT contract
3. 🔜 Add actual NFT minting
4. 🔜 Integrate AI image generation (DALL-E/Stable Diffusion)
5. 🔜 Add marketplace functionality

## 🏆 Hackathon Ready

This implementation demonstrates:
- ✅ Web3 wallet integration
- ✅ Blockchain data as creative seed
- ✅ Unique, deterministic asset generation
- ✅ Bitcoin-secured provenance via Stacks
- ✅ Gaming-ready asset metadata

**Perfect for the Stacks Gaming Bounty!**

---

Need help? Check the detailed guides or open an issue.

Let's forge some legendary assets! ⚒️✨
