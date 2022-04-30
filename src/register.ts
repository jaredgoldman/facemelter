// import { User } from 'discord.js'
import {
  AssetId,
  WalletAddress,
  Asset,
  RegistrationResult,
  WalletAsset,
  User,
  VerificationResult,
} from './types'
import algosdk, { Indexer } from 'algosdk'
import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod'
import { addPlayer, findPlayer, addPlayerAsset } from './database'
// import { Asset } from 'algosdk/dist/types/src/client/v2/algod/models/types'

const algoNode: string = process.env.ALGO_NODE
const pureStakeApi: string = process.env.PURESTAKE_API
const algoIndexerNode: string = process.env.ALGO_INDEXER_NODE
const optInAssetId: number = Number(process.env.OPT_IN_ASSET_ID)

const token = {
  'X-API-Key': pureStakeApi,
}
const server: string = algoNode
const indexerServer: string = algoIndexerNode
const port = ''

const processRegistration = async (
  user: User,
  address: WalletAddress,
  assetId: AssetId
): Promise<RegistrationResult> => {
  const algodClient = new algosdk.Algodv2(token, server, port)
  const algoIndexer = new algosdk.Indexer(token, indexerServer, port)
  const { id: discordId, username } = user

  // Check if asset is owned
  const { walletOwned, assetOwned }: VerificationResult =
    await determineOwnership(algodClient, address, assetId)

  const isOwned = walletOwned && assetOwned

  if (isOwned) {
    // If owned, find full player and asset data
    const player = await findPlayer(discordId)
    const asset = await findAsset(assetId, algoIndexer)

    const {
      name: assetName,
      url: assetUrl,
      'unit-name': unitName,
    } = asset?.assets[0].params

    // Check if it's a randy cone
    if (unitName.slice(0, 5) !== 'RCONE') {
      return {
        status:
          'This asset is not a randy cone, please try again with a meltable NFT',
        asset: null,
      }
    }

    const assetEntry: Asset = {
      assetUrl,
      assetName,
      assetId: assetId.value,
      unitName,
    }

    if (player) {
      const assetCount = player.assets.length + 1
      // TODO: add check for 5 or less assets
      await addPlayerAsset(discordId, assetEntry)
      return {
        status: `Added ${unitName} for melting - this asset number ${assetCount} out of 5`,
        asset: assetEntry,
      }
    } else {
      await addPlayer({
        discordId,
        username,
        address: address.value,
        assets: [assetEntry],
      })
      return {
        status: `Added ${unitName} for melting - you can add up to 4 more assets`,
        asset: assetEntry,
      }
    }
  } else {
    const status = walletOwned
      ? `Looks like the wallet address entered doesn't hold this asset, please try again!`
      : `Looks like you haven't opted in to to asset ${optInAssetId}`
    return {
      status,
      asset: null,
    }
  }
}

const findAsset = async (assetId: AssetId, indexer: Indexer) => {
  try {
    return await indexer.searchForAssets().index(assetId.value).do()
  } catch (error) {
    throw new Error('Error finding asset')
  }
}

const determineOwnership = async function (
  algodclient: AlgodClient,
  address: WalletAddress,
  assetId: AssetId
): Promise<VerificationResult> {
  try {
    let accountInfo = await algodclient.accountInformation(address.value).do()
    let assetOwned = false
    let walletOwned = false
    accountInfo.assets.forEach((asset: WalletAsset) => {
      // check for opt-in asset
      if (asset[`asset-id`] === optInAssetId && !asset.amount) {
        walletOwned = true
      }
      // check for entered asset
      if (asset['asset-id'] === assetId.value) {
        assetOwned = true
      }
    })
    return {
      assetOwned,
      walletOwned,
    }
  } catch (error) {
    throw new Error('error determening ownership')
  }
}

export { processRegistration }
