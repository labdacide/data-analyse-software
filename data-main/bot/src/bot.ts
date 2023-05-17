import { Client } from "discord.js";
import { config } from "dotenv";
import listeners from "./listeners";

config();

const client = new Client({
  intents: [],
});
listeners(client);
client.login(process.env.DISCORD_TOKEN);
