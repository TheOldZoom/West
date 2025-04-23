import { readdirSync, statSync } from "fs";
import { join, extname } from "path";
import Client from "../../structures/Client";
import { Command } from "../../structures/Command";

function getAllCommandFiles(dir: string): string[] {
  let results: string[] = [];

  for (const item of readdirSync(dir)) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllCommandFiles(fullPath));
    } else if ([".ts", ".js"].includes(extname(fullPath))) {
      results.push(fullPath);
    }
  }

  return results;
}

export default async function loadCommands(client: Client) {
  try {
    const commandsPath = join(__dirname, "../../commands");
    const commandFiles = getAllCommandFiles(commandsPath);

    for (const commandPath of commandFiles) {
      try {
        const { default: CommandFile } = await import(commandPath);

        const command: Command =
          CommandFile instanceof Command
            ? CommandFile
            : new Command(CommandFile);

        client.commands.set(command.name, command);

        for (const alias of command.aliases) {
          client.commandAliases.set(alias, command.name);
        }

        client.log.info(`COMMAND ${command.name}`);
      } catch (error) {
        client.log.error(`Failed to load command at ${commandPath}: ${error}`);
      }
    }

    client.log.info(`Loaded ${client.commands.size} commands`);
  } catch (error) {
    client.log.error(`Error loading commands: ${error}`);
  }
}
