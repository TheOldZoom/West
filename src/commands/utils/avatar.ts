import {
  SlashCommandBuilder,
  TextDisplayBuilder,
  MessageFlags,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { Command } from "../../classes/Command";

export default Command(
  new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get the avatar of a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get the avatar of")
        .setRequired(false)
    ),
  async (interaction) => {
    const user = interaction.options.getUser("user") || interaction.user;
    const avatarUrl = user.displayAvatarURL({ size: 4096 });
    const isAnimated = user.avatar?.startsWith("a_");
    const components = [
      new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`${user.displayName}'s avatar`)
        )
        .addMediaGalleryComponents(
          new MediaGalleryBuilder().addItems([
            new MediaGalleryItemBuilder().setURL(avatarUrl),
          ])
        )
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addActionRowComponents(
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            ...(isAnimated
              ? [
                  new ButtonBuilder()
                    .setURL(
                      user.displayAvatarURL({ size: 4096, extension: "gif" })
                    )
                    .setStyle(ButtonStyle.Link)
                    .setLabel("GIF"),
                ]
              : []),
            new ButtonBuilder()
              .setURL(user.displayAvatarURL({ size: 4096, extension: "png" }))
              .setStyle(ButtonStyle.Link)
              .setLabel("PNG"),
            new ButtonBuilder()
              .setURL(user.displayAvatarURL({ size: 4096, extension: "webp" }))
              .setStyle(ButtonStyle.Link)
              .setLabel("WebP"),
            new ButtonBuilder()
              .setURL(user.displayAvatarURL({ size: 4096, extension: "jpg" }))
              .setStyle(ButtonStyle.Link)
              .setLabel("JPG")
          )
        ),
    ];
    await interaction.reply({
      components,
      flags: MessageFlags.IsComponentsV2,
    });
  }
);
