import { Message } from "discord.js";
import { Command } from "../../structures/Command";
import Client from "../../structures/Client";

export default new Command({
  name: "ping",
  description: "Check the bot's latency",
  aliases: ["p"],

  execute: async (message: Message, args: string[], client: Client) => {
    const reply = await message.reply("Pinging...");
    const latency = reply.createdTimestamp - message.createdTimestamp;

    await reply.edit(
      `Pong! Bot latency: ${latency}ms | API Latency: ${client.ws.ping}ms`
    );
  },

  subcommands: [
    {
      name: "detailed",
      description: "Get detailed ping information",
      aliases: ["d"],
      execute: async (message: Message, args: string[], client: Client) => {
        const startTime = Date.now();
        const msg = await message.reply("Calculating detailed ping...");
        const endTime = Date.now();

        const botLatency = endTime - startTime;
        const apiLatency = client.ws.ping;
        const roundTrip = msg.createdTimestamp - message.createdTimestamp;

        await msg.edit(
          `**Detailed Ping Information**\n` +
            `• **Bot Latency**: ${botLatency}ms\n` +
            `• **API Latency**: ${apiLatency}ms\n` +
            `• **Round Trip**: ${roundTrip}ms`
        );
      },
    },
  ],
});
