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
  | "roundOne"
  | "roundTwo"
  | "semiFinals"
  | "finals"
  | "gameover"

export type ObserveTime = number | null
