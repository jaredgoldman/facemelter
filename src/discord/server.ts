import { Client, Intents, Interaction, MessageAttachment } from 'discord.js'
import { playRound } from '../game/controller'
import { players } from '../mocks/mockdata'
import { processRegistration } from '../register'
import { asyncForEach, wait } from '../utils'
import { resetPlayers } from '../database'
import { RegistrationResult } from '../types'
import { createRegisterEmbed } from './embeds'
import { doMelt } from '../canvas'
const token: string = process.env.DISCORD_TOKEN

const client: Client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS],
})

client.once('ready', () => {
  console.log('Melter ready!')
})

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return

  const { commandName, options, user } = interaction
  if (commandName === 'start') {
    // interaction.deferReply()
    await playRound(interaction)
  }

  if (commandName === 'register') {
    interaction.deferReply()

    const address = options.getString('address')
    const assetId = options.getNumber('assetid')

    const { status, asset, registeredUser }: RegistrationResult =
      await processRegistration(user, address, assetId)

    if (asset) {
      const registerEmbed = createRegisterEmbed(asset, registeredUser)
      interaction.reply(registerEmbed)
    } else {
      interaction.reply({
        content: status,
        ephemeral: true,
      })
    }
  }

  // test registring and selecting players
  if (commandName === 'setup-test') {
    interaction.deferReply()
    await resetPlayers()
    await asyncForEach(players, async (player: any) => {
      const { user, address, assetId } = player
      await processRegistration(user, address, assetId)
      await wait(1)
    })
    interaction.editReply({
      content: 'test players added!',
      ephemeral: true,
    })
  }

  if (commandName === 'canvas') {
    // interaction.deferReply()
    // const array = [...Array(10).keys()]
    // await asyncForEach(array, async (num: number) => {
    const canvas = await doMelt(10)
    const attachment = new MessageAttachment(canvas.toBuffer(), 'test-melt.png')
    // if (num === 0) {
    await interaction.reply({ files: [attachment] })
    // } else {
    //   await interaction.editReply({ files: [attachment] })
    // }
    // await wait(1000)
    // })
  }
})

client.login(token)
