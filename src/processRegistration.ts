import { User } from 'discord.js'
import {
  AssetId,
  WalletAddress,
  Asset,
  RegistrationResult,
  WalletAsset,
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
    if (unitName.splice(0, 5) !== 'RCONE') {
      return {
        status: 'asset is not a randy cone',
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
      await addPlayerAsset(discordId, assetEntry)
      return {
        status: 'New asset added to existing user',
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
        status: 'New user added with initial asset',
        asset: assetEntry,
      }
    }
  } else {
    return {
      status: 'User does not own asset',
      asset: null,
    }
  }
}

const findAsset = async (assetId: AssetId, indexer: Indexer) => {
  try {
    return await indexer.searchForAssets().index(assetId.value).do()
  } catch (error) {
    console.log('ERROR finding asset')
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
