const { Client, GatewayIntentBits, Routes, Events } = require("discord.js");
const { submitEoa } = require("./commands/submitEoa");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} = require("firebase/firestore/lite");
const { REST } = require("@discordjs/rest");
require("dotenv").config();

const firebaseConfig = {
  apiKey: "AIzaSyB2_cgJEE8c0Y97WVkZ1s9HlZtuBeM_toM",
  authDomain: "moderator-bot-b3b16.firebaseapp.com",
  projectId: "moderator-bot-b3b16",
  storageBucket: "moderator-bot-b3b16.appspot.com",
  messagingSenderId: "563196022245",
  appId: "1:563196022245:web:7f2585ed52850c156af30c",
};

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

const { GuildMembers, GuildMessages, Guilds, MessageContent } =
  GatewayIntentBits;

const client = new Client({
  intents: [GuildMembers, GuildMessages, Guilds, MessageContent],
});

// initializations
client.login(BOT_TOKEN);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// server functions

function getUserFromEoa() {
  //
}

async function saveUserIdAndEoa(userId, userEoa) {
  try {

    await setDoc(doc(db, "eoamapping", userId), {
      userEOA: userEoa,
    });
  } catch (err) {
    console.log(err);
  }
}

// bot client functions
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.content === "Moye") {
    message.channel.send("Moye :(");
  }
});

client.on("interactionCreate", (interaction) => {
  if (interaction.commandName === "eoa") {
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("eoa") || null;
    if (!reason) return;
    try {
      saveUserIdAndEoa(interaction.user.id, reason);
      interaction.reply("EOA registered");
    } catch (err) {
      console.log(err);
    }
  }
});

// bot slash command init
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
