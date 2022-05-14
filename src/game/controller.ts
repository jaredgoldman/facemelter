import { Player, Game, Match, PlayerArray } from '../types'
import { playGame, state } from './game'
import { findGame, addGame, updateGame, clearGame } from '../database'
import { WithId } from 'mongodb'
import { asyncForEach, getNextRoundData, wait } from '../utils'
import {
  createRoundEmbed,
  createWinningEmbed,
  createInitialEmbed,
  createNextMatchEmbed,
} from '../discord/embeds'
import { InteractionReplyOptions } from 'discord.js'

/*
  Players series of matches for each round
*/
const playRound = async (interaction: any) => {
  // attempt to retreive game
  const game = await determineGame()
  const { players, _id: gameId, round } = game
  // create initial embed
  const initialEmbed: InteractionReplyOptions = createInitialEmbed(round)
  state.embed = await interaction.reply(initialEmbed)
  await wait(1000)
  // convert players into pairs
  const matches = groupMatches(players)
  // play game with each set of players
  const winningPlayers = await playMatches(
    matches,
    game.observeTime,
    round,
    interaction
  )
  const { nextRoundType, observeTime } = getNextRoundData(winningPlayers.length)

  if (nextRoundType === 'gameover') {
    // clear game entry and display winner of tournament
    clearGame()
    const winningEmbed: InteractionReplyOptions = createWinningEmbed(
      winningPlayers[0]
    )
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
  const roundEmbed: InteractionReplyOptions = createRoundEmbed(
    winningPlayers,
    round
  )
  await state.embed.edit(roundEmbed)
  return winningPlayers
}

const groupMatches = (players: PlayerArray) => {
  let matches = []
  for (let i = 0; i <= players.length - 1; i += 2) {
    const player1: Player = players[i]
    const player2: Player = players[i + 1]
    const hp = 100

    matches.push({ player1, player2, hp })
  }
  return matches
}

const playMatches = async (
  matches: Match[],
  observeTime: number,
  round: string,
  interaction: any
): Promise<PlayerArray> => {
  const winningPlayers: any[] = []
  await asyncForEach(matches, async (match: Match, i: number) => {
    if (observeTime && round !== 'finals') {
      // update embed to show next match is starting
      const currentMatch = i + 1
      const matchesLength = matches.length
      const nextMatchEmbed: InteractionReplyOptions = createNextMatchEmbed(
        currentMatch,
        matchesLength
      )
      await state.embed.edit(nextMatchEmbed)
      await wait(1000)
    }
    const winningPlayer: Player = await playGame(
      match,
      observeTime,
      round,
      interaction
    )
    winningPlayers.push(winningPlayer)
  })
  return winningPlayers
}

const determineGame = async () => {
  let game: WithId<Game | any> = await findGame()
  // if there is not already a game object, create one and add players
  if (!game) {
    console.log('game does not exist')
    await addGame()
    game = await findGame()
  } else {
    console.log('game exists')
  }
  return game
}

export { playRound }
