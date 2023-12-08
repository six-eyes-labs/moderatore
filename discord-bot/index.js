const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const token = process.env.BOT_TOKEN;
const { GuildMembers, GuildMessages, Guilds, MessageContent } =
  GatewayIntentBits;
const client = new Client({
  intents: [GuildMembers, GuildMessages, Guilds, MessageContent],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
