import { GameState, Player, Match, PlayerArray } from "./types"
import { wait } from "./utils"

let state: GameState

let winningPlayer: Player | undefined

const playGame = async (match: Match, observeTime: number | null) => {
  winningPlayer = undefined
  const { player1, player2, hp } = match
  state = createGameState(player1, player2, hp)
  while (!winningPlayer) {
    if (observeTime) {
      await wait(observeTime)
    }
    playRound()
  }
  console.log("WINNER", winningPlayer)
  return winningPlayer
}

const createGameState = (
  player1: Player,
  player2: Player,
  hp: number
): GameState => {
  const state: GameState = {
    players: [],
    hp: hp,
  }
  player1.hp = hp
  player2.hp = hp

  state.players = [player1, player2]
  return state
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
  const { players } = state
  const player: Player = state.players[i]
  const roll: number = Math.floor((Math.random() * hp) / 10)

  console.log(`${roll} damage done to ${players[i].username}`)

  if (player.hp && player.hp > 0) {
    player.hp -= roll
  }
}

const determineWinner = (): Player | void => {
  const players = state.players
  const win = state.players[0].hp < 1 || state.players[1].hp < 1
  if (win) {
    const winningPlayers: PlayerArray = state.players.filter(
      (player: Player) => {
        return player.hp && player.hp > 1
      }
    )
    console.log("player1 hp", state.players[0])
    console.log("player2 hp", state.players[1])
    console.log("winning players", winningPlayers)
    if (winningPlayers.length === 1) {
      console.log("1 winner")
      winningPlayer = winningPlayers[0]
      return
    }
    if (!winningPlayers.length && players[0].hp === players[1].hp) {
      console.log("TIE")
      winningPlayer = players[tieBreaker()]
      return
    }
    if (!winningPlayers.length && players[0].hp > players[1].hp) {
      console.log("player 1 wins")
      winningPlayer = players[0]
      return
    } else {
      console.log("player 2 wins")
      winningPlayer = players[1]
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

export { playGame }
