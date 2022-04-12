declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string
      DISCORD_TOKEN: string
      DISCORD_CLIENT_ID: string
      DISCORD_GUILD_ID: string
    }
  }
}

export {}
