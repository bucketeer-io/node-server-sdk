import { format } from 'util';

export interface Logger {
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
}

const DEBUG = 'debug';
const INFO = 'info';
const WARN = 'warn';
const ERROR = 'error';
const NONE = 'none';

const logLevels = [DEBUG, INFO, WARN, ERROR, NONE];

/**
 * A default logger that writes to stderr.
 */
export class DefaultLogger implements Logger {
  prefix: string;
  minLevel: number;

  /**
   * Initializes DefaultLogger.
   *
   * @param logLevel - The log level. It can be either 'debug', 'info', 'error', or 'none'.
   * @constructor
   */
  constructor(logLevel?: string) {
    this.minLevel = 1;
    for (let i = 0; i < logLevels.length; i++) {
      if (logLevels[i] === logLevel) {
        this.minLevel = i;
        break;
      }
    }
    this.prefix = logLevel + ': [Bucketeer] ';
  }

  error(...args: any[]): void {
    this.write(args, ERROR);
  }
  warn(...args: any[]): void {
    this.write(args, WARN);
  }
  info(...args: any[]): void {
    this.write(args, INFO);
  }
  debug(...args: any[]): void {
    this.write(args, DEBUG);
  }

  write(args: any[], logLevel: typeof logLevels[number]): void {
    if (this.minLevel > logLevels.indexOf(logLevel)) {
      return;
    }
    if (args.length === 1) {
      return;
    }
    args[0] = this.prefix + args[0];
    console.error(format(...args));
  }
}
