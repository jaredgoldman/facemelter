import { Player, Game, Match, PlayerArray } from './types'
import { playGame, state } from './game'
import { findGame, addGame, updateGame, clearGame } from './database'
import { WithId } from 'mongodb'
import { asyncForEach, getNextRoundData } from './utils'
import {
  createRoundEmbed,
  createWinningEmbed,
  createInitialEmbed,
} from './embeds'
import { InteractionReplyOptions, Interaction } from 'discord.js'

const playRound = async (interaction: any) => {
  // attempt to retreive game
  const game = await determineGame()
  const { players, _id: gameId, round } = game
  // create initial embed
  const initialEmbed: InteractionReplyOptions = createInitialEmbed(round)
  state.embed = await interaction.reply(initialEmbed)
  // convert players into pairs
  const matches = groupMatches(players)
  // play game with each set of players
  const winningPlayers = await playMatches(matches, game.observeTime, round)
  const { nextRoundType, observeTime } = getNextRoundData(winningPlayers.length)

  if (nextRoundType === 'gameover') {
    // clear game entry and display winner of tournament
    clearGame()
    const winningEmbed = createWinningEmbed(winningPlayers[0])
    return state.embed.edit(winningEmbed)
  } else {
    const nextGame: Game = {
      round: nextRoundType,
      players: winningPlayers,
      observeTime,
    }
    // post back to db with winning players
    await updateGame(nextGame, gameId)
  }
  // render round results
  const roundEmbed = createRoundEmbed(winningPlayers, round)
  await state.embed.edit(roundEmbed)
  return winningPlayers
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
  observeTime: number,
  round: string
): Promise<PlayerArray> => {
  const winningPlayers: any[] = []
  await asyncForEach(matches, async (match: Match) => {
    const winningPlayer: Player = await playGame(match, observeTime, round)
    winningPlayers.push(winningPlayer)
  })
  // update embed to show winning players of round
  return winningPlayers
}

const determineGame = async () => {
  let game: WithId<Game | any> = await findGame()
  // if there is not already a game object, create one and add players
  if (!game) {
    console.log('adding game')
    await addGame()
    game = await findGame()
  } else {
    console.log('game exists')
  }
  return game
}

export { playRound }
