import { MessageEmbed, MessageAttachment } from 'discord.js'
import {
  GameState,
  PlayerArray,
  RoundTypes,
  Player,
  Asset,
  User,
} from '../types'
import { doMelt } from '../canvas'

const roundNames: RoundTypes = {
  roundOne: 'Round One',
  roundTwo: 'Round Two',
  semiFinals: 'Semi Finals',
  finals: 'Finals',
}

const createInitialEmbed = (round: string) => {
  // create welcome embed
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${roundNames[round]} started!`)

  return {
    embeds: [embed],
    fetchReply: true,
  }
}

const createTurnEmbed = (state: GameState) => {
  const { players, round } = state
  const hpFields = players.map((player) => {
    const { discordId, asset } = player
    const { unitName } = asset
    return {
      name: `<@${discordId}> - ${unitName}`,
      value: `HP: ${player.hp.toString()}`,
    }
  })

  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${roundNames[round]}`)
    .setDescription(`Who will survive the meltening?`)
    .addFields(hpFields)
    .setImage(players[0].asset.assetUrl)

  return {
    embeds: [embed],
    fetchReply: true,
  }
}

const createMatchEmbed = (winningPlayer: Player, round: string) => {
  const { username, asset } = winningPlayer
  const { unitName } = asset
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Results from ${roundNames[round]}`)
    .setDescription(`${username} has won the match with ${unitName}`)

  return {
    embeds: [embed],
    fetchReply: true,
  }
}

const createNextMatchEmbed = (currentMatch: number, matchesLength: number) => {
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Commencing match ${currentMatch} out of ${matchesLength}`)

  return {
    embeds: [embed],
    fetchReply: true,
  }
}

const createRoundEmbed = (winningPlayers: PlayerArray, round: string) => {
  const playerFields = winningPlayers.map((player) => {
    const { discordId, asset } = player
    return { name: `<@${discordId}>`, value: `${asset.unitName}` }
  })

  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${roundNames[round]} completed!`)
    .setDescription('Behold, our fearless survivors')
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

const createRegisterEmbed = (asset: Asset, user: User) => {
  const { username } = user
  const { unitName, assetUrl } = asset
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`REGISTER SUCCESS`)
    .setDescription(`${username} has entered ${unitName} for melting!`)
    .setThumbnail(assetUrl)
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
  createNextMatchEmbed,
  createWinningEmbed,
  createRegisterEmbed,
  // createCanvasEmbed,
}
