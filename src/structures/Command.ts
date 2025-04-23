import { Message, Collection } from "discord.js";
import Client from "./Client";

interface SubcommandOptions {
  name: string;
  description: string;
  aliases?: string[];
  usage?: string;
  execute: (message: Message, args: string[], client: Client) => void;
}

class Subcommand {
  public name: string;
  public description: string;
  public aliases: string[];
  public usage?: string;
  public execute: (message: Message, args: string[], client: Client) => void;

  constructor(options: SubcommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.aliases = options.aliases || [];
    this.usage = options.usage || "";
    this.execute = options.execute;
  }
}

interface CommandOptions {
  name: string;
  description: string;
  aliases?: string[];
  usage?: string;
  cooldown?: number;
  category?: string;
  subcommands?: Subcommand[];
  execute?: (message: Message, args: string[], client: Client) => void;
}

class Command {
  public name: string;
  public description: string;
  public aliases: string[];
  public usage: string;
  public cooldown: number;
  public category: string;
  public subcommands: Collection<string, Subcommand>;
  public execute?: (message: Message, args: string[], client: Client) => void;

  constructor(options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.aliases = options.aliases || [];
    this.usage = options.usage || "";
    this.cooldown = options.cooldown || 3;
    this.category = options.category || "Uncategorized";
    this.execute = options.execute;

    this.subcommands = new Collection<string, Subcommand>();

    if (options.subcommands) {
      for (const subcommand of options.subcommands) {
        this.registerSubcommand(subcommand);
      }
    }
  }

  public registerSubcommand(subcommand: Subcommand | SubcommandOptions): void {
    const sub =
      subcommand instanceof Subcommand
        ? subcommand
        : new Subcommand(subcommand);
    this.subcommands.set(sub.name, sub);

    for (const alias of sub.aliases) {
      this.subcommands.set(alias, sub);
    }
  }

  public async run(message: Message, args: string[], client: Client) {
    client.log.info(
      `${message.author.tag} (${message.author.id})${
        message.inGuild()
          ? ` on ${message.guild?.name} (${message.guild?.id})`
          : ""
      } used command: ${message.content}`
    );

    const subcommandName = args[0]?.toLowerCase();

    if (subcommandName && this.subcommands.size > 0) {
      const subcommand = this.subcommands.get(subcommandName);

      if (subcommand) {
        const subArgs = args.slice(1);
        return await subcommand.execute(message, subArgs, client);
      }
    }

    if (this.execute) {
      return await this.execute(message, args, client);
    } else if (this.subcommands.size > 0) {
      return await this.showSubcommandHelp(message);
    } else {
      return await message.reply("This command is not properly configured.");
    }
  }

  private async showSubcommandHelp(message: Message): Promise<void> {
    const uniqueSubcommands = [...new Set(this.subcommands.values())];

    let helpText = `**${this.name} Command Help**\n${this.description}\n\n**Subcommands:**\n`;

    for (const subcommand of uniqueSubcommands) {
      const aliasText =
        subcommand.aliases.length > 0
          ? ` (aliases: ${subcommand.aliases.join(", ")})`
          : "";
      helpText += `• **${subcommand.name}**${aliasText}: ${subcommand.description}\n`;
      if (subcommand.usage) {
        helpText += `  Usage: ${subcommand.usage}\n`;
      }
    }

    await message.reply(helpText);
  }
}

export { Command, Subcommand };
export type { CommandOptions, SubcommandOptions };
