import dotenv from "dotenv"
dotenv.config()
import { SlashCommandBuilder } from "@discordjs/builders"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"

const clientId = process.env.DISCORD_CLIENT_ID
const guildId = process.env.DISCORD_GUILD_ID
const token = process.env.DISCORD_TOKEN

console.log("clientId", clientId)
console.log("guildId", guildId)
console.log("token", token)

const commands = [
  new SlashCommandBuilder().setName("start").setDescription("start facemelter"),
].map((command) => command.toJSON())

const rest = new REST({ version: "9" }).setToken(token)

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error)
