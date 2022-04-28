// import { User } from 'discord.js'
import {
  AssetId,
  WalletAddress,
  Asset,
  RegistrationResult,
  WalletAsset,
  User,
} from './types'
import algosdk, { Indexer } from 'algosdk'
import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod'
import { addPlayer, findPlayer, addPlayerAsset } from './database'

const algoNode: string = process.env.ALGO_NODE
const pureStakeApi: string = process.env.PURESTAKE_API
const algoIndexerNode: string = process.env.ALGO_INDEXER_NODE

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

  // First check if asset is owned
  const isOwned: boolean | void = await determineOwnership(
    algodClient,
    address,
    assetId
  )
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
    return {
      status: `Looks like the wallet address entered doesn't hold this asset, please try again!`,
      asset: null,
    }
  }
}

const findAsset = async (assetId: AssetId, indexer: Indexer) => {
  try {
    return await indexer.searchForAssets().index(assetId.value).do()
  } catch (error) {
    console.log('ERROR finding asset', error)
  }
}

const determineOwnership = async function (
  algodclient: AlgodClient,
  address: WalletAddress,
  assetId: AssetId
): Promise<boolean | void> {
  try {
    let accountInfo = await algodclient.accountInformation(address.value).do()
    let isOwned = false
    accountInfo.assets.forEach((asset: WalletAsset) => {
      if (asset['asset-id'] === assetId.value) {
        isOwned = true
      }
    })
    return isOwned
  } catch (error) {
    console.log('error determining ownership')
  }
  // TODO: find way to authenticate that a user actually has the wallet address
}

export { processRegistration }
