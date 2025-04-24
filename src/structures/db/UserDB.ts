import type { Prisma } from "../../prisma/client";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();

export interface DatabaseUser {
  id: string;
  username: string;
  avatar: string | null;
  prefix: string | null;
  lastfm: string | null;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
  blacklistAt: Date | null;
}

export class UserDB {
  public id: string;
  public username: string;
  public avatar: string;
  public prefix: string;
  public lastfm: string;
  public locale: string;
  public createdAt: Date;
  public updatedAt: Date;
  public blacklistAt: Date | null;

  constructor(data: DatabaseUser) {
    this.id = data.id;
    this.username = data.username;
    this.avatar = data.avatar ?? "";
    this.prefix = data.prefix ?? "";
    this.lastfm = data.lastfm ?? "";
    this.locale = data.locale ?? "";
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.blacklistAt = data.blacklistAt;
  }
}
