// Require the necessary discord.js classes
import { Client, Intents, Interaction, InteractionCollector } from 'discord.js'
import { playRound } from './controller'
import { processRegistration } from './processRegistration'
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
    playRound()
    interaction.reply({
      content: 'Game started',
      ephemeral: true,
    })
  }

  if (commandName === 'register') {
    const {
      _hoistedOptions: [address, assetId],
    } = options
    const { status } = await processRegistration(user, address, assetId)

    interaction.reply({
      content: status,
      ephemeral: true,
    })
  }
})

client.login(token)
