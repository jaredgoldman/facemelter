import { createMatchEmbed, createTurnEmbed } from '../discord/embeds'
import { GameState, Player, Match, PlayerArray } from '../types'
import { wait } from '../utils/sharedUtils'

let state: GameState = {
  players: [],
  hp: 0,
  embed: null,
  round: 'roundOne',
  observeTime: 0,
}

let winningPlayer: Player | undefined

let observe: number | null

const playGame = async (
  match: Match,
  observeTime: number,
  round: string,
  interaction: any
) => {
  observe = observeTime
  // reset winning player
  winningPlayer = undefined
  const { player1, player2, hp } = match
  createGameState(player1, player2, hp, round, observeTime)
  while (!winningPlayer) {
    if (observeTime) {
      await wait(observeTime)
    }
    playRound(interaction)
  }
  // console.log('***** ROUND DETAILS *****')
  // console.log('winning player: ', winningPlayer['username'])
  // console.log('player state:', state.players)

  // display winning player
  if (observeTime) {
    const matchEmbed = createMatchEmbed(winningPlayer, round)
    await state.embed.edit(matchEmbed)
    await wait(3000)
  }
  return winningPlayer
}

const createGameState = (
  player1: Player,
  player2: Player,
  hp: number,
  round: string,
  observeTime: number
): void => {
  player1.hp = hp
  player2.hp = hp

  state = {
    ...state,
    players: [player1, player2],
    hp,
    round,
    observeTime,
  }
}

const playRound = async (interaction: any) => {
  const { players, hp } = state

  if (Array.isArray(players)) {
    players.forEach((player: object, i: number) => {
      playerTurn(i, hp)
    })
    determineWinner()
    if (observe) {
      const turnEmbed = await createTurnEmbed(state)
      await state.embed.edit(turnEmbed)
      await wait(1000)
    }
  }
}

const playerTurn = (playerIndex: number, hp: number): void => {
  const player: Player = state.players[playerIndex]
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

export { playGame, state }
