import { MessageEmbed, MessageEditOptions, MessageOptions } from 'discord.js'
import { GameState, PlayerArray, RoundTypes, Player } from './types'

const roundNames: RoundTypes = {
  roundOne: 'Round one',
  roundTwo: 'Round two',
  semiFinals: 'Semi finals',
  finals: 'Finals',
}

const createInitialEmbed = (round: string) => {
  // create welcome embed
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${roundNames[round]} started!`)
    .setDescription('this is the initial embed')
  return {
    embeds: [embed],
    fetchReply: true,
  }
}

const createTurnEmbed = (state: GameState) => {
  const { players, round } = state
  const hpFields = players.map((player) => {
    return {
      name: player.username,
      value: player.hp.toString(),
    }
  })
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${roundNames[round]}`)
    .setDescription(`Who will survive the meltening?`)
    .addFields(hpFields)
  return {
    embeds: [embed],
    fetchReply: true,
  }
}

const createMatchEmbed = (winningPlayer: Player, round: string) => {
  const { username } = winningPlayer
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Results from ${roundNames[round]}`)
    .setDescription(`${username} has won the match`)

  return {
    embeds: [embed],
    fetchReply: true,
  }
}

// Create round result embed
const createRoundEmbed = (winningPlayers: PlayerArray, round: string) => {
  // const buttonRow = createButton()
  const playerFields = winningPlayers.map((player) => {
    return { name: `<@${player.discordId}>`, value: player.username }
  })

  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${roundNames[round]} completed`)
    .setDescription('Behold, our fearless survivors')
    // .setThumbnail('')
    .addFields(playerFields)
  return {
    embeds: [embed],
    fetchReply: true,
  }
}

const createWinningEmbed = (winningPlayer: Player) => {
  const { username } = winningPlayer
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`WINNER`)
    .setDescription(`${username} has won the tournamnet!`)
  return {
    embeds: [embed],
    fetchReply: true,
  }
}

export {
  createRoundEmbed,
  createInitialEmbed,
  createTurnEmbed,
  createMatchEmbed,
  createWinningEmbed,
}
