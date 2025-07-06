import {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  AutocompleteInteraction,
} from "discord.js";
import type {
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandOptionsOnlyBuilder,
  PermissionResolvable,
} from "discord.js";

export interface CommandClass {
  readonly data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  readonly permissions?: PermissionResolvable[];
  readonly client: Client;
  execute(interaction: ChatInputCommandInteraction): Promise<void> | void;
  autocomplete?(interaction: AutocompleteInteraction): Promise<void> | void;
}

export function Command(
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void,
  options?: {
    permissions?: PermissionResolvable[];
    autocomplete?: (
      interaction: AutocompleteInteraction
    ) => Promise<void> | void;
  }
): new (client: Client) => CommandClass {
  const permissions = options?.permissions;
  const autocompleteFunction = options?.autocomplete;

  return class CommandClass implements CommandClass {
    public readonly data: typeof data;
    public readonly permissions?: PermissionResolvable[];
    public readonly client: Client;
    private readonly executeFunction: typeof execute;
    private readonly autocompleteFunction?: typeof autocompleteFunction;

    constructor(client: Client) {
      this.client = client;
      this.data = data;
      this.permissions = permissions;
      this.executeFunction = execute;
      this.autocompleteFunction = autocompleteFunction;
    }

    public execute(
      interaction: ChatInputCommandInteraction
    ): Promise<void> | void {
      return this.executeFunction(interaction);
    }

    public autocomplete(
      interaction: AutocompleteInteraction
    ): Promise<void> | void {
      if (this.autocompleteFunction) {
        return this.autocompleteFunction(interaction);
      }
    }
  };
}

export function Subcommand(
  data: SlashCommandSubcommandBuilder,
  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void,
  options?: {
    autocomplete?: (
      interaction: AutocompleteInteraction
    ) => Promise<void> | void;
  }
) {
  return {
    data,
    execute,
    autocomplete: options?.autocomplete,
  };
}

export function CommandWithSubcommands<
  T extends Record<string, ReturnType<typeof Subcommand>>
>(
  data: SlashCommandBuilder,
  subcommands: T,
  options?: {
    permissions?: PermissionResolvable[];
  }
): new (client: Client) => CommandClass {
  Object.values(subcommands).forEach((subcommand) => {
    data.addSubcommand(subcommand.data);
  });

  return Command(
    data,
    async (interaction) => {
      const subcommandName = interaction.options.getSubcommand();
      const subcommand = subcommands[subcommandName as keyof T];

      if (subcommand) {
        await subcommand.execute(interaction);
      } else {
        await interaction.reply("Unknown subcommand!");
      }
    },
    options
  );
}
