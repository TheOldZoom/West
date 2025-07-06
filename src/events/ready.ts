import { Events, Client } from "discord.js";
import { Event } from "../classes/Event";
import logger from "../utils/logger";

export default Event(Events.ClientReady, (client: Client) => {
  logger.info(`Logged in successfully as ${client.user?.tag}`);
  logger.info(`Serving ${client.guilds.cache.size} guilds`);
});
