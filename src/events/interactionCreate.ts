import { Events } from "discord.js";
import { Event } from "../classes/Event";
import logger from "../utils/logger";
import type { CommandClass } from "../classes/Command";

export default Event(Events.InteractionCreate, async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const commandName = interaction.commandName;
  const subcommandName = interaction.options.getSubcommand(false);

  let command = client.commands.get(commandName) as CommandClass;
  let isSubcommand = false;

  if (subcommandName) {
    const subcommandKey = `${commandName}_${subcommandName}`;
    const subcommandData = client.subcommands.get(subcommandKey);

    if (subcommandData) {
      command = subcommandData.command;
      isSubcommand = true;
    }
  }

  if (!command) return;

  logger.info(
    `${interaction.user.username} (${interaction.user.id}) used ${
      interaction.commandName
    }${subcommandName ? ` ${subcommandName}` : ""} ${
      interaction.inGuild()
        ? `in ${interaction.guild?.name} (${interaction.guild?.id})`
        : "in DM"
    }`
  );

  await command.execute(interaction);
});
