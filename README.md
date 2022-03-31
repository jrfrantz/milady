# pleasebepatientwith.me | Milady NFT Marketplace

This repo controls www.pleasebepatientwith.me , a marketplace for Milady NFTs. 
You can learn more about Miladies on their website, miladymaker.net 
The project uses Opensea's smart contracts, so there are no smart contracts in this folder.

When you list your NFT, you can make the order in two places:
1. On pleasebepatientwith.me , where the fee is set to zero
2. On opensea, where the fee is set to 2.5% (since that's the only way to get it to show up on opensea)

This repo is a fork of the reservoir sample marketplace (https://reservoirprotocol.github.io/), and uses the Reservoir API to make orders. The Reservoir API is a javascript API to interact with Opensea's smart contract.

### pleasebepatientwith.me uses Opensea's smart contracts
Here is a link to a video demonstrating that the site uses Opensea's smart contract (called Wyvern). It also directly compares the messages that Opensea asks you to sign vs what's generated on pleasebepatientwith.me . (They are the same but the video explains how you can prove it to yourself as well).
https://www.loom.com/share/91c7918533c6420e84a260e64d38eadc


### Building yourself -- Install dependencies

With yarn:

```bash
$ yarn install
$ yarn dev
```

With NPM:

```bash
$ npm install
```

### Add environment variables
Make a `.env.development.local` file:

```
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_API_BASE=https://api.reservoir.tools/
NEXT_PUBLIC_COLLECTION=milady
NEXT_PUBLIC_NAVBAR_LOGO="/miladyround.png"
NEXT_PUBLIC_NAVBAR_TITLE=Im soooooo
NEXT_PUBLIC_INFURA_ID=
NEXT_PUBLIC_OPENSEA_API_KEY=
```

If you want to support cross-posting listings to OpenSea (optional), you'll need an API key.
If you edit .env variables, remember to restart your server (`yarn dev`)

### Deploy

This is a Next.js app that was deployed using [Vercel](https://vercel.com/)
