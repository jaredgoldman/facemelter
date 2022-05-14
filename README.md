# FACEMELTER

Facemelter is a discord bot that exposes a game which allows players to enter RandyCone NFTS and witness them compete against each other for survival under the hot sun. The game comprises of 4 rounds (round one, round two, semi-finals and finals) in which winning players advance through. The final two rounds feature visualizatons of each players NFTs getting melted via the canvas API.

## Getting Started

Before starting make sure to add and update a env file with the values specified below. This will require you to create a bot and assign your bot and Discord servers various tokens. Also make sure your local environment is running Node 16+. You will also have to create a new MongoDb database instance, name it facemelter and add two empty collections titled 'users' and 'game'. After creating your database instance, register the Discord slash commands by running `node dist/discord/deployCommands.js` from the root of the project. Finally, run`npm i` and then `npm start` or `npm run dev` to get the server running and interact via via slash commands in your Discord server.

### Environment Values

- MONGO_URL: string (mongodb+srv://...)
- DISCORD_TOKEN: string
- DISCORD_CLIENT_ID: string
- DISCORD_GUILD_ID: string
- ALGO_NODE: string (https://mainnet-algorand.api.purestake.io/ps2)
- ALGO_INDEXER_NODE: string (https://mainnet-algorand.api.purestake.io/idx2)
- PURESTAKE_API: string
- OPT_IN_ASSET_ID: number

### Slash Commands

#### Start

The `start` command retreives the current game object from the db and starts gameplay. If there is now active game, this will trigger the selection of 16 players at random from the pool for registered players.

#### Register

The `register` command takes a wallet address and asset id as subcommands. If the following conditions are met, as user will be registered into the face-melter:

1. Is entering a RandyCone NFT
2. The entered wallet address is in possesion of NFT entered
3. The wallet has opted-in to opt-in asset proved in the .env file (this is to prove wallet ownership)

#### Setup Test

The `setup-test` command initiates the process of registering 16 users from the `mockPlayers.ts` file. Helpful for debugging registration issues.

### Canvas

The `canvas` command sends a message featuring mock data for two entered NFTs. This command is helpful for testing image manipulation via Discord interactions.
