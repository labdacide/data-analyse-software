declare namespace NodeJS {
  interface ProcessEnv {
    readonly DISCORD_TOKEN: string;
    readonly CLIENT_ID: string;
    readonly CLIENT_SECRET: string;
    readonly API_URI: string;
  }
}
