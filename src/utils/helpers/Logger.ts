import chalk from "chalk";

export interface ILogger {
  debug: boolean;
}

class Logger {
  private colors = chalk;
  private Debug: boolean;

  constructor(options: ILogger) {
    this.Debug = options.debug;
  }

  private getTime(): string {
    const now = new Date();
    return now.toLocaleString();
  }

  debug(...args: any[]): void {
    if (!this.Debug) return;
    const message = args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg
      )
      .join(" ");
    console.log(
      `${this.colors.gray(`[${this.getTime()}]`)} ${this.colors.white(message)}`
    );
  }

  info(...args: any[]): void {
    const message = args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg
      )
      .join(" ");
    console.log(
      `${this.colors.blue(`[${this.getTime()}]`)} ${this.colors.white(message)}`
    );
  }

  warn(...args: any[]): void {
    const message = args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg
      )
      .join(" ");
    console.warn(
      `${this.colors.yellow(`[${this.getTime()}]`)} ${this.colors.white(
        message
      )}`
    );
  }

  error(...args: any[]): void {
    const message = args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg
      )
      .join(" ");
    console.error(
      `${this.colors.red(`[${this.getTime()}]`)} ${this.colors.white(message)}`
    );
  }

  setDebug(debug: boolean): void {
    this.Debug = debug;
  }
}

export default Logger;
