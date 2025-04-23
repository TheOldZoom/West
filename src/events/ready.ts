import type Client from "../structures/Client";
import { Event } from "../structures/Event";
import { UserDB } from "../structures/UserDB";

export default new Event(
  `ready`,
  async (client) => {
    client.log.info(`Logged in as ${client.user?.tag}`);
    await ready(client);
  },
  true
);

async function ready(client: Client) {
  const users = await client.prisma.user.findMany();

  for (const user of users) {
    client.log.debug(`Loading user ${user.username} (${user.id})`, user);
    client.userDB.set(user.id, new UserDB(user));
  }
  console.log(client.userDB);
  client.log.info(`Loaded ${client.userDB.size} users`);
}
