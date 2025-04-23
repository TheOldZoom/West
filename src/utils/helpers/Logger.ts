import chalk from "chalk";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface ILogger {
  debug: boolean;
  context?: string;
}

class Logger {
  private debugEnabled: boolean;
  private context?: string;

  constructor(options: ILogger) {
    this.debugEnabled = options.debug;
    this.context = options.context;
  }

  private getTime(): string {
    return new Date().toLocaleString();
  }

  private formatMessage(level: LogLevel, args: any[]): string {
    const time = chalk.gray(`[${this.getTime()}]`);
    const context = this.context ? chalk.magenta(`[${this.context}]`) : "";
    const label = this.getLabel(level);
    const message = args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
      )
      .join(" ");
    return `${time} ${label} ${context} ${chalk.white(message)}`;
  }

  private getLabel(level: LogLevel): string {
    const labels = {
      debug: chalk.bgGray.black(" DEBUG  "), // 8 characters
      info: chalk.bgBlue.white(" INFO   "), // 8 characters
      warn: chalk.bgYellow.black(" WARN   "), // 8 characters
      error: chalk.bgRed.white(" ERROR  "), // 8 characters
    };
    return labels[level];
  }

  debug(...args: any[]): void {
    if (!this.debugEnabled) return;
    console.debug(this.formatMessage("debug", args));
  }

  info(...args: any[]): void {
    console.info(this.formatMessage("info", args));
  }

  warn(...args: any[]): void {
    console.warn(this.formatMessage("warn", args));
  }

  error(...args: any[]): void {
    console.error(this.formatMessage("error", args));
  }

  setDebug(debug: boolean): void {
    this.debugEnabled = debug;
  }

  setContext(context: string): void {
    this.context = context;
  }
}

export default Logger;
