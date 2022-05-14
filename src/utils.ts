import { PlayerEntryArray, PlayerEntry, PlayerArray, Asset } from './types'
import axios from 'axios'
import fs from 'fs'

export const wait = async (duration: number) => {
  await new Promise((res) => {
    setTimeout(res, duration)
  })
}

export const asyncForEach = async (array: Array<any>, callback: any) => {
  for (let index = 0; index < array.length; index++) {
    try {
      await callback(array[index], index, array)
    } catch (error) {
      console.log('ERROR', error)
    }
  }
}

export const getNextRoundData = (length: number) => {
  if (length === 16) return { nextRoundType: 'roundOne', observeTime: 0 }
  if (length === 8) return { nextRoundType: 'roundTwo', observeTime: 0 }
  if (length === 4) return { nextRoundType: 'semiFinals', observeTime: 1000 }
  if (length === 2) return { nextRoundType: 'finals', observeTime: 1000 }
  else return { nextRoundType: 'gameover', observeTime: 0 }
}

// take each player and split each asset into seperate players
const splitPlayers = (players: PlayerEntryArray): PlayerArray => {
  const newPlayerArray: PlayerArray | any = []
  players.forEach((player: PlayerEntry) => {
    const { _id, discordId, username, address } = player
    const splitEntries = player.assets.map((asset: Asset) => ({
      _id,
      discordId,
      username,
      address,
      asset,
    }))
    newPlayerArray.push(...splitEntries)
  })
  return newPlayerArray
}

// use split entries to choose random group of players
export const choosePlayers = (
  players: PlayerEntryArray,
  length: number
): PlayerArray => {
  const splitPlayerArray: PlayerArray = splitPlayers(players)
  const playerArray = []
  const randomIndexes: Array<number> = []
  while (playerArray.length < length) {
    const randomIndex: number = Math.floor(
      Math.random() * splitPlayerArray.length
    )
    if (!randomIndexes.includes(randomIndex)) {
      playerArray.push(splitPlayerArray[randomIndex])
      randomIndexes.push(randomIndex)
    }
  }
  return playerArray
}

export const downloadFile = async (
  imageUrl: string,
  directory: string
): Promise<string> => {
  const path = `${directory}/image.jpg`
  const writer = fs.createWriteStream(path)
  const res = await axios.get(imageUrl, {
    responseType: 'stream',
  })
  res.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      return resolve(path)
    })
    writer.on('error', reject)
  })
}
