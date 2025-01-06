import { DefaultLogger, Logger } from './logger';

export interface Config {
  /**
   * API request destination. If you don't know what it should be, ask Bucketeer team.
   */
  host: string;
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

  /**
  * Evaluate the end user locally in the SDK instead of on the server.
  * Note: To evaluate the user locally, you must create an API key and select the server-side role.
  */
  enableLocalEvaluation?: boolean;

  /**
   * Sets the polling interval for cache updating. Default: 1 min - specify in milliseconds.
   */
  cachePollingInterval?: number;
}

export const defaultConfig = {
  host: '',
  port: '443',
  token: '',
  tag: '',
  pollingIntervalForRegisterEvents: 1 * 60 * 1000,
  logger: new DefaultLogger(),

  enableLocalEvaluation: false,
  cachePollingInterval: 1 * 60 * 1000,
};

export const defineBKTConfig = (config: Config): Config => {
  return {
    ...defaultConfig,
    ...config,
  };
}