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
  }

  private log(level: string, consoleFn: (...args: any[]) => void, ...args: any[]) {
    if (this.minLevel > logLevels.indexOf(level)) return;
    consoleFn(`${level}: [Bucketeer]`, ...args);
  }

  error(...args: any[]): void {
    this.log(ERROR, console.error, ...args);
  }
  warn(...args: any[]): void {
    this.log(WARN, console.warn, ...args);
  }
  info(...args: any[]): void {
    this.log(INFO, console.info, ...args);
  }
  debug(...args: any[]): void {
    this.log(DEBUG, console.debug, ...args);
  }
}