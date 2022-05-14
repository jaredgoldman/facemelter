import { Asset, Game, PlayerEntryArray, PlayerEntry } from './types'
import { mockPlayers } from './mocks/'
import { MongoClient, Db, Collection, ObjectId } from 'mongodb'
import { choosePlayers } from './utils'
const uri: string = process.env.MONGO_URI

const client = new MongoClient(uri)
client.connect()

const addPlayers = async () => {
  const database: Db = client.db('facemelter')
  const collection: Collection = database.collection('users')
  await collection.insertMany(mockPlayers)
}

const resetPlayers = async () => {
  const database: Db = client.db('facemelter')
  const collection: Collection = database.collection('users')
  await collection.deleteMany({})
}

const findGame = async () => {
  const database: Db = client.db('facemelter')
  const collection: Collection = database.collection('game')
  return await collection.findOne()
}

const getPlayers = async () => {
  const database: Db = client.db('facemelter')
  const collection: Collection = database.collection('users')
  return (await collection.find().toArray()) as PlayerEntryArray
}

const addGame = async () => {
  try {
    const players = await getPlayers()
    console.log('players', players)
    const randomizedPlayers = choosePlayers(players, 15)
    const game: Game = {
      round: 'roundOne',
      players: randomizedPlayers,
      observeTime: 0,
    }

    const database: Db = client.db('facemelter')
    const collection: Collection = database.collection('game')
    return await collection.insertOne(game)
  } catch (error) {
    console.log('error adding game', error)
  }
}

const addPlayer = async (playerData: PlayerEntry) => {
  const database: Db = client.db('facemelter')
  const collection: Collection = database.collection('users')
  return await collection.insertOne(playerData)
}

const addPlayerAsset = async (discordId: string, asset: Asset) => {
  const database: Db = client.db('facemelter')
  const collection: Collection = database.collection('users')
  const player = await collection.findOne({ discordId })
  const hasAsset = player?.assets.filter(
    (playerAsset: Asset) => playerAsset.assetId === asset.assetId
  )
  if (!hasAsset.length) {
    return collection.findOneAndUpdate(
      { discordId },
      { $set: { assets: [...player?.assets, asset] } }
    )
  } else {
    console.log('player already has asset')
  }
}

const findPlayer = async (discordId: string) => {
  const database: Db = client.db('facemelter')
  const collection: Collection = database.collection('users')
  return (await collection.findOne({ discordId })) as PlayerEntry
}

const updateGame = async (data: Game, gameId: ObjectId) => {
  const database: Db = client.db('facemelter')
  const collection: Collection = database.collection('game')
  return await collection.findOneAndReplace({ _id: gameId }, data)
}

const clearGame = async () => {
  const database: Db = client.db('facemelter')
  const collection: Collection = database.collection('game')
  return await collection.deleteMany({})
}

export {
  addPlayers,
  resetPlayers,
  findGame,
  addGame,
  updateGame,
  clearGame,
  addPlayer,
  findPlayer,
  addPlayerAsset,
}
