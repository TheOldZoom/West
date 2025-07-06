import {
  Client as DiscordClient,
  GatewayIntentBits,
  Collection,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import { glob } from "glob";
import logger from "../utils/logger";
import type { EventClass } from "./Event";
import type { CommandClass } from "./Command";

const isDev = process.env.NODE_ENV === "development";
const token = isDev ? process.env.DEV_TOKEN : process.env.TOKEN;

export class Client extends DiscordClient {
  public commands = new Collection<string, CommandClass>();
  public subcommands = new Collection<
    string,
    { command: CommandClass; subcommand: string }
  >();

  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });
  }

  async loadEvents() {
    logger.info("Loading events...");
    const eventFiles = await glob("src/events/*.ts", { cwd: process.cwd() });
    logger.debug(`Found ${eventFiles.length} event files`);

    for (const file of eventFiles) {
      try {
        const eventClass = (await import(`file://${process.cwd()}/${file}`))
          .default as new (client: Client) => EventClass;
        const eventInstance = new eventClass(this);
        eventInstance.register();

        logger.debug(`Loaded event: ${eventInstance.name}`);
      } catch (error) {
        logger.error(`Failed to load event ${file}:`, error);
      }
    }
    logger.info(`Successfully loaded ${eventFiles.length} events`);
  }

  async loadCommands() {
    logger.info("Loading commands...");
    const commandFiles = await glob("src/commands/**/*.ts", {
      cwd: process.cwd(),
    });
    logger.debug(`Found ${commandFiles.length} command files`);

    for (const file of commandFiles) {
      try {
        const commandClass = (await import(`file://${process.cwd()}/${file}`))
          .default as new (client: Client) => CommandClass;
        const commandInstance = new commandClass(this);
        this.commands.set(commandInstance.data.name, commandInstance);

        const commandJson = commandInstance.data.toJSON();
        if (commandJson.options && commandJson.options.length > 0) {
          for (const option of commandJson.options) {
            if (option.type === 1) {
              const subcommandKey = `${commandInstance.data.name}_${option.name}`;
              this.subcommands.set(subcommandKey, {
                command: commandInstance,
                subcommand: option.name,
              });
              logger.debug(`Loaded subcommand: ${subcommandKey}`);
            }
          }
        }

        logger.debug(`Loaded command: ${commandInstance.data.name}`);
      } catch (error) {
        logger.error(`Failed to load command ${file}:`, error);
      }
    }

    logger.info(
      `Successfully loaded ${this.commands.size} commands with ${this.subcommands.size} subcommands`
    );
  }

  async registerCommands() {
    logger.info("Registering commands with Discord...");

    try {
      const commandData = Array.from(this.commands.values())
        .map((cmd: CommandClass) => cmd.data.toJSON())
        .map((cmd) => ({
          ...cmd,
          contexts: [
            InteractionContextType.BotDM,
            InteractionContextType.Guild,
          ],
          integrationTypes: [
            ApplicationIntegrationType.GuildInstall,
            ApplicationIntegrationType.UserInstall,
          ],
        }));

      if (isDev) {
        const guildId = process.env.DEV_GUILD_ID;
        if (!guildId) {
          logger.warn(
            "DEV_GUILD_ID not set, skipping guild command registration"
          );
          return;
        }

        await this.application?.commands.set(commandData, guildId);
        logger.info(
          `Registered ${commandData.length} commands to guild ${guildId}`
        );
      } else {
        await this.application?.commands.set(commandData);
        logger.info(`Registered ${commandData.length} commands globally`);
      }
    } catch (error) {
      logger.error("Failed to register commands:", error);
    }
  }

  async login(): Promise<string> {
    await this.loadEvents();
    await this.loadCommands();
    await super.login(token);
    return (await this.registerCommands()) as unknown as string;
  }
}

export const client = new Client();
