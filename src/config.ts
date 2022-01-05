import { DefaultLogger, Logger } from './logger';

export interface Config {
  host: string;
  port?: string;
  token: string;
  tag: string;
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
