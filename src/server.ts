// @ts-nocheck
import { Client, Intents, Interaction } from 'discord.js'
import { playRound } from './controller'
import { players } from './mockdata'
import { processRegistration } from './processRegistration'
import { asyncForEach, wait } from './utils'
import { resetPlayers } from './database'
const token: string = process.env.DISCORD_TOKEN

const client: Client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS],
})

client.once('ready', () => {
  console.log('Melter ready!')
})

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return

  const { commandName, options, user } = interaction
  if (commandName === 'start') {
    await playRound(interaction)
  }

  if (commandName === 'register') {
    const {
      _hoistedOptions: [address, assetId],
    } = options
    const { status } = await processRegistration(user, address, assetId)

    // TODO: respond with image of registered NFT
    interaction.reply({
      content: status,
      ephemeral: true,
    })
  }

  // test registring and selecting players
  if (commandName === 'setup-test') {
    interaction.reply({
      content: 'adding test players...',
      ephemeral: true,
    })
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
})

client.login(token)
