const { SlashCommandBuilder } = require("@discordjs/builders");

const submitEoa = new SlashCommandBuilder()
  .setName("eoa")
  .setDescription("set your Ethereum address")
  .addStringOption((option) =>
    option
      .setName("eoa")
      .setDescription("set your Ethereum address")
      .setRequired(true)
  );

exports.submitEoa = submitEoa.toJSON();
