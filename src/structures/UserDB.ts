import type { Prisma } from "../prisma/client";
import { PrismaClient } from "../prisma/client";

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

  static async create(data: Prisma.UserCreateInput): Promise<UserDB> {
    const user = await prisma.user.create({
      data,
    });
    return new UserDB(user);
  }

  static async findById(id: string): Promise<UserDB | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? new UserDB(user) : null;
  }

  static async findOrCreate(
    id: string,
    defaultData: Omit<Prisma.UserCreateInput, "id">
  ): Promise<UserDB> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      return new UserDB(user);
    }

    const newUser = await prisma.user.create({
      data: {
        id,
        ...defaultData,
      },
    });

    return new UserDB(newUser);
  }
}
