import { ActivityType } from "discord.js";
import Logger from "../../utils/helpers/Logger";

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

  public static isValidType(type: unknown): type is ActivityType {
    const numeric = Number(type);
    return Object.values(ActivityType).includes(numeric);
  }

  public static check(presence: DatabasePresence): boolean {
    if (!this.isValidType(presence.type)) {
      new Logger({ debug: false }).warn(
        `Invalid activity type for presence ${presence.id}: ${presence.type}`
      );
      return false;
    }
    return true;
  }
}
