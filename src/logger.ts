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
type ConsoleMethod = typeof console.error;

const logLevelIndices: Record<string, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4,
};

/**
 * A default logger that writes to stderr.
 */
export class DefaultLogger implements Logger {
  minLevel: number;

  /**
   * Initializes DefaultLogger.
   *
   * @param logLevel - The log level. It can be either 'debug', 'info', 'error', or 'none'.
   * @constructor
   */
  constructor(logLevel?: string) {
    this.minLevel = 1;
    if (logLevel && logLevel in logLevelIndices) {
      this.minLevel = logLevelIndices[logLevel];
    }
  }

  private log(level: string, consoleFn: ConsoleMethod, ...args: any[]) {
    if (this.minLevel > logLevelIndices[level]) return;
    consoleFn(`${level}: [Bucketeer]`, ...args);
  }

  error(...args: any[]): void {
    this.log('error', console.error, ...args);
  }
  warn(...args: any[]): void {
    this.log('warn', console.warn, ...args);
  }
  info(...args: any[]): void {
    this.log('info', console.info, ...args);
  }
  debug(...args: any[]): void {
    this.log('debug', console.debug, ...args);
  }
}