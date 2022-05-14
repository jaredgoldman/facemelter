import { ObjectId } from 'mongodb'

export interface GameState {
  players: PlayerArray
  hp: number
  embed?: any
  round: string
  observeTime: number
}

export interface Game {
  round: string
  players: PlayerArray
  observeTime: number
}

export interface Match {
  player1: Player
  player2: Player
  hp: number
}

export interface User {
  id: string
  username: string
}

export interface NextRoundData {
  nextRoundType: string
  observeTime: number
}
// Type for player after entries are split and hp is added
export interface Player {
  _id?: ObjectId
  address: string
  discordId: string
  username: string
  asset: Asset
  hp: number
}

export interface PlayerEntry {
  _id?: ObjectId
  discordId: string
  username: string
  address: string
  assets: Asset[]
}

export type PlayerArray = Player[] | []

export type PlayerEntryArray = PlayerEntry[] | []

export type WalletAsset = {
  [key: string]: number | boolean
  amount: number
  'asset-id': number
  'is-frozen': boolean
}

export interface Asset {
  assetUrl: string
  assetName: string
  assetId: number
  unitName: string
}

export interface RegistrationResult {
  status: string
  asset: Asset | null
  registeredUser: User
}

export interface VerificationResult {
  assetOwned: boolean
  walletOwned: boolean
}

export interface RoundTypes {
  [key: string]: string
}

export interface PlayerRegistrationEntry {}
