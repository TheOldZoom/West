import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { CommandWithSubcommands, Subcommand } from "../classes/Command";

export default CommandWithSubcommands(
  new SlashCommandBuilder()
    .setName("better-example")
    .setDescription("A better example command with subcommands"),
  {
    info: Subcommand(
      new SlashCommandSubcommandBuilder()
        .setName("info")
        .setDescription("Get information about something"),
      async (interaction) => {
        await interaction.reply("This is the info subcommand!");
      }
    ),

    status: Subcommand(
      new SlashCommandSubcommandBuilder()
        .setName("status")
        .setDescription("Check the status of something"),
      async (interaction) => {
        await interaction.reply("Status: All good!");
      }
    ),

    ping: Subcommand(
      new SlashCommandSubcommandBuilder()
        .setName("ping")
        .setDescription("Ping the bot"),
      async (interaction) => {
        await interaction.reply("Pong!");
      }
    ),
  }
);
