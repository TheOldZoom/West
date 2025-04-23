// Client.ts
import "dotenv/config";
import {
  Client as ClientBase,
  GatewayIntentBits,
  DefaultWebSocketManagerOptions,
  Collection,
} from "discord.js";
import MissingEnvs from "../utils/helpers/MissingEnvs";
import Logger from "../utils/helpers/Logger";
import loadEvents from "../utils/handlers/Events";
import loadCommands from "../utils/handlers/Commands";
import { Command } from "./Command";
import { PrismaClient } from "../prisma/client";
import type { UserDB } from "./UserDB";

// @ts-ignore
DefaultWebSocketManagerOptions.identifyProperties.browser = "Discord Android";
const IsDev = process.env.NODE_ENV === "development";

class Client extends ClientBase {
  public log: Logger;
  public commands: Collection<string, Command>;
  public commandAliases: Collection<string, string>;
  public prefix: string;
  public prisma: PrismaClient;
  public userDB: Collection<string, UserDB>;
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });
    this.log = new Logger({
      debug: IsDev,
    });
    this.token = IsDev
      ? (process.env.DEV_TOKEN as string)
      : (process.env.TOKEN as string);
    this.commands = new Collection<string, Command>();
    this.commandAliases = new Collection<string, string>();
    this.prefix = IsDev
      ? process.env.DEV_PREFIX || "w!"
      : process.env.PREFIX || "w.";

    this.prisma = new PrismaClient();
    this.userDB = new Collection<string, UserDB>();
  }

  async start() {
    const missingEnvs = await MissingEnvs([
      "TOKEN",
      "DEV_TOKEN",
      "DATABASE_URL",
    ]);
    if (missingEnvs.length > 0) {
      console.error(`Missing envs: ${missingEnvs.join(", ")}`);
      process.exit(1);
    }
    await loadCommands(this);
    await loadEvents(this);

    await this.login(this.token as string);
  }
}

export { Event } from "./Event";
export default Client;
