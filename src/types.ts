import { Interaction } from 'discord.js'
export interface GameState {
  players: PlayerArray
  hp: number
}

export interface Player {
  username: string
  asset: string
  hp: number
}

export interface Match {
  player1: Player
  player2: Player
  hp: number
}

export type PlayerArray = Player[]

export interface Game {
  round: Round
  players: PlayerArray
}

export type Round =
  | 'roundOne'
  | 'roundTwo'
  | 'semiFinals'
  | 'finals'
  | 'gameover'

export type ObserveTime = number | null

export type AssetId = {
  name: string
  type: string
  value: number
}

export type WalletAddress = {
  name: string
  type: string
  value: string
}

type DiscordOptions = {
  _hoistedOptions: (AssetId | WalletAddress)[]
}

export type Asset = {
  [key: string]: number | boolean
  amount: number
  'asset-id': number
  'is-frozen': boolean
}
export interface RegisterInteraction extends Interaction {
  options: AssetId | WalletAddress
}
