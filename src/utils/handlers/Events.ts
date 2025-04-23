// src/utils/handlers/EventHandler.ts
import fs from "fs";
import path from "path";
import Client from "../../structures/Client";
import { Event } from "../../structures/Event";

export default async function loadEvents(client: Client): Promise<void> {
  const eventsPath = path.join(__dirname, "../../events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of eventFiles) {
    try {
      const filePath = path.join(eventsPath, file);
      const event = (await import(filePath)).default;

      if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
      } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
      }

      client.log.info(`EVENT: ${event.name}`);
    } catch (error) {
      client.log.error(`Failed to load event from file ${file}`, error);
    }
  }

  client.log.info(`Loaded ${eventFiles.length} events`);
}
