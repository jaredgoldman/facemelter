// Require the necessary discord.js classes
import { Client, Intents } from "discord.js"
import { playRound } from "./controller"
const token: string = process.env.DISCORD_TOKEN

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS],
})

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Melter ready!")
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return

  const { commandName } = interaction
  if (commandName === "start") {
    playRound()
  }

  interaction.reply({
    content: "Game started",
    ephemeral: true,
  })
})
// Login to Discord with your client's token
client.login(token)
