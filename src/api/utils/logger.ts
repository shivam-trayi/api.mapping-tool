import winston, { format, transports, Logger } from 'winston';

const { combine, timestamp, printf, colorize } = format;

// Define a log format with proper typing
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Create logger instance
const logger: Logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize(), 
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
