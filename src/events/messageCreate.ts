import { Event } from "../structures/Event";

export default new Event(
  `messageCreate`,
  async (client, message) => {
    if (message.author.bot) return;

    const user = client.db.users.get(message.author.id);

    const prefixes = [client.prefix];
    if (user?.prefix) {
      prefixes.push(user.prefix);
    }

    let usedPrefix = null;
    for (const prefix of prefixes) {
      if (message.content.startsWith(prefix)) {
        usedPrefix = prefix;
        break;
      }
    }

    if (!usedPrefix) return;

    const args = message.content.slice(usedPrefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command =
      client.commands.get(commandName) ||
      client.commands.get(client.commandAliases.get(commandName) || "");

    if (!command) return;

    try {
      await command.run(message, args, client);
    } catch (error) {
      client.log.error(`Error executing command ${commandName}: ${error}`);
      message.reply("There was an error executing that command!");
    }
  },
  false
);
