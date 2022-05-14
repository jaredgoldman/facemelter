import { Client, Intents, MessageAttachment } from 'discord.js'
import { playRound } from '../game/controller'
import { mockPlayers, mockAssets } from '../mocks'
import { processRegistration } from '../register'
import { asyncForEach, wait } from '../utils'
import { resetPlayers } from '../database'
import { RegistrationResult } from '../types'
import { createRegisterEmbed } from './embeds'
import { main as doCanvas } from '../canvas'
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

  /*
   *****************
   * TEST COMMANDS *
   *****************
   */

  // test registring and selecting players
  if (commandName === 'setup-test') {
    interaction.deferReply()
    await resetPlayers()
    await asyncForEach(mockPlayers, async (player: any) => {
      const { user, address, assetId } = player
      await processRegistration(user, address, assetId)
      await wait(1)
    })
    interaction.editReply({
      content: 'test players added!',
      ephemeral: true,
    })
  }

  // for testing purposes
  if (commandName === 'canvas') {
    try {
      const canvas = await doCanvas(null, 10, mockAssets)
      const attachment = new MessageAttachment(
        canvas.toBuffer('image/png'),
        'test-melt.png'
      )
      await interaction.reply({ files: [attachment] })
    } catch (error) {
      console.log(error)
    }
  }
})

client.login(token)
