import type {
  Prisma,
  Guild as PrismaGuild,
  GuildUser as PrismaGuildUser,
  GuildPrefix as PrismaGuildPrefix,
} from "../prisma/client";
import { PrismaClient } from "../prisma/client";

const prisma = new PrismaClient();

export class GuildDB {
  public id: string;
  public name: string;
  public icon: string | null;
  public createdAt: Date;
  public updatedAt: Date;
  public seenAt: Date | null;
  public blacklistAt: Date | null;
  public guildUsers: GuildUserDB[];
  public guildPrefixes: GuildPrefixDB[];

  constructor(
    data: {
      id: string;
      name: string;
      icon: string | null;
      createdAt: Date;
      updatedAt: Date;
      seenAt: Date | null;
      blacklistAt: Date | null;
    },
    guildUsers: GuildUserDB[],
    guildPrefixes: GuildPrefixDB[]
  ) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.seenAt = data.seenAt;
    this.blacklistAt = data.blacklistAt;
    this.guildUsers = guildUsers;
    this.guildPrefixes = guildPrefixes;
  }
}

export class GuildUserDB {
  public id: string;
  public nickname: string | null;
  public guildId: string;
  public userId: string;
  public createdAt: Date;
  public updatedAt: Date;
  public bannedAt: Date | null;
  public isOwner: boolean;

  constructor(data: PrismaGuildUser) {
    this.id = data.id;
    this.nickname = data.nickname;
    this.guildId = data.guildId;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.bannedAt = data.bannedAt;
    this.isOwner = data.isOwner;
  }
}

export class GuildPrefixDB {
  public id: string;
  public guildId: string;
  public prefix: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: PrismaGuildPrefix) {
    this.id = data.id;
    this.guildId = data.guildId;
    this.prefix = data.prefix;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
