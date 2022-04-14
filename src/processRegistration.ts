import { GuildMember } from 'discord.js'
import { AssetId, WalletAddress, Asset } from './types'
import algosdk, { Indexer } from 'algosdk'
import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod'
const algoNode: string = process.env.ALGO_NODE
const pureStakeApi: string = process.env.PURESTAKE_API
const algoIndexerNode: string = process.env.ALGO_INDEXER_NODE
// user registers with wallet address and asset id
// use algo indexer to pull down asset
// if there is an asset
// enter into database
// if not
// send rejected embed

const processRegistration = async (
  user: GuildMember,
  address: WalletAddress,
  assetId: AssetId
) => {
  const token = {
    'X-API-Key': pureStakeApi,
  }
  const server: string = algoNode
  const indexerServer: string = algoIndexerNode
  const port = ''
  const algodClient = new algosdk.Algodv2(token, server, port)

  const isOwned: boolean | void = await determineOwnership(
    algodClient,
    address,
    assetId
  )
  if (isOwned) {
    const algoIndexer = new algosdk.Indexer(token, indexerServer, port)
    const asset = await findAsset(assetId, algoIndexer)
    console.log('user has asset', asset)
  } else {
    console.log('user does not have asset')
  }
}

const findAsset = async (assetId: AssetId, indexer: Indexer) => {
  try {
    return await indexer.searchForAssets().index(assetId.value).do()
  } catch (error) {
    console.log('ERROR', error)
  }
}

const determineOwnership = async function (
  algodclient: AlgodClient,
  address: WalletAddress,
  assetId: AssetId
): Promise<boolean | void> {
  // note: if you have an indexer instance available it is easier to just search accounts for an asset
  let accountInfo = await algodclient.accountInformation(address.value).do()
  accountInfo.assets.forEach((asset: Asset) => {
    if (asset['asset-id'] === assetId.value) {
      return true
    } else {
      return false
    }
  })
}

export { processRegistration }
