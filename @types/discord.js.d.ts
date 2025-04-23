import { User } from "discord.js";

declare module "discord.js" {
  interface User {
    lastfm?: string | null;
  }
}
