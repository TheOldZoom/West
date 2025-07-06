import winston from "winston";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");

const levels = {
  error: 0,
  alert: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const colors = {
  error: "red",
  alert: "magenta",
  warn: "yellow",
  info: "cyan",
  http: "magenta",
  debug: "gray",
};

winston.addColors(colors);

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

const maxLevelLength = Math.max(
  ...Object.keys(levels).map((lvl) => lvl.length)
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf((info: winston.Logform.TransformableInfo) => {
    const timestamp = `\x1b[90m${info.timestamp}\x1b[0m`;
    const level = info.level.toUpperCase().padEnd(maxLevelLength, " ");
    const message = info.message;

    let levelStyle = "";

    switch (info.level) {
      case "error":
        levelStyle = "\x1b[41m\x1b[37m";
        break;
      case "alert":
        levelStyle = "\x1b[45m\x1b[30;1m";
        break;
      case "warn":
        levelStyle = "\x1b[43m\x1b[30m";
        break;
      case "info":
        levelStyle = "\x1b[46m\x1b[30m";
        break;
      case "http":
        levelStyle = "\x1b[45m\x1b[37m";
        break;
      case "debug":
        levelStyle = "\x1b[100m\x1b[37m";
        break;
      default:
        levelStyle = "\x1b[47m\x1b[30m";
    }

    const styledLevel = `${levelStyle} ${level} \x1b[0m`;
    return `${timestamp} ${styledLevel} ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),

  new winston.transports.File({
    filename: path.join(logsDir, "error.log"),
    level: "error",
    format: fileFormat,
  }),

  new winston.transports.File({
    filename: path.join(logsDir, "alert.log"),
    level: "alert",
    format: fileFormat,
  }),

  new winston.transports.File({
    filename: path.join(logsDir, "warn.log"),
    level: "warn",
    format: fileFormat,
  }),

  new winston.transports.File({
    filename: path.join(logsDir, "info.log"),
    level: "info",
    format: fileFormat,
  }),

  new winston.transports.File({
    filename: path.join(logsDir, "http.log"),
    level: "http",
    format: fileFormat,
  }),

  new winston.transports.File({
    filename: path.join(logsDir, "debug.log"),
    level: "debug",
    format: fileFormat,
  }),

  new winston.transports.File({
    filename: path.join(logsDir, "combined.log"),
    format: fileFormat,
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

(logger as any).stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
