import dotenv from 'dotenv'
dotenv.config()
import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

const clientId: string = process.env.DISCORD_CLIENT_ID
const guildId: string = process.env.DISCORD_GUILD_ID
const token: string = process.env.DISCORD_TOKEN

const commands = [
  new SlashCommandBuilder().setName('start').setDescription('start facemelter'),
  new SlashCommandBuilder()
    .setName('register')
    .setDescription('register for facemelter')
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription('enter the your wallet address')
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('assetid')
        .setDescription('enter your randycones asset ID')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('setup-test')
    .setDescription('set up test users'),
].map((command) => command.toJSON())

const rest = new REST({ version: '9' }).setToken(token)

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error)
