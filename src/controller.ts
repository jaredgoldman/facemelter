import { Player, Game, Match, Round, PlayerArray, ObserveTime } from "./types"
import { playGame } from "./game"
// import { players, hp } from "./mockdata"
import { findGame, addGame, updateGame, clearGame } from "./database"
import { WithId } from "mongodb"
import { asyncForEach, getNextRoundType } from "./utils"

const playRound = async () => {
  // attempt to retreive game
  let game: WithId<Game | any> = await findGame()
  let gameId
  console.log("Playing game", game.round)
  let observeTime = game.round === "finals" ? 1000 : null
  // if there is not already a game object, create one and add players
  if (!game) {
    console.log("adding game")
    await addGame()
    game = await findGame()
    gameId = game._id
    console.log("new game added")
  } else {
    gameId = game._id
    console.log("game exists")
  }

  const { players } = game
  // convert players into pairs
  const matches = groupMatches(players)
  // play game with each set of players
  const winningPlayers = await playMatches(matches, observeTime)
  const nextRoundType: Round = getNextRoundType(winningPlayers.length)

  if (nextRoundType === "gameover") {
    // clear game entry and display winner of tournament
    clearGame(gameId)
    // console.log("TOURNAMENT OVER ", winningPlayers[0].username + " WINS!")
  } else {
    const nextGame: Game = {
      round: nextRoundType,
      players: winningPlayers,
    }
    // post back to db with winning players
    await updateGame(nextGame, gameId)
  }
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
  observeTime: ObserveTime
): Promise<PlayerArray> => {
  const winningPlayers: any[] = []
  await asyncForEach(matches, async (match: Match) => {
    const winningPlayer: Player = await playGame(match, observeTime)
    winningPlayers.push(winningPlayer)
  })
  return winningPlayers
}

export { playRound }
