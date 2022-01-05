import { DefaultLogger, Logger } from './logger';

export interface Config {
  /**
   * API request destination. If you don't know what it should be, ask Bucketeer team.
   */
  host: string;
  /**
   * API request destination port. Usually you don't have to use this.
   */
  port?: string;
  /**
   * Optional property. Authentication token when requesting. You can copy from the admin console.
   */
  token: string;
  /**
   * Grouping set of feature flags.
   */
  tag: string;
  /**
   *  Optional property. Interval for registering track events in internal API. Specify in milliseconds.
   */
  pollingIntervalForRegisterEvents?: number;
  logger?: Logger;
}

export const defaultConfig = {
  host: '',
  port: '443',
  token: '',
  tag: '',
  pollingIntervalForRegisterEvents: 1 * 60 * 1000,
  logger: new DefaultLogger(),
};
