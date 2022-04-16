import {
  Player,
  Game,
  Match,
  PlayerArray,
  // NextRoundData,
} from './types'
import playGame from './game'
import {
  findGame,
  addGame,
  updateGame,
  clearGame,
  setupTestGame,
} from './database'
import { WithId } from 'mongodb'
import { asyncForEach, getNextRoundData } from './utils'

const playRound = async () => {
  // attempt to retreive game
  const game = await determineGame()
  const { players, _id: gameId } = game
  // convert players into pairs
  const matches = groupMatches(players)
  // play game with each set of players
  const winningPlayers = await playMatches(matches, game.observeTime)
  const { nextRoundType, observeTime } = getNextRoundData(winningPlayers.length)

  if (nextRoundType === 'gameover') {
    // clear game entry and display winner of tournament
    clearGame()
    console.log('TOURNAMENT OVER ', winningPlayers[0].username + ' WINS!')
  } else {
    const nextGame: Game = {
      round: nextRoundType,
      players: winningPlayers,
      observeTime,
    }
    // post back to db with winning players
    await updateGame(nextGame, gameId)
  }
  console.log('finished round: ', game.round)
}

const groupMatches = (players: PlayerArray) => {
  let matches = []
  for (let i = 0; i <= players.length - 1; i += 2) {
    const player1: Player = players[i]
    const player2: Player = players[i + 1]
    const hp = 1000

    matches.push({ player1, player2, hp })
  }
  return matches
}

const playMatches = async (
  matches: Match[],
  observeTime: number
): Promise<PlayerArray> => {
  const winningPlayers: any[] = []
  await asyncForEach(matches, async (match: Match) => {
    const winningPlayer: Player = await playGame(match, observeTime)
    winningPlayers.push(winningPlayer)
  })
  return winningPlayers
}

const determineGame = async () => {
  let game: WithId<Game | any> = await findGame()
  // if there is not already a game object, create one and add players
  if (!game) {
    console.log('adding game')
    await setupTestGame()
    await addGame()
    game = await findGame()
  } else {
    console.log('game exists')
  }
  return game
}

export { playRound }
