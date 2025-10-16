# Appwrite Configuration Guide

## Step 1: Create Appwrite Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a new project named "theVirtuworld"
3. Copy your Project ID

## Step 2: Deploy Web3 Auth Function

1. Navigate to Functions in Appwrite Console
2. Create a new function:
   - Name: `web3-auth`
   - Runtime: `Node.js 18`
   - Execute Access: `Any`

3. Deploy the function code from `ignore1/function_appwrite_web3/`:
   
   ```bash
   cd ignore1/function_appwrite_web3
   npm install
   
   # Using Appwrite CLI
   appwrite login
   appwrite init function
   appwrite deploy function
   ```

4. Copy the Function ID

## Step 3: Configure Environment Variables

Create `.env.local` in the root:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your-project-id-here
NEXT_PUBLIC_FUNCTION_ID=your-function-id-here

NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_CONTRACT_NAME=virtuworld-nft
```

## Step 4: Add Platform (Web)

1. Go to Settings > Platforms in Appwrite Console
2. Add a Web Platform:
   - Name: `theVirtuworld Web`
   - Hostname: `localhost` (for development)
   - Port: `3000`

For production, add your production domain.

## Step 5: Configure Function Permissions

In the Web3 Auth Function settings:

1. Set Execute Access to "Any"
2. Ensure the function has permissions to:
   - Create users
   - Update user preferences
   - Create user sessions

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/genesis`

3. Try to connect wallet:
   - Enter your email
   - Click "Connect Wallet"
   - Approve MetaMask connection
   - Sign the message
   - You should be authenticated!

## Troubleshooting

### Function Execution Failed
- Check function logs in Appwrite Console
- Verify FUNCTION_ID is correct
- Ensure function has proper permissions

### CORS Errors
- Add your domain to Platforms in Appwrite
- Check endpoint URL is correct

### MetaMask Not Detected
- Install MetaMask extension
- Ensure you're using a supported browser

### Session Not Persisting
- Check cookie settings in browser
- Verify domain configuration in Appwrite

## Next Steps

Once authentication works:

1. **Deploy NFT Contract** - Create and deploy SIP-009 contract to Stacks
2. **Integrate Stacks Wallet** - Add Hiro/Xverse wallet support
3. **Implement Minting** - Connect asset generation to NFT minting
4. **Add Database** - Store asset metadata in Appwrite Database
5. **Enable AI Generation** - Integrate DALL-E or Stable Diffusion for images

## Production Deployment

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Update Appwrite Platform with production domain
3. Deploy function to production Appwrite instance
4. Test authentication flow in production
5. Monitor function usage and logs

## Security Checklist

- ✅ Never expose API keys in client-side code
- ✅ Use HTTPS in production
- ✅ Validate all function inputs
- ✅ Rate limit function executions
- ✅ Monitor for suspicious activity
- ✅ Keep dependencies updated

## Resources

- [Appwrite Functions Docs](https://appwrite.io/docs/products/functions)
- [Web3 Auth Function Guide](./ignore1/function_appwrite_web3/USAGE_NEXT.md)
- [Stacks Documentation](https://docs.stacks.co)
- [Genesis Setup Guide](./GENESIS_SETUP.md)
