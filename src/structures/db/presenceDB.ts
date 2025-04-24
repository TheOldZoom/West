import type { ActivityType } from "discord.js";

export interface DatabasePresence {
  id: string;
  content: string;
  type: ActivityType;
}

export class PresenceDB {
  public id: string;
  public content: string;
  public type: ActivityType;

  constructor(data: DatabasePresence) {
    this.id = data.id;
    this.content = data.content;
    this.type = data.type;
  }
}
