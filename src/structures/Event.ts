import type { ClientEvents } from "discord.js";
import type Client from "./Client";

export interface IEvent<K extends keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute: (client: Client, ...args: ClientEvents[K]) => void | void;
}

export class Event<K extends keyof ClientEvents> implements IEvent<K> {
  constructor(
    public name: K,
    public execute: (client: Client, ...args: ClientEvents[K]) => void | void,
    public once: boolean = false
  ) {}
}
