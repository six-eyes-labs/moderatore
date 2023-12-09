require("dotenv").config();

const { Client, GatewayIntentBits, Routes, Events } = require("discord.js");
const { submitEoa } = require("./commands/submitEoa");
const express = require("express");
const { ethers } = require("ethers");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
} = require("firebase/firestore/lite");
const { REST } = require("@discordjs/rest");
const { moderatorAbi, moderatorAddress } = require("./utils/moderatorAbi");
const { getProvider } = require("./utils/getProvider");
const { generateFunction } = require("./utils/actions");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
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

const {
  GuildMembers,
  GuildMessages,
  Guilds,
  MessageContent,
  GuildModeration,
  AutoModerationExecution,
} = GatewayIntentBits;

const client = new Client({
  intents: [
    GuildMembers,
    GuildMessages,
    Guilds,
    MessageContent,
    GuildModeration,
    AutoModerationExecution,
  ],
});

// initializations
client.login(BOT_TOKEN);
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const expressApp = express();
const provider = getProvider();
const contract = new ethers.Contract(moderatorAddress, moderatorAbi, provider);

let rules = null;

// contract functions
contract.getRules(GUILD_ID).then((res) => {
  rules = res.map((item) => {
    return {
      func: item[item.length - 1],
      reason: item[item.length - 2],
    };
  });
});

contract.on("RuleAdded", (event) => {
  console.log({ event });
});

contract.on("RuleProposed", (event) => {
  console.log({ event });
});

contract.on("RuleRemoved", (event) => {
  console.log({ event });
});

// server functions
async function canUserVoteFromEoa(eoa) {
  const eoaMappingRef = collection(db, "eoamapping");
  const que = query(eoaMappingRef, where("userEOA", "==", eoa));
  const querySnapshot = await getDocs(que);
  let docArray = [];
  querySnapshot.forEach((doc) => {
    docArray.push(doc.data());
  });
  if (docArray.length === 0) {
    return false;
  }
  const userId = docArray[0].discordId;
  const canVote = isUserHavingVotingRole(userId, GUILD_ID);
  return canVote;
}

async function isUserHavingVotingRole(userId, guildId) {
  try {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    const isAdmin = member.roles.cache.some((role) => role.name === "voter");
    return isAdmin;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

async function saveUserIdAndEoa(userId, userEoa) {
  try {
    await setDoc(doc(db, "eoamapping", userId), {
      userEOA: userEoa,
      discordId: userId,
    });
  } catch (err) {
    console.log(err);
  }
}

// server
expressApp.get("/api/canUserVoteFromEoa/:eoa", (req, res) => {
  const eoa = req.params.eoa.toLocaleLowerCase();
  canUserVoteFromEoa(eoa).then((response) => {
    console.log(response, eoa);
    res.json({ eligible: response ? 1 : 0 });
  });
});

// bot client functions
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", (message) => {
  const funtionToRunEveryMessage = async () => {
    // if (message.content === "ban") {
    const guild = message.guild;
    const user = message.author;
    //   // Ban the user with a reason
    //   try {
    //     await user.send("u banned");
    //     await guild.members.ban(user, { reason: "User sent 'Moye'" });
    //     console.log(`Banned user: ${user.tag}`);
    //     // After 30 seconds, unban the user
    //     setTimeout(async () => {
    //       try {
    //         await guild.members.unban(user, "Unbanned after 30 seconds");
    //         console.log(`Unbanned user: ${user.tag}`);
    //       } catch (error) {
    //         console.error("Error unbanning user:", error);
    //       }
    //     }, 30000);
    //   } catch (error) {
    //     console.error("Error banning user:", error);
    //   }
    // }

    let shouldBanned = false;
    if (!rules) return;

    // rules.forEach((rule) => {
    for (const rule of rules) {
      shouldBanned = generateFunction(rule.func)(message);
      if (shouldBanned) {
        await user.send("u banned");
        await user.send("https://tenor.com/pcHIYYcnO2.gif");
        await guild.members.ban(user, { reason: "User sent 'Moye'" });
        console.log(`Banned user: ${user.tag}`);
        console.log("shoud be banned");
        return;
        // ban user , return
      }
    }

    // });
  };
  funtionToRunEveryMessage();
});

client.on("interactionCreate", (interaction) => {
  if (interaction.commandName === "eoa") {
    const target = interaction.options.getUser("target");
    const eoa = interaction.options.getString("eoa") || null;
    if (!reason) return;
    try {
      saveUserIdAndEoa(interaction.user.id, eoa.toLocaleLowerCase());
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

//port
const PORT = process.env.PORT || 3000;

expressApp.listen(PORT, console.log(`Server started on port ${PORT}`));
