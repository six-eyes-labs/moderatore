const { Client, GatewayIntentBits, Routes, Events } = require("discord.js");
const { submitEoa } = require("./commands/submitEoa");
const { REST } = require("@discordjs/rest");
require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

const { GuildMembers, GuildMessages, Guilds, MessageContent } =
  GatewayIntentBits;
const client = new Client({
  intents: [GuildMembers, GuildMessages, Guilds, MessageContent],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(BOT_TOKEN);

client.on("messageCreate", (message) => {
  if (message.content === "Moye") {
    message.channel.send("Moye :(");
  }
});  

client.on("interactionCreate", (interaction) => {
  if (interaction.commandName === "eoa") {
    interaction.reply("EOA registered");
  }
});

async function main() {
  const commands = [submitEoa];
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(BOT_TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();
