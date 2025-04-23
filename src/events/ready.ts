import type Client from "../structures/Client";
import { Event } from "../structures/Event";
import { UserDB } from "../structures/UserDB";
import { GuildDB, GuildPrefixDB, GuildUserDB } from "../structures/GuildDB";

export default new Event(
  "ready",
  async (client: Client) => {
    client.log.info(`Logged in as ${client.user?.tag}`);
    await ready(client);
  },
  true
);

async function ready(client: Client) {
  const users = await client.prisma.user.findMany();
  for (const user of users) {
    client.log.debug(`Loading user ${user.username} (${user.id})`, user);
    client.db.users.set(user.id, new UserDB(user));
  }
  client.log.info(`Loaded ${client.db.users.size} users`);

  for (const [id, discordGuild] of client.guilds.cache) {
    let guild = await client.prisma.guild.findUnique({
      where: { id },
      include: {
        GuildUser: true,
        GuildPrefix: true,
      },
    });

    const discordData = {
      name: discordGuild.name,
      icon: discordGuild.icon ?? undefined,
    };

    if (!guild) {
      guild = await client.prisma.guild.create({
        data: {
          id,
          ...discordData,
        },
        include: {
          GuildUser: true,
          GuildPrefix: true,
        },
      });
      client.log.info(`Created guild entry for ${discordGuild.name} (${id})`);
    } else {
      const updateData: Partial<typeof discordData> = {};
      for (const key of Object.keys(
        discordData
      ) as (keyof typeof discordData)[]) {
        if (guild[key] !== discordData[key]) {
          updateData[key] = discordData[key];
        }
      }

      if (Object.keys(updateData).length > 0) {
        guild = await client.prisma.guild.update({
          where: { id },
          data: updateData,
          include: {
            GuildUser: true,
            GuildPrefix: true,
          },
        });
        client.log.info(`Updated guild entry for ${discordGuild.name} (${id})`);
      } else {
        client.log.debug(`Guild ${guild.name} (${guild.id}) is up to date`);
      }
    }

    const guildUserDBs = guild.GuildUser.map((user) => new GuildUserDB(user));
    const guildPrefixDBs = guild.GuildPrefix.map(
      (prefix) => new GuildPrefixDB(prefix)
    );

    const guildDB = new GuildDB(
      {
        id: guild.id,
        name: guild.name,
        icon: guild.icon ?? null,
        createdAt: guild.createdAt,
        updatedAt: guild.updatedAt,
        seenAt: guild.seenAt ?? null,
        blacklistAt: guild.blacklistAt ?? null,
      },
      guildUserDBs,
      guildPrefixDBs
    );

    client.db.guilds.set(guild.id, guildDB);
  }

  const cachedGuildIds = new Set(client.guilds.cache.keys());
  const guildsInDb = await client.prisma.guild.findMany();

  for (const guild of guildsInDb) {
    if (!cachedGuildIds.has(guild.id)) {
      await client.prisma.guild.update({
        where: { id: guild.id },
        data: { seenAt: new Date() },
      });
      client.log.info(`Updated 'seenAt' for guild ${guild.name} (${guild.id})`);
    }
  }

  client.log.info(`Loaded ${client.db.guilds.size} guilds`);
}
