import {
  ContainerBuilder,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  TextDisplayBuilder,
} from "discord.js";
import { Command, Subcommand } from "../../classes/Command";

export default Command(
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async (interaction) => {
    const now = Date.now();
    await interaction.deferReply();

    const latency = Date.now() - now;
    await interaction.followUp({
      components: [
        new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `API Latency is **\`${latency}\`**ms\nWebsocket Latency is **\`${interaction.client.ws.ping}\`**ms`
          )
        ),
      ],
      flags: MessageFlags.IsComponentsV2,
    });
  }
);
