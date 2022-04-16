import { GameState, Player, Match, PlayerArray } from './types'
import { wait } from './utils'

let state: GameState

let winningPlayer: Player | undefined

export default async function playGame(match: Match, observeTime: number) {
  // reset winning player
  winningPlayer = undefined
  const { player1, player2, hp } = match
  createGameState(player1, player2, hp)
  while (!winningPlayer) {
    if (observeTime) {
      await wait(observeTime)
    }
    playRound()
  }
  // console.log('***** ROUND DETAILS *****')
  // console.log('winning player: ', winningPlayer.username)
  // console.log('player state:', state.players)
  return winningPlayer
}

const createGameState = (
  player1: Player,
  player2: Player,
  hp: number
): void => {
  player1.hp = hp
  player2.hp = hp

  state = {
    players: [player1, player2],
    hp,
  }
}

const playRound = () => {
  const { players, hp } = state

  if (Array.isArray(players)) {
    players.forEach((player: object, i: number) => {
      playerTurn(i, hp)
    })
    determineWinner()
  }
}

const playerTurn = (i: number, hp: number): void => {
  const player: Player = state.players[i]
  const roll: number = Math.floor((Math.random() * hp) / 10)
  if (player.hp && player.hp > 0) {
    player.hp -= roll
  }
}

const determineWinner = (): Player | void => {
  const [player1, player2]: PlayerArray = state.players

  const win = player1.hp < 1 || player2.hp < 1
  if (win) {
    const winningPlayers: PlayerArray = state.players.filter(
      (player: Player) => {
        return player.hp && player.hp > 1
      }
    )
    if (winningPlayers.length === 1) {
      winningPlayer = winningPlayers[0]
      return
    }
    if (!winningPlayers.length && player1.hp === player2.hp) {
      winningPlayer = state.players[tieBreaker()]
      return
    }
    if (!winningPlayers.length && player1.hp > player2.hp) {
      winningPlayer = player1
      return
    } else {
      winningPlayer = player2
      return
    }
  }
}

const tieBreaker = (): number => {
  const num = Math.floor(Math.random() * 10)
  if (num < 5) return 0
  if (num > 5) return 1
  return 0
}
